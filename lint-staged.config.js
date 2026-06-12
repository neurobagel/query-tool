export default {
  '**/*.{ts,tsx}': [() => 'npm run typecheck', 'npm run lint:check'],
  '**/*': ['npm run format:check'],
};
