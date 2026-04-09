const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (file === 'page.tsx') {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = [...getFiles('src/app/finance'), ...getFiles('src/app/text')];

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  const category = file.includes('finance') ? 'Finance' : 'Text';
  const categoryHref = file.includes('finance') ? '/finance' : '/text';

  // 1. Add Import
  if (!content.includes('RelatedToolsSection')) {
    if (content.includes('FREE_TOOLS')) {
      content = content.replace(
        'import { FREE_TOOLS', 
        'import { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";\nimport { FREE_TOOLS'
      );
      changed = true;
    } else if (content.includes('import Link from "next/link";')) {
      content = content.replace(
        'import Link from "next/link";',
        'import Link from "next/link";\nimport { PrivacyNote, RelatedToolsSection } from "@/components/tools/ToolPageScaffold";'
      );
      changed = true;
    }
  }

  // 2. Add Privacy Note at the end of the top glass-card
  // Only looking for `<div className="max-w-3xl">` ... `<h1` ... `</section>`
  if (!content.includes('<PrivacyNote />')) {
    const headerRegex = /(<div className="max-w-3xl">[\s\S]*?)<\/section>/;
    const match = content.match(headerRegex);
    if (match) {
      const headerContent = match[1];
      const withPrivacy = headerContent + '\n        <div className="mt-6 max-w-2xl">\n          <PrivacyNote />\n        </div>\n      </section>';
      content = content.replace(match[0], withPrivacy);
      changed = true;
    }
  }

  // 3. Replace Related tools
  const relatedToolsRegex = /<section className="glass-card rounded-\[1\.75rem\] border border-border\/80 p-6 sm:p-8">\s*<.*?Related(?: text)? tools.*?<\/h2>[\s\S]*?<\/div>\s*<\/section>/;
  if (relatedToolsRegex.test(content)) {
    content = content.replace(relatedToolsRegex, `<RelatedToolsSection category="${category}" categoryHref="${categoryHref}" currentPath={PAGE_PATH} />`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}
