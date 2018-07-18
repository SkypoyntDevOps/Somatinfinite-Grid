/* Gallery */
(function (window){
	
	var FWDIGP = function(props_obj){
		
		var self = this;
		
		self.mainFolderPath_str = props_obj.mainFolderPath;
		if((self.mainFolderPath_str.lastIndexOf("/") + 1) != self.mainFolderPath_str.length){
			self.mainFolderPath_str += "/";
		}
		
		this.skinPath_str = props_obj.skinPath;
		if((self.skinPath_str.lastIndexOf("/") + 1) != self.skinPath_str.length){
			self.skinPath_str += "/";
		}
		
		this.warningIconPath_str = self.mainFolderPath_str + this.skinPath_str + "main_skin/warning.png";
		
		/* init gallery */
		this.init = function(){
			
			FWDTweenLite.ticker.useRAF(false);
			this.props_obj = props_obj;
			this.listeners = {events_ar:[]};
			
			this.mustHaveHolderDiv_bl = false;
			this.instanceName_str = this.props_obj.instanceName;
			
			this.displayType = props_obj.displayType || FWDIGP.RESPONSIVE;
			this.displayType = this.displayType.toLowerCase();
			
			if(self.displayType.toLowerCase() != FWDIGP.RESPONSIVE 
			   && self.displayType.toLowerCase() != FWDIGP.FULL_SCREEN
			   && self.displayType.toLowerCase() != FWDIGP.FLUID_WIDTH
			   && self.displayType.toLowerCase() != FWDIGP.AFTER_PARENT){
				this.displayType = FWDIGP.RESPONSIVE;
			}
			
			if(!this.props_obj.instanceName){
				alert("FWDIGP instance name is required please make sure that the instanceName parameter exsists and it's value is uinique.");
				return;
			}
			
			if(window[this.instanceName_str]){
				alert("FWDIGP instance name " + this.instanceName_str +  " is already defined and contains a different instance reference, set a different instance name.");
				return;
			}else{
				window[this.instanceName_str] = this;
			}
		
			if(!this.props_obj){
				alert("FWDIGP constructor properties object is not defined!");
				return;
			}
			
			if(this.displayType != FWDIGP.FULL_SCREEN) this.mustHaveHolderDiv_bl = true;
			
			if(!this.props_obj.parentId && this.mustHaveHolderDiv_bl){		
				alert("Property parentId is not defined in the FWDIGP constructor, self property represents the div id into which the megazoom is added as a child!");
				return;
			}
			
			if(this.mustHaveHolderDiv_bl && !FWDRLUtils.getChildById(self.props_obj.parentId)){
				alert("FWDIGP parent div is not found, please make sure that the div exsists and the id is correct! " + self.props_obj.parentId);
				return;
			}
		
			this.body = document.getElementsByTagName("body")[0];
			this.stageContainer = null;
			
			if(this.displayType == FWDIGP.FULL_SCREEN || this.displayType == FWDIGP.FLUID_WIDTH){
				this.stageContainer = self.body;
			}else{	
				this.stageContainer = FWDRLUtils.getChildById(this.props_obj.parentId);
			}
			
			this.refDiv = FWDRLUtils.getChildById(this.props_obj.parentId);
			this.customContextMenu;
			this.info_do;
			this.main_do;
			this.preloader_do;
			this.thumbsManager_do;
			this.helpScreen_do;
			this.lighBox_do;
			this.comboBox_do;
			this.rect;
			
			this.backgroundColor_str = this.props_obj.backgroundColor || "transparent";
			this.lightBoxBackgroundColor_str = this.props_obj.lightMainBoxBackgroundColor || "transparent";
			
			this.stageWidth = 0;
			this.stageHeight = 0;
			this.pageXOffset = window.pageXOffset;
			this.pageYOffset = window.pageYOffset;
			this.maxWidth = this.props_obj.maxWidth || 640;
			this.maxHeight = this.props_obj.maxHeight || 380;
			this.playlistId = -1;
			this.zIndex = this.props_obj.zIndex;
			
			this.resizeHandlerId1_to;
			this.resizeHandlerId2_to;
			this.scrollEndId_to;
			this.orientationChangeId_to;
			
			this.orintationChanceComplete_bl = true;
			this.autoScale_bl = self.props_obj.autoScale == "yes" ? true : false;
			this.isMobile_bl = FWDRLUtils.isMobile;
	    	this.hasPointerEvent_bl = FWDRLUtils.hasPointerEvent;
	    	this.isReady_bl = false;
		
			this.setupMainDo();
			this.setupInfo();
			this.setupData();
		};
		
		//#############################################//
		/* setup main do */
		//#############################################//
		this.setupMainDo = function(){
			this.main_do = new FWDRLDisplayObject("div", "relative");
			this.main_do.getStyle().msTouchAction = "none";
			this.main_do.getStyle().webkitTapHighlightColor = "rgba(0, 0, 0, 0)";
			this.main_do.getStyle().webkitFocusRingColor = "rgba(0, 0, 0, 0)";
			this.main_do.getStyle().width = "100%";
			this.main_do.getStyle().height = "100%";
			this.main_do.setBkColor(this.backgroundColor_str);
			if(!FWDRLUtils.isMobile || (FWDRLUtils.isMobile && FWDRLUtils.hasPointerEvent)) this.main_do.setSelectable(false);
			
			this.videoHolder_do = new FWDRLDisplayObject("div");
			this.main_do.addChild(this.videoHolder_do);
			
			if(this.displayType == FWDIGP.FULL_SCREEN || this.displayType == FWDIGP.FLUID_WIDTH ){	
				if(this.displayType == FWDIGP.FULL_SCREEN){
					this.stageContainer.style.overflow = "hidden";
				}
				if(this.zIndex) this.main_do.getStyle().zIndex = this.zIndex;
				this.main_do.getStyle().position = "absolute";
				this.stageContainer.appendChild(this.main_do.screen);
				this.main_do.getStyle().zIndex = "9999999999998";
			}else{
				this.stageContainer.appendChild(this.main_do.screen);
			}	
		
			this.startResizeHandler();
		};
		
		//#############################################//
		/* setup info_do */
		//#############################################//
		this.setupInfo = function(){
			FWDRLInfo.setPrototype();
			self.info_do = new FWDRLInfo(self, self.warningIconPath_str);
		};	
		
		//#############################################//
		/* resize handler */
		//#############################################//
		this.startResizeHandler = function(){
			if(window.addEventListener){
				window.addEventListener("resize", self.onResizeHandler);
				window.addEventListener("scroll", self.onScrollHandler);
				window.addEventListener("orientationchange", self.orientationChange);
			}else if(window.attachEvent){
				window.attachEvent("onresize", self.onResizeHandler);
				window.attachEvent("onscroll", self.onScrollHandler);
			}
			
			self.resizeHandlerId2_to = setTimeout(function(){self.resizeHandler();}, 50);
			if(self.displayType == FWDIGP.FLUID_WIDTH) self.resizeHandlerId1_to = setTimeout(function(){self.resizeHandler(true);}, 800);
		};
		
		this.onResizeHandler = function(e){
			if(self.isMobile_bl){
				clearTimeout(self.resizeHandlerId2_to);
				self.resizeHandlerId2_to = setTimeout(function(){self.resizeHandler();}, 200);
			}else{
				self.resizeHandler();
			}	
		};
		
		self.onScrollHandler = function(e){
			self.scrollHandler();
		};
		
		this.orientationChange = function(){
			if(self.displayType == FWDIGP.FLUID_WIDTH || self.displayType == FWDIGP.FULL_SCREEN){
				self.orintationChanceComplete_bl = false;
				
				clearTimeout(self.scrollEndId_to);
				clearTimeout(self.resizeHandlerId2_to);
				clearTimeout(self.orientationChangeId_to);
				
				self.orientationChangeId_to = setTimeout(function(){
					self.orintationChanceComplete_bl = true; 
					self.resizeHandler();
					}, 1000);
				
				self.main_do.setX(-5000);
			}
		};
		
		//##########################################//
		/* resize and scroll handler */
		//##########################################//
		self.scrollHandler = function(){
			if(!self.orintationChanceComplete_bl) return;
			self.scrollOffsets = FWDRLUtils.getScrollOffsets();
		
			self.pageXOffset = self.scrollOffsets.x;
			self.pageYOffset = self.scrollOffsets.y;
			
			if(self.isFullScreen_bl || self.displayType == FWDIGP.FULL_SCREEN){	
				self.main_do.setX(self.pageXOffset);
				self.main_do.setY(self.pageYOffset);
			}else if(self.displayType == FWDIGP.FLUID_WIDTH){	
				if(self.isMobile_bl){
					clearTimeout(self.scrollEndId_to);
					self.scrollEndId_to = setTimeout(self.resizeHandler, 200);		
				}else{
					self.main_do.setX(self.pageXOffset);
				}
				self.main_do.setY(Math.round(self.refDiv.getBoundingClientRect().top + self.pageYOffset));
			}
			self.globalX = self.main_do.getGlobalX();
			self.globalY = self.main_do.getGlobalY();
			if(self.thumbsManager_do) self.thumbsManager_do.setRect();
		};
		
		this.resizeHandler = function(overwrite){
			if(!self.orintationChanceComplete_bl) return;
			
			self.scrollOffsets = FWDRLUtils.getScrollOffsets();
			var viewportSize = FWDRLUtils.getViewportSize();
			var scale;
		
			self.pageXOffset = self.scrollOffsets.x;
			self.pageYOffset = self.scrollOffsets.y;
			
			if(self.displayType == FWDIGP.FLUID_WIDTH){
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
				if (self.autoScale_bl){
					scale = Math.min(self.stageWidth/self.maxWidth, 1);
					self.stageHeight = Math.min(parseInt(scale * self.maxHeight), self.maxHeight);
					if(self.stageHeight < 300) self.stageHeight = 300;
					self.refDiv.style.height = self.stageHeight + "px";
				}else{
					self.stageHeight = self.maxHeight;
					self.refDiv.style.height = self.stageHeight + "px";
				}
				self.main_do.setX(self.pageXOffset);
				self.main_do.setY(Math.round(self.refDiv.getBoundingClientRect().top + self.pageYOffset));
			}else if(self.displayType == FWDIGP.RESPONSIVE){
				self.stageContainer.style.width = "100%";
				if(self.stageContainer.offsetWidth > self.maxWidth){
					self.stageContainer.style.width = self.maxWidth + "px";
				}
				self.stageWidth = self.stageContainer.offsetWidth;
				if(self.autoScale_bl){
					self.stageHeight = parseInt(self.maxHeight * (self.stageWidth/self.maxWidth));
				}else{
					self.stageHeight = self.maxHeight;
				}
				self.main_do.setX(0);
				self.main_do.setY(0);
				self.stageContainer.style.height = self.stageHeight + "px";
			}else if(self.displayType == FWDIGP.AFTER_PARENT){
				self.stageWidth = self.stageContainer.offsetWidth;
				self.stageHeight = self.stageContainer.offsetHeight;
			}else if(self.isFullScreen_bl || self.displayType == FWDIGP.FULL_SCREEN){	
				self.main_do.setX(self.scrollOffsets.x);
				self.main_do.setY(self.scrollOffsets.y);
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
			}else{
				self.main_do.setX(0);
				self.main_do.setY(0);
				self.stageWidth = viewportSize.w;
				self.stageHeight = viewportSize.h;
			}
			
			self.main_do.setWidth(self.stageWidth);
			self.main_do.setHeight(self.stageHeight);
			
			
			self.globalX = self.main_do.getGlobalX();
			self.globalY = self.main_do.getGlobalY();
			
			self.positionPreloader();
			if(self.thumbsManager_do){
				self.thumbsManager_do.resizeAndPosition();
				self.thumbsManager_do.setRect();
			}
			if(self.comboBox_do) self.comboBox_do.position();
			if(self.helpScreen_do && self.helpScreen_do.isShowed_bl) self.helpScreen_do.resizeAndPosition();
			
		};
		
		//#############################################//
		/* setup context menu */
		//#############################################//
		this.setupContextMenu = function(){
			this.customContextMenu_do = new FWDRLContextMenu(this.main_do, self.data.rightClickContextMenu_str);
		};
		
		//#############################################//
		/* setup data */
		//#############################################//
		this.setupData = function(){
			FWDIGPData.setPrototype();
			this.data = new FWDIGPData(this.props_obj);
			this.data.addListener(FWDIGPData.PRELOADER_LOAD_DONE, this.onPreloaderLoadDone);
			this.data.addListener(FWDIGPData.LIGHBOX_CLOSE_BUTTON_LOADED, this.onLightBoxCloseButtonLoadDone);
			this.data.addListener(FWDIGPData.LOAD_ERROR, this.dataLoadError);
			this.data.addListener(FWDIGPData.LOAD_DONE, this.dataLoadComplete);
		};
		
		this.onLightBoxCloseButtonLoadDone = function(){
			if(self.displayType == FWDIGP.LIGHTBOX) self.setupLighBoxCloseButton();
		};
		
		this.onPreloaderLoadDone = function(){
			self.setupPreloader();
			self.positionPreloader();
			if(self.displayType == FWDIGP.FULL_SCREEN){
				if(!FWDRLUtils.hasFullScreen) self.data.showFullScreenButton_bl = false;
			}
		};
		
		this.dataLoadError = function(e, text){
			self.main_do.addChild(self.info_do);
			self.info_do.showText(e.text);
		};
		
		this.dataLoadComplete = function(e){
			self.isReady_bl = true;
			self.preloader_do.hide(true);
			self.setupLightBox();
			self.setupThumbsManager();
			if(self.data.showComboBox_bl) self.setupComboBox();
			if(self.data.showHelpScreen_bl) self.setupHelpScreen();
			self.updateCategory(self.data.startAtCategory, true);
			self.main_do.addChild(self.preloader_do);
			if(!self.isMobile_bl) self.setupContextMenu();
			self.dispatchEvent(FWDIGP.READY);
		};
		
		//#############################################//
		/* setup preloader */
		//#############################################//
		this.setupPreloader = function(){
			FWDRLPreloader.setPrototype();
			this.preloader_do = new FWDRLPreloader(this.data.mainPreloader_img, 38, 38, 30, 36);
			this.preloader_do.addListener(FWDRLPreloader.HIDE_COMPLETE, this.onPreloaderHideCompleteHandler);
			this.preloader_do.show(true);
			this.main_do.addChild(this.preloader_do);
		};
		
		this.positionPreloader = function(){
			if(this.preloader_do){
				this.preloader_do.setX(parseInt((this.main_do.getWidth() - this.preloader_do.getWidth())/2));
				this.preloader_do.setY(parseInt((this.main_do.getHeight() - this.preloader_do.getHeight())/2));
			}
		};
		
		this.onPreloaderHideCompleteHandler = function(){
			self.main_do.removeChild(self.preloader_do);
		};
		
		//###########################################//
		/* setup thumbs manager */
		//###########################################//
		this.setupThumbsManager = function(id){	
			FWDIGPThumbsManager.setPrototype();
			this.thumbsManager_do = new FWDIGPThumbsManager(this.data, this);
			this.thumbsManager_do.addListener(FWDIGPThumb.MOUSE_UP, this.onThumbMouseUpHandler);
			this.thumbsManager_do.addListener(FWDIGPThumbsManager.HIDE_HELP_SCREEN, this.onThumbsManagerHideHelpScreenHandler);
			this.main_do.addChild(this.thumbsManager_do);
		};
		
		this.onThumbsManagerLoadError = function(e){
			self.main_do.addChild(self.info_do);
			self.info_do.showText(e.text);
		};
		
		this.onThumbMouseUpHandler = function(e){
			window["rlobj_curObj"] = self.data.lightboxPlaylist_ar[self.playlistId];
			FWDRL.show("rlobj_curObj", e.id);
			window["rlobj_curObj"] = null;
			self.thumbsManager_do.stopToLoop();
		};
		
		this.onThumbsManagerHideHelpScreenHandler = function(){
			if(self.helpScreen_do) self.helpScreen_do.hide(true);
		};
		
		//#############################################//
		/* setup help screen */
		//#############################################//
		this.setupHelpScreen = function(){
			FWDNavigationHelpScreen.setPrototype();
			this.helpScreen_do = new FWDNavigationHelpScreen(
					this,
					this.data.helpScreen_img,
					this.data.okButtonN_img,
					this.data.okButtonSPath_str,
					this.data.helpScreenBackgroundColor_str,
					this.data.helpScreenOpacity
					);
			
			this.helpScreen_do.addListener(FWDNavigationHelpScreen.HIDE_COMPLETE, this.helpScreenHideCompleteHandler);
			this.main_do.addChild(this.helpScreen_do);
		};			
		
		this.helpScreenHideCompleteHandler = function(){
			self.main_do.removeChild(self.helpScreen_do);
			self.helpScreen_do.destroy();
			self.helpScreen_do = null;
		};
		
		//#############################################//
		/* setup combobox */
		//############################################//
		this.setupComboBox = function(){
			FWDIGPComboBox.setPrototype();
			self.comboBox_do = new FWDIGPComboBox(self, {
				upArrowN_img:self.data.comboboxUpArrowN_img,
				upArrowS_img:self.data.comboboxUpArrowS_img,
				categories_ar:self.data.categories_ar,
				selectorLabel:self.data.selectLabel_str,
				position:self.data.comboBoxPosition_str,
				startAtCategory:self.data.startAtCategory,
				comboBoxHorizontalMargins:self.data.comboBoxHorizontalMargins,
				comboBoxVerticalMargins:self.data.comboBoxVerticalMargins,
				comboBoxCornerRadius:self.data.comboBoxCornerRadius,
				selctorBackgroundNormalColor:self.data.selctorBackgroundNormalColor_str,
				selctorBackgroundSelectedColor:self.data.selctorBackgroundSelectedColor_str,
				selctorTextNormalColor:self.data.selctorTextNormalColor_str,
				selctorTextSelectedColor:self.data.selctorTextSelectedColor_str,
				buttonBackgroundNormalColor:self.data.buttonBackgroundNormalColor_str,
				buttonBackgroundSelectedColor:self.data.buttonBackgroundSelectedColor_str,
				buttonTextNormalColor:self.data.buttonTextNormalColor_str,
				buttonTextSelectedColor:self.data.buttonTextSelectedColor_str,
				shadowColor:self.data.comboBoxShadowColor_str
				});
			self.comboBox_do.addListener(FWDIGPComboBox.BUTTON_PRESSED, self.onComboboxButtonPressedHandler);
			self.main_do.addChild(self.comboBox_do);
		};
		
		this.onComboboxButtonPressedHandler = function(e){
			self.updateCategory(e.id);
		};
		
		//#######################################//
		/* Setup lightbox */
		//#######################################//
		this.setupLightBox = function(){
			
			self.lightbox = new FWDRL({	
				//main settings
				mainFolderPath:self.data.mainFolderPath_str,
				skinPath:self.data.lightboxSkinPath_str,
				rightClickContextMenu:self.data.rightClickContextMenu_str,
				buttonsAlignment:self.data.buttonsAlignment_str,
				useDeepLinking:"no",
				useAsModal:"no",
				slideShowAutoPlay:self.data.slideShowAutoPlay_str,
				addKeyboardSupport:self.data.addKeyboardSupport_str,
				showCloseButton:self.data.showCloseButton_str,
				showShareButton:self.data.showShareButton_str,
				showZoomButton:self.data.showZoomButton_str,
				showSlideShowButton:self.data.showSlideShowButton_str,
				showSlideShowAnimation:self.data.showSlideShowAnimation_str,
				showNextAndPrevButtons:self.data.showNextAndPrevButtons_str,
				showNextAndPrevButtonsOnMobile:self.data.showNextAndPrevButtonsOnMobile_str,
				buttonsHideDelay:self.data.buttonsHideDelay,
				slideShowDelay:self.data.slideShowDelay,
				defaultItemWidth:self.data.defaultItemWidth,
				defaultItemHeight:self.data.defaultItemHeight,
				itemOffsetHeight:self.data.itemOffsetHeight,
				spaceBetweenButtons:self.data.spaceBetweenButtons,
				buttonsOffsetIn:self.data.buttonsOffsetIn,
				buttonsOffsetOut:self.data.buttonsOffsetOut,
				itemBorderSize:self.data.itemBorderSize,
				itemBorderRadius:self.data.itemBorderRadius,
				backgroundOpacity:self.data.backgroundOpacity,
				itemBoxShadow:self.data.itemBoxShadow_str,
				itemBackgroundColor:self.data.itemBackgroundColor_str,
				itemBorderColor:self.data.itemBorderColor_str,
				backgroundColor:self.data.lightboxBackgroundColor,
				//thumbnails settings
				showThumbnails:"no",
				showThumbnailsHideOrShowButton:"yes",
				showThumbnailsByDefault:"yes",
				showThumbnailsOverlay:"yes",
				showThumbnailsSmallIcon:"yes",
				thumbnailsHoverEffect:"scale",
				thumbnailsImageHeight:80,
				thumbnailsBorderSize:4,
				thumbnailsBorderRadius:0,
				spaceBetweenThumbnailsAndItem:0,
				thumbnailsOffsetBottom:0,
				spaceBetweenThumbnails:2,
				thumbnailsOverlayOpacity:.6,
				thumbnailsOverlayColor:"#FFFFFF",
				thumbnailsBorderNormalColor:"#FFFFFF",
				thumbnailsBorderSelectedColor:"#FFFFFF",
				//description settings
				showDescriptionButton:self.data.showDescriptionButton_str,
				showDescriptionByDefault:self.data.showDescriptionByDefault_str,
				descriptionWindowAnimationType:self.data.descriptionWindowAnimationType_str,
				descriptionWindowPosition:self.data.descriptionWindowPosition_str,
				descriptionWindowBackgroundColor:self.data.descriptionWindowBackgroundColor_str,
				descriptionWindowBackgroundOpacity:self.data.descriptionWindowBackgroundOpacity,
				//video & audio players settings
				useVideo:"yes",
				useAudio:"yes",
				videoShowFullScreenButton:self.data.videoShowFullScreenButton_str,
				addVideoKeyboardSupport:"yes",
				nextVideoOrAudioAutoPlay:self.data.nextVideoOrAudioAutoPlay_str,
				videoAutoPlay:self.data.videoAutoPlay_str,
				videoLoop:self.data.videoLoop_str,
				audioAutoPlay:self.data.audioAutoPlay_str,
				audioLoop:self.data.audioLoop_str,
				videoControllerHideDelay:3,
				videoControllerHeight:41,
				audioControllerHeight:44,
				startSpaceBetweenButtons:7,
				vdSpaceBetweenButtons:9,
				mainScrubberOffestTop:14,
				scrubbersOffsetWidth:1,
				audioScrubbersOffestTotalWidth:4,
				timeOffsetLeftWidth:5,
				timeOffsetRightWidth:3,
				volumeScrubberWidth:80,
				volumeScrubberOffsetRightWidth:0,
				videoControllerBackgroundColor:self.data.videoControllerBackgroundColor_str,
				videoPosterBackgroundColor:self.data.videoPosterBackgroundColor_str,
				videoPosterBackgroundColor:self.data.videoPosterBackgroundColor_str,
				audioControllerBackgroundColor:self.data.audioControllerBackgroundColor_str,
				timeColor:self.data.timeColor_str
			});
			
			
			FWDRL.addListener(FWDRL.UPDATE, self.RLUpdateHandler);
			FWDRL.addListener(FWDRL.SHOW_START, self.RLShowStart);
			FWDRL.addListener(FWDRL.SHOW_COMPLETE, self.RLShowComplete);
			FWDRL.addListener(FWDRL.HIDE_START, self.RLHideStart);
			FWDRL.addListener(FWDRL.HIDE_COMPLETE, self.RLhideComplete);
		};
		
		this.RLUpdateHandler = function(e){
			self.thumbsManager_do.setVisitedThumbnail(self.thumbsManager_do.playlist_ar[e.curId].thumbnailPath_str);
		};
		
		this.RLShowStart = function(){
			self.dispatchEvent(FWDIGP.LIGHTBOX_SHOW_START);
		};
		
		this.RLShowComplete = function(){
			self.dispatchEvent(FWDIGP.LIGHTBOX_SHOW_COMPLETE);
		};
		
		this.RLHideStart = function(){
			self.dispatchEvent(FWDIGP.LIGHTBOX_HIDE_START);
		};
		
		this.RLhideComplete = function(){
			self.thumbsManager_do.startToLoop();
			self.dispatchEvent(FWDIGP.LIGHTBOX_HIDE_COMPLETE);
		};
		
		//#######################################//
		/* API */
		//#######################################//
		this.updateCategory = function(id, overwrite){
			if(!this.isReady_bl || this.thumbsManager_do.isCategoryChanging_bl || this.playlistId == id) return;
			
			this.playlistId = id;
			if(this.playlistId >= this.data.totalPlaylists){
				this.playlistId = this.data.totalPlaylists -1;
			}else if(this.playlistId < 0){
				this.playlistId = 0;
			}
			if(this.comboBox_do) this.comboBox_do.setButtonsStateBasedOnId(this.playlistId);
			this.thumbsManager_do.updateCategory(this.data.playlist_ar[this.playlistId].playlistItems);
			setTimeout(function(){self.dispatchEvent(FWDIGP.CATEGORY_UPDATE);}, 50);
		};
		
		this.getCategoryId = function(){
			return this.playlistId;
		};
		
		this.getCategoryName = function(id){
			if(id === undefined) id = this.playlistId;
			return this.data.categories_ar[id];
		};
		
		this.getCategoryId = function(){
			return this.playlistId;
		};
		
		
		//########################################//
		/* Event dispatcher */
		//########################################//
		 this.addListener = function (type, listener){
		    	
		    	if(type == undefined) throw Error("type is required.");
		    	if(typeof type === "object") throw Error("type must be of type String.");
		    	if(typeof listener != "function") throw Error("listener must be of type Function.");
		    	
		    	
		        var event = {};
		        event.type = type;
		        event.listener = listener;
		        event.target = this;
		        this.listeners.events_ar.push(event);
		    };
		    
		    this.dispatchEvent = function(type, props_obj){
		    	if(this.listeners == null) return;
		    	if(type == undefined) throw Error("type is required.");
		    	if(typeof type === "object") throw Error("type must be of type String.");
		    	
		        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
		        	if(this.listeners.events_ar[i].target === this && this.listeners.events_ar[i].type === type){		
		    	        if(props_obj){
		    	        	for(var prop in props_obj){
		    	        		this.listeners.events_ar[i][prop] = props_obj[prop];
		    	        	}
		    	        }
		        		this.listeners.events_ar[i].listener.call(this, this.listeners.events_ar[i]);
		        	}
		        }
		    };
		    
		   this.removeListener = function(type, listener){
		    	
		    	if(type == undefined) throw Error("type is required.");
		    	if(typeof type === "object") throw Error("type must be of type String.");
		    	if(typeof listener != "function") throw Error("listener must be of type Function." + type);
		    	
		        for (var i=0, len=this.listeners.events_ar.length; i < len; i++){
		        	if(this.listeners.events_ar[i].target === this 
		        			&& this.listeners.events_ar[i].type === type
		        			&& this.listeners.events_ar[i].listener ===  listener
		        	){
		        		this.listeners.events_ar.splice(i,1);
		        		break;
		        	}
		        }  
		    };
		
		
		this.init();
	};
	
	
	FWDIGP.READY = "ready";
	FWDIGP.LIGHTBOX_SHOW_START = "showStart";
	FWDIGP.LIGHTBOX_SHOW_COMPLETE = "showComplete";
	FWDIGP.LIGHTBOX_HIDE_START = "hideStart";
	FWDIGP.LIGHTBOX_HIDE_COMPLETE = "hideComplete";
	FWDIGP.CATEGORY_UPDATE = "categoryUpdate";
	FWDIGP.FULL_SCREEN = "fullscreen";
	FWDIGP.LIGHTBOX = "lightbox";
	FWDIGP.RESPONSIVE = "responsive";
	FWDIGP.FLUID_WIDTH = "fluidwidth";
	FWDIGP.AFTER_PARENT = "afterparent";
	FWDIGP.IFRAME = "iframe";
	FWDIGP.IMAGE = "image";
	FWDIGP.FLASH = "flash";
	FWDIGP.AUDIO = "audio";
	FWDIGP.VIDEO = "video";
	FWDIGP.VIMEO = "vimeo";
	FWDIGP.YOUTUBE = "youtube";
	FWDIGP.MAPS = "maps";
	FWDIGP.LINK = "link";
	
	
	window.FWDIGP = FWDIGP;
	
}(window));