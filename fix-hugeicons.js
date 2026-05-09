const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      // Match the import statement for @hugeicons/react
      const hugeiconsImportRegex = /import\s*\{([^}]+)\}\s*from\s*['\"]@hugeicons\/react['\"]/;
      const match = content.match(hugeiconsImportRegex);
      
      if (match) {
        const importsStr = match[1];
        if (!importsStr.includes('HugeiconsIcon')) {
          // It's the old format. Get the list of imported icons
          const icons = importsStr.split(',').map(s => s.trim()).filter(Boolean);
          
          // Replace the import
          const newImport = `import { HugeiconsIcon } from "@hugeicons/react";\nimport { ${icons.join(', ')} } from "@hugeicons/core-free-icons";`;
          content = content.replace(match[0], newImport);
          
          // Replace usages
          for (const icon of icons) {
            // Match <IconName ... /> or <IconName>...</IconName>
            // Note: handles props and optional closing tags
            const tagRegex = new RegExp(`<(${icon})(\\s+[^>]*?)?\\/?>`, 'g');
            content = content.replace(tagRegex, `<HugeiconsIcon icon={$1}$2 />`);
          }
          
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed:', fullPath);
      }
    }
  }
}

processDir('./src');
