import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  Image, 
  StyleSheet 
} from '@react-pdf/renderer';
import type { ResumeData } from './CandidateResumeView';

// Standard A4 Layout Styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 28,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1E293B',
  },
  // Top Accent Bar
  topAccent: {
    height: 4,
    backgroundColor: '#0066FF',
    borderRadius: 2,
    marginBottom: 16,
  },
  // Header Section
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    objectFit: 'cover',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#0066FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  nameTitleBox: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0A1931',
  },
  verifiedBadge: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 0.8,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  verifiedText: {
    color: '#047857',
    fontSize: 7.5,
    fontWeight: 'bold',
  },
  primaryRoles: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0066FF',
    marginBottom: 3,
  },
  locationText: {
    fontSize: 8.5,
    color: '#64748B',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  trustScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 0.8,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
    gap: 4,
  },
  trustScoreLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  trustScoreValue: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#0066FF',
  },
  contactItem: {
    fontSize: 8,
    color: '#475569',
    textAlign: 'right',
  },
  // Body Columns
  bodyContainer: {
    flexDirection: 'row',
    gap: 16,
    flex: 1,
  },
  mainColumn: {
    width: '63%',
    gap: 12,
  },
  sideColumn: {
    width: '37%',
    gap: 12,
  },
  // Section Blocks
  sectionBlock: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0A1931',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 3,
    marginBottom: 6,
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 8,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
  },
  summaryText: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: '#334155',
  },
  // Pill Grid
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  rolePill: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  roleText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  skillPill: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  skillText: {
    fontSize: 8,
    color: '#334155',
  },
  // Education Card
  eduCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 8,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
  },
  degreeName: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0A1931',
  },
  collegeText: {
    fontSize: 8.5,
    color: '#475569',
    marginTop: 2,
  },
  mediumText: {
    fontSize: 7.5,
    color: '#64748B',
    marginTop: 2,
  },
  // Sidebar Cards
  sideCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 8,
    borderWidth: 0.5,
    borderColor: '#E2E8F0',
  },
  sideCardTitle: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  sideRow: {
    marginBottom: 4,
  },
  sideLabel: {
    fontSize: 7.5,
    color: '#64748B',
    marginBottom: 1,
  },
  sideValue: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  langPill: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1.5,
    marginRight: 3,
    marginBottom: 3,
  },
  langText: {
    fontSize: 7.5,
    color: '#334155',
    fontWeight: 'bold',
  },
  // Verification Seal
  sealCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    padding: 8,
    borderWidth: 0.8,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    textAlign: 'center',
    marginTop: 4,
  },
  sealTitle: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 2,
  },
  sealDesc: {
    fontSize: 7,
    color: '#3B82F6',
    lineHeight: 1.2,
    textAlign: 'center',
  },
  // Footer
  footer: {
    marginTop: 14,
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: '#CBD5E1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7.5,
    color: '#94A3B8',
  },
});

interface CandidateResumePDFDocumentProps {
  data: ResumeData;
}

