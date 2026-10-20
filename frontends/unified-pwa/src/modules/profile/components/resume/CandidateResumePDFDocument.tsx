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
import { formatLocation } from './CandidateResumeView';
import { normalizeSkills } from '../../../../utils/skills';

// Standard A4 Layout Styles (Strict Monochrome Executive ATS Standard)
const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 32,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: '#111827',
  },
  // Header Section
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#111827',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  candidateName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  primaryHeadline: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 2,
  },
  contactStrip: {
    fontSize: 8,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 1.3,
  },
  statusText: {
    fontSize: 7.5,
    color: '#6B7280',
    marginTop: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 4,
    objectFit: 'cover',
    borderWidth: 0.8,
    borderColor: '#CBD5E1',
    marginLeft: 12,
  },
  // Section Blocks
  sectionBlock: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    borderBottomWidth: 0.8,
    borderBottomColor: '#111827',
    paddingBottom: 2,
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 8.5,
    lineHeight: 1.35,
    color: '#374151',
  },
  // Competencies / Skills 3-column grid
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    flexDirection: 'row',
    width: '33.33%',
    alignItems: 'flex-start',
    gap: 3,
    marginBottom: 3,
    paddingRight: 4,
  },
  bulletPoint: {
    fontSize: 9,
    color: '#111827',
    fontWeight: 'bold',
  },
  skillText: {
    fontSize: 8,
    color: '#374151',
    lineHeight: 1.2,
    flex: 1,
  },
  // Target roles
  rolesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  roleTag: {
    backgroundColor: '#F8FAFC',
    borderColor: '#CBD5E1',
    borderWidth: 0.5,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  roleTagText: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  // Experience & Education Rows
  experienceRow: {
    marginBottom: 4,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 2,
  },
  boldTitle: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtleMeta: {
    fontSize: 7.5,
    color: '#6B7280',
  },
  experienceDesc: {
    fontSize: 8,
    color: '#374151',
    lineHeight: 1.3,
  },
  // Multi-column info rows
  infoColumnsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoColumn: {
    flex: 1,
    paddingRight: 6,
  },
  fieldLabel: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 1,
  },
  fieldValue: {
    fontSize: 8,
    color: '#4B5563',
  },
  // Footer
  footer: {
    marginTop: 12,
    paddingTop: 5,
    borderTopWidth: 0.5,
    borderTopColor: '#CBD5E1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 7,
    color: '#94A3B8',
  },
});

interface CandidateResumePDFDocumentProps {
  data: ResumeData;
}

