## 4.0.0 - Remote file support and fixes
* **Remote file support**. You can check the size in the status bar. It will be preffixed by `~` indicating its an estimated size info.
* Fixed tooltip background. In some environments and situations the tooltip background was black when its suposed to be a darker color of the current theme.
* Fixed size not being updated upon first save. Tweak `scheduleSizeUpdate` to perform a check after Atom has actually saved the file.

## 3.0.1 - Small fixes
* Updated dependencies, now using `filesize-calculator` version `3.0.0`.
* Fixed gzip size not showing properly when option `useDecimal` was set to `true`.

## 3.0.0 - Change config UseKibibyteRepresentation to UseDecimal
* Breaking change: Config `UseKibibyteRepresentation` is now `UseDecimal`. When set to true it will now use base 1000, base 1024 is used when it's false which is the default behavior for this option.
* Small refactoring in source code.
* Updated filesize-calculator to 2.0.0.
* Updated dev dependencies.

## 2.0.4 - Fix tooltip breaking on certain themes
* Some themes, like Atom Material, were breaking the tooltip styling. That's now fixed!
* Updated specs, removing `filesize-calculator` stuff. It was a duplicated suite.
* Updated LICENSE, 2017!

## 2.0.3 - Update filesize-calculator
* Displays correct symbol for kilobyte. (KB -> kB).

## 2.0.2 - Fix jpeg behavior, export filesize-calculator
* The image info was not being displayed for `image/jpeg` mime types. Is it OK now.
* The `filesize-calculator.js` functions were exported to a separate [NPM package](https://npmjs.com/package/filesize-calculator).

## 2.0.1 - Changed publisher username
* Minor change, does not affect the codebase. Just changed the username references in docs from @mkautzmann to @mkxml.

## 2.0.0 - Add Gzip support
* The package now has the option to display the gzip size of the file in the popup.
* This option is configurable via package settings. It is on by default.
* Added [gzip-size](https://www.npmjs.com/package/gzip-size) dependency to make this possible.
* Simplified Airbnb guide handling, just importing the base guide now.

## 1.0.0 - Completely rewritten to JS/ES2015
* The package now reaches maturity.
* The codebase is now pure JS/ES2015 compliant.
* The load times are greatly improved since we are now using lazy module requires. The tooltip info is fetched only when needed.
* The tooltip now dismisses when clicking away.
* The tooltip now supports the new ImageEditor from Atom 1.0+.
* The package now gracefully enables and disables according to the user settings.
* The package specs are passing on `apm test` and when running over the GUI inside the Atom editor.
* Internal dependencies have been upgraded.
* `space-pen-views` dependency has been dropped, since GitHub is not maintaining it anymore.
* The README was simplified and updated to reflect the recent changes.
* The package is ready for Atom's most current and upcoming releases.

## 0.4.2 - Improve load time
* Improve load time by requiring dependencies on package activation

## 0.4.1 - Explicit consumedServices in package.json
* If you are having problems with 0.4.0 please update to this one.

## 0.4.0 - Adhere to the Services API for consuming the status-bar
* The plugin changed the way it relates with the `status-bar`, now it consumes the newly introduced status-bar API via the Atom [Services](http://blog.atom.io/2015/03/25/new-services-API.html) spec.
* The plugin is no longer compatible with Atom < 1.1.0
* Should solve the problem some users are having with the status-bar `appendLeft` error.

## 0.3.1 - Add the status-bar as formal dependency
* The status-bar will be installed if not present before the package activates.
* If the status bar isn't enabled the package won't show.

## 0.3.0 - New feature arrival - Additional info on click
* Implements a popup that appears when clicking the `filesize` component.
* The popup contains additional information about the file opened in the editor.
* `filesize` now shows when opening images as well.

## 0.2.0 - Updates the package to conform with Atom API 1.0+
* Fix the code implementing the new API and getting rid of deprecation alerts;
* Fix the testes as well

## 0.1.1 - Minor bug fix
* Fix a problem that occurred when you opened a 0 byte file.

## 0.1.0 - First Release
* Atom package that displays the current file's size on the status bar
