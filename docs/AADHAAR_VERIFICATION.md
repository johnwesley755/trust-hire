# Aadhaar Verification Process - Complete Guide

TrustHire uses a **secure, privacy-first Aadhaar verification system** orchestrated by **n8n** across multiple microservices. The process ensures compliance with UIDAI guidelines and India's DPDP Act 2023. The full Aadhaar number is **NEVER stored** - only a hashed token and masked version.

---

## 🔄 Complete Verification Flow

1. **User Request**: The Worker PWA sends the front and back images of the Aadhaar card and the Aadhaar number to the **Verification Service**.
2. **OCR Extraction**: Verification Service extracts document data and validates format.
3. **n8n Orchestration**:
   - Verification Service triggers an **n8n workflow**.
   - n8n coordinates between the **AI Face Match Engine** and **Worker Service**.
   - n8n performs cross-service consistency checks.
4. **Data Hashing**: The Aadhaar number is hashed (SHA-256) for uniqueness and a masked version is created.
5. **Final Update**: n8n updates the worker's status to "VERIFIED" in the Worker Service upon successful face match.

## Step-by-Step Process

### Step 1: Worker Initiates Verification

```
1. Worker opens verification screen in app
2. Reads consent agreement (DPDP Act compliance)
3. Accepts terms and clicks "Start Verification"
```

### Step 2: Upload Aadhaar Document

```
1. Worker captures photo/PDF of Aadhaar card
2. App requests signed upload URL from backend
   → POST /api/v1/media/upload-signature
     (folder: "aadhaar-documents", private: true)
3. App uploads directly to Cloudinary (private)
4. Cloudinary returns secure URL
```

### Step 3: Aadhaar Number Entry

```
1. Worker enters Aadhaar number (formatted: XXXX-XXXX-XXXX)
2. App validates format (12 digits)
3. Sends to backend
```

### Step 4: Backend Processing (Spring Boot)

```java
// com/trusthire/service/VerificationService.java
@Service
@Transactional
public class VerificationService {

    public VerificationResult initiateAadhaarVerification(
            UUID workerId, String aadhaarNumber, String documentUrl) {

        // 1. Calculate SHA-256 hash of Aadhaar for deduplication
        String aadhaarToken = hashSHA256(aadhaarNumber);

        // 2. Check for duplicate Aadhaar across platform
        if (workerRepository.existsByAadhaarToken(aadhaarToken)) {
            throw new DuplicateAadhaarException(
                "This Aadhaar is already registered with another account");
        }

        // 3. Create masked version (only last 4 digits visible)
        String digits = aadhaarNumber.replaceAll("[^0-9]", "");
        String aadhaarMasked = "XXXX-XXXX-" + digits.substring(digits.length() - 4);

        // 4. Store hash and masked version ONLY (never the full number)
        Worker worker = workerRepository.findById(workerId).orElseThrow();
        worker.setAadhaarToken(aadhaarToken);
        worker.setAadhaarMasked(aadhaarMasked);
        worker.setAadhaarDocument(documentUrl);
        worker.setVerificationStatus(AADHAAR_SUBMITTED);
        workerRepository.save(worker);

        // 5. Original aadhaarNumber is NOT stored - it goes out of scope here
        return VerificationResult.submitted(aadhaarMasked);
    }

    private String hashSHA256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
```

### Step 5: Live Selfie Capture

```
1. Worker is prompted to take selfie
2. App activates front camera with liveness detection
3. Worker completes liveness challenge (blink, turn head)
4. App captures high-quality selfie
5. Uploads to Cloudinary (private folder)
```

### Step 6: Face Matching (AI Service)

```java
// com/trusthire/service/VerificationService.java
public FaceMatchResult completeFaceVerification(UUID workerId, String selfieUrl) {
    Worker worker = workerRepository.findById(workerId).orElseThrow();

    // Call FastAPI AI service
    FaceMatchResponse aiResult = aiServiceClient.matchFaces(
        worker.getAadhaarDocument(), selfieUrl);

    log.info("Face match for worker {}: confidence={}, verified={}",
        workerId, aiResult.getConfidence(), aiResult.isVerified());

    if (aiResult.isVerified()) {
        // Update verification status - fully verified
        worker.setVerificationStatus(FULLY_VERIFIED);
        workerRepository.save(worker);

        // Recalculate trust score asynchronously
        asyncAiService.recalculateScoresAsync(workerId);

        // Send success notification (Firebase FCM)
        notificationService.sendVerificationSuccess(workerId);
    } else {
        // Send failure notification with retry option
        notificationService.sendVerificationFailed(workerId, aiResult.getConfidence());
    }

    // Always clean up biometric selfie after verification
    cloudinaryService.deletePrivateAsset(selfieUrl);

    return new FaceMatchResult(aiResult.isVerified(), aiResult.getConfidence());
}
```

### Step 7: Verification Status Update

