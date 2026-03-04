// Direct exports for components that need synchronous access
export * from "./AmortizationChart";
export * from "./StressTestChart";
export * from "./InterestScenariosChart";
export * from "./CostBreakdownChart";

// Lazy-loaded versions for code splitting (reduces initial bundle ~60KB)
import { lazy } from "react";

export const LazyAmortizationChart = lazy(() =>
  import("./AmortizationChart").then((m) => ({ default: m.AmortizationChart }))
);

export const LazyCostBreakdownChart = lazy(() =>
  import("./CostBreakdownChart").then((m) => ({ default: m.CostBreakdownChart }))
);

export const LazyStressTestChart = lazy(() =>
  import("./StressTestChart").then((m) => ({ default: m.StressTestChart }))
);

export const LazyInterestScenariosChart = lazy(() =>
  import("./InterestScenariosChart").then((m) => ({ default: m.InterestScenariosChart }))
);
