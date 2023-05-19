import React from "react";
import Navbar from "./components/Navbar";
import SectionContent from "./components/SectionContent";
import ErrorFallback from "./components/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
import { Routes, Route, useLocation } from "react-router-dom";

const App: React.FC = () => {
	// console.log("App rendered")

	const URL = useLocation().pathname.toLowerCase();
	const [path, setPath] = React.useState<string>(URL);

	React.useEffect(() => {
		setPath(URL);
	}, [URL]);

	return (
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<Navbar />
			{URL === path && (
				<Routes>
					<Route path={path} element={<SectionContent path={path} />} />
				</Routes>
			)}
		</ErrorBoundary>
	);
};
export default App;
