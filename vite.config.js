import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // load all env vars, including those without VITE_ prefix
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      // expose them to your client code
      'process.env.SCRIBE_API_URL': JSON.stringify(env.SCRIBE_API_URL),
      'process.env.SCRIBE_AUTH_TOKEN': JSON.stringify(env.SCRIBE_AUTH_TOKEN),
    },
  };
});
