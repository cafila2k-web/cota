import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.jk.cota',
  appName: 'COTA',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