export const CandidateResumePDFDocument: React.FC<CandidateResumePDFDocumentProps> = ({ data }) => {
  const skillsList = Array.isArray(data.skills) 
    ? data.skills 
    : (data.skills ? data.skills.split(',').map(s => s.trim()) : []);

  const getEnglishLabel = (prof?: string) => {
    switch (prof) {
      case 'ADVANCED':
      case 'FLUENT': return 'Fluent (Speak, Read & Write)';
      case 'INTERMEDIATE':
      case 'GOOD': return 'Good (Conversational)';
      case 'BASIC': return 'Basic';
      case 'NONE': return 'No English';
      default: return prof || 'Basic';
    }
  };

  const initial = data.fullName?.charAt(0)?.toUpperCase() || 'W';
  const rolesText = data.preferredRoles && data.preferredRoles.length > 0
    ? data.preferredRoles.join(' • ')
    : (skillsList[0] || 'Skilled Professional');

  const locationDisplay = [data.area, data.city || data.location || 'India'].filter(Boolean).join(', ');

  return (
    <Document title={`${data.fullName || 'Candidate'} - TrustHyre Verified Resume`}>
      <Page size="A4" style={styles.page}>
        {/* Top Accent Bar */}
        <View style={styles.topAccent} />

        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            {data.profileImageUrl ? (
              <Image src={data.profileImageUrl} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{initial}</Text>
              </View>
            )}

            <View style={styles.nameTitleBox}>
              <View style={styles.nameRow}>
                <Text style={styles.candidateName}>{data.fullName || 'Candidate Name'}</Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓ Verified Candidate</Text>
                </View>
              </View>

              <Text style={styles.primaryRoles}>{rolesText}</Text>
              <Text style={styles.locationText}>{locationDisplay}</Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            {/* TrustScore - Temporarily hidden until TrustScore engine is implemented */}
            {/*
            <View style={styles.trustScoreBox}>
              <Text style={styles.trustScoreLabel}>TrustScore:</Text>
              <Text style={styles.trustScoreValue}>{data.trustScore || 85} / 100</Text>
            </View>
            */}

            {data.phoneNumber && (
              <Text style={styles.contactItem}>+91 {data.phoneNumber.slice(-10)}</Text>
            )}
            {data.email && (
              <Text style={styles.contactItem}>{data.email}</Text>
            )}
          </View>
        </View>

        {/* Body Content (2 Columns) */}
        <View style={styles.bodyContainer}>
          {/* Main Left Column (63%) */}
          <View style={styles.mainColumn}>
            {/* Professional Summary */}
            {data.bio && (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Professional Summary</Text>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryText}>{data.bio}</Text>
                </View>
              </View>
            )}

            {/* Target Job Roles */}
            {data.preferredRoles && data.preferredRoles.length > 0 && (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Target Job Roles</Text>
                <View style={styles.pillsContainer}>
                  {data.preferredRoles.map((role, idx) => (
                    <View key={idx} style={styles.rolePill}>
                      <Text style={styles.roleText}>{role}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Key Skills */}
            {skillsList.length > 0 && (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Key Technical & Professional Skills</Text>
                <View style={styles.pillsContainer}>
                  {skillsList.map((skill, idx) => (
                    <View key={idx} style={styles.skillPill}>
                      <Text style={styles.skillText}>✓ {skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Education Profile */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Education & Academic Qualification</Text>
              <View style={styles.eduCard}>
                <Text style={styles.degreeName}>
                  {data.degree || data.highestEducation || 'Graduate / Diploma'}
                  {data.isPursuingEducation ? ' (Currently Pursuing)' : ''}
                </Text>
                {data.collegeName && (
                  <Text style={styles.collegeText}>
                    {data.collegeName} {data.specialization ? `• ${data.specialization}` : ''}
                  </Text>
                )}
                {data.schoolMedium && (
                  <Text style={styles.mediumText}>School Medium: {data.schoolMedium}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Right Sidebar Column (37%) */}
          <View style={styles.sideColumn}>
            {/* Languages */}
            <View style={styles.sideCard}>
              <Text style={styles.sideCardTitle}>Languages Spoken</Text>
              <View style={styles.sideRow}>
                <Text style={styles.sideLabel}>English Level</Text>
                <Text style={styles.sideValue}>{getEnglishLabel(data.englishProficiency)}</Text>
              </View>

              {data.languagesKnown && data.languagesKnown.length > 0 && (
                <View style={{ marginTop: 4 }}>
                  <Text style={styles.sideLabel}>Known Languages</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 }}>
                    {data.languagesKnown.map((lang, idx) => (
                      <View key={idx} style={styles.langPill}>
                        <Text style={styles.langText}>{lang}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Mobility & Work Preferences */}
            <View style={styles.sideCard}>
              <Text style={styles.sideCardTitle}>Location & Mobility</Text>
              <View style={styles.sideRow}>
                <Text style={styles.sideLabel}>Primary Area</Text>
                <Text style={styles.sideValue}>{locationDisplay}</Text>
              </View>

              <View style={styles.sideRow}>
                <Text style={styles.sideLabel}>Relocation Readiness</Text>
                <Text style={styles.sideValue}>
                  {data.willingToRelocate ? '✓ Open to relocate' : 'Local city only'}
                </Text>
              </View>

              {data.preferredCities && data.preferredCities.length > 0 && (
                <View style={{ marginTop: 2 }}>
                  <Text style={styles.sideLabel}>Preferred Cities</Text>
                  <Text style={{ fontSize: 8, color: '#334155' }}>
                    {data.preferredCities.join(', ')}
                  </Text>
                </View>
              )}
            </View>

            {/* Protocol Guarantee Seal */}
            <View style={styles.sealCard}>
              <Text style={styles.sealTitle}>TrustHyre Protocol Verified</Text>
              <Text style={styles.sealDesc}>
                Candidate identity, phone & credentials verified across TrustHyre candidate network.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated via TrustHyre Candidate Network</Text>
          <Text style={styles.footerText}>trusthyre.com/candidate</Text>
        </View>
      </Page>
    </Document>
  );
};
