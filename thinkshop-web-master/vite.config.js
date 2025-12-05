import { defineConfig, loadEnv } from 'vite'
import createVitePlugins from './vite'
import path from 'path'


// https://vitejs.dev/config/
export default defineConfig(({mode, command}) => {
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env

  return {
    // 部署路径
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: createVitePlugins(env, command === 'build'),
    resolve: {
      alias: {
        // 设置路径
        '~': path.resolve(__dirname, './'),
        // 设置别名
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
      port: 8087,
      host: true,
      open: true,
      proxy: {
        '/stage-api': {
          target: 'http://120.25.120.136',
          changeOrigin: true
        }
      }
    },
  }
})
