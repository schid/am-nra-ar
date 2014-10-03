YUI.add('videoplayer', function (Y, NAME) {

function VideoPlayer(){
    VideoPlayer.superclass.constructor.apply(this, arguments);
}

VideoPlayer.ATTRS 				= {};
VideoPlayer.NAME 				= 'videoPlayer';

VideoPlayer.POSTER_TEMPLATE =  '' +
    '<div id="poster">' +
        '<div id="poster-container">' + 
           '<div id="html-poster-stop" class="vdgm-icon-stop icon-stop"></div>' +
           '<div id="html-poster-play" class="vdgm-icon-play icon-play"></div>'+
        '</div>'+
         '<img src="{poster_url}">'+
    '</div>';

VideoPlayer.HTML_VIDEO_TEMPLATE = '' +
    '<video controls preload="auto">' +
        '<source src="{videoUrl}" type="video/mp4">' +
    '</video>';

VideoPlayer.ANDROID_VIDEO_TEMPLATE = '' +
    '<video controls preload="auto">' +
        '<source src="{videoUrl}" type="video/mp4">' +
    '</video>';


VideoPlayer.GET_FLASH_TEMPLATE = '' +
'<div class="no-flash">' + 
    '<p>' + 
        '<a href="http://get.adobe.com/flashplayer/">Please install ' +
        '<strong>Adobe Flash Player</strong> to view this content.</a>' +
    '</p>' + 
'</div>';




Y.namespace('Vdgm').VideoPlayer = Y.Base.create("videoPlayer", Y.Widget, [Y.WidgetParent, Y.WidgetChild], {
  	_assetPath: '@ASSETPATH@',
    
    _techs: {
        flash: {
            renderUI: '_renderFlashVideo',
            bindUI: '_bindFlashVideo',
            play: '_playFlashVideo',
            //syncUI: '_syncFlashVideo'
            pause: '_pauseFlashVideo',
            stop: '_stopFlashVideo',
            destructor: '_destroyFlashVideo',
            remove: '_removeFlashVideo'
        },
        html: {
            renderUI: '_renderHtmlVideo',
            bindUI: '_bindHtmlVideo',
            play: '_playHtmlVideo',
            //syncUI: '_syncHtmlVideo'
            pause: '_pauseHtmlVideo',
            stop: '_stopHtmlVideo',
            destructor: '_destroyHtmlVideo',
            remove: '_removeHtmlVideo'
        }
    },
    _percentPlayed: 0,
    
    toggleLarge: function(){
        this.fire('togglelargeview');
    },
    
    initializer: function(config){
        var self = this;
		this.model = config.model;
        this.host = config.host;
        this.f4mhost =  config.f4mhost ? config.f4mhost : null;
        this.flashLiveStream = config.settings.flash;
        this.htmlLiveStream = config.settings.html;
        this.tintColor  = config.settings.tintColor;
        this.tech = config.tech || this.getTech(Y.UA);
        this.type = this.model.type;
        this.embed = this.model.embed;
        this.duration = this.model.duration ? this.model.duration : 0;
        this.meta = this.model.meta ? this.model.meta  : [];
        self.isPaused = false,
        self.started = false;
        this.mapTech(  );  
        this.on('destroy', this.destructor, this);
        
        if(!config.autoplay){
            self._autoplay = false;
        };
    },
	
	getTech: function(ua){
        //console.log(Y.SWFDetect.getFlashVersion());
        var hasFlash = function() {
            if(typeof ActiveXObject != "undefined")
                return (typeof navigator.plugins == "undefined" || navigator.plugins.length == 0) ? !!(new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) : navigator.plugins["Shockwave Flash"];
            else
                return (typeof navigator.plugins == "undefined" || navigator.plugins.length == 0) ? false : navigator.plugins["Shockwave Flash"];
        };
		return (Y.UA.flashMajor != null) || hasFlash() ? 'flash' : 'html';
    },
    
    getVideo: function(type){
        return Y.Array.filter(this.model.videos, function(vid){
            return vid.type === type;
        })[0];
    },
    
    mapTech: function(){
        this._mapToTech('renderUI');
        this._mapToTech('bindUI');
        this._mapToTech('play');
        this._mapToTech('pause');
        this._mapToTech('stop');     
        this._mapToTech('destructor');  
        this._mapToTech('remove');   
       
    },
        
    _mapToTech: function(method){
        var self = this;
        self[method] = function(){
           	self[self._techs[self.tech][method]].call(self, arguments);
        };
    },
    
    //=============================================================
    // html
    //=============================================================
    
    _video: null,
    _renderHtmlVideo: function(){
        var source,
            template = VideoPlayer.HTML_VIDEO_TEMPLATE,
            cb = this.get('contentBox');
            
			this.contentBox = 'contentBox';
            this.timeIterator = 0;
            
            //This hard coded value really needs to come from config, but for now... SURPRISE
            if(this.model.type == "live")
                source = {videoUrls:{html:""}};
            else if(this.model.type == "archive")
            {
                source = {videoUrls:{html:Y.Lang.sub(VideoPlayer.ARCHIVE_HTML_VIDEO_TEMPLATE, {videoPath:this.model.slug} )}};
            }
            else
                source = this.getVideo('hd') ? this.getVideo('hd') : this.getVideo('ios').videoUrls.ios;
            
            if(!source)
                source = this.getVideo('mobhigh');
            
            if(!source)
                source = this.getVideo('high');
            
        this._poster = cb.appendChild(Y.Lang.sub(VideoPlayer.POSTER_TEMPLATE, {
            poster_url: this._getPosterImage()
        }));       
        this._video = cb.appendChild(Y.Lang.sub(template, {
            videoUrl: source
        }));
                
       
        
        
        this._poster.one('#html-poster-stop').once('click', function(){
           this.stop(); 
        }, this);
        
        this._poster.one('#html-poster-play').once('click', function(){
           //Y.one('video')._node.play();
           this._video.invoke( 'play' );
           this._poster.remove(true);
        },this);
    },
	
	_addDescriptionCloseButton: function(){
  		var self = this,
	    embed    = Y.one('#embed-player'),
        controls = embed.one('#control-buttons');
		
		var closeInfoBtn = Y.Node.create('<div class="vdgm-icon-cancel-circle"></div>');
		embed.one('.vdgm-sharebar').prepend( closeInfoBtn );
		
		closeInfoBtn.detach('click');
		closeInfoBtn.on('click', function ( ){
            self._track('VideoDescriptionClosed' );
            if( self.isPaused == true && self.started){
                   self.play(  );
            }
			embed.replaceClass('info-active', 'info-inactive');
			embed.one('.vdgm-sharebar').one('.vdgm-icon-cancel-circle').remove();
			self._addDescriptionButton();
		});
	},

  	_addDescriptionButton: function(){
  		var self = this,
		container = Y.one('#embed-player');
		var info = Y.Node.create('<div class="vdgm-icon-info"></div>');
  		container.one('.vdgm-sharebar').prepend( info );
  		info.detach('click');
		info.on('click', function(e){
            self._track('VideoDescriptionOpened' );
            container.one('.vdgm-icon-info').remove();
            self._addDescriptionCloseButton();
            container.replaceClass('info-inactive' , 'info-active');    
 
            if( self.isPaused == false && self.started){
                  self.pause(  );
            }
        })
  	},
    
    _bindHtmlVideo: function(){
        this._video.on('play', this._htmlEventHandler, this);
        this._video.on('pause', this._htmlEventHandler, this);
        this._video.on('ended', this._htmlEventHandler, this);
        this._video.on('timeupdate', this._htmlEventHandler, this);
        this._video.on('seeked', this._htmlEventHandler, this);
       // this._video.on('webkitendfullscreen', this._htmlEventHandler, this);
    },
    
    _htmlEventHandler: function(e){
        var eh = this['_html_' + e.type];
        
        if(typeof eh === 'function'){
            eh.call(this, e);
        }
    },
    
    _html_timeupdate: function(e){
        var el = this._video.getDOMNode(),
        currentTime = el.currentTime;
          
        if(this.meta && this.meta.length > 0 && this.meta.length > this.timeIterator)
        {  
            var metaTime = Number(this.meta[this.timeIterator].offset);
            if(currentTime > metaTime)
            {
                this.fire('updateMeta', {currentTime:currentTime, meta:this.meta});
                this.timeIterator++;
            }
        }
        
        if(this._percentPlayed < 25)
        {
            if(currentTime / this.duration >= .25)
            {
                this._track('PercentPlayed25' );
                this._percentPlayed = 25;
            }
        }
        else if(this._percentPlayed < 50)
        {
            if(currentTime / this.duration >= .5)
            {
                this._track('PercentPlayed50' );
                this._percentPlayed = 50;
            }
        }
        else if(this._percentPlayed < 75)
        {
            if(currentTime / this.duration >= .75)
            {
                this._track('PercentPlayed75' );
                this._percentPlayed = 75;
            }
        }
        else if(this._percentPlayed < 90)
        {
            if(currentTime / this.duration >= .90)
            {
                this._track('PercentPlayed90' );
                this._percentPlayed = 90;
            }
        }
        
        if(!this._loadStarted)
        {
            if( this.model.timeoffset )
            {
                this._video.getDOMNode().currentTime = Number(this.model.timeoffset);
                this.fire('updateMeta', {currentTime:Number(this.model.timeoffset), meta:this.meta});
            }
            this._loadStarted = true;
        }
    },
    
    _html_seeked: function(e){
         var el = this._video.getDOMNode(),
         currentTime = el.currentTime;
         
         this.fire('updateMeta', {currentTime:currentTime, meta:this.meta});
         this.timeIterator = 0;
        
    },
    
    _html_play: function(e){
        this._track('Start');
		this.fire('play');
		this.get('contentBox').addClass('html-active');
    	this.isPaused = false;
        this.started = true;
    	this._video.setAttribute('controls', 'true');
        
        this._html_play = function(e){
             this.get('contentBox').addClass('html-active');
        	 this._video.setAttribute('controls', 'true');
             this.fire('play');
            // at least 2nd play                  

            // osmf/strobe player will give a couple of "play" events right off
            // the bat... not sure how to filter to the one we actually want??
            //this._track('Play');
		};
    },
    
    _html_pause: function(e){
        //html <video> sends 'pause' event when it completes
        this._video.removeAttribute('controls');
        var self = this,
             ended = this._video.get('ended'),
             cb = this.get('contentBox');
        
        if(!ended){
            this._track('Pause');
            
			this.fire('pause');
             
        };
        
        cb.removeClass('html-active');

    },
    
    _html_ended: function(e){
        this._track('Complete');
        this.fire('ended');
        this._percentPlayed = 0;
    },
    
    _playHtmlVideo: function(){
        var self = this;
		self.isPaused = false;   
		self.started = true;
        this._video.setAttribute('controls', 'true');
		this._video.invoke( 'play' ); 
	},

    _pauseHtmlVideo: function(){ 
        
        var args = arguments[0];
        var clicked = arguments[0] ? arguments[0][0] : false;
		var self = this;
	    this.isPaused = true;
		 
		this._video.invoke('pause');   
    },
   //webkitendfullscreen: function(){this._pauseHtmlVideo},
   
   _stopHtmlVideo: function(){
		var self = this;
	
		this._video.invoke('pause');
        	//console.log( 'invoking pause prior to closing video' );
            
    	if(this.type == "live")
        {
            this.model.set("userstopped", true);
        }
		this._percentPlayed = 0;
        this.fire('stop');      
        this._track('Stop'); 
    },
    
    _destroyHtmlVideo: function(){
        //TODO: gtfo
		this.model.clear(); 
    },
    
    _removeHtmlVideo: function(){
        //TODO: gtfo
		//this.model.clear(); 
    },
    
    /**
     * @param type
     * Play
     */
    _track: function(type, data){
        var self = this;
            slug = self.model.slug;
            videoCategory = "VODVideo";
            
        data = data || {};
        
        if(this.embed == true)
        {
            videoCategory = "EmbedVideo";
            if(this.type === 'live')
            {
                videoCategory = "EmbedLiveVideo";
            }
            else if(this.type === 'archive')
            {
                videoCategory = "EmbedArchiveVideo";
            }
        }
        else
        {
            if(this.type === 'live')
            {
                videoCategory = "LiveVideo";
            }
            else if(this.type === 'archive')
            {
                videoCategory = "ArchiveVideo";
            }
        }
        
        Y.fire('interact', Y.merge(data, {
            category: videoCategory,
            action: type,
            label: slug
        }));
    },
    
    //=============================================================
    // flash
    //=============================================================
    
    _swf: null,
    
    /**
     * Defines callback function for Strobe.swf.
     * @param id {string} A string unique to this instance.
     * @return {string} Path to globally available function that the strobe swf
     * can use as callback.
     */
    _getGlobalCallback: function(id){
        // create a namespace for ourselves in YUI.Env, which is globally
        // available on window, and create callback functions there    
	    var self = this,
            path = 'Env.Vdgm.VideoPlayer',
            ns = Y.namespace.call(YUI, path);
         
            
        ns[id] = function(id, eventName, e){
           if( eventName == 'onJavaScriptBridgeCreated' ){
			   //self.player = Y.one('#'+id).getDOMNode();
				self.player = document.getElementById(id); 
				self.playerNode =Y.one('#'+id);
		   }
				
		   if(self['_flash_' + eventName]){   
		    	self['_flash_' + eventName].call(self, e);
           }
		   if(self['_flash_' + id]){
	    		self['_flash_' + id].call(self, e);
		   }

        };
        return 'YUI.' + path + '.' + id;
    },
    
    _flash_progress : function( e ) {
       this.fire('progress');  
    },
    _flash_onJavaScriptBridgeCreated: function(e){
		
	},
    _flash_timeChange: function(e){
        
        var currentTime = e.currentTime;
        
        if(this.model.timeoffset)
            currentTime += this.model.timeoffset;
        
        if(this.meta && this.meta.length > 0 && this.meta.length > this.timeIterator)
        {
            var metaTime = Number(this.meta[this.timeIterator].offset);
            if(currentTime > metaTime)
            {
                this.fire('updateMeta', {currentTime:currentTime, meta:this.meta});
                this.timeIterator++;
            }
        }
        
        if(this._percentPlayed < 25)
        {
            if(currentTime / this.duration >= .25)
            {
                this._track('PercentPlayed25' );
                this._percentPlayed = 25;
            }
        }
        else if(this._percentPlayed < 50)
        {
            if(currentTime / this.duration >= .5)
            {
                this._track('PercentPlayed50' );
                this._percentPlayed = 50;
            }
        }
        else if(this._percentPlayed < 75)
        {
            if(currentTime / this.duration >= .75)
            {
                this._track('PercentPlayed75' );
                this._percentPlayed = 75;
            }
        }
        else if(this._percentPlayed < 90)
        {
            if(currentTime / this.duration >= .90)
            {
                this._track('PercentPlayed90' );
                this._percentPlayed = 90;
            }
        }
        
        if(!this._loadStarted)
        {
            var el = this._swf.getDOMNode(),
                startTime = this.model.get('timeoffset') ? Number( this.model.get('timeoffset') ) : 0;
            
            if(startTime != 0)
            {
                //For some reason doing a seek right away just straight won't work.  Investigate later.
                //Y.later(300, this, this._setCurrentTime, startTime );
                this._setCurrentTime(startTime);
            }
            this._loadStarted = true;
        }
    },
    
    _flash_seeked: function(e){
         var el = this._swf.getDOMNode(),
         currentTime = el.getCurrentTime();
         
         if(this.model.timeoffset)
             currentTime += this.model.timeoffset;
        
         
         this.fire('updateMeta', {currentTime:currentTime, meta:this.meta});
         this.timeIterator = 0;
    },
	
	_playPreroll: function(){
		var self = this;
		
        this._preroll.shown = true;
        
		this.player.displayAd({
		                    id: "preroll"
		                    , url: this._preroll.src
		                    , hideScrubBarWhilePlayingAd: true
							, pauseMainMediaWhilePlayingAd : true
							, resumePlaybackAfterAd : true
							, onComplete: self._getGlobalCallback(this.player._yuid)
		                });
	},
    
    _flash_playing: function(e){
        this._track('Start');  
        this.fire('play');
	    var self = this;
		self.isPaused = false; 
        self.started = true;
		
		if (this._preroll && !this._preroll.shown) {
		        this._playPreroll();
		 }
		
		
		this._flash_playing = function(e){
            // at least 2nd play                  
            // osmf/strobe player will give a couple of "play" events right off
            // the bat... not sure how to filter to the one we actually want??
            //this._track('Play');
		        
            var self = this;    
            self.isPaused = false;     
            self.started = true;
            this.fire('play');
			if (this._preroll && !this._preroll.shown) {
			        this._playPreroll();
			 }
			
		};
    },
	
    _flash_paused: function(e){
		
		if(this._preroll)
		{
			if(this._preroll.shown && !this._preroll.complete)
				return;
		}
		
		if(this._postroll)
		{
			if(this._postroll.shown && !this._postroll.complete)
				return;
		}
		
        //Y.fire('interact', {action: 'video.pause'}); 
        //console.log( 'video player paused = ' + VideoPlayer.PAUSED );
 	   	
		
		
        this.fire('pause');
        
        this._track('Pause'); 
	 },
    
    _flash_stopVideo: function(e){
        this._track('Stop');
        this.fire('stop');
        this._percentPlayed = 0;
        //Y.fire('interact', {action: 'video)()'});
        //console.log( 'stopped flash vid');
		if(this.type == "live")
        {
            this.model.set("userstopped", true);
        }
        this.stop();
    },  
	
	_flash_mediaSize: function(e){
		//console.log('flash size changed');
	},
    
    _flash_error: function(e){
        this._percentPlayed = 0;
        this.stop();
    },
	
    _flash_complete: function(e){
		var self = this;
		
		if(this._postroll)
		{
			if(this._postroll.shown && this._postroll.complete)
	    	{	
                this._percentPlayed = 0;
                this._track('Complete');
                this.fire('ended');
				return;
			}
			
			else
			{
				this._postroll.shown = true;
				this.player.displayAd({
				                    id: "postroll"
				                    , url: this._postroll.src
		                    		, hideScrubBarWhilePlayingAd: true
									, pauseMainMediaWhilePlayingAd : true
									, onComplete: self._getGlobalCallback(this.player._yuid)
				                });
							
			}	
		}
		else
        {    
		//if(e.ended){
            this._percentPlayed = 0;
            this._track('Complete');
            this.fire('ended');
            //Y.fire('interact', {action: 'video.end'});
        //}
        }
    },
	
	_flash_preroll: function(e){
		this._preroll.complete = true;
	},
	
	_flash_postroll: function(e){
		this._postroll.complete = true;
    },
    
    _flash_toggleLargeVideo: function(e){
        this.toggleLarge();
    },

       
    _loadStarted: false,
    _getPosterImage: function() {
        var posterImage,
            self = this,
            where = (self.f4mhost ? self.f4mhost: self.host  );
        
        if(Y.Vdgm.app)
            posterImage = self.model.images ? self.model.images[285].imageUrl : "";
        else
            posterImage =  where  +  (self.model.images[1140] ? self.model.images[1140].imageUrl : "");
        return posterImage;
    },
    _autoplay: self.embed != true,
    _renderFlashVideo: function(){
        
 		var self = this,
            source = this.type + "-f4m/" + self.model.slug,
            swfUrl = self._assetPath + 'GrindPlayer.swf',
            expressInstallUrl = self._assetPath + 'expressInstall.swf',
            cb = this.get('contentBox'),
            fb = cb.appendChild('<div></div>'),
			preroll = self.model.preroll,
			postroll = self.model.postrolls,
            poster_image = self._getPosterImage(),
		    swfId = fb.generateID(),
            flashvars = {
                autoPlay: self._autoplay,
                javascriptCallbackFunction: self._getGlobalCallback(swfId),
				bufferingOverlay: false,
                initialBufferTime: 3,
                expandedBufferTime: 10,
				tintColor: self.tintColor,
				poster: poster_image,
				embed: self.embed == true,
                showIntermediateButton: Y.Vdgm.app ? !(self.embed == true) : false
				},
            attrs = {
                wmode: 'opaque'
            },
            params = {
                allowFullScreen: true,
                allowScriptAccess: 'always',
                wmode: 'opaque',
                name: swfId
			};
            
            if(this.type == 'live')
            {
                    flashvars.src = self.flashLiveStream;
                    self.model.set("userstopped", false);
            }
            
            else
            {
                if(self.f4mhost)
                    flashvars.src = 'http://' +   self.f4mhost + '/api/' + source + '.f4m';
                else if( self.host & Y.Vdgm.app )
                    flashvars.src = 'http://' +   self.host + '/api/' + source + '.f4m';
                else
                    flashvars.src = this.getVideo('ios').videoUrls.ios;
            }
            
            
			if( preroll  != null && preroll != undefined )
			{
				var prerollSrc = "";
                
                if(self.host){
				    if(preroll.promo_type == "channel")
				    	prerollSrc = 'http://' +  self.host + '/api/promo-f4m/channel/preroll/' + preroll.channelSlug + '.f4m';
				    else
				        prerollSrc = 'http://' +  self.host + '/api/promo-f4m/video/preroll/' + self.model.slug + '.f4m';
                }
                else
                    prerollSrc = this.getVideo('ios').videoUrls.ios;
				this._preroll = {
								 src: prerollSrc,
								 shown: false,
								 complete: false
								};
			}
			
			if( postroll != null && postroll != undefined )
			{
				var postrollSrc = "";
				if(self.host){
				    if(postroll.promo_type == "channel")
				    	postrollSrc = 'http://' +  self.host + '/api/promo-f4m/channel/postroll/' + postroll.channelSlug + '.f4m';
				    else
				    	postrollSrc = 'http://' +  self.host + '/api/promo-f4m/video/postroll/' + self.model.slug + '.f4m';
					}
                    else
                        postrollSrc = this.getVideo('ios').videoUrls.ios;
				this._postroll = {
								 src: postrollSrc,
								 shown: false,
								 complete: false
								};
			}
            
            this.timeIterator = 0;
            
        Y.swfobject.embedSWF(
            swfUrl,
            swfId,
            '100%', '100%',
            '10.1.0',
            expressInstallUrl,
            flashvars,
            attrs,
            params,
            function(e){
                if(e.success){
                    self._swf = Y.Node(e.ref);
                    
                    if(self.type == "live")
                    {
                        self._flash_playing(null);
                    }    
                }
                else{
                    fb.remove();
                    self._renderGetFlashMessage();
                }
            }
        );        
        
      if(!self._autoplay){
        var videocontent = self.get('boundingBox').one('.yui3-videoplayer-content');
        videocontent.addClass('icon-play vdgm-icon-play');
        if(self.model.images )
            if(self.model.images[1140]){
                videocontent.setStyle('background-image', "url(" + self._getPosterImage() + ")");
                console.log( self._getPosterImage( ));
               }
        
           self.once( 'play' ,function(e){
                videocontent.setStyle('background-image', "none");
                videocontent.removeClass('icon-play vdgm-icon-play');
                Y.later(  1000, self, self._playFlashVideo );
                
           });
       }
    },
    
    _bindFlashVideo: function(){
    },

    _playFlashVideo: function(){
        // Duping pause method, since it is a safe way to invoke methods
        var el = this._swf.getDOMNode(),
        self = this;
        
        try{
            if( self.player && el.getCanPlay() )
                el.play2();
            else
            {
                Y.later(
                    200,
                    this,
                    self._playFlashVideo
                );
            }
        }
        catch(e){
            Y.later(
               200,
               this,
               self._playFlashVideo
            );
        };             
    },
    
    _pauseFlashVideo: function(  ){
        //call pause directly on DOM node instead of using _swf.invoke('pause').
        //the latter was causing "Error calling method on NPObject" errors. ??
        var args = arguments[0];
        
		var self = this;
		
		if(this.type != "live" && self.player && self.player.getPlaying() )
        {
            var el = self.player;
            if(el.pause )
            el.pause(  );
            self.isPaused = true;
        }
    },
    
    _stopFlashVideo: function(){
        this._pauseFlashVideo();
        
        this._track('Stop');
        this._percentPlayed = 0;
        //Y.fire('interact', {action: 'video.stop'});
        //console.log( 'stopped flash vid');
		if(this.type == "live")
        {
            this.model.set("userstopped", true);
        }
        
        this.fire('stop');
    },
    
    _removeFlashVideo: function(){
        if(this.player){
             this._swf.remove(true);
         } 
    },
    
    _destroyFlashVideo: function(){
       if(this.player){
            this._swf.remove(true);
        }
        
		this.model.clear();
    },

    _renderGetFlashMessage: function(){
        var cb = this.get('contentBox');
        cb.appendChild(Y.Node.create(VideoPlayer.GET_FLASH_TEMPLATE));
    }
});

if(Y.Vdgm.app)
Y.augment(VideoPlayer, Y.Vdgm.Logger);



}, '0.0.1', {
    "requires": [
        "node-event-html5",
        "widget",
        "vdgm-logr",
        "swfobject",
        "swf",
        "widget-parent",
        "widget-child"
    ],
    "skinnable": true
});
