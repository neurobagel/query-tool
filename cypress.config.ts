// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress';
// Populate process.env with values from .env file
import 'dotenv/config';

export default defineConfig({
  env: {
    googleRefreshToken: process.env.NB_QUERY_REFERESH_TOKEN,
    googleClientId: process.env.NB_QUERY_CLIENT_ID,
    googleClientSecret: process.env.NB_QUERY_CLIENT_SECRET,
  },
  e2e: {
    experimentalStudio: true,
    baseUrl: 'http://localhost:5173',
  },

  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
