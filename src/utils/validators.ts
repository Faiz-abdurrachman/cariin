// Validator domain email kampus — UVP #1 Cari.In.
// Hanya email dengan domain yang diizinkan boleh register/login.
// Domain dibaca dari env agar bisa diubah tanpa rebuild.

const ENV_DOMAIN = process.env.EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN;

// Fallback statis bila env belum di-set; sesuai CONTEXT.md section 8.
export const ALLOWED_DOMAIN: string = ENV_DOMAIN && ENV_DOMAIN.length > 0
  ? ENV_DOMAIN
  : 'student.unu-jogja.ac.id';

export const isValidCampusEmail = (email: string): boolean => {
  return email.trim().toLowerCase().endsWith(`@${ALLOWED_DOMAIN.toLowerCase()}`);
};

export const EMAIL_DOMAIN_ERROR = `Email harus menggunakan alamat resmi kampus (contoh: nama@${ALLOWED_DOMAIN})`;

// Validator dasar password — minimal 6 karakter sesuai default Supabase Auth.
export const isValidPassword = (password: string): boolean => {
  if (!password) return false;
  return password.length >= 6;
};

export const PASSWORD_ERROR = 'Password minimal 6 karakter.';

// NIM hanya angka, panjang 6-15 (rentang aman lintas kampus).
export const isValidNim = (nim: string): boolean => {
  return /^\d{6,15}$/.test(nim.trim());
};

export const NIM_ERROR = 'NIM harus berupa angka (6–15 digit).';
