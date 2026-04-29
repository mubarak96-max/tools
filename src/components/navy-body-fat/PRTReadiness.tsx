interface BodyFatResult {
  bodyFat: number;
  status: "within" | "warning" | "over";
  maxAllowed: number;
  margin: number;
  bmi: number;
}

export function PRTReadiness({
  result,
  gender,
  age,
}: {
  result: BodyFatResult;
  gender: string;
  age: number;
}) {
  const recommendations = [];
  
  if (result.status === "over") {
    recommendations.push("Enroll in Fitness Enhancement Program (FEP) immediately");
    recommendations.push("Reduce body fat by " + Math.abs(result.margin).toFixed(1) + "% to meet standard");
    recommendations.push("Focus on caloric deficit of 500-750 calories daily");
    recommendations.push("Increase cardio to 150+ minutes weekly");
  } else if (result.status === "warning") {
    recommendations.push("Maintain current fitness regimen");
    recommendations.push("Monitor measurements weekly before PRT");
    recommendations.push("Stay within " + result.margin.toFixed(1) + "% of maximum");
  } else {
    recommendations.push("Excellent standing - maintain fitness level");
    recommendations.push("Consider strength training to improve PRT pushup/situp scores");
    recommendations.push("Buffer of " + result.margin.toFixed(1) + "% provides safety margin");
  }

  return (
    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 overflow-hidden">
      <div className={`px-6 py-4 ${
        result.status === "within" ? "bg-emerald-50 border-b border-emerald-100" :
        result.status === "warning" ? "bg-amber-50 border-b border-amber-100" :
        "bg-red-50 border-b border-red-100"
      }`}>
        <h3 className={`text-lg font-semibold ${
          result.status === "within" ? "text-emerald-900" :
          result.status === "warning" ? "text-amber-900" :
          "text-red-900"
        }`}>
          PRT Readiness Assessment
        </h3>
        <p className={`text-sm ${
          result.status === "within" ? "text-emerald-700" :
          result.status === "warning" ? "text-amber-700" :
          "text-red-700"
        }`}>
          {gender === "male" ? "Male" : "Female"} sailor, age {age} — {result.status === "within" ? "COMPLIANT" : result.status === "warning" ? "AT RISK" : "NON-COMPLIANT"}
        </p>
      </div>
      
      <div className="p-6 grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Recommendations</h4>
          <ul className="space-y-2">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                  result.status === "within" ? "bg-emerald-500" :
                  result.status === "warning" ? "bg-amber-500" :
                  "bg-red-500"
                }`} />
                {rec}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">Next PRT Checklist</h4>
          <ul className="space-y-2">
            {[
              "Complete medical screening (PHYSICAL)",
              "Pass body composition assessment",
              "Complete cardio event (run/swim/bike/elliptical)",
              "Complete push-up event",
              "Complete forearm plank event",
              "Submit score sheet to CFL",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
