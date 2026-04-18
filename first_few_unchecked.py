import re
with open('auditChecklist.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()

current_tool = ""
tools_found = []
temp_unmarked = False

for line in lines:
    m = re.match(r'^###?\s+(?:[0-9]+\.\s*)?(.*)', line)
    if m:
        if temp_unmarked:
            tools_found.append(current_tool)
        current_tool = m.group(1).strip()
        temp_unmarked = False
    elif '- [ ]' in line:
        temp_unmarked = True
        
if temp_unmarked:
    tools_found.append(current_tool)

print("First few unchecked tools:")
for t in tools_found[:10]:
    print(t)
