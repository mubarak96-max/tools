import re

build_output = """
├ ○ /finance/401k-match-calculator
├ ○ /finance/amazon-fba-calculator-uk
├ ○ /finance/amazon-fba-canada-calculator
├ ○ /finance/amortization-chart-calculator
├ ○ /finance/australia-gst-calculator
├ ○ /finance/australia-stamp-duty-calculator
├ ○ /finance/bonus-tax-calculator
├ ○ /finance/break-even-calculator
├ ○ /finance/business-risk-exposure-score-calculator
├ ○ /finance/canada-hst-gst-calculator
├ ○ /finance/canada-income-tax-calculator
├ ○ /finance/capital-gains-tax-canada-calculator
├ ○ /finance/car-depreciation-calculator
├ ○ /finance/cd-ladder-calculator
├ ○ /finance/compound-interest-calculator
├ ○ /finance/cpp-ei-calculator
├ ○ /finance/dividend-reinvestment-calculator
├ ○ /finance/dropshipping-break-even
├ ○ /finance/emi-calculator
├ ○ /finance/equity-dilution-calculator
├ ○ /finance/etsy-profit-calculator
├ ○ /finance/general-liability-insurance-cost-estimator
├ ○ /finance/halal-mortgage-calculator
├ ○ /finance/house-affordability-calculator-australia
├ ○ /finance/income-tax-calculator-australia
├ ○ /finance/income-tax-calculator-india
├ ○ /finance/income-tax-calculator-ireland
├ ○ /finance/india-sip-calculator
├ ○ /finance/india-tds-calculator
├ ○ /finance/inheritance-tax-calculator
├ ○ /finance/invoice-generator
├ ○ /finance/pmi-calculator
├ ○ /finance/product-pricing-calculator
├ ○ /finance/rule-of-72-calculator
├ ○ /finance/salary-after-tax-calculator
├ ○ /finance/sales-tax-california-calculator
├ ○ /finance/sales-tax-canada-calculator
├ ○ /finance/saudi-end-of-service-calculator
├ ○ /finance/uk-student-loan-repayment-calculator
├ ○ /finance/us-self-employment-tax-calculator
├ ○ /finance/us-take-home-pay-calculator
├ ○ /finance/workers-comp-premium-calculator
├ ○ /finance/zakat-calculator
├ ○ /health/bmr-calculator
├ ○ /health/calorie-calculator
├ ○ /image/convert-image-to-base64
├ ○ /image/free-image-background-remover-online
├ ○ /image/resize-photo-instagram-online
├ ○ /marketing/marketing-roi-calculator
├ ○ /real-estate/cap-rate-calculator
├ ○ /real-estate/cash-on-cash-return-calculator
├ ○ /real-estate/hong-kong-stamp-duty-calculator
├ ○ /real-estate/house-affordability-calculator-canada
├ ○ /real-estate/land-transfer-tax-calculator-toronto
├ ○ /real-estate/mortgage-qualifier-canada
├ ○ /real-estate/nyc-transfer-tax-calculator
├ ○ /real-estate/price-per-square-foot-calculator
├ ○ /real-estate/rent-vs-buy-calculator
├ ○ /real-estate/rental-yield-calculator
├ ○ /real-estate/scotland-lbtt-calculator
├ ○ /real-estate/singapore-buyers-stamp-duty-calculator
├ ○ /real-estate/singapore-property-stamp-duty-calculator
├ ○ /real-estate/singapore-sellers-stamp-duty-calculator
├ ○ /real-estate/stamp-duty-calculator-nsw
├ ○ /real-estate/uk-stamp-duty-calculator
├ ○ /real-estate/wales-ltt-calculator
├ ○ /seo/hreflang-generator
├ ○ /seo/keyword-clustering
├ ○ /seo/meta-description-checker
├ ○ /seo/youtube-title-checker
├ ○ /text/binary-code-translator
├ ○ /text/case-converter
├ ○ /text/convert-image-to-text
├ ○ /text/duplicate-word-finder
├ ○ /text/morse-code-translator
├ ○ /text/readability-flesch-kincaid-calculator
├ ○ /text/word-cloud-generator
├ ○ /text/word-frequency
├ ○ /tools/crypto-mining-calculator
├ ○ /utility/barcode-generator
├ ○ /utility/barcode-scanner
├ ○ /utility/dns-checker
├ ○ /utility/free-cv-resume-builder
├ ○ /utility/qr-code-generator
├ ○ /utility/qr-code-scanner
├ ○ /utility/xg-expected-goals-calculator
"""

routes = re.findall(r'/\w+(?:/[\w-]+)+', build_output)
# Exclude category hubs
routes = [r for r in routes if r.count('/') > 1]

with open(r'c:\Users\LENOVO\Desktop\tools_project\src\app\sitemap\page.tsx', 'r', encoding='utf-8') as f:
    sitemap_content = f.read()

missing_from_page = []
for route in routes:
    if f'"{route}"' not in sitemap_content and f"'{route}'" not in sitemap_content and f"`{route}`" not in sitemap_content:
        missing_from_page.append(route)

with open(r'c:\Users\LENOVO\Desktop\tools_project\src\app\sitemap.ts', 'r', encoding='utf-8') as f:
    xml_sitemap_content = f.read()

missing_from_xml = []
for route in routes:
    if f'"{route}"' not in xml_sitemap_content and f"'{route}'" not in xml_sitemap_content and f"`{route}`" not in xml_sitemap_content:
        missing_from_xml.append(route)

print("Missing from sitemap/page.tsx:")
for r in missing_from_page:
    print(r)

print("\nMissing from sitemap.ts:")
for r in missing_from_xml:
    print(r)
