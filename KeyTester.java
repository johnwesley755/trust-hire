import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class KeyTester {
    public static void main(String[] args) {
        String secret = "Q7mV2f8YbKc6n4GxR1Pz9TqJ5sH3W8dL0uCkE2aB7yFvM6rN1tX4pS9ZgH5jU3w";
        byte[] bytes = secret.getBytes();
        SecretKeySpec key1 = new SecretKeySpec(bytes, "HmacSHA256");
        
        System.out.println("Secret length: " + secret.length());
        System.out.println("Bytes length: " + bytes.length);
        System.out.println("Algorithm: " + key1.getAlgorithm());
        System.out.println("Key format: " + key1.getFormat());
        String token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiRU1QTE9ZRVIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZW1haWwiOiJqb2hud2VzbGV5MTAyNEBnbWFpbC5jb20iLCJzdWIiOiI1MWI0ZTMyOC1mYmQyLTQwYmUtYWZjNi1jNGE2NGJmY2RlZDYiLCJpc3MiOiJ0cnVzdC1oaXJlLWF1dGgiLCJhdWQiOiJ0cnVzdC1oaXJlLXNlcnZpY2VzIiwiaWF0IjoxNzczNTg2NzUzLCJleHAiOjE3NzM2NzMxNTN9.-QEJlOZhk2qPyiMQ-KmgcIC5-UKC_6MTIK3sYGBU_ME";
        String[] parts = token.split("\\.");
        String data = parts[0] + "." + parts[1];
        String signature = parts[2];
        
        try {
            java.security.MessageDigest digest = java.security.MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(secret.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            System.out.println("Fingerprint (SHA-256): " + hexString.toString());

            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            mac.init(key1);
            byte[] hmac = mac.doFinal(data.getBytes());
            String expectedSignature = Base64.getUrlEncoder().withoutPadding().encodeToString(hmac);
            
            System.out.println("Expected Signature: " + expectedSignature);
            System.out.println("Actual Signature:   " + signature);
            System.out.println("Match: " + expectedSignature.equals(signature));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
