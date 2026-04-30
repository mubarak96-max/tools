import { 
  Calculator, 
  Image, 
  FileText, 
  QrCode, 
  Type,
  Binary
} from "lucide-react";

const tools = [
  {
    name: "Image to Text OCR",
    description: "Extract text from images instantly",
    icon: <FileText className="w-5 h-5" />,
    href: "/text/convert-image-to-text",
    category: "Text",
  },
  {
    name: "QR Code Generator",
    description: "Create custom QR codes for free",
    icon: <QrCode className="w-5 h-5" />,
    href: "/utility/qr-code-generator",
    category: "Utility",
  },
  {
    name: "Word Frequency Counter",
    description: "Analyze text word usage patterns",
    icon: <Type className="w-5 h-5" />,
    href: "/text/word-frequency",
    category: "Text",
  },
  {
    name: "Binary Translator",
    description: "Convert text to binary and back",
    icon: <Binary className="w-5 h-5" />,
    href: "/text/binary-code-translator",
    category: "Text",
  },
  {
    name: "AI Background Remover",
    description: "Remove backgrounds from photos",
    icon: <Image className="w-5 h-5" />,
    href: "/image/free-image-background-remover-online",
    category: "Image",
  },
  {
    name: "BMR Calculator",
    description: "Calculate your basal metabolic rate",
    icon: <Calculator className="w-5 h-5" />,
    href: "/health/bmr-calculator",
    category: "Health",
  },
];

export function RelatedTools() {
  return (
    <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Related Tools You Might Like</h2>
          <p className="mt-2 text-slate-600">Explore more free utilities from FindBest Tools</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.href}
              className="flex items-start gap-4 p-4 sm:p-5 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="p-2.5 bg-slate-100 rounded-lg text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                {tool.icon}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{tool.description}</p>
                <span className="inline-block mt-2 text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded">
                  {tool.category}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
