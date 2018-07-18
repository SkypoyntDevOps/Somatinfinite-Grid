/* Data */
(function(window){
	
	var FWDIGPData = function(props){
		
		var self = this;
		var prototype = FWDIGPData.prototype;
	
		this.props_obj = props;
		this.rootElement_el = null;
		this.graphicsPaths_ar = [];
		this.skinPaths_ar = [];
		this.playlist_ar = [];
		this.lightboxPlaylist_ar = [];
		this.categories_ar = [];
		
		this.backgroundColor_str;
		this.thumbnailBackgroundColor_str;
		this.thumbnailOverlayBackgroundColor_str;
		this.lightBoxInfoWindowBackgroundColor_str;
		this.lightBoxItemBorderColor_str;
		this.lightBoxItemBackgroundColor_str;
		this.grabIconPath_str;
		this.handIconPath_str;
		this.imageIconPath_str;
		this.videoIconPath_str;
		this.linkIconPath_str;
		this.dragDirection_str;
		this.autoScrollDirection_str;
		this.mainFolderPath_str;
		this.skinPath_str;
		this.rightClickContextMenu_str;
		this.selectLabel_str;
		this.allCategoriesLabel_str;
		
		this.totalPlaylists;
		this.startAtCategory;
		this.thumbnailMaxWidth;
		this.thumbnailMaxHeight;
		this.thumbnailOverlayOpacity;
		this.countLoadedGraphics = 0;
		this.totalGraphics;
		this.totalItems;
		this.lightBoxInfoWindowBackgroundOpacity;
		this.lightBoxBackgroundOpacity;
		this.lightBoxBorderSize;
		this.lightBoxSlideShowDelay;
		this.countLoadedSkinImages = 0;
		
		this.parseDelayId_to;
		this.loadImageId_to;
		
		this.showLightBoxZoomButton_bl;
		this.showLightBoxInfoButton_bl;
		this.showLighBoxSlideShowButton_bl;
		this.autoScroll_bl;
		this.addLightBoxKeyboardSupport_bl;
		this.showLighBoxNextAndPrevButtons_bl;
		this.showContextMenu_bl;
		this.disableThumbnailsInteractivity_bl;
		this.addZoomSupport_bl;
		
		this.isMobile_bl = FWDRLUtils.isMobile;
		this.showThumbnailOverlay_bl;
		this.showThumbnailIcon_bl;
		this.showHelpScreen_bl;;
		
		//###################################//
		/*init*/
		//###################################//
		this.init = function(){
			this.parseDelayId_to = setTimeout(self.parseProperties, 100);
		};

		
		this.parseProperties = function(){
			var errorMessage_str;
			var mediaKid;
		
			self.mainFolderPath_str = self.props_obj.mainFolderPath;
			if(!self.mainFolderPath_str){
				setTimeout(function(){
					if(self == null) return;
					errorMessage_str = "The <font color='#FF0000'>mainFolderPath</font> property is not defined in the constructor function!";
					self.dispatchEvent(FWDRLData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
			if((self.mainFolderPath_str.lastIndexOf("/") + 1) != self.mainFolderPath_str.length){
				self.mainFolderPath_str += "/";
			}
			
			self.skinPath_str = self.props_obj.skinPath;
			if(!self.skinPath_str){
				setTimeout(function(){
					if(self == null) return;
					errorMessage_str = "The <font color='#FF0000'>skinPath</font> property is not defined in the constructor function!";
					self.dispatchEvent(FWDRLData.LOAD_ERROR, {text:errorMessage_str});
				}, 50);
				return;
			}
			
		
			if((self.skinPath_str.lastIndexOf("/") + 1) != self.skinPath_str.length){
				self.skinPath_str += "/";
			}
			
			self.lightboxSkinPath_str = self.skinPath_str;
			self.skinPath_str += "main_skin/";
			
			self.skinPath_str = self.mainFolderPath_str + self.skinPath_str;
			
			//###############################//
			/* set main properties */
			//###############################//
			self.rightClickContextMenu_str = self.props_obj.rightClickContextMenu || "developer";
			test = self.rightClickContextMenu_str == "developer" 
				   || self.rightClickContextMenu_str == "disabled"
				   || self.rightClickContextMenu_str == "default";
			if(!test) self.rightClickContextMenu_str = "developer";
			self.handIconPath_str = self.skinPath_str + "hand.cur";
			self.grabIconPath_str = self.skinPath_str + "grab.cur";
			
			self.dragDirection_str = self.props_obj.dragDirection || "both";
			test = self.dragDirection_str == "horizontal" 
				   || self.dragDirection_str == "vertical"
				   || self.dragDirection_str == "both"
				   || self.dragDirection_str == "none";
			if(!test) self.dragDirection_str = "both";
			
			self.autoScrollDirection_str = self.props_obj.autoScrollDirection || "down";
			test = self.autoScrollDirection_str.toLowerCase() == "down" 
				   || self.autoScrollDirection_str.toLowerCase() == "up"
				   || self.autoScrollDirection_str.toLowerCase() == "left"
				   || self.autoScrollDirection_str.toLowerCase() == "right";
			if(!test) self.dragDirection_str = "down";
			
			self.comboBoxPosition_str = self.props_obj.comboBoxPosition || "topright";
			self.comboBoxPosition_str = self.comboBoxPosition_str.toLowerCase();
			test = self.comboBoxPosition_str.toLowerCase() == "topright" 
				   || self.comboBoxPosition_str.toLowerCase() == "topleft";
			if(!test) self.comboBoxPosition_str = "topright";
			
			self.thumbnailTransitionType_str = self.props_obj.thumbnailTransitionType || "opacity";
			test = self.thumbnailTransitionType_str.toLowerCase() == "opacity" 
				   || self.thumbnailTransitionType_str.toLowerCase() == "motion";
			if(!test) self.thumbnailTransitionType_str = "opacity";
			
			self.buttonsAlignment_str = self.props_obj.buttonsAlignment || "in";
			var test = self.buttonsAlignment_str == "in" 
				   || self.buttonsAlignment_str == "out";
			if(!test) self.buttonsAlignment_str = "in";
			
			self.helpScreenBackgroundColor_str = self.props_obj.helpScreenBackgroundColor || "transparent";
			self.slideShowAutoPlay_str = self.props_obj.slideShowAutoPlay;
			self.addKeyboardSupport_str = self.props_obj.addKeyboardSupport;
			self.showCloseButton_str = self.props_obj.showCloseButton;
			self.showShareButton_str = self.props_obj.showShareButton;
			self.showZoomButton_str = self.props_obj.showZoomButton;
			self.showSlideShowButton_str = self.props_obj.showSlideShowButton;
			self.showSlideShowAnimation_str = self.props_obj.showSlideShowAnimation;
			self.showNextAndPrevButtons_str = self.props_obj.showNextAndPrevButtons;
			self.showNextAndPrevButtonsOnMobile_str = self.props_obj.showNextAndPrevButtonsOnMobile;
			self.itemBoxShadow_str = self.props_obj.itemBoxShadow;
			self.itemBackgroundColor_str = self.props_obj.itemBackgroundColor;
			self.itemBorderColor_str =  self.props_obj.itemBorderColor;
			self.backgroundColor_str = self.props_obj.lightboxBackgroundColor;
			self.showDescriptionButton_str = self.props_obj.showDescriptionButton;
			self.showDescriptionByDefault_str = self.props_obj.showDescriptionByDefault;
			self.descriptionWindowAnimationType_str = self.props_obj.descriptionWindowAnimationType;
			self.descriptionWindowPosition_str = self.props_obj.descriptionWindowPosition;
			self.descriptionWindowBackgroundColor_str = self.props_obj.descriptionWindowBackgroundColor;
			self.descriptionWindowBackgroundOpacity = self.props_obj.descriptionWindowBackgroundOpacity;
			self.useVideo_str = self.props_obj.useVideo;
			self.useAudio_str = self.props_obj.useAudio;
			self.videoShowFullScreenButton_str = self.props_obj.videoShowFullScreenButton;
			self.nextVideoOrAudioAutoPlay_str = self.props_obj.nextVideoOrAudioAutoPlay;
			self.videoAutoPlay_str = self.props_obj.videoAutoPlay;
			self.videoLoop_str = self.props_obj.videoLoop;
			self.audioAutoPlay_str = self.props_obj.audioAutoPlay;
			self.audioLoop_str = self.props_obj.audioLoop;
			self.videoControllerBackgroundColor_str = self.props_obj.videoControllerBackgroundColor;
			self.videoPosterBackgroundColor_str = self.props_obj.videoPosterBackgroundColor;
			self.videoPosterBackgroundColor_str = self.props_obj.videoPosterBackgroundColor;
			self.audioControllerBackgroundColor_str = self.props_obj.audioControllerBackgroundColor;
			self.timeColor_str = self.props_obj.timeColor;
			self.okButtonSPath_str = self.skinPath_str + "ok-button-over.png";
			
			self.selectLabel_str  = self.props_obj.selectLabel || "not defined!";
			self.allCategoriesLabel_str = self.props_obj.allCategoriesLabel || "not defined";
			self.selctorBackgroundNormalColor_str = self.props_obj.selctorBackgroundNormalColor;
			self.selctorBackgroundSelectedColor_str = self.props_obj.selctorBackgroundSelectedColor;
			self.selctorTextNormalColor_str = self.props_obj.selctorTextNormalColor;
			self.selctorTextSelectedColor_str = self.props_obj.selctorTextSelectedColor;
			self.buttonBackgroundNormalColor_str = self.props_obj.buttonBackgroundNormalColor;
			self.buttonBackgroundSelectedColor_str = self.props_obj.buttonBackgroundSelectedColor;
			self.buttonTextNormalColor_str = self.props_obj.buttonTextNormalColor;
			self.buttonTextSelectedColor_str = self.props_obj.buttonTextSelectedColor;
			self.comboBoxShadowColor_str = self.props_obj.comboBoxShadowColor || "#000000";
		
			self.helpScreenOpacity = self.props_obj.helpScreenOpacity || .6; 
			self.minScale = self.props_obj.minScale || 1;
			self.maxScale = self.props_obj.maxScale || 1;
			self.scaleIncrement = self.props_obj.scaleIncrement || .1;
			self.thumbnailMaxWidth = self.props_obj.thumbnailMaxWidth || 280;
			if(self.thumbnailMaxWidth < 20) self.thumbnailMaxWidth = 20;
			self.thumbnailMaxHeight = self.props_obj.thumbnailMaxHeight || 240;
			if(self.thumbnailMaxHeight < 20) self.thumbnailMaxHeight = 20;
			self.backgroundColor_str = self.props_obj.backgroundColor || "transparent";
			self.thumbnailBackgroundColor_str = self.props_obj.thumbnailBackgroundColor || "transparent";
			self.thumbnailOverlayBackgroundColor_str = self.props_obj.thumbnailOverlayColor || "transparent";
			self.thumbnailOverlayOpacity = self.props_obj.thumbnailOverlayOpacity || 1;
			self.lightBoxInfoWindowBackgroundColor_str =  self.props_obj.lightBoxInfoWindowBackgroundColor || "transparent";
			self.lightBoxBackgroundColor_str = self.props_obj.lightBoxBackgroundColor || "transparent";
			self.lightBoxInfoWindowBackgroundOpacity =  self.props_obj.lightBoxInfoWindowBackgroundOpacity || 1;
			self.lightBoxBackgroundOpacity = self.props_obj.lightBoxInfoWindowBackgroundOpacity || 1;
			self.lightBoxMainBackgroundOpacity = self.props_obj.lightBoxMainBackgroundOpacity || 1;
			self.lightBoxItemBorderColor_str = self.props_obj.lightBoxItemBorderColor || "transparent";
			self.lightBoxItemBackgroundColor_str = self.props_obj.lightBoxItemBackgroundColor || "transparent";
			self.lightBoxBorderSize = self.props_obj.lightBoxBorderSize || 0;
			self.lightBoxSlideShowDelay = self.props_obj.lightBoxSlideShowDelay * 1000 || 3000;
			self.comboBoxHorizontalMargins = self.props_obj.comboBoxHorizontalMargins || 0;
			self.comboBoxVerticalMargins = self.props_obj.comboBoxVerticalMargins || 0;
			self.comboBoxCornerRadius = self.props_obj.comboBoxCornerRadius || 0;
			self.startAtCategory = parseInt(self.props_obj.startAtCategory);
			self.buttonsHideDelay = self.props_obj.buttonsHideDelay;
			self.slideShowDelay = self.props_obj.slideShowDelay;
			self.defaultItemWidth = self.props_obj.defaultItemWidth;
			self.defaultItemHeight = self.props_obj.defaultItemHeight;
			self.itemOffsetHeight = self.props_obj.itemOffsetHeight;
			self.spaceBetweenButtons = self.props_obj.spaceBetweenButtons;
			self.buttonsOffsetIn = self.props_obj.buttonsOffsetIn;
			self.buttonsOffsetOut = self.props_obj.buttonsOffsetOut;
			self.itemBorderSize = self.props_obj.itemBorderSize;
			self.itemBorderRadius = self.props_obj.itemBorderRadius;
			self.backgroundOpacity = self.props_obj.backgroundOpacity;
			self.autoScrollSpeed = self.props_obj.autoScrollSpeed || 1;

			self.addZoomSupport_bl = self.props_obj.addZoomSupport;
			self.addZoomSupport_bl = self.addZoomSupport_bl == "yes" ? true : false;
			
			self.addDragAndSwipeSupport_bl = self.props_obj.addDragAndSwipeSupport;
			self.addDragAndSwipeSupport_bl = self.addDragAndSwipeSupport_bl == "yes" ? true : false;
			
			self.disableThumbnailsInteractivity_bl = self.props_obj.disableThumbnailsInteractivity;
			self.disableThumbnailsInteractivity_bl = self.disableThumbnailsInteractivity_bl == "yes" ? true : false;
	
			self.showThumbnailOverlay_bl = self.props_obj.showThumbnailOverlay; 
			self.showThumbnailOverlay_bl = self.showThumbnailOverlay_bl == "no" ? false : true;
			if(self.isMobile_bl) self.showThumbnailOverlay_bl = false;
			
			self.showThumbnailIcon_bl = self.props_obj.showThumbnailIcon; 
			self.showThumbnailIcon_bl = self.showThumbnailIcon_bl == "no" ? false : true;
			if(self.isMobile_bl) self.showThumbnailIcon_bl = false;
			
			self.showHelpScreen_bl = self.props_obj.showHelpScreen; 
			self.showHelpScreen_bl = self.showHelpScreen_bl == "no" ? false : true;
			
			self.addLightBoxKeyboardSupport_bl = self.props_obj.addLightBoxKeyboardSupport; 
			self.addLightBoxKeyboardSupport_bl = self.addLightBoxKeyboardSupport_bl == "no" ? false : true;
			
			self.showLighBoxNextAndPrevButtons_bl = self.props_obj.showLightBoxNextAndPrevButtons; 
			self.showLighBoxNextAndPrevButtons_bl = self.showLighBoxNextAndPrevButtons_bl == "no" ? false : true;
			
			self.showLightBoxZoomButton_bl = self.props_obj.showLightBoxZoomButton; 
			self.showLightBoxZoomButton_bl = self.showLightBoxZoomButton_bl == "no" ? false : true;
			
			self.showLightBoxInfoButton_bl = self.props_obj.showLightBoxInfoButton;
			self.showLightBoxInfoButton_bl = self.showLightBoxInfoButton_bl == "no" ? false : true;
			
			self.showLighBoxSlideShowButton_bl =  self.props_obj.showLighBoxSlideShowButton;
			self.showLighBoxSlideShowButton_bl =  self.showLighBoxSlideShowButton_bl == "no" ? false : true;
		
			self.disableThumbnailInteractivity_bl = self.props_obj.disableThumbnailInteractivity;
			self.disableThumbnailInteractivity_bl = self.disableThumbnailInteractivity_bl == "yes" ? true : false;
			
			self.autoScroll_bl = self.props_obj.autoScroll;
			self.autoScroll_bl = self.autoScroll_bl == "yes" ? true : false;
			
			self.showAllCategories_bl = self.props_obj.showAllCategories;
			self.showAllCategories_bl = self.showAllCategories_bl == "yes" ? true : false;
			
			self.keepThumbnailsOriginalSizeOnGridStart_bl = self.props_obj.keepThumbnailsOriginalSizeOnGridStart;
			self.keepThumbnailsOriginalSizeOnGridStart_bl = self.keepThumbnailsOriginalSizeOnGridStart_bl == "yes" ? true : false;
			
			self.enableVisitedThumbnails_bl = self.props_obj.enableVisitedThumbnails;
			self.enableVisitedThumbnails_bl = self.enableVisitedThumbnails_bl == "yes" ? true : false;  
			
			if(self.addZoomSupport_bl && self.addDragAndSwipeSupport_bl && !FWDRLUtils.isIEAndLessThen9 && self.showHelpScreen_bl){
				if(self.isMobile_bl){
					self.helpScreenPath_str = "zoom-move-mobile.png";
				}else{
					self.helpScreenPath_str = "zoom-move.png";
				}
			}else if(self.addZoomSupport_bl && !FWDRLUtils.isIEAndLessThen9 && self.showHelpScreen_bl){
				if(self.isMobile_bl){
					self.helpScreenPath_str = "zoom-mobile.png";
				}else{
					self.helpScreenPath_str = "zoom.png";
				}
			}else if(self.addDragAndSwipeSupport_bl && self.showHelpScreen_bl){
				if(self.isMobile_bl){
					self.helpScreenPath_str = "move-mobile.png";
				}else{
					self.helpScreenPath_str = "move.png";
				}
			}else{
				self.showHelpScreen_bl = false;
			}
			
			self.randomizeAllCategories_bl = self.props_obj.randomizeAllCategories;
			self.randomizeAllCategories_bl = self.randomizeAllCategories_bl == "yes" ? true : false;
			
			self.randomizeCategories_bl = self.props_obj.randomizeCategories;
			self.randomizeCategories_bl = self.randomizeCategories_bl == "yes" ? true : false;
			
			self.showComboBox_bl = self.props_obj.showComboBox;
			self.showComboBox_bl = self.showComboBox_bl == "yes" ? true : false;
			
			//#################################//
			//create playlists
			//#################################//
			self.playListElement = FWDRLUtils.getChildById(self.props_obj.playlistId);
			if(!self.playListElement){
				errorMessage_str = "Playlist div with the id - <font color='#FF0000'>" + self.props_obj.playlistId + "</font> doesn't exists.";
				self.dispatchEvent(FWDIGPData.LOAD_ERROR, {text:errorMessage_str});
				return;
			}
			
			var allPlaylists_ar = FWDRLUtils.getChildren(self.playListElement);
			self.totalPlaylists = allPlaylists_ar.length;
			if(self.totalPlaylists <= 1){
				self.showAllCategories_bl = false;
				self.showComboBox_bl = false;
			}
		
			var curPlaylist_ar;
			var parsedPlaylist_ar;
			var lightboxParsedPlaylist_ar;
			var totalItems;
			
			
			for(var j=0; j<self.totalPlaylists; j++){
				var plObj = {};
				curPlaylist_ar = FWDRLUtils.getChildren(allPlaylists_ar[j]);
				parsedPlaylist_ar = [];
				lightboxParsedPlaylist_ar = [];
				totalItems = curPlaylist_ar.length;
				
				if(totalItems < 9){
					errorMessage_str = "A minimum of <font color='#FF0000'>9</font> thumbnails is required in the playlist nr: <font color='#FF0000'>" + j + "</font>";
					self.dispatchEvent(FWDIGPData.LOAD_ERROR, {text:errorMessage_str});
					return;
				}
				
				for(var i=0; i<totalItems; i++){
					var obj = {};
					var ch = curPlaylist_ar[i];
					var test;
					
					if(!FWDRLUtils.hasAttribute(ch, "data-url")){
						errorMessage_str = "Attribute <font color='#FF0000'>data-url</font> is not found in the playlist at position nr: <font color='#FF0000'>" + i + "</font>.";
						self.dispatchEvent(FWDIGPData.LOAD_ERROR, {text:errorMessage_str});
						return;
					}
					
					obj.url = String(FWDRLUtils.getAttributeValue(ch, "data-url"));
					obj.target = String(FWDRLUtils.getAttributeValue(ch, "data-target"));
					obj.posterPath = FWDRLUtils.getAttributeValue(ch, "data-poster-path");
					obj.type_str = FWDRLUtils.getAttributeValue(ch, "data-url");
					obj.width = FWDRLUtils.getAttributeValue(ch, "data-width");
					obj.height = FWDRLUtils.getAttributeValue(ch, "data-height");
					obj.thumbnailOverlayColor = FWDRLUtils.getAttributeValue(ch, "data-thumbnail-overlay-color");
					if(FWDRLUtils.hasAttribute(ch, "data-thumbnail-path")){
						obj.thumbnailPath_str = FWDRLUtils.getAttributeValue(ch, "data-thumbnail-path");
					}else{
						errorMessage_str = "Attribute <font color='#FF0000'>data-thumbnail-path</font> is not found in the playlist at position nr: <font color='#FF0000'>" + i + "</font>.";
						self.dispatchEvent(FWDIGPData.LOAD_ERROR, {text:errorMessage_str});
						return;
					}
				
					
					try{
						if(FWDRLUtils.getChildren(ch).length != 0){
							obj.description = ch.innerHTML;
							obj.descriptionText = ch.innerText;
						}
					}catch(e){};
					
					if(/\.jpg|\.jpeg|\.png/i.test(obj.type_str)){
						obj.iconType_str = FWDIGP.IMAGE;
						obj.type_str = FWDIGP.IMAGE;
						if(self.showThumbnailOverlay_bl){
							obj.thumbIconPath_str = self.skinPath_str + "image-icon.png";
						}else{
							obj.thumbIconPath_str = self.skinPath_str + "image-icon-with-background.png";
						}
						obj.width = undefined;
						obj.height = undefined;
					}else if(/\.mp4/i.test(obj.type_str)){
						obj.iconType_str = FWDIGP.VIDEO;
						obj.type_str = FWDIGP.VIDEO;
						if(self.showThumbnailOverlay_bl){
							obj.thumbIconPath_str = self.skinPath_str + "video-icon.png";
						}else{
							obj.thumbIconPath_str = self.skinPath_str + "video-icon-with-background.png";
						}
					}else if(/\.mp3/i.test(obj.type_str)){
						obj.type_str = FWDIGP.AUDIO;
						obj.iconType_str = FWDIGP.AUDIO;
						if(self.showThumbnailOverlay_bl){
							obj.thumbIconPath_str = self.skinPath_str + "audio-icon.png";
						}else{
							obj.thumbIconPath_str = self.skinPath_str + "audio-icon-with-background.png";
						}
					}else if(/\.swf/i.test(obj.type_str)){
						obj.type_str = FWDIGP.FLASH;
						obj.iconType_str = FWDIGP.FLASH;
						if(self.showThumbnailOverlay_bl){
							obj.thumbIconPath_str = self.skinPath_str + "flash-icon.png";
						}else{
							obj.thumbIconPath_str = self.skinPath_str + "flash-icon-with-background.png";
						}
					}else if(/youtube\.|vimeo\./i.test(obj.type_str)){
						if(obj.type_str.indexOf("youtube.") != -1){
							obj.iconType_str = FWDIGP.YOUTUBE;
							if(self.showThumbnailOverlay_bl){
								obj.thumbIconPath_str = self.skinPath_str + "youtube-icon.png";
							}else{
								obj.thumbIconPath_str = self.skinPath_str + "youtube-icon-with-background.png";
							}
						}else{
							obj.iconType_str = FWDIGP.VIMEO;
							if(self.showThumbnailOverlay_bl){
								obj.thumbIconPath_str = self.skinPath_str + "vimeo-icon.png";
							}else{
								obj.thumbIconPath_str = self.skinPath_str + "vimeo-icon-with-background.png";
							}
						}
						obj.type_str = FWDIGP.IFRAME;
					}else if(/link:/i.test(obj.type_str)){
						obj.url = obj.url.substr(5);
						obj.iconType_str = FWDIGP.LINK;	
						if(self.showThumbnailOverlay_bl){
							obj.thumbIconPath_str = self.skinPath_str + "link-icon.png";
						}else{
							obj.thumbIconPath_str = self.skinPath_str + "link-icon-with-background.png";
						}
						obj.type_str = FWDIGP.LINK;
					}else{
						if(obj.type_str.indexOf("google.") != -1){
							obj.iconType_str = FWDIGP.MAPS;
							if(self.showThumbnailOverlay_bl){
								obj.thumbIconPath_str = self.skinPath_str + "maps-icon.png";
							}else{
								obj.thumbIconPath_str = self.skinPath_str + "maps-icon-with-background.png";
							}
						}else if(obj.type_str.indexOf("RL_AJAX") != -1){
							obj.iconType_str = FWDIGP.AJAX;
						}else if(obj.type_str.indexOf("RL_HTML") != -1){
							obj.iconType_str = FWDIGP.HTML;
							if(self.showThumbnailOverlay_bl){
								obj.thumbIconPath_str = self.skinPath_str + "html-icon.png";
							}else{
								obj.thumbIconPath_str = self.skinPath_str + "html-icon-with-background.png";
							}
						}else{
							obj.iconType_str = FWDIGP.IFRAME;
							if(self.showThumbnailOverlay_bl){
								obj.thumbIconPath_str = self.skinPath_str + "iframe-icon.png";
							}else{
								obj.thumbIconPath_str = self.skinPath_str + "iframe-icon-with-background.png";
							}
						}
						obj.type_str = FWDIGP.IFRAME;
					}
				
					if(obj.type_str == FWDIGP.IMAGE_TYPE || obj.type_str == FWDIGP.VIDEO_TYPE){
						var firstUrlPath = encodeURI(obj.url.substr(0,obj.url.lastIndexOf("/") + 1));
						var secondUrlPath = encodeURIComponent(obj.url.substr(obj.url.lastIndexOf("/") + 1));
						obj.url = firstUrlPath + secondUrlPath;
					}
					parsedPlaylist_ar[i] = obj;
				}
				
				self.categories_ar[j] = FWDRLUtils.getAttributeValue(allPlaylists_ar[j], "data-category-name");
				self.playlist_ar[j] = {playlistItems:parsedPlaylist_ar};
				
				if(self.randomizeCategories_bl) self.playlist_ar[j].playlistItems = FWDRLUtils.randomizeArray(self.playlist_ar[j].playlistItems);
				
				for(var k=0; k<self.playlist_ar[j].playlistItems.length; k++){
					if(self.playlist_ar[j].playlistItems[k].type_str != FWDIGP.LINK){
						lightboxParsedPlaylist_ar.push(self.playlist_ar[j].playlistItems[k]);
					}
				}
				
				self.lightboxPlaylist_ar[j] = {playlistItems:lightboxParsedPlaylist_ar};
			}
			
			if(self.showAllCategories_bl){
				var tempAllPlaylist_ar;
				var countPlaylistItems = 0;
				if(self.showAllCategories_bl){
					var tempAllPlaylist_ar = [];
					for(var i=0; i<self.playlist_ar.length; i++){
						for(var j=0; j<self.playlist_ar[i].playlistItems.length; j++){
							tempAllPlaylist_ar[countPlaylistItems] = (self.playlist_ar[i].playlistItems[j]);
							countPlaylistItems++;
						}
					}	
				};
				
				tempAllPlaylist_ar = FWDRLUtils.removeArrayDuplicates(tempAllPlaylist_ar, "thumbnailPath_str");
				if(self.randomizeAllCategories_bl) tempAllPlaylist_ar = FWDRLUtils.randomizeArray(tempAllPlaylist_ar);
				self.categories_ar.splice(0,0, self.allCategoriesLabel_str);
				self.playlist_ar.splice(0,0,{playlistItems:tempAllPlaylist_ar});
				
				var tempLighboxAll_ar = [].concat(tempAllPlaylist_ar);
				var finalLightBoxAll_ar = [];
			
				for(var k=0; k<tempLighboxAll_ar.length; k++){
					if(tempLighboxAll_ar[k].type_str != FWDIGP.LINK){
						finalLightBoxAll_ar.push(tempLighboxAll_ar[k]);
					}
				}
				self.lightboxPlaylist_ar.splice(0,0,{playlistItems:finalLightBoxAll_ar});
			}
			
			
			self.totalPlaylists = self.playlist_ar.length;
			
			try{
				self.playListElement.parentNode.removeChild(self.playListElement);
			}catch(e){};
			
			self.mainPreloader_img = new Image();
			self.mainPreloader_img.onerror = self.onSkinLoadErrorHandler;
			self.mainPreloader_img.onload = self.onPreloaderLoadHandler;
			self.mainPreloader_img.src = self.skinPath_str + "preloader.png";
			
			self.skinPaths_ar = [
			     {img:self.comboboxUpArrowN_img = new Image(), src:self.skinPath_str + "combobox-down-arrow.png"},
			     {img:self.comboboxUpArrowS_img = new Image(), src:self.skinPath_str + "combobox-down-arrow-rollover.png"}
			];
			
			if(self.showHelpScreen_bl){
				self.skinPaths_ar.push(
				    {img:self.helpScreen_img = new Image(), src:self.skinPath_str + self.helpScreenPath_str},
				    {img:self.okButtonN_img = new Image(), src:self.skinPath_str + "ok-button.png"}
				);
			};
			
			self.totalGraphics = self.skinPaths_ar.length;
		};
		
		//####################################//
		/* Preloader load done! */
		//###################################//
		this.onPreloaderLoadHandler = function(){
			setTimeout(function(){
				self.dispatchEvent(FWDIGPData.PRELOADER_LOAD_DONE);
				self.loadSkin();
			}, 50);
		};
		
		//####################################//
		/* load buttons graphics */
		//###################################//
		self.loadSkin = function(){
			var img;
			var src;
			
			for(var i=0; i<self.totalGraphics; i++){
				img = self.skinPaths_ar[i].img;
				src = self.skinPaths_ar[i].src;
				img.onload = self.onSkinLoadHandler;
				img.onerror = self.onSkinLoadErrorHandler;
				img.src = src;
			}
		};
		
		this.onSkinLoadHandler = function(e){
			self.countLoadedSkinImages++;
			if(self.countLoadedSkinImages == self.totalGraphics){
				setTimeout(function(){
					self.dispatchEvent(FWDIGPData.LOAD_DONE);
				}, 50);
			}
		};
		
		self.onSkinLoadErrorHandler = function(e){
			if (FWDRLUtils.isIEAndLessThen9){
				message = "Graphics image not found!";
			}else{
				message = "The skin graphics with label <font color='#FF0000'>" + e.target.src + "</font> can't be loaded, check path!";
			}
			
			if(window.console) console.log(e);
			var err = {text:message};
			setTimeout(function(){
				self.dispatchEvent(FWDIGPData.LOAD_ERROR, err);
			}, 50);
		};
	
	
		this.init();
	};
	
	/* set prototype */
	FWDIGPData.setPrototype = function(){
		FWDIGPData.prototype = new FWDRLEventDispatcher();
	};
	
	FWDIGPData.prototype = null;
	FWDIGPData.PRELOADER_LOAD_DONE = "onPreloaderLoadDone";
	FWDIGPData.LOAD_DONE = "onLoadDone";
	FWDIGPData.LOAD_ERROR = "onLoadError";
	FWDIGPData.LIGHBOX_CLOSE_BUTTON_LOADED = "onLightBoxCloseButtonLoadDone";
	
	window.FWDIGPData = FWDIGPData;
}(window));