export type PostData = {
	upvotes: number; // upvotes - number of post upvotes
	icon: string; // icon - subreddit icon of the post
	subName: string; // subName - name of subreddit of the post
	postAuthor: string; // postAuthor - name of author of the post
	postTime: number; // postTime - time of creation of post
	postTitle: string; // postTitle - title of post
	redditURL: string; // redditURL - link to original post from reddit site
	postText?: string; // postText? - text of post if there is any
	postImages?: Images[]; // postImages? - array with image or images of post if there is/are any
	postMedia?: string; // postMedia? - video of post if there is any
	twitterLink?: string; // twitterLink? - twitter link of post if there is any
	postDestination?: string; // postDestination? - link to site of post which it's referencing - if there is any
};

export type Images = {
	imageLink: string;
	visible: boolean;
	index: number;
};

export type FetchOptions = {
	subredditName: string; // subredditName - name of subreddit. Can be "popular" for main reddit
	listing: {
		// listing - Hot/New/Top/Rising
		option: {
			hot: boolean;
			new: boolean;
			top: boolean;
			rising: boolean;
		};
		value: string;
	};
	geoFilter?: {
		// geoFilter? - geo locations of posts search. Available only with "Hot" listing
		value: string;
		name: string;
	};
	timeFrame?: {
		// timeFrame? - Now/Today/This Week/This Month/This Year/All Time. Available only with "Top" listing
		value: string;
		name: string;
	};
};

export type RedditPages = {
	Iscroll: boolean;
	pagesAfter: {
		pageNumber: number;
		pageAfter: string;
	}[];
	activePage: number;
};
