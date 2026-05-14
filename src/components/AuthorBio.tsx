import { AuthorSection } from "./blog/AuthorSection";

export default function AuthorBio() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm">
      <div className="flex flex-col gap-6">
        <AuthorSection showBio={true} />
        <div className="border-t border-gray-100 pt-6">
          <p className="text-gray-600 text-sm leading-relaxed">
            Our calculators and methodology have been reviewed by industry professionals with 
            combined experience exceeding 50 years. We analyze data from official government sources, 
            RSMeans Construction Cost Database, and financial industry standards to ensure accuracy. 
            All tools are updated regularly to reflect current market conditions and regulations.
          </p>
        </div>
      </div>
    </div>
  );
}
