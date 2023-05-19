import React from "react";
import { FetchOptions } from "../types/types";
import { PostData } from "../types/types";
import { nanoid } from "nanoid";

type HeaderProps = {
	fetchOptions: FetchOptions | null;
	setFetchOptions: React.Dispatch<React.SetStateAction<FetchOptions | null>>;
	setPostData: React.Dispatch<React.SetStateAction<PostData[]>>;
	setPageAfter: React.Dispatch<React.SetStateAction<string>>;
	path: string;
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
	viewOptions: boolean;
};

const Header: React.FC<HeaderProps> = ({
	fetchOptions,
	setFetchOptions,
	setPostData,
	setPageAfter,
	path,
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
		viewOptions: false,
	});

	React.useEffect(() => {
		// zrobic wybor na strony zamiast view?
		console.log(path.substring(1, path.length - 1).split("/"));

		const paramsURL: string[] =
			path[path.length - 1] !== "/"
				? path.substring(1, path.length).split("/")
				: path.substring(1, path.length - 1).split("/");

		!paramsURL[1] && paramsURL.push(listingOptions[0].value);
		paramsURL[1] === listingOptions[0].value && !paramsURL[2] && paramsURL.push(geoOptions[0].value);
		paramsURL[1] === listingOptions[2].value && !paramsURL[2] && paramsURL.push(timeframeOptions[1].value);

		if (path === "/") {
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

		function getOptionName(listing: string, optionValue: string): any {
			if (listing === "hot") {
				for (let i = 0; i < geoOptions.length; i++) {
					if (geoOptions[i].value === optionValue) {
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

	console.log(fetchOptions);

	React.useEffect(() => {
		function clearDropdowns(e: any) {
			const name: string = e.target.dataset.name;

			if (name !== "geoOption" && name !== "timeframeOption" && name !== "cardView" && name !== "classicView") {
				closeDropdowns();
			}
		}

		if (optionsList.geoOptions || optionsList.topOptions || optionsList.viewOptions) {
			document.addEventListener("mousedown", clearDropdowns);
		}
		return () => {
			document.removeEventListener("mousedown", clearDropdowns);
		};
	}, [optionsList]);

	function handleClick(e: any): void {
		const name: string = e.dataset.name;

		// chyba da sie to zniwelowac do jednego else ifa
		if (name === "hot" || name === "new" || name === "top" || name === "rising") {
			setPostData([]);
			setPageAfter("");

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
		}

		// if (name === "hot") {
		// 	setPostData([]);
		// 	setPageAfter("");

		// 	setFetchOptions((prevFetchOptions): FetchOptions | null => {
		// 		if (prevFetchOptions) {
		// 			prevFetchOptions.timeFrame && delete prevFetchOptions.timeFrame;

		// 			return {
		// 				...prevFetchOptions,
		// 				listing: {
		// 					option: {
		// 						hot: true,
		// 						new: false,
		// 						top: false,
		// 						rising: false,
		// 					},
		// 					value: "hot",
		// 				},
		// 				...(prevFetchOptions.subredditName === "popular" && {
		// 					geoFilter: {
		// 						value: geoOptions[0].value,
		// 						name: geoOptions[0].name,
		// 					},
		// 				}),
		// 			};
		// 		} else {
		// 			return prevFetchOptions;
		// 		}
		// 	});
		// } else if (name === "new") {
		// 	setPostData([]);
		// 	setPageAfter("");

		// 	setFetchOptions((prevFetchOptions): FetchOptions | null => {
		// 		if (prevFetchOptions) {
		// 			prevFetchOptions.timeFrame && delete prevFetchOptions.timeFrame;
		// 			prevFetchOptions.geoFilter && delete prevFetchOptions.geoFilter;

		// 			return {
		// 				...prevFetchOptions,
		// 				listing: {
		// 					option: {
		// 						hot: false,
		// 						new: true,
		// 						top: false,
		// 						rising: false,
		// 					},
		// 					value: "new",
		// 				},
		// 			};
		// 		} else {
		// 			return prevFetchOptions;
		// 		}
		// 	});
		// } else if (name === "top") {
		// 	setPostData([]);
		// 	setPageAfter("");

		// 	setFetchOptions((prevFetchOptions): FetchOptions | null => {
		// 		if (prevFetchOptions) {
		// 			prevFetchOptions.geoFilter && delete prevFetchOptions.geoFilter;

		// 			return {
		// 				...prevFetchOptions,
		// 				listing: {
		// 					option: {
		// 						hot: false,
		// 						new: false,
		// 						top: true,
		// 						rising: false,
		// 					},
		// 					value: "top",
		// 				},
		// 				timeFrame: {
		// 					value: timeframeOptions[0].value,
		// 					name: timeframeOptions[0].name,
		// 				},
		// 			};
		// 		} else {
		// 			return prevFetchOptions;
		// 		}
		// 	});
		// } else if (name === "rising") {
		// 	setPostData([]);
		// 	setPageAfter("");

		// 	setFetchOptions((prevFetchOptions): FetchOptions | null => {
		// 		if (prevFetchOptions) {
		// 			prevFetchOptions.timeFrame && delete prevFetchOptions.timeFrame;
		// 			prevFetchOptions.geoFilter && delete prevFetchOptions.geoFilter;

		// 			return {
		// 				...prevFetchOptions,
		// 				listing: {
		// 					option: {
		// 						hot: false,
		// 						new: false,
		// 						top: false,
		// 						rising: true,
		// 					},
		// 					value: "rising",
		// 				},
		// 			};
		// 		} else {
		// 			return prevFetchOptions;
		// 		}
		// 	});
		// }
		else if (name === "geoOptions" || name === "topOptions" || name === "viewOptions") {
			setOptionsList((prevOptionsList) => {
				prevOptionsList = {
					geoOptions: false,
					topOptions: false,
					viewOptions: false,
				};

				return {
					...prevOptionsList,
					[name]: true,
				};
			});
		} else if (name === "geoOption") {
			setPostData([]);
			setPageAfter("");

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
			setPostData([]);
			setPageAfter("");

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
		// else if (name === "cardView") {
		// 	setView({
		// 		card: true,
		// 		classic: false,
		// 	});
		// 	closeDropdowns();
		// }
		// else if (name === "classicView") {
		// 	setView({
		// 		card: false,
		// 		classic: true,
		// 	});
		// 	closeDropdowns();
		// }
	}

	function closeDropdowns(): void {
		setOptionsList({
			geoOptions: false,
			topOptions: false,
			viewOptions: false,
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

			{/* =================================================================================================================================================== */}

			{/* <button className="header__view-options-btn" data-name="viewOptions" onClick={(e) => handleClick(e.target)}>
				{view.card ? <div id="card-icon"></div> : <div id="classic-icon"></div>}
				<i className="fa-solid fa-chevron-down header__view-options-btn__icon"></i>
				{optionsList.viewOptions && (
					<div className="header__view-options-btn__container">
						<div
							className={`header__view-options-btn__container__option${view.card ? " active" : ""}`}
							data-name="cardView"
						>
							<div id="card-icon"></div>Card
						</div>
						<div
							className={`header__view-options-btn__container__option${view.classic ? " active" : ""}`}
							data-name="classicView"
						>
							<div id="classic-icon"></div>Classic
						</div>
					</div>
				)}
			</button> */}
		</header>
	);
};
export default Header;
