import { Sidebar } from "@renderer/components/Sidebar";
import { Outlet } from "react-router";

export function RootRoute() {
	return (
		<div className="flex h-lvh">
			<Sidebar />
			<Outlet />
		</div>
	);
}
