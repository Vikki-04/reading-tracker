import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://agmpzjhzwdxmiwwvpfmf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbXB6amh6d2R4bWl3d3ZwZm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1MTYzNjgsImV4cCI6MjA5NjA5MjM2OH0.6I08VktrjEDzk3r5a0ZdsEnZSgxrqtEfyi-XVvH4HxU'

export const supabase = createClient(supabaseUrl, supabaseKey)