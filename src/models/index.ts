// Barrel + factory untuk model domain OOP.
// Factory memisahkan model dari AuthContext (menghindari circular dependency).

import type { ReportType } from '@/utils/constants';

import { Admin } from './Admin';
import { Mahasiswa } from './Mahasiswa';
import { LostReport, FoundReport, type ReportDraft } from './Report';
import { User } from './User';

export { User, type UserParams } from './User';
export { Mahasiswa } from './Mahasiswa';
export { Admin } from './Admin';
export { ReportModel, LostReport, FoundReport, type ReportDraft } from './Report';

export interface ProfileLike {
  id: string;
  name: string;
  email: string;
  role: string;
  nim?: string | null;
  faculty?: string | null;
  avatar_url?: string | null;
}

// POLYMORPHISM/Factory: return type User, instance konkret Mahasiswa | Admin
// ditentukan runtime dari role.
export function createUserModel(profile: ProfileLike): User {
  const params = {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    nim: profile.nim ?? null,
    faculty: profile.faculty ?? null,
    avatarUrl: profile.avatar_url ?? null,
  };
  return profile.role === 'admin' ? new Admin(params) : new Mahasiswa(params);
}

// Factory Report: pilih subclass sesuai tipe (Polymorphism).
export function createReportModel(
  type: ReportType,
  draft: ReportDraft & { custodyPoint?: string | null },
): LostReport | FoundReport {
  if (type === 'found') {
    return new FoundReport({ ...draft, custodyPoint: draft.custodyPoint ?? '' });
  }
  return new LostReport(draft);
}
