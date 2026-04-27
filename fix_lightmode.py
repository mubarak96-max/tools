import os

file_path = 'src/app/finance/capital-gains-tax-canada-calculator/page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update CustomTooltip
code = code.replace(
    'background: "#1c1a17", border: "1px solid #3a3020", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#c9b99a"',
    'background: "#ffffff", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "var(--muted2)", boxShadow: "0 4px 12px rgba(0,0,0,0.05)"'
)
code = code.replace(
    'fontWeight: 700, color: "#f0d080", marginBottom: 4',
    'fontWeight: 700, color: "var(--text)", marginBottom: 4'
)
code = code.replace(
    'color: p.color ?? "#c9b99a"',
    'color: p.color ?? "var(--muted2)"'
)

# 2. Update CSS Root Variables
old_vars = """        :root {
          --bg:       #17150f;
          --bg2:      #1c1a17;
          --bg3:      #221f18;
          --surface:  #242017;
          --surface2: #2c2820;
          --border:   #36301f;
          --border2:  #4a4030;
          --amber:    #c8962a;
          --amber2:   #e8b84b;
          --amber3:   #f0d080;
          --amber-dim:#2a1f05;
          --amber-faint: rgba(200,150,42,0.07);
          --text:     #e8dcc8;
          --muted:    #7a7060;
          --muted2:   #a89880;
          --green:    #4a9e6a;
          --green2:   #6ec48a;
          --red:      #c0402a;
          --red2:     #e05535;
          --blue:     #4a80c0;
          --font-d:   'Instrument Serif', Georgia, serif;
          --font-b:   'Nunito', sans-serif;
          --font-m:   'JetBrains Mono', monospace;
          --r:        12px;
          --glow:     0 0 40px rgba(200,150,42,0.12);
        }"""

new_vars = """        :root {
          --bg:       #fdfaf6;
          --bg2:      #f5f0e6;
          --bg3:      #ece6da;
          --surface:  #ffffff;
          --surface2: #faf8f5;
          --border:   #e8e2d8;
          --border2:  #d8cebd;
          --amber:    #d97706;
          --amber2:   #b45309;
          --amber3:   #92400e;
          --amber-dim: #fef3c7;
          --amber-faint: rgba(217, 119, 6, 0.05);
          --text:     #1c1917;
          --muted:    #a8a29e;
          --muted2:   #57534e;
          --green:    #15803d;
          --green2:   #16a34a;
          --red:      #b91c1c;
          --red2:     #dc2626;
          --blue:     #1d4ed8;
          --font-d:   'Instrument Serif', Georgia, serif;
          --font-b:   'Nunito', sans-serif;
          --font-m:   'JetBrains Mono', monospace;
          --r:        12px;
          --glow:     0 4px 20px rgba(0,0,0,0.04);
        }"""

code = code.replace(old_vars, new_vars)

# 3. Update specific css rules that were hardcoded dark mode
code = code.replace(
    'rgba(200,150,42,0.022)',
    'rgba(0,0,0,0.025)'
)
code = code.replace(
    'box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);',
    'box-shadow: inset 0 1px 0 rgba(0,0,0,0.05);'
)
code = code.replace(
    'color: rgba(0,0,0,0.7);',
    'color: #ffffff;'
)
code = code.replace(
    'background: radial-gradient(circle, rgba(200,150,42,0.1) 0%, transparent 68%);',
    'background: radial-gradient(circle, rgba(217,119,6,0.1) 0%, transparent 68%);'
)
code = code.replace(
    'background: radial-gradient(ellipse at 50% 0%, rgba(200,150,42,0.08) 0%, transparent 65%);',
    'background: radial-gradient(ellipse at 50% 0%, rgba(217,119,6,0.08) 0%, transparent 65%);'
)
code = code.replace(
    'color: #0f0d08;',
    'color: #ffffff;'
)
code = code.replace(
    'border: 1px solid rgba(200,150,42,0.3);',
    'border: 1px solid rgba(217,119,6,0.3);'
)
code = code.replace(
    'border: 1px solid rgba(200,150,42,0.35);',
    'border: 1px solid rgba(217,119,6,0.35);'
)
code = code.replace(
    'border: 1px solid rgba(200,150,42,0.25);',
    'border: 1px solid rgba(217,119,6,0.25);'
)
code = code.replace(
    'background: rgba(200,150,42,0.08);',
    'background: rgba(217,119,6,0.08);'
)

# 4. Update the waterfall bar hardcoded colors
code = code.replace('background: "#c0402a"', 'background: "var(--red2)"')
code = code.replace('background: "#b36a20"', 'background: "var(--amber)"')
code = code.replace('background: "#2a6644"', 'background: "var(--green)"')
code = code.replace('background: "#1a4a2a"', 'background: "var(--green2)"')
code = code.replace('color: "#c0402a"', 'color: "var(--red2)"')
code = code.replace('color: "#b36a20"', 'color: "var(--amber)"')
code = code.replace('color: "#2a6644"', 'color: "var(--green)"')
code = code.replace('color: "#1a4a2a"', 'color: "var(--green2)"')
code = code.replace('stroke="#c0402a"', 'stroke="var(--red2)"')
code = code.replace('stroke="#4a9e6a"', 'stroke="var(--green2)"')
code = code.replace('stopColor="#c0402a"', 'stopColor="var(--red2)"')
code = code.replace('stopColor="#4a9e6a"', 'stopColor="var(--green2)"')
code = code.replace('stroke="rgba(200,150,42,0.4)"', 'stroke="rgba(217,119,6,0.4)"')
code = code.replace('border-color: rgba(200,150,42,0.4);', 'border-color: rgba(217,119,6,0.4);')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("Light mode replacement complete.")
