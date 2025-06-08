import { StrictMode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const rootEle = document.getElementById("root");
if (!rootEle) {
	throw new Error("Root element not found");
}

function Home() {
	const [numberOfUsers, setNumberOfUsers] = useState<number | null>(null);

	const getNumberOfUsers = useCallback(async () => {
		const numberOfUsers = await window.api.db.numberOfUsers();
		console.log({ numberOfUsers });
		setNumberOfUsers(numberOfUsers);
	}, []);

	const testUsersDb = useCallback(async () => {
		await window.api.db.testUsersDb();
		getNumberOfUsers();
	}, [getNumberOfUsers]);

	useEffect(() => {
		getNumberOfUsers();
	}, [getNumberOfUsers]);

	return (
		<div>
			<h1>Hello World</h1>
			<p>Number of Users: {numberOfUsers}</p>

			<button type="button" onClick={testUsersDb}>
				Test Users DB
			</button>
			<button type="button" onClick={getNumberOfUsers}>
				Get Number of Users
			</button>
		</div>
	);
}

createRoot(rootEle).render(
	<StrictMode>
		<Home />
	</StrictMode>,
);
