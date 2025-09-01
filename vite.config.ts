import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    // Expose REACT_APP_ environment variables for compatibility
    'import.meta.env.REACT_APP_EMAILJS_SERVICE_ID': JSON.stringify(process.env.REACT_APP_EMAILJS_SERVICE_ID),
    'import.meta.env.REACT_APP_EMAILJS_TEMPLATE_ID': JSON.stringify(process.env.REACT_APP_EMAILJS_TEMPLATE_ID),
    'import.meta.env.REACT_APP_EMAILJS_PUBLIC_KEY': JSON.stringify(process.env.REACT_APP_EMAILJS_PUBLIC_KEY),
  },
});