import { prisma } from '../config/prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export interface IngestRequirementInput {
  title: string;
  category?: string;
  description?: string;
  city?: string;
  location?: string;
  workersNeeded?: number;
  salaryRange?: string;
  sourceName: string;
  sourceUrl: string;
}

export interface IngestLeadInput {
  companyName: string;
  companyWebsite?: string;
  industry?: string;
  city?: string;
  state?: string;
  address?: string;
  officialEmail?: string;
  officialPhone?: string;
  contactPageUrl?: string;
  requirements: IngestRequirementInput[];
}

export class LeadService {
  /**
   * Normalizes company name by stripping common corporate suffixes and punctuation.
   */
  static normalizeCompanyName(name: string): string {
    if (!name) return '';
    return name
      .toLowerCase()
      .replace(/\b(private limited|pvt ltd|pvt\. ltd\.|ltd|limited|llc|inc|corp|corporation|group|enterprises|co\.)\b/gi, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Safely formats and normalizes URLs to ensure they are valid and clickable.
   */
  static normalizeUrl(urlOrDomain?: string): string | null {
    if (!urlOrDomain) return null;
    const trimmed = urlOrDomain.trim();
    if (!trimmed || trimmed === '#' || trimmed === 'null' || trimmed === 'undefined') return null;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return `https://${trimmed}`;
    }
    return trimmed;
  }

  /**
   * Extracts root apex domain from any URL or domain string.
   */
  static extractApexDomain(urlOrDomain?: string): string | null {
    if (!urlOrDomain) return null;
    try {
      const sanitized = this.normalizeUrl(urlOrDomain) || urlOrDomain;
      const hostname = new URL(sanitized).hostname.toLowerCase().replace(/^www\./, '');
      const parts = hostname.split('.');
      
      // Handle known multi-part TLDs (e.g. .co.in, .org.in, .net.in, .ac.in, .gov.in, .co.uk)
      if (parts.length >= 3 && (parts[parts.length - 2] === 'co' || parts[parts.length - 2] === 'org' || parts[parts.length - 2] === 'net' || parts[parts.length - 2] === 'ac' || parts[parts.length - 2] === 'gov')) {
        return parts.slice(-3).join('.');
      }
      
      if (parts.length >= 2) {
        return parts.slice(-2).join('.');
      }
      return hostname;
    } catch {
      return urlOrDomain.toLowerCase().trim();
    }
  }

  /**
   * Computes contactability score based on availability of verified business channels.
   */
  static calculateContactability(lead: {
    officialEmail?: string | null;
    officialPhone?: string | null;
    contactPageUrl?: string | null;
    companyWebsite?: string | null;
  }): 'COMPLETE' | 'PARTIAL' | 'UNCONTACTABLE' {
    const hasDirectContact = Boolean(lead.officialEmail || lead.officialPhone);
    const hasWebPresence = Boolean(lead.companyWebsite || lead.contactPageUrl);

    if (hasDirectContact && hasWebPresence) {
      return 'COMPLETE';
    }
    if (hasDirectContact || hasWebPresence) {
      return 'PARTIAL';
    }
    return 'UNCONTACTABLE';
  }

  /**
   * Generates deterministic hash signature for requirement deduplication.
   */
  static generateRequirementHash(leadId: string, title: string, city?: string, salaryRange?: string): string {
    const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normCity = (city || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const normSalary = (salaryRange || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const payload = `${leadId}:${normTitle}:${normCity}:${normSalary}`;
    return crypto.createHash('sha256').update(payload).digest('hex');
  }

  /**
   * Ingests a discovered lead with deduplication and entity resolution.
   */
  static async ingestLead(input: IngestLeadInput) {
    const normalizedName = this.normalizeCompanyName(input.companyName);
    const normalizedWebsite = this.normalizeUrl(input.companyWebsite);
    const normalizedContactPage = this.normalizeUrl(input.contactPageUrl);
    const domain = this.extractApexDomain(normalizedWebsite || input.companyWebsite);
    const contactability = this.calculateContactability({
      ...input,
      companyWebsite: normalizedWebsite,
      contactPageUrl: normalizedContactPage,
    });

    // 1. Check for existing employer lead by domain OR normalized name + city
    let lead = await prisma.employer_leads.findFirst({
      where: {
        OR: [
          ...(domain ? [{ company_domain: domain }] : []),
          {
            normalized_name: normalizedName,
            ...(input.city ? { city: input.city } : {})
          }
        ]
      }
    });

    if (lead) {
      // Update existing lead with newly discovered info or refreshed valid URLs
      lead = await prisma.employer_leads.update({
        where: { id: lead.id },
        data: {
          company_name: input.companyName || lead.company_name,
          official_email: input.officialEmail || lead.official_email,
          official_phone: input.officialPhone || lead.official_phone,
          company_website: normalizedWebsite || lead.company_website,
          contact_page_url: normalizedContactPage || lead.contact_page_url,
          company_domain: domain || lead.company_domain,
          industry: input.industry || lead.industry,
          city: input.city || lead.city,
          address: input.address || lead.address,
          contactability_score: this.calculateContactability({
            officialEmail: input.officialEmail || lead.official_email,
            officialPhone: input.officialPhone || lead.official_phone,
            companyWebsite: normalizedWebsite || lead.company_website,
            contactPageUrl: normalizedContactPage || lead.contact_page_url,
          }),
          updated_at: new Date()
        }
      });
    } else {
      // Create fresh employer lead
      lead = await prisma.employer_leads.create({
        data: {
          company_name: input.companyName,
          normalized_name: normalizedName,
          company_domain: domain,
          company_website: normalizedWebsite,
          industry: input.industry,
          city: input.city,
          state: input.state,
          address: input.address,
          official_email: input.officialEmail,
          official_phone: input.officialPhone,
          contact_page_url: normalizedContactPage,
          contactability_score: contactability,
          status: 'DISCOVERED',
        }
      });
    }

    // 2. Process Requirements
    const results = [];
    for (const req of input.requirements) {
      const normalizedSourceUrl = this.normalizeUrl(req.sourceUrl) || normalizedWebsite || 'https://trusthyre.com';
      const normTitle = req.title.toLowerCase().trim();
      const hash = this.generateRequirementHash(lead.id, req.title, req.city || input.city, req.salaryRange);

      const existingReq = await prisma.employer_lead_requirements.findFirst({
        where: {
          lead_id: lead.id,
          source_hash: hash
        }
      });

      if (existingReq) {
        // Update freshness and valid source URL
        const updated = await prisma.employer_lead_requirements.update({
          where: { id: existingReq.id },
          data: {
            title: req.title || existingReq.title,
            description: req.description || existingReq.description,
            workers_needed: req.workersNeeded ?? existingReq.workers_needed,
            salary_range: req.salaryRange || existingReq.salary_range,
            source_url: normalizedSourceUrl,
            source_name: req.sourceName || existingReq.source_name,
            last_seen_at: new Date(),
          }
        });
        results.push(updated);
      } else {
        const created = await prisma.employer_lead_requirements.create({
          data: {
            lead_id: lead.id,
            title: req.title,
            normalized_title: normTitle,
            category: req.category || input.industry,
            description: req.description,
            city: req.city || input.city,
            location: req.location || input.address,
            workers_needed: req.workersNeeded || 1,
            salary_range: req.salaryRange,
            source_name: req.sourceName,
            source_url: normalizedSourceUrl,
            source_hash: hash,
            status: 'OPEN'
          }
        });
        results.push(created);
      }
    }

    return { lead, requirements: results };
  }

  /**
   * Retrieves leads with rich filtering, search, sorting, and pagination.
   */
  static async getLeads(filters: {
    status?: string;
    contactability?: string;
    city?: string;
    category?: string;
    sortBy?: string;
    q?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, Math.min(100, filters.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.status && filters.status !== 'ALL') {
      where.status = filters.status;
    }
    if (filters.contactability && filters.contactability !== 'ALL') {
      where.contactability_score = filters.contactability;
    }
    if (filters.city && filters.city !== 'ALL') {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }
    if (filters.category && filters.category !== 'ALL') {
      where.OR = [
        { industry: { contains: filters.category, mode: 'insensitive' } },
        { requirements: { some: { category: { contains: filters.category, mode: 'insensitive' } } } }
      ];
    }
    if (filters.q) {
      where.OR = [
        { company_name: { contains: filters.q, mode: 'insensitive' } },
        { company_domain: { contains: filters.q, mode: 'insensitive' } },
        { official_email: { contains: filters.q, mode: 'insensitive' } },
        { official_phone: { contains: filters.q, mode: 'insensitive' } },
        { city: { contains: filters.q, mode: 'insensitive' } },
        { requirements: { some: { title: { contains: filters.q, mode: 'insensitive' } } } }
      ];
    }

    let orderBy: any = { created_at: 'desc' };
    if (filters.sortBy === 'OLDEST') {
      orderBy = { created_at: 'asc' };
    } else if (filters.sortBy === 'NAME_ASC') {
      orderBy = { company_name: 'asc' };
    } else if (filters.sortBy === 'NAME_DESC') {
      orderBy = { company_name: 'desc' };
    }

    const [total, leads] = await Promise.all([
      prisma.employer_leads.count({ where }),
      prisma.employer_leads.findMany({
        where,
        include: {
          requirements: {
            orderBy: { discovered_at: 'desc' }
          },
          outreach_logs: {
            orderBy: { contacted_at: 'desc' }
          }
        },
        orderBy,
        take: limit,
        skip: skip
      })
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      total,
      page,
      limit,
      totalPages,
      leads
    };
  }

  /**
   * Retrieves aggregated KPI analytics for employer lead discovery.
   */
  static async getLeadStats() {
    const [totalLeads, completeLeads, verifiedLeads, contactedLeads, convertedLeads, totalRequirements] =
      await Promise.all([
        prisma.employer_leads.count(),
        prisma.employer_leads.count({ where: { contactability_score: 'COMPLETE' } }),
        prisma.employer_leads.count({ where: { status: 'VERIFIED' } }),
        prisma.employer_leads.count({ where: { status: { in: ['CONTACTED', 'RESPONDED', 'INTERESTED'] } } }),
        prisma.employer_leads.count({ where: { status: 'ONBOARDED' } }),
        prisma.employer_lead_requirements.count()
      ]);

    return {
      totalLeads,
      completeLeads,
      verifiedLeads,
      contactedLeads,
      convertedLeads,
      totalRequirements
    };
  }

  /**
   * Updates status of an employer lead.
   */
  static async updateLeadStatus(id: string, status: string) {
    return prisma.employer_leads.update({
      where: { id },
      data: {
        status,
        updated_at: new Date()
      }
    });
  }

  /**
   * Logs a BD outreach action against a lead.
   */
  static async logOutreach(leadId: string, adminId: string, data: {
    channel: string;
    contactTarget?: string;
    notes: string;
    outcome?: string;
  }) {
    const log = await prisma.lead_outreach_logs.create({
      data: {
        lead_id: leadId,
        admin_id: adminId,
        channel: data.channel,
        contact_target: data.contactTarget,
        notes: data.notes,
        outcome: data.outcome
      }
    });

    // Update lead status to CONTACTED or RESPONDED if appropriate
    let newStatus = 'CONTACTED';
    if (data.outcome === 'INTERESTED') newStatus = 'INTERESTED';
    if (data.outcome === 'NOT_INTERESTED') newStatus = 'NOT_INTERESTED';

    await prisma.employer_leads.update({
      where: { id: leadId },
      data: {
        status: newStatus,
        updated_at: new Date()
      }
    });

    return log;
  }

  /**
   * Converts a verified lead into a live TrustHire Employer profile.
   */
  static async convertLeadToEmployer(leadId: string) {
    const lead = await prisma.employer_leads.findUnique({
      where: { id: leadId },
      include: { requirements: true }
    });

    if (!lead) {
      throw new Error('Employer lead not found');
    }

    if (lead.trusthire_employer_id) {
      throw new Error('This lead has already been converted to a TrustHire employer');
    }

    const email = lead.official_email || `employer_${lead.normalized_name.replace(/\s+/g, '_')}@trusthyre.lead`;
    
    // Check if user already exists with this email
    let user = await prisma.user_metadata.findUnique({ where: { email } });

    if (!user) {
      const tempPassword = `TH_${uuidv4().slice(0, 8)}!`;
      const passwordHash = await bcrypt.hash(tempPassword, 10);

      user = await prisma.user_metadata.create({
        data: {
          id: uuidv4(),
          email,
          password_hash: passwordHash,
          first_name: lead.company_name.split(' ')[0] || 'Employer',
          last_name: lead.company_name.split(' ').slice(1).join(' ') || 'Admin',
          role: 'EMPLOYER',
          email_verified: false,
          onboarded: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }

    // Create or Link employer_profiles
    let employerProfile = await prisma.employer_profiles.findUnique({
      where: { user_id: user.id }
    });

    if (!employerProfile) {
      employerProfile = await prisma.employer_profiles.create({
        data: {
          user_id: user.id,
          company_name: lead.company_name,
          industry: lead.industry || 'General Trade',
          company_website: lead.company_website,
          city: lead.city,
          address: lead.address,
          is_verified: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
    }

    // Update lead record to ONBOARDED
    await prisma.employer_leads.update({
      where: { id: leadId },
      data: {
        status: 'ONBOARDED',
        trusthire_employer_id: employerProfile.id,
        updated_at: new Date()
      }
    });

    return {
      message: 'Employer converted successfully',
      employerId: employerProfile.id,
      userId: user.id,
      email: user.email
    };
  }
}
