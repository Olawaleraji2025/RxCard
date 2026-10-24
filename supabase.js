import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tbhriilstzvdyobyxrck.supabase.co'
const supabaseAnonKey = 'sb_publishable_-bWTvnf7NizLIUy7fY9Lew_ldKNTtXL'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

