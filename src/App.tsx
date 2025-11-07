import { Routes, Route } from '@solidjs/router';
import Home from './pages/Home';
import About from './pages/About';

export default function App() {
	return (
		<Routes>
			<Route path="/" component={Home} />
			<Route path="/about" component={About} />
		</Routes>
	);
}
