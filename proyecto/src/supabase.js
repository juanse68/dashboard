// Importamos el cliente de Supabase desde CDN (ESM)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// URL de tu proyecto Supabase
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co';

// Key pública (anon) de tu proyecto Supabase
const SUPABASE_KEY = 'TU_ANON_KEY';

// Creamos y exportamos la instancia de Supabase para usarla en toda la app
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
