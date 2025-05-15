import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
	{
		path: "/",
		element: (
			<div>
				<h1>Hello World</h1>
				<button
					type="button"
					onClick={() => window.electronAPI.setTitle("new title")}
				>
					Click me
				</button>
			</div>
		),
	},
]);
