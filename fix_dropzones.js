const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (file.endsWith('Tool.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = [...getFiles('src/components/image'), ...getFiles('src/components/pdf')];

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // The regex finds <ImageCard> plus the wrapping flex-col div, but stops at the end of the flex-col div. It DOES NOT capture the rest of the file or the closing </ImageCard>
  const regex = /<(ImageCard|PdfCard)>\s*<div className="flex flex-col gap-4 xl:flex-row[^>]*">\s*<div>([\s\S]*?)<\/div>\s*<div className="flex[^>]*>([\s\S]*?)<\/div>\s*<\/div>/;

  const match = content.match(regex);
  if (match) {
    const cardTag = match[1];
    const titleAndDesc = match[2];
    const controls = match[3];

    // Extract FilePicker
    const filePickerRegex = /(<(?:FilePicker|PdfFilePicker)[^>]*\/>)/;
    const filePickerMatch = controls.match(filePickerRegex);
    
    if (filePickerMatch) {
      const filePickerCode = filePickerMatch[1];
      const remainingControls = controls.replace(filePickerRegex, '').trim();

      const newLayout = `<${cardTag}>
        <div className="mb-6 text-center">
${titleAndDesc}        </div>

        <div className="mx-auto w-full max-w-4xl">
          ${filePickerCode}
        </div>

        ${remainingControls.length > 5 ? `<div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">\n          ${remainingControls}\n        </div>` : ''}
      </div>`; 
      // Wait: actually the match included <ImageCard> and ONE <div> (wrapper of title and controls). So we need to ensure the HTML remains balanced.
      // match[0] starts with <ImageCard> and ends with the </div> of the main flex wrapper.
      // So newLayout replaces exactly that, without breaking trailing `{error ? ... } </PdfCard>`.
      // The original HTML had 1 flex wrapper div. Our new layout has no wrapper div for all 3 sections, they just sit inside the <PdfCard> directly.
      // Wait, <PdfCard> is a valid React node. But our `newLayout` doesn't wrap the 3 inner divs in anything. That might be fine if PdfCard takes children natively, which it does (it's just a TailwindCard).
      // Let's NOT output an extra `</div>` at the end unless we wrapped them! I'll wrap them in a fragment just in case, but they are already inside PdfCard.
      
      const correctedLayout = `<${cardTag}>
        <div className="mb-6 text-center">
          ${titleAndDesc}
        </div>

        <div className="mx-auto w-full max-w-4xl">
          ${filePickerCode}
        </div>

        ${remainingControls.length > 5 ? `<div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full">\n          ${remainingControls}\n        </div>` : ''}`;

      content = content.replace(match[0], correctedLayout);
      changed = true;
    }
  }

  if (changed) {
    content = content.replace(/className="text-2xl/g, 'className="text-3xl');
    fs.writeFileSync(file, content);
    console.log('Fixed layout in ' + file);
  }
}
