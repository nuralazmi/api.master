export interface JwtPayload {
  sub: string;       // user id
  email?: string;
  phone?: string;
  role: string;
  clientId: string;  // tenant client id
  iat?: number;
  exp?: number;
}
