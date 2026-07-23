const SUPABASE_URL = "https://eewivekywdsmrwrgttgu.supabase.co";
const SUPABASE_KEY = "sb_publishable_7y-0oLodPiWMH19sT0gpCw_qbA0fvtg";

const { createClient } = supabase;

const db = createClient(SUPABASE_URL, SUPABASE_KEY);
