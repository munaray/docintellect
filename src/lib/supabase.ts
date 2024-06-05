import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
if (!supabaseUrl) throw new Error(`Expected env var SUPABASE_URL`)

const supabaseAnon = process.env.SUPABASE_ANON_KEY
if (!supabaseAnon) throw new Error(`Expected env var SUPABASE_ANON_KEY`);

export const client = createClient(supabaseUrl, supabaseAnon)