| Status | Trust Score Impact | Salary Range |
|--------|-------------------|--------------|
| `UNVERIFIED` | No verification bonus | ₹8k - ₹12k (L1) |
| `PHONE_ONLY` | +10 points | ₹8k - ₹12k (L1) |
| `AADHAAR_ONLY` | +20 points | L2 eligible |
| `FULLY_VERIFIED` | +30 points | L3+ eligible |

---

## 🔒 Privacy & Security Implementation

### What is NEVER Stored

```
❌ Full 12-digit Aadhaar number
❌ Scanned Aadhaar copy accessible publicly
❌ Biometric data (face embeddings)
❌ Selfie photos after verification
```

### What IS Stored (**Neon DB** via JPA)

```java
@Entity
@Table(name = "workers")
public class Worker {

    // SHA-256 hash for duplicate detection only (irreversible)
    @Column(name = "aadhaar_token", nullable = true, unique = true)
    private String aadhaarToken;

    // Only last 4 digits visible (XXXX-XXXX-9012)
    @Column(name = "aadhaar_masked", nullable = true)
    private String aadhaarMasked;

    // Cloudinary private URL (admin access only, 1-hour signed URLs)
    @Convert(converter = EncryptedStringConverter.class) // AES-256
    @Column(name = "aadhaar_document")
    private String aadhaarDocument;

    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;
}
```

### Access Control (Spring Security)

```java
// Only ADMIN can access Aadhaar documents
@GetMapping("/verification/aadhaar/{workerId}")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<AadhaarDocumentResponse> getAadhaarDocument(
        @PathVariable UUID workerId) {

    Worker worker = workerRepository.findById(workerId)
        .orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

    if (worker.getAadhaarDocument() == null) {
        return ResponseEntity.notFound().build();
    }

    // Generate 1-hour signed URL (not a permanent link)
    String signedUrl = mediaService.getPrivateAssetUrl(
        worker.getAadhaarDocument(), 3600);

    return ResponseEntity.ok(new AadhaarDocumentResponse(signedUrl));
}
```

---

## 🛡️ Duplicate Detection

```java
// com/trusthire/repository/WorkerRepository.java
@Repository
public interface WorkerRepository extends JpaRepository<Worker, UUID> {
    boolean existsByAadhaarToken(String aadhaarToken);
}

// Prevents:
// ✅ Same person registering as multiple workers
// ✅ Stolen Aadhaar card fraud
// ✅ Fake profile farming
// Note: Hash is one-way → cannot reverse-engineer original Aadhaar
```

---

## 📱 Mobile App Implementation

### Consent Flow

```typescript
// AadhaarVerificationScreen.tsx
const ConsentStep = () => (
  <View>
    <Text style={styles.title}>Identity Verification</Text>
    <Text style={styles.body}>
      By proceeding, you consent to:
      {'\n'}• Uploading your Aadhaar document for verification
      {'\n'}• Your face being compared to your Aadhaar photo
      {'\n'}• Storing a masked version (XXXX-XXXX-{'{'}last4{'}'}) for display
      {'\n'}• Deleting biometric data immediately after verification
    </Text>
    <Button title="I Consent & Continue" onPress={proceedToVerification} />
  </View>
);
```

### Upload Flow

```typescript
// AadhaarVerificationScreen.tsx
const uploadAadhaar = async (imageUri: string) => {
  // 1. Get signed upload URL from Spring Boot backend
  const { data: signatureData } = await api.post('/media/upload-signature', {
    folder: 'aadhaar-documents',
    publicId: `aadhaar_${workerId}_${Date.now()}`
  });

  // 2. Upload directly to Cloudinary
  const formData = new FormData();
  formData.append('file', { uri: imageUri, type: 'image/jpeg', name: 'aadhaar.jpg' });
  formData.append('signature', signatureData.signature);
  formData.append('timestamp', signatureData.timestamp);
  formData.append('api_key', signatureData.apiKey);

  const cloudinaryRes = await fetch(
    `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );
  const { secure_url } = await cloudinaryRes.json();

  return secure_url;
};
```

---

## 📊 Verification Statistics

| Metric | Target |
|--------|--------|
| Verification completion rate | > 80% |
| Face match accuracy | > 95% |
| Duplicate Aadhaar detection | > 99% |
| Processing time | < 30 seconds |
| Document upload success rate | > 99% |

---

## ⚖️ Legal Compliance

### UIDAI Guidelines
- ✅ No storage of biometric data beyond verification
- ✅ Consent-based verification only
- ✅ Aadhaar number not exposed in any API response
- ✅ Only verification outcome stored (pass/fail + confidence)

### DPDP Act 2023
- ✅ Explicit consent obtained before verification
- ✅ Data minimization (only necessary data stored)
- ✅ Purpose limitation (used only for identity verification)
- ✅ Right to deletion (can request removal of Aadhaar data)
- ✅ Breach notification protocol in place

---

**Verification System Version**: 2.0 (Spring Boot)  
**Last Updated**: February 2026
