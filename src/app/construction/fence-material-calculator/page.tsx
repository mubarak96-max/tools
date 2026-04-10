import { Metadata } from "next";
import { FenceMaterialCalculator } from "./components/FenceMaterialCalculator";

export const metadata: Metadata = {
  title: "Fence Material Calculator | Free Construction Tools",
  description: "Calculate the number of posts, rails, and pickets needed for a wooden fence.",
};

export default function Page() {
  return <FenceMaterialCalculator />;
}
