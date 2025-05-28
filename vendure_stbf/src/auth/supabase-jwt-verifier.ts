import * as jwt from "jsonwebtoken";
import "dotenv/config";

export interface SupabaseJwtPayload {
  aud: string;
  exp: number;
  sub: string;
  email?: string;
  role: string;
  user_metadata?: {
    [key: string]: unknown;
  };
}

export class SupabaseJwtVerifier {
  private supabaseJwtSecret: string;

  constructor(
    private options: {
      supabaseJwtSecret?: string;
    }
  ) {
    this.supabaseJwtSecret =
      options.supabaseJwtSecret || process.env.SUPABASE_JWT_SECRET || "";

    if (!this.supabaseJwtSecret && process.env.NODE_ENV === "production") {
      console.warn(
        "No Supabase JWT secret provided. JWT signature validation will be skipped."
      );
    }
  }

  /**
   * Verify and decode a Supabase JWT token
   */
  verifyToken(token: string): SupabaseJwtPayload | null {
    try {
      // If we have a JWT secret, perform full validation
      if (this.supabaseJwtSecret) {
        return jwt.verify(token, this.supabaseJwtSecret) as SupabaseJwtPayload;
      }

      // If no secret is available (e.g., in dev), just decode and check expiration
      const decoded = jwt.decode(token) as SupabaseJwtPayload;

      if (typeof decoded !== "object" || !decoded.exp) {
        return null; // Invalid token structure
      }

      // Basic validation of token expiration
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTime) {
        return null; // Token has expired
      }

      return decoded;
    } catch (error) {
      console.error("Error verifying Supabase JWT:", error);
      return null;
    }
  }
}
