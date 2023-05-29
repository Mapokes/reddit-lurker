import React from "react";
import { FetchOptions } from "../types/types";
import { PostData } from "../types/types";
import { RedditPages } from "../types/types";
import { nanoid } from "nanoid";

type HeaderProps = {
	fetchOptions: FetchOptions | null;
	setFetchOptions: React.Dispatch<React.SetStateAction<FetchOptions | null>>;
	setPostData: React.Dispatch<React.SetStateAction<PostData[]>>;
	setPageAfter: React.Dispatch<React.SetStateAction<string>>;
	path: string;
	redditPages: RedditPages;
	setRedditPages: React.Dispatch<React.SetStateAction<RedditPages>>;
};

type Options = {
	value: string;
	name: string;
};
type ListingOptions = Options & {
	icon: string;
};
type OptionsList = {
	geoOptions: boolean;
	topOptions: boolean;
};

const Header: React.FC<HeaderProps> = ({
	fetchOptions,
	setFetchOptions,
	setPostData,
	setPageAfter,
	path,
	redditPages,
	setRedditPages,
}: HeaderProps) => {
	// console.log("Header rendered")

	const listingOptions: ListingOptions[] = [
		{
			value: "hot",
			name: "Hot",
			icon: "fa-solid fa-fire header__hot-link__icon",
		},
		{
			value: "new",
			name: "New",
			icon: "fa-regular fa-sun header__new-link__icon",
		},
		{
			value: "top",
			name: "Top",
			icon: "fa-solid fa-arrow-up-from-bracket header__top-link__icon",
		},
		{
			value: "rising",
			name: "Rising",
			icon: "fa-solid fa-arrow-up-right-dots header__rising-link__icon",
		},
	];
	const geoOptions: Options[] = [
		{
			value: "GLOBAL",
			name: "Everywhere",
		},
		{
			value: "US",
			name: "United States",
		},
		{
			value: "AR",
			name: "Argentina",
		},
		{
			value: "AU",
			name: "Australia",
		},
		{
			value: "BG",
			name: "Bulgaria",
		},
		{
			value: "CA",
			name: "Canada",
		},
		{
			value: "CL",
			name: "Chile",
		},
		{
			value: "CO",
			name: "Colombia",
		},
		{
			value: "HR",
			name: "Croatia",
		},
		{
			value: "CZ",
			name: "Czech Republic",
		},
		{
			value: "FI",
			name: "Finland",
		},
		{
			value: "FR",
			name: "France",
		},
		{
			value: "DE",
			name: "Germany",
		},
		{
			value: "GR",
			name: "Greece",
		},
		{
			value: "HU",
			name: "Hungary",
		},
		{
			value: "IS",
			name: "Iceland",
		},
		{
			value: "IN",
			name: "India",
		},
		{
			value: "IE",
			name: "Ireland",
		},
		{
			value: "IT",
			name: "Italy",
		},
		{
			value: "JP",
			name: "Japan",
		},
		{
			value: "MY",
			name: "Malaysia",
		},
		{
			value: "MX",
			name: "Mexico",
		},
		{
			value: "NZ",
			name: "New Zealand",
		},
		{
			value: "PH",
			name: "Philippines",
		},
		{
			value: "PL",
			name: "Poland",
		},
		{
			value: "PT",
			name: "Portugal",
		},
		{
			value: "PR",
			name: "Puerto Rico",
		},
		{
			value: "RO",
			name: "Romania",
		},
		{
			value: "RS",
			name: "Serbia",
		},
		{
			value: "SG",
			name: "Singapore",
		},
		{
			value: "ES",
			name: "Spain",
		},
		{
			value: "SE",
			name: "Sweden",
		},
		{
			value: "TW",
			name: "Taiwan",
		},
		{
			value: "TH",
			name: "Thailand",
		},
		{
			value: "TR",
			name: "Turkey",
		},
		{
			value: "GB",
			name: "United Kingdom",
		},
	];
	const timeframeOptions: Options[] = [
		{
			value: "hour",
			name: "Now",
		},
		{
			value: "day",
			name: "Today",
		},
		{
			value: "week",
			name: "This Week",
		},
		{
			value: "month",
			name: "This Month",
		},
		{
			value: "year",
			name: "This Year",
		},
		{
			value: "all",
			name: "All Time",
		},
	];

	const [optionsList, setOptionsList] = React.useState<OptionsList>({
		geoOptions: false,
		topOptions: false,
	}); // state for tables with options

	// on 1st render sets appriopriate state for fetchOptions depending on path
	React.useEffect(() => {
		const paramsURL: string[] =
			path[path.length - 1] !== "/"
				? path.substring(1, path.length).split("/")
				: path.substring(1, path.length - 1).split("/"); // array with parameters taken from browser's URL

		!paramsURL[1] && paramsURL.push(listingOptions[0].value); // if 2nd element of paramsURL doesn't exist -> pushes default listingOption value
		paramsURL[1] === "hot" && !paramsURL[2] && paramsURL.push(geoOptions[0].value); // if 2nd element of paramsURL is "hot" and 3rd element of paramsURL doesn't exist -> pushes default geoOptions value
		paramsURL[1] === "top" && !paramsURL[2] && paramsURL.push(timeframeOptions[1].value); // if 2nd element of paramsURL is "top" and 3rd element of paramsURL doesn't exist -> pushes default timeframeOptions value
		paramsURL[3] === "page" && !paramsURL[4] ? paramsURL.push("1") : (paramsURL[4] = "1"); // if 4th element of paramsURL is "page" and 5th element doesn't exist -> pushes "1". If 5th element exists -> changes it to "1" <-- this is due to lack of "after" parameter from reddit API

		if (path === "/") {
			// if path is "/" then sets default parameters for fetchOptions
			setFetchOptions({
				subredditName: "popular",
				listing: {
					option: {
						hot: true,
						new: false,
						top: false,
						rising: false,
					},
					value: listingOptions[0].value,
				},
				geoFilter: {
					value: geoOptions[0].value,
					name: geoOptions[0].name,
				},
			});
		} else if (paramsURL[0] === "popular") {
			// if 1st element of paramsURL is "popular" then sets appropriate parameters for fetchOptions
			setFetchOptions({
				subredditName: paramsURL[0],
				listing: {
					option: {
						hot: false,
						new: false,
						top: false,
						rising: false,
						[paramsURL[1]]: true,
					},
					value: paramsURL[1],
				},
				...(paramsURL[1] === "hot" && {
					geoFilter: {
						value: paramsURL[2],
						name: getOptionName(paramsURL[1], paramsURL[2]),
					},
				}),
				...(paramsURL[1] === "top" && {
					timeFrame: {
						value: paramsURL[2],
						name: getOptionName(paramsURL[1], paramsURL[2]),
					},
				}),
			});
		} else {
			// in every other case sets appropriate parameters for fetchOptions
			setFetchOptions({
				subredditName: paramsURL[0],
				listing: {
					option: {
						hot: false,
						new: false,
						top: false,
						rising: false,
						[paramsURL[1]]: true,
					},
					value: paramsURL[1],
				},
				...(paramsURL[1] === "top" && {
					timeFrame: {
						value: paramsURL[2],
						name: getOptionName(paramsURL[1], paramsURL[2]),
					},
				}),
			});
		}

		if (paramsURL[3] === "page") {
			// if 4th element of paramsURL is "page" then sets state redditPages
			setRedditPages((prevRedditPages) => {
				return {
					...prevRedditPages,
					Iscroll: false,
					activePage: Number(paramsURL[4]),
				};
			});
		}

		/**return appropriate geoOption name or timeframeOption name comparing 2nd and 3rd parameter of paramsURL to looped though geoOptions or timeframeOptions */
		function getOptionName(listing: string, optionValue: string): any {
			if (listing === "hot") {
				for (let i = 0; i < geoOptions.length; i++) {
					if (geoOptions[i].value.toLowerCase() === optionValue) {
						return geoOptions[i].name;
					}
				}
			} else {
				for (let i = 0; i < timeframeOptions.length; i++) {
					if (timeframeOptions[i].value === optionValue) {
						return timeframeOptions[i].name;
					}
				}
			}
		}
	}, []);

	// every time optionsList changes -> adds "mousedown" event listener to html body when optionsList.geoOptions or optionsList.topOptions is set to True. Removes it on click anywhere. Clears drop downs
	React.useEffect(() => {
		/**removes any active dropdown */
		function clearDropdowns(e: any) {
			const name: string = e.target.dataset.name;

			if (name !== "geoOption" && name !== "timeframeOption") {
				closeDropdowns();
			}
		}

		if (optionsList.geoOptions || optionsList.topOptions) {
			document.addEventListener("mousedown", clearDropdowns);
		}
		return () => {
			document.removeEventListener("mousedown", clearDropdowns);
		};
	}, [optionsList]);

	/**handles click of header buttons */
	function handleClick(e: any): void {
		const name: string = e.dataset.name;

		if (name === "hot" || name === "new" || name === "top" || name === "rising") {
			// reset states and sets new state of fetchOptions
			resetStates();

			setFetchOptions((prevFetchOptions): FetchOptions | null => {
				if (prevFetchOptions) {
					prevFetchOptions.timeFrame && delete prevFetchOptions.timeFrame;
					prevFetchOptions.geoFilter && delete prevFetchOptions.geoFilter;

					return {
						...prevFetchOptions,
						listing: {
							option: {
								hot: false,
								new: false,
								top: false,
								rising: false,
								[name]: true,
							},
							value: name,
						},
						...(prevFetchOptions.subredditName === "popular" &&
							name === "hot" && {
								geoFilter: {
									value: geoOptions[0].value,
									name: geoOptions[0].name,
								},
							}),
						...(name === "top" && {
							timeFrame: {
								value: timeframeOptions[0].value,
								name: timeframeOptions[0].name,
							},
						}),
					};
				} else {
					return null;
				}
			});
		} else if (name === "geoOptions" || name === "topOptions") {
			// sets new state of fetchOptions
			setOptionsList((prevOptionsList) => {
				prevOptionsList = {
					geoOptions: false,
					topOptions: false,
				};

				return {
					...prevOptionsList,
					[name]: true,
				};
			});
		} else if (name === "geoOption") {
			// reset states and sets new state of fetchOptions. Closes dropdowns
			resetStates();

			fetchOptions &&
				e.dataset.text !== fetchOptions.geoFilter &&
				setFetchOptions((prevFetchOptions): FetchOptions | null => {
					if (prevFetchOptions) {
						return {
							...prevFetchOptions,
							geoFilter: {
								value: e.dataset.value,
								name: e.dataset.text,
							},
						};
					} else {
						return prevFetchOptions;
					}
				});

			closeDropdowns();
		} else if (name === "timeframeOption") {
			// reset states and sets new state of fetchOptions. Closes dropdowns
			resetStates();

			fetchOptions &&
				e.dataset.text !== fetchOptions.timeFrame &&
				setFetchOptions((prevFetchOptions): FetchOptions | null => {
					if (prevFetchOptions) {
						return {
							...prevFetchOptions,
							timeFrame: {
								value: e.dataset.value,
								name: e.dataset.text,
							},
						};
					} else {
						return prevFetchOptions;
					}
				});

			closeDropdowns();
		}
	}

	/**handles change on infinite scroll checkbox */
	function handleChange(e: any): void {
		const name: string = e.target.name;

		if (name === "infinite-checkbox") {
			// clears postData and sets redditPages
			setPostData([]);

			setRedditPages((prevRedditPages) => {
				return {
					...prevRedditPages,
					Iscroll: !prevRedditPages.Iscroll,
				};
			});
		}
	}

	/**set state of dropdowns to false of optionsList state */
	function closeDropdowns(): void {
		setOptionsList({
			geoOptions: false,
			topOptions: false,
		});
	}

	/**reset states of postData, pagesAfter if infinite scroll is enabled and state of redditPages if infinite scroll is disabled */
	function resetStates(): void {
		setPostData([]);

		redditPages.Iscroll && setPageAfter("");

		!redditPages.Iscroll &&
			setRedditPages((prevRedditPages) => {
				return {
					...prevRedditPages,
					pagesAfter: [{ pageNumber: 1, pageAfter: "" }],
					activePage: 1,
				};
			});
	}

	return (
		<header className="header">
			{listingOptions.map((listingOption) => {
				return (
					<a
						key={nanoid()}
						className={`header__${listingOption.value}-link${
							fetchOptions?.listing.value === listingOption.value ? " active" : ""
						}`}
						data-name={listingOption.value}
						onClick={(e) => handleClick(e.target)}
					>
						<i className={listingOption.icon}></i>
						{listingOption.name}
					</a>
				);
			})}

			{fetchOptions?.listing.option.hot && fetchOptions.subredditName === "popular" && (
				<button className="header__hot-select-btn" data-name="geoOptions" onClick={(e) => handleClick(e.target)}>
					{fetchOptions.geoFilter?.name}
					<i className="fa-solid fa-chevron-down header__hot-select-link__icon"></i>
					{optionsList.geoOptions && (
						<div className="header__hot-select-btn__container">
							{geoOptions.map((geoOption) => {
								return (
									<a
										key={nanoid()}
										data-value={geoOption.value}
										data-text={geoOption.name}
										data-name="geoOption"
										className={`header__hot-select-btn__container__option${
											geoOption.name === fetchOptions.geoFilter?.name ? " active" : ""
										}`}
										onClick={(e) => handleClick(e.target)}
									>
										{geoOption.name}
									</a>
								);
							})}
						</div>
					)}
				</button>
			)}

			{fetchOptions?.listing.option.top && (
				<button className="header__top-select-btn" data-name="topOptions" onClick={(e) => handleClick(e.target)}>
					{fetchOptions.timeFrame?.name}
					<i className="fa-solid fa-chevron-down header__top-select-link__icon"></i>
					{optionsList.topOptions && (
						<div className="header__top-select-btn__container">
							{timeframeOptions.map((timeframeOption) => {
								return (
									<a
										key={nanoid()}
										data-value={timeframeOption.value}
										data-text={timeframeOption.name}
										data-name="timeframeOption"
										className={`header__top-select-btn__container__option${
											timeframeOption.name === fetchOptions.timeFrame?.name ? " active" : ""
										}`}
									>
										{timeframeOption.name}
									</a>
								);
							})}
						</div>
					)}
				</button>
			)}

			<div className="header__checkbox-container">
				<h3 className="header__checkbox-container__text">Iscroll</h3>
				<input
					className="header__checkbox-container__checkbox"
					type="checkbox"
					name="infinite-checkbox"
					checked={redditPages.Iscroll}
					onChange={handleChange}
				/>
			</div>
		</header>
	);
};
export default Header;
