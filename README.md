# Reddit Lurker

Bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshots](#screenshots)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
- [Author](#author)

## Overview

### The challenge

Users are able to:

- see loading animation during fetch request,
- see hover states for all interactive elements on the page,
- refresh page on reddit logo click,
- make appropriate fetch request to reddit API when clicking on header buttons (hot, new, top etc.),
- make appropriate fetch request to reddit API with change of browser's URL (/subredditName/listing/geoFilter for "hot" listing and timeframe for "top" listing/page for disabled infinite scroll)
  subredditName - any name of subreddit, default is "popular"
  listing: hot, new, top, rising
  geofilter - plenty options but doesn't seem to work due to reddit APi
  timeframe: hour, day, week, month, year, all
- enable infinite scroll for fetching new reddit posts from API,
- disable infinite scroll and just browse through loaded pages from reddit's API,
- view upvotes of reddit post,
- view creation time of post relative to user's time,
- open original link of post's subreddit in new tab,
- open original link of post's author in new tab,
- open original link of reddit post in new tab,
- view videos in webm (without sound),
- view image or album of images with next and previous buttons and hover and current image/all images number,

### Screenshots

![screenshot1](https://i.postimg.cc/YpQJRfsh/Screenshot-2023-05-29-at-14-57-50-Reddit-Lurker-Lite.png)

### Links

- Live Site URL: [gh pages]()

## My process

### Built with

- HTML5
- CSS Flexbox
- CSS Grid
- React 18, TypeScript, SASS
- [nanoid](https://www.npmjs.com/package/nanoid) for random IDs
- [FontAwsome](https://fontawesome.com/icons) for icons
- [react-router](https://reactrouter.com/en/main) for site's routes
- [javascript-time-ago](https://www.npmjs.com/package/javascript-time-ago) for calculating time
- [react-spinners](https://www.npmjs.com/package/react-spinners) for loading animation
- [react-error-boundary](https://www.npmjs.com/package/react-error-boundary) for error boundary
- [react-twitter-embed"](https://www.npmjs.com/package/react-twitter-embed) for embeding twitter links

## Author

Solution made by Mapokes

- Github - https://github.com/Mapokes
