-- Create a dedicated separate schema
create schema if not exists "gis";

CREATE EXTENSION IF NOT EXISTS postgis SCHEMA gis;
