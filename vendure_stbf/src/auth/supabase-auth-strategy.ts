import { createClient } from "@supabase/supabase-js";
import {
  AuthenticationStrategy,
  ExternalAuthenticationService,
  Injector,
  RequestContext,
  User,
} from "@vendure/core";

import "dotenv/config";

import { DocumentNode } from "graphql/language";

import { SupabaseJwtVerifier } from "./supabase-jwt-verifier";

export class SupabaseAuthStrategy implements AuthenticationStrategy {
  readonly name = "supabase";
  private externalAuthenticationService: ExternalAuthenticationService;
  private supabaseUrl: string;
  private supabaseAnonKey: string;
  private jwtVerifier: SupabaseJwtVerifier;

  constructor(
    private options: {
      supabaseUrl?: string;
      supabaseAnonKey?: string;
      supabaseJwtSecret?: string;
    }
  ) {
    this.supabaseUrl =
      options.supabaseUrl || process.env.VITE_SUPABASE_URL || "";
    this.supabaseAnonKey =
      options.supabaseAnonKey || process.env.VITE_SUPABASE_ANON_KEY || "";

    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error(
        "Supabase URL and anon key must be provided for SupabaseAuthStrategy"
      );
    }

    this.jwtVerifier = new SupabaseJwtVerifier({
      supabaseJwtSecret: options.supabaseJwtSecret,
    });
  }

  init(injector: Injector) {
    this.externalAuthenticationService = injector.get(
      ExternalAuthenticationService
    );
  }

  async authenticate(
    ctx: RequestContext,
    token: string
  ): Promise<User | false> {
    try {
      // First, validate the JWT locally
      const decodedToken = this.jwtVerifier.verifyToken(token);

      if (!decodedToken) {
        return false;
      }

      // As a secondary verification, check with Supabase API
      const supabase = createClient(this.supabaseUrl, this.supabaseAnonKey);
      const { data: user, error } = await supabase.auth.getUser(token);

      if (error) {
        return false;
      }

      // Extract user information from Supabase user
      const supabaseUser = user.user;

      // Use the external authentication service to either find an existing user
      // or create a new one that matches this external identity
      const externalUser = await this.externalAuthenticationService
        .findUser(ctx, this.name, supabaseUser.id.toString())
        .then((existingUser) => {
          if (existingUser) {
            return existingUser;
          }

          // If no user was found, we need to create a new one
          return this.externalAuthenticationService.createUser(ctx, {
            strategy: this.name,
            externalIdentifier: supabaseUser.id.toString(),
          });
        });
      return externalUser;
    } catch (err) {
      console.error("Error authenticating with Supabase:", err);
      return false;
    }
  }

  // Define GraphQL operation for this strategy (not required for bearer token usage)
  defineInputType(): DocumentNode {
    // We're using bearer tokens, so no special input type is needed
    // Return an empty DocumentNode
    return {} as DocumentNode;
  }
}
