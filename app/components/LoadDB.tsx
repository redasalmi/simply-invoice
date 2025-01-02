import { preinit } from 'react-dom';

export function LoadDB() {
	preinit('http://localhost:1420/loadDb.js', { as: 'script' });

	return <script async src="loadDb.js" />;
}
