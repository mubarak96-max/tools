import os
import re

file_path = r'c:\Users\LENOVO\Desktop\tools_project\src\components\Header.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the icon property from the tool definitions
# Example: { name: 'Word Frequency', href: '/text/word-frequency', icon: 'FREQ' }
# Note: There might be a trailing comma or not.
content = re.sub(r',\s*icon:\s*\'[^\']+\'\s*', '', content)

# Remove the desktop nav icon span
desktop_span_pattern = r'\s*<span className="shrink-0 rounded-md border border-border bg-muted px-1\.5 py-0\.5 text-\[9px\] font-bold text-primary">\s*\{tool\.icon\}\s*</span>\n?'
content = re.sub(desktop_span_pattern, '', content)

# Remove the mobile nav icon span
mobile_span_pattern = r'\s*<span className="shrink-0 rounded border border-border bg-muted px-1 text-\[8px\] font-bold text-primary">\s*\{tool\.icon\}\s*</span>\n?'
content = re.sub(mobile_span_pattern, '', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Header.tsx")
