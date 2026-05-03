import { Shield, Lock, Zap, Users, Star, TrendingUp } from "lucide-react";

export default function TrustSignals() {
  const signals = [
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      stat: "2.8M+",
      label: "Calculations Performed",
    },
    {
      icon: <Users className="w-6 h-6 text-primary-500" />,
      stat: "450K+",
      label: "Monthly Users",
    },
    {
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      stat: "4.9/5",
      label: "User Rating",
    },
    {
      icon: <Shield className="w-6 h-6 text-accent-500" />,
      stat: "100%",
      label: "Free & Private",
    },
    {
      icon: <Lock className="w-6 h-6 text-red-500" />,
      stat: "Zero",
      label: "Data Stored",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
      stat: "Q2 2024",
      label: "Latest Data",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {signals.map((signal, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex justify-center mb-2">{signal.icon}</div>
          <p className="text-xl font-bold text-gray-900">{signal.stat}</p>
          <p className="text-xs text-gray-500 mt-1">{signal.label}</p>
        </div>
      ))}
    </div>
  );
}
