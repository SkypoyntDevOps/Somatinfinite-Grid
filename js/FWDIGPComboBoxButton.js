/* FWDIGPComboBoxButton */
(function (){
var FWDIGPComboBoxButton = function(
			label1, 
			backgroundNormalColor,
			backgroundSelectedColor,
			textNormalColor,
			textSelectedColor,
			id,
			totalHeight
		){
		
		var self = this;
		var prototype = FWDIGPComboBoxButton.prototype;
		
		this.bk_sdo = null;
		this.text_sdo = null;
		this.dumy_sdo = null;
		
		this.label1_str = label1;
		this.backgroundNormalColor_str = backgroundNormalColor;
		this.backgroundSelectedColor_str = backgroundSelectedColor;
		this.textNormalColor_str = textNormalColor;
		this.textSelectedColor_str = textSelectedColor;
		
		this.totalWidth = 400;
		this.totalHeight = totalHeight;
		this.id = id;
		
		this.hasPointerEvent_bl = FWDRLUtils.hasPointerEvent;
		this.isMobile_bl = FWDRLUtils.isMobile;
		this.isDisabled_bl = false;
	
		//##########################################//
		/* initialize self */
		//##########################################//
		self.init = function(){
			self.setBackfaceVisibility();
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
			self.bk_sdo.setBkColor(self.backgroundNormalColor_str);
			self.addChild(self.bk_sdo);
			
			self.text_sdo = new FWDRLDisplayObject("div");
			self.text_sdo.setBackfaceVisibility();
			self.text_sdo.setOverflow("visible");
			self.text_sdo.setDisplay("inline-block");
			self.text_sdo.getStyle().fontFamily = "Arial";
			self.text_sdo.getStyle().fontSize= "13px";
			self.text_sdo.getStyle().padding = "6px";
			self.text_sdo.getStyle().color = self.normalColor_str;
			self.text_sdo.getStyle().whiteSpace = "nowrap";
			self.text_sdo.getStyle().fontSmoothing = "antialiased";
			self.text_sdo.getStyle().webkitFontSmoothing = "antialiased";
			self.text_sdo.getStyle().textRendering = "optimizeLegibility";	
			self.text_sdo.setInnerHTML(self.label1_str);
			self.addChild(self.text_sdo);
			
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
				self.dispatchEvent(FWDIGPComboBoxButton.MOUSE_OVER);
			}
		};
			
		self.onMouseOut = function(e){
			if(self.isDisabled_bl) return;
			if(!e.pointerType || e.pointerType == e.MSPOINTER_TYPE_MOUSE){
				FWDAnimation.killTweensOf(self.text_sdo);
				self.setNormalState(true);
				self.dispatchEvent(FWDIGPComboBoxButton.MOUSE_OUT);
			}
		};
		
		self.onClick = function(e){
			if(self.isDisabled_bl) return;
			if(e.preventDefault) e.preventDefault();
			self.dispatchEvent(FWDIGPComboBoxButton.CLICK);
		};
		
		self.onMouseDown = function(e){
			if(self.isDisabled_bl) return;
			if(e.preventDefault) e.preventDefault();
			self.dispatchEvent(FWDIGPComboBoxButton.MOUSE_DOWN, {e:e});
		};
		
		//###########################################//
		/* set selected / normal state */
		//###########################################//
		this.setSelectedState = function(animate){
			if(animate){
				FWDAnimation.to(self.bk_sdo.screen, .6, {css:{backgroundColor:self.backgroundSelectedColor_str}, ease:Quart.easeOut});
				FWDAnimation.to(self.text_sdo.screen, .6, {css:{color:self.textSelectedColor_str}, ease:Quart.easeOut});
			}else{
				self.bk_sdo.setBkColor(self.backgroundSelectedColor_str);
				self.text_sdo.getStyle().color = self.textSelectedColor_str;
			}
		};
		
		this.setNormalState = function(animate){
			if(animate){
				FWDAnimation.to(self.bk_sdo.screen, .6, {css:{backgroundColor:self.backgroundNormalColor_str}, ease:Quart.easeOut});
				FWDAnimation.to(self.text_sdo.screen, .6, {css:{color:self.textNormalColor_str}, ease:Quart.easeOut});
			}else{
				self.bk_sdo.setBkColor(self.backgroundNormalColor_str);
				self.text_sdo.getStyle().color = self.textNormalColor_str;
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
			if(FWDRLUtils.isIEAndLessThen9 || FWDRLUtils.isSafari){
				self.text_sdo.setY(Math.round((self.totalHeight - self.text_sdo.getHeight())/2) - 1);
			}else{
				self.text_sdo.setY(Math.round((self.totalHeight - self.text_sdo.getHeight())/2));
			}
			self.text_sdo.setHeight(self.totalHeight + 2);
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
			self.setButtonMode(false);
			self.setSelectedState(true);
		};
		
		this.enable = function(){
			self.isDisabled_bl = false;
			self.setNormalState(true);
			self.setButtonMode(true);
		};
	
	
		self.init();
	};
	
	/* set prototype */
	FWDIGPComboBoxButton.setPrototype = function(){
		FWDIGPComboBoxButton.prototype = new FWDRLDisplayObject("div");
	};
	
	FWDIGPComboBoxButton.FIRST_BUTTON_CLICK = "onFirstClick";
	FWDIGPComboBoxButton.SECOND_BUTTON_CLICK = "secondButtonOnClick";
	FWDIGPComboBoxButton.MOUSE_OVER = "onMouseOver";
	FWDIGPComboBoxButton.MOUSE_OUT = "onMouseOut";
	FWDIGPComboBoxButton.MOUSE_DOWN = "onMouseDown";
	FWDIGPComboBoxButton.CLICK = "onClick";
	
	FWDIGPComboBoxButton.prototype = null;
	window.FWDIGPComboBoxButton = FWDIGPComboBoxButton;
}(window));