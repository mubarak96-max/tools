import { Metadata } from "next";
import { RoomAreaCalculator } from "./components/RoomAreaCalculator";

export const metadata: Metadata = {
  title: "Room Area Calculator | Free Construction Tools",
  description: "Calculate the total square footage of a room, adding alcoves and subtracting windows and doors.",
};

export default function Page() {
  return <RoomAreaCalculator />;
}
