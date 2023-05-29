import React from "react";
import Header from "./Header";
import Post from "./Post";
import { FetchOptions } from "../types/types";
import { PostData } from "../types/types";
import { Images } from "../types/types";
import { RedditPages } from "../types/types";
import ErrorFallback from "./ErrorFallback";
import ClipLoader from "react-spinners/ClipLoader";
import { ErrorBoundary } from "react-error-boundary";
import { nanoid } from "nanoid";

// TODO
// deleted "axis?
// sprawdzic wsztkie funkcje bo sa chyba zle napisane: function test<T>(arg: T): T
// poprawic bledy gdy jest npm start
// dodac next i prev button do stron
// back end to login with blacklisted subreddits
// mobile version

type SectionContentProps = {
	path: string;
};

const SectionContent: React.FC<SectionContentProps> = ({ path }) => {
	// console.log("SectionContent rendered");

	const [postData, setPostData] = React.useState<PostData[]>([]); // array of objects for containing all posts
	const [pageAfter, setPageAfter] = React.useState<string>(""); // string with information about next fetch link with additional posts
	const [isLoading, setIsLoading] = React.useState<boolean>(false); // loading boolean for fetch requests
	const [fetchOptions, setFetchOptions] = React.useState<FetchOptions | null>(null); // used in header to determine link properties of reddit API for fetch requests
	const [redditPages, setRedditPages] = React.useState<RedditPages>({
		Iscroll: true,
		pagesAfter: [{ pageNumber: 1, pageAfter: "" }],
		activePage: 1,
	}); // used for option when infinite scroll is turned off

	// every time fetchOptions or redditPages and fetchOptions exists -> makes a fetch request
	React.useEffect(() => {
		if (fetchOptions) {
			getPosts();
		}
	}, [fetchOptions, redditPages]);

	/**sets loading to true and makes a fetch request to reddit api. When fetch request is success -> sets postData.
	 * If Infinite scroll is enabled -> sets state on pageAfter if not -> sets state on redditPages.
	 * At the end, sets loading to false and URL value is pushed to history of browser.
	 * In case of error during fetch -> it get cought and console logged*/
	function getPosts(): void {
		setIsLoading(true);

		const geoFilter: string = fetchOptions?.geoFilter ? fetchOptions.geoFilter.value : ""; // used for fetch link
		const timeframe: string = fetchOptions?.timeFrame ? fetchOptions.timeFrame.value : ""; // used for fetch link
		const after: string | { pageNumber: number; pageAfter: string }[] | undefined = redditPages.Iscroll
			? pageAfter
			: getPagesAfter(redditPages.pagesAfter); // used for fetch link
		const page: string = !redditPages.Iscroll ? "/page" : ""; //used for URL adress to turn on or off infinite scroll

		// fetch link
		const redditLink = `https://www.reddit.com/r/${fetchOptions?.subredditName}/${
			fetchOptions?.listing.value
		}.json?sr_detail=1${geoFilter === "" ? "" : `&geo_filter=${geoFilter}`}${
			timeframe === "" ? "" : `&t=${timeframe}`
		}&after=${after}`;

		// URL adress
		const appURL = `/reddit-lurker/#/${fetchOptions?.subredditName}/${fetchOptions?.listing.value}${
			geoFilter === "" ? "" : `/${geoFilter}`
		}${timeframe === "" ? "" : `/${timeframe}`}${page}`;

		fetch(redditLink)
			.then((response) => response.json())
			.then((data) => {
				const redditPosts: PostData[] = []; // array of objects for containing all posts
				let twitterID: string = "";

				// for loop over array of posts in reddit API
				for (const redditPost of data.data.children) {
					const postIconLink: string = redditPost.data.sr_detail.community_icon
						? redditPost.data.sr_detail.community_icon
						: redditPost.data.sr_detail.icon_img; // icon of subreddit of the post. Has some properties after its extension (.jpg...)

					const extensionIndex: number = postIconLink.includes(".jpg")
						? postIconLink.indexOf(".jpg") + 4
						: postIconLink.indexOf(".png") + 4; // finds last index of actual link to icon of subreddit
					const postIcon: string = postIconLink.substring(0, extensionIndex); // actual link to icon of subreddit

					const postImages: Images[] = []; // used for albums with images if there are any

					let hasTwitterLink: boolean =
						redditPost.data.media && redditPost.data.media.oembed && redditPost.data.media.oembed.url; // boolean for checking if post has twitter link

					if (redditPost.data.media_metadata) {
						// if there are multiple images then they are pushed to postImages array
						Object.entries(redditPost.data.media_metadata).forEach((entry: any, index: number) => {
							entry[1].s &&
								entry[1].s.u &&
								postImages.push({
									imageLink: entry[1].s.u.replaceAll("amp;", ""),
									index: index + 1,
									...(index === 0 ? { visible: true } : { visible: false }),
								});
						});
					} else if (redditPost.data.url.includes(".jpg") || redditPost.data.url.includes(".png")) {
						// else if there is a single image its also pushed to postImages array
						postImages.push({
							imageLink: redditPost.data.url,
							visible: true,
							index: 1,
						});
					}

					if (hasTwitterLink && redditPost.data.media.oembed.url.includes("twitter")) {
						// sets twitterID string if there is twitter link in post
						twitterID = redditPost.data.media.oembed.url.substring(
							redditPost.data.media.oembed.url.indexOf("status/") + 7
						);
					}

					// skips entirly reddit post if there is selfText property and pushes new object containing post properties to redditPosts array
					!redditPost.data.selftext_html &&
						redditPosts.push({
							upvotes: redditPost.data.ups,
							icon: postIcon,
							subName: redditPost.data.subreddit_name_prefixed,
							postAuthor: redditPost.data.author,
							postTime: redditPost.data.created_utc,
							postTitle: redditPost.data.title,
							redditURL: redditPost.data.permalink,
							...(redditPost.data.selftext !== "" && { postText: redditPost.data.selftext }),
							...(postImages.length !== 0 && { postImages: postImages }),
							...(redditPost.data.is_video && { postMedia: redditPost.data.media.reddit_video.fallback_url }),
							...(twitterID !== "" && { twitterLink: twitterID }),
							...(!redditPost.data.url.includes("redd.it") &&
								!redditPost.data.url.includes("reddit.com") && {
									postDestination: redditPost.data.url,
								}),
						});
				}

				// sets new postData state returning all previous array of obejcts and adding new array of objects
				setPostData((prevPostData) => [...prevPostData, ...redditPosts]);

				if (redditPages.Iscroll) {
					// if infinite scroll is active then sets state of pageAfter for next fetch requests
					setPageAfter(data.data.after);
				} else {
					setRedditPages((prevRedditPages): RedditPages => {
						// else sets state for redditPages
						if (prevRedditPages.activePage === prevRedditPages.pagesAfter.length) {
							prevRedditPages.pagesAfter.push({
								pageNumber: prevRedditPages.pagesAfter.length + 1,
								pageAfter: data.data.after,
							});

							return {
								...prevRedditPages,
								pagesAfter: prevRedditPages.pagesAfter,
							};
						} else {
							return prevRedditPages;
						}
					});
				}

				// turns off loading
				setIsLoading(false);
			})
			.catch((e) => {
				// console logs error if there is any
				console.log(e.message);
			});

		// pushes state with URL adress to browser history
		window.history.pushState("", "", appURL.toLowerCase());

		/**gets page after for fetch request depending on current active page. Loops throuh all elements in array pagesAfter with pageNumber and pageAfter properties  */
		function getPagesAfter(pagesArray: { pageNumber: number; pageAfter: string }[]): string | undefined {
			for (let i = 0; i < pagesArray.length; i++) {
				if (pagesArray[i].pageNumber === redditPages.activePage) {
					return pagesArray[i].pageAfter;
				}
			}
		}
	}

	/**resets state of postData to empty array and sets active page on redditPages. Used for buttons in footer with pages numbers */
	function handleClick(pageNumber: number): void {
		setPostData([]);

		setRedditPages((prevRedditPages) => {
			return {
				...prevRedditPages,
				activePage: pageNumber,
			};
		});
	}

	// ======= CallBack to set up new observer everytime loading state changes (during new fetch request) when infinite scroll is turned on
	const intObserver = React.useRef<any>(null);
	const lastPostRef = React.useCallback(
		(post: any) => {
			// "post" and "posts" here are "entries"
			if (redditPages.Iscroll) {
				if (isLoading) return; // if fetch request is incomplete then it returns

				if (intObserver.current) intObserver.current.disconnect(); // if removes current observed post if there is any

				intObserver.current = new IntersectionObserver((posts) => {
					if (posts[0].isIntersecting) {
						getPosts();
					}
				}); // creates new fetch request when observer is being intersected

				if (post) intObserver.current.observe(post); // sets up new observer on post
			}
		},
		[isLoading]
	);

	return (
		<section className="content">
			<Header
				fetchOptions={fetchOptions}
				setFetchOptions={setFetchOptions}
				setPostData={setPostData}
				setPageAfter={setPageAfter}
				path={path}
				redditPages={redditPages}
				setRedditPages={setRedditPages}
			/>

			{/* if postData exists and infinite scroll is turned on creates new post components and sets up observer for (last posts - 4 ) post */}
			{postData &&
				redditPages.Iscroll &&
				postData.map((redditPost, index) => {
					if (index === postData.length - 4) {
						return (
							<ErrorBoundary key={nanoid()} FallbackComponent={ErrorFallback}>
								<Post ref={lastPostRef} postData={redditPost} />
							</ErrorBoundary>
						);
					} else {
						return (
							<ErrorBoundary key={nanoid()} FallbackComponent={ErrorFallback}>
								<Post postData={redditPost} />
							</ErrorBoundary>
						);
					}
				})}

			{/* if postData exists and infinite scroll is turned off then it creates post components */}
			{postData &&
				!redditPages.Iscroll &&
				postData.map((redditPost) => {
					return (
						<ErrorBoundary key={nanoid()} FallbackComponent={ErrorFallback}>
							<Post postData={redditPost} />
						</ErrorBoundary>
					);
				})}

			{/* creates footer with pages numbers when loading and infinite scroll are turned off */}
			{!redditPages.Iscroll && !isLoading && (
				<footer className="content__footer">
					{redditPages.pagesAfter.map((pageAfter) => {
						return (
							<button
								key={nanoid()}
								className={`content__footer__button${pageAfter.pageNumber === redditPages.activePage ? " active" : ""}`}
								onClick={() => handleClick(pageAfter.pageNumber)}
							>
								{pageAfter.pageNumber}
							</button>
						);
					})}
				</footer>
			)}

			{isLoading && <ClipLoader color="white" />}
		</section>
	);
};
export default SectionContent;
