import React from "react";
import RedditIcon from "../icons/redditIcon.png";

type FormData = {
	searchInput: string;
};

const Navbar: React.FC = () => {
	const [formData, setFormData] = React.useState<FormData>({
		searchInput: "",
	}); // changes state of form data ----- disabled function

	/**handles change on input */
	function handleChange(value: string, name: string) {
		if (name === "searchInput") {
			setFormData({ searchInput: value });
		}
	}

	return (
		<nav className="navbar">
			<a className="navbar__home-container-link" href="https://mapokes.github.io/reddit-lurker">
				<img className="navbar__home-container-link__icon" src={RedditIcon} alt="reddit-icon" />
				<h3 className="navbar__home-container-link__name">reddit</h3>
			</a>

			<div className="navbar__search-container">
				<i className="fa-solid fa-magnifying-glass navbar__search-container__icon"></i>

				<input
					type="text"
					name="searchInput"
					className="navbar__search-container__input"
					value={formData.searchInput}
					placeholder="Search Reddit"
					onChange={(e) => handleChange(e.target.value, e.target.name)}
					disabled
				/>

				{formData.searchInput && (
					<button className="navbar__search-container__cancel-btn" onClick={() => setFormData({ searchInput: "" })}>
						<i className="fa-solid fa-xmark navbar__search-container__cancel-btn__icon"></i>
					</button>
				)}
			</div>
		</nav>
	);
};
export default Navbar;
