<h1 align="center"> YoutubePlaylistUpgrade </h1>
<p align="center"><b>A web app that upgrade your experience browsing saved videos from your precious playlists</b></p>
<p align="center">👷 Many features still in development, open for contributions! 👷</p>

## ✍️ About

YouTubePlaylistUpgrade is a web application that provides a streamlined user interface for YouTube playlist management. With the ability to log in using your YouTube account, you can view your playlists in a clean and efficient grid layout, and easily search for videos within playlists by keyword.

In addition, it also offers convenient features for playlist organization such as deleting, moving, and copying videos between playlists by groups. This saves valuable time and effort for users who need to manage large playlists regularly.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.0. It also uses [OAuth2.0](https://developers.google.com/identity/protocols/oauth2) and [YouTube Data API](https://developers.google.com/youtube/v3/docs/playlists/list). Due to the policy of YouTube, users cannot access the 'Watch later' playlist for now.

## 📸 Screenshot

<p align="center"><img src="./src/assets/screenshot.png" alt="app screenshot" height="400" /></p>

## ✨Features

- ✔️ View playlisy videos in grid layout
- ✔️ Delete video/videos from a playlist
- ✔️ Move/copy videos from one playlist to another
- ✔️ Create new playlist
- ✔️ View all playlists alpheabtically
- ✔️ Sort videos from a playlist by added time
- ✔️ Search videos inside a playlist by title
- Edit playlist title, description and privacy
- ... and more to come!

## 📂 Installation

Run `git clone` to download the project to your local machine, then run `npm install` to install all the dependencies.

Create a `.env` file and add your own API key and Client ID to it. You can get your own API key and Client ID from [Google Cloud Platform](https://console.cloud.google.com/apis/credentials). Remember to name the variables as `NG_APP_API_KEY` and `NG_APP_CLIENT_ID`.

Run `ng serve -o` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## 💪 Contributions

Looking for contributors! Feel free to open an issue or submit a pull request. Don't forget to check out the [project](https://github.com/users/tzhang-SSR/projects/1/views/1) for remaining issues as well.

## ⚖️ License

This project is licensed under the MIT License.
