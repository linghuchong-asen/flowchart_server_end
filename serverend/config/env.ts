import * as fs from 'fs';
import * as path from 'path';
const isProd = process.env.NODE_ENV === 'production';

function parseEnv() {
  const localEnvPath = path.resolve('.env');
  const prodEnvPath = path.resolve('.env.prod');
  if (!fs.existsSync(localEnvPath) && !fs.existsSync(prodEnvPath)) {
    throw new Error('没有环境配置文件');
  }
  const filePath =
    isProd && fs.existsSync(prodEnvPath) ? prodEnvPath : localEnvPath;
  return { path: filePath };
}
export default parseEnv();
