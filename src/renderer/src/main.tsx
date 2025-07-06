import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "~/renderer/routes";
import "~/renderer/tailwind.css";

const rootEle = document.getElementById("root");
if (!rootEle) {
	throw new Error("Root element not found");
}

createRoot(rootEle).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
