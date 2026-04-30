import { MousePointerClick, Type, Eye, ClipboardCopy } from "lucide-react";

const steps = [
  {
    icon: <MousePointerClick className="w-6 h-6 text-white" />,
    title: "Choose Your Ratio",
    description: "Select from 12+ presets including 16:9, 4:3, 1:1, 21:9, 9:16, and social media formats. Or enter any custom ratio you need.",
    color: "bg-blue-600",
  },
  {
    icon: <Type className="w-6 h-6 text-white" />,
    title: "Enter Dimensions",
    description: "Type in your known width or height. The calculator instantly computes the other dimension while maintaining perfect proportions.",
    color: "bg-cyan-600",
  },
  {
    icon: <Eye className="w-6 h-6 text-white" />,
    title: "Preview Live",
    description: "See a real-time visual representation of your aspect ratio with an interactive box that updates as you type.",
    color: "bg-teal-600",
  },
  {
    icon: <ClipboardCopy className="w-6 h-6 text-white" />,
    title: "Copy & Export",
    description: "Copy dimensions in plain text, CSS, or HTML format. Use them directly in your design tools, code, or video editing software.",
    color: "bg-emerald-600",
  },
];

export function HowToSection() {
  return (
    <section className="py-12 md:py-16 bg-white border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl font-bold text-slate-900">How to Use the Aspect Ratio Calculator</h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Get perfect proportions in four simple steps. No signup, no downloads, no watermarks.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 h-full border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
                <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-slate-400 mb-2">STEP {index + 1}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-slate-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
