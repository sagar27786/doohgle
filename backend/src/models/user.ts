export interface User {
  id?: number;
  email: string;
  password: string;
  // Role is now optional; roles are managed in a separate user_roles table.
  role?: 'advertiser' | 'venue_owner';
}
