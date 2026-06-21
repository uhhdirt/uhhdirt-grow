import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// If deploying to a SUBDOMAIN (grow.uhhdirt.com) leave base as '/'.
// If deploying to a SUBPATH/project site (username.github.io/REPO/), set base to '/REPO/'.
export default defineConfig({
  base: '/',
  plugins: [react()],
});
