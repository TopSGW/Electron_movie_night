# movie-night [![CircleCI](https://circleci.com/gh/blenoski/movie-night.svg?style=shield)](https://circleci.com/gh/blenoski/movie-night)  [![Coverage Status](https://coveralls.io/repos/github/blenoski/movie-night/badge.svg?branch=master&t=2)](https://coveralls.io/github/blenoski/movie-night?branch=master)  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#developers)

An Electron powered app for browsing your digital movie collection

## Summary
The goal of this project is to provide a delightful movie browsing experience in areas without reliable and/or affordable internet access. Adventure travelers are a good example user segement.

### Browse
![Browse](screenshots/browse.png?raw=true "Browse")

### Movie Details
![Movie Details](screenshots/oldschool.png?raw=true "Movie Details")

### Search
![Search](screenshots/search.png?raw=true "Search")

## Developers
Pull requests welcome.

### Running locally in development mode
```
$ cd movie-night   
$ yarn install   
$ npm run start:devserver  
```

In a second terminal
```
$ cd movie-night
$ npm run start:dev
```

### Run in release mode
```
$ npm start
```

### Run tests
```
$ npm test
```


### Create Platform Installation Packages
```
$ npm run dist
```
Then find DMG (OS X) or EXE (Windows) in dist/ folder
### Technology Stack
<a href="https://electron.atom.io/"><img src="https://camo.githubusercontent.com/11e7cfd04eceb1ea7464e99edda0e7000487f343/68747470733a2f2f656c656374726f6e2e61746f6d2e696f2f696d616765732f656c656374726f6e2d6c6f676f2e737667" height="56px"/></a>

<a href="https://facebook.github.io/react/"> <img src="https://react-etc.net/files/2016-07/logo-578x270.png" height="56px"/></a>  <a href="http://redux.js.org/"><img src="https://i2.wp.com/blog.js-republic.com/wp-content/uploads/2016/11/logo-redux.png?fit=500%2C500" height="80px"/></a>  <a href="https://nodejs.org/"><img src="http://meegraphics.in/tech/nodejs-stacked.png" height="70px"/></a>  <a href="https://www.w3schools.com/"><img src="https://www.w3.org/html/logo/downloads/HTML5_Logo_512.png" height="70px"/></a>  <a href="https://www.w3schools.com/"><img src="https://www.brandsoftheworld.com/sites/default/files/styles/logo-thumbnail/public/042015/css3.png?itok=bzukaL4s" height="70px"/></a>  <a href="https://standardjs.com/"><img src="https://cdn.rawgit.com/feross/standard/master/badge.svg"/></a>
