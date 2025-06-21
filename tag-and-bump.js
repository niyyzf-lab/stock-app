import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const tauriConfPath = path.join(process.cwd(), 'src-tauri', 'tauri.conf.json');
const cargoTomlPath = path.join(process.cwd(), 'src-tauri', 'Cargo.toml');

const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf-8'));
let version = tauriConf.version;

let [major, minor, micro, patch] = version.split('.').map(Number);
if (patch === undefined) {
  patch = 0;
  if (micro === undefined) {
    micro = 0;
  }
}

if (micro >= 9) {
  minor += 1;
  micro = 0;
} else {
  micro += 1;
}
patch = 0;
const newVersion = `${major}.${minor}.${micro}.${patch}`;

tauriConf.version = newVersion;
fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');

// Cargo.toml 只写三段，patch=微版本*100+补丁
const cargoPatch = micro * 100 + patch;
const cargoVersion = `${major}.${minor}.${cargoPatch}`;
let cargoToml = fs.readFileSync(cargoTomlPath, 'utf-8');
cargoToml = cargoToml.replace(/version\s*=\s*"[\d.]+"/, `version = "${cargoVersion}"`);
fs.writeFileSync(cargoTomlPath, cargoToml);

const tagName = `v${major}.${minor}.${micro}`;
try {
  execSync(`git add ${tauriConfPath} ${cargoTomlPath}`);
  execSync(`git commit -m "chore: bump version to ${newVersion}"`);
  execSync(`git tag ${tagName}`);
  execSync(`git push && git push --tags`);
  console.log(`已创建 git tag: ${tagName} 并推送到远程`);
} catch (e) {
  console.error('自动打 tag 失败，请检查 git 状态', e);
}

console.log(`tauri.conf.json 版本号: ${newVersion}，Cargo.toml 版本号: ${cargoVersion}`); 