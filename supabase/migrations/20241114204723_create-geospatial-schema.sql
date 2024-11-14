-- Create a dedicated separate schema
create schema if not exists "gis";

-- Example: enable the "postgis" extension
create extension postgis with schema "gis";

