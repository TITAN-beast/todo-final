const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('[Supabase Config Error] SUPABASE_URL is missing from environment variables.');
}

if (!supabaseKey) {
  console.warn(
    '[Supabase Config Warning] Neither SUPABASE_SERVICE_ROLE_KEY nor SUPABASE_ANON_KEY is set. ' +
    'Please configure backend-todo/.env to connect to your Supabase database.'
  );
}

// Create Supabase client with service_role privileges for secure backend database operations
const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * Returns the active Supabase client instance.
 * Throws a descriptive error if the client has not been configured.
 */
function getSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase client is not configured. Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in backend-todo/.env'
    );
  }
  return supabase;
}

module.exports = {
  supabase,
  getSupabase,
};
