import { __exports as CSSValue } from '../../../virtual/CSSValue.js';

var hasRequiredCSSValue;

function requireCSSValue () {
	if (hasRequiredCSSValue) return CSSValue;
	hasRequiredCSSValue = 1;
	//.CommonJS
	var CSSOM = {};
	///CommonJS


	/**
	 * @constructor
	 * @see http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSValue
	 *
	 * TODO: add if needed
	 */
	CSSOM.CSSValue = function CSSValue() {
	};

	CSSOM.CSSValue.prototype = {
		constructor: CSSOM.CSSValue,

		// @see: http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSValue
		set cssText(text) {
			var name = this._getConstructorName();

			throw new Error('DOMException: property "cssText" of "' + name + '" is readonly and can not be replaced with "' + text + '"!');
		},

		get cssText() {
			var name = this._getConstructorName();

			throw new Error('getter "cssText" of "' + name + '" is not implemented!');
		},

		_getConstructorName: function() {
			var s = this.constructor.toString(),
					c = s.match(/function\s([^\(]+)/),
					name = c[1];

			return name;
		}
	};


	//.CommonJS
	CSSValue.CSSValue = CSSOM.CSSValue;
	///CommonJS
	return CSSValue;
}

export { requireCSSValue as __require };
