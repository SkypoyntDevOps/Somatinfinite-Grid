/* Data */
(function(window){
	
	var FWDRLFacebookShare = function(appId){
		
		var self = this;
		var prototype = FWDRLFacebookShare.prototype;
		
		this.appId = appId;
		
	
		var hasStartedToConnect_bl = false;
	
		//###################################//
		/*init*/
		//###################################//
		self.init = function(){
			self.checkFBRoot();
			if(!window.fbAsyncInit) self.connect();
		};
		
		//#############################################//
		/* Checking fb_root div */
		//#############################################//
		this.checkFBRoot = function(){
			var fbRoot_el = Boolean(document.getElementById("fb-root"));
			if(!fbRoot_el){
				fbRoot_el = document.createElement("div");
				fbRoot_el.id = "fb-root";
				document.getElementsByTagName("body")[0].appendChild(fbRoot_el);
			}
		};
		
		//#############################################//
		/* Setup facebook */
		//#############################################//
		this.connect = function(){
			if(self.hasStartedToConnect_bl) return;
			self.hasStartedToConnect_bl = true;
			
			self.isAPIReadyId_to = setTimeout(function(){
				 self.dispatchEvent(FWDRLFacebookShare.API_ERROR , {error:"Error loading Faceboook API!"});
			}, 6000);
			
			window.fbAsyncInit = function() {
				
				FB.init({
				  appId: self.appId,
				  xfbml: true,
				  cookie: true,
				  status:true,
				  version: 'v2.4'
				});
				
			    clearTimeout(self.isAPIReadyId_to);
    		    self.dispatchEvent(FWDRLFacebookShare.API_READY);
			};
			
			(function(d, s, id){
			     var js, fjs = d.getElementsByTagName(s)[0];
			     if (d.getElementById(id)) {return;}
			     js = d.createElement(s); js.id = id;
			     js.src = "https://connect.facebook.net/en_US/sdk.js";
			     fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		};
	
		
		this.share = function(link, picture, caption){
			
			if(caption && picture){
				FB.ui({
					  method: 'feed',
					  link: link,
					  caption: caption,
					  picture:picture
				}, function(response){});
			}else if(caption){
				FB.ui({
					  method: 'feed',
					  link: link,
					  caption: caption
				}, function(response){});
			}else if(picture){
				FB.ui({
					  method: 'feed',
					  link: link,
					  picture:picture
				}, function(response){});
			}else{
				FB.ui({
					  method: 'feed',
					  link: link
				}, function(response){});
			}
		};
	
		self.init();
	};
	
	/* set prototype */
	FWDRLFacebookShare.setPrototype = function(){
		FWDRLFacebookShare.prototype = new FWDRLEventDispatcher();
	};
	
	FWDRLFacebookShare.prototype = null;
	FWDRLFacebookShare.API_READY = "facebookAPIReady";
	FWDRLFacebookShare.API_ERROR = "facebookAPIError";
	
	window.FWDRLFacebookShare = FWDRLFacebookShare;
}(window));