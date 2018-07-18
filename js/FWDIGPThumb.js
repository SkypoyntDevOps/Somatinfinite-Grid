/* FWDIGPThumb */
(function (window){
	
	var FWDIGPThumb = function(
			parent,
			transitionType_str,
			backgroundColor, 
			thumbnailOverlayBackgroundColor,
			thumbnailOverlayOpacity, 
			hasOverlay_bl, 
			isMobile_bl,
			hasIcon_bl,
			disableThumbnailInteractivity_bl){
		
		var self = this;
		var prototype = FWDIGPThumb.prototype;
		
		this.parent = parent;
		this.background_do = null;
		this.smallImage_do = null;
		this.overlay_do = null;
		
		this.smallImage_img;
		this.icon_img;
		
		this.transitionType_str = transitionType_str;
		this.backgroundColor_str = backgroundColor;
		this.thumbnailOverlayBackgroundColor_str = thumbnailOverlayBackgroundColor;
		this.thumbPath_str;
		this.iconPath_str;
		this.animStartDir_str;

		this.totalW = 0;
		this.totalH = 0;
		this.imageFinalWidth = 0;
		this.imageFinalHeight = 0;
		this.finalX;
		this.finalY;
		this.imageFinalX = 0;
		this.imageFinalY = 0;
		this.smallImageOriginalW = 0;
		this.smallImageOriginalH = 0;
		this.iconW = 37;
		this.iconH = 32;
		this.overlayOpacity = thumbnailOverlayOpacity;
		this.gridPosition;
		
		this.isVisited_bl = false;
		this.checkHitId_int;
		this.addDelay_bl;
		this.loadTimeOutId_to;
		this.startSelectedStateId_to;
		this.isMobile_bl = isMobile_bl;
		this.hasPointerEvent_bl = FWDRLUtils.hasPointerEvent;
		this.isSmallImageLoaded_bl = false;
		this.hasOverlay_bl = hasOverlay_bl;
		this.hasIcon_bl = hasIcon_bl;
		this.hasIconAdded_bl = false;
		this.isAvailable_bl = true;
		this.isNormalState_bl = false;
		this.isMouseDown_bl = false;
		this.isTweeninigOnHide_bl = false;
		this.disableThumbnailInteractivity_bl = disableThumbnailInteractivity_bl;
	
		this.init = function(){
			if(this.disableThumbnailInteractivity_bl){
				this.hasOverlay_bl = false;
				this.hasIcon_bl = false;
			}
			if(this.isMobile_bl) this.hasIcon_bl = false;
			
			this.smallImage_img = new Image();
			if(this.hasIcon_bl) this.icon_img = new Image();;
			this.setupOverlay();
			this.addEvents();
			if(FWDRLUtils.isAndroid) self.setBackfaceVisibility();
		};
		
		//####################################//
		/* setup background */
		//####################################//
		this.setupOverlay = function(){
			this.setBkColor(this.backgroundColor_str);
			
			this.smallImage_do = new FWDRLDisplayObject("img");
			
			if(this.hasOverlay_bl){ 
				this.overlay_do = new FWDRLDisplayObject("div");
				this.overlay_do.setBkColor(self.thumbnailOverlayBackgroundColor_str);
				this.overlay_do.setAlpha(0);
				this.overlay_do.setVisible(false);
				this.addChild(self.overlay_do);
			}
		};
		
		//####################################//
		/* add interaction events */
		//###################################//
		this.addEvents = function(){
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerUp", self.onMouseClickHandler);
				}
				self.screen.addEventListener("touchend", self.onMouseClickHandler);
			}else if(self.screen.addEventListener){
				self.screen.addEventListener("mouseover", self.onMouseOverHandler);
				self.screen.addEventListener("click", self.onMouseClickHandler);
			}else if(self.screen.attachEvent){
				self.screen.attachEvent("onmouseover", self.onMouseOverHandler);
				self.screen.attachEvent("onclick", self.onMouseClickHandler);
			}
		};
		
		this.onMouseOverHandler = function(e){
			if(!self.isNormalState_bl) return;
			self.setSelectedState(e);
			self.dispatchEvent(FWDIGPThumb.MOUSE_OVER, {gridPosition:self.gridPosition});
			self.isNormalState_bl = false;
		};
		
		this.onMouseClickHandler = function(e){
			if(self.disableThumbnailInteractivity_bl 
			   || !self.isSmallImageLoaded_bl
			   || self.smallImage_do.x != self.imageFinalX
			   || self.smallImage_do.y != self.imageFinalY) return;
			self.dispatchEvent(FWDIGPThumb.MOUSE_UP, {id:self.id});
		};
	
	
		//####################################//
		/* resize thumb / image */
		//####################################//
		this.resizeThumb = function(animate){
			this.setWidth(this.totalW);
			this.setHeight(this.totalH);
			if(this.background_do){
				this.background_do.setWidth(this.totalW + 2);
				this.background_do.setHeight(this.totalH + 2);
			}
			if(this.overlay_do){
				this.overlay_do.setX(-1);
				this.overlay_do.setY(-1);
				this.overlay_do.setWidth(this.totalW + 2);
				this.overlay_do.setHeight(this.totalH + 2);
			}
		};
		
		this.resizeImage = function(){
			var scaleX = this.totalW/this.smallImageOriginalW;
			var scaleY = this.totalH/this.smallImageOriginalH;
			var totalScale = 0;
			
			if(scaleX >= scaleY){
				totalScale = scaleX;
			}else if(scaleX <= scaleY){
				totalScale = scaleY;
			}
				
			this.imageFinalWidth = Math.round((this.smallImageOriginalW * totalScale) + 2);
			this.imageFinalHeight = Math.round((this.smallImageOriginalH * totalScale) + 2);
			this.imageFinalX = Math.round((this.totalW -  this.imageFinalWidth)/2);
			this.imageFinalY = Math.round((this.totalH -  this.imageFinalHeight)/2);
		
			this.smallImage_do.setX(this.imageFinalX);
			this.smallImage_do.setY(this.imageFinalY);
			this.smallImage_do.setWidth(this.imageFinalWidth);
			this.smallImage_do.setHeight(this.imageFinalHeight);
		};
		
		//####################################//
		/* add image */
		//####################################//
		this.show = function(thumbPath, addDelay){	
			//console.log("load " + self.id);
			this.isNormalState_bl = true;
			this.thumbPath_str = thumbPath;
			this.addDelay_bl = !addDelay;
		
			FWDAnimation.killTweensOf(this);
			this.setAlpha(0);
			clearTimeout(this.loadTimeOutId_to);
			if(this.addDelay_bl){
				this.loadTimeOutId_to = setTimeout(this.startToLoadSmallImage,.5 + Math.random() * 400);
			}else{
				this.loadTimeOutId_to = setTimeout(this.startToLoadSmallImage, Math.random() * 400);
			}
		
			if(this.hasOverlay_bl){
				this.overlay_do.setBkColor(self.thumbnailOverlayColor_str);
			}
			
			if(this.hasIcon_bl){
				this.icon_img.src = this.iconPath_str;
				if(!this.icon_do){
					if(this.hasTransform2d_bl || (FWDRLUtils.isIE && !FWDRLUtils.isIEAndLessThen9)){
						this.icon_do = new FWDRLTransformDisplayObject("img");
					}else{
						this.icon_do = new FWDRLDisplayObject("img");
					}
				}
				
				
				this.icon_do.setScreen(this.icon_img);
				
				this.icon_do.setWidth(this.iconW);
				this.icon_do.setHeight(this.iconH);
				
				this.icon_do.setVisible(false);
				this.icon_do.setAlpha(0);
				if(!this.contains(this.icon_do)) this.addChild(this.icon_do);
			}
		};
		
		this.startToLoadSmallImage = function(){
			self.smallImage_img.onload = self.onSmallImageLoad;
			self.smallImage_img.src = self.thumbPath_str;
		};
		
		this.onSmallImageLoad = function(){
			var dl = self.addDelay_bl == true ? .2 : 0;
			var alpha = self.isVisited_bl == true ? .3 : 1;
			self.smallImageOriginalW = self.smallImage_img.width;
			self.smallImageOriginalH = self.smallImage_img.height;
			
			self.smallImage_do.setScreen(self.smallImage_img);
			self.resizeImage();
			
			FWDAnimation.to(self, .3, {alpha:1, delay:dl +  Math.random() * .6});
			self.smallImage_do.setAlpha(0);
		
			if(self.transitionType_str == "motion"){
				var dir = Math.round(Math.random() * 3);
				if(dir == 0){
					self.smallImage_do.setX(-self.imageFinalWidth);
					FWDAnimation.to(self.smallImage_do, .8, {x:self.imageFinalX, alpha:alpha, delay:dl +  Math.random() * .5, ease:Expo.easeInOut});
				}else if(dir == 1){
					self.smallImage_do.setX(self.imageFinalWidth);
					FWDAnimation.to(self.smallImage_do, .8, {x:self.imageFinalX, alpha:alpha, delay:dl +  Math.random()  * .5, ease:Expo.easeInOut});
				}else if(dir == 2){
					self.smallImage_do.setY(self.imageFinalHeight);
					FWDAnimation.to(self.smallImage_do, .8, {y:self.imageFinalY, alpha:alpha, delay:dl +  Math.random()  * .5, ease:Expo.easeInOut});
				}else if(dir == 3){
					self.smallImage_do.setY(-self.imageFinalHeight);
					FWDAnimation.to(self.smallImage_do, .8, {y:self.imageFinalY, alpha:alpha, delay:dl +  Math.random()  * .5, ease:Expo.easeInOut});
				}
			}else{
				FWDAnimation.to(self.smallImage_do, .5, {alpha:alpha, delay:Math.random()});
				if(self.isVisited_bl) self.setToIsVisited(true);
			}
			
			if(!self.contains(self.smallImage_do)){
				self.addChildAt(self.smallImage_do, 0);
			}
			
			self.isSmallImageLoaded_bl = true;
		};
		
		this.hide = function(){
			self.isTweeninigOnHide_bl = true;
			
			clearTimeout(self.loadTimeOutId_to);
			self.smallImage_img.onload = null;
			FWDAnimation.killTweensOf(self);
			FWDAnimation.killTweensOf(self.smallImage_do);
			
			if(self.transitionType_str == "motion"){
				var dir = Math.round(Math.random() * 3);
				if(dir == 0){
					FWDAnimation.to(self.smallImage_do, .8, {x:-self.imageFinalWidth, delay:Math.random(), ease:Expo.easeInOut});
					FWDAnimation.to(self, .6, {alpha:0, delay:.3 + Math.random() * .4, onComplete:self.hideComplete});
				}else if(dir == 1){
					FWDAnimation.to(self.smallImage_do, .8, {x:self.imageFinalWidth, delay:Math.random(), ease:Expo.easeInOut});
					FWDAnimation.to(self, .6, {alpha:0, delay:.3 + Math.random() * .4, onComplete:self.hideComplete});
				}else if(dir == 2){
					FWDAnimation.to(self.smallImage_do, .8, {y:-self.imageFinalHeight, delay:Math.random(), ease:Expo.easeInOut});
					FWDAnimation.to(self, .6, {alpha:0, delay:.3 + Math.random() * .4, onComplete:self.hideComplete});
				}else if(dir == 3){
					FWDAnimation.to(self.smallImage_do, .8, {y:self.imageFinalHeight, delay:Math.random(), ease:Expo.easeInOut});
					FWDAnimation.to(self, .6, {alpha:0, delay:.3 + Math.random() * .4, onComplete:self.hideComplete});
				}
			}else{
				FWDAnimation.to(self.smallImage_do, .6, {alpha:0, delay:Math.random() * .4});
				FWDAnimation.to(self, .6, {alpha:0, delay:.3 + Math.random() * .4, onComplete:self.hideComplete});
			}
		};
		
		this.hideComplete = function(){
			self.removeImage();
			self.isTweeninigOnHide_bl = false;
		};
		
		this.setToIsVisited = function(overwrite){
			if(!self.isSmallImageLoaded_bl && !overwrite) return;
			var dl = self.isSmallImageLoaded_bl ? 0 :  Math.random();
			if(self.transitionType_str == "motion") dl = 0;
			if(self.transitionType_str != "motion") FWDAnimation.killTweensOf(this.smallImage_do);
			FWDAnimation.to(this.smallImage_do, .5, {alpha:.3, delay:dl});
		};
		
		//################################//
		/* remove image */
		//################################//
		this.removeImage = function(){	
			clearTimeout(this.loadTimeOutId_to);
			if(this.smallImage_img){
				//console.log("remove " + self.id);
				this.smallImage_img.removeAttribute("width");
				this.smallImage_img.removeAttribute("height");
				this.smallImage_img.onload = null;
				try{
					FWDAnimation.killTweensOf(this.smallImage_do);
					this.smallImage_do.screen.src = "";
					//if(this.contains(this.smallImage_do) && FWDRLUtils.isFirefox || this.isMobile_bl) 
					this.smallImage_do.set(-500);
					this.removeChild(this.smallImage_do);
				}catch(e){}
				
			}
			this.isVisited_bl = false;
			this.isSmallImageLoaded_bl = false;
			this.isNormalState_bl = true;
			this.setNormalState(false);
		};
		
		
		//################################//
		/* set normal / selected state */
		//################################//	
		this.setNormalState = function(animate){
			this.hideOverlay(animate);
			this.hideSmallIcon(animate);
		};
		
		this.setSelectedState = function(e){
			this.showOverlay();
			this.showSmallIcon();
			if(!this.disableThumbnailInteractivity_bl || this.isVisited_bl){
				this.addMouseMoveAnimCheck();
				this.startToCheckHit();
			}
		};
		
		this.addMouseMoveAnimCheck = function(){
			if(window.addEventListener){
				window.addEventListener("mousemove", this.setGlobalMousePositionOnMouseMoveHandler);
			}else{
				document.detachEvent("onmousemove", this.setGlobalMousePositionOnMouseMoveHandler);
				document.attachEvent("onmousemove", this.setGlobalMousePositionOnMouseMoveHandler);
			};
		};
		
		this.removeMouseMoveAnimCheck = function(){
			if(window.removeEventListener){
				window.removeEventListener("mousemove", this.setGlobalMousePositionOnMouseMoveHandler);
			}else{
				document.detachEvent("onmousemove", this.setGlobalMousePositionOnMouseMoveHandler);
			};
		};
		
		this.setGlobalMousePositionOnMouseMoveHandler = function(e){
			var vpc = FWDRLUtils.getViewportMouseCoordinates(e);
			self.globalX = vpc.screenX;
			self.globalY = vpc.screenY;
			self.checkHitHandler();
		};
		
		this.startToCheckHit = function(){
			clearInterval(this.checkHitId_int);
			this.checkHitId_int = setInterval(this.checkHitHandler, 100);
		};
		
		this.stopHitTest = function(){
			clearInterval(self.checkHitId_int);
			self.isNormalState_bl = true;
		};
		
		this.checkHitHandler = function(){
			var rect = self.screen.getBoundingClientRect();
			var x = self.globalX;
			var y = self.globalY;
			
			if(!FWDRLUtils.hitTest(self.screen, self.globalX, self.globalY)){
				self.setNormalState(true);
			}
		
			if(self.parent.rect &&!(x >= self.parent.rect.left && x <= self.parent.rect.left +(self.parent.rect.right - self.parent.rect.left) 
				&& y >= self.parent.rect.top && y <= self.parent.rect.top + (self.parent.rect.bottom - self.parent.rect.top))){
				self.setNormalState(true);
			}
		};
		
		//###################################//
		/* Show / hide overlay */
		//###################################//
		this.showOverlay = function(e){
			
			if(self.isVisited_bl){
				//FWDAnimation.killTweensOf(self.smallImage_do);
				FWDAnimation.to(self.smallImage_do, .8, {alpha:1, ease:Expo.easeOut});
				return;
			}
			
			if(!this.hasOverlay_bl) return;
			this.overlay_do.setVisible(true);
			if(this.overlay_do){		
				FWDAnimation.killTweensOf(self.overlay_do);
				if(FWDRLUtils.isFirefox){
					FWDAnimation.to(self.overlay_do, .8, {alpha:this.overlayOpacity, delay:.1, ease:Expo.easeOut});
				}else{
					FWDAnimation.to(self.overlay_do, .8, {alpha:this.overlayOpacity, ease:Expo.easeOut});
				}
			}
		};
		
		this.hideOverlay = function(animate){
			this.removeMouseMoveAnimCheck();
			this.stopHitTest();
	
			
			if(self.isVisited_bl){
				//FWDAnimation.killTweensOf(self.smallImage_do);
				FWDAnimation.to(self.smallImage_do, .8, {alpha:.3, ease:Expo.easeOut});
			}
			
			FWDAnimation.killTweensOf(this.overlay_do);
			if(this.overlay_do && animate){
				FWDAnimation.to(this.overlay_do, .8, {alpha:0, onComplete:this.overlayHideComplete, ease:Expo.easeOut});
			}else if(this.overlay_do){
				this.overlay_do.setAlpha(0);
				this.overlayHideComplete();
			}
		};
		
		this.overlayHideComplete = function(){
			self.overlay_do.setVisible(false);
		};
		
			
		//###################################//
		/* add / remove icon image */
		//###################################//
		this.showSmallIcon = function(){
			if(!this.hasIcon_bl) return;
			if(this.hasIconAdded_bl) return;
			
			this.icon_do.setVisible(true);
			this.icon_do.setAlpha(0);
			
			if(this.icon_do.hasTransform2d_bl){
				this.icon_do.setScale2(1/self.parent.scale);
			}
		
			this.icon_do.setX(parseInt((this.totalW - 80)/2));
			this.icon_do.setY(parseInt((this.totalH - 80)/2));
			this.icon_do.setWidth(80);
			this.icon_do.setHeight(80);	
			
			FWDAnimation.killTweensOf(this.icon_do);
			FWDAnimation.to(this.icon_do, .5, {alpha:1, 
				x:parseInt((this.totalW - this.iconW)/2), 
				y:parseInt((this.totalH - this.iconH)/2), 
				w:this.iconW, 
				h:this.iconH,
				delay:.1, ease:Expo.easeInOut});
			
			this.hasIconAdded_bl = true;
		};
		
		this.hideSmallIcon = function(animate){
			if(!this.hasIcon_bl) return;
			if(!this.hasIconAdded_bl) return;
			FWDAnimation.killTweensOf(this.icon_img);
			FWDAnimation.killTweensOf(this.icon_do);
			if(animate){
				FWDAnimation.to(this.icon_do, .4, {alpha:0, onComplete:function(){self.icon_do.setVisible(false);}});
			}else{
				self.icon_do.setAlpha(0);
			}
			
			this.hasIconAdded_bl = false;
		};
		
		this.scaleSmallIconOnTween = function(){
			if(self.icon_do) FWDAnimation.to(this.icon_do, .6, {scale:1/self.parent.scale, ease:Quint.easeOut});
		};
		
	
		//#########################################//
		/* clean main events */
		//########################################//
		this.cleanMainEvents = function(){
			clearTimeout(this.loadTimeOutId_to);
			clearInterval(this.checkHitId_int);
			
		};
		
		//##########################################//
		/* destroy */
		//#########################################//
		this.destroy = function(){
			
			this.cleanMainEvents();
			
			if(this.background_do){
				FWDAnimation.killTweensOf(this.background_do);
				this.background_do.destroy();
			}
			
			if(this.smallImage_do){
				FWDAnimation.killTweensOf(this.smallImage_do);
				this.smallImage_do.disposeImage();
				this.smallImage_do.destroy();	
			}
			
			if(this.overlay_do){
				FWDAnimation.killTweensOf(this.overlay_do);
				this.overlay_do.destroy();
			}
			
			if(this.smallImage_img){
				this.smallImage_img.onload = null;
			}
			
			if(this.icon_img){
				FWDAnimation.killTweensOf(this.icon_img);
				this.icon_img.src = null;
			}
			
			this.parent = null;
			this.smallImage_img = null;
			this.icon_img = null;
			this.background_do = null;
			this.smallImage_do = null;
			this.overlay_do = null;
			
			this.backgroundColor_str = null;
			this.thumbPath_str = null;
			this.iconPath_str = null;
			
			parent = null;
			
			this.setInnerHTML("");
			prototype.destroy();
			self = null;
			FWDIGPThumb.prototype = null;
		};
		
		this.init();
	};
	
	
	/* set prototype */
	FWDIGPThumb.setPrototype = function(){
		FWDIGPThumb.prototype = new FWDRLDisplayObject("div");
	};
	
	FWDIGPThumb.MOUSE_OVER = "onMouseOver";
	FWDIGPThumb.MOUSE_OUT = "onMouseOut";
	FWDIGPThumb.MOUSE_UP = "onMouseDown";
	FWDIGPThumb.RIGHT = "right";
	FWDIGPThumb.LEFT = "left";
	FWDIGPThumb.BOTTOM = "bottom";
	FWDIGPThumb.TOP = "top";
	
	FWDIGPThumb.prototype = null;
	window.FWDIGPThumb = FWDIGPThumb;
}(window));