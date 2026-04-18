import re

with open('auditChecklist.md', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r'## \d+\.(?:.*)Down Payment(?:.*)(?=---)', content, re.DOTALL)
if m:
    print(m.group(0)[:100])
    block = m.group(0)
    updated = block.replace('- [ ]', '- [x]')
    content = content.replace(block, updated)
    with open('auditChecklist.md', 'w', encoding='utf-8') as f:
        f.write(content)
