/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) =>{
  const envVars = loadEnv(mode, process.cwd(), '');
  console.log(process.env);
  if (!envVars.NB_API_QUERY_URL) {
    throw new Error(`Environment variable NB_API_QUERY_URL is not defined.`);
  }

  return {
    preview:{
      port: 5173,
    },
    plugins: [react()],
    envPrefix: 'NB_'
  }
});
