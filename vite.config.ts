/*
 * @Author: yangsen
 * @Date: 2022-04-06 11:31:01
 * @LastEditTime: 2024-12-08 21:24:44
 * @Description: file content
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 压缩代码
    minify: false,
    rollupOptions: {
      output: {
        // 定义JavaScript文件的输出路径和命名规则
        entryFileNames: "[name]-[hash].js",
        // 定义非入口文件的输出路径和命名规则
        chunkFileNames: "[name]-[hash].js",
        // 定义其他资产文件的输出路径和命名规则
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
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
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
        // note: 现在rewrite规则，是将/api替换为空，所以后端接收到的请求路径是没有/api的
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    fs: {
      strict: false,
    },
  },
});
