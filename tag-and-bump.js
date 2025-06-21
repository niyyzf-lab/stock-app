import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const tauriConfPath = path.join(process.cwd(), 'src-tauri', 'tauri.conf.json');
const cargoTomlPath = path.join(process.cwd(), 'src-tauri', 'Cargo.toml');

const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf-8'));
const version = tauriConf.version;

const tagName = `v${version}`;
try {
  execSync(`git add ${tauriConfPath} ${cargoTomlPath}`);
  execSync(`git commit -m "chore: tag version ${version}"`);
  execSync(`git tag ${tagName}`);
  execSync(`git push && git push --tags`);
  console.log(`已创建 git tag: ${tagName} 并推送到远程`);
} catch (e) {
  console.error('自动打 tag 失败，请检查 git 状态', e);
}

console.log(`tag-and-bump 完成，tag: ${tagName}`); 