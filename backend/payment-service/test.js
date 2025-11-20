import { createClient } from "@supabase/supabase-js";
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  const { data, error } = await supabase.from("payment").select("*").limit(1);

  if (error) {
    console.error("❌ Kết nối Supabase thất bại:", error.message);
  } else {
    console.log("✅ Đã kết nối Supabase thành công!");
  }
}

testSupabaseConnection();