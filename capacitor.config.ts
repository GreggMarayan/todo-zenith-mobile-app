
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2252e67b66884586bcff9a8fd1d3e50b',
  appName: 'todo-zenith-mobile-app',
  webDir: 'dist',
  server: {
    cleartext: true,
    androidScheme: "https",
    allowNavigation: ["todo-list.dcism.org"]
  },
};

export default config;
