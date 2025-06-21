import fs from 'fs';
import path from 'path';

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

console.log(`tauri.conf.json 和 Cargo.toml 版本号: ${newVersion}`); 