"use client";

import React, { useState, useMemo } from "react";
import {
  Car,
  Gauge,
  Calendar,
  DollarSign,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Info,
  Search,
  Shield,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type VehicleClass = "truck" | "suv" | "sedan" | "luxury" | "ev" | "sports" | "van" | "exotic";
type Condition = "excellent" | "good" | "average" | "fair" | "poor";

interface VehicleProfile {
  make: string;
  model: string;
  msrp: number;
  class: VehicleClass;
  year1: number;
  year3: number;
  year5: number;
  year7: number;
  year10: number;
}

interface CalculatorState {
  selectedYear: number;
  purchasePrice: number;
  currentMileage: number;
  annualMiles: number;
  condition: Condition;
  hasAWD: boolean;
  hasLeather: boolean;
  hasSunroof: boolean;
  hasTechPackage: boolean;
  hasAccident: boolean;
  showComparison: boolean;
  compareVehicle: VehicleProfile | null;
}

const CURRENT_YEAR = 2026;

const CLASS_LABELS: Record<VehicleClass, string> = {
  truck: "Truck",
  suv: "SUV / Crossover",
  sedan: "Sedan / Hatch",
  luxury: "Luxury",
  ev: "Electric Vehicle",
  sports: "Sports / Performance",
  van: "Van / Minivan",
  exotic: "Exotic / Ultra-Luxury",
};

const CONDITION_MULTIPLIERS: Record<Condition, number> = {
  excellent: 1.05,
  good: 1.02,
  average: 1.0,
  fair: 0.92,
  poor: 0.80,
};

// ============================================
// 120+ VEHICLE DATABASE WITH REALISTIC CURVES
// ============================================

const VEHICLE_DB: VehicleProfile[] = [
  // TOYOTA (8)
  { make: "Toyota", model: "Tacoma", msrp: 42000, class: "truck", year1: 0.915, year3: 0.78, year5: 0.70, year7: 0.58, year10: 0.42 },
  { make: "Toyota", model: "Tundra", msrp: 48000, class: "truck", year1: 0.88, year3: 0.74, year5: 0.65, year7: 0.54, year10: 0.40 },
  { make: "Toyota", model: "Camry", msrp: 35000, class: "sedan", year1: 0.85, year3: 0.68, year5: 0.55, year7: 0.42, year10: 0.28 },
  { make: "Toyota", model: "Corolla", msrp: 28000, class: "sedan", year1: 0.84, year3: 0.66, year5: 0.53, year7: 0.40, year10: 0.26 },
  { make: "Toyota", model: "RAV4", msrp: 38000, class: "suv", year1: 0.87, year3: 0.72, year5: 0.60, year7: 0.48, year10: 0.32 },
  { make: "Toyota", model: "Highlander", msrp: 45000, class: "suv", year1: 0.85, year3: 0.70, year5: 0.58, year7: 0.46, year10: 0.30 },
  { make: "Toyota", model: "4Runner", msrp: 52000, class: "suv", year1: 0.88, year3: 0.78, year5: 0.70, year7: 0.60, year10: 0.45 },
  { make: "Toyota", model: "Land Cruiser", msrp: 95000, class: "suv", year1: 0.90, year3: 0.82, year5: 0.75, year7: 0.66, year10: 0.52 },
  { make: "Toyota", model: "Sequoia", msrp: 65000, class: "suv", year1: 0.85, year3: 0.72, year5: 0.62, year7: 0.52, year10: 0.38 },
  { make: "Toyota", model: "Prius", msrp: 33000, class: "sedan", year1: 0.80, year3: 0.62, year5: 0.48, year7: 0.36, year10: 0.22 },
  { make: "Toyota", model: "Sienna", msrp: 42000, class: "van", year1: 0.82, year3: 0.68, year5: 0.56, year7: 0.44, year10: 0.28 },
  { make: "Toyota", model: "bZ4X", msrp: 48000, class: "ev", year1: 0.70, year3: 0.52, year5: 0.38, year7: 0.28, year10: 0.18 },

  // HONDA (7)
  { make: "Honda", model: "Civic", msrp: 32000, class: "sedan", year1: 0.85, year3: 0.68, year5: 0.55, year7: 0.42, year10: 0.28 },
  { make: "Honda", model: "Accord", msrp: 36000, class: "sedan", year1: 0.84, year3: 0.67, year5: 0.54, year7: 0.41, year10: 0.27 },
  { make: "Honda", model: "CR-V", msrp: 37000, class: "suv", year1: 0.86, year3: 0.70, year5: 0.58, year7: 0.45, year10: 0.30 },
  { make: "Honda", model: "Pilot", msrp: 46000, class: "suv", year1: 0.83, year3: 0.68, year5: 0.56, year7: 0.44, year10: 0.29 },
  { make: "Honda", model: "Passport", msrp: 44000, class: "suv", year1: 0.84, year3: 0.69, year5: 0.57, year7: 0.45, year10: 0.30 },
  { make: "Honda", model: "Odyssey", msrp: 43000, class: "van", year1: 0.80, year3: 0.65, year5: 0.52, year7: 0.40, year10: 0.25 },
  { make: "Honda", model: "Ridgeline", msrp: 42000, class: "truck", year1: 0.82, year3: 0.68, year5: 0.57, year7: 0.46, year10: 0.32 },

  // FORD (9)
  { make: "Ford", model: "F-150", msrp: 48000, class: "truck", year1: 0.82, year3: 0.68, year5: 0.57, year7: 0.45, year10: 0.30 },
  { make: "Ford", model: "F-250", msrp: 58000, class: "truck", year1: 0.83, year3: 0.70, year5: 0.60, year7: 0.50, year10: 0.36 },
  { make: "Ford", model: "Explorer", msrp: 42000, class: "suv", year1: 0.78, year3: 0.60, year5: 0.48, year7: 0.36, year10: 0.22 },
  { make: "Ford", model: "Escape", msrp: 32000, class: "suv", year1: 0.75, year3: 0.58, year5: 0.45, year7: 0.33, year10: 0.20 },
  { make: "Ford", model: "Bronco", msrp: 45000, class: "suv", year1: 0.88, year3: 0.76, year5: 0.68, year7: 0.58, year10: 0.44 },
  { make: "Ford", model: "Bronco Sport", msrp: 36000, class: "suv", year1: 0.80, year3: 0.65, year5: 0.54, year7: 0.42, year10: 0.28 },
  { make: "Ford", model: "Mustang", msrp: 42000, class: "sports", year1: 0.80, year3: 0.65, year5: 0.52, year7: 0.40, year10: 0.26 },
  { make: "Ford", model: "Mustang Mach-E", msrp: 52000, class: "ev", year1: 0.72, year3: 0.55, year5: 0.42, year7: 0.32, year10: 0.20 },
  { make: "Ford", model: "F-150 Lightning", msrp: 65000, class: "ev", year1: 0.70, year3: 0.52, year5: 0.38, year7: 0.28, year10: 0.18 },
  { make: "Ford", model: "Edge", msrp: 40000, class: "suv", year1: 0.74, year3: 0.56, year5: 0.43, year7: 0.32, year10: 0.20 },
  { make: "Ford", model: "Transit", msrp: 55000, class: "van", year1: 0.78, year3: 0.62, year5: 0.50, year7: 0.40, year10: 0.28 },

  // CHEVROLET (9)
  { make: "Chevrolet", model: "Silverado 1500", msrp: 46000, class: "truck", year1: 0.80, year3: 0.65, year5: 0.55, year7: 0.42, year10: 0.28 },
  { make: "Chevrolet", model: "Silverado 2500", msrp: 62000, class: "truck", year1: 0.82, year3: 0.68, year5: 0.58, year7: 0.48, year10: 0.35 },
  { make: "Chevrolet", model: "Equinox", msrp: 33000, class: "suv", year1: 0.74, year3: 0.56, year5: 0.43, year7: 0.32, year10: 0.20 },
  { make: "Chevrolet", model: "Traverse", msrp: 42000, class: "suv", year1: 0.76, year3: 0.58, year5: 0.46, year7: 0.35, year10: 0.22 },
  { make: "Chevrolet", model: "Tahoe", msrp: 62000, class: "suv", year1: 0.80, year3: 0.66, year5: 0.56, year7: 0.46, year10: 0.32 },
  { make: "Chevrolet", model: "Suburban", msrp: 68000, class: "suv", year1: 0.80, year3: 0.66, year5: 0.56, year7: 0.46, year10: 0.32 },
  { make: "Chevrolet", model: "Corvette", msrp: 72000, class: "sports", year1: 0.85, year3: 0.72, year5: 0.62, year7: 0.52, year10: 0.40 },
  { make: "Chevrolet", model: "Camaro", msrp: 45000, class: "sports", year1: 0.78, year3: 0.62, year5: 0.50, year7: 0.38, year10: 0.25 },
  { make: "Chevrolet", model: "Malibu", msrp: 30000, class: "sedan", year1: 0.72, year3: 0.54, year5: 0.40, year7: 0.28, year10: 0.16 },
  { make: "Chevrolet", model: "Blazer", msrp: 38000, class: "suv", year1: 0.74, year3: 0.56, year5: 0.43, year7: 0.32, year10: 0.20 },
  { make: "Chevrolet", model: "Bolt EV", msrp: 32000, class: "ev", year1: 0.60, year3: 0.40, year5: 0.28, year7: 0.20, year10: 0.12 },

  // RAM (3)
  { make: "Ram", model: "1500", msrp: 47000, class: "truck", year1: 0.80, year3: 0.65, year5: 0.54, year7: 0.42, year10: 0.28 },
  { make: "Ram", model: "2500", msrp: 65000, class: "truck", year1: 0.82, year3: 0.69, year5: 0.59, year7: 0.49, year10: 0.36 },
  { make: "Ram", model: "ProMaster", msrp: 48000, class: "van", year1: 0.76, year3: 0.60, year5: 0.48, year7: 0.38, year10: 0.26 },

  // GMC (4)
  { make: "GMC", model: "Sierra 1500", msrp: 50000, class: "truck", year1: 0.80, year3: 0.66, year5: 0.55, year7: 0.44, year10: 0.30 },
  { make: "GMC", model: "Sierra 2500", msrp: 68000, class: "truck", year1: 0.82, year3: 0.69, year5: 0.59, year7: 0.49, year10: 0.36 },
  { make: "GMC", model: "Yukon", msrp: 70000, class: "suv", year1: 0.79, year3: 0.64, year5: 0.54, year7: 0.44, year10: 0.30 },
  { make: "GMC", model: "Acadia", msrp: 42000, class: "suv", year1: 0.74, year3: 0.56, year5: 0.44, year7: 0.33, year10: 0.21 },
  { make: "GMC", model: "Terrain", msrp: 35000, class: "suv", year1: 0.73, year3: 0.55, year5: 0.42, year7: 0.31, year10: 0.19 },

  // JEEP (5)
  { make: "Jeep", model: "Wrangler", msrp: 45000, class: "suv", year1: 0.90, year3: 0.78, year5: 0.72, year7: 0.62, year10: 0.48 },
  { make: "Jeep", model: "Grand Cherokee", msrp: 48000, class: "suv", year1: 0.78, year3: 0.60, year5: 0.48, year7: 0.37, year10: 0.24 },
  { make: "Jeep", model: "Cherokee", msrp: 38000, class: "suv", year1: 0.74, year3: 0.56, year5: 0.43, year7: 0.32, year10: 0.20 },
  { make: "Jeep", model: "Gladiator", msrp: 48000, class: "truck", year1: 0.85, year3: 0.72, year5: 0.62, year7: 0.52, year10: 0.38 },
  { make: "Jeep", model: "Wagoneer", msrp: 75000, class: "suv", year1: 0.78, year3: 0.62, year5: 0.50, year7: 0.40, year10: 0.28 },

  // NISSAN (7)
  { make: "Nissan", model: "Rogue", msrp: 34000, class: "suv", year1: 0.75, year3: 0.57, year5: 0.44, year7: 0.33, year10: 0.21 },
  { make: "Nissan", model: "Altima", msrp: 31000, class: "sedan", year1: 0.73, year3: 0.55, year5: 0.42, year7: 0.31, year10: 0.19 },
  { make: "Nissan", model: "Sentra", msrp: 25000, class: "sedan", year1: 0.72, year3: 0.53, year5: 0.40, year7: 0.29, year10: 0.17 },
  { make: "Nissan", model: "Pathfinder", msrp: 42000, class: "suv", year1: 0.76, year3: 0.58, year5: 0.45, year7: 0.34, year10: 0.22 },
  { make: "Nissan", model: "Murano", msrp: 40000, class: "suv", year1: 0.72, year3: 0.54, year5: 0.41, year7: 0.30, year10: 0.18 },
  { make: "Nissan", model: "Frontier", msrp: 38000, class: "truck", year1: 0.80, year3: 0.66, year5: 0.56, year7: 0.46, year10: 0.32 },
  { make: "Nissan", model: "Titan", msrp: 52000, class: "truck", year1: 0.74, year3: 0.58, year5: 0.46, year7: 0.36, year10: 0.24 },
  { make: "Nissan", model: "Leaf", msrp: 35000, class: "ev", year1: 0.65, year3: 0.45, year5: 0.32, year7: 0.22, year10: 0.14 },
  { make: "Nissan", model: "Ariya", msrp: 52000, class: "ev", year1: 0.68, year3: 0.50, year5: 0.36, year7: 0.26, year10: 0.16 },
  { make: "Nissan", model: "Armada", msrp: 58000, class: "suv", year1: 0.74, year3: 0.57, year5: 0.45, year7: 0.35, year10: 0.23 },

  // HYUNDAI (7)
  { make: "Hyundai", model: "Tucson", msrp: 34000, class: "suv", year1: 0.78, year3: 0.60, year5: 0.47, year7: 0.36, year10: 0.23 },
  { make: "Hyundai", model: "Santa Fe", msrp: 40000, class: "suv", year1: 0.78, year3: 0.60, year5: 0.47, year7: 0.36, year10: 0.23 },
  { make: "Hyundai", model: "Palisade", msrp: 45000, class: "suv", year1: 0.80, year3: 0.64, year5: 0.52, year7: 0.41, year10: 0.27 },
  { make: "Hyundai", model: "Sonata", msrp: 32000, class: "sedan", year1: 0.76, year3: 0.58, year5: 0.44, year7: 0.33, year10: 0.21 },
  { make: "Hyundai", model: "Elantra", msrp: 26000, class: "sedan", year1: 0.75, year3: 0.56, year5: 0.42, year7: 0.31, year10: 0.19 },
  { make: "Hyundai", model: "Ioniq 5", msrp: 52000, class: "ev", year1: 0.72, year3: 0.54, year5: 0.40, year7: 0.30, year10: 0.20 },
  { make: "Hyundai", model: "Ioniq 6", msrp: 50000, class: "ev", year1: 0.70, year3: 0.52, year5: 0.38, year7: 0.28, year10: 0.18 },
  { make: "Hyundai", model: "Kona", msrp: 30000, class: "suv", year1: 0.76, year3: 0.58, year5: 0.45, year7: 0.34, year10: 0.22 },

  // KIA (7)
  { make: "Kia", model: "Telluride", msrp: 42000, class: "suv", year1: 0.82, year3: 0.68, year5: 0.56, year7: 0.45, year10: 0.30 },
  { make: "Kia", model: "Sportage", msrp: 33000, class: "suv", year1: 0.77, year3: 0.59, year5: 0.46, year7: 0.35, year10: 0.22 },
  { make: "Kia", model: "Sorento", msrp: 38000, class: "suv", year1: 0.77, year3: 0.59, year5: 0.46, year7: 0.35, year10: 0.22 },
  { make: "Kia", model: "Seltos", msrp: 28000, class: "suv", year1: 0.76, year3: 0.58, year5: 0.45, year7: 0.34, year10: 0.22 },
  { make: "Kia", model: "Carnival", msrp: 40000, class: "van", year1: 0.78, year3: 0.62, year5: 0.50, year7: 0.39, year10: 0.26 },
  { make: "Kia", model: "EV6", msrp: 55000, class: "ev", year1: 0.70, year3: 0.52, year5: 0.38, year7: 0.28, year10: 0.18 },
  { make: "Kia", model: "EV9", msrp: 62000, class: "ev", year1: 0.72, year3: 0.54, year5: 0.40, year7: 0.30, year10: 0.20 },
  { make: "Kia", model: "K5", msrp: 31000, class: "sedan", year1: 0.75, year3: 0.57, year5: 0.44, year7: 0.33, year10: 0.21 },
  { make: "Kia", model: "Forte", msrp: 24000, class: "sedan", year1: 0.74, year3: 0.55, year5: 0.42, year7: 0.31, year10: 0.19 },

  // SUBARU (5)
  { make: "Subaru", model: "Outback", msrp: 39000, class: "suv", year1: 0.84, year3: 0.70, year5: 0.58, year7: 0.46, year10: 0.32 },
  { make: "Subaru", model: "Forester", msrp: 36000, class: "suv", year1: 0.84, year3: 0.70, year5: 0.58, year7: 0.46, year10: 0.32 },
  { make: "Subaru", model: "Crosstrek", msrp: 32000, class: "suv", year1: 0.84, year3: 0.70, year5: 0.58, year7: 0.46, year10: 0.32 },
  { make: "Subaru", model: "Ascent", msrp: 42000, class: "suv", year1: 0.82, year3: 0.67, year5: 0.55, year7: 0.43, year10: 0.29 },
  { make: "Subaru", model: "Impreza", msrp: 28000, class: "sedan", year1: 0.83, year3: 0.68, year5: 0.56, year7: 0.44, year10: 0.30 },
  { make: "Subaru", model: "Legacy", msrp: 31000, class: "sedan", year1: 0.82, year3: 0.67, year5: 0.55, year7: 0.43, year10: 0.29 },
  { make: "Subaru", model: "WRX", msrp: 38000, class: "sports", year1: 0.82, year3: 0.67, year5: 0.55, year7: 0.44, year10: 0.30 },
  { make: "Subaru", model: "BRZ", msrp: 35000, class: "sports", year1: 0.80, year3: 0.65, year5: 0.53, year7: 0.42, year10: 0.28 },
  { make: "Subaru", model: "Solterra", msrp: 48000, class: "ev", year1: 0.68, year3: 0.50, year5: 0.36, year7: 0.26, year10: 0.16 },

  // MAZDA (5)
  { make: "Mazda", model: "CX-5", msrp: 34000, class: "suv", year1: 0.80, year3: 0.63, year5: 0.50, year7: 0.39, year10: 0.26 },
  { make: "Mazda", model: "CX-50", msrp: 36000, class: "suv", year1: 0.80, year3: 0.63, year5: 0.50, year7: 0.39, year10: 0.26 },
  { make: "Mazda", model: "CX-90", msrp: 48000, class: "suv", year1: 0.78, year3: 0.61, year5: 0.49, year7: 0.38, year10: 0.25 },
  { make: "Mazda", model: "Mazda3", msrp: 28000, class: "sedan", year1: 0.79, year3: 0.62, year5: 0.49, year7: 0.38, year10: 0.25 },
  { make: "Mazda", model: "MX-5 Miata", msrp: 35000, class: "sports", year1: 0.82, year3: 0.68, year5: 0.57, year7: 0.47, year10: 0.35 },
  { make: "Mazda", model: "CX-30", msrp: 30000, class: "suv", year1: 0.79, year3: 0.62, year5: 0.49, year7: 0.38, year10: 0.25 },
  { make: "Mazda", model: "CX-70", msrp: 45000, class: "suv", year1: 0.78, year3: 0.61, year5: 0.49, year7: 0.38, year10: 0.25 },

  // VOLKSWAGEN (5)
  { make: "Volkswagen", model: "Tiguan", msrp: 34000, class: "suv", year1: 0.76, year3: 0.58, year5: 0.45, year7: 0.34, year10: 0.22 },
  { make: "Volkswagen", model: "Atlas", msrp: 42000, class: "suv", year1: 0.74, year3: 0.56, year5: 0.43, year7: 0.32, year10: 0.20 },
  { make: "Volkswagen", model: "Jetta", msrp: 26000, class: "sedan", year1: 0.74, year3: 0.56, year5: 0.43, year7: 0.32, year10: 0.20 },
  { make: "Volkswagen", model: "ID.4", msrp: 45000, class: "ev", year1: 0.68, year3: 0.50, year5: 0.36, year7: 0.26, year10: 0.16 },
  { make: "Volkswagen", model: "Golf GTI", msrp: 38000, class: "sports", year1: 0.78, year3: 0.62, year5: 0.50, year7: 0.40, year10: 0.28 },
  { make: "Volkswagen", model: "Taos", msrp: 28000, class: "suv", year1: 0.75, year3: 0.57, year5: 0.44, year7: 0.33, year10: 0.21 },
  { make: "Volkswagen", model: "Passat", msrp: 32000, class: "sedan", year1: 0.72, year3: 0.54, year5: 0.41, year7: 0.30, year10: 0.18 },

  // BMW (7)
  { make: "BMW", model: "3 Series", msrp: 52000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.42, year7: 0.32, year10: 0.20 },
  { make: "BMW", model: "5 Series", msrp: 65000, class: "luxury", year1: 0.70, year3: 0.52, year5: 0.38, year7: 0.28, year10: 0.17 },
  { make: "BMW", model: "X3", msrp: 55000, class: "luxury", year1: 0.73, year3: 0.56, year5: 0.43, year7: 0.33, year10: 0.21 },
  { make: "BMW", model: "X5", msrp: 72000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.42, year7: 0.32, year10: 0.20 },
  { make: "BMW", model: "X7", msrp: 85000, class: "luxury", year1: 0.70, year3: 0.52, year5: 0.39, year7: 0.29, year10: 0.18 },
  { make: "BMW", model: "i4", msrp: 62000, class: "ev", year1: 0.68, year3: 0.50, year5: 0.36, year7: 0.26, year10: 0.16 },
  { make: "BMW", model: "iX", msrp: 90000, class: "ev", year1: 0.66, year3: 0.48, year5: 0.34, year7: 0.24, year10: 0.15 },
  { make: "BMW", model: "M3", msrp: 85000, class: "sports", year1: 0.78, year3: 0.64, year5: 0.54, year7: 0.45, year10: 0.34 },
  { make: "BMW", model: "M4", msrp: 88000, class: "sports", year1: 0.78, year3: 0.64, year5: 0.54, year7: 0.45, year10: 0.34 },
  { make: "BMW", model: "7 Series", msrp: 110000, class: "luxury", year1: 0.65, year3: 0.46, year5: 0.33, year7: 0.24, year10: 0.15 },

  // MERCEDES-BENZ (7)
  { make: "Mercedes", model: "C-Class", msrp: 55000, class: "luxury", year1: 0.70, year3: 0.52, year5: 0.38, year7: 0.28, year10: 0.17 },
  { make: "Mercedes", model: "E-Class", msrp: 72000, class: "luxury", year1: 0.68, year3: 0.50, year5: 0.36, year7: 0.26, year10: 0.16 },
  { make: "Mercedes", model: "S-Class", msrp: 120000, class: "luxury", year1: 0.62, year3: 0.43, year5: 0.30, year7: 0.22, year10: 0.14 },
  { make: "Mercedes", model: "GLC", msrp: 58000, class: "luxury", year1: 0.71, year3: 0.54, year5: 0.41, year7: 0.31, year10: 0.20 },
  { make: "Mercedes", model: "GLE", msrp: 75000, class: "luxury", year1: 0.70, year3: 0.53, year5: 0.40, year7: 0.30, year10: 0.19 },
  { make: "Mercedes", model: "GLS", msrp: 85000, class: "luxury", year1: 0.69, year3: 0.51, year5: 0.38, year7: 0.28, year10: 0.17 },
  { make: "Mercedes", model: "EQS", msrp: 110000, class: "ev", year1: 0.58, year3: 0.40, year5: 0.28, year7: 0.20, year10: 0.13 },
  { make: "Mercedes", model: "EQE", msrp: 85000, class: "ev", year1: 0.60, year3: 0.42, year5: 0.30, year7: 0.22, year10: 0.14 },
  { make: "Mercedes", model: "AMG C63", msrp: 95000, class: "sports", year1: 0.72, year3: 0.56, year5: 0.44, year7: 0.35, year10: 0.25 },
  { make: "Mercedes", model: "G-Wagon", msrp: 180000, class: "luxury", year1: 0.88, year3: 0.78, year5: 0.70, year7: 0.62, year10: 0.50 },

  // AUDI (6)
  { make: "Audi", model: "A4", msrp: 50000, class: "luxury", year1: 0.73, year3: 0.56, year5: 0.43, year7: 0.33, year10: 0.21 },
  { make: "Audi", model: "A6", msrp: 65000, class: "luxury", year1: 0.70, year3: 0.52, year5: 0.38, year7: 0.28, year10: 0.17 },
  { make: "Audi", model: "Q5", msrp: 55000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.42, year7: 0.32, year10: 0.20 },
  { make: "Audi", model: "Q7", msrp: 72000, class: "luxury", year1: 0.70, year3: 0.53, year5: 0.40, year7: 0.30, year10: 0.19 },
  { make: "Audi", model: "Q8", msrp: 80000, class: "luxury", year1: 0.69, year3: 0.51, year5: 0.38, year7: 0.28, year10: 0.17 },
  { make: "Audi", model: "e-tron", msrp: 75000, class: "ev", year1: 0.62, year3: 0.44, year5: 0.32, year7: 0.24, year10: 0.15 },
  { make: "Audi", model: "e-tron GT", msrp: 110000, class: "ev", year1: 0.65, year3: 0.48, year5: 0.36, year7: 0.28, year10: 0.18 },
  { make: "Audi", model: "RS5", msrp: 92000, class: "sports", year1: 0.74, year3: 0.58, year5: 0.46, year7: 0.37, year10: 0.27 },
  { make: "Audi", model: "RS7", msrp: 130000, class: "sports", year1: 0.70, year3: 0.54, year5: 0.42, year7: 0.33, year10: 0.24 },

  // LEXUS (5)
  { make: "Lexus", model: "RX", msrp: 58000, class: "luxury", year1: 0.82, year3: 0.68, year5: 0.56, year7: 0.45, year10: 0.30 },
  { make: "Lexus", model: "ES", msrp: 48000, class: "luxury", year1: 0.82, year3: 0.67, year5: 0.55, year7: 0.43, year10: 0.28 },
  { make: "Lexus", model: "NX", msrp: 46000, class: "luxury", year1: 0.81, year3: 0.66, year5: 0.54, year7: 0.42, year10: 0.27 },
  { make: "Lexus", model: "GX", msrp: 68000, class: "luxury", year1: 0.86, year3: 0.74, year5: 0.64, year7: 0.54, year10: 0.40 },
  { make: "Lexus", model: "LX", msrp: 100000, class: "luxury", year1: 0.87, year3: 0.76, year5: 0.67, year7: 0.58, year10: 0.45 },
  { make: "Lexus", model: "IS", msrp: 45000, class: "luxury", year1: 0.80, year3: 0.64, year5: 0.52, year7: 0.40, year10: 0.26 },
  { make: "Lexus", model: "LC", msrp: 100000, class: "sports", year1: 0.78, year3: 0.64, year5: 0.54, year7: 0.45, year10: 0.34 },

  // ACURA (3)
  { make: "Acura", model: "MDX", msrp: 55000, class: "luxury", year1: 0.78, year3: 0.62, year5: 0.50, year7: 0.39, year10: 0.26 },
  { make: "Acura", model: "RDX", msrp: 48000, class: "luxury", year1: 0.77, year3: 0.60, year5: 0.48, year7: 0.37, year10: 0.24 },
  { make: "Acura", model: "TLX", msrp: 46000, class: "luxury", year1: 0.76, year3: 0.59, year5: 0.47, year7: 0.36, year10: 0.23 },
  { make: "Acura", model: "Integra", msrp: 38000, class: "luxury", year1: 0.78, year3: 0.62, year5: 0.50, year7: 0.40, year10: 0.27 },
  { make: "Acura", model: "ZDX", msrp: 70000, class: "ev", year1: 0.68, year3: 0.50, year5: 0.36, year7: 0.26, year10: 0.16 },

  // INFINITI (3)
  { make: "Infiniti", model: "QX60", msrp: 52000, class: "luxury", year1: 0.68, year3: 0.50, year5: 0.38, year7: 0.29, year10: 0.19 },
  { make: "Infiniti", model: "QX80", msrp: 78000, class: "luxury", year1: 0.66, year3: 0.48, year5: 0.36, year7: 0.27, year10: 0.18 },
  { make: "Infiniti", model: "Q50", msrp: 48000, class: "luxury", year1: 0.66, year3: 0.48, year5: 0.36, year7: 0.27, year10: 0.18 },

  // CADILLAC (4)
  { make: "Cadillac", model: "Escalade", msrp: 90000, class: "luxury", year1: 0.78, year3: 0.62, year5: 0.50, year7: 0.40, year10: 0.28 },
  { make: "Cadillac", model: "XT5", msrp: 52000, class: "luxury", year1: 0.70, year3: 0.52, year5: 0.40, year7: 0.30, year10: 0.20 },
  { make: "Cadillac", model: "XT6", msrp: 58000, class: "luxury", year1: 0.70, year3: 0.52, year5: 0.40, year7: 0.30, year10: 0.20 },
  { make: "Cadillac", model: "Lyriq", msrp: 65000, class: "ev", year1: 0.65, year3: 0.47, year5: 0.34, year7: 0.25, year10: 0.16 },

  // LINCOLN (3)
  { make: "Lincoln", model: "Navigator", msrp: 85000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.43, year7: 0.34, year10: 0.24 },
  { make: "Lincoln", model: "Aviator", msrp: 60000, class: "luxury", year1: 0.70, year3: 0.52, year5: 0.40, year7: 0.31, year10: 0.21 },
  { make: "Lincoln", model: "Corsair", msrp: 45000, class: "luxury", year1: 0.70, year3: 0.52, year5: 0.40, year7: 0.31, year10: 0.21 },

  // GENESIS (3)
  { make: "Genesis", model: "GV80", msrp: 65000, class: "luxury", year1: 0.74, year3: 0.57, year5: 0.45, year7: 0.36, year10: 0.25 },
  { make: "Genesis", model: "GV70", msrp: 55000, class: "luxury", year1: 0.74, year3: 0.57, year5: 0.45, year7: 0.36, year10: 0.25 },
  { make: "Genesis", model: "G80", msrp: 58000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.43, year7: 0.34, year10: 0.23 },
  { make: "Genesis", model: "G70", msrp: 48000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.43, year7: 0.34, year10: 0.23 },
  { make: "Genesis", model: "Electrified GV70", msrp: 70000, class: "ev", year1: 0.68, year3: 0.50, year5: 0.36, year7: 0.26, year10: 0.16 },

  // VOLVO (4)
  { make: "Volvo", model: "XC90", msrp: 60000, class: "luxury", year1: 0.74, year3: 0.57, year5: 0.45, year7: 0.35, year10: 0.24 },
  { make: "Volvo", model: "XC60", msrp: 50000, class: "luxury", year1: 0.74, year3: 0.57, year5: 0.45, year7: 0.35, year10: 0.24 },
  { make: "Volvo", model: "XC40", msrp: 42000, class: "luxury", year1: 0.74, year3: 0.57, year5: 0.45, year7: 0.35, year10: 0.24 },
  { make: "Volvo", model: "EX90", msrp: 80000, class: "ev", year1: 0.66, year3: 0.48, year5: 0.35, year7: 0.26, year10: 0.17 },

  // TESLA (5)
  { make: "Tesla", model: "Model 3", msrp: 46000, class: "ev", year1: 0.78, year3: 0.62, year5: 0.48, year7: 0.36, year10: 0.24 },
  { make: "Tesla", model: "Model Y", msrp: 52000, class: "ev", year1: 0.80, year3: 0.65, year5: 0.52, year7: 0.40, year10: 0.27 },
  { make: "Tesla", model: "Model S", msrp: 95000, class: "ev", year1: 0.72, year3: 0.54, year5: 0.40, year7: 0.30, year10: 0.20 },
  { make: "Tesla", model: "Model X", msrp: 110000, class: "ev", year1: 0.72, year3: 0.54, year5: 0.40, year7: 0.30, year10: 0.20 },
  { make: "Tesla", model: "Cybertruck", msrp: 85000, class: "truck", year1: 0.85, year3: 0.72, year5: 0.62, year7: 0.52, year10: 0.40 },

  // PORSCHE (4)
  { make: "Porsche", model: "911", msrp: 120000, class: "sports", year1: 0.88, year3: 0.78, year5: 0.68, year7: 0.58, year10: 0.45 },
  { make: "Porsche", model: "Cayenne", msrp: 85000, class: "luxury", year1: 0.78, year3: 0.62, year5: 0.50, year7: 0.40, year10: 0.28 },
  { make: "Porsche", model: "Macan", msrp: 65000, class: "luxury", year1: 0.76, year3: 0.60, year5: 0.48, year7: 0.38, year10: 0.26 },
  { make: "Porsche", model: "Panamera", msrp: 100000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.42, year7: 0.32, year10: 0.21 },
  { make: "Porsche", model: "Taycan", msrp: 95000, class: "ev", year1: 0.68, year3: 0.50, year5: 0.36, year7: 0.27, year10: 0.18 },
  { make: "Porsche", model: "718 Cayman", msrp: 75000, class: "sports", year1: 0.82, year3: 0.68, year5: 0.57, year7: 0.47, year10: 0.35 },

  // LAND ROVER (3)
  { make: "Land Rover", model: "Range Rover", msrp: 110000, class: "luxury", year1: 0.72, year3: 0.54, year5: 0.40, year7: 0.30, year10: 0.20 },
  { make: "Land Rover", model: "Defender", msrp: 65000, class: "suv", year1: 0.82, year3: 0.68, year5: 0.58, year7: 0.48, year10: 0.35 },
  { make: "Land Rover", model: "Discovery", msrp: 62000, class: "suv", year1: 0.68, year3: 0.50, year5: 0.38, year7: 0.29, year10: 0.19 },

  // JAGUAR (2)
  { make: "Jaguar", model: "F-PACE", msrp: 60000, class: "luxury", year1: 0.66, year3: 0.48, year5: 0.36, year7: 0.27, year10: 0.18 },
  { make: "Jaguar", model: "I-PACE", msrp: 75000, class: "ev", year1: 0.55, year3: 0.38, year5: 0.26, year7: 0.19, year10: 0.12 },

  // ALFA ROMEO (2)
  { make: "Alfa Romeo", model: "Stelvio", msrp: 52000, class: "luxury", year1: 0.65, year3: 0.47, year5: 0.35, year7: 0.26, year10: 0.17 },
  { make: "Alfa Romeo", model: "Giulia", msrp: 48000, class: "luxury", year1: 0.65, year3: 0.47, year5: 0.35, year7: 0.26, year10: 0.17 },

  // MASERATI (3)
  { make: "Maserati", model: "Ghibli", msrp: 85000, class: "luxury", year1: 0.62, year3: 0.44, year5: 0.32, year7: 0.24, year10: 0.16 },
  { make: "Maserati", model: "Levante", msrp: 90000, class: "luxury", year1: 0.60, year3: 0.42, year5: 0.30, year7: 0.22, year10: 0.15 },
  { make: "Maserati", model: "Quattroporte", msrp: 120000, class: "luxury", year1: 0.58, year3: 0.40, year5: 0.28, year7: 0.21, year10: 0.14 },

  // DODGE (3)
  { make: "Dodge", model: "Challenger", msrp: 42000, class: "sports", year1: 0.78, year3: 0.62, year5: 0.50, year7: 0.40, year10: 0.28 },
  { make: "Dodge", model: "Charger", msrp: 42000, class: "sports", year1: 0.76, year3: 0.59, year5: 0.47, year7: 0.37, year10: 0.25 },
  { make: "Dodge", model: "Durango", msrp: 45000, class: "suv", year1: 0.74, year3: 0.56, year5: 0.44, year7: 0.34, year10: 0.22 },

  // CHRYSLER (2)
  { make: "Chrysler", model: "Pacifica", msrp: 42000, class: "van", year1: 0.70, year3: 0.52, year5: 0.40, year7: 0.31, year10: 0.20 },
  { make: "Chrysler", model: "300", msrp: 40000, class: "sedan", year1: 0.66, year3: 0.48, year5: 0.36, year7: 0.27, year10: 0.18 },

  // MINI (2)
  { make: "Mini", model: "Cooper", msrp: 35000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.43, year7: 0.34, year10: 0.23 },
  { make: "Mini", model: "Countryman", msrp: 42000, class: "luxury", year1: 0.71, year3: 0.54, year5: 0.42, year7: 0.33, year10: 0.22 },

  // FIAT (1)
  { make: "Fiat", model: "500", msrp: 25000, class: "luxury", year1: 0.60, year3: 0.42, year5: 0.30, year7: 0.22, year10: 0.14 },

  // MITSUBISHI (2)
  { make: "Mitsubishi", model: "Outlander", msrp: 32000, class: "suv", year1: 0.68, year3: 0.50, year5: 0.38, year7: 0.29, year10: 0.19 },
  { make: "Mitsubishi", model: "Eclipse Cross", msrp: 28000, class: "suv", year1: 0.66, year3: 0.48, year5: 0.36, year7: 0.27, year10: 0.18 },

  // RIVIAN (2)
  { make: "Rivian", model: "R1T", msrp: 78000, class: "truck", year1: 0.72, year3: 0.55, year5: 0.42, year7: 0.33, year10: 0.23 },
  { make: "Rivian", model: "R1S", msrp: 82000, class: "suv", year1: 0.72, year3: 0.55, year5: 0.42, year7: 0.33, year10: 0.23 },

  // LUCID (1)
  { make: "Lucid", model: "Air", msrp: 90000, class: "ev", year1: 0.62, year3: 0.44, year5: 0.32, year7: 0.24, year10: 0.16 },

  // POLESTAR (2)
  { make: "Polestar", model: "2", msrp: 55000, class: "ev", year1: 0.64, year3: 0.46, year5: 0.34, year7: 0.25, year10: 0.17 },
  { make: "Polestar", model: "3", msrp: 85000, class: "ev", year1: 0.64, year3: 0.46, year5: 0.34, year7: 0.25, year10: 0.17 },

  // EXOTICS
  { make: "Lamborghini", model: "Urus", msrp: 250000, class: "exotic", year1: 0.82, year3: 0.70, year5: 0.60, year7: 0.52, year10: 0.42 },
  { make: "Lamborghini", model: "Huracan", msrp: 250000, class: "exotic", year1: 0.82, year3: 0.70, year5: 0.60, year7: 0.52, year10: 0.42 },
  { make: "Ferrari", model: "296 GTB", msrp: 350000, class: "exotic", year1: 0.85, year3: 0.75, year5: 0.67, year7: 0.60, year10: 0.50 },
  { make: "Ferrari", model: "SF90", msrp: 600000, class: "exotic", year1: 0.85, year3: 0.75, year5: 0.67, year7: 0.60, year10: 0.50 },
  { make: "McLaren", model: "Artura", msrp: 250000, class: "exotic", year1: 0.78, year3: 0.64, year5: 0.54, year7: 0.46, year10: 0.36 },
  { make: "Aston Martin", model: "DB11", msrp: 220000, class: "exotic", year1: 0.72, year3: 0.56, year5: 0.44, year7: 0.36, year10: 0.28 },
  { make: "Bentley", model: "Bentayga", msrp: 200000, class: "exotic", year1: 0.75, year3: 0.60, year5: 0.50, year7: 0.42, year10: 0.34 },
  { make: "Bentley", model: "Flying Spur", msrp: 220000, class: "exotic", year1: 0.73, year3: 0.57, year5: 0.47, year7: 0.39, year10: 0.31 },
  { make: "Rolls-Royce", model: "Cullinan", msrp: 350000, class: "exotic", year1: 0.78, year3: 0.66, year5: 0.58, year7: 0.52, year10: 0.44 },
  { make: "Rolls-Royce", model: "Ghost", msrp: 350000, class: "exotic", year1: 0.76, year3: 0.63, year5: 0.54, year7: 0.48, year10: 0.40 },

  // HONDA (additional)
  { make: "Honda", model: "HR-V", msrp: 28000, class: "suv", year1: 0.82, year3: 0.66, year5: 0.54, year7: 0.42, year10: 0.28 },
  { make: "Honda", model: "Insight", msrp: 29000, class: "sedan", year1: 0.78, year3: 0.60, year5: 0.47, year7: 0.36, year10: 0.23 },

  // TOYOTA (additional)
  { make: "Toyota", model: "Venza", msrp: 38000, class: "suv", year1: 0.80, year3: 0.63, year5: 0.50, year7: 0.39, year10: 0.26 },
  { make: "Toyota", model: "Corolla Cross", msrp: 28000, class: "suv", year1: 0.84, year3: 0.68, year5: 0.56, year7: 0.44, year10: 0.30 },
  { make: "Toyota", model: "GR86", msrp: 32000, class: "sports", year1: 0.82, year3: 0.68, year5: 0.57, year7: 0.47, year10: 0.35 },
  { make: "Toyota", model: "Supra", msrp: 60000, class: "sports", year1: 0.80, year3: 0.66, year5: 0.56, year7: 0.47, year10: 0.36 },

  // CHEVY (additional)
  { make: "Chevrolet", model: "Trailblazer", msrp: 28000, class: "suv", year1: 0.74, year3: 0.56, year5: 0.43, year7: 0.32, year10: 0.20 },
  { make: "Chevrolet", model: "Trax", msrp: 24000, class: "suv", year1: 0.74, year3: 0.56, year5: 0.43, year7: 0.32, year10: 0.20 },
  { make: "Chevrolet", model: "Colorado", msrp: 38000, class: "truck", year1: 0.80, year3: 0.65, year5: 0.54, year7: 0.43, year10: 0.29 },

  // GMC (additional)
  { make: "GMC", model: "Canyon", msrp: 40000, class: "truck", year1: 0.80, year3: 0.65, year5: 0.54, year7: 0.43, year10: 0.29 },
  { make: "GMC", model: "Hummer EV", msrp: 110000, class: "ev", year1: 0.75, year3: 0.60, year5: 0.50, year7: 0.42, year10: 0.32 },

  // JEEP (additional)
  { make: "Jeep", model: "Compass", msrp: 32000, class: "suv", year1: 0.74, year3: 0.56, year5: 0.43, year7: 0.32, year10: 0.20 },
  { make: "Jeep", model: "Renegade", msrp: 30000, class: "suv", year1: 0.72, year3: 0.54, year5: 0.41, year7: 0.30, year10: 0.19 },
  { make: "Jeep", model: "Grand Wagoneer", msrp: 95000, class: "suv", year1: 0.74, year3: 0.57, year5: 0.45, year7: 0.36, year10: 0.26 },

  // NISSAN (additional)
  { make: "Nissan", model: "Versa", msrp: 20000, class: "sedan", year1: 0.68, year3: 0.50, year5: 0.38, year7: 0.29, year10: 0.19 },
  { make: "Nissan", model: "Kicks", msrp: 24000, class: "suv", year1: 0.72, year3: 0.54, year5: 0.41, year7: 0.30, year10: 0.19 },
  { make: "Nissan", model: "Maxima", msrp: 42000, class: "sedan", year1: 0.68, year3: 0.50, year5: 0.38, year7: 0.29, year10: 0.19 },

  // HYUNDAI (additional)
  { make: "Hyundai", model: "Venue", msrp: 24000, class: "suv", year1: 0.76, year3: 0.58, year5: 0.45, year7: 0.34, year10: 0.22 },
  { make: "Hyundai", model: "Nexo", msrp: 62000, class: "ev", year1: 0.55, year3: 0.38, year5: 0.26, year7: 0.19, year10: 0.12 },

  // KIA (additional)
  { make: "Kia", model: "Niro", msrp: 30000, class: "suv", year1: 0.74, year3: 0.56, year5: 0.43, year7: 0.32, year10: 0.20 },
  { make: "Kia", model: "Stinger", msrp: 42000, class: "sports", year1: 0.72, year3: 0.56, year5: 0.45, year7: 0.36, year10: 0.26 },

  // FORD (additional)
  { make: "Ford", model: "Maverick", msrp: 28000, class: "truck", year1: 0.85, year3: 0.72, year5: 0.62, year7: 0.52, year10: 0.38 },
  { make: "Ford", model: "Ranger", msrp: 38000, class: "truck", year1: 0.82, year3: 0.68, year5: 0.58, year7: 0.48, year10: 0.34 },
  { make: "Ford", model: "EcoSport", msrp: 26000, class: "suv", year1: 0.72, year3: 0.54, year5: 0.41, year7: 0.30, year10: 0.19 },

  // MERCEDES (additional)
  { make: "Mercedes", model: "CLA", msrp: 45000, class: "luxury", year1: 0.68, year3: 0.50, year5: 0.37, year7: 0.27, year10: 0.17 },
  { make: "Mercedes", model: "A-Class", msrp: 40000, class: "luxury", year1: 0.66, year3: 0.48, year5: 0.35, year7: 0.26, year10: 0.16 },
  { make: "Mercedes", model: "GT", msrp: 140000, class: "sports", year1: 0.72, year3: 0.56, year5: 0.45, year7: 0.37, year10: 0.28 },

  // BMW (additional)
  { make: "BMW", model: "2 Series", msrp: 42000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.42, year7: 0.32, year10: 0.20 },
  { make: "BMW", model: "X1", msrp: 42000, class: "luxury", year1: 0.73, year3: 0.56, year5: 0.43, year7: 0.33, year10: 0.21 },
  { make: "BMW", model: "X2", msrp: 44000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.42, year7: 0.32, year10: 0.20 },
  { make: "BMW", model: "Z4", msrp: 65000, class: "sports", year1: 0.78, year3: 0.64, year5: 0.54, year7: 0.45, year10: 0.34 },

  // AUDI (additional)
  { make: "Audi", model: "A3", msrp: 40000, class: "luxury", year1: 0.70, year3: 0.53, year5: 0.40, year7: 0.30, year10: 0.19 },
  { make: "Audi", model: "Q3", msrp: 42000, class: "luxury", year1: 0.71, year3: 0.54, year5: 0.41, year7: 0.31, year10: 0.20 },
  { make: "Audi", model: "TT", msrp: 58000, class: "sports", year1: 0.76, year3: 0.62, year5: 0.52, year7: 0.43, year10: 0.33 },

  // LEXUS (additional)
  { make: "Lexus", model: "UX", msrp: 38000, class: "luxury", year1: 0.80, year3: 0.64, year5: 0.52, year7: 0.41, year10: 0.27 },
  { make: "Lexus", model: "RC", msrp: 50000, class: "sports", year1: 0.78, year3: 0.62, year5: 0.51, year7: 0.41, year10: 0.29 },
  { make: "Lexus", model: "LS", msrp: 80000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.43, year7: 0.34, year10: 0.24 },

  // VOLVO (additional)
  { make: "Volvo", model: "S60", msrp: 48000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.43, year7: 0.34, year10: 0.24 },
  { make: "Volvo", model: "S90", msrp: 60000, class: "luxury", year1: 0.70, year3: 0.53, year5: 0.41, year7: 0.32, year10: 0.22 },
  { make: "Volvo", model: "V60", msrp: 52000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.43, year7: 0.34, year10: 0.24 },
  { make: "Volvo", model: "EX30", msrp: 40000, class: "ev", year1: 0.68, year3: 0.50, year5: 0.37, year7: 0.28, year10: 0.19 },

  // GENESIS (additional)
  { make: "Genesis", model: "G90", msrp: 95000, class: "luxury", year1: 0.68, year3: 0.51, year5: 0.39, year7: 0.31, year10: 0.22 },

  // CADILLAC (additional)
  { make: "Cadillac", model: "CT5", msrp: 45000, class: "luxury", year1: 0.68, year3: 0.50, year5: 0.38, year7: 0.29, year10: 0.20 },
  { make: "Cadillac", model: "CT4", msrp: 38000, class: "luxury", year1: 0.68, year3: 0.50, year5: 0.38, year7: 0.29, year10: 0.20 },

  // LINCOLN (additional)
  { make: "Lincoln", model: "Nautilus", msrp: 52000, class: "luxury", year1: 0.70, year3: 0.53, year5: 0.41, year7: 0.32, year10: 0.22 },

  // DODGE (additional)
  { make: "Dodge", model: "Hornet", msrp: 35000, class: "suv", year1: 0.72, year3: 0.55, year5: 0.43, year7: 0.34, year10: 0.24 },

  // BUICK (2)
  { make: "Buick", model: "Enclave", msrp: 48000, class: "suv", year1: 0.68, year3: 0.50, year5: 0.39, year7: 0.30, year10: 0.21 },
  { make: "Buick", model: "Encore GX", msrp: 30000, class: "suv", year1: 0.68, year3: 0.50, year5: 0.39, year7: 0.30, year10: 0.21 },

  // TESLA (additional)
  { make: "Tesla", model: "Semi", msrp: 250000, class: "truck", year1: 0.78, year3: 0.62, year5: 0.50, year7: 0.40, year10: 0.30 },

  // RIVIAN (additional)
  { make: "Rivian", model: "R1S", msrp: 82000, class: "suv", year1: 0.72, year3: 0.55, year5: 0.42, year7: 0.33, year10: 0.23 },

  // HONDA (additional)
  { make: "Honda", model: "Prologue", msrp: 52000, class: "ev", year1: 0.70, year3: 0.52, year5: 0.38, year7: 0.28, year10: 0.18 },

  // CHEVY (additional EVs)
  { make: "Chevrolet", model: "Equinox EV", msrp: 38000, class: "ev", year1: 0.65, year3: 0.47, year5: 0.34, year7: 0.25, year10: 0.16 },
  { make: "Chevrolet", model: "Blazer EV", msrp: 52000, class: "ev", year1: 0.65, year3: 0.47, year5: 0.34, year7: 0.25, year10: 0.16 },
  { make: "Chevrolet", model: "Silverado EV", msrp: 80000, class: "ev", year1: 0.68, year3: 0.52, year5: 0.40, year7: 0.32, year10: 0.24 },

  // VW (additional)
  { make: "Volkswagen", model: "ID.Buzz", msrp: 65000, class: "ev", year1: 0.72, year3: 0.56, year5: 0.45, year7: 0.37, year10: 0.28 },
  { make: "Volkswagen", model: "Atlas Cross Sport", msrp: 40000, class: "suv", year1: 0.73, year3: 0.55, year5: 0.42, year7: 0.32, year10: 0.21 },

  // MAZDA (additional)
  { make: "Mazda", model: "MX-30", msrp: 38000, class: "ev", year1: 0.55, year3: 0.38, year5: 0.26, year7: 0.19, year10: 0.12 },

  // SUBARU (additional)
  { make: "Subaru", model: "Legacy", msrp: 31000, class: "sedan", year1: 0.82, year3: 0.67, year5: 0.55, year7: 0.43, year10: 0.29 },

  // HYUNDAI (additional)
  { make: "Hyundai", model: "Santa Cruz", msrp: 32000, class: "truck", year1: 0.80, year3: 0.64, year5: 0.53, year7: 0.43, year10: 0.30 },

  // KIA (additional)
  { make: "Kia", model: "Rio", msrp: 20000, class: "sedan", year1: 0.72, year3: 0.54, year5: 0.41, year7: 0.31, year10: 0.20 },

  // NISSAN (additional)
  { make: "Nissan", model: "GT-R", msrp: 120000, class: "sports", year1: 0.78, year3: 0.64, year5: 0.54, year7: 0.46, year10: 0.36 },

  // TOYOTA (additional)
  { make: "Toyota", model: "Crown", msrp: 45000, class: "sedan", year1: 0.78, year3: 0.62, year5: 0.50, year7: 0.40, year10: 0.28 },

  // MERCEDES (additional)
  { make: "Mercedes", model: "SL", msrp: 140000, class: "sports", year1: 0.74, year3: 0.58, year5: 0.47, year7: 0.39, year10: 0.30 },

  // BMW (additional)
  { make: "BMW", model: "XM", msrp: 160000, class: "luxury", year1: 0.68, year3: 0.51, year5: 0.40, year7: 0.32, year10: 0.24 },

  // AUDI (additional)
  { make: "Audi", model: "A5", msrp: 52000, class: "luxury", year1: 0.72, year3: 0.55, year5: 0.42, year7: 0.32, year10: 0.21 },
  { make: "Audi", model: "S4", msrp: 62000, class: "sports", year1: 0.74, year3: 0.58, year5: 0.46, year7: 0.37, year10: 0.27 },

  // PORSCHE (additional)
  { make: "Porsche", model: "718 Boxster", msrp: 72000, class: "sports", year1: 0.82, year3: 0.68, year5: 0.57, year7: 0.47, year10: 0.35 },

  // EXOTICS (additional)
  { make: "Aston Martin", model: "Vantage", msrp: 160000, class: "exotic", year1: 0.74, year3: 0.58, year5: 0.47, year7: 0.39, year10: 0.31 },
  { make: "McLaren", model: "720S", msrp: 320000, class: "exotic", year1: 0.76, year3: 0.62, year5: 0.52, year7: 0.44, year10: 0.36 },
];

const COLORS = ["#f43f5e", "#10b981", "#3b82f6", "#f59e0b"];

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}k`;
  return `$${n.toFixed(0)}`;
}

function formatFullMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function interpolateValue(vehicle: VehicleProfile, years: number): number {
  const points = [
    { year: 0, value: 1.0 },
    { year: 1, value: vehicle.year1 },
    { year: 3, value: vehicle.year3 },
    { year: 5, value: vehicle.year5 },
    { year: 7, value: vehicle.year7 },
    { year: 10, value: vehicle.year10 },
  ];

  for (let i = 0; i < points.length - 1; i++) {
    if (years >= points[i].year && years <= points[i + 1].year) {
      const t = (years - points[i].year) / (points[i + 1].year - points[i].year);
      const logV1 = Math.log(points[i].value);
      const logV2 = Math.log(points[i + 1].value);
      return Math.exp(logV1 + t * (logV2 - logV1));
    }
  }
  return vehicle.year10 * Math.pow(0.92, years - 10);
}

export function CarDepreciationCalculatorClient() {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleProfile>(VEHICLE_DB[0]);
  const [state, setState] = useState<CalculatorState>({
    selectedYear: 2025,
    purchasePrice: VEHICLE_DB[0].msrp,
    currentMileage: 15000,
    annualMiles: 12000,
    condition: "good",
    hasAWD: false,
    hasLeather: false,
    hasSunroof: false,
    hasTechPackage: false,
    hasAccident: false,
    showComparison: false,
    compareVehicle: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return VEHICLE_DB;
    return VEHICLE_DB.filter(v => 
      `${v.make} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const vehicleAge = CURRENT_YEAR - state.selectedYear;

  const calculateValue = (vehicle: VehicleProfile, yearsFromPurchase: number, customState = state) => {
    let retention = interpolateValue(vehicle, yearsFromPurchase);

    // Mileage adjustment
    const expectedMiles = yearsFromPurchase * customState.annualMiles;
    const actualMiles = customState.currentMileage + (customState.annualMiles * yearsFromPurchase);
    const mileageDiff = actualMiles - expectedMiles;
    const mileagePenalty = Math.max(0, mileageDiff / 10000) * 0.02;
    retention -= mileagePenalty;

    // Condition
    retention *= CONDITION_MULTIPLIERS[customState.condition];

    // Options
    if (customState.hasAWD) retention += 0.03;
    if (customState.hasLeather) retention += 0.02;
    if (customState.hasSunroof) retention += 0.01;
    if (customState.hasTechPackage) retention -= Math.min(0.03 * yearsFromPurchase, 0.10);
    if (customState.hasAccident) retention -= 0.15;

    return Math.max(0.05, Math.min(1.0, retention)) * customState.purchasePrice;
  };

  const chartData = useMemo(() => {
    const data = [];
    for (let year = 0; year <= 15; year++) {
      const point: any = { year, label: `Year ${year}` };
      point[selectedVehicle.model] = calculateValue(selectedVehicle, year);
      if (state.compareVehicle) {
        point[state.compareVehicle.model] = calculateValue(state.compareVehicle, year, {
          ...state,
          purchasePrice: state.compareVehicle.msrp,
          hasAWD: state.compareVehicle.class === "truck" || state.compareVehicle.class === "suv",
        });
      }
      data.push(point);
    }
    return data;
  }, [selectedVehicle, state]);

  const currentValue = calculateValue(selectedVehicle, vehicleAge);
  const year1Value = calculateValue(selectedVehicle, 1);
  const year3Value = calculateValue(selectedVehicle, 3);
  const year5Value = calculateValue(selectedVehicle, 5);
  const year10Value = calculateValue(selectedVehicle, 10);

  const totalDepreciation = state.purchasePrice - currentValue;
  const year1Depreciation = state.purchasePrice - year1Value;
  const year5Depreciation = state.purchasePrice - year5Value;

  const handleStateChange = <K extends keyof CalculatorState>(field: K, value: CalculatorState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  // Update purchase price when vehicle changes
  const handleVehicleSelect = (vehicle: VehicleProfile) => {
    setSelectedVehicle(vehicle);
    setState((prev) => ({ ...prev, purchasePrice: vehicle.msrp }));
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const [compareSearchTerm, setCompareSearchTerm] = useState("");
  const [isCompareDropdownOpen, setIsCompareDropdownOpen] = useState(false);

  const filteredCompareVehicles = useMemo(() => {
    if (!compareSearchTerm) return VEHICLE_DB;
    return VEHICLE_DB.filter(v => 
      `${v.make} ${v.model}`.toLowerCase().includes(compareSearchTerm.toLowerCase())
    );
  }, [compareSearchTerm]);

  const handleCompareVehicleSelect = (vehicle: VehicleProfile | null) => {
    handleStateChange("compareVehicle", vehicle);
    setCompareSearchTerm("");
    setIsCompareDropdownOpen(false);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10">
                <Car className="h-5 w-5 text-rose-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Vehicle Details</h2>
            </div>

            {/* Vehicle Selector with Search */}
            <div className="space-y-3 relative">
              <label className="flex items-center justify-between text-sm font-medium text-slate-300">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-rose-400" />
                  Find Vehicle
                </div>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">120+ Models</span>
              </label>
              
              <div className="relative group">
                <input
                  type="text"
                  placeholder={`${selectedVehicle.make} ${selectedVehicle.model}...`}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                    setIsCompareDropdownOpen(false);
                  }}
                  onFocus={() => {
                    setIsDropdownOpen(true);
                    setIsCompareDropdownOpen(false);
                  }}
                  className="block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 focus:border-rose-500 focus:outline-none transition-all"
                />
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {isDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {isDropdownOpen && (
                  <div className="absolute z-50 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
                    {filteredVehicles.length > 0 ? (
                      filteredVehicles.map((v, i) => (
                        <button
                          key={i}
                          onClick={() => handleVehicleSelect(v)}
                          className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${
                            selectedVehicle === v ? "bg-rose-500/20 text-rose-400" : "text-slate-300 hover:bg-slate-900"
                          }`}
                        >
                          <div>
                            <span className="font-bold">{v.make}</span>
                            <span className="ml-1 opacity-80">{v.model}</span>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500">{formatMoney(v.msrp)}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-sm text-slate-500">
                        No vehicles found matching "{searchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${selectedVehicle.class === "truck" ? "bg-amber-500/10 text-amber-400" :
                    selectedVehicle.class === "luxury" ? "bg-violet-500/10 text-violet-400" :
                      selectedVehicle.class === "ev" ? "bg-emerald-500/10 text-emerald-400" :
                        selectedVehicle.class === "sports" ? "bg-orange-500/10 text-orange-400" :
                          selectedVehicle.class === "exotic" ? "bg-yellow-500/10 text-yellow-400" :
                            "bg-blue-500/10 text-blue-400"
                  }`}>
                  {CLASS_LABELS[selectedVehicle.class]}
                </span>
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">Current: {selectedVehicle.make} {selectedVehicle.model}</span>
              </div>
            </div>

            {/* Year Selector */}
            <div className="mt-5 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Calendar className="h-4 w-4 text-rose-400" />
                Model Year
              </label>
              <select
                value={state.selectedYear}
                onChange={(e) => handleStateChange("selectedYear", Number(e.target.value))}
                className="block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-rose-500 focus:outline-none"
              >
                {Array.from({ length: CURRENT_YEAR - 2009 }, (_, i) => CURRENT_YEAR - i).map((year) => (
                  <option key={year} value={year}>
                    {year} {year === CURRENT_YEAR ? "(New)" : year >= CURRENT_YEAR - 3 ? "(Recent)" : year >= CURRENT_YEAR - 7 ? "(Used)" : "(Older)"}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">Vehicle age: {vehicleAge} year{vehicleAge !== 1 ? 's' : ''}</p>
            </div>

            {/* Purchase Price */}
            <div className="mt-5 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <DollarSign className="h-4 w-4 text-rose-400" />
                Purchase Price / Current Value Basis
              </label>
              <input
                type="number"
                value={state.purchasePrice}
                onChange={(e) => handleStateChange("purchasePrice", Number(e.target.value))}
                className="block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-rose-500 focus:outline-none"
              />
              <p className="text-xs text-slate-500">MSRP was {formatFullMoney(selectedVehicle.msrp)}. Edit if you paid a different price.</p>
            </div>

            {/* Mileage */}
            <div className="mt-5 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Gauge className="h-4 w-4 text-rose-400" />
                Current Mileage
              </label>
              <input
                type="number"
                value={state.currentMileage}
                onChange={(e) => handleStateChange("currentMileage", Number(e.target.value))}
                className="block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="mt-5 space-y-2">
              <label className="text-sm font-medium text-slate-300">Annual Mileage</label>
              <input
                type="number"
                value={state.annualMiles}
                onChange={(e) => handleStateChange("annualMiles", Number(e.target.value))}
                className="block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-rose-500 focus:outline-none"
              />
            </div>

            {/* Condition */}
            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Shield className="h-4 w-4 text-rose-400" />
                Condition
              </label>
              <div className="grid grid-cols-5 gap-1">
                {(["excellent", "good", "average", "fair", "poor"] as Condition[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => handleStateChange("condition", c)}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium capitalize transition ${state.condition === c
                        ? "border-rose-500 bg-rose-500/10 text-rose-400"
                        : "border-slate-700 bg-slate-950 text-slate-400"
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="mt-5 space-y-2">
              <label className="text-sm font-medium text-slate-300">Options & Features</label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.hasAWD}
                    onChange={(e) => handleStateChange("hasAWD", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-rose-500"
                  />
                  All-Wheel Drive (+3%)
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.hasLeather}
                    onChange={(e) => handleStateChange("hasLeather", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-rose-500"
                  />
                  Leather Interior (+2%)
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.hasSunroof}
                    onChange={(e) => handleStateChange("hasSunroof", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-rose-500"
                  />
                  Sunroof / Moonroof (+1%)
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2.5 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.hasTechPackage}
                    onChange={(e) => handleStateChange("hasTechPackage", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-rose-500"
                  />
                  Advanced Tech Package (-3%/yr)
                </label>
                <label className="flex items-center gap-3 rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2.5 text-sm text-rose-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.hasAccident}
                    onChange={(e) => handleStateChange("hasAccident", e.target.checked)}
                    className="h-4 w-4 rounded border-rose-600 bg-slate-950 text-rose-500"
                  />
                  Accident History (-15%)
                </label>
              </div>
            </div>

            {/* Comparison */}
            <div className="mt-5">
              <button
                onClick={() => {
                  handleStateChange("showComparison", !state.showComparison);
                  setIsDropdownOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-950"
              >
                <span className="flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  Compare with Another Vehicle
                </span>
                {state.showComparison ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {state.showComparison && (
                <div className="mt-3 relative">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder={state.compareVehicle ? `${state.compareVehicle.make} ${state.compareVehicle.model}...` : "Search to compare..."}
                      value={compareSearchTerm}
                      onChange={(e) => {
                        setCompareSearchTerm(e.target.value);
                        setIsCompareDropdownOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      onFocus={() => {
                        setIsCompareDropdownOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none transition-all"
                    />
                    <button 
                      onClick={() => setIsCompareDropdownOpen(!isCompareDropdownOpen)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                    >
                      {isCompareDropdownOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>

                    {isCompareDropdownOpen && (
                      <div className="absolute z-50 bottom-full mb-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-100">
                        <button
                          onClick={() => handleCompareVehicleSelect(null)}
                          className="flex w-full items-center px-4 py-2 text-sm text-slate-500 hover:bg-slate-900 rounded-lg italic"
                        >
                          Remove Comparison
                        </button>
                        <div className="my-1 border-t border-slate-800" />
                        {filteredCompareVehicles.length > 0 ? (
                          filteredCompareVehicles.map((v, i) => (
                            <button
                              key={i}
                              onClick={() => handleCompareVehicleSelect(v)}
                              className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${
                                state.compareVehicle === v ? "bg-blue-500/20 text-blue-400" : "text-slate-300 hover:bg-slate-900"
                              }`}
                            >
                              <div>
                                <span className="font-bold">{v.make}</span>
                                <span className="ml-1 opacity-80">{v.model}</span>
                              </div>
                              <span className="text-[10px] font-mono text-slate-500">{formatMoney(v.msrp)}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-sm text-slate-500">
                            No vehicles found matching "{compareSearchTerm}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Current Value</p>
              <p className="mt-2 text-2xl font-bold text-emerald-400">{formatMoney(currentValue)}</p>
              <p className="text-xs text-slate-500">{((currentValue / state.purchasePrice) * 100).toFixed(0)}% of purchase price</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Depreciation</p>
              <p className="mt-2 text-2xl font-bold text-rose-400">{formatMoney(totalDepreciation)}</p>
              <p className="text-xs text-slate-500">since purchase</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">5-Year Value</p>
              <p className="mt-2 text-2xl font-bold text-blue-400">{formatMoney(year5Value)}</p>
              <p className="text-xs text-slate-500">{((year5Value / state.purchasePrice) * 100).toFixed(0)}% retained</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-center shadow-xl backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">10-Year Value</p>
              <p className="mt-2 text-2xl font-bold text-amber-400">{formatMoney(year10Value)}</p>
              <p className="text-xs text-slate-500">{((year10Value / state.purchasePrice) * 100).toFixed(0)}% retained</p>
            </div>
          </div>

          {/* Depreciation Curve */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
            <h3 className="mb-4 text-lg font-bold text-white">Depreciation Curve</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => formatMoney(v)} />
                  <Tooltip
                    formatter={(value: any) => formatFullMoney(Number(value) || 0)}
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", color: "#f8fafc" }}
                  />
                  <Area type="monotone" dataKey={selectedVehicle.model} stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.15} name={selectedVehicle.model} />
                  {state.compareVehicle && (
                    <Area type="monotone" dataKey={state.compareVehicle.model} stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} name={state.compareVehicle.model} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Year-by-Year Table */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
            <h3 className="mb-4 text-lg font-bold text-white">Year-by-Year Depreciation</h3>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-900 text-slate-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Year</th>
                    <th className="px-4 py-3 font-semibold text-right">Value</th>
                    <th className="px-4 py-3 font-semibold text-right">Lost This Year</th>
                    <th className="px-4 py-3 font-semibold text-right">Total Lost</th>
                    <th className="px-4 py-3 font-semibold text-right">% Retained</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {[0, 1, 2, 3, 4, 5, 7, 10, 15].map((year) => {
                    const val = calculateValue(selectedVehicle, year);
                    const prevVal = year > 0 ? calculateValue(selectedVehicle, year - 1) : state.purchasePrice;
                    const lost = prevVal - val;
                    const totalLost = state.purchasePrice - val;
                    return (
                      <tr key={year} className={year % 2 === 0 ? "bg-slate-950/30" : ""}>
                        <td className="px-4 py-2 font-medium text-white">
                          {year === 0 ? "Purchase" : `Year ${year}`}
                          {year === vehicleAge && <span className="ml-2 rounded bg-rose-500/10 px-1.5 py-0.5 text-xs text-rose-400">Now</span>}
                        </td>
                        <td className="px-4 py-2 text-right font-medium text-emerald-400">{formatFullMoney(val)}</td>
                        <td className="px-4 py-2 text-right text-rose-400">{year > 0 ? `-${formatFullMoney(lost)}` : "—"}</td>
                        <td className="px-4 py-2 text-right text-rose-400">{year > 0 ? `-${formatFullMoney(totalLost)}` : "—"}</td>
                        <td className="px-4 py-2 text-right">{((val / state.purchasePrice) * 100).toFixed(0)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Comparison Summary */}
          {state.compareVehicle && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
              <h3 className="mb-4 text-lg font-bold text-white">Side-by-Side Comparison</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-950/50 p-4 text-center">
                  <p className="text-xs text-slate-500">Vehicle</p>
                  <p className="mt-1 font-medium text-white">{selectedVehicle.make} {selectedVehicle.model}</p>
                  <p className="mt-1 text-xs text-slate-500">vs</p>
                  <p className="font-medium text-white">{state.compareVehicle.make} {state.compareVehicle.model}</p>
                </div>
                <div className="rounded-lg bg-slate-950/50 p-4 text-center">
                  <p className="text-xs text-slate-500">5-Year Value Difference</p>
                  <p className={`mt-1 text-xl font-bold ${year5Value > calculateValue(state.compareVehicle, 5, { ...state, purchasePrice: state.compareVehicle.msrp }) ? "text-emerald-400" : "text-rose-400"}`}>
                    {formatMoney(Math.abs(year5Value - calculateValue(state.compareVehicle, 5, { ...state, purchasePrice: state.compareVehicle.msrp })))}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-950/50 p-4 text-center">
                  <p className="text-xs text-slate-500">10-Year Value Difference</p>
                  <p className={`mt-1 text-xl font-bold ${year10Value > calculateValue(state.compareVehicle, 10, { ...state, purchasePrice: state.compareVehicle.msrp }) ? "text-emerald-400" : "text-rose-400"}`}>
                    {formatMoney(Math.abs(year10Value - calculateValue(state.compareVehicle, 10, { ...state, purchasePrice: state.compareVehicle.msrp })))}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cost Per Mile */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
            <h3 className="mb-4 text-lg font-bold text-white">Depreciation Cost Per Mile</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-slate-950/50 p-4 text-center">
                <p className="text-xs text-slate-500">Year 1</p>
                <p className="mt-1 text-xl font-bold text-rose-400">
                  ${(year1Depreciation / state.annualMiles).toFixed(2)}/mile
                </p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4 text-center">
                <p className="text-xs text-slate-500">Years 1-5 (Avg)</p>
                <p className="mt-1 text-xl font-bold text-amber-400">
                  ${(year5Depreciation / (state.annualMiles * 5)).toFixed(2)}/mile
                </p>
              </div>
              <div className="rounded-lg bg-slate-950/50 p-4 text-center">
                <p className="text-xs text-slate-500">Total Ownership (10yr)</p>
                <p className="mt-1 text-xl font-bold text-blue-400">
                  ${((state.purchasePrice - year10Value) / (state.annualMiles * 10)).toFixed(2)}/mile
                </p>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
