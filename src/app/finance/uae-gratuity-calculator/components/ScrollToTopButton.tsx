"use client";

export default function ScrollToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="bg-white text-blue-900 font-bold px-10 py-4 rounded-2xl hover:bg-cyan-50 transition-all shadow-xl shadow-blue-950/50"
    >
      Re-Calculate Now
    </button>
  );
}
