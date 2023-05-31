import React from "react";
import ReactTimeAgo from "react-time-ago";
import SubIcon from "../icons/subredditIcon.png";
import { PostData } from "../types/types";
import { Images } from "../types/types";
import { nanoid } from "nanoid";
import { TwitterTweetEmbed, TwitterVideoEmbed } from "react-twitter-embed"; // not used for now

type PostProps = {
	postData: PostData;
};

// ref is added only to (max elements - 4) as per .map from SectioContent and only when infinite scroll is turned on
// in the rest cases of posts ref is null or undifined and is skipped in property ref inside returned jsx
const Post = React.forwardRef<any, PostProps>(({ postData }, ref) => {
	// console.log("Post rendered");

	const userDate: any = new Date(postData.postTime * 1000); // post time relative to user
	const [images, setImages] = React.useState<Images[] | null>(postData.postImages ? postData.postImages : null); //array of images or a single image inside array or null
	const [currentImageIndex, setCurrentImageIndex] = React.useState<number>(1); // current active image in case of album with images
	const [hovered, setHovered] = React.useState<boolean>(false); // hover state when mouse is on image

	// every time images changes and images exists -> sets currentImageIndex to current image from album
	React.useEffect(() => {
		if (images) {
			images.map((image) => {
				if (image.visible) {
					setCurrentImageIndex(image.index);
				}
			});
		}
	}, [images]);

	/**converts upvotes number to use "k" for 1000s */
	function upvotesConverter(upvotes: number): string | number {
		let ups: string | number = upvotes;

		if (ups >= 1000) {
			ups = (ups / 1000).toFixed(1);

			return ups + "k";
		} else {
			return ups;
		}
	}

	/**handles click on prev and next button on images */
	function handleClick(e: any): void {
		const name: string = e.target.name;

		if (name === "prev-btn") {
			// if prev button is clicked state of images changes to previous image
			setImages((prevImages) => {
				return prevImages!.map((prevImage) => {
					if (prevImage.index === currentImageIndex) {
						return {
							...prevImage,
							visible: false,
						};
					} else if (prevImage.index === currentImageIndex - 1) {
						return {
							...prevImage,
							visible: true,
						};
					} else {
						return prevImage;
					}
				});
			});
		} else if (name === "next-btn") {
			// if next button is clicked state of images changes to next image
			setImages((prevImages) => {
				return prevImages!.map((prevImage) => {
					if (prevImage.index === currentImageIndex) {
						return {
							...prevImage,
							visible: false,
						};
					} else if (prevImage.index === currentImageIndex + 1) {
						return {
							...prevImage,
							visible: true,
						};
					} else {
						return prevImage;
					}
				});
			});
		}
	}

	/**handles mouse over enter for images purposes */
	function handleMouseEnter(): void {
		setHovered(true);
	}

	/**handles mouse over leave for images purposes */
	function handleMouseLeave(): void {
		setHovered(false);
	}

	// =============================================================================================== disabled due cookies problems
	// function getYoutubeID(youtubeLink: string): string {
	// 	const youtubeIndex: number = youtubeLink.indexOf("=") + 1;
	// 	const youtbeID: string = youtubeLink.substring(youtubeIndex, youtubeIndex + 11);

	// 	return youtbeID;
	// }

	// link video youtube i streamable
	// video twittera zrobic jak bedzie jakis przyklad
	// ===============================================================================================

	return (
		<div className={`post-container${ref ? " snap-stop" : ""}`} ref={ref}>
			<div className="post-container__upvotes-container">
				<i className="fa-solid fa-arrow-up post-container__upvotes-container__arrow-up-icon"></i>
				<p className="post-container__upvotes-container__upvotes">{upvotesConverter(postData.upvotes)}</p>
				<i className="fa-solid fa-arrow-down post-container__upvotes-container__arrow-down-icon"></i>
			</div>

			<div className="post-container__post-content">
				<header className="post-container__post-content__header">
					<img
						className="post-container__post-content__header__subreddit-icon"
						src={postData.icon ? postData.icon : SubIcon}
						alt=""
					/>
					<a
						className="post-container__post-content__header__subreddit-link"
						href={`https://www.reddit.com/${postData.subName}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						{postData.subName}
					</a>
					<p className="post-container__post-content__header__text">● Posted by</p>
					<a
						className="post-container__post-content__header__post-author-link"
						href={`https://www.reddit.com/user/${postData.postAuthor}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						{postData.postAuthor}
					</a>
					<ReactTimeAgo className="post-container__post-content__header__posted-time" date={userDate} locale="en-US" />
				</header>

				<article className="post-container__post-content__article">
					<a
						className="post-container__post-content__article__title-link"
						href={`https://www.reddit.com${postData.redditURL}/`}
						target="_blank"
						rel="noopener noreferrer"
					>
						{postData.postTitle}
					</a>

					{postData.postDestination && (
						<div className="post-container__post-content__article__post-link-container">
							<a
								className="post-container__post-content__article__post-link-container__link"
								href={postData.postDestination}
								target="_blank"
								rel="noopener noreferrer"
							>
								{`${postData.postDestination.substring(0, 25)}...`}
								<i className="fa-solid fa-up-right-from-square post-container__post-content__article__post-link-container__link__icon"></i>
							</a>
						</div>
					)}

					{postData.postText && <p className="post-container__post-content__article__post-text">{postData.postText}</p>}

					{images && (
						<div
							className="post-container__post-content__article__post-img-container"
							onMouseEnter={handleMouseEnter}
							onMouseLeave={handleMouseLeave}
						>
							{images.map((image) => {
								return (
									<a
										key={nanoid()}
										className={`post-container__post-content__article__post-img-container__post-img-link${
											image.visible ? " visible" : ""
										}`}
										href={image.imageLink}
										target="_blank"
										rel="noopener noreferrer"
									>
										<img
											className={`post-container__post-content__article__post-img-container__post-img-link__post-img${
												image.visible ? " visible" : ""
											}`}
											src={image.imageLink}
											alt="post-img"
										/>
									</a>
								);
							})}
							{images.length > 1 && hovered && (
								<>
									<div className="post-container__post-content__article__post-img-container__img-counter-container">
										{`${currentImageIndex}/${images.length}`}
									</div>
									<button
										className={`post-container__post-content__article__post-img-container__prev-button${
											currentImageIndex === 1 ? "" : " visible"
										}`}
										name="prev-btn"
										disabled={currentImageIndex === 1 ? true : false}
										onClick={(e) => handleClick(e)}
									>
										<i className="fa-solid fa-angle-left post-container__post-content__article__post-img-container__prev-button__icon"></i>
									</button>
									<button
										className={`post-container__post-content__article__post-img-container__next-button${
											currentImageIndex === images.length ? "" : " visible"
										}`}
										name="next-btn"
										disabled={currentImageIndex === images.length ? true : false}
										onClick={(e) => handleClick(e)}
									>
										<i className="fa-solid fa-angle-right post-container__post-content__article__post-img-container__next-button__icon"></i>
									</button>
								</>
							)}
						</div>
					)}

					{postData.postMedia && (
						<video
							className="post-container__post-content__article__post-video"
							controls
							src={postData.postMedia}
						></video>
					)}

					{/* ============================ temporarly disabled ============================ */}

					{/* {postData.twitterLink && <TwitterTweetEmbed tweetId={postData.twitterLink} />} */}

					{/* {postData.postDestination && postData.postDestination.includes("youtube") && (
						<iframe
							className="post-container__post-content__article__youtube-video"
							src={`https://www.youtube-nocookie.com/embed/${getYoutubeID(postData.postDestination)}`}
							frameBorder="0"
						></iframe>
					)} */}
				</article>
			</div>
		</div>
	);
});
export default Post;
