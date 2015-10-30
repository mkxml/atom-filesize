# filesize package for Atom

This package displays the current file's size on the status bar component.

**New!** Now if you click on the filesize component on the status bar it will show a tooltip with more information about the file, try it out!

See the screenshot below for a preview on that new feature.

It works great with your new theme! The popups tries to follow your current theme's style, try switch themes and see for your self.

We intend to add new stuff to this tooltip some time in the future, let me know if you have an idea of something cool to add there.

# Screenshots

`filesize` with popup opened in One Dark theme.

<img src="https://cldup.com/R0n8GlrGqs.jpg" style="width: 100%; max-width: 784px;" title="Dark screenshot">

`filesize` with popup opened in Solarized Light theme while inspecting the above screenshot. Screenception!

<img src="https://cldup.com/snKMrn_B-T.jpg" style="width: 100%; max-width: 784px;" title="Light screenshot">

# Get it now

If you have Atom Shell Commands run this on your terminal to get it now:

  `apm install filesize`

You can also find this package searching for `filesize` in the Atom package browser inside Settings.

# How it works

It uses Node.JS to calculate the size in bytes of the current file in focus by Atom.

If the popup is enable it also fetches some additional info one might want to take a quick look such as:
  - Absolute path
  - Mime type
  - Creation date
  - Date of last change
  - Dimensions (if it's an image)

It works along side with the status-bar component, so you need to enable both
components. The status-bar component is installed and enabled by default by Atom, so you don't need to worry about it.

# Settings

It has three settings under Atom `Settings->Packages->filesize`:

  - `Kibibyte Representation`, whether you want to show the size using Kibibyte or Kilobyte representations. It defaults to using the Kibibyte one.
  - `Enable Popup Appearance`, whether the popup will show on clicking the `filesize` component on the status bar. Defaults to showing the popup.
  - `Display Full Day Time On Popup`, whether to use 24 or 12 hour time display. It defaults to using the 24-hour format.

# Contributing

Contributing is easy, this is a small project so I'm accepting direct PRs and
any kind of contribution you may have, today I'm focusing on improving test
coverage and making the package more robust and reliable.

Any bugs? Please file an [issue](https://github.com/mkautzmann/atom-filesize/issues/)

Wanna fix it? Please send a [pull request](https://github.com/mkautzmann/atom-filesize/pulls/).

# Authors

- [Matheus Kautzmann](https://github.com/mkautzmann)
