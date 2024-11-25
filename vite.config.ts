import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

// https://vitejs.dev/config/
export default defineConfig(({command}) => {
  return {
    plugins: [uni()],
    build: {
      rollupOptions: {
        output: {
          entryFileNames: 'assets/js/[name].[hash].js',
          chunkFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'assets/css/[name].[hash][extname]';
            }
            if (assetInfo.name?.endsWith('.png') || assetInfo.name?.endsWith('.jpg')) {
              return 'assets/images/[name].[hash][extname]';
            }
            if (assetInfo.name?.endsWith('.ttf') || assetInfo.name?.endsWith('.woff')) {
              return 'assets/fonts/[name].[hash][extname]';
            }
            // 默认情况下
            return 'assets/[name].[hash][extname]';
          },
          manualChunks(id) {
            if (id.includes("node_modules")) return 'vendor';
          }
        }
      }
    }
  }
});
