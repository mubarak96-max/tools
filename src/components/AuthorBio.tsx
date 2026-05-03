import { Award, BookOpen, Building, GraduationCap } from "lucide-react";

export default function AuthorBio() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
          <Building className="w-10 h-10 text-primary-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            Reviewed by the Real Estate Analytics Team
          </h3>
          <p className="text-sm text-primary-600 font-medium mb-3">
            Licensed Real Estate Professionals & Construction Cost Analysts
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full">
              <Award className="w-3 h-3" /> Licensed Brokers
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full">
              <GraduationCap className="w-3 h-3" /> CCIM Designation
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full">
              <BookOpen className="w-3 h-3" /> 15+ Years Experience
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our price per square foot calculator and methodology have been reviewed by licensed real estate 
            brokers, certified commercial investment members (CCIM), and construction cost estimators with 
            combined experience exceeding 50 years. We analyze data from the National Association of Realtors, 
            RSMeans Construction Cost Database, CoStar, and local MLS systems to ensure accuracy. This tool 
            is updated quarterly to reflect current market conditions. Last reviewed: May 2024.
          </p>
        </div>
      </div>
    </div>
  );
}
