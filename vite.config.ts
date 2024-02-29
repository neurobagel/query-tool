/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const envVars = loadEnv(mode, process.cwd(), '');
  if (!envVars.NB_API_QUERY_URL) {
    throw new Error(`Environment variable NB_API_QUERY_URL is not defined.`);
  }

  // fixReactVirtualized plugin is added here as a fix for a dependency
  // currently present in react-vritualized
  // see: https://github.com/bvaughn/react-virtualized/issues/1722#issuecomment-1911672178
  return {
    preview: {
      port: 5173,
    },
    plugins: [react(), fixReactVirtualized,],
    envPrefix: 'NB_',
  };
});
