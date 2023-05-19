import ReactDOM from "react-dom/client";
import App from "./App";
import { HashRouter } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import "./styles/layout.scss";

TimeAgo.addDefaultLocale(en);

const container = document.getElementById("root")!;
const core = ReactDOM.createRoot(container);
core.render(
	<HashRouter>
		<App />
	</HashRouter>
);
