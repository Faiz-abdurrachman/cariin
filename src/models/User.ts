// Domain model OOP untuk PBO — hierarki User.
// Mendemonstrasikan pilar OOP: Abstraction (abstract class + abstract method),
// Encapsulation (field private + getter), diwarisi oleh Mahasiswa & Admin.

import type { UserRole } from '@/utils/constants';

export interface UserParams {
  id: string;
  name: string;
  email: string;
  nim?: string | null;
  faculty?: string | null;
  avatarUrl?: string | null;
}

// ABSTRACTION: `abstract class` tidak bisa di-instansiasi langsung
// (`new User()` error). Hanya jadi blueprint untuk subclass.
export abstract class User {
  // ENCAPSULATION: field private — tidak bisa diakses/diubah dari luar class.
  private readonly _id: string;
  private _name: string;
  private readonly _email: string;
  private _nim: string | null;
  private _faculty: string | null;
  private _avatarUrl: string | null;

  constructor(params: UserParams) {
    this._id = params.id;
    this._name = params.name;
    this._email = params.email;
    this._nim = params.nim ?? null;
    this._faculty = params.faculty ?? null;
    this._avatarUrl = params.avatarUrl ?? null;
  }

  // ENCAPSULATION: getter — akses terkontrol (read-only) ke field private.
  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get email(): string { return this._email; }
  get nim(): string | null { return this._nim; }
  get faculty(): string | null { return this._faculty; }
  get avatarUrl(): string | null { return this._avatarUrl; }

  // ENCAPSULATION: setter dengan validasi — ubah nama tidak boleh kosong.
  set name(value: string) {
    if (value.trim().length === 0) throw new Error('Nama tidak boleh kosong.');
    this._name = value.trim();
  }

  get initial(): string {
    return this._name.trim().charAt(0).toUpperCase() || '?';
  }

  // ABSTRACTION: kontrak yang WAJIB diimplementasi tiap subclass dengan
  // perilaku berbeda (dasar Polymorphism).
  abstract get role(): UserRole;
  abstract getRoleLabel(): string;
  abstract canModerate(): boolean;
}
