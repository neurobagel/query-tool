// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/*',
    experimentalStudio: true,
    baseUrl: 'http://localhost:5173',
  },

  component: {
    specPattern: 'cypress/component/*',
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