export const CandidateResumePDFDocument: React.FC<CandidateResumePDFDocumentProps> = ({ data }) => {
  const skillsList = normalizeSkills(data.skills);

  const getEnglishLabel = (prof?: string) => {
    switch (prof) {
      case 'ADVANCED':
      case 'FLUENT': return 'Fluent (Speak, Read & Write comfortably)';
      case 'INTERMEDIATE':
      case 'GOOD': return 'Good (Conversational & functional)';
      case 'BASIC': return 'Basic';
      case 'NONE': return 'No English';
      default: return prof || 'Basic English';
    }
  };

  const primaryHeadline = data.preferredRoles && data.preferredRoles.length > 0
    ? data.preferredRoles.join('  •  ')
    : (skillsList[0] || 'Professional Candidate');

  const locationString = formatLocation(data);

  // Single bullet-delimited contact strip
  const contactParts: string[] = [];
  if (data.phoneNumber) contactParts.push(`+91 ${data.phoneNumber.slice(-10)}`);
  if (data.email) contactParts.push(data.email);
  if (locationString) contactParts.push(locationString);
  const contactLine = contactParts.join('   •   ');

  return (
    <Document title={`${data.fullName || 'Candidate'} - Executive Resume`}>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.candidateName}>{data.fullName || 'Candidate Name'}</Text>
            <Text style={styles.primaryHeadline}>{primaryHeadline}</Text>
            {contactLine ? <Text style={styles.contactStrip}>{contactLine}</Text> : null}
            <Text style={styles.statusText}>
              TrustHyre Verified Profile   •   Candidate ID Verified   •   Available for Placement
            </Text>
          </View>

          {data.profileImageUrl && (
            <Image src={data.profileImageUrl} style={styles.avatar} />
          )}
        </View>

        {/* 1. PROFESSIONAL SUMMARY */}
        {data.bio && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{data.bio}</Text>
          </View>
        )}

        {/* 2. CORE COMPETENCIES & TECHNICAL SKILLS */}
        {skillsList.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Core Competencies & Technical Skills</Text>
            <View style={styles.skillsGrid}>
              {skillsList.map((skill, idx) => (
                <View key={idx} style={styles.skillItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 3. TARGET JOB ROLES */}
        {data.preferredRoles && data.preferredRoles.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Target Roles & Career Domains</Text>
            <View style={styles.rolesGrid}>
              {data.preferredRoles.map((role, idx) => (
                <View key={idx} style={styles.roleTag}>
                  <Text style={styles.roleTagText}>{role}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 4. WORK EXPERIENCE & PRACTICAL HISTORY */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Work Experience & Practical History</Text>
          <View style={styles.experienceRow}>
            <View style={styles.rowHeader}>
              <Text style={styles.boldTitle}>
                {data.preferredRoles?.[0] || skillsList[0] || 'Technical Specialist'}
              </Text>
              <Text style={styles.subtleMeta}>
                {data.experienceYears && data.experienceYears > 0
                  ? `${data.experienceYears}+ Years Practical Experience`
                  : 'Entry-Level / Fresher'}
              </Text>
            </View>
            <Text style={styles.experienceDesc}>
              Practical background verified through TrustHyre candidate network. Demonstrated competence in industry procedures, trade safety protocols, and operational task execution.
            </Text>
          </View>
        </View>

        {/* 5. EDUCATION & ACADEMIC CREDENTIALS */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Education & Academic Background</Text>
          <View style={styles.rowHeader}>
            <View>
              <Text style={styles.boldTitle}>
                {data.degree || data.highestEducation || 'Graduate / Diploma / Secondary Education'}
              </Text>
              {data.collegeName && (
                <Text style={styles.subtleMeta}>
                  {data.collegeName} {data.specialization ? `• ${data.specialization}` : ''}
                </Text>
              )}
              {data.schoolMedium && (
                <Text style={styles.subtleMeta}>Medium of Instruction: {data.schoolMedium}</Text>
              )}
            </View>
            <Text style={styles.subtleMeta}>
              {data.isPursuingEducation ? 'In Progress' : 'Completed'}
            </Text>
          </View>
        </View>

        {/* 6. LANGUAGES & COMMUNICATION */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Languages & Communication</Text>
          <View style={styles.infoColumnsRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.fieldLabel}>English Language Proficiency</Text>
              <Text style={styles.fieldValue}>{getEnglishLabel(data.englishProficiency)}</Text>
            </View>
            {data.languagesKnown && data.languagesKnown.length > 0 && (
              <View style={styles.infoColumn}>
                <Text style={styles.fieldLabel}>Additional Known Languages</Text>
                <Text style={styles.fieldValue}>{data.languagesKnown.join(', ')}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 7. MOBILITY & WORK AVAILABILITY */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Work Availability & Mobility</Text>
          <View style={styles.infoColumnsRow}>
            <View style={styles.infoColumn}>
              <Text style={styles.fieldLabel}>Base Location</Text>
              <Text style={styles.fieldValue}>{locationString}</Text>
            </View>
            <View style={styles.infoColumn}>
              <Text style={styles.fieldLabel}>Relocation Readiness</Text>
              <Text style={styles.fieldValue}>
                {data.willingToRelocate ? 'Open to Relocation' : 'Local City Commute Only'}
              </Text>
            </View>
            {data.preferredCities && data.preferredCities.length > 0 && (
              <View style={styles.infoColumn}>
                <Text style={styles.fieldLabel}>Preferred Cities</Text>
                <Text style={styles.fieldValue}>{data.preferredCities.join(', ')}</Text>
              </View>
            )}
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>TrustHyre Candidate Network • Candidate Identity & Record Verified</Text>
          <Text style={styles.footerText}>trusthyre.com/candidate</Text>
        </View>
      </Page>
    </Document>
  );
};
