import React from "react";
import ReactTimeAgo from "react-time-ago";
import SubIcon from "../icons/subredditIcon.png";
import { TwitterTweetEmbed, TwitterVideoEmbed } from "react-twitter-embed";
import { PostData } from "../types/types";
import { Images } from "../types/types";
import { nanoid } from "nanoid";

type PostProps = {
	postData: PostData;
};

// ref is added only to last element as per .map fron SectioContent
// in the rest cases of posts ref is null or undifined and is skipped in property ref inside returned jsx

const Post = React.forwardRef<any, PostProps>(({ postData }, ref) => {
	// console.log("Post rendered");

	const userDate: any = new Date(postData.postTime * 1000);
	const [images, setImages] = React.useState<Images[] | null>(postData.postImages ? postData.postImages : null);
	const [currentImageIndex, setCurrentImageIndex] = React.useState<number>(1);
	const [hovered, setHovered] = React.useState<boolean>(false);

	React.useEffect(() => {
		if (images) {
			images.map((image) => {
				if (image.visible) {
					setCurrentImageIndex(image.index);
				}
			});
		}
	}, [images]);

	function upvotesConverter(upvotes: number): string | number {
		let ups: string | number = upvotes;

		if (ups >= 1000) {
			ups = (ups / 1000).toFixed(1);

			return ups + "k";
		} else {
			return ups;
		}
	}

	function handleClick(e: any): void {
		const name: string = e.target.name;

		if (name === "prev-btn") {
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

	function handleMouseEnter(): void {
		setHovered(true);
	}

	function handleMouseLeave(): void {
		setHovered(false);
	}

	function getYoutubeID(youtubeLink: string): string {
		const youtubeIndex: number = youtubeLink.indexOf("=") + 1;
		const youtbeID: string = youtubeLink.substring(youtubeIndex, youtubeIndex + 11);

		return youtbeID;
	}

	// link video youtube i streamable
	// video twittera zrobic jak bedzie jakis przyklad
	// zamiast layout w headerze moze mozliwosc zamiast infinite scrolla poprostu strony

	return (
		<div className={`post-container${ref ? " snap-stop" : ""}`} ref={ref}>
			<div className="post-container__upvotes-container">
				<i className="fa-solid fa-arrow-up post-container__upvotes-container__arrow-up-icon"></i>
				<p className="post-container__upvotes-container__upvotes">{upvotesConverter(postData.upvotes)}</p>
				<i className="fa-solid fa-arrow-down post-container__upvotes-container__arrow-down-icon"></i>
			</div>

			<div className="post-container__post-content">
				<header className="post-container__post-content__header">
					<img className="post-container__post-content__header__subreddit-icon" src={postData.icon} alt={SubIcon} />
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

					{/* {postData.twitterLink && <TwitterTweetEmbed tweetId={postData.twitterLink} />}

					{postData.postDestination && postData.postDestination.includes("youtube") && (
						<iframe
							className="post-container__post-content__article__youtube-video"
							src={`https://www.youtube.com/embed/${getYoutubeID(postData.postDestination)}`}
							frameBorder="0"
						></iframe>
					)} */}
				</article>
			</div>
		</div>
	);
});
export default Post;
