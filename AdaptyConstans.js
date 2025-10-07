import Constants from 'expo-constants';

const extra = (Constants?.expoConfig?.extra) || (Constants?.manifest?.extra) || {};

export default {
  ADAPTY_API_KEY: extra.ADAPTY_PUBLIC_SDK_KEY || process.env.ADAPTY_PUBLIC_SDK_KEY,
  ACCESS_LEVEL_ID: "premium",
  PLACEMENT_ID: "premiumDV",
};