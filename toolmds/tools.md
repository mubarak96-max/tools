# Tools Roadmap

This file replaces the old raw dump.

The original list had:
- heavy duplication
- many near-identical variants
- many tools already built
- many low-value one-off generators that should not be built as separate pages

Use this as the working roadmap instead.

## Legend

- `Already built`: live in the product already
- `High-priority next`: worth building as standalone utility pages
- `Low-value / skip`: not worth building now, or should be merged into broader tools instead of made into separate pages

## Already Built

### AI

- AI Humanizer

### Finance

- Salary Calculator
- UAE Salary Calculator
- Mortgage Calculator
- EMI Calculator
- Car Loan Calculator
- Discount Calculator
- VAT Calculator
- Profit Margin Calculator
- Compound Interest Calculator

### Text

- Character Counter
- Word Frequency Counter
- Case Converter
- Duplicate Word Finder
- Em Dash Remover
- Strikethrough Text
- Reverse Text Generator
- Morse Code Translator
- Binary Code Translator
- ASCII Art Generator
- Image to Text OCR
- Word Cloud Generator
- Remove Duplicate Lines

## High-Priority Next

These are the best remaining candidates from the original list after deduping and removing built tools.

### Text Cleanup and Editing

- Empty Line Remover
- Trim Text Lines
- Truncate Text Lines
- Word Wrapper
- Text Replacer
- Text Line Joiner
- Text Line Filter
- Text Line Reverser
- Add Line Numbers
- Add Line Prefixes
- Add Line Suffixes
- Prefix and Suffix Text Lines
- Spaces to Tabs Converter
- Tabs to Spaces Converter
- Spaces to Newlines Converter
- Newlines to Spaces Converter
- Extra Whitespaces Remover
- All Whitespaces Remover
- Punctuation Mark Remover
- Character Accent Remover
- Backslash Remover
- Backslash Adder
- Center Text
- Left-Pad Text
- Right-Pad Text
- Justify Text

Why high priority:
- strong utility intent
- simple to implement
- easy SEO targeting
- pairs well with your existing text tool cluster

### Text Extraction and Analysis

- Email Extractor
- URL Extractor
- Number Extractor
- Regex Match Extractor
- Regex Match Replacer
- Text Statistics
- Phrase Frequency Calculator
- Find Longest Text Line
- Find Shortest Text Line
- Word Splitter
- Word Sorter
- Alphabetic Text Sorter
- Numeric Text Sorter
- Text by Length Sorter

Why high priority:
- complements your current text analysis tools
- useful for writers, developers, and ops users

### Encoding, Decoding, and Simple Conversion

- URL Encoder
- URL Decoder
- URL Parser
- HTML Encoder
- HTML Decoder
- Base64 Encoder
- Base64 Decoder
- Base32 Encoder
- Base32 Decoder
- Base58 Encoder
- Base58 Decoder
- Ascii85 Encoder
- Ascii85 Decoder
- UTF8 Encoder
- UTF8 Decoder
- UTF16 Encoder
- UTF16 Decoder
- Punycode Encoder
- Punycode Decoder
- IDN Encoder
- IDN Decoder
- ROT13 Encoder/Decoder
- ROT47 Encoder/Decoder
- Text to ASCII Codes Converter
- ASCII to Text Converter
- Text to Hex Converter
- Hex to Text Converter
- Text to Octal Converter
- Octal to Text Converter
- Text to Decimal Converter
- Decimal to Text Converter

Why high priority:
- clear search intent
- clean standalone pages
- reusable implementation patterns

### Developer Formatters and Validators

- HTML Prettifier
- HTML Minifier
- JSON Prettifier
- JSON Minifier
- JSON Validator
- JSON Escaper
- JSON Unescaper
- JS Prettifier
- JS Minifier
- JS Validator
- CSS Prettify
- CSS Minifier
- XML Prettifier
- XML Minifier

Why high priority:
- high practical use
- strong developer utility cluster
- good internal linking opportunity if you later add a developer-tools hub

### Data Format Converters

