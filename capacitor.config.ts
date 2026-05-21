import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vanadiumdigital.gradsharp',
  appName: 'GradSharp',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
  },
};

export default config;
