# filesize package for Atom

This package is intended for use with the [Atom Editor](https://atom.io) and it displays the size of the focused file in the [status-bar](https://atom.io/packages/status-bar) component included with Atom.

**Bonus:** If you click on the filesize component it will show a tooltip with more information about the file, try it out!

It works great with your new theme! The popups tries to follow your current theme's style, try switching themes and see for yourself.

**New in 4.0.0:** Remote file support. Now you can quickly check the estimated size of your remote project files. This includes support for the popular [nuclide](https://github.com/facebook/nuclide) extension. More details of the implementation below.

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

# Remote files

Since `4.0.0` filesize supports remote files. The extension is basically reading the editor buffer to estimate the file size.

The estimated size is identified by the `~` symbol before the formatted size in the status bar.

Tooltip detailed info does not feature the whole set of information.

When working with remote files the extension does not have access to the whole file metadata, so we are showing estimated size only. This may change in future releases.

# Settings

The package has three settings located in `Settings->Packages->filesize`:

  - `Use Decimal`, whether you want to show the size using Decimal or [IEC/ISO80000](https://en.wikipedia.org/wiki/ISO/IEC_80000). It defaults to using the IEC representation.
  - `Enable Popup Appearance`, whether the popup will show on clicking the `filesize` component on the status bar. Defaults to showing the popup.
  - `Display Full Day Time On Popup`, whether to use 24 or 12 hour time display. It defaults to using the 24-hour format.
  - `Display Gzipped Size on Popup`, whether to enable gzip size appearance on the popup.

# Contributing

You are welcome to send any issues or pull requests.

The current styleguide for the project is [Airbnb's JavaScript Styleguide](https://github.com/airbnb/javascript).

Please run eslint with `npm run lint` and `apm test` before sending commits.

Any bugs? Please file an [issue](https://github.com/mkxml/atom-filesize/issues/)

Wanna fix it? Please send a [pull request](https://github.com/mkxml/atom-filesize/pulls/).

# Authors

- [Matheus Kautzmann](https://github.com/mkxml)
