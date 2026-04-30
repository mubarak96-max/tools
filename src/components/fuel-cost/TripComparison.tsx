interface VehicleResult {
  name: string;
  cost: number;
  costPerMile: number;
  gallons: number;
  kwh: number;
}

export function TripComparison({
  vehicle1,
  vehicle2,
  distance,
}: {
  vehicle1: VehicleResult;
  vehicle2: VehicleResult;
  distance: number;
}) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(val);

  const savings = vehicle1.cost - vehicle2.cost;
  const percentSavings = vehicle1.cost > 0 ? (savings / vehicle1.cost) * 100 : 0;

  return (
    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-slate-900/5 overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">Vehicle Comparison</h3>
        <p className="text-sm text-slate-500">{distance} mile trip cost analysis</p>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Vehicle 1 */}
          <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">{vehicle1.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Trip Cost</span>
                <span className="font-semibold text-slate-900">{formatCurrency(vehicle1.cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Per Mile</span>
                <span className="font-semibold text-slate-900">{formatCurrency(vehicle1.costPerMile)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Fuel Used</span>
                <span className="font-semibold text-slate-900">
                  {vehicle1.gallons > 0 ? `${vehicle1.gallons.toFixed(1)} gal` : `${vehicle1.kwh.toFixed(1)} kWh`}
                </span>
              </div>
            </div>
          </div>

          {/* Savings */}
          <div className="rounded-xl bg-amber-50 p-5 border border-amber-200 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-amber-700 mb-1">Potential Savings</p>
            <p className={`text-4xl font-extrabold ${savings > 0 ? "text-emerald-600" : "text-red-600"}`}>
              {formatCurrency(Math.abs(savings))}
            </p>
            <p className="text-sm text-amber-700 mt-1">
              {savings > 0 ? `${vehicle2.name} saves` : `${vehicle1.name} saves`}
            </p>
            <p className="text-xs text-amber-600 mt-2">
              {Math.abs(percentSavings).toFixed(1)}% difference per trip
            </p>
          </div>

          {/* Vehicle 2 */}
          <div className="rounded-xl bg-slate-50 p-5 border border-slate-200">
            <h4 className="font-bold text-slate-900 mb-3">{vehicle2.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Trip Cost</span>
                <span className="font-semibold text-slate-900">{formatCurrency(vehicle2.cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Per Mile</span>
                <span className="font-semibold text-slate-900">{formatCurrency(vehicle2.costPerMile)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Fuel Used</span>
                <span className="font-semibold text-slate-900">
                  {vehicle2.gallons > 0 ? `${vehicle2.gallons.toFixed(1)} gal` : `${vehicle2.kwh.toFixed(1)} kWh`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Annual projection */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-600 text-center">
            At 12,000 miles/year, the annual difference would be approximately{" "}
            <span className="font-bold text-slate-900">{formatCurrency(Math.abs(savings) * (12000 / distance))}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
