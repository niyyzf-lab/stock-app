import fs from 'fs';
import path from 'path';

const tauriConfPath = path.join(process.cwd(), 'src-tauri', 'tauri.conf.json');
const cargoTomlPath = path.join(process.cwd(), 'src-tauri', 'Cargo.toml');

// 读取 tauri.conf.json
const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf-8'));
let version = tauriConf.version;

// 只递增最后一位
let [major, minor, micro, patch] = version.split('.').map(Number);
if (patch === undefined) {
  patch = micro;
  micro = 1; // 默认补齐为 0.1.1.0
}
patch += 1;
const newVersion = `${major}.${minor}.${micro}.${patch}`;

tauriConf.version = newVersion;
fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2) + '\n');

// Cargo.toml 只写三段，patch=微版本*100+补丁
const cargoPatch = micro * 100 + patch;
const cargoVersion = `${major}.${minor}.${cargoPatch}`;
let cargoToml = fs.readFileSync(cargoTomlPath, 'utf-8');
cargoToml = cargoToml.replace(/version\s*=\s*"[\d.]+"/, `version = "${cargoVersion}"`);
fs.writeFileSync(cargoTomlPath, cargoToml);

console.log(`版本号已自动更新为 ${newVersion}`); 