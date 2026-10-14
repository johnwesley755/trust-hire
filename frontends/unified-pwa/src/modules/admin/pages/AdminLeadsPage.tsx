import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService, type EmployerLeadItem } from '../../../services/lead.service';
import { 
  Building2, 
  Search, 
  ExternalLink, 
  Mail, 
  Phone, 
  Globe, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  UserCheck, 
  Send, 
  FileText, 
  Loader2, 
  X, 
  TrendingUp, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  Briefcase,
  Radar,
  RefreshCw,
  Link2,
  Bot,
  HelpCircle,
  Lightbulb,
  Check,
  PhoneCall,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';
import { AppLoader } from '../../../components/common/AppLoader';

export const AdminLeadsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [contactabilityFilter, setContactabilityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('NEWEST');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const [selectedLead, setSelectedLead] = useState<EmployerLeadItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCrawlModalOpen, setIsCrawlModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [crawlUrlInput, setCrawlUrlInput] = useState('');
  const [crawledDataPreview, setCrawledDataPreview] = useState<any | null>(null);

  // Outreach Form State
  const [outreachForm, setOutreachForm] = useState({
    channel: 'PHONE',
    contactTarget: '',
    notes: '',
    outcome: 'INTERESTED',
  });

  // Manual Ingest Form State
  const [newLeadForm, setNewLeadForm] = useState({
    companyName: '',
    companyWebsite: '',
    industry: 'Hospitality & Food',
    city: 'Chennai',
    officialEmail: '',
    officialPhone: '',
    contactPageUrl: '',
    title: 'Delivery Driver',
    category: 'Logistics & Delivery',
    workersNeeded: 5,
    salaryRange: '₹15,000 - ₹20,000 / month',
    sourceName: 'Direct Career Page',
    sourceUrl: 'https://example.com/careers/jobs/123',
    description: 'Looking for 5 full-time delivery riders with valid license in Chennai.',
  });

  // Queries
  const { data: leadData, isLoading } = useQuery({
    queryKey: ['adminLeads', statusFilter, contactabilityFilter, categoryFilter, sortBy, searchQuery, page, limit],
    queryFn: () => leadService.getLeads({
      status: statusFilter,
      contactability: contactabilityFilter,
      category: categoryFilter,
      sortBy: sortBy,
      q: searchQuery,
      page,
      limit
    }),
  });

  const { data: stats } = useQuery({
    queryKey: ['adminLeadStats'],
    queryFn: leadService.getStats,
    refetchInterval: 30000,
  });

  const { data: sourcesData } = useQuery({
    queryKey: ['adminLeadSources'],
    queryFn: leadService.getSources,
  });

  const leads = leadData?.leads || [];
  const totalLeads = leadData?.total || 0;
  const totalPages = leadData?.totalPages || 1;

  // Auto-Discovery Scanner Mutation
  const autoDiscoveryMutation = useMutation({
    mutationFn: () => leadService.runAutoDiscovery(),
    onSuccess: (res) => {
      toast.success(
        `Auto-Discovery Complete: ${res.newLeadsCount} new hiring companies found, ${res.totalScanned} worker requirements scanned!`,
        { duration: 5000 }
      );
      queryClient.invalidateQueries({ queryKey: ['adminLeads'] });
      queryClient.invalidateQueries({ queryKey: ['adminLeadStats'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || 'Auto-discovery scan failed'),
  });

  // Single URL Scrape & Parse Mutation
  const crawlUrlMutation = useMutation({
    mutationFn: (url: string) => leadService.crawlUrl(url),
    onSuccess: (res) => {
      setCrawledDataPreview(res.data);
      toast.success('Website parsed & business contact channels extracted!');
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || 'Failed to crawl and extract URL data'),
  });

  // Mutations
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => leadService.updateStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(`Company status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ['adminLeads'] });
      queryClient.invalidateQueries({ queryKey: ['adminLeadStats'] });
      if (selectedLead && selectedLead.id === variables.id) {
        setSelectedLead((prev) => (prev ? { ...prev, status: variables.status as any } : null));
      }
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || 'Failed to update status'),
  });

  const outreachMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof outreachForm }) =>
      leadService.logOutreach(id, data),
    onSuccess: () => {
      toast.success('Outreach log recorded successfully');
      setOutreachForm({ channel: 'PHONE', contactTarget: '', notes: '', outcome: 'INTERESTED' });
      queryClient.invalidateQueries({ queryKey: ['adminLeads'] });
      queryClient.invalidateQueries({ queryKey: ['adminLeadStats'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || 'Failed to record outreach'),
  });

  const convertMutation = useMutation({
    mutationFn: (id: string) => leadService.convertLead(id),
    onSuccess: (res) => {
      toast.success(`Company successfully onboarded to TrustHire (${res.email})! Job post created.`);
      queryClient.invalidateQueries({ queryKey: ['adminLeads'] });
      queryClient.invalidateQueries({ queryKey: ['adminLeadStats'] });
      if (selectedLead) {
        setSelectedLead((prev) => (prev ? { ...prev, status: 'ONBOARDED' } : null));
      }
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || 'Failed to onboard company'),
  });

  const manualIngestMutation = useMutation({
    mutationFn: (data: typeof newLeadForm) =>
      leadService.ingestLead({
        companyName: data.companyName,
        companyWebsite: data.companyWebsite,
        industry: data.industry,
        city: data.city,
        officialEmail: data.officialEmail,
        officialPhone: data.officialPhone,
        contactPageUrl: data.contactPageUrl,
        requirements: [
          {
            title: data.title,
            category: data.category,
            workersNeeded: Number(data.workersNeeded),
            salaryRange: data.salaryRange,
            sourceName: data.sourceName,
            sourceUrl: data.sourceUrl,
            description: data.description,
          },
        ],
      }),
    onSuccess: () => {
      toast.success('Hiring company recorded successfully');
      setIsAddModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['adminLeads'] });
      queryClient.invalidateQueries({ queryKey: ['adminLeadStats'] });
    },
    onError: (err: any) => toast.error(err?.response?.data?.error || 'Failed to save hiring company'),
  });

  const kpiCards = [
    {
      title: 'Discovered Companies',
      value: stats?.totalLeads || 0,
      sub: `${stats?.totalRequirements || 0} Open Worker Openings`,
      icon: Building2,
      color: 'bg-blue-50 text-[#0066FF] border border-blue-100',
    },
    {
      title: 'Ready to Contact',
      value: stats?.completeLeads || 0,
      sub: 'Verified Phone & Email on file',
      icon: ShieldCheck,
      color: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
    {
      title: 'In Outreach Pipeline',
      value: stats?.contactedLeads || 0,
      sub: 'Contacted • Follow-up • Interested',
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600 border border-amber-100',
    },
    {
      title: 'Joined TrustHire',
      value: stats?.convertedLeads || 0,
      sub: 'Active TrustHire Employers',
      icon: UserCheck,
      color: 'bg-purple-50 text-purple-600 border border-purple-100',
    },
  ];

  const statusTabs = [
    { label: 'All Companies', value: 'ALL' },
    { label: 'New Found', value: 'DISCOVERED' },
    { label: 'Verified Info', value: 'VERIFIED' },
    { label: 'Contacted', value: 'CONTACTED' },
    { label: 'Interested', value: 'INTERESTED' },
    { label: 'Joined Platform', value: 'ONBOARDED' },
    { label: 'Closed / Expired', value: 'EXPIRED' },
  ];

  const hasActiveFilters = 
    statusFilter !== 'ALL' || 
    contactabilityFilter !== 'ALL' || 
    categoryFilter !== 'ALL' || 
    sortBy !== 'NEWEST' || 
    searchQuery !== '';

  const resetAllFilters = () => {
    setStatusFilter('ALL');
    setContactabilityFilter('ALL');
    setCategoryFilter('ALL');
    setSortBy('NEWEST');
    setSearchQuery('');
    setPage(1);
  };

  const formatLink = (url?: string | null) => {
    if (!url) return '#';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://${trimmed}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#0A1931] tracking-tight">Hiring Company Discovery</h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#0066FF] border border-blue-200">
              Live Opportunity Finder
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Find external businesses that currently need workers, view their verified phone and email, and invite them to hire verified workers on TrustHire.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Interactive Guide / How It Works Button */}
          <button
            onClick={() => setIsGuideModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 shadow-xs transition-all cursor-pointer"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>How This Works & Preview</span>
          </button>

          {/* Quick URL Crawl Button */}
          <button
            onClick={() => {
              setCrawledDataPreview(null);
              setCrawlUrlInput('');
              setIsCrawlModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition-all cursor-pointer"
          >
            <Link2 className="w-4 h-4 text-[#0066FF]" />
            <span>Quick Scrape URL</span>
          </button>

          {/* Auto Discovery Scanner Run */}
          <button
            onClick={() => autoDiscoveryMutation.mutate()}
            disabled={autoDiscoveryMutation.isPending}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-60"
            title="Scan active career feeds and schema.org postings"
          >
            {autoDiscoveryMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Radar className="w-4 h-4" />
            )}
            <span>{autoDiscoveryMutation.isPending ? 'Searching Feeds...' : 'Run Auto-Discovery Scan'}</span>
          </button>

          {/* Ingest Manual Lead */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#0066FF] hover:bg-blue-600 text-white shadow-xs shadow-blue-500/20 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Company</span>
          </button>
        </div>
      </div>

      {/* Discovery Sources Status Strip */}
      {sourcesData && sourcesData.length > 0 && (
        <div className="bg-slate-50 border border-slate-200/90 rounded-2xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[#0066FF]" />
            <span className="font-bold text-slate-700">Configured Discovery Crawlers:</span>
            <span className="text-slate-500 font-medium">
              {sourcesData.filter((s: any) => s.active).length} Active Channels
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {sourcesData.map((s: any) => (
              <span
                key={s.id}
                className="px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-600 flex items-center gap-1"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${s.active ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <span>{s.name}</span>
                <span className="text-slate-400 text-[9px]">({s.type})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <div className={`w-10 h-10 rounded-2xl ${kpi.color} flex items-center justify-center shadow-xs`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-[#0A1931]">{kpi.value.toLocaleString()}</span>
                <p className="text-xs text-slate-500 font-medium mt-1">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3.5">
        {/* Top Row: Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex flex-wrap gap-1.5">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === tab.value
                    ? 'bg-[#0066FF] text-white shadow-xs shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Second Row: Detailed Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search Bar */}
          <div className="relative lg:col-span-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search company, job role, phone, city..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#0066FF] focus:bg-white rounded-xl px-3.5 py-2 pl-9 pr-8 text-xs text-slate-900 placeholder:text-slate-400 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Contact Readiness Filter */}
          <div>
            <select
              value={contactabilityFilter}
              onChange={(e) => {
                setContactabilityFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#0066FF] rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold outline-none"
            >
              <option value="ALL">All Contact Readiness</option>
              <option value="COMPLETE">Full Info (Phone + Email ✓)</option>
              <option value="PARTIAL">Partial (Website only)</option>
              <option value="UNCONTACTABLE">No Contact Info</option>
            </select>
          </div>

          {/* Industry Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-200 focus:border-[#0066FF] rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold outline-none"
            >
              <option value="ALL">All Trade Industries</option>
              <option value="Logistics">Logistics & Delivery</option>
              <option value="Hospitality">Hospitality & Food</option>
              <option value="Electrical">Electrical & Wiring</option>
              <option value="Home Services">Home Services & Trade</option>
              <option value="Courier">Courier & Freight</option>
              <option value="Healthcare">Healthcare & Facilities</option>
              <option value="Manufacturing">Manufacturing & Welding</option>
              <option value="Warehousing">Warehousing & Packing</option>
            </select>
          </div>

          {/* Sort By & Page Size Controls */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#0066FF] rounded-xl px-2.5 py-2 text-xs text-slate-700 font-semibold outline-none"
            >
              <option value="NEWEST">Newest First</option>
              <option value="OLDEST">Oldest First</option>
              <option value="NAME_ASC">Name (A-Z)</option>
              <option value="NAME_DESC">Name (Z-A)</option>
            </select>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-slate-50 border border-slate-200 focus:border-[#0066FF] rounded-xl px-2.5 py-2 text-xs text-slate-700 font-semibold outline-none shrink-0"
              title="Items per page"
            >
              <option value={10}>10 / page</option>
              <option value={25}>25 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leads Directory Table */}
      {isLoading ? (
        <AppLoader variant="page" message="Loading business lead directory..." />
      ) : leads.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">No hiring companies found</h3>
          <p className="text-xs text-slate-400 mt-1">
            Click "Run Auto-Discovery Scan" or "Quick Scrape URL" to discover hiring businesses.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Company Name & Website</th>
                  <th className="px-6 py-4">Workers Needed (Openings)</th>
                  <th className="px-6 py-4">Phone & Email</th>
                  <th className="px-6 py-4">Contact Readiness</th>
                  <th className="px-6 py-4">Progress Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => {
                  const reqCount = lead.requirements?.length || 0;
                  const primaryReq = lead.requirements?.[0];

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Employer Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-[#0066FF] font-black flex items-center justify-center text-sm shrink-0">
                            {lead.company_name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-[#0A1931] block text-sm">{lead.company_name}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              {lead.company_domain ? (
                                <span className="text-[11px] text-[#0066FF] font-mono flex items-center gap-1">
                                  <Globe className="w-3 h-3" />
                                  <span>{lead.company_domain}</span>
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400">No website domain</span>
                              )}
                              {lead.city && (
                                <span className="text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                                  {lead.city}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Worker Requirements */}
                      <td className="px-6 py-4">
                        {primaryReq ? (
                          <div>
                            <span className="font-bold text-slate-800 block text-xs">{primaryReq.title}</span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span className="text-[#0066FF] font-bold">{primaryReq.workers_needed} Workers Needed</span>
                              {primaryReq.salary_range && <span>• {primaryReq.salary_range}</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              {primaryReq.source_url && (
                                <a
                                  href={formatLink(primaryReq.source_url)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50/80 hover:bg-blue-100 text-[#0066FF] rounded-md text-[10px] font-bold border border-blue-200/60 transition-colors"
                                  title={`Open exact job post on ${primaryReq.source_name || 'Portal'}`}
                                >
                                  <Link2 className="w-2.5 h-2.5" />
                                  <span>{primaryReq.source_name || 'View Job Post'}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                              {reqCount > 1 && (
                                <span className="text-[10px] font-bold text-slate-400">
                                  + {reqCount - 1} more
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No roles listed</span>
                        )}
                      </td>

                      {/* Contact Channels */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {lead.official_email ? (
                            <a
                              href={`mailto:${lead.official_email}`}
                              className="flex items-center gap-1.5 text-[11px] text-slate-700 hover:text-[#0066FF]"
                            >
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[150px]">{lead.official_email}</span>
                            </a>
                          ) : null}
                          {lead.official_phone ? (
                            <a
                              href={`tel:${lead.official_phone}`}
                              className="flex items-center gap-1.5 text-[11px] text-slate-700 hover:text-[#0066FF]"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{lead.official_phone}</span>
                            </a>
                          ) : null}
                          {!lead.official_email && !lead.official_phone && (
                            <span className="text-[11px] text-slate-400 italic">Finding contacts...</span>
                          )}
                        </div>
                      </td>

                      {/* Contactability Score */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                            lead.contactability_score === 'COMPLETE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : lead.contactability_score === 'PARTIAL'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>
                            {lead.contactability_score === 'COMPLETE'
                              ? 'Full Info'
                              : lead.contactability_score === 'PARTIAL'
                              ? 'Website Only'
                              : 'Missing Contact'}
                          </span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                            lead.status === 'ONBOARDED'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : lead.status === 'INTERESTED'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : lead.status === 'CONTACTED'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : lead.status === 'VERIFIED'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : lead.status === 'EXPIRED' || lead.status === 'INVALID'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {lead.status === 'ONBOARDED'
                            ? 'Joined Platform'
                            : lead.status === 'DISCOVERED'
                            ? 'New Found'
                            : lead.status === 'VERIFIED'
                            ? 'Verified Info'
                            : lead.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            View Details
                          </button>
                          {lead.status !== 'ONBOARDED' && (
                            <button
                              onClick={() => convertMutation.mutate(lead.id)}
                              disabled={convertMutation.isPending}
                              className="px-3 py-1.5 bg-[#0066FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1"
                              title="Onboard company to TrustHire"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Onboard</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-500 font-medium">
              Showing{' '}
              <span className="font-bold text-slate-800">
                {totalLeads === 0 ? 0 : (page - 1) * limit + 1}
              </span>{' '}
              to{' '}
              <span className="font-bold text-slate-800">
                {Math.min(page * limit, totalLeads)}
              </span>{' '}
              of <span className="font-bold text-[#0A1931]">{totalLeads}</span> hiring companies
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              {/* Page Number Pills */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    // Always show first, last, and pages near current page
                    if (p === 1 || p === totalPages) return true;
                    if (Math.abs(p - page) <= 1) return true;
                    return false;
                  })
                  .reduce<(number | string)[]>((acc, p, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) {
                      acc.push('...');
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, idx) => {
                    if (typeof p === 'string') {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 text-xs font-bold select-none">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={`page-${p}`}
                        onClick={() => setPage(p)}
                        disabled={isLoading}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          page === p
                            ? 'bg-[#0066FF] text-white shadow-xs shadow-blue-500/30'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || isLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail & Provenance Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-[#0066FF] font-black flex items-center justify-center text-lg">
                  {selectedLead.company_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0A1931]">{selectedLead.company_name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {selectedLead.company_website && (
                      <a
                        href={formatLink(selectedLead.company_website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#0066FF] hover:underline flex items-center gap-1"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Visit Website</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <span className="text-xs text-slate-400">• {selectedLead.industry || 'General Trade'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Contact & Provenance Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Contact Channels Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Official Business Channels
                </span>
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Email:
                    </span>
                    <span className="font-semibold text-slate-800">{selectedLead.official_email || 'Not Provided'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Phone:
                    </span>
                    <span className="font-semibold text-slate-800">{selectedLead.official_phone || 'Not Provided'}</span>
                  </div>
                  {selectedLead.contact_page_url && (
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-500">Contact Form:</span>
                      <a
                        href={formatLink(selectedLead.contact_page_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0066FF] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Open Page</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Provenance & Status Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Progress Status
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Stage:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => updateStatusMutation.mutate({ id: selectedLead.id, status: e.target.value })}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="DISCOVERED">New Found</option>
                    <option value="VERIFIED">Verified Info</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="ONBOARDED">Joined TrustHire</option>
                    <option value="EXPIRED">Closed / Expired</option>
                  </select>
                </div>
                <div className="text-[11px] text-slate-500 flex justify-between">
                  <span>Found on:</span>
                  <span className="font-medium text-slate-700">
                    {new Date(selectedLead.created_at).toLocaleDateString()}
                  </span>
                </div>
                {selectedLead.trusthire_employer_id && (
                  <div className="p-1.5 bg-purple-50 text-purple-700 rounded-lg text-[10px] font-bold text-center border border-purple-200">
                    Linked to Live TrustHire Employer Account
                  </div>
                )}
              </div>
            </div>

            {/* Worker Requirements List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0A1931] uppercase tracking-wider">
                Workers Needed by This Company ({selectedLead.requirements?.length || 0})
              </h4>
              <div className="space-y-2.5">
                {selectedLead.requirements?.map((req) => (
                  <div key={req.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="text-xs font-bold text-[#0A1931]">{req.title}</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5">{req.description || 'No description provided'}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-50 text-[#0066FF] border border-blue-200 rounded text-[10px] font-black uppercase shrink-0">
                        {req.workers_needed} Worker(s)
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                      <div>
                        <span>Salary: </span>
                        <strong className="text-slate-700">{req.salary_range || 'Competitive'}</strong>
                      </div>
                      <div className="flex items-center gap-2">
                        {req.source_url ? (
                          <a
                            href={formatLink(req.source_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#0066FF] rounded-lg text-xs font-bold border border-blue-200/80 transition-all"
                          >
                            <Link2 className="w-3 h-3" />
                            <span>Open Exact Job Post ({req.source_name || 'Portal'})</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 font-medium">Source: {req.source_name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outreach Activity Log */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-[#0A1931] uppercase tracking-wider">
                Call & Outreach Log ({selectedLead.outreach_logs?.length || 0})
              </h4>

              {/* Log Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!outreachForm.notes) {
                    toast.error('Notes are required');
                    return;
                  }
                  outreachMutation.mutate({ id: selectedLead.id, data: outreachForm });
                }}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5"
              >
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={outreachForm.channel}
                    onChange={(e) => setOutreachForm({ ...outreachForm, channel: e.target.value })}
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option value="PHONE">Phone Call</option>
                    <option value="EMAIL">Email</option>
                    <option value="IN_PERSON">In Person Visit</option>
                    <option value="CONTACT_FORM">Contact Form</option>
                  </select>

                  <select
                    value={outreachForm.outcome}
                    onChange={(e) => setOutreachForm({ ...outreachForm, outcome: e.target.value })}
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option value="INTERESTED">Interested in TrustHire</option>
                    <option value="FOLLOW_UP">Needs Follow-Up</option>
                    <option value="NOT_INTERESTED">Not Interested</option>
                    <option value="NO_ANSWER">No Answer</option>
                  </select>

                  <input
                    type="text"
                    value={outreachForm.contactTarget}
                    onChange={(e) => setOutreachForm({ ...outreachForm, contactTarget: e.target.value })}
                    placeholder="e.g. Spoke with HR Mgr"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={outreachForm.notes}
                    onChange={(e) => setOutreachForm({ ...outreachForm, notes: e.target.value })}
                    placeholder="Enter call notes or next action steps..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={outreachMutation.isPending}
                    className="px-4 py-1.5 bg-[#0066FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Log Call</span>
                  </button>
                </div>
              </form>

              {/* Past Logs */}
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {selectedLead.outreach_logs?.map((log) => (
                  <div key={log.id} className="p-2.5 bg-white border border-slate-200/80 rounded-xl text-xs flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0A1931]">{log.channel}</span>
                        {log.contact_target && <span className="text-[11px] text-slate-500">({log.contact_target})</span>}
                        <span className="px-1.5 py-0.2 bg-blue-50 text-[#0066FF] rounded text-[9px] font-bold">
                          {log.outcome || 'COMPLETED'}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{log.notes}</p>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(log.contacted_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>

              {selectedLead.status !== 'ONBOARDED' && (
                <button
                  onClick={() => convertMutation.mutate(selectedLead.id)}
                  disabled={convertMutation.isPending}
                  className="px-5 py-2 bg-[#0066FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Onboard to TrustHire (Create Employer)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-[#0A1931]">Add Hiring Company Record</h3>
                <p className="text-[11px] text-slate-500">Record a new business looking for workers into your pipeline.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                manualIngestMutation.mutate(newLeadForm);
              }}
              className="space-y-3.5"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.companyName}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, companyName: e.target.value })}
                    placeholder="e.g. ABC Restaurant"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.city}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, city: e.target.value })}
                    placeholder="e.g. Chennai"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Website</label>
                  <input
                    type="text"
                    value={newLeadForm.companyWebsite}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, companyWebsite: e.target.value })}
                    placeholder="e.g. https://abcrestaurant.in"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={newLeadForm.officialEmail}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, officialEmail: e.target.value })}
                    placeholder="careers@abcrestaurant.in"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Official Phone</label>
                  <input
                    type="text"
                    value={newLeadForm.officialPhone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, officialPhone: e.target.value })}
                    placeholder="044-2811xxxx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Page URL</label>
                  <input
                    type="text"
                    value={newLeadForm.contactPageUrl}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, contactPageUrl: e.target.value })}
                    placeholder="https://abcrestaurant.in/contact"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#0066FF]"
                  />
                </div>
              </div>

              {/* Requirement details */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <span className="text-[11px] font-bold text-[#0066FF] uppercase tracking-wider block">
                  Worker Opening Details
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Job Title</label>
                    <input
                      type="text"
                      required
                      value={newLeadForm.title}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, title: e.target.value })}
                      placeholder="e.g. Delivery Driver"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#0066FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Workers Needed</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newLeadForm.workersNeeded}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, workersNeeded: parseInt(e.target.value, 10) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Salary Range</label>
                    <input
                      type="text"
                      value={newLeadForm.salaryRange}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, salaryRange: e.target.value })}
                      placeholder="₹15,000 - ₹20,000 / month"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#0066FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Original Job Posting Link</label>
                    <input
                      type="text"
                      required
                      value={newLeadForm.sourceUrl}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, sourceUrl: e.target.value })}
                      placeholder="https://source.com/listing/123"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Job Description</label>
                  <textarea
                    rows={2}
                    value={newLeadForm.description}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, description: e.target.value })}
                    placeholder="Requirement description and job details..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:bg-white focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={manualIngestMutation.isPending}
                  className="px-5 py-2 bg-[#0066FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {manualIngestMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Save Company Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Scrape from URL Modal */}
      {isCrawlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066FF]">
                  <Link2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0A1931]">Quick Scrape & Enrich from URL</h3>
                  <p className="text-[11px] text-slate-500">
                    Paste any external job post or career page to auto-extract company details & contacts.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCrawlModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* URL Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!crawlUrlInput.trim()) return;
                crawlUrlMutation.mutate(crawlUrlInput.trim());
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Webpage or Career URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={crawlUrlInput}
                    onChange={(e) => setCrawlUrlInput(e.target.value)}
                    placeholder="https://company.com/careers/delivery-executive"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#0066FF]"
                  />
                  <button
                    type="submit"
                    disabled={crawlUrlMutation.isPending}
                    className="px-4 py-2 bg-[#0066FF] hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                  >
                    {crawlUrlMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    <span>{crawlUrlMutation.isPending ? 'Extracting...' : 'Extract Details'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Extracted Data Preview */}
            {crawledDataPreview && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Extracted Hiring Signal
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold">
                    Extraction Successful
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">Company Name:</span>
                    <strong className="text-slate-800">{crawledDataPreview.companyName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">Job Title:</span>
                    <strong className="text-slate-800">{crawledDataPreview.title}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">Location / City:</span>
                    <span className="text-slate-700">{crawledDataPreview.city || 'Detected from posting'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-medium">Salary Range:</span>
                    <span className="text-slate-700">{crawledDataPreview.salaryRange || 'Competitive'}</span>
                  </div>
                </div>

                {/* Extracted Channels */}
                <div className="pt-2 border-t border-slate-200/80 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Discovered Official Contact Channels
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {crawledDataPreview.officialEmail ? (
                      <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 flex items-center gap-1 font-mono">
                        <Mail className="w-3 h-3 text-[#0066FF]" />
                        <span>{crawledDataPreview.officialEmail}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">No direct email found</span>
                    )}

                    {crawledDataPreview.officialPhone && (
                      <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-700 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-emerald-600" />
                        <span>{crawledDataPreview.officialPhone}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Transfer to full manual ingest form with pre-filled fields
                      setNewLeadForm({
                        companyName: crawledDataPreview.companyName,
                        companyWebsite: crawledDataPreview.companyWebsite,
                        industry: 'General Trade',
                        city: crawledDataPreview.city || 'Chennai',
                        officialEmail: crawledDataPreview.officialEmail || '',
                        officialPhone: crawledDataPreview.officialPhone || '',
                        contactPageUrl: crawledDataPreview.contactPageUrl || '',
                        title: crawledDataPreview.title,
                        category: 'General Trade',
                        workersNeeded: crawledDataPreview.workersNeeded || 1,
                        salaryRange: crawledDataPreview.salaryRange || 'Competitive',
                        sourceName: crawledDataPreview.sourceName || 'Web Scrape',
                        sourceUrl: crawledDataPreview.sourceUrl,
                        description: crawledDataPreview.description || '',
                      });
                      setIsCrawlModalOpen(false);
                      setIsAddModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Edit & Ingest
                  </button>

                  <button
                    type="button"
                    disabled={manualIngestMutation.isPending}
                    onClick={() => {
                      manualIngestMutation.mutate({
                        companyName: crawledDataPreview.companyName,
                        companyWebsite: crawledDataPreview.companyWebsite,
                        industry: 'General Trade',
                        city: crawledDataPreview.city || 'Chennai',
                        officialEmail: crawledDataPreview.officialEmail || '',
                        officialPhone: crawledDataPreview.officialPhone || '',
                        contactPageUrl: crawledDataPreview.contactPageUrl || '',
                        title: crawledDataPreview.title,
                        category: 'General Trade',
                        workersNeeded: crawledDataPreview.workersNeeded || 1,
                        salaryRange: crawledDataPreview.salaryRange || 'Competitive',
                        sourceName: crawledDataPreview.sourceName || 'Web Scrape',
                        sourceUrl: crawledDataPreview.sourceUrl,
                        description: crawledDataPreview.description || '',
                      });
                      setIsCrawlModalOpen(false);
                    }}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirm & Ingest Company</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Guide & Walkthrough Modal */}
      {isGuideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-xs">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0A1931]">How Hiring Company Discovery Works</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    A quick visual guide explaining how we find businesses and bring them onto TrustHire.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGuideModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Plain English Explanation Card */}
            <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 sm:p-5 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-black text-[#0066FF] text-sm">
                <Sparkles className="w-4 h-4" />
                <span>What is a "Hiring Company Lead"?</span>
              </div>
              <p className="leading-relaxed">
                A <strong>Hiring Company</strong> is any real-world business (like a restaurant, logistics company, electrical contractor, or retail store) that has posted job requirements on the internet asking for workers.
              </p>
              <p className="leading-relaxed text-slate-600">
                Instead of waiting for employers to register on TrustHire by themselves, our engine finds them automatically, grabs their office phone and email, and lets your team call them to onboard them onto TrustHire.
              </p>
            </div>

            {/* 4-Step Interactive Diagram */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0A1931] uppercase tracking-wider">
                The 4-Step Acquisition Journey
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Step 1 */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 relative overflow-hidden">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#0066FF] text-white text-[11px] font-black flex items-center justify-center">
                      1
                    </span>
                    <h5 className="text-xs font-bold text-[#0A1931]">Automated Discovery</h5>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    The engine scans external career feeds, public boards, and structured job data (`Schema.org/JobPosting`) to find open worker requisitions.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 relative overflow-hidden">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[11px] font-black flex items-center justify-center">
                      2
                    </span>
                    <h5 className="text-xs font-bold text-[#0A1931]">Contact Verification</h5>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    The crawler visits the employer's official website domain to extract real business emails, office phone numbers, and contact forms.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 relative overflow-hidden">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-[11px] font-black flex items-center justify-center">
                      3
                    </span>
                    <h5 className="text-xs font-bold text-[#0A1931]">Team Outreach Call</h5>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Admin / BD team calls the employer: <em>"We saw you need 5 delivery drivers in Chennai. We have verified workers ready right now."</em>
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 relative overflow-hidden">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-[11px] font-black flex items-center justify-center">
                      4
                    </span>
                    <h5 className="text-xs font-bold text-[#0A1931]">1-Click Onboard</h5>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    When the employer agrees, clicking <strong>"Onboard"</strong> instantly creates their TrustHire employer profile and publishes their job post live!
                  </p>
                </div>
              </div>
            </div>

            {/* Example Box */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 text-xs">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 block">
                Real-World Walkthrough Example
              </span>
              <p className="text-slate-700 leading-relaxed">
                <strong>Example:</strong> ABC Restaurant in Chennai posts <em>"Need 5 delivery riders"</em> on their site.
              </p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                <li>Discovery crawler extracts company name, 5 driver requirement, and phone `044-2811xxxx`.</li>
                <li>TrustHire Admin calls ABC Restaurant and explains how candidates are KYC background verified.</li>
                <li>Admin clicks <strong>"Onboard to TrustHire"</strong> $\rightarrow$ ABC Restaurant's job goes live $\rightarrow$ Verified delivery drivers apply immediately!</li>
              </ul>
            </div>

            {/* Calling Tips */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Quick BD Outreach Pitch Script
              </span>
              <p className="text-slate-700 italic bg-white p-3 rounded-xl border border-slate-200/70">
                "Hello [Company Name], this is the TrustHire team in Chennai. We noticed you are currently hiring for [Job Role]. We have KYC-verified trade workers available in your area who can start immediately with zero advance placement fees. Can we share a few verified candidate profiles with you?"
              </p>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Read full technical docs in <code className="text-[#0066FF] font-mono">docs/HIRING_COMPANY_DISCOVERY_GUIDE.md</code>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsGuideModalOpen(false);
                    autoDiscoveryMutation.mutate();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <Radar className="w-3.5 h-3.5" />
                  <span>Try Auto-Discovery Now</span>
                </button>
                <button
                  onClick={() => setIsGuideModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
