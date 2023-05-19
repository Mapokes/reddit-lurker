import React from "react";
import RedditIcon from "../icons/redditIcon.png";

type FormData = {
  searchInput: string;
};

const Navbar: React.FC = () => {
  const [formData, setFormData] = React.useState<FormData>({
    searchInput: "",
  });

  function handleChange(value: string, name: string) {
    if (name === "searchInput") {
      setFormData({ searchInput: value });
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar__home-container">
        <img className="navbar__home-container__icon" src={RedditIcon} alt="reddit-icon" />
        <h3 className="navbar__home-container__name">reddit</h3>
      </div>
      <div className="navbar__search-container">
        <i className="fa-solid fa-magnifying-glass navbar__search-container__icon"></i>
        <input
          type="text"
          name="searchInput"
          className="navbar__search-container__input"
          value={formData.searchInput}
          placeholder="Search Reddit"
          onChange={(e) => handleChange(e.target.value, e.target.name)}
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
