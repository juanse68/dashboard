// Importamos el cliente de Supabase desde CDN (ESM)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// URL de tu proyecto Supabase
const SUPABASE_URL = 'https://xurqjgdrznlzixhlvhos.supabase.co';

// Key pública (anon) de tu proyecto Supabase
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1cnFqZ2Ryem5seml4aGx2aG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTk3NDQsImV4cCI6MjA2Mzc3NTc0NH0.xp-hZR9666SjTF0ylQ-J7bt1Qu01bdPvusdDeY-qw3I';

// Creamos y exportamos la instancia de Supabase para usarla en toda la app
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
