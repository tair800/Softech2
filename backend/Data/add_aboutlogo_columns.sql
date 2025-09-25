-- SQL migration to add multilingual columns for AboutLogos
-- Run this against your SQLite DB if not using EF migrations
-- Columns: HeadingEn, HeadingRu, SubtextEn, SubtextRu

ALTER TABLE AboutLogos ADD COLUMN HeadingEn TEXT;
ALTER TABLE AboutLogos ADD COLUMN HeadingRu TEXT;
ALTER TABLE AboutLogos ADD COLUMN SubtextEn TEXT;
ALTER TABLE AboutLogos ADD COLUMN SubtextRu TEXT;
