import { Outlet } from "react-router";
import { Sidebar } from "./components/Sidebar";

export function RootRoute() {
	return (
		<div className="flex h-lvh">
			<Sidebar />
			<Outlet />
		</div>
	);
}
