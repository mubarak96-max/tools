import re

with open(r'c:\Users\LENOVO\Desktop\tools_project\src\app\finance\sales-tax-canada-calculator\SalesTaxCANClient.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all non-ASCII characters
non_ascii = re.findall(r'[^\x00-\x7F]', content)
unique_chars = set(non_ascii)
for char in sorted(unique_chars):
    print(f"U+{ord(char):04X}")
