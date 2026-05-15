import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vanadiumdigital.hireready',
  appName: 'HireReady',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
  },
};

export default config;