- JSON to CSV Converter
- CSV to JSON Converter
- JSON to YAML Converter
- YAML to JSON Converter
- JSON to XML Converter
- XML to JSON Converter
- XML to CSV Converter
- CSV to XML Converter
- XML to YAML Converter
- YAML to XML Converter
- JSON to TSV Converter
- TSV to JSON Converter
- CSV to YAML Converter
- YAML to CSV Converter
- CSV to TSV Converter
- TSV to CSV Converter
- XML to TSV Converter
- TSV to XML Converter
- XML to Text Converter
- JSON to Text Converter
- HTML to Markdown Converter
- Markdown to HTML Converter
- HTML to Text Converter
- HTML Stripper

Why high priority:
- this is a strong cluster, but should be built as focused converters with consistent UI
- especially valuable if grouped under one data-conversion section

### Spreadsheet and Column Utilities

- CSV Transposer
- CSV Columns to Rows Converter
- CSV Rows to Columns Converter
- CSV Column Exporter
- CSV Column Replacer
- CSV Column Inserter
- CSV Column Deleter
- CSV Delimiter Changer
- TSV Transposer
- TSV Columns to Rows Converter
- TSV Rows to Columns Converter
- TSV Column Exporter
- TSV Column Replacer
- TSV Column Inserter
- TSV Column Deleter
- TSV Delimiter Changer
- Text Columns to CSV Converter
- CSV to Text Columns Converter
- Text Columns to TSV Converter
- TSV to Text Columns Converter
- Text Transposer
- Text Column Swapper
- Text Column Delimiter Changer

Why high priority:
- useful, but should be built after the core text/dev tools
- best launched as a coherent spreadsheet-tools batch

### Time, Unit, and Everyday Converters

- UNIX time to UTC time Converter
- UTC time to UNIX time Converter
- Seconds to H:M:S Converter
- H:M:S to Seconds Converter
- Seconds to Human Readable Time
- Miles to Kilometers Converter
- Kilometers to Miles Converter
- Celsius to Fahrenheit Converter
- Fahrenheit to Celsius Converter
- Degrees to Radians Converter
- Radians to Degrees Converter
- Pounds to Kilograms Converter
- Kilograms to Pounds Converter
- Hex to RGB Converter
- RGB to Hex Converter
- CMYK to RGB Converter
- RGB to CMYK Converter
- CMYK to Hex Converter
- Hex to CMYK Converter

Why high priority:
- broad search demand
- simple implementation
- good fit for utility homepage/category pages

### Random and Generator Tools Worth Keeping

- Random Password Generator
- Random String Generator
- Random Number Generator
- Random UUID Generator
- Random GUID Generator
- Random Date Generator
- Random Time Generator
- Random Element Picker

Why high priority:
- these have clear consumer value
- but only a small curated set is worth shipping

## Low-Value / Skip

These were in the original list, but they should either be skipped, merged into broader tools, or postponed indefinitely.

### Crypto and Hash Tool Spam

- MySQL Password Generator
- MariaDB Password Generator
- Postgres Password Generator
- Bcrypt Password Generator
- Bcrypt Password Checker
- Scrypt Password Generator
- Scrypt Password Checker
- XOR Encryptor
- XOR Decryptor
- AES Encryptor
- AES Decryptor
- RC4 Encryptor
- RC4 Decryptor
- DES Encryptor
- DES Decryptor
- Triple DES Encryptor
- Triple DES Decryptor
- Rabbit Encryptor
- Rabbit Decryptor
- NTLM Hash Calculator
- MD2 Hash Calculator
- MD4 Hash Calculator
- MD5 Hash Calculator
- MD6 Hash Calculator
- RipeMD128 Hash Calculator
- RipeMD160 Hash Calculator
- RipeMD256 Hash Calculator
- RipeMD320 Hash Calculator
- SHA1 Hash Calculator
- SHA2 Hash Calculator
- SHA224 Hash Calculator
- SHA256 Hash Calculator
- SHA384 Hash Calculator
- SHA512 Hash Calculator
- SHA3 Hash Calculator
- CRC16 Hash Calculator
- CRC32 Hash Calculator
- Adler32 Hash Calculator
- Whirlpool Hash Calculator
- All Hashes Calculator

