import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initPerformanceMonitoring } from '@/utils/performance-monitor';

// Initialize lightweight performance metrics
initPerformanceMonitoring();

const container = document.getElementById("root")!;
// If there is existing child content we assume SSR and hydrate, else normal render
if (container.firstElementChild) {
	hydrateRoot(container, <App ssrPath={window.location.pathname} />);
} else {
	createRoot(container).render(<App ssrPath={window.location.pathname} />);
}
