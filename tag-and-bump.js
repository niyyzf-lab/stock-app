import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 检查是否存在未提交的更改
const uncommitted = execSync('git status --porcelain').toString().trim();
if (uncommitted) {
  console.error('检测到存在未提交的更改，请先提交或还原后再运行本脚本。');
  process.exit(1);
}

const tauriConfPath = path.join(process.cwd(), 'src-tauri', 'tauri.conf.json');
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf-8'));
const version = tauriConf.version;
const tagName = `v${version}`;

try {
  execSync(`git tag ${tagName}`);
  execSync(`git push origin ${tagName}`);
  console.log(`已创建 git tag: ${tagName} 并推送到远程`);
} catch (e) {
  console.error('自动打 tag 失败，请检查 git 状态\n详细信息:', e.message || e);
  process.exit(1);
}

console.log(`tag-and-bump 完成，tag: ${tagName}`); 