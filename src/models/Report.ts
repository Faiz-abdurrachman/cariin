// Domain model OOP untuk PBO — hierarki Report.
// POLYMORPHISM inti: LostReport & FoundReport punya aturan validate() berbeda.

import type { CategoryId, ReportType } from '@/utils/constants';

export interface ReportDraft {
  title: string;
  category: CategoryId;
  location: string;
  description?: string | null;
}

// ABSTRACTION: blueprint umum laporan. `validate()` & `type` wajib
// didefinisikan tiap subclass.
export abstract class ReportModel {
  // ENCAPSULATION: protected — bisa diakses subclass, tidak dari luar.
  protected readonly _title: string;
  protected readonly _category: CategoryId;
  protected readonly _location: string;
  protected readonly _description: string | null;

  constructor(draft: ReportDraft) {
    this._title = draft.title;
    this._category = draft.category;
    this._location = draft.location;
    this._description = draft.description ?? null;
  }

  get title(): string { return this._title; }
  get category(): CategoryId { return this._category; }
  get location(): string { return this._location; }
  get description(): string | null { return this._description; }

  abstract get type(): ReportType;
  abstract getTypeLabel(): string;
  // Return pesan error, atau null kalau valid.
  abstract validate(): string | null;
}

// INHERITANCE + POLYMORPHISM: laporan hilang — tidak butuh titik penitipan.
export class LostReport extends ReportModel {
  get type(): ReportType {
    return 'lost';
  }

  getTypeLabel(): string {
    return 'Barang Hilang';
  }

  validate(): string | null {
    if (this._title.trim().length === 0) return 'Judul laporan wajib diisi.';
    if (this._location.trim().length === 0) return 'Lokasi terakhir terlihat wajib diisi.';
    return null;
  }
}

// INHERITANCE + POLYMORPHISM: laporan temuan — WAJIB titik penitipan,
// sehingga validate() berperilaku beda dari LostReport.
export class FoundReport extends ReportModel {
  private readonly _custodyPoint: string;

  constructor(draft: ReportDraft & { custodyPoint: string }) {
    super(draft);
    this._custodyPoint = draft.custodyPoint;
  }

  get custodyPoint(): string {
    return this._custodyPoint;
  }

  get type(): ReportType {
    return 'found';
  }

  getTypeLabel(): string {
    return 'Barang Ditemukan';
  }

  validate(): string | null {
    if (this._title.trim().length === 0) return 'Judul laporan wajib diisi.';
    if (this._location.trim().length === 0) return 'Lokasi penemuan wajib diisi.';
    if (this._custodyPoint.trim().length === 0) {
      return 'Titik penitipan wajib diisi untuk barang temuan.';
    }
    return null;
  }
}
