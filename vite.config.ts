/*
 * @Author: yangsen
 * @Date: 2022-04-06 11:31:01
 * @LastEditTime: 2024-11-23 16:22:55
 * @Description: file content
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: true,
  },
  css: {
    preprocessorOptions: {
      modules: {
        // css模块化 文件以.module.[css|less|scss]结尾
        generateScopedName: "[name]__[local]___[hash:base64:5]",
        hashPrefix: "prefix",
      },
      less: {
        javascriptEnabled: true,
      },
    },
  },
  server: {
    cors: true,
    open: true,
    proxy: {
      "/api": {
        target: "http://10.1.218.202:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    fs: {
      strict: false,
    },
  },
});
