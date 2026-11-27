const baseUrl = process.env.EXPO_PUBLIC_API_URL;

if (!baseUrl) {
  throw new Error('Set EXPO_PUBLIC_API_URL in frontend/.env');
}

export const BASE_URL = baseUrl;