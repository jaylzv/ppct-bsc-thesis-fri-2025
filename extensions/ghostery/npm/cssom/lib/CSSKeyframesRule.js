import { __exports as CSSKeyframesRule } from '../../../virtual/CSSKeyframesRule.js';
import { __require as requireCSSRule } from './CSSRule.js';

var hasRequiredCSSKeyframesRule;

function requireCSSKeyframesRule () {
	if (hasRequiredCSSKeyframesRule) return CSSKeyframesRule;
	hasRequiredCSSKeyframesRule = 1;
	//.CommonJS
	var CSSOM = {
		CSSRule: requireCSSRule().CSSRule
	};
	///CommonJS


	/**
	 * @constructor
	 * @see http://www.w3.org/TR/css3-animations/#DOM-CSSKeyframesRule
	 */
	CSSOM.CSSKeyframesRule = function CSSKeyframesRule() {
		CSSOM.CSSRule.call(this);
		this.name = '';
		this.cssRules = [];
	};

	CSSOM.CSSKeyframesRule.prototype = new CSSOM.CSSRule();
	CSSOM.CSSKeyframesRule.prototype.constructor = CSSOM.CSSKeyframesRule;
	CSSOM.CSSKeyframesRule.prototype.type = 7;
	//FIXME
	//CSSOM.CSSKeyframesRule.prototype.insertRule = CSSStyleSheet.prototype.insertRule;
	//CSSOM.CSSKeyframesRule.prototype.deleteRule = CSSStyleSheet.prototype.deleteRule;

	// http://www.opensource.apple.com/source/WebCore/WebCore-955.66.1/css/WebKitCSSKeyframesRule.cpp
	Object.defineProperty(CSSOM.CSSKeyframesRule.prototype, "cssText", {
	  get: function() {
	    var cssTexts = [];
	    for (var i=0, length=this.cssRules.length; i < length; i++) {
	      cssTexts.push("  " + this.cssRules[i].cssText);
	    }
	    return "@" + (this._vendorPrefix || '') + "keyframes " + this.name + " { \n" + cssTexts.join("\n") + "\n}";
	  }
	});


	//.CommonJS
	CSSKeyframesRule.CSSKeyframesRule = CSSOM.CSSKeyframesRule;
	///CommonJS
	return CSSKeyframesRule;
}

export { requireCSSKeyframesRule as __require };
