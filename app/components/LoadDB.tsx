import { preinit } from 'react-dom';

export function LoadDB() {
	preinit('/loadDb.js', { as: 'script', fetchPriority: 'high' });

	return <script async src="/loadDb.js" />;
}
