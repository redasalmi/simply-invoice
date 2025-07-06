import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Await, RouterProvider } from "react-router";
import { UserSettingsProvider } from "~/renderer/components/UserSettings";
import { router } from "~/renderer/routes";
import "~/renderer/tailwind.css";

const rootEle = document.getElementById("root");
if (!rootEle) {
	throw new Error("Root element not found");
}

createRoot(rootEle).render(
	<StrictMode>
		<Suspense fallback={<div />}>
			<Await
				errorElement={<div>Could not load user settings 😬</div>}
				resolve={window.api.db.userSettings.get()}
			>
				{(userSettings) => (
					<UserSettingsProvider userSettings={userSettings}>
						<RouterProvider router={router} />
					</UserSettingsProvider>
				)}
			</Await>
		</Suspense>
	</StrictMode>,
);
