/* Image manager */
(function (window){
	
	var FWDIGPComboBox = function(parent, props_obj){
		
		var self = this;
		var prototype = FWDIGPComboBox.prototype;
		
		this.categories_ar = props_obj.categories_ar;
		this.buttons_ar = [];
		
		this.mainHolder_do = null;
		this.selector_do = null;
		this.mainButtonsHolder_do = null;
		this.buttonsHolder_do = null;
		
		this.upArrowN_img = props_obj.upArrowN_img;
		this.upArrowS_img = props_obj.upArrowS_img;
		
		this.selectorLabel_str = props_obj.selectorLabel;
		this.selectorBkColorN_str = props_obj.selctorBackgroundNormalColor;
		this.selectorBkColorS_str = props_obj.selctorBackgroundSelectedColor;
		this.selectorTextColorN_str = props_obj.selctorTextNormalColor;
		this.selectorTextColorS_str = props_obj.selctorTextSelectedColor;
		this.itemBkColorN_str = props_obj.buttonBackgroundNormalColor;
		this.itemBkColorS_str = props_obj.buttonBackgroundSelectedColor;
		this.itemTextColorN_str = props_obj.buttonTextNormalColor;
		this.itemTextColorS_str = props_obj.buttonTextSelectedColor;
		this.shadowColor_str = props_obj.shadowColor;
		this.position_str = props_obj.position;
		
		this.finalX;
		this.finalY;
		this.totalButtons = self.categories_ar.length;
		this.curId = props_obj.startAtCategory;
		this.horizontalMargins = props_obj.comboBoxHorizontalMargins;
		this.verticalMargins = props_obj.comboBoxVerticalMargins;
		this.buttonsHolderWidth = 0;
		this.buttonsHolderHeight = 0;
		this.totalWidth = 0;
		this.buttonHeight = 26;
		this.totalButtonsHeight = 0;
		this.sapaceBetweenButtons = 0;
		this.borderRadius = props_obj.comboBoxCornerRadius;
		
		this.hideMenuTimeOutId_to;
		this.getMaxWidthResizeAndPositionId_to;
		
		this.isShowed_bl = false;
		this.isOpened_bl = false;
		this.hasPointerEvent_bl = FWDRLUtils.hasPointerEvent;
		this.isMobile_bl = FWDRLUtils.isMobile;
		
		this.init = function(){
			self.setVisible(false);
			self.setBackfaceVisibility();
			self.hasTransform3d_bl = false;
			self.hasTransform2d_bl = false;
		
			self.setupMainContainers();
			self.getMaxWidthResizeAndPositionId_to = setTimeout(
					function(){
						self.getMaxWidthResizeAndPosition(),
						self.setButtonsState();
						self.position();
						self.showFirstTime();}
						, 200);
		};
		
		//#####################################//
		/* setup main containers */
		//####################################//
		this.setupMainContainers = function(){
			var button_do;
			var arrowN_img;
			var arrowS_img;
			
			self.mainHolder_do = new FWDRLDisplayObject("div");
			self.mainHolder_do.setOverflow("visible");
			self.mainHolder_do.setBackfaceVisibility();
			self.mainHolder_do.hasTransform3d_bl = false;
			self.mainHolder_do.hasTransform2d_bl = false;
			self.addChild(self.mainHolder_do);
			
			self.mainButtonsHolder_do = new FWDRLDisplayObject("div");
			self.mainButtonsHolder_do.setBackfaceVisibility();
			self.mainButtonsHolder_do.hasTransform3d_bl = false;
			self.mainButtonsHolder_do.hasTransform2d_bl = false;
			self.mainButtonsHolder_do.setY(self.buttonHeight);
			self.mainHolder_do.addChild(self.mainButtonsHolder_do);
			
			self.buttonsHolder_do = new FWDRLDisplayObject("div");
			self.buttonsHolder_do.setBackfaceVisibility();
			self.buttonsHolder_do.hasTransform3d_bl = false;
			self.buttonsHolder_do.hasTransform2d_bl = false;
			self.mainButtonsHolder_do.addChild(self.buttonsHolder_do);
			arrowN_img = self.upArrowN_img;
			arrowS_img = self.upArrowS_img;
			
			FWDIGPComboBoxSelector.setPrototype();
			self.selector_do = new FWDIGPComboBoxSelector(
					arrowN_img,
					arrowS_img,
					self.selectorLabel_str,
					self.selectorBkColorN_str,
					self.selectorBkColorS_str,
					self.selectorTextColorN_str,
					self.selectorTextColorS_str,
					self.buttonHeight);
			self.mainHolder_do.addChild(self.selector_do);
			self.selector_do.setNormalState(false);
			if(self.borderRadius != 0){
				self.selector_do.bk_sdo.getStyle().borderTopLeftRadius = self.borderRadius + "px";
				self.selector_do.bk_sdo.getStyle().borderTopRightRadius = self.borderRadius + "px";
				self.selector_do.bk_sdo.getStyle().borderBottomLeftRadius = self.borderRadius + "px";
				self.selector_do.bk_sdo.getStyle().borderBottomRightRadius = self.borderRadius + "px";
				self.getStyle().borderRadius = self.borderRadius + "px";
			}
			self.selector_do.addListener(FWDIGPComboBoxSelector.MOUSE_DOWN, self.openMenuHandler);
			
			for(var i=0; i<self.totalButtons; i++){
				FWDIGPComboBoxButton.setPrototype();
				button_do = new FWDIGPComboBoxButton(
						self.categories_ar[i],
						self.itemBkColorN_str,
						self.itemBkColorS_str,
						self.itemTextColorN_str,
						self.itemTextColorS_str,
						i,
						self.buttonHeight);
				self.buttons_ar[i] = button_do;
				button_do.addListener(FWDIGPComboBoxButton.MOUSE_DOWN, self.buttonOnMouseDownHandler);
				self.buttonsHolder_do.addChild(button_do);
			}
			
			if(self.borderRadius != 0){
				button_do.bk_sdo.getStyle().borderBottomLeftRadius = self.borderRadius + "px";
				button_do.bk_sdo.getStyle().borderBottomRightRadius = self.borderRadius + "px";
			}
		};
		
		this.buttonOnMouseDownHandler = function(e){
		
			self.curId = e.target.id;
			//self.setButtonsStateBasedOnId();
			
			clearTimeout(self.hideMenuTimeOutId_to);
			
			self.hide(true);
			
			self.selector_do.enable(); 
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					window.removeEventListener("MSPointerDown", self.checkOpenedMenu);
				}else{
					window.removeEventListener("touchstart", self.checkOpenedMenu);
				}
			}else{
				if(window.addEventListener){
					window.removeEventListener("mousemove", self.checkOpenedMenu);
				}else if(document.attachEvent){
					document.detachEvent("onmousemove", self.checkOpenedMenu);
				}
			}
			
			self.dispatchEvent(FWDIGPComboBox.BUTTON_PRESSED, {id:self.curId});
		};
		
		this.openMenuHandler = function(){
			if(self.isShowed_bl) return;
			self.selector_do.disable();
			self.show(true);
			self.startToCheckOpenedMenu();
		};
		
		//#######################################//
		/* Disable or enable buttons */
		//#######################################//
		this.setButtonsStateBasedOnId = function(id){
			if(id !== undefined) self.curId = id;
			for(var i=0; i<self.totalButtons; i++){
				button_do = self.buttons_ar[i];
				if(i == self.curId){
					button_do.disable();
				}else{
					button_do.enable();
				}
			}
		};
		
		//#######################################//
		/* Start to check if mouse is over menu */
		//#######################################//
		this.startToCheckOpenedMenu = function(e){
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					window.addEventListener("MSPointerDown", self.checkOpenedMenu);
				}else{
					window.addEventListener("touchstart", self.checkOpenedMenu);
				}
			}else{
				if(window.addEventListener){
					window.addEventListener("mousemove", self.checkOpenedMenu);
				}else if(document.attachEvent){
					document.attachEvent("onmousemove", self.checkOpenedMenu);
				}
			}
		};
		
		this.checkOpenedMenu = function(e){
			if(e.preventDefault) e.preventDefault();
			
			var viewportMouseCoordinates = FWDRLUtils.getViewportMouseCoordinates(e);		
			
			if(!FWDRLUtils.hitTest(self.screen, viewportMouseCoordinates.screenX, viewportMouseCoordinates.screenY)){
				
				if(self.isMobile_bl){
					self.hide(true);
					self.selector_do.enable();
				}else{
					clearTimeout(self.hideMenuTimeOutId_to);
					self.hideMenuTimeOutId_to = setTimeout(function(){
						self.hide(true);
						self.selector_do.enable();}, 
						1000);
				}
				
				if(self.isMobile_bl){
					if(self.hasPointerEvent_bl){
						window.removeEventListener("MSPointerDown", self.checkOpenedMenu);
					}else{
						window.removeEventListener("touchstart", self.checkOpenedMenu);
					}
				}else{
					if(window.addEventListener){
						window.removeEventListener("mousemove", self.checkOpenedMenu);
					}else if(document.attachEvent){
						document.detachEvent("onmousemove", self.checkOpenedMenu);
					}
				}
			}else{
				clearTimeout(self.hideMenuTimeOutId_to);
			}
		};
		
		
		
		//########################################//
		/* Get max width and position */
		//#######################################//
		self.getMaxWidthResizeAndPosition = function(){
			
			var button_do;
			var finalX;
			var finalY;
			self.totalWidth = 0;
			self.totalButtonsHeight = 0;
			
			self.totalWidth = self.selector_do.getMaxTextWidth() + 20;
			
			for(var i=0; i<self.totalButtons; i++){
				button_do = self.buttons_ar[i];
				if(button_do.getMaxTextWidth() > self.totalWidth) self.totalWidth = button_do.getMaxTextWidth();
			};
			
			for(var i=0; i<self.totalButtons; i++){
				button_do = self.buttons_ar[i];
				button_do.setY((i * (button_do.totalHeight + self.sapaceBetweenButtons)));
				button_do.totalWidth =  self.totalWidth;
				button_do.setWidth(self.totalWidth);
				button_do.centerText();
			}
			
			self.totalButtonsHeight = button_do.getY() + button_do.totalHeight;
			
			self.setWidth(self.totalWidth);
			self.setHeight(self.buttonHeight);
			self.mainButtonsHolder_do.setWidth(self.totalWidth);
			self.selector_do.totalWidth =  self.totalWidth;
			self.selector_do.setWidth(self.totalWidth);
			self.selector_do.centerText();
			self.buttonsHolder_do.setWidth(self.totalWidth);
			self.buttonsHolder_do.setHeight(self.totalButtonsHeight);
			self.hide(false, true);
		};
		
		//#####################################//
		/* disable or enable buttons based on id */
		//####################################//
		this.setButtonsState = function(){
			var button_do;
			for(var i=0; i<self.totalButtons; i++){
				button_do = self.buttons_ar[i];
				if(i ==  self.curId){
					button_do.disable(true);
				}else{
					button_do.enable(true);
				}
			}
		};
		
		//######################################//
		/* position */
		//######################################//
		this.position = function(){
			if(self.position_str == "topleft"){
				self.finalX = self.horizontalMargins;
				self.finalY = self.verticalMargins;
			}else if(self.position_str == "topright"){
				self.finalX = parent.stageWidth - self.totalWidth - self.horizontalMargins;
				self.finalY = self.verticalMargins;
			}
			self.setX(self.finalX);
			self.setY(self.finalY);	
		};
		
		//#####################################//
		/* hide / show */
		//####################################//
		this.showFirstTime = function(){
			self.setVisible(true);
			if(self.position_str == "topleft" || self.position_str == "topright"){
				self.mainHolder_do.setY( -(self.verticalMargins + self.buttonHeight));
			}
			self.getStyle().boxShadow = "0px 0px 3px " + self.shadowColor_str;
			FWDAnimation.to(self.mainHolder_do, .8, {y:0, ease:Expo.easeInOut});	
		};
		
		this.hide = function(animate, overwrite){
			if(!self.isShowed_bl && !overwrite) return;
			FWDAnimation.killTweensOf(this);
			self.isShowed_bl = false;
			
			if(self.borderRadius != 0){
				self.selector_do.bk_sdo.getStyle().borderBottomLeftRadius = self.borderRadius + "px";
				self.selector_do.bk_sdo.getStyle().borderBottomRightRadius = self.borderRadius + "px";
			}
			
			if(animate){
				FWDAnimation.to(self.buttonsHolder_do, .6, {y:- self.totalButtonsHeight, ease:Expo.easeInOut});	
				FWDAnimation.to(self.mainButtonsHolder_do, .6, {h:0, ease:Expo.easeInOut});	
				FWDAnimation.to(self, .6, {h:self.buttonHeight, ease:Expo.easeInOut});	
			}else{
				self.buttonsHolder_do.setY(self.buttonHeight - self.totalButtonsHeight);
				self.mainButtonsHolder_do.setHeight(0);
				self.setHeight(self.buttonHeight);
			}
		};

		this.show = function(animate, overwrite){
			if(self.isShowed_bl && !overwrite) return;
			FWDAnimation.killTweensOf(this);
			self.isShowed_bl = true;
			
			if(self.borderRadius != 0){
				self.selector_do.bk_sdo.getStyle().borderBottomLeftRadius = 0 + "px";
				self.selector_do.bk_sdo.getStyle().borderBottomRightRadius = 0 + "px";
			}
			
			if(animate){
				FWDAnimation.to(self.buttonsHolder_do, .6, {y:0, ease:Expo.easeInOut});
				FWDAnimation.to(self.mainButtonsHolder_do, .6, {h:self.totalButtonsHeight + self.buttonHeight, ease:Expo.easeInOut});	
				FWDAnimation.to(self, .6, {h:self.totalButtonsHeight + self.buttonHeight, ease:Expo.easeInOut});	
			}else{
				self.buttonsHolder_do.setY(self.buttonHeight);
				self.mainButtonsHolder_do.setHeight(self.buttonHeight + self.buttonHeight);
				self.setHeight(self.buttonHeight + self.buttonHeight);
			}
		};
		
		this.init();
	};
	
	/* set prototype */
	FWDIGPComboBox.setPrototype =  function(){
		FWDIGPComboBox.prototype = new FWDRLDisplayObject("div");
	};


	FWDIGPComboBox.HIDE_COMPLETE = "infoWindowHideComplete";
	FWDIGPComboBox.BUTTON_PRESSED = "buttonPressed";

	FWDIGPComboBox.prototype = null;
	window.FWDIGPComboBox = FWDIGPComboBox;
	
}(window));