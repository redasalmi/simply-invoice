import { StrictMode, useCallback, useState } from "react";
import { createRoot } from "react-dom/client";

const rootEle = document.getElementById("root");
if (!rootEle) {
	throw new Error("Root element not found");
}

function Home() {
	const [taxes, setTaxes] = useState([]);

	const createTax = useCallback(async () => {
		const randomRate = Math.random() * 100;
		await window.api.db.createTax({
			name: `VAT ${randomRate}%`,
			description: `Value Added Tax ${randomRate}%`,
			rate: randomRate,
		});

		const taxes = await window.api.db.getAllTaxes();
		setTaxes(taxes);
	}, []);

	return (
		<div>
			<h1>Hello World</h1>
			<h1>Number of Taxes: {taxes.length}</h1>

			<button type="button" onClick={createTax}>
				Create Tax
			</button>

			<ul>
				{taxes.map((tax) => (
					<li key={tax.taxId}>
						{tax.name} - {tax.rate}
					</li>
				))}
			</ul>
		</div>
	);
}

createRoot(rootEle).render(
	<StrictMode>
		<Home />
	</StrictMode>,
);
