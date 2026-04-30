interface Result {
  cost: number;
  costPerMile: number;
  gallons: number;
  kwh: number;
}

interface Vehicle {
  name: string;
  fuelType: string;
  mpg: number;
  kwhPer100Mi?: number;
}

export function CostBreakdown({
  mainResult,
  annualCommute,
  vehicle,
  distance,
}: {
  mainResult: Result;
  annualCommute: Result;
  vehicle: Vehicle;
  distance: number;
}) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val);

  const scenarios = [
    { name: "Daily Commute (round trip)", multiplier: 1 },
    { name: "Weekly (5 days)", multiplier: 5 },
    { name: "Monthly (22 days)", multiplier: 22 },
    { name: "Quarterly (3 months)", multiplier: 66 },
    { name: "Annual (12 months)", multiplier: 264 },
  ];

  const carbonLbs = vehicle.fuelType === "electric" 
    ? mainResult.kwh * 0.85 // avg grid carbon intensity
    : mainResult.gallons * 19.6; // gasoline CO2

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Cost Scenarios</h3>
          <p className="text-sm text-slate-500">Based on {distance} mile trip</p>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {scenarios.map((s) => (
              <div key={s.name} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <span className="text-sm text-slate-700">{s.name}</span>
                <span className="text-sm font-bold text-slate-900">{formatCurrency(mainResult.cost * s.multiplier)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-900">Environmental Impact</h3>
          <p className="text-sm text-slate-500">Estimated CO₂ emissions for this trip</p>
        </div>
        <div className="p-6">
          <div className="text-center mb-4">
            <p className="text-4xl font-extrabold text-slate-900">{carbonLbs.toFixed(1)}</p>
            <p className="text-sm text-slate-500">pounds of CO₂</p>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <p>Equivalent to:</p>
            <ul className="space-y-1 ml-4">
              <li>• {(carbonLbs / 19.6).toFixed(2)} gallons of gasoline burned</li>
              <li>• {(carbonLbs / 36).toFixed(2)} pounds of coal</li>
              <li>• {(carbonLbs / 1.22).toFixed(1)} miles driven by avg car</li>
            </ul>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              {vehicle.fuelType === "electric" 
                ? "EV emissions depend on grid mix. Renewable energy reduces this significantly." 
                : "Gasoline produces ~19.6 lbs CO₂ per gallon (EPA estimate)."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
