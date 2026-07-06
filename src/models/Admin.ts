// INHERITANCE: Admin mewarisi User, lalu MENAMBAH kemampuan khusus admin
// (approveReport/rejectReport) yang tidak dimiliki Mahasiswa.

import { User } from './User';
import type { UserRole } from '@/utils/constants';
import * as reportService from '@/services/report.service';

export class Admin extends User {
  // POLYMORPHISM: override method abstract dengan perilaku spesifik admin.
  get role(): UserRole {
    return 'admin';
  }

  getRoleLabel(): string {
    return 'Administrator';
  }

  canModerate(): boolean {
    return true;
  }

  // Laporan buatan admin (walk-in) langsung tayang tanpa review.
  canPublishDirectly(): boolean {
    return true;
  }

  // Method KHUSUS Admin — tidak ada di superclass User maupun Mahasiswa.
  // Mendelegasikan ke service layer (Encapsulation: detail query tersembunyi).
  async approveReport(reportId: string, note?: string): Promise<void> {
    await reportService.approveReport(reportId, note);
  }

  async rejectReport(reportId: string, reason: string): Promise<void> {
    await reportService.rejectReport(reportId, reason);
  }
}
