# filesize package for Atom

This package is intended for use with the [Atom Editor](https://atom.io) and it displays the size of the focused file in the [status-bar](https://atom.io/packages/status-bar) component included with Atom.

**Bonus:** If you click on the filesize component it will show a tooltip with more information about the file, try it out!

**New!** Version 2.0.0 is here. We now have **gzip** support, open the popup and check it out!

It works great with your new theme! The popups tries to follow your current theme's style, try switching themes and see for yourself.

# Get it now

If you have Atom Shell Commands run this on your terminal to get it now:

  `apm install filesize`

You can also find this package searching for `filesize` in the Atom package browser inside Settings.

# Screenshots

`filesize` with popup opened in One Dark theme.

<img src="https://cldup.com/R0n8GlrGqs.jpg" style="width: 100%; max-width: 784px;" title="Dark screenshot">

`filesize` with popup opened in Solarized Light theme while inspecting the above screenshot. Screenception!

<img src="https://cldup.com/snKMrn_B-T.jpg" style="width: 100%; max-width: 784px;" title="Light screenshot">

# How it works

It uses Node.JS's [fs](https://nodejs.org/api/fs.html) module to calculate the size in bytes of the current file in focus.

If the popup is enabled (by default it is), it fetches some additional info you might want to see:
  - Absolute path
  - Mime type
  - Creation date
  - Date of last change
  - Dimensions (if it's an image)

It works along side the status-bar component, so you need to have both enabled.
The status-bar component is installed and enabled by default by Atom. Thus, usually, you won't need to worry about it.

# Settings

The package has three settings located in `Settings->Packages->filesize`:

  - `Kibibyte Representation`, whether you want to show the size using Kibibyte or Kilobyte representations ([SI](https://en.wikipedia.org/wiki/International_System_of_Units)). It defaults to using the Kibibyte one.
  - `Enable Popup Appearance`, whether the popup will show on clicking the `filesize` component on the status bar. Defaults to showing the popup.
  - `Display Full Day Time On Popup`, whether to use 24 or 12 hour time display. It defaults to using the 24-hour format.

# Contributing

You are welcome to send any issues or pull requests.

The current styleguide for the project is [Airbnb's JavaScript Styleguide](https://github.com/airbnb/javascript).

Please run eslint with `npm run lint` and `apm test` before sending commits.

Any bugs? Please file an [issue](https://github.com/mkautzmann/atom-filesize/issues/)

Wanna fix it? Please send a [pull request](https://github.com/mkautzmann/atom-filesize/pulls/).

# Authors

- [Matheus Kautzmann](https://github.com/mkautzmann)
