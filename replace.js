const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content
    .replace(/womanu/g, 'womenu')
    .replace(/Womanu/g, 'Womenu')
    .replace(/WOMANU/g, 'WOMENU');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated content in ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css') || fullPath.endsWith('.html') || fullPath.endsWith('.md')) {
        replaceInFile(fullPath);
      }
    }
  }
}

function renameFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      renameFiles(fullPath);
    } else {
      let newName = file
        .replace(/womanu/g, 'womenu')
        .replace(/Womanu/g, 'Womenu')
        .replace(/WOMANU/g, 'WOMENU');
      if (newName !== file) {
        const newPath = path.join(dir, newName);
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed ${file} to ${newName}`);
      }
    }
  }
}

const targetDir = path.join(__dirname, 'src');
walkDir(targetDir);
renameFiles(path.join(targetDir, 'components'));
renameFiles(path.join(targetDir, 'data'));
