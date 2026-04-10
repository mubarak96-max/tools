import { Metadata } from "next";
import { WallpaperCalculator } from "./components/WallpaperCalculator";

export const metadata: Metadata = {
  title: "Wallpaper Calculator | Free Construction Tools",
  description: "Calculate how many rolls of wallpaper you need for your room dimensions and roll size.",
};

export default function Page() {
  return <WallpaperCalculator />;
}
