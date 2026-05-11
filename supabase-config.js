/**
 * Supabase Configuration - Shared Across All Pages
 * Place this file before other scripts in HTML head/body
 */

const SUPABASE_CONFIG = {
  URL: "https://kjnvbposqpncmeedyzjw.supabase.co",
  KEY: "sb_publishable_q1fRfGhAGa39SRxMoDQ2wQ_nK7gcJG7"
};

// Initialize Supabase globally
let supabaseClient = null;

function initSupabase() {
  if (typeof window.supabase === 'undefined') {
    console.error("Supabase library not loaded!");
    return false;
  }
  supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.KEY);
  return true;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSupabase);
} else {
  initSupabase();
}

// Utility functions for all pages
async function fetchFromSupabase(table, query = null) {
  try {
    let request = supabaseClient.from(table).select('*');
    if (query) request = Object.keys(query).reduce((req, key) => req.eq(key, query[key]), request);
    const { data, error } = await request;
    if (error) throw error;
    return data;
  } catch (err) {
    console.error(`Error fetching ${table}:`, err);
    return null;
  }
}

async function insertToSupabase(table, record) {
  try {
    const { data, error } = await supabaseClient.from(table).insert([record]).select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (err) {
    console.error(`Error inserting to ${table}:`, err);
    return null;
  }
}

async function updateSupabase(table, id, updates) {
  try {
    const { data, error } = await supabaseClient.from(table).update(updates).eq('id', id).select();
    if (error) throw error;
    return data?.[0] || null;
  } catch (err) {
    console.error(`Error updating ${table}:`, err);
    return null;
  }
}

async function deleteFromSupabase(table, id) {
  try {
    const { data, error } = await supabaseClient.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.error(`Error deleting from ${table}:`, err);
    return false;
  }
}

// Quote Calculator Utility
function calculateQuote(serviceType, additionalServices = {}) {
  const baseQuote = {
    'notarial_act': 5,
    'mobile_service': 25,
    'refinance': 125,
    'purchase_sale': 150,
    'heloc': 100,
    'power_of_attorney': 40,
    'will': 50,
    'trust': 60,
    'advance_directive': 40
  };

  let total = baseQuote[serviceType] || 0;

  if (additionalServices.afterHours) total += 15;
  if (additionalServices.rushService) total += 20;
  if (additionalServices.additionalSigners) total += (5 * additionalServices.additionalSigners);

  return total;
}
