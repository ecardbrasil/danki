-- Migration: adiciona suporte a pastas nos decks
-- Execute no painel SQL do Supabase (https://supabase.com/dashboard → SQL Editor)

ALTER TABLE decks
  ADD COLUMN IF NOT EXISTS folder_path TEXT NOT NULL DEFAULT '';

-- Índice para buscas por pasta (opcional mas recomendado)
CREATE INDEX IF NOT EXISTS decks_folder_path_idx ON decks (user_id, folder_path);
