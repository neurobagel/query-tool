// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'cypress';
import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

export default defineConfig({
  viewportWidth: 1200,
  viewportHeight: 720,
  e2e: {
    specPattern: 'cypress/e2e/*',
    experimentalStudio: true,
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on) {
      on('task', {
        getLatestFile(pattern) {
          const files = globSync(pattern);

          if (!files.length) {
            return null;
          }

          const latestFile = files
            .map((file) => ({
              file,
              mtime: fs.statSync(file).mtime.getTime(),
            }))
            .sort((a, b) => b.mtime - a.mtime)[0].file;

          return path.resolve(latestFile);
        },
      });
    },
  },

  component: {
    specPattern: ['cypress/component/*', 'cypress/unit/*'],
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
  },
});
