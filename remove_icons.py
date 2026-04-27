import os
import re
import glob

base_dir = r'c:\Users\LENOVO\Desktop\tools_project\src\app'
files_to_check = glob.glob(os.path.join(base_dir, '**', 'page.tsx'), recursive=True)

span_pattern = re.compile(r'\s*<span className="shrink-0 rounded-lg border border-border bg-muted p-2 text-\[10px\] font-black text-primary\">\s*\{tool\.icon\}\s*</span>\n?', re.MULTILINE)
icon_pattern = re.compile(r'\s*icon:\s*".*?",?\n', re.MULTILINE)

for file_path in files_to_check:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    new_content = span_pattern.sub('', new_content)
    new_content = icon_pattern.sub('\n', new_content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {file_path}')
