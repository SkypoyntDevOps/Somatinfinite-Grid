/* FWDIGPComboBoxSelector */
(function (){
var FWDIGPComboBoxSelector = function(
			arrowN_img,
			arrowS_img,
			label1, 
			backgroundNormalColor,
			backgroundSelectedColor,
			textNormalColor,
			textSelectedColor,
			totalHeight
		){
		
		var self = this;
		var prototype = FWDIGPComboBoxSelector.prototype;
		
		this.arrowN_sdo = null;
		this.arrowS_sdo = null;
		
		this.arrowN_img = arrowN_img;
		this.arrowS_img = arrowS_img;
		
		this.label1_str = label1;
		this.backgroundNormalColor_str = backgroundNormalColor;
		this.backgroundSelectedColor_str = backgroundSelectedColor;
		this.textNormalColor_str = textNormalColor;
		this.textSelectedColor_str = textSelectedColor;
		
		this.totalWidth = 400;
		this.totalHeight = totalHeight;
		this.arrowWidth = this.arrowN_img.width;
		this.arrowHeight = this.arrowN_img.height;
		
		this.bk_sdo = null;
		this.text_sdo = null;
		this.dumy_sdo = null;
		
		this.hasPointerEvent_bl = FWDRLUtils.hasPointerEvent;
		this.isMobile_bl = FWDRLUtils.isMobile;
		this.isDisabled_bl = false;
	
		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.setBackfaceVisibility();
			self.hasTransform3d_bl = false;
			self.hasTransform2d_bl = false;
			self.setButtonMode(true);
			self.setupMainContainers();
			self.setWidth(self.totalWidth);
			self.setHeight(self.totalHeight);
		};
	
		//##########################################//
		/* setup main containers */
		//##########################################//
		self.setupMainContainers = function(){
			
			self.bk_sdo = new FWDRLDisplayObject("div");
			self.bk_sdo.setBackfaceVisibility();
			self.bk_sdo.hasTransform3d_bl = false;
			self.bk_sdo.hasTransform2d_bl = false;
		
			self.bk_sdo.setBkColor(self.backgroundNormalColor_str);
			self.addChild(self.bk_sdo);
			
			self.text_sdo = new FWDRLDisplayObject("div");
			self.text_sdo.setBackfaceVisibility();
			self.text_sdo.hasTransform3d_bl = false;
			self.text_sdo.hasTransform2d_bl = false;
			self.text_sdo.setOverflow("visible");
			self.text_sdo.setDisplay("inline-block");
			self.text_sdo.getStyle().fontFamily = "Arial";
			self.text_sdo.getStyle().fontSize= "13px";
			self.text_sdo.getStyle().padding = "6px";
			self.text_sdo.getStyle().color = self.normalColor_str;
			self.text_sdo.getStyle().fontSmoothing = "antialiased";
			self.text_sdo.getStyle().webkitFontSmoothing = "antialiased";
			self.text_sdo.getStyle().textRendering = "optimizeLegibility";	
			self.text_sdo.setInnerHTML(self.label1_str);
			self.addChild(self.text_sdo);
			
			self.arrowN_sdo = new FWDRLDisplayObject("img");
			self.arrowN_sdo.setScreen(self.arrowN_img);
			self.arrowN_sdo.setBackfaceVisibility();
			self.arrowS_sdo = new FWDRLDisplayObject("img");
			self.arrowS_sdo.setScreen(self.arrowS_img);
			self.arrowS_sdo.setBackfaceVisibility();
			self.arrowS_sdo.setAlpha(0);
			self.addChild(self.arrowN_sdo);
			self.addChild(self.arrowS_sdo);
			
			self.dumy_sdo = new FWDRLDisplayObject("div");
			if(FWDRLUtils.isIE){
				self.dumy_sdo.setBkColor("#FF0000");
				self.dumy_sdo.setAlpha(0);
			};
			self.addChild(self.dumy_sdo);
			
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerOver", self.onMouseOver);
					self.screen.addEventListener("MSPointerOut", self.onMouseOut);
					self.screen.addEventListener("MSPointerDown", self.onMouseDown);
					self.screen.addEventListener("MSPointerUp", self.onClick);
				}else{
					self.screen.addEventListener("touchstart", self.onMouseDown);
				}
			}else if(self.screen.addEventListener){
				self.screen.addEventListener("mouseover", self.onMouseOver);
				self.screen.addEventListener("mouseout", self.onMouseOut);
				self.screen.addEventListener("mousedown", self.onMouseDown);
				self.screen.addEventListener("click", self.onClick);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOver);
				self.screen.attachEvent("onmouseout", self.onMouseOut);
				self.screen.attachEvent("onmousedown", self.onMouseDown);
				self.screen.attachEvent("onclick", self.onClick);
			}
		};
		
		self.onMouseOver = function(e){
			if(self.isDisabled_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				FWDAnimation.killTweensOf(self.text_sdo);
				self.setSelectedState(true);
				self.dispatchEvent(FWDIGPComboBoxSelector.MOUSE_OVER);
			}
		};
			
		self.onMouseOut = function(e){
			if(self.isDisabled_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				FWDAnimation.killTweensOf(self.text_sdo);
				self.setNormalState(true);
				self.dispatchEvent(FWDIGPComboBoxSelector.MOUSE_OUT);
			}
		};
		
		self.onClick = function(e){
			if(self.isDeveleper_bl){
				window.open("http://www.webdesign-flash.ro", "_blank");
				return;
			}
			if(self.isDisabled_bl) return;
			if(e.preventDefault) e.preventDefault();
			self.dispatchEvent(FWDIGPComboBoxSelector.CLICK);
		};
		
		self.onMouseDown = function(e){
			if(self.isDisabled_bl) return;
			if(e.preventDefault) e.preventDefault();
			self.dispatchEvent(FWDIGPComboBoxSelector.MOUSE_DOWN, {e:e});
		};
		
		//###########################################//
		/* set selected / normal state */
		//###########################################//
		this.setSelectedState = function(animate){
			if(animate){
				FWDAnimation.to(self.bk_sdo.screen, .6, {css:{backgroundColor:self.backgroundSelectedColor_str}, ease:Quart.easeOut});
				FWDAnimation.to(self.text_sdo.screen, .6, {css:{color:self.textSelectedColor_str}, ease:Quart.easeOut});
				FWDAnimation.to(self.arrowS_sdo, .6, {alpha:1, ease:Quart.easeOut});
			}else{
				self.bk_sdo.setBkColor(self.backgroundSelectedColor_str);
				self.text_sdo.getStyle().color = self.textSelectedColor_str;
				self.arrowS_sdo.alpha = 1;
			}
		};
		
		this.setNormalState = function(animate){
			if(animate){
				FWDAnimation.to(self.bk_sdo.screen, .6, {css:{backgroundColor:self.backgroundNormalColor_str}, ease:Quart.easeOut});
				FWDAnimation.to(self.text_sdo.screen, .6, {css:{color:self.textNormalColor_str}, ease:Quart.easeOut});
				FWDAnimation.to(self.arrowS_sdo, .6, {alpha:0, ease:Quart.easeOut});
			}else{
				self.bk_sdo.setBkColor(self.backgroundNormalColor_str);
				self.text_sdo.getStyle().color = self.textNormalColor_str;
				self.arrowS_sdo.alpha = 0;
			}
		};

		//##########################################//
		/* center text */
		//##########################################//
		self.centerText = function(){
			self.dumy_sdo.setWidth(self.totalWidth);
			self.dumy_sdo.setHeight(self.totalHeight);
			self.bk_sdo.setWidth(self.totalWidth);
			self.bk_sdo.setHeight(self.totalHeight);
			
			if(FWDRLUtils.isIEAndLessThen9){
				self.text_sdo.setY(Math.round((self.totalHeight - self.text_sdo.getHeight())/2) - 1);
			}else{
				self.text_sdo.setY(Math.round((self.totalHeight - self.text_sdo.getHeight())/2));
			}
			self.text_sdo.setHeight(self.totalHeight + 2);
			
			self.arrowN_sdo.setX(self.totalWidth - self.arrowWidth - 4);
			self.arrowN_sdo.setY(Math.round((self.totalHeight - self.arrowHeight)/2));
			self.arrowS_sdo.setX(self.totalWidth - self.arrowWidth - 4);
			self.arrowS_sdo.setY(Math.round((self.totalHeight - self.arrowHeight)/2));
		};
		
		//###############################//
		/* get max text width */
		//###############################//
		self.getMaxTextWidth = function(){
			return self.text_sdo.getWidth();
		};
		
		//##############################//
		/* disable / enable */
		//#############################//
		this.disable = function(){
			self.isDisabled_bl = true;
			self.setSelectedState(true);
			if(FWDRLUtils.hasTransform2d){
				FWDAnimation.to(self.arrowN_sdo.screen, .6, {css:{rotation:180}, ease:Quart.easeOut});
				FWDAnimation.to(self.arrowS_sdo.screen, .6, {css:{rotation:180}, ease:Quart.easeOut});
			}
		};
		
		this.enable = function(){
			self.isDisabled_bl = false;
			self.setNormalState(true);
			if(FWDRLUtils.hasTransform2d){
				FWDAnimation.to(self.arrowN_sdo.screen, .6, {css:{rotation:0}, ease:Quart.easeOut});
				FWDAnimation.to(self.arrowS_sdo.screen, .6, {css:{rotation:0}, ease:Quart.easeOut});
			}
		};
	
	
		self.init();
	};
	
	/* set prototype */
	FWDIGPComboBoxSelector.setPrototype = function(){
		FWDIGPComboBoxSelector.prototype = new FWDRLDisplayObject("div");
	};
	
	FWDIGPComboBoxSelector.FIRST_BUTTON_CLICK = "onFirstClick";
	FWDIGPComboBoxSelector.SECOND_BUTTON_CLICK = "secondButtonOnClick";
	FWDIGPComboBoxSelector.MOUSE_OVER = "onMouseOver";
	FWDIGPComboBoxSelector.MOUSE_OUT = "onMouseOut";
	FWDIGPComboBoxSelector.MOUSE_DOWN = "onMouseDown";
	FWDIGPComboBoxSelector.CLICK = "onClick";
	
	FWDIGPComboBoxSelector.prototype = null;
	window.FWDIGPComboBoxSelector = FWDIGPComboBoxSelector;
}(window));