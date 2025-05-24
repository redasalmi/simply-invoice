import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const rootEle = document.getElementById("root");
if (!rootEle) {
	throw new Error("Root element not found");
}

createRoot(rootEle).render(
	<StrictMode>
		<h1>Hello World</h1>
	</StrictMode>,
);
