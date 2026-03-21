import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'build', 'dist');

// Remove package.json if exists
const packageJsonPath = path.join(distDir, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  fs.unlinkSync(packageJsonPath);
}

// Handle sourcemap-register (could be .cjs or .js)
let sourcemapPath = path.join(distDir, 'sourcemap-register.cjs');
let isCjs = fs.existsSync(sourcemapPath);
if (!isCjs) {
  sourcemapPath = path.join(distDir, 'sourcemap-register.js');
}

if (fs.existsSync(sourcemapPath)) {
  let content = fs.readFileSync(sourcemapPath, 'utf8');
  
  // Patch for ESM: replace __dirname with ESM equivalent
  content = content.replace(
    /__webpack_require__\.ab=__dirname\+"\//g,
    '__webpack_require__.ab=__dirnameESM+"/"'
  );
  
  // Add __dirnameESM definition at the top
  const dirnameDef = "const __dirnameESM = fileURLToPath(new URL('.', import.meta.url));\n";
  content = "import { fileURLToPath } from 'url';\n" + dirnameDef + content;
  
  // Write as .js
  const targetPath = path.join(distDir, 'sourcemap-register.js');
  fs.writeFileSync(targetPath, content);
  
  // Remove original if it was .cjs
  if (isCjs) {
    fs.unlinkSync(sourcemapPath);
  }
  
  console.log('Patched sourcemap-register.js for ESM');
}

// Update index.js to import sourcemap-register.js (not .cjs)
const indexPath = path.join(distDir, 'index.js');
if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');
  content = content.replace("./sourcemap-register.cjs", "./sourcemap-register.js");
  fs.writeFileSync(indexPath, content);
  console.log('Updated index.js import');
}

console.log('Post-package processing complete.');