Reason:
- bloats the site fast
- low editorial value
- often thin pages
- many are redundant if you ever build one broader hash toolkit

### One-Off Base Conversion Spam

- Binary to Octal Converter
- Binary to Decimal Converter
- Binary to Hex Converter
- Octal to Binary Converter
- Octal to Decimal Converter
- Octal to Hex Converter
- Decimal to Binary Converter
- Decimal to Octal Converter
- Decimal to Hex Converter
- Hex to Binary Converter
- Hex to Octal Converter
- Hex to Decimal Converter
- Decimal to BCD Converter
- BCD to Decimal Converter
- Octal to BCD Converter
- BCD to Octal Converter
- Hex to BCD Converter
- BCD to Hex Converter
- Binary to Gray Converter
- Gray to Binary Converter
- Octal to Gray Converter
- Gray to Octal Converter
- Decimal to Gray Converter
- Gray to Decimal Converter
- Hexadecimal to Gray Converter
- Gray to Hexadecimal Converter
- Number Base Converter

Reason:
- do not ship dozens of tiny routes here
- if you build this area, build one strong number-base converter instead

### Binary Math Micro-Tools

- Binary Sum Calculator
- Binary Product Calculator
- Binary Bitwise AND Calculator
- Binary Bitwise NAND Calculator
- Binary Bitwise OR Calculator
- Binary Bitwise NOR Calculator
- Binary Bitwise XOR Calculator
- Binary Bitwise XNOR Calculator
- Binary Bitwise NOT Calculator
- Binary Bit Inverter
- Binary Bit Reverser
- Binary Number Rotator
- Binary Bit Rotator to the Left
- Binary Bit Rotator to the Right

Reason:
- too narrow for separate landing pages
- better as tabs inside one binary operations tool, if ever built

### Niche Legacy or Weak-Demand Format Tools

- HTML to Jade Converter
- Jade to HTML Converter
- BBCode to HTML Converter
- BBCode to Jade Converter
- BBCode to Text Converter
- Uuencoder
- Uudecoder

Reason:
- weak modern demand
- not aligned with your strongest utility clusters

### Random Data Generators With Thin Value

- Random JSON Generator
- Random XML Generator
- Random YAML Generator
- Random CSV Generator
- Random TSV Generator
- Random Bin Generator
- Random Oct Generator
- Random Dec Generator
- Random Hex Generator
- Random Byte Generator
- Random IP Generator
- Random MAC Generator
- Random Fraction Generator

Reason:
- easy to build but weak page value
- too many near-identical generator pages make the site look thin

### Math and Novelty Generators

- Prime Number Generator
- Fibonacci Number Generator
- Pi Digit Generator
- E Digit Generator
- Decimal to Scientific Converter
- Scientific to Decimal Converter
- Roman to Decimal Converter
- Decimal to Roman Converter
- Numbers to Words Converter
- Words to Numbers Converter
- Round Numbers Up
- Round Numbers Down

Reason:
- not bad tools, but lower strategic value than your text, OCR, finance, and data-conversion clusters

### Overly Granular Line and List Tools

- List Merger
- List Zipper
- List Intersection
- List Difference
- Text Grep
- Text Head
- Text Tail
- Line Range Extractor
- Text Line Randomizer
- Letter Randomizer
- String Splitter

Reason:
- some are useful, but as standalone SEO pages they are weaker than broader, clearer utilities
- better folded into a future "text operations" suite if needed

## Recommended Build Order

If you want to keep expanding, this is the best order:

1. URL Encoder / Decoder / Parser
2. JSON Prettifier / Minifier / Validator
3. HTML, CSS, JS, and XML formatter tools
4. Email / URL / Number extractors
5. HTML to Markdown and Markdown to HTML
6. JSON / CSV / YAML / XML conversion cluster
7. Empty Line Remover and other text cleanup tools
8. Small curated random generators
9. One broad Number Base Converter instead of many small pages

## Rule Going Forward

When adding new tools from the old backlog:
- do not create duplicate aliases
- do not create many one-pair converters if one broader converter solves the same job
- prefer strong utility intent over novelty
- prefer clusters that reinforce existing categories: `Text`, `Finance`, `AI`, `Developer/Data`
