import { Metadata } from "next";
import { BrickBlockQuantityCalculator } from "./components/BrickBlockQuantityCalculator";

export const metadata: Metadata = {
  title: "Brick / Block Quantity Calculator | Free Construction Tools",
  description: "Calculate the total number of bricks or concrete blocks required for a wall project including mortar allowance.",
};

export default function Page() {
  return <BrickBlockQuantityCalculator />;
}
