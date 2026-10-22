import { Context } from 'hono';
import { LeadService } from '../services/leadService';

export class LeadController {
  static async getLeads(c: Context) {
    try {
      const status = c.req.query('status') || 'ALL';
      const contactability = c.req.query('contactability') || 'ALL';
      const city = c.req.query('city') || 'ALL';
      const category = c.req.query('category') || 'ALL';
      const sortBy = c.req.query('sortBy') || 'NEWEST';
      const q = c.req.query('q') || '';
      const page = parseInt(c.req.query('page') || '1', 10);
      const limit = parseInt(c.req.query('limit') || '10', 10);

      const result = await LeadService.getLeads({
        status,
        contactability,
        city,
        category,
        sortBy,
        q,
        page,
        limit
      });

      return c.json({ success: true, ...result });
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      return c.json({ success: false, error: error.message || 'Failed to fetch leads' }, 500);
    }
  }

  static async getLeadStats(c: Context) {
    try {
      const stats = await LeadService.getLeadStats();
      return c.json({ success: true, stats, data: stats });
    } catch (error: any) {
      console.error('Error fetching lead stats:', error);
      return c.json({ success: false, error: error.message || 'Failed to fetch lead stats' }, 500);
    }
  }

  static async ingestLead(c: Context) {
    try {
      const body = await c.req.json();
      if (!body.companyName || !body.requirements || !Array.isArray(body.requirements)) {
        return c.json({ success: false, error: 'companyName and requirements array are required' }, 400);
      }

      const result = await LeadService.ingestLead(body);
      return c.json({ success: true, ...result, data: result }, 201);
    } catch (error: any) {
      console.error('Error ingesting lead:', error);
      return c.json({ success: false, error: error.message || 'Failed to ingest lead' }, 500);
    }
  }

  static async batchIngest(c: Context) {
    try {
      const body = await c.req.json();
      const leads = Array.isArray(body) ? body : body.leads;

      if (!leads || !Array.isArray(leads)) {
        return c.json({ success: false, error: 'Array of leads is required' }, 400);
      }

      const processed = [];
      for (const item of leads) {
        if (item.companyName && Array.isArray(item.requirements)) {
          const res = await LeadService.ingestLead(item);
          processed.push(res);
        }
      }

      return c.json({ success: true, count: processed.length, results: processed }, 201);
    } catch (error: any) {
      console.error('Error in batch ingest:', error);
      return c.json({ success: false, error: error.message || 'Failed to process batch ingestion' }, 500);
    }
  }

  static async updateLeadStatus(c: Context) {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'Lead ID is required' }, 400);
      }
      const { status } = await c.req.json();

      if (!status) {
        return c.json({ success: false, error: 'Status is required' }, 400);
      }

      const updated = await LeadService.updateLeadStatus(id, status);
      return c.json({ success: true, lead: updated });
    } catch (error: any) {
      console.error('Error updating lead status:', error);
      return c.json({ success: false, error: error.message || 'Failed to update status' }, 500);
    }
  }

  static async logOutreach(c: Context) {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'Lead ID is required' }, 400);
      }
      const user = c.get('user');
      const adminId = user?.userId || user?.id || 'ADMIN';
      const body = await c.req.json();

      if (!body.channel || !body.notes) {
        return c.json({ success: false, error: 'channel and notes are required' }, 400);
      }

      const log = await LeadService.logOutreach(id, adminId, body);
      return c.json({ success: true, log }, 201);
    } catch (error: any) {
      console.error('Error logging outreach:', error);
      return c.json({ success: false, error: error.message || 'Failed to log outreach' }, 500);
    }
  }

  static async convertLead(c: Context) {
    try {
      const id = c.req.param('id');
      if (!id) {
        return c.json({ success: false, error: 'Lead ID is required' }, 400);
      }
      const result = await LeadService.convertLeadToEmployer(id);
      return c.json({ success: true, ...result });
    } catch (error: any) {
      console.error('Error converting lead:', error);
      return c.json({ success: false, error: error.message || 'Failed to convert lead' }, 500);
    }
  }

  static async runAutoDiscovery(c: Context) {
    try {
      const { LeadCrawlerService } = await import('../services/leadCrawlerService');
      const results = await LeadCrawlerService.runAutoDiscovery();
      return c.json({
        success: true,
        sourcesScanned: results.sourceBreakdown?.length || results.totalScanned,
        durationMs: results.session?.totalDurationMs,
        ...results
      });
    } catch (error: any) {
      console.error('Error running auto-discovery:', error);
      return c.json({ success: false, error: error.message || 'Failed to run discovery scan' }, 500);
    }
  }

  static async crawlUrl(c: Context) {
    try {
      const { url } = await c.req.json();
      if (!url) {
        return c.json({ success: false, error: 'Target URL is required' }, 400);
      }

      const { LeadCrawlerService } = await import('../services/leadCrawlerService');
      const crawled = await LeadCrawlerService.crawlUrl(url);
      return c.json({
        success: true,
        data: crawled.lead,
        lead: crawled.lead, // For backwards compatibility
        logs: crawled.logs,
        session: crawled.session
      });
    } catch (error: any) {
      console.error('Error crawling URL:', error);
      return c.json({
        success: false,
        error: error.message || 'Failed to scrape target URL',
        message: error.message || 'Failed to scrape target URL'
      }, 400);
    }
  }

  static async getSources(c: Context) {
    try {
      const { SourceAdapterRegistry } = await import('../services/discovery/sourceAdapterRegistry');
      const sources = SourceAdapterRegistry.getSourceList();
      return c.json({ success: true, data: sources, sources });
    } catch (error: any) {
      console.error('Error fetching sources:', error);
      return c.json({ success: false, error: error.message || 'Failed to fetch sources' }, 500);
    }
  }
}
