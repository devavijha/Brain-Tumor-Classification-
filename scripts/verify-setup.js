#!/usr/bin/env node

/**
 * Setup Verification Script
 * Checks if everything is properly configured for development/deployment
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Brain Tumor Classifier - Setup Verification\n');
console.log('=' .repeat(50));

const checks = [];

// Check 1: Node.js version
console.log('\n📦 Checking Node.js version...');
const nodeVersion = parseInt(process.version.slice(1).split('.')[0]);
if (nodeVersion >= 18) {
  console.log(`✅ Node.js ${process.version} (Required: 18+)`);
  checks.push(true);
} else {
  console.log(`❌ Node.js ${process.version} (Required: 18+)`);
  checks.push(false);
}

// Check 2: Required files
console.log('\n📁 Checking required files...');
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'app/page.tsx',
  'app/layout.tsx',
  'app/globals.css',
  'app/api/predict/route.ts',
  'components/ImageUploader.tsx',
  'components/ResultsDisplay.tsx',
  '.env.example',
];

let filesOk = true;
for (const file of requiredFiles) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} (MISSING)`);
    filesOk = false;
  }
}
checks.push(filesOk);

// Check 3: Model file
console.log('\n🧠 Checking model file...');
const modelPath = path.join(__dirname, '..', 'public', 'models', 'brain_tumor_model.onnx');
if (fs.existsSync(modelPath)) {
  const stats = fs.statSync(modelPath);
  const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`✅ brain_tumor_model.onnx (${sizeMB}MB)`);
  checks.push(true);
} else {
  console.log(`⚠️  brain_tumor_model.onnx (NOT FOUND - Required for deployment)`);
  console.log(`    Place at: public/models/brain_tumor_model.onnx`);
  console.log(`    See docs/MODEL_SETUP.md for conversion guide`);
  checks.push(false);
}

// Check 4: Directories structure
console.log('\n📂 Checking directory structure...');
const requiredDirs = [
  'app',
  'components',
  'lib',
  'hooks',
  'types',
  'public',
  'docs',
  'scripts',
];

let dirsOk = true;
for (const dir of requiredDirs) {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ (MISSING)`);
    dirsOk = false;
  }
}
checks.push(dirsOk);

// Check 5: Environment file
console.log('\n🔐 Checking environment files...');
const envLocalPath = path.join(__dirname, '..', '.env.local');
const envExamplePath = path.join(__dirname, '..', '.env.example');

if (fs.existsSync(envLocalPath)) {
  console.log(`✅ .env.local`);
} else {
  console.log(`⚠️  .env.local (Not critical, will use defaults)`);
}

if (fs.existsSync(envExamplePath)) {
  console.log(`✅ .env.example`);
  checks.push(true);
} else {
  console.log(`❌ .env.example (MISSING)`);
  checks.push(false);
}

// Check 6: npm packages
console.log('\n📚 Checking npm packages...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const criticalDeps = ['next', 'react', 'react-dom', 'tailwindcss'];
let depsOk = true;

for (const dep of criticalDeps) {
  if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} (NOT IN package.json)`);
    depsOk = false;
  }
}
checks.push(depsOk);

// Check 7: Build configuration
console.log('\n⚙️  Checking build configuration...');
const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log(`✅ next.config.js`);
  checks.push(true);
} else {
  console.log(`❌ next.config.js`);
  checks.push(false);
}

// Check 8: TypeScript
console.log('\n📘 Checking TypeScript...');
const tsconfigPath = path.join(__dirname, '..', 'tsconfig.json');
if (fs.existsSync(tsconfigPath)) {
  console.log(`✅ tsconfig.json`);
  checks.push(true);
} else {
  console.log(`❌ tsconfig.json`);
  checks.push(false);
}

// Summary
console.log('\n' + '='.repeat(50));

const passedChecks = checks.filter(Boolean).length;
const totalChecks = checks.length;
const percentage = Math.round((passedChecks / totalChecks) * 100);

console.log(`\n📊 Results: ${passedChecks}/${totalChecks} checks passed (${percentage}%)\n`);

if (percentage === 100) {
  console.log('✅ All checks passed! You\'re ready to go.');
  console.log('\n📚 Next steps:');
  console.log('   1. npm install');
  console.log('   2. npm run dev');
  console.log('   3. Open http://localhost:3000\n');
  process.exit(0);
} else if (percentage >= 80) {
  console.log('⚠️  Most checks passed, but some issues found.');
  console.log('   See above for details.\n');
  process.exit(1);
} else {
  console.log('❌ Several critical issues found.');
  console.log('   See above for details.\n');
  console.log('   📖 Need help? Check:');
  console.log('      - docs/QUICK_START.md');
  console.log('      - docs/MODEL_SETUP.md');
  console.log('      - README.md\n');
  process.exit(1);
}
