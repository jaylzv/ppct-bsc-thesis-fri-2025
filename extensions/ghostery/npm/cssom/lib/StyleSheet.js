import { __exports as StyleSheet } from '../../../virtual/StyleSheet.js';

var hasRequiredStyleSheet;

function requireStyleSheet () {
	if (hasRequiredStyleSheet) return StyleSheet;
	hasRequiredStyleSheet = 1;
	//.CommonJS
	var CSSOM = {};
	///CommonJS


	/**
	 * @constructor
	 * @see http://dev.w3.org/csswg/cssom/#the-stylesheet-interface
	 */
	CSSOM.StyleSheet = function StyleSheet() {
		this.parentStyleSheet = null;
	};


	//.CommonJS
	StyleSheet.StyleSheet = CSSOM.StyleSheet;
	///CommonJS
	return StyleSheet;
}

export { requireStyleSheet as __require };
