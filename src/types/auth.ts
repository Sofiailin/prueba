export enum UserRole {
  ADMIN = 'admin',
  VETERINARIO = 'veterinario',
  DUENIO = 'duenio',
}

export interface JwtPayload {
  id: string;
  username: string;
  role: UserRole;
}