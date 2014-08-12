# filesize package for Atom

This package displays the current file's size on the status bar component.

# Screenshot

![filesize package screenshot](http://f.cl.ly/items/26081p1n180T3y381I1i/filesize_pkg_screen.jpg)

# Get it now

If you have Atom Shell Commands run this on your terminal to get it now:

  `apm install filesize`

You can also find this package searching for `filesize` in the Atom package browser inside Settings.

# How it works

It uses Node.JS to calculate the size in bytes of the current file in focus by Atom.

It works along side with the status-bar component, so you need to enable both
components. The status-bar component is installed and enabled by default by Atom, so you don't need to worry about it.

# Settings

The one and only setting is present in the Settings tab in Atom, there you can
choose if you want to display the size in Kibibyte Representation (base 1024) or
if you want to show the size in Kilobyte Representation (base 1000).

The default behavior is show the size in Kibibyte Representation, if you want to
change this just uncheck the box in `Settings->Packages->filesize`.


# Contributing

Contributing is easy, this is a small project so I'm accepting direct PRs and
any kind of contribution you may have, today I'm focusing on improving test
coverage and making the package more robust and reliable.

Any bugs? Please file an [issue](https://github.com/mkautzmann/atom-filesize/issues/)

Wanna fix it? Please send a [pull request](https://github.com/mkautzmann/atom-filesize/pulls/).

# Authors

- [Matheus Kautzmann](https://github.com/mkautzmann)
