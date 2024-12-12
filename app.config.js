// app.config.js
import "dotenv/config";

export default {
  expo: {
    scheme: "chatabubble",
    android: {
      package: "com.anonymous.chatabubble"
    },
    ios: {
      bundleIdentifier: "com.anonymous.chatabubble"
    },
    extra: {
      OPENAI_API_KEY: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
  },
};