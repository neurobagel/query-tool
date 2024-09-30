/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envVars = loadEnv(mode, process.cwd(), '');
  if (!envVars.NB_API_QUERY_URL) {
    throw new Error('Environment variable NB_API_QUERY_URL is not defined.');
  }

  if (envVars.NB_ENABLE_AUTH && envVars.NB_ENABLE_AUTH.toLowerCase() === 'true') {
    if (!envVars.NB_QUERY_CLIENT_ID) {
      throw new Error('Environment variable NB_QUERY_CLIENT_ID is not defined.');
    }
  }

  return {
    preview: {
      port: 5173,
      strictPort: true,
      host: true,
    },
    plugins: [react()],
    envPrefix: 'NB_',
  };
});
