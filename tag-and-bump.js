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
const cargoTomlPath = path.join(process.cwd(), 'src-tauri', 'Cargo.toml');

// 读取 tauri.conf.json
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf-8'));
let version = tauriConf.version;

// 只保留三段，全部前进一位
let [major, minor, patch, extra] = version.split('.').map(Number);
if (extra !== undefined) {
  major = minor;
  minor = patch;
  patch = extra;
}
patch += 1;
const newVersion = `${major}.${minor}.${patch}`;

tauriConf.version = newVersion;
fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');

let cargoToml = fs.readFileSync(cargoTomlPath, 'utf-8');
cargoToml = cargoToml.replace(/version\s*=\s*"[\d.]+"/, `version = "${newVersion}"`);
fs.writeFileSync(cargoTomlPath, cargoToml);

console.log(`tauri.conf.json 和 Cargo.toml 版本号已递增为: ${newVersion}`);

const tagName = `v${newVersion}`;
try {
  // 先提交并推送版本号变更
  execSync(`git add ${tauriConfPath} ${cargoTomlPath}`);
  execSync(`git commit -m "chore: bump version to ${newVersion}"`);
  execSync(`git push`);
  // 再打 tag 并推送 tag
  execSync(`git tag ${tagName}`);
  execSync(`git push origin ${tagName}`);
  console.log(`已创建 git tag: ${tagName} 并推送到远程`);
} catch (e) {
  console.error('自动打 tag 失败，请检查 git 状态\n详细信息:', e.message || e);
  process.exit(1);
}

console.log(`tag-and-bump 完成，tag: ${tagName}`); 