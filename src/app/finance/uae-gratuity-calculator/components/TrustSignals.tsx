import { Shield, CheckCircle, Award, Users } from "lucide-react";

export default function TrustSignals() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
        <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">MOHRE Compliant</h4>
          <p className="text-sm text-slate-500">Updated for Federal Decree-Law No. 33 of 2021.</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
        <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
          <CheckCircle className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">Verified Accuracy</h4>
          <p className="text-sm text-slate-500">Cross-checked against official UAE government portals.</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
        <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
          <Award className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900">MOHRE Formula</h4>
          <p className="text-sm text-slate-500">Based on Federal Decree-Law No. 33 of 2021.</p>
        </div>
      </div>
    </div>
  );
}
