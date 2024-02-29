// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress';
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'

export default defineConfig({
  e2e: {
    experimentalStudio: true,
    baseUrl: 'http://localhost:5173',
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig: {
        plugins: [
          fixReactVirtualized,
        ],
      },
    },
  },
});
