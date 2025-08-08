export interface User {
  id?: number;
  email: string;
  password: string;
  role: 'advertiser' | 'venue_owner';
}
