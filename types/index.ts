// types/index.ts
export interface Language {
    code: string;
    name: string;
    direction: 'ltr' | 'rtl';
    isCustom?: boolean;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    nativeLanguage: Language;
    learningLanguages: Language[];
    currentLevel: {
      [languageCode: string]: "beginner" | "intermediate" | "advanced";
    };
  }
  
  export interface ChatMessage {
    id: string;
    content: {
      original: string;
      translated: string;
    };
    sender: "user" | "assistant";
    timestamp: number;
    isEdited: boolean;
  }
  
  export interface Scenario {
    id: string;
    title: string;
    description: string;
    category: "shopping" | "dining" | "travel" | "business" | "casual";
    difficulty: "beginner" | "intermediate" | "advanced";
    persona: {
      name: string;
      role: string;
      personality: string;
      languageStyle: "formal" | "casual" | "mixed";
    };
    targetLanguage: Language; // Added field
  }
  
  export interface Session {
    id: string;
    userId: string;
    scenarioId: string;
    targetLanguage: Language;
    sourceLanguage: Language;
    messages: ChatMessage[];
    startTime: number;
    lastUpdated: number;
  }
  
  export const PREDEFINED_LANGUAGES: Language[] = [
    { code: 'es', name: 'Spanish', direction: 'ltr' },
    { code: 'fr', name: 'French', direction: 'ltr' },
    { code: 'de', name: 'German', direction: 'ltr' },
    { code: 'it', name: 'Italian', direction: 'ltr' },
    { code: 'pt', name: 'Portuguese', direction: 'ltr' },
    { code: 'ru', name: 'Russian', direction: 'ltr' },
    { code: 'ja', name: 'Japanese', direction: 'ltr' },
    { code: 'zh', name: 'Chinese', direction: 'ltr' },
    { code: 'ko', name: 'Korean', direction: 'ltr' },
    { code: 'ar', name: 'Arabic', direction: 'rtl' },
    { code: 'yo', name: 'Yoruba', direction: 'ltr' }, // Added Yoruba
    { code: 'ha', name: 'Hausa', direction: 'ltr' },  // Added Hausa
    { code: 'ig', name: 'Igbo', direction: 'ltr' },   // Added Igbo
  ];
  
  export type RootStackParamList = {
    "/(tabs)": undefined;
    "/(tabs)/index": undefined;
    "/(tabs)/scenarios": undefined;
    "/(tabs)/profile": undefined;
    "/(chat)/[id]": { id: string };
  };
  
  declare global {
    namespace ReactNavigation {
      interface RootParamList extends RootStackParamList {}
    }
  }
  