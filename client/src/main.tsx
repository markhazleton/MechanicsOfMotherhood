import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initPerformanceMonitoring } from '@/utils/performance-monitor';

// Initialize lightweight performance metrics
initPerformanceMonitoring();

createRoot(document.getElementById("root")!).render(<App />);
