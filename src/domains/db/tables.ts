import { Database } from "./supabaseTypes";

type PublicTables = Database['public']['Tables'];

// Create a type mapping for each table in `public.Tables`
// Export the `TableRows` type so you can access each table like `Tables['project']`
export type TableRows = {
  [K in keyof PublicTables]: PublicTables[K]['Row'];
};

export type TableInsert = {
  [K in keyof PublicTables]: PublicTables[K]['Insert'];
};

export type TableUpdate = {
  [K in keyof PublicTables]: PublicTables[K]['Update'];
};

export type TableRelationships = {
  [K in keyof PublicTables]: PublicTables[K]['Relationships'];
};
