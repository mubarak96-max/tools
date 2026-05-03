export default function ComparisonTable() {
  const data = [
    { location: "San Francisco, CA", residential: "$1,100+", commercial: "$65+", construction: "$400+" },
    { location: "New York, NY", residential: "$800+", commercial: "$55+", construction: "$350+" },
    { location: "Los Angeles, CA", residential: "$650+", commercial: "$42+", construction: "$300+" },
    { location: "Chicago, IL", residential: "$280+", commercial: "$28+", construction: "$220+" },
    { location: "Houston, TX", residential: "$180+", commercial: "$22+", construction: "$160+" },
    { location: "Phoenix, AZ", residential: "$280+", commercial: "$24+", construction: "$180+" },
    { location: "Philadelphia, PA", residential: "$240+", commercial: "$26+", construction: "$200+" },
    { location: "San Antonio, TX", residential: "$160+", commercial: "$18+", construction: "$140+" },
    { location: "San Diego, CA", residential: "$620+", commercial: "$38+", construction: "$280+" },
    { location: "Dallas, TX", residential: "$220+", commercial: "$24+", construction: "$170+" },
    { location: "Austin, TX", residential: "$320+", commercial: "$200+", construction: "$200+" },
    { location: "Miami, FL", residential: "$450+", commercial: "$35+", construction: "$250+" },
    { location: "Atlanta, GA", residential: "$200+", commercial: "$24+", construction: "$160+" },
    { location: "Denver, CO", residential: "$320+", commercial: "$28+", construction: "$210+" },
    { location: "Seattle, WA", residential: "$520+", commercial: "$40+", construction: "$290+" },
    { location: "National Average", residential: "$220", commercial: "$28", construction: "$200" },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-bold">
          <tr>
            <th className="px-6 py-4">City / Market</th>
            <th className="px-6 py-4">Residential PSF</th>
            <th className="px-6 py-4">Commercial Rent PSF</th>
            <th className="px-6 py-4">Construction Cost PSF</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={idx === data.length - 1 ? "bg-primary-50 font-semibold" : "hover:bg-gray-50"}
            >
              <td className="px-6 py-4 text-gray-900">{row.location}</td>
              <td className="px-6 py-4 text-gray-700">{row.residential}</td>
              <td className="px-6 py-4 text-gray-700">{row.commercial}</td>
              <td className="px-6 py-4 text-gray-700">{row.construction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
