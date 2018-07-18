/* Thumb */
(function (window){
	
	var FWDNavigationHelpScreen = function(
			parent,
			backgroundImage_img,
			closeButtonN_img,
			closeButtonSPath_str,
			bkColor,
			bkOpacity
		){
		
		var self  = this;
		var prototype = FWDNavigationHelpScreen.prototype;
	
		this.backgroundImage_img = backgroundImage_img;
		this.closeButtonN_img = closeButtonN_img;
		
		this.parent = parent;
		this.helpScreen_do = null;
		this.closeButton_do = null;
		this.bk_do;
		
		this.closeButtonSPath_str = closeButtonSPath_str;
		this.bkColor_str = bkColor;
		
		this.stageWidth;
		this.stageHeight;
		this.bkOpacity = bkOpacity;
	
		this.isShowed_bl = false;

			//###################################//
		/* init */
		//###################################//
		this.init = function(){
			this.bk_do = new FWDRLDisplayObject("div");
			this.bk_do.screen.onclick = self.closeButtonMouseUpHandler;
			this.bk_do.setBkColor(this.bkColor_str);
			
			this.helpScreen_do = new FWDRLDisplayObject("img");
			this.helpScreen_do.setScreen(this.backgroundImage_img);
			
			this.addChild(this.bk_do);
			this.addChild(this.helpScreen_do);
			
			this.setX(-5000);
			this.setupCloseButton();
			setTimeout(this.hideAndShow, 800);
		};
		
		//#####################################//
		/* position */
		//#####################################//
		this.resizeAndPosition = function(){
			this.stageWidth = this.parent.stageWidth;
			this.stageHeight = this.parent.stageHeight;
			FWDAnimation.killTweensOf(this.helpScreen_do);
			this.helpScreen_do.setX(parseInt((this.stageWidth - this.helpScreen_do.w)/2));
			this.helpScreen_do.setY(parseInt((this.stageHeight - this.helpScreen_do.h)/2));
			FWDAnimation.killTweensOf(this.closeButton_do);
			this.closeButton_do.setX(parseInt((this.stageWidth - this.helpScreen_do.w)/2)  + this.helpScreen_do.w - this.closeButton_do.w - 3);
			this.closeButton_do.setY(parseInt((this.stageHeight - this.helpScreen_do.h)/2)  + this.helpScreen_do.h - this.closeButton_do.h - 5);
			this.bk_do.setWidth(this.stageWidth);
			this.bk_do.setHeight(this.stageHeight);
			this.setX(0);
			this.setY(0);
			this.setWidth(this.stageWidth);
			this.setHeight(this.stageHeight);
		};
		
		//#############################################//
		/* setup close button */
		//#############################################//
		this.setupCloseButton = function(){
			FWDRLSimpleButton.setPrototype();
			this.closeButton_do = new FWDRLSimpleButton(this.closeButtonN_img, this.closeButtonSPath_str);
			this.closeButton_do.setX(264);
			this.closeButton_do.addListener(FWDRLSimpleButton.MOUSE_UP, this.closeButtonMouseUpHandler);
			this.addChild(this.closeButton_do);
		};
			
		this.closeButtonMouseUpHandler = function(e){
			self.bk_do.screen.onclick = null;
			self.closeButton_do.disableForGood();
			self.hide(true);
		};
	
		//###################################//
		/* show / hide preloader animation */
		//###################################//
		this.hideAndShow = function(){
			self.resizeAndPosition();
			self.hide(false, true);
			self.show(true);
		};
		
		this.show = function(){
			if(this.isShowed_bl) return;
			this.setVisible(true);
			FWDAnimation.killTweensOf(this.helpScreen_do);
			FWDAnimation.killTweensOf(this.closeButton_do);
			
			FWDAnimation.to(this.helpScreen_do, .8, {
				x:parseInt((this.stageWidth - self.helpScreen_do.w)/2),
				delay:.5, 
				ease:Expo.easeInOut});
			
			FWDAnimation.to(this.closeButton_do, .8, {
				x:parseInt((this.stageWidth - this.helpScreen_do.w)/2)  + this.helpScreen_do.w - this.closeButton_do.w - 3,
				delay:.7, 
				ease:Expo.easeInOut});
			
			FWDAnimation.to(this.bk_do, .8, {
				alpha:this.bkOpacity,
				delay:.7});
			
			this.isShowed_bl = true;
		};
		
		this.hide = function(animate, overwrite){
			if(!this.isShowed_bl && !overwrite) return;
			FWDAnimation.killTweensOf(this.helpScreen_do);
			FWDAnimation.killTweensOf(this.closeButton_do);
			if(animate){
				FWDAnimation.to(this.helpScreen_do, .8, {
					x:-this.helpScreen_do.w, 
					ease:Expo.easeInOut});
				
				FWDAnimation.to(this.closeButton_do, .8, {
					x:-this.closeButton_do.w, 
					delay:.2,
					ease:Expo.easeInOut, 
					onComplete:this.onHideComplete});
			
				FWDAnimation.to(this.bk_do, .8, {
					alpha:0});
			}else{
				this.helpScreen_do.setX(this.stageWidth);
				this.closeButton_do.setX(this.stageWidth);
				this.bk_do.setAlpha(0);
			}
			this.isShowed_bl = false;
		};
		
		this.onHideComplete = function(){
			self.backgroundImage_img.onload = null;
			self.backgroundImage_img.onerror = null;
			self.backgroundImage_img.src = "";
			self.screen.parentNode.removeChild(self.screen);
		};
		
		this.init();
	};
	
	/* set prototype */
    FWDNavigationHelpScreen.setPrototype = function(){
    	FWDNavigationHelpScreen.prototype = new FWDRLDisplayObject("div");
    };
    
    FWDNavigationHelpScreen.HIDE_COMPLETE = "hideComplete";
    
    FWDNavigationHelpScreen.prototype = null;
	window.FWDNavigationHelpScreen = FWDNavigationHelpScreen;
}(window));