import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

const rootEle = document.getElementById("root");
if (!rootEle) {
	throw new Error("Root element not found");
}

function Home() {
	return (
		<div>
			<h1>Hello World</h1>
		</div>
	);
}

const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
]);

createRoot(rootEle).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
