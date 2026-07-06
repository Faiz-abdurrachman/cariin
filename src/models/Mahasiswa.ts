// INHERITANCE: Mahasiswa mewarisi seluruh sifat & method dari class User.

import { User } from './User';
import type { UserRole } from '@/utils/constants';

export class Mahasiswa extends User {
  // POLYMORPHISM: override method abstract dari User dengan perilaku spesifik
  // mahasiswa.
  get role(): UserRole {
    return 'mahasiswa';
  }

  getRoleLabel(): string {
    return 'Mahasiswa';
  }

  canModerate(): boolean {
    return false;
  }

  // Laporan buatan mahasiswa selalu masuk antrean review admin dulu.
  canPublishDirectly(): boolean {
    return false;
  }
}
