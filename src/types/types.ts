export type PostData = {
	upvotes: number;
	icon: string;
	subName: string;
	postAuthor: string;
	postTime: number;
	postTitle: string;
	redditURL: string;
	postText?: string;
	postImages?: Images[];
	postMedia?: string;
	twitterLink?: string;
	postDestination?: string;
};

// upvotes - number of post upvotes
// icon - subreddit icon of the post
// subName - name of subreddit of the post
// postAuthor - name of author of the post
// postTime - time of creation of post
// postTitle - title of post
// redditURL - link to original post from reddit site
// postText? - text of post if there is any
// postImages? - array with image or images of post if there is/are any
// postMedia? - video of post if there is any
// twitterLink? - twitter link of post if there is any
// postDestination? - link to site of post which it's referencing - if there is any

export type Images = {
	imageLink: string;
	visible: boolean;
	index: number;
};

export type FetchOptions = {
	subredditName: string;
	listing: {
		option: {
			hot: boolean;
			new: boolean;
			top: boolean;
			rising: boolean;
		};
		value: string;
		// name: string;
	};
	geoFilter?: {
		value: string;
		name: string;
	};
	timeFrame?: {
		value: string;
		name: string;
	};
};

// subredditName - name of subreddit. Can be "popular" for main reddit
// listing - Hot/New/Top/Rising
// geoFilter? - geo locations of posts search. Available only with "Hot" listing
// timeFrame? - Now/Today/This Week/This Month/This Year/All Time. Available only with "Top" listing
