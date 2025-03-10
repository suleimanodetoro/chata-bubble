// constants/Config.ts
import * as Constants from 'expo-constants';
import { Platform } from 'react-native';

// OpenAI Configuration
const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY ?? process.env.EXPO_PUBLIC_OPENAI_API_KEY;

// Supabase Configuration
const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl ?? process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey ?? process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// RevenueCat Configuration
const REVENUECAT_IOS_API_KEY = Constants.expoConfig?.extra?.revenuecatIosKey ?? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY;
const REVENUECAT_ANDROID_API_KEY = Constants.expoConfig?.extra?.revenuecatAndroidKey ?? process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY;

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not found in configuration');
}

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials not found in configuration');
}

export const Config = {
  OPENAI_API_KEY,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  REVENUECAT_IOS_API_KEY,
  REVENUECAT_ANDROID_API_KEY,
  BASE_URL: 'https://api.openai.com/v1/chat/completions',
  MODEL: 'gpt-4o',
};

// Add this type check to help debug
if (__DEV__) {
  console.log('Config initialized with:', {
    openAIKey: OPENAI_API_KEY ? 'present' : 'missing',
    supabaseUrl: SUPABASE_URL ? 'present' : 'missing',
    supabaseKey: SUPABASE_ANON_KEY ? 'present' : 'missing',
    revenuecatIosKey: REVENUECAT_IOS_API_KEY ? 'present' : 'missing',
    revenuecatAndroidKey: REVENUECAT_ANDROID_API_KEY ? 'present' : 'missing'
  });
}