import React from "react";
import Header from "./Header";
import Post from "./Post";
import { FetchOptions } from "../types/types";
import { PostData } from "../types/types";
import { Images } from "../types/types";
import ErrorFallback from "./ErrorFallback";
import ClipLoader from "react-spinners/ClipLoader";
import { ErrorBoundary } from "react-error-boundary";
import { nanoid } from "nanoid";

// usunalem "axis"???????????
// geofilter nie dziala w API????????? ale timeframe dziala chociaz

type SectionContentProps = {
	path: string;
};

const SectionContent: React.FC<SectionContentProps> = ({ path }) => {
	// console.log("SectionContent rendered");

	const [postData, setPostData] = React.useState<PostData[]>([]);
	const [pageAfter, setPageAfter] = React.useState<string>("");
	const [isLoading, setIsLoading] = React.useState<boolean>(false);
	const [fetchOptions, setFetchOptions] = React.useState<FetchOptions | null>(null);

	React.useEffect(() => {
		if (fetchOptions) {
			getPosts();
		}
	}, [fetchOptions]);

	function getPosts(): void {
		let redditLink: string = `https://www.reddit.com/r/${fetchOptions?.subredditName}/${fetchOptions?.listing.value}.json?sr_detail=1&after=${pageAfter}`;
		let appURL = `/#/${fetchOptions?.subredditName}/${fetchOptions?.listing.value}`;

		setIsLoading(true);

		if (fetchOptions) {
			if (fetchOptions.geoFilter) {
				redditLink = `https://www.reddit.com/r/${fetchOptions?.subredditName}/${fetchOptions.listing.value}.json?sr_detail=1&geo_filter=${fetchOptions.geoFilter.value}&after=${pageAfter}`;
				appURL = `/#/${fetchOptions?.subredditName}/${fetchOptions?.listing.value}/${fetchOptions.geoFilter.value}`;
			} else if (fetchOptions.timeFrame) {
				redditLink = `https://www.reddit.com/r/${fetchOptions?.subredditName}/${fetchOptions.listing.value}.json?sr_detail=1&t=${fetchOptions.timeFrame.value}&after=${pageAfter}`;
				appURL = `/#/${fetchOptions?.subredditName}/${fetchOptions?.listing.value}/${fetchOptions.timeFrame.value}`;
			}
		}

		fetch(redditLink)
			.then((response) => response.json())
			.then((data) => {
				const redditPosts: PostData[] = [];
				let twitterID: string = "";

				for (const redditPost of data.data.children) {
					const postIconLink: string = redditPost.data.sr_detail.community_icon
						? redditPost.data.sr_detail.community_icon
						: redditPost.data.sr_detail.icon_img;

					const extensionIndex: number = postIconLink.includes(".jpg")
						? postIconLink.indexOf(".jpg") + 4
						: postIconLink.indexOf(".png") + 4;
					const postIcon: string = postIconLink.substring(0, extensionIndex);

					const postImages: Images[] = [];

					let hasTwitterLink: boolean =
						redditPost.data.media && redditPost.data.media.oembed && redditPost.data.media.oembed.url;

					if (redditPost.data.media_metadata) {
						Object.entries(redditPost.data.media_metadata).forEach((entry: any, index: number) => {
							postImages.push({
								imageLink: entry[1].s.u.replaceAll("amp;", ""),
								index: index + 1,
								...(index === 0 ? { visible: true } : { visible: false }),
							});
						});
					} else if (redditPost.data.url.includes(".jpg") || redditPost.data.url.includes(".png")) {
						postImages.push({
							imageLink: redditPost.data.url,
							visible: true,
							index: 1,
						});
					}

					if (hasTwitterLink && redditPost.data.media.oembed.url.includes("twitter")) {
						twitterID = redditPost.data.media.oembed.url.substring(
							redditPost.data.media.oembed.url.indexOf("status/") + 7
						);
					}

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

				setPostData((prevPostData) => [...prevPostData, ...redditPosts]);

				setPageAfter(data.data.after);

				setIsLoading(false);
			})
			.catch((e) => {
				console.log(e.message);
			});

		window.history.pushState("", "", appURL.toLowerCase());
	}

	// =================================================================================

	// post and posts here are entries

	const intObserver = React.useRef<any>(null);
	const lastPostRef = React.useCallback(
		(post: any) => {
			if (isLoading) return;

			if (intObserver.current) intObserver.current.disconnect();

			intObserver.current = new IntersectionObserver((posts) => {
				if (posts[0].isIntersecting) {
					getPosts();
				}
			});

			if (post) intObserver.current.observe(post);
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
			/>
			{postData &&
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
			{isLoading && <ClipLoader color="white" />}
		</section>
	);
};
export default SectionContent;
