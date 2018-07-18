/* FWDIGPThumbsManager */
(function (window){
	
	var FWDIGPThumbsManager = function(data, parent){
		
		var self = this;
		var prototype = FWDIGPThumbsManager.prototype;
		
		this.rect;
		this.thumbsHolder_do;
		this.lastHoveredThumb_do;
		
		this.visitedThumbnailsPaths_ar = [];
		this.playlist_ar;
		this.poolThumbs_ar = [];
		this.thumbs_ar;
		this.grid_ar;
		this.so;
		
		this.backgroundColor_str = data.backgroundColor_str;
		this.thumbnailBackgroundColor_str = data.thumbnailBackgroundColor_str;
		this.thumbnailOverlayBackgroundColor_str = data.thumbnailOverlayBackgroundColor_str;
		this.grabIconPath_str = data.grabIconPath_str;
		this.handIconPath_str = data.handIconPath_str;
		this.grabIconModernBrowsersPath_str = data.grabIconModernBrowsersPath_str;
		this.dragDirection_str = data.dragDirection_str;
		this.autoScrollDirection_str = data.autoScrollDirection_str;
		this.thumbnailTransitionType_str = data.thumbnailTransitionType_str;
		
		this.stageWidth;
		this.stageHeight;
		this.thumbnailMaxWidth = data.thumbnailMaxWidth;
		this.thumbnailMaxHeight = data.thumbnailMaxHeight;
		this.maxColumns = 10;
		this.row;
		this.col;
		this.nrImgH;
		this.nrImgV;
		this.posX;
		this.posY;
		this.newPosX;
		this.newPosY;
		this.curMaximizedRow;
		this.curMaximizedCol;
		this.colRef;
		this.colRow;
		this.lastColRef = 1000;
		this.lastRowRef = 1000;
		this.friction = .9;
	    this.vx = 0;
		this.vy = 0;
		this.scale = 1;
		this.minScale = data.minScale;
		this.maxScale = data.maxScale;
		this.autoScrollSpeed = data.autoScrollSpeed;
		
		//if(parent.displayType == FWDIGP.FULL_SCREEN)  self.minScale = 1;
		this.prevScale = 1;
		this.firstTouchMouseX;
		this.firstTouchMouseY;
		this.lastMouseX;
		this.lastMouseY;
		this.lastMouseX2;
		this.lastMouseY2;
		this.lastThumsbHolderX;
		this.lastThumsbHolderY;
		this.thumbW = 0;
		this.thumbH = 0;
		this.totalThumbs;
		this.curId = 0;
		this.maxThumbs = 150;
		this.pinchDist;
		
		this.checkThumbnailsOnHideId_int;
		this.resizeHandlerIntervalId_int;
		this.loopId_int;
		this.disableOpenLighboxId_to;
		this.initGridWhenStageIsAvailableId_to;
		this.disableOnDragOrSwipeId_to;
		
		this.keepThumbnailsOriginalSizeOnGridStart_bl =  data.keepThumbnailsOriginalSizeOnGridStart_bl;
		this.hasPointerEvent_bl = FWDRLUtils.hasPointerEvent;
		this.enableVisitedThumbnails_bl = data.enableVisitedThumbnails_bl;
		this.autoScroll_bl = data.autoScroll_bl;
		this.isAutoScolling_bl = this.autoScroll_bl;
		this.isDsbShowed_bl = false;
		this.isZooming_bl = false;
		this.isMobile_bl = FWDRLUtils.isMobile;
		this.isDragged_bl = false;
		this.isShowedAtLeastOneTime_bl = false;
		this.disableOpenLighbox_bl = false;
		this.allowToSwtchCategory_bl = false;
		this.isCategorySwitching_bl = false;
		this.isCategoryChanging_bl = false;
		this.isGridInitialized_bl = false;
		this.disableDrawGrid_bl = false;
		this.disableOnDragOrSwipe_bl = false;
		this.addZoomSupport_bl = data.addZoomSupport_bl;
		this.addDragAndSwipeSupport_bl = data.addDragAndSwipeSupport_bl;
		this.disableThumbnailInteractivity_bl = data.disableThumbnailInteractivity_bl;
		this.allowToResizeGrid_bl = false;
		
		//#######################################//
		/* initialize */
		//#######################################//
		this.init = function(){
			if(this.isMobile_bl) this.friction = .85;
			this.setResizableSizeAfterParent();
			this.setBkColor(this.backgroundColor_str);
			this.initComponentId_to = setTimeout(this.initializeComponent, 100);
		};
		
		//#############################################//
		/* initialize component */
		//#############################################//
		this.initializeComponent = function(){
			if(self.addDragAndSwipeSupport_bl) self.getStyle().cursor = 'url(' + self.handIconPath_str + '), default';
			
			self.setupThumbsHolder();
			self.setupPoolThumbs();
			self.setupDispatchHideHelpScreen();
			self.setupDisableDragScreen();
			self.setRect();
			setTimeout(self.initilizeAndStartGrid, 150);
		};
	
		//#############################################//
		/* resize handler */
		//#############################################//
		this.resizeAndPosition = function(overwrite){
			self.stageWidth = parent.stageWidth;
			self.stageHeight = parent.stageHeight;		
			self.setWidth(self.stageWidth);
			self.setHeight(self.stageHeight);
			
			if(!self.allowToSwtchCategory_bl){
				self.dsb_do.setWidth(self.stageWidth);
				self.dsb_do.setHeight(self.stageHeight);
			}
		
			if(self.allowToResizeGrid_bl){
				self.drawGrid();
				self.removeThumbsIfNotOnScreen();
			}
		};
		
		this.setRect = function(){
			this.rect = self.getRect();
		};
		
		//#####################################//
		/* set cur category */
		//#####################################//
		this.updateCategory = function(curCat_ar){
			
			if(this.allowToSwtchCategory_bl){
				this.isCategoryChanging_bl = true;
				this.disableOnDragOrSwipe_bl = true;
				this.allowToResizeGrid_bl = false;
				this.showDsb();
				this.stopToLoop();
				if(this.isMobile_bl){
					this.removeZoomDragAndSwipeForMobile();
				}else{
					this.removeDragAndScrollForDesktop();
					this.removeAutoScrollSupport(true);
					this.removeDesktopZoomSupport();
					this.dsb_do.getStyle().cursor = 'default';
				}
				
				//hide thumbnails.
				var thumb;
				for(var i = 0; i<this.maxThumbs; i++){
					thumb = this.poolThumbs_ar[i];
					if(!thumb.isAvailable_bl){
						thumb.isAvailable_bl = true;
						thumb.hide();
					} 
				}
				
				this.checkThumbnailsOnHideId_int = setInterval(function(){
					for(var i = 0; i<self.maxThumbs; i++){
						thumb = self.poolThumbs_ar[i];
						if(thumb.isTweeninigOnHide_bl){
							return;
						} 
					}
					clearTimeout(self.checkThumbnailsOnHideId_int);
					
					self.initilizeAndStartGrid();
					return
				}, 16);
			}
			
			
			this.playlist_ar = curCat_ar;
			this.totalThumbs = this.playlist_ar.length;
			this.allowToSwtchCategory_bl = true;
			this.isCategoryChanging_bl = true;
			//this.allowToResizeGrid_bl = true;
		};
			
		//#####################################//
		/* Setup disable drag screen */
		//#####################################//
		this.setupDisableDragScreen = function(){
			if(!this.dsb_do){
				this.dsb_do = new FWDRLDisplayObject("div");
				if(FWDRLUtils.isIE){
					this.dsb_do.setBkColor("#FF0000");
					this.dsb_do.setAlpha(.0001);
				}
				this.addChild(this.dsb_do);
			}
			if(this.dragDirection_str != "none") this.dsb_do.getStyle().cursor = 'url(' + self.grabIconPath_str + '), default';
			
			this.hideDsb();
		};
		
		this.showDsb = function(){
			if(self.isDsbShowed_bl) return;
			self.isDsbShowed_bl = true;
			this.dsb_do.setVisible(true);
			this.dsb_do.setWidth(self.stageWidth);
			this.dsb_do.setHeight(self.stageHeight);
			if(this.lastHoveredThumb_do && !this.isMobile_bl){
				this.lastHoveredThumb_do.setNormalState(true);
				this.lastHoveredThumb_do = null;
			}
		};
		
		this.hideDsb = function(){
			if(!self.isDsbShowed_bl) return;
			self.isDsbShowed_bl = false;
			this.dsb_do.setVisible(false);
			this.dsb_do.setWidth(0);
			this.dsb_do.setHeight(0);
			if(this.dragDirection_str != "none") this.dsb_do.getStyle().cursor = 'url(' + self.grabIconPath_str + '), default';
		};
		
		//#############################################//
		/* Setup hider */
		//#############################################//
		this.addAutoScrollSupport = function(){
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					self.screen.addEventListener("MSPointerDown", self.onAutoScrollDisable);
				}else{
					self.screen.addEventListener("touchstart", self.onAutoScrollDisable);
				}
			}else if(window.addEventListener){
				self.screen.addEventListener("mouseover", self.onAutoScrollDisable);
			}else if(document.attachEvent){
				self.screen.attachEvent("onmouseover", self.onAutoScrollDisable);
			}
		};
		
		this.removeAutoScrollSupport = function(removeAll){
			if(this.autoScroll_bl) self.isAutoScolling_bl = true;
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					window.removeEventListener("MSPointerDown", self.onAutoScrollEnable);
					if(removeAll) window.removeEventListener("MSPointerDown", self.onAutoScrollEnable);
				}else{
					window.removeEventListener("touchstart", self.onAutoScrollEnable);
					if(removeAll) window.removeEventListener("touchstart", self.onAutoScrollEnable);
				}
			}else if(window.removeEventListener){
				window.removeEventListener("mousemove", self.onAutoScrollEnable);
				if(removeAll) window.removeEventListener("mousemove", self.onAutoScrollEnable);
			}else if(document.detachEvent){
				document.detachEvent("onmousemove", self.onAutoScrollEnable);
				if(removeAll) document.detachEvent("onmousemove", self.onAutoScrollEnable);
			}
		};
		
		this.onAutoScrollDisable = function(){
			if(!self.isAutoScolling_bl) return;
			if(!self.addZoomSupport_bl && !self.addDragAndSwipeSupport_bl) return;
			self.isAutoScolling_bl = false;
			if(self.isMobile_bl){
				if(self.hasPointerEvent_bl){
					window.addEventListener("MSPointerDown", self.onAutoScrollEnable);
				}else{
					window.addEventListener("touchstart", self.onAutoScrollEnable);
				}
			}else if(window.addEventListener){
				window.addEventListener("mousemove", self.onAutoScrollEnable);
			}else if(document.attachEvent){
				document.detachEvent("onmousemove", self.onAutoScrollEnable);
				document.attachEvent("onmousemove", self.onAutoScrollEnable);
			}
		};
		
		this.onAutoScrollEnable = function(e){
			if(!self.rect) return
			var vpc = FWDRLUtils.getViewportMouseCoordinates(e);
			var x = vpc.screenX;
			var y = vpc.screenY;
			
			if(!(x >= self.rect.left && x <= self.rect.left +(self.rect.right - self.rect.left) 
			  && y >= self.rect.top && y <= self.rect.top + (self.rect.bottom - self.rect.top))){
				self.removeAutoScrollSupport();
			}
		};
		
		//####################################//
		/* setup thumbnail holder*/
		//####################################//
		this.setupThumbsHolder = function(){
			if(this.thumbsHolder_do) return;
			this.thumbsHolder_do = new FWDRLTransformDisplayObject("div");
			this.thumbsHolder_do.getStyle().overflow = "visible";
			this.addChild(this.thumbsHolder_do);
		};
		
		
		//###################################//
		/* setup pooling thumbs and methods */
		//##################################//
		this.setupPoolThumbs = function(){
			if(self.poolThumbs_ar.length > 0) return;
			var thumb;
			var iconType;
			var thumbnailOverlayColor;
			var totalPlayListEntry = this.playlist_ar.length;
			
			if (this.isMobile_bl) this.maxThumbs = 100;
		
			//if(this.maxThumbs < this.totalThumbs) this.maxThumbs = this.totalThumbs;
			for(var i = 0; i<this.maxThumbs; i++){
				FWDIGPThumb.setPrototype();
				thumb = new FWDIGPThumb(
						this,
						this.thumbnailTransitionType_str,
						this.thumbnailBackgroundColor_str, 
						this.thumbnailOverlayBackgroundColor_str,
						data.thumbnailOverlayOpacity, 
						data.showThumbnailOverlay_bl, 
						this.isMobile_bl,
						data.showThumbnailIcon_bl,
						self.disableThumbnailInteractivity_bl);
				thumb.setVisible(false);
				thumb.totalWidth =  this.thumbW;
				thumb.totalHeight = this.thumbH;
				
				thumb.addListener(FWDIGPThumb.MOUSE_OVER, this.onMouseOverHandler);
				thumb.addListener(FWDIGPThumb.MOUSE_UP, this.onMouseUpHandler);
				this.poolThumbs_ar[i] = thumb;
				this.thumbsHolder_do.addChild(thumb);
			}
		};
		
		this.onMouseOverHandler = function(e){
			self.lastHoveredThumb_do = self.thumbs_ar[e.gridPosition];
		};
		
		this.onMouseUpHandler = function(e){
			if(self.disableOnDragOrSwipe_bl) return;
			self.setVisitedThumbnail(self.playlist_ar[e.id].thumbnailPath_str);
			e.target.setNormalState(true);
			self.getCorrectId(e.id);
		};
		
		
		//###############################################//
		/* get the correct id */
		//###############################################//
		this.getCorrectId = function(pId){
			
			var regularId = pId;
			var tempId = pId;
			
			var type = this.playlist_ar[regularId].type_str;
			
			if(type != FWDIGP.LINK){
				for(var i=0; i<this.totalThumbs; i++){
					if(i < pId  && this.playlist_ar[i].type_str == FWDIGP.LINK){
						regularId -= 1;
					}
				};
			}
			
			if(type == "link"){
				window.open(this.playlist_ar[regularId].url, this.playlist_ar[regularId].target);
			}else{
				self.dispatchEvent(FWDIGPThumb.MOUSE_UP, {id:regularId});
			}
		};
		
		//#################################//
		/* get / add thumb back to pool array. */
		//######################################//
		this.getThumb = function(){
			var thumb;
			var thumbAvailable = false;
			var count = 0;
			
			while(!thumbAvailable){
				thumb = this.poolThumbs_ar[count];
				if(!thumb) return;
				if(thumb.isAvailable_bl){
					thumb.setVisible(true);
					thumb.isAvailable_bl = false;
					thumbAvailable = true;
					return thumb;
				}
				count++; 
			}
		};
		
		this.addThumbBack = function(thumb){
			FWDAnimation.killTweensOf(thumb);
			thumb.isAvailable_bl = true;
			thumb.setVisible(false);
		};
		
		//#########################################//
		/* Update visited thumbnails */
		//#########################################//
		this.setVisitedThumbnail = function(path){
			if(!this.enableVisitedThumbnails_bl) return;
		
			var found_bl = false;
			var thumb;
			
			for(var i=0; i<this.visitedThumbnailsPaths_ar.length; i++){
				if(this.visitedThumbnailsPaths_ar[i] == path){
					found_bl = true;
					break;
				}
			}
			
			if(!found_bl) this.visitedThumbnailsPaths_ar.push(path);
			
			for(var i=0; i<this.poolThumbs_ar.length; i++){
				thumb = this.poolThumbs_ar[i];
				if(!thumb.isAvailable_bl){
					for(var j=0; j<this.visitedThumbnailsPaths_ar.length; j++){
						 if(thumb.thumbPath_str == this.visitedThumbnailsPaths_ar[j]){
							 thumb.isVisited_bl = true;
							 thumb.setToIsVisited();
							 break;
						 }
					}
				}
			}
		};
		
		this.getVisitedThumb = function(thumbnailPath_str){
			if(!this.enableVisitedThumbnails_bl) return;
			for(var i=0; i<this.visitedThumbnailsPaths_ar.length; i++){
				if(thumbnailPath_str == this.visitedThumbnailsPaths_ar[i]) return true;
			}
			return false;
		};
		
		//#########################################//
		/* start loop */
		//#########################################//
		this.startToLoop = function(){
			this.loopId_int = setInterval(this.animLoop, 16);
		};
		
		this.stopToLoop = function(){
			clearInterval(this.loopId_int);
		};
			
		this.animLoop = function(){
			if(!self.isZooming_bl){
				self.scrollGrid();
				if(!self.disableDrawGrid_bl){
					self.drawGrid();
					self.removeThumbsIfNotOnScreen();
				}
			}
		};
		
		//################################//
		/* initialize and start grid */
		//################################//
		this.initilizeAndStartGrid = function(){
			if(self == null) return;
			
			if(isNaN(parent.stageWidth)){
				clearTimeout(self.initGridWhenStageIsAvailableId_to);
				self.initGridWhenStageIsAvailableId_to = setTimeout(self.initilizeAndStartGrid, 100);
				return;
			}
			
			self.disableOnDragOrSwipe_bl = false;
			
			if(self.thumbsHolder_do.hasTransform2d_bl && self.thumbsHolder_do){
				self.scale = self.prevScale = 1;
				self.thumbsHolder_do.setScale2(self.scale);
			}
			
			self.thumbs_ar = [];
			self.grid_ar = [];
			self.resizeAndPosition();
			self.initGrid();
			if(self.autoScroll_bl) self.addAutoScrollSupport();
			if(self.isMobile_bl){
				self.addZoomDragAndSwipeForMobile();
			}else{
				if(self.addDragAndSwipeSupport_bl) self.addDragAndScrollForDesktop();
				if(self.addZoomSupport_bl) self.addDesktopZoomSupport();
			}
			self.startToLoop();
			self.hideDsb();
			self.isGridInitialized_bl = true;
			self.allowToResizeGrid_bl = true;
			self.isCategoryChanging_bl = false;
		};
		
		
		//################################//
		/* init grid */
		//################################//
		this.initGrid = function(){
			
		    var stageW;
			var stageH;
			var maxRows;
			var maxColumns;
			var thumb;
			var matchId;
			var newId;
			var curPositionInGrid;
			var row;
			var col;	
			var nrImgH;
			var nrImgV;
			var count = 0;
			var curMatrixRow;
			var curMatrixCol;
			
			
			stageW = this.stageWidth;
			stageH = this.stageHeight;
			
			maxRows = Math.floor(stageH/this.thumbnailMaxHeight);
			maxColumns =  Math.floor(stageW/this.thumbnailMaxWidth);
			
			this.thumbW = Math.round(stageW/maxColumns);
			this.thumbH = Math.round(stageH/maxRows);
			
			if(this.thumbW > this.thumbnailMaxWidth) maxColumns ++;
			if(this.thumbH > this.thumbnailMaxHeight) maxRows ++;
			
			this.thumbW = Math.round(stageW/maxColumns);
			this.thumbH = Math.round(stageH/maxRows);
			
			if(this.keepThumbnailsOriginalSizeOnGridStart_bl){
				this.thumbW = this.thumbnailMaxWidth; 
				this.thumbH = this.thumbnailMaxHeight;
			}
			
			if(maxColumns > this.maxColumns){
				maxColumns = this.maxColumns;
				this.thumbW = Math.round(stageW/maxColumns);
				this.thumbH = Math.round(this.thumbH * (this.thumbW/this.thumbnailMaxWidth));
			}
			
			this.posX = -this.thumbW * FWDIGPThumbsManager.GRID_SIZE/2;
			this.posY = -this.thumbH * FWDIGPThumbsManager.GRID_SIZE/2;
			
			nrImgH = Math.ceil(stageW / this.thumbW);
			nrImgV = Math.ceil(stageH / this.thumbH);
			
			for (row=0; row < nrImgV; row++) {
				for (col=0; col<nrImgH; col++){
					
					curMatrixRow = FWDIGPThumbsManager.GRID_SIZE/2 + row;
					curMatrixCol = FWDIGPThumbsManager.GRID_SIZE/2 + col;
				
					curPositionInGrid = curMatrixRow * FWDIGPThumbsManager.GRID_SIZE + curMatrixCol;
						
					newId = count % self.totalThumbs;
				
					this.grid_ar[curPositionInGrid] = newId;
							
					thumb = this.getThumb();
					this.thumbs_ar[curPositionInGrid] = thumb;
					thumb.gridPosition = curPositionInGrid;
					thumb.id = newId;
					
					thumb.totalW = this.thumbW;
					thumb.totalH = this.thumbH;
					thumb.finalX = curMatrixCol * this.thumbW;
					thumb.finalY = curMatrixRow * this.thumbH;
					thumb.setX(thumb.finalX);
					thumb.setY(thumb.finalY);
					thumb.resizeThumb();
					thumb.isAvailable_bl = false;
					thumb.iconPath_str = this.playlist_ar[newId].thumbIconPath_str;
					thumb.thumbnailOverlayColor_str = this.playlist_ar[newId].thumbnailOverlayColor || self.thumbnailOverlayBackgroundColor_str;
					if(self.getVisitedThumb(this.playlist_ar[newId].thumbnailPath_str)) thumb.isVisited_bl = true;
					thumb.show(this.playlist_ar[newId].thumbnailPath_str);
					count++;
				}
			}
			FWDAnimation.killTweensOf(this.thumbsHolder_do);
			this.thumbsHolder_do.setX(this.posX);
			this.thumbsHolder_do.setY(this.posY);
		};
		
		//######################################//
		/* Draw grid */
		//######################################//
		this.drawGrid =  function(){
			
			var stageW;
			var stageH;
			var matchId;
			var newId;
			var curPositionInGrid;
			var row;
			var col;
			var curMatrixRow;
			var curMatrixCol;
			var nrImgH;
			var nrImgV;
			var rowRef;
			var colRef;
			
			stageW = this.stageWidth;
			stageH = this.stageHeight;
			
			var dx = Math.abs(this.posX % (this.thumbW * self.scale));
			var dy = Math.abs(this.posY % (this.thumbH * self.scale));
			
			nrImgH = Math.ceil(stageW / (this.thumbW * self.scale));
			nrImgV = Math.ceil(stageH / (this.thumbH * self.scale));
			
			
			if (dx > nrImgH * (this.thumbW * self.scale) - stageW){
				nrImgH++;
			}
			
			if (dy > nrImgV * (this.thumbH * self.scale) - stageH){
				nrImgV++;
			}
			
			rowRef = Math.floor(this.posY/-(this.thumbH * self.scale));
			colRef = Math.floor(this.posX/-(this.thumbW * self.scale));

			for (row=0; row < nrImgV; row++) {
				for (col=0; col < nrImgH; col++){
					
					curMatrixRow = rowRef + row;
					curMatrixCol = colRef + col;
					
					curPositionInGrid = curMatrixRow * FWDIGPThumbsManager.GRID_SIZE + curMatrixCol;
				
					if (this.thumbs_ar[curPositionInGrid] == undefined){
						if(this.grid_ar[curPositionInGrid] == undefined){
							matchId = false;
							
							while(!matchId){
								matchId = true;
									
								newId = Math.floor(Math.random() * this.totalThumbs);
								
								//check left top.
								if (self.grid_ar[((curMatrixRow - 1) * FWDIGPThumbsManager.GRID_SIZE + curMatrixCol - 1)] == newId){
									matchId = false;
								}
								
								//check left.
								if (self.grid_ar[curMatrixRow * FWDIGPThumbsManager.GRID_SIZE + curMatrixCol - 1] == newId){
									matchId = false;
								}
								
								//check left bottom.
								if (self.grid_ar[((curMatrixRow + 1) * FWDIGPThumbsManager.GRID_SIZE + curMatrixCol - 1)] == newId){
									matchId = false;
								}
								
								//check up.
								if (self.grid_ar[((curMatrixRow - 1) * FWDIGPThumbsManager.GRID_SIZE + curMatrixCol)] == newId){
									matchId = false;
								}
								
								//check down.
								if (self.grid_ar[((curMatrixRow + 1) * FWDIGPThumbsManager.GRID_SIZE + curMatrixCol)] == newId){
									matchId = false;
								}
								
								//check right top.
								if (self.grid_ar[((curMatrixRow - 1) * FWDIGPThumbsManager.GRID_SIZE + curMatrixCol + 1)] == newId){
									matchId = false;
								}
								
								//check right.
								if (self.grid_ar[(curMatrixRow * FWDIGPThumbsManager.GRID_SIZE + curMatrixCol + 1)] == newId){
									matchId = false;
								}
								
								//check right down.
								if (self.grid_ar[((curMatrixRow + 1) * FWDIGPThumbsManager.GRID_SIZE + curMatrixCol + 1)] == newId){
									matchId = false;
								}
							}
						}else{
							newId = this.grid_ar[curPositionInGrid];	
						}
					
	
						this.grid_ar[curPositionInGrid] = newId;
						thumb = this.getThumb();	
						
						if(!thumb) return;
						
						this.thumbs_ar[curPositionInGrid] = thumb;
						thumb.gridPosition = curPositionInGrid;
						thumb.id = newId;
						
						thumb = self.thumbs_ar[curPositionInGrid];
						thumb.totalW = this.thumbW;
						thumb.totalH = this.thumbH;
						thumb.finalX = curMatrixCol * this.thumbW;
						thumb.finalY = curMatrixRow * this.thumbH;
						thumb.setX(thumb.finalX);
						thumb.setY(thumb.finalY);
						thumb.resizeThumb();

						thumb.iconPath_str = this.playlist_ar[newId].thumbIconPath_str;
						thumb.thumbnailOverlayColor_str = this.playlist_ar[newId].thumbnailOverlayColor || self.thumbnailOverlayBackgroundColor_str;
						if(self.getVisitedThumb(this.playlist_ar[newId].thumbnailPath_str)) thumb.isVisited_bl = true;
						thumb.show(this.playlist_ar[thumb.id].thumbnailPath_str, self.setThumbsSizeOnceOnScroll);
					}
				}
			}
			
			self.setThumbsSizeOnceOnScroll = false;
		};
		
		//##########################################//
		/* remove thumbs if they are not on screen */
		//#########################################//
		this.removeThumbsIfNotOnScreen = function(){
			var thumb;
			var i;
			
			for(i=0; i<this.maxThumbs; i++){
				thumb = this.poolThumbs_ar[i];
					
				if(this.posX + thumb.finalX * self.scale < -this.thumbW * self.scale
					|| this.posX + thumb.finalX * self.scale > this.stageWidth
					|| this.posY + thumb.finalY * self.scale < -this.thumbH * self.scale
					|| this.posY + thumb.finalY * self.scale > this.stageHeight
				){
					if(!thumb.isAvailable_bl){
						thumb.removeImage();
						this.addThumbBack(thumb);
						this.thumbs_ar[thumb.gridPosition] = undefined;
					}
				}
			}
		};
		
		//##########################################//
		/* add mouse wheel support */
		//##########################################//
		this.addDesktopZoomSupport = function(){
			if(window.addEventListener){
				self.screen.addEventListener ("mousewheel", self.mouseWheelHandler);
				self.screen.addEventListener('DOMMouseScroll', self.mouseWheelHandler);
			}
		};
		
		this.removeDesktopZoomSupport = function(){
			if(window.removeEventListener){
				self.screen.removeEventListener ("mousewheel", self.mouseWheelHandler);
				self.screen.addEventListener('DOMMouseScroll', self.mouseWheelHandler);
			}
		};
		
		//##########################################//
		/* zoom function */
		//##########################################//
		this.mouseWheelHandler = function(e, posX, posY){
			if(e){
				if(e.preventDefault){
					e.preventDefault();
				}else{
					return false;
				}
			}
			if(self.isDragged_bl && !self.isMobile_bl) return;
			
			var vmc;
			var so; 
			var tweenDuration;
			
			self.vx = 0;
			self.vy = 0;
			
			if(e){
				var dir = e.detail || e.wheelDelta;	
				if(e.wheelDelta) dir *= -1;
				
				if(dir > 0){
					if (self.scale == self.minScale) return;
					self.scale -= .2;
					
					if (self.scale < self.minScale){
						self.scale = self.minScale;
					}
				}else if(dir < 0){
					if (self.scale == self.maxScale) return;
					self.scale += .2;
					if (self.scale > self.maxScale){
						self.scale = self.maxScale;
					}
				}
			}
			
			var curXScaleDividedByPrevScale = self.scale / self.prevScale;
			var curYScaleDividedByPrevScale = self.scale / self.prevScale;
			
			if (!FWDAnimation.isTweening(self)){
				self.newPosX = self.posX;
				self.newPosY = self.posY;
			}
		
			self.newPosX *= curXScaleDividedByPrevScale;
			self.newPosY *= curYScaleDividedByPrevScale;
			
			if(self.isMobile_bl){
				self.newPosX += posX - curXScaleDividedByPrevScale * posX;
				self.newPosY += posY - curXScaleDividedByPrevScale * posY;
			}else{
				vmc = FWDRLUtils.getViewportMouseCoordinates(e);
				self.newPosX += (vmc.screenX - parent.globalX) - (curXScaleDividedByPrevScale * (vmc.screenX - parent.globalX));
				self.newPosY += (vmc.screenY - parent.globalY) - (curXScaleDividedByPrevScale  * (vmc.screenY - parent.globalY));
			}
			
			self.newPosX = self.newPosX;
			self.newPosY = self.newPosY;
			
			FWDAnimation.killTweensOf(self);
			FWDAnimation.killTweensOf(self.thumbsHolder_do);
			if(FWDRLUtils.isIE){
				FWDAnimation.to(self, .6, {posX:self.newPosX, posY:self.newPosY, ease:Expo.easeOut});
				FWDAnimation.to(self.thumbsHolder_do, .6, {x:self.newPosX, y:self.newPosY, scale:self.scale, onComplete:self.zoomCompleteHandler, ease:Expo.easeOut});
			}else{
				if(self.isMobile_bl){
					tweenDuration = .2;
				}else{
					tweenDuration = .6;
				}
				FWDAnimation.to(self, tweenDuration, {posX:self.newPosX, posY:self.newPosY, ease:Quint.easeOut});
				FWDAnimation.to(self.thumbsHolder_do, tweenDuration, {x:self.newPosX, y:self.newPosY, scale:self.scale, onComplete:self.zoomCompleteHandler, ease:Quint.easeOut});
			}
			if(self.lastHoveredThumb_do && !self.disableThumbnailInteractivity_bl) self.lastHoveredThumb_do.scaleSmallIconOnTween();
		
			self.prevScale = self.scale;
			
			setThumbsSizeOnceOnScroll = true;
			self.isZooming_bl = true;
			self.setThumbsSizeOnceOnScroll = true;
		};
		
		this.zoomCompleteHandler = function(){
			self.isZooming_bl = false;
			self.drawGrid();
			self.removeThumbsIfNotOnScreen();
		};
	
		//######################################//
		/* setup scrollbar for mobile */
		//######################################//
		this.addZoomDragAndSwipeForMobile = function(){
			if(self.hasPointerEvent_bl){
				this.screen.addEventListener("MSPointerDown", this.onTouchStart);
			}else{
				this.screen.addEventListener("touchstart", this.onTouchStart);
			}
		};	
		
		this.removeZoomDragAndSwipeForMobile = function(){
			if(self.hasPointerEvent_bl){
				this.screen.removeEventListener("MSPointerDown", this.onTouchStart);
				window.removeEventListener("MSPointerUp", self.windowOnTouchEnd);
				window.removeEventListener("MSPointerMove", self.windowOnTouchMove);
			}else{
				this.screen.removeEventListener("touchstart", this.onTouchStart);
				window.removeEventListener("touchend", self.windowOnTouchEnd);
				window.removeEventListener("touchmove", self.windowOnTouchMove);
			}
		};	
		
		this.onTouchStart = function(e){
			if(self.isZooming_bl) return;
			if(e.preventDefault) e.preventDefault();
		
			self.vx = 0;
			self.vy = 0;
			
			if(e.touches){
				self.lastMouseX = self.firstTouchMouseX = e.touches[0].pageX - parent.globalX - parent.scrollOffsets.x;
				self.lastMouseY = self.firstTouchMouseY = e.touches[0].pageY - parent.globalY - parent.scrollOffsets.y;
			}else{
				self.lastMouseX = self.firstTouchMouseX = e.pageX - parent.globalX - parent.scrollOffsets.x;
				self.lastMouseY = self.firstTouchMouseY = e.pageY - parent.globalY - parent.scrollOffsets.y;
			}
			
			if(e.touches && e.touches.length == 2 && self.addZoomSupport_bl){
				self.disableOnDragOrSwipe_bl = true;
				self.lastMouseX2 = e.touches[1].pageX - parent.globalX - parent.scrollOffsets.x;
				self.lastMouseY2 = e.touches[1].pageY - parent.globalY - parent.scrollOffsets.y;
			}else if(e.touches && e.touches.length > 2 && self.addZoomSupport_bl){
				return;
			}
			
			if(self.hasPointerEvent_bl){
				window.addEventListener("MSPointerUp", self.windowOnTouchEnd);
				window.addEventListener("MSPointerMove", self.windowOnTouchMove);
			}else{
				window.addEventListener("touchend", self.windowOnTouchEnd);
				window.addEventListener("touchmove", self.windowOnTouchMove);
			}
		};
	
		this.windowOnTouchMove = function(e){
			//if(self.isZooming_bl) return;
			if(e.preventDefault) e.preventDefault();
			
			var lcX;
			var lcY;
			var toAddX;
			var toAddY2;
			var posX1;
			var posY1;
			var posX2;
			var posY2;
			var pinchDist;
			var dx;
			var dy;
			var finalPosX;
			var finalPosY;
			
			if(e.touches){
				lcX = e.touches[0].pageX - parent.globalX - parent.scrollOffsets.x;
				lcY = e.touches[0].pageY - parent.globalY - parent.scrollOffsets.y;
			}else{
				lcX = e.pageX - parent.globalX - parent.scrollOffsets.x;
				lcY = e.pageY - parent.globalY - parent.scrollOffsets.y;
			}
			
			if(self.firstTouchMouseX < lcX - 1 || self.firstTouchMouseX > lcX + 1
			  || self.firstTouchMouseY < lcY - 1 || self.firstTouchMouseY > lcY + 1){
				self.disableOnDragOrSwipe_bl = true;
			}
			
			if(self.hasPointerEvent_bl){
				toAddX = e.pageX - parent.globalX - self.lastMouseX - parent.scrollOffsets.x;
				toAddY = e.pageY - parent.globalY - self.lastMouseY - parent.scrollOffsets.y;
				self.lastMouseX = lcX;
				self.lastMouseY = lcY;
				if(self.dragDirection_str == "both"){
					self.posX += toAddX;
					self.posY += toAddY;
				}else if(self.dragDirection_str == "horizontal"){
					self.posX += toAddX;
				}else if(self.dragDirection_str == "vertical"){
					self.posY += toAddY;
				}
				self.isDragged_bl = true;
			}else if(e.touches && e.touches.length == 1 && self.addDragAndSwipeSupport_bl){
				toAddX = e.touches[0].pageX - parent.globalX - self.lastMouseX - parent.scrollOffsets.x;
				toAddY = e.touches[0].pageY - parent.globalY - self.lastMouseY - parent.scrollOffsets.y;
				self.lastMouseX = lcX;
				self.lastMouseY = lcY;
				if(self.dragDirection_str == "both"){
					self.posX += toAddX;
					self.posY += toAddY;
				}else if(self.dragDirection_str == "horizontal"){
					self.posX += toAddX;
				}else if(self.dragDirection_str == "vertical"){
					self.posY += toAddY;
				}
				self.isDragged_bl = true;
			}else if(e.touches && e.touches.length == 2 && self.addZoomSupport_bl){
				posX1 = lcX;
				posY1 = lcY;
				posX2 = e.touches[1].pageX - parent.globalX - parent.scrollOffsets.x;
				posY2 = e.touches[1].pageY - parent.globalY - parent.scrollOffsets.y;
				finalPosX = (posX2 + posX1)/2;
				finalPosY = (posY2 + posY1)/2;
				
				dx = posX1 - posX2;
				dy = posY1 - posY2;
				pinchDist = Math.sqrt(dx * dx + dy * dy);
				
				if(parseInt(self.pinchDist) != parseInt(pinchDist)){
					if(self.pinchDist > pinchDist){
						self.scale -= 0.04;
						if (self.scale < .8){
							self.scale = .8;
						}
					}else{
						self.scale += 0.04;
						if (self.scale > 1.6){
							self.scale = 1.6;
						}
					}
				}
				
				self.pinchDist = pinchDist;
				self.mouseWheelHandler(null, finalPosX, finalPosY);	
			}
		};
		
		this.windowOnTouchEnd = function(e){
			if(e.preventDefault) e.preventDefault();
			if(self.hasPointerEvent_bl){
				window.removeEventListener("MSPointerUp", self.windowOnTouchEnd);
				window.removeEventListener("MSPointerMove", self.windowOnTouchMove);
				clearTimeout(self.disableOnDragOrSwipeId_to);
				self.disableOnDragOrSwipeId_to = setTimeout(function(){
					 self.disableOnDragOrSwipe_bl = false;
				}, 200);
			}else{
				if(e.touches.length == 0){
					clearTimeout(self.disableOnDragOrSwipeId_to);
					self.disableOnDragOrSwipeId_to = setTimeout(function(){
						 self.disableOnDragOrSwipe_bl = false;
					}, 200);
					window.removeEventListener("touchend", self.windowOnTouchEnd);
					window.removeEventListener("touchmove", self.windowOnTouchMove);
				}
			}
			
			
		
			self.isDragged_bl = false;
		};
		
		
		//######################################//
		/* setup scrolling for pc */
		//######################################//
		this.addDragAndScrollForDesktop = function(){
			if(this.screen.addEventListener){
				this.screen.addEventListener("mousedown", this.onMouseDown);
			}else{
				this.screen.attachEvent("onmousedown", this.onMouseDown);
			}
		};
		
		this.removeDragAndScrollForDesktop = function(){
			if(this.screen.removeEventListener){
				this.screen.removeEventListener("mousedown", this.onMouseDown);
				window.removeEventListener("mouseup", self.windowOnMoveUp);
				window.removeEventListener("mousemove", self.windowOnMouseMove);
			}else{
				this.screen.detachEvent("onmousedown", this.onMouseDown);
				document.detachEvent("onmouseup", self.windowOnMoveUp);
				document.detachEvent("onmousemove", self.windowOnMouseMove);
			}
		};
		
		this.onMouseDown = function(e){
			if(e.preventDefault) e.preventDefault();
			
			var vpc = FWDRLUtils.getViewportMouseCoordinates(e);
			
			self.vx = 0;
			self.vy = 0;
			self.lastMouseX = vpc.screenX;
			self.lastMouseY = vpc.screenY;
						
			if(window.addEventListener){
				setTimeout(function(){
					if(self == null) return;
					window.addEventListener("mouseup", self.windowOnMoveUp);
					window.addEventListener("mousemove", self.windowOnMouseMove);
				}, 10);
			}else{
				setTimeout(function(){
					if(self == null) return;
					document.attachEvent("onmousemove", self.windowOnMouseMove);
					document.attachEvent("onmouseup", self.windowOnMoveUp);
				}, 10);
			}
		};
		
		this.windowOnMouseMove = function(e){
			var vpc = FWDRLUtils.getViewportMouseCoordinates(e);
			
			var toAddX = vpc.screenX - self.lastMouseX;
			var toAddY = vpc.screenY - self.lastMouseY;
		
			
			self.disableOpenLighbox_bl = true;
			self.showDsb();
			
			if(self.dragDirection_str == "both"){
				self.posX += toAddX;
				self.posY += toAddY;
			}else if(self.dragDirection_str == "horizontal"){
				self.posX += toAddX;
			}else if(self.dragDirection_str == "vertical"){
				self.posY += toAddY;
			}
			
			self.lastMouseX = vpc.screenX;
			self.lastMouseY = vpc.screenY;
			self.isDragged_bl = true;
		};
		
		this.windowOnMoveUp = function(){
			
			self.hideDsb();
			
			if(self.screen.addEventListener){
				window.removeEventListener("mouseup", self.windowOnMoveUp);
				window.removeEventListener("mousemove", self.windowOnMouseMove);
			}else{
				document.detachEvent("onmouseup", self.windowOnMoveUp);
				document.detachEvent("onmousemove", self.windowOnMouseMove);
			}
			
			clearTimeout(self.disableOpenLighboxId_to);
			self.disableOpenLighboxId_to = setTimeout(function(){self.disableOpenLighbox_bl = false;}, 100);
		
			self.isDragged_bl = false;
		};
		
		//#################################//
		/* scroll grid */
		//#################################//
		this.scrollGrid =  function(){
			
			if(this.vx > 80){
				this.vx = 80;
			}else if(this.vx < -80){
				this.vx = -80;
			}
			
			if(this.vy > 80){
				this.vy = 80;
			}else if(this.vy < -80){
				this.vy = -80;
			}
			
			if(Math.abs(this.vx) < .01 && Math.abs(this.vy) < .01 || this.isZooming_bl){
				this.disableDrawGrid_bl = true;
			}else{
				this.disableDrawGrid_bl = false;
			}
			
			if(this.isDragged_bl){
				this.vx = this.posX - this.lastThumsbHolderX;
				this.vy = this.posY - this.lastThumsbHolderY;
				this.lastThumsbHolderX = this.posX;	
				this.lastThumsbHolderY = this.posY;
			}else if(this.isAutoScolling_bl){
				if(self.autoScrollDirection_str == "down"){
					this.vy = self.autoScrollSpeed;
				}else if(self.autoScrollDirection_str == "up"){
					this.vy = -self.autoScrollSpeed;
				}else if(self.autoScrollDirection_str == "left"){
					this.vx = -self.autoScrollSpeed;
				}else if(self.autoScrollDirection_str == "right"){
					this.vx = self.autoScrollSpeed;
				}
				
				this.vx *= this.friction;
				this.vy *= this.friction;
				this.posX += Math.round(this.vx);
				this.posY += Math.round(this.vy);
			}else{
				this.vx *= this.friction;
				this.vy *= this.friction;
				this.posX += Math.round(this.vx);
				this.posY += Math.round(this.vy);
			}
			
			if(!this.disableDrawGrid_bl){
				if(self.dragDirection_str == "both"){
					this.thumbsHolder_do.setX(this.posX);
					this.thumbsHolder_do.setY(this.posY);
				}else if(self.dragDirection_str == "horizontal"){
					this.thumbsHolder_do.setX(this.posX);
				}else if(self.dragDirection_str == "vertical"){
					this.thumbsHolder_do.setY(this.posY);
				}
			}
		};
		
		//##########################################//
		/* setup hide screen, dispatch event once */
		//#########################################//
		this.setupDispatchHideHelpScreen = function(){
			if(this.isMobile_bl){
				this.screen.addEventListener("touchstart", this.onHideMouseDown);
			}else{
				if(this.screen.addEventListener){
					this.screen.addEventListener("mousedown", this.onHideMouseDown);
				}else{
					this.screen.attachEvent("onmousedown", this.onHideMouseDown);
				}
			}
		};
		
		this.onHideMouseDown = function(){
			if(self.isMobile_bl){
				setTimeout(function(){
					if(self == null) return;
					window.addEventListener("touchmove", self.windowOnHideMouseMove);
				}, 10);
			}else{
				if(window.addEventListener){
					setTimeout(function(){
						if(self == null) return;
						window.addEventListener("mousemove", self.windowOnHideMouseMove);
					}, 10);
				}else{
					setTimeout(function(){
						if(self == null) return;
						document.attachEvent("onmousemove", self.windowOnHideMouseMove);
					}, 10);
				}
			}
		};
			
		this.windowOnHideMouseMove = function(e){
			if(self.isMobile_bl){
				window.removeEventListener("touchmove", self.windowOnHideMouseMove);
				self.screen.removeEventListener("touchstart", self.onHideMouseDown);
			}else{
				if(self.screen.addEventListener){
					self.screen.removeEventListener("mousedown", self.onHideMouseDown);
					window.removeEventListener("mousemove", self.windowOnHideMouseMove);
				}else{
					self.screen.detachEvent("onmousedown", self.onHideMouseDown);
					document.detachEvent("onmousemove", self.windowOnHideMouseMove);
				}
			}
			self.dispatchEvent(FWDIGPThumbsManager.HIDE_HELP_SCREEN);
		};
		
		this.init();
		
	};
	
	/* set prototype */
	FWDIGPThumbsManager.setPrototype = function(){
		FWDIGPThumbsManager.prototype = new FWDRLDisplayObject("div");
	};
	
	FWDIGPThumbsManager.GRID_SIZE = 1000;
	FWDIGPThumbsManager.MOUSE_DONE = "onMouseDown";
	FWDIGPThumbsManager.HIDE_HELP_SCREEN = "onHideHelpScreen";
	
	FWDIGPThumbsManager.prototype = null;
	window.FWDIGPThumbsManager = FWDIGPThumbsManager;
	
}(window));