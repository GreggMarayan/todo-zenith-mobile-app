
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2252e67b66884586bcff9a8fd1d3e50b',
  appName: 'todo-zenith-mobile-app',
  webDir: 'dist',
  server: {
    url: 'https://2252e67b-6688-4586-bcff-9a8fd1d3e50b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
    }
  }
};

export default config;
