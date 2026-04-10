import { Metadata } from "next";
import { ConcreteVolumeCalculator } from "./components/ConcreteVolumeCalculator";

export const metadata: Metadata = {
  title: "Concrete Volume Calculator | Free Construction Tools",
  description: "Calculate the volume and number of bags of concrete needed for slabs, footings, and columns.",
};

export default function Page() {
  return <ConcreteVolumeCalculator />;
}
