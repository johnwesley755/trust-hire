import { JobSourceAdapter } from './types';
import { LeverAtsAdapter } from './adapters/leverAtsAdapter';
import { GreenhouseAtsAdapter } from './adapters/greenhouseAtsAdapter';
import { SchemaOrgCareerPageAdapter } from './adapters/schemaOrgAdapter';
import {
  NaukriSourceAdapter,
  IndeedSourceAdapter,
  ApnaSourceAdapter,
  WorkIndiaSourceAdapter,
} from './adapters/restrictedPortalsAdapter';

export interface SourceViewItem {
  id: string;
  name: string;
  type: string;
  status: string;
  active: boolean;
  complianceNote: string;
  lastScan: string | null;
}

export class SourceAdapterRegistry {
  private static adapters: JobSourceAdapter[] = [];
  private static lastScanTimes: Record<string, string> = {};

  static init(): void {
    if (this.adapters.length > 0) return;

    this.adapters = [
      new LeverAtsAdapter(),
      new GreenhouseAtsAdapter(),
      new SchemaOrgCareerPageAdapter(),
      new WorkIndiaSourceAdapter(),
      new ApnaSourceAdapter(),
      new NaukriSourceAdapter(),
      new IndeedSourceAdapter(),
    ];
  }

  static getAllAdapters(): JobSourceAdapter[] {
    this.init();
    return this.adapters;
  }

  static getActiveAdapters(): JobSourceAdapter[] {
    this.init();
    return this.adapters.filter((a) => a.status === 'ACTIVE');
  }

  static getAdapterForUrl(url: URL): JobSourceAdapter {
    this.init();
    for (const adapter of this.adapters) {
      if (adapter.canHandleUrl(url)) {
        return adapter;
      }
    }
    // Default fallback is Schema.org career page adapter
    return this.adapters.find((a) => a.id === 'schema-org-career') || this.adapters[0];
  }

  static recordScan(sourceId: string, timestamp: Date = new Date()): void {
    this.lastScanTimes[sourceId] = timestamp.toISOString();
  }

  static getSourceList(): SourceViewItem[] {
    this.init();
    return this.adapters.map((a) => ({
      id: a.id,
      name: a.name,
      type: a.type,
      status: a.status,
      active: a.status === 'ACTIVE',
      complianceNote: a.complianceNote,
      lastScan: this.lastScanTimes[a.id] || null,
    }));
  }
}
