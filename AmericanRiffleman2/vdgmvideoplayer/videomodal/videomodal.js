YUI.add('videomodal', function (Y, NAME) {

function VideoModal(){
   VideoModal.superclass.constructor.apply(this, arguments);
}

VideoModal.NAME  = 'videomodal';

VideoModal.ATTRS = {

};



Y.namespace('Vdgm').VideoModal = Y.Base.create("videomodal", Y.Widget, [Y.WidgetChild], {
    MODAL_DURATION: 8,
    VIDEO_PAUSED_EVENT: 'video_paused',
    VIDEO_ENDED_EVENT: 'video_ended',
    TRIGGER_VIDEO_STOP: 'video_player_stop',
    TRIGGER_VIDEO_PLAY: 'video_player_play',
    BOUNDING_TEMPLATE: '<div id="video-modal"/>',
    CONTENT_TEMPLATE: ""+
    '<div class="video-headline now-playing">NOW PLAYING</div>'+
    '<div class="video-headline related-videos-headline">RELATED VIDEOS</div>'+
    '<div class="video-paused play-video"><p class="video-headline vdgm-icon-pause icon-pause"></p></div>' +
    '<div id="video-timer-message">'+
    	'<p>NEXT VIDEO WILL BEGIN IN:'+
    		' <span id="video-timer"></span>'+
    	 '</p>'+
    '</div>'+
    '<div id="video-modal-control">'+
        '<div id="control-buttons">'+
            '<div class="control">'+
                '<div id="play-video-control" class="video-control-button play-video">'+
                '</div>'+
            '</div>'+
            '<div class="control">'+
                '<div id="close-video-control" class="video-control-button stop-video">'+
                    '<span class="vdgm-icon-stop icon-stop" >'+
                    '</span>'+
                '</div>'+
            '</div>'+
            '<div class="control">'+
                '<div id="next-video-control" class="video-control-button next-video">'+
                    'Play Next Video' +
                '</div>'+
            '</div>'+
        '</div>'+
            '<div id="share-items">'+
            '<p>SHARE</p>'+
            '<div id="facebook-video-control" class="vdgm-shareable">'+
                '<span class="vdgm-icon-facebook icon-facebook" ></span>'+
            '</div>'+
            '<div id="twitter-video-control" class="vdgm-shareable">'+
                '<span class="vdgm-icon-twitter icon-twitter" ></span>'+
            '</div>'+
            '<div id="email-video-control" class="vdgm-shareable">'+
                '<span class="vdgm-icon-share icon-share"></span>'+
            '</div>'+
        '</div>'+
    '</div>',
    
    templates: {
          LIST:'<ul class="related-videos"></ul>',
          LINK: '://{host}/home/video/{slug}',
          RELATED_ITEM:'' +
          '<li data-itemslug="{slug}" class="related-video related-video-{index}">'+
                  '<a href="{link}" target="{target}">'+
                          '<div class ="list-item-image">'+
                                  '<img  src="{imageURL}"/>'+
                                  '<p>{title}</p>'+
                          '</div>'+
                  '</a>'+
          '</li>',

          REPLAY_BUTTON: '<span class="vdgm-icon-spinner icon-spinner"></span>',
          PLAY_BUTTON: '<span class="vdgm-icon-play icon-play"></span>' 
     },
     relatedGroups:[],
     selectors: {
         relatedVideoItem: '.related-video',
         lastRelatedItem: '.lastRelatedItem',
         prev: '.video-prev',
         next: '.video-next',
         modal: '#video-modal',
         playButton: '#play-video-control',
         playClass: 'play-video',
         stopClass: 'stop-video',
         closeButton: '#close-video-control',
         pausedHeadline: '.video-paused',
         relatedVideos: '.related-videos',
         relatedVideoContainer: '#related-video-container',
         timer: '#video-timer',
         embed: '#embed-player'
     },
     events:{
        '.play-video':{
            click : 'handleControlClick'
         },
         '.stop-video':{
             click : 'handleControlClick'
         },
         '.next-video':{
             click : 'playNextVideo'
         }
     },
    _closeAfterEnded: true,
    _hasShareItems : true,
    initializer: function(cfg){
        var self = this,
          container   = self.get('boundingBox');


        if(!cfg.closeAfterEnded)
            this.get('boundingBox').addClass('no-close');
        else
            self._closeAfterEnded = cfg._closeAfterEnded;

        if(!cfg.hasShareItems){
            this.get('boundingBox').addClass('no-share')
        }
            
        if(!cfg.hasStopButton)
            this.get('boundingBox').addClass('no-stop')

        this.on('parentChange', function(e){
            console.log(e + " " +e.parent)
            self._parent = e.newVal;
            self.initEvents(cfg);
        });

        //Event delegation wireup
        for(var eventContext in this.events){
            for(var eventType in self.events[eventContext])
            {
                container.delegate(eventType, self[self.events[eventContext][eventType]], eventContext, this);
            }
        }
    },

    initEvents: function( cfg ){
        var self = this
            container   = self.get('boundingBox');

        self._parent.after('pause', function(e){
            self._handleModal(cfg, self.VIDEO_PAUSED_EVENT);
            self._initRelated(cfg, self.VIDEO_PAUSED_EVENT);
        });
        self._parent.after('stop', function(e){
            self.get('boundingBox').remove();
            self._parent.remove(this);
        });
        self._parent.after('ended', function(e){
            self._handleModal(cfg, self.VIDEO_ENDED_EVENT);
            self._initRelated(cfg, self.VIDEO_ENDED_EVENT);
        });
       self._parent.after('play', function(e){
            self.get('boundingBox').removeClass('active');
            self.get('boundingBox').ancestor().removeClass('modal-control-active');
        }); 
    },
    setZero: function( currentGroup ){
        return currentGroup < 0 ? 0 : currentGroup;
    },
    cycleItems:function(direction){
        if( (direction == 'fwd' &&  this.currentGroup+1 == this.relatedGroups.length ) || (direction == 'back' &&  this.currentGroup-1 == -1)){
            return
        }

        var self    = this;
        itemIndex   = 0,
        container   =  Y.one(self.selectors.modal),
        relatedVideoList = container.one(self.selectors.relatedVideos),
        nextGroup = self.relatedGroups[ direction === 'fwd' 
                                        ? self.currentGroup + 1 
                                        : self.setZero( self.currentGroup - 1) ],

        nextIndex = direction === "fwd" 
                    ? self.currentGroup+1 
                    : self.setZero( self.currentGroup - 1);
        if( nextIndex >= 0 && !self.transitioning ){
            self._repetition    =  8;
            self.transitioning  = true;

            self.relatedGroups[ self.currentGroup ].hide( 'fadeOut', {}, function(){

                nextGroup.show('fadeIn', {}, function(){
                    self.currentGroup = nextIndex;
                    self.transitioning = false;
                });
            });
        }
     },

     _initRelated: function ( cfg, state )
     {
        var related              = this._parent.model.related_videos,
        self                     = this,
        //playstate                = state,
        container                = this.get('boundingBox').ancestor(),
        modal                    = this.get('boundingBox'),
        index                    = 0,
        relatedGroupIndex        = 0,
        relatedVideoList         = Y.Node.create( this.templates.LIST ),
        link                     = '',
        item                     = {},
        list                     = {};
        
        self.transitioning       = false;
        self.totalGroups         = 0;
        self.maxRelated          = Math.floor(modal.get('offsetWidth') / 210);

       this.embed = this._parent.model.embed;

       if(!related){
            container.one( '.related-videos-headline').addClass('hide');
            container.one( '#next-video-control').addClass('hide');
            container.one( '#video-timer-message').addClass('hide');
         return 
       }
       for( var i=0; i < Number( related.length ); i++ ){
            index      = i,
            link       = related[index].link
                            ? related[index].link 
                            : Y.Lang.sub(self.templates.LINK, { host:cfg.host, slug: related[index].slug}),
            subcfg=   {
                slug: related[ index ].slug,
                index: index,
                link: link,
                imageURL: self._getThumbImage(related[index]),
                target: self.embed ? '_blank' : '_self',
                title: related[index].title
            };
            
            //populate template
            var  item = Y.Lang.sub( self.templates.RELATED_ITEM, subcfg),
                //create related item result of Lang.sub
                 relatedItem = Y.Node.create( item );


            if(!i)
            {
                self.firstRelated = relatedItem;
            }
            
            
            
            //add related video to dom
            relatedVideoList.appendChild( relatedItem );
            
        }

        if(!self.get('boundingBox').one( self.selectors.relatedVideos)){
            self.get('boundingBox').appendChild( relatedVideoList );
                
            var listNode = self.get('boundingBox').one( self.selectors.relatedVideos ).getDOMNode();
            var scrollTarget = jQuery(  listNode );
                scrollTarget.perfectScrollbar({
                    wheelPropagation: true
                });
        }
    },

    _getThumbImage:function( relatedItem ){
        var thumbImage,
        self = this;

        if(relatedItem.images && relatedItem.images[ 285 ]){
           thumbImage = relatedItem.images[285].imageUrl;
        }
        else{
              thumbImage = relatedItem.images[ 263 ] ? relatedItem.images[263].imageUrl : "";
        }
        return thumbImage;
    },

    _handleModal: function ( cfg, type ){
        if( this.get('boundingBox').hasClass('active'))
            return

        var container = this.get('boundingBox').ancestor(),
        self        = this,
        model       = this._parent.model,
        modal       = this.get('boundingBox'),
        modalPlay   = this.get('boundingBox').one( self.selectors.playButton ),
        modalClose  = this.get('boundingBox').one( self.selectors.closeButton ),
        embed       = {};
        self.type   = type;

            //MAIN-VIDEO
            this.get('boundingBox').ancestor().addClass('modal-control-active');

            if(self.type){
                this.get('boundingBox').removeClass('video_paused');
                this.get('boundingBox').removeClass('video_ended');
                this.get('boundingBox').addClass(self.type);
            }

            self._repetition = self.MODAL_DURATION;

        if( self.type === self.VIDEO_PAUSED_EVENT )
        {
           modalPlay.setHTML( self.templates.PLAY_BUTTON );
           self.isPaused = true;
        }

        else if( self.type === self.VIDEO_ENDED_EVENT ){
            modalPlay.setHTML( self.templates.REPLAY_BUTTON ); 
            if( model.related_videos )
                self._setTimer();//
        }
        self.fbShare = modal.one('#facebook-video-control');
        self.fbShare.setAttribute( 'data-shareid', 'facebook:video:' + model.id);
        self.twitterShare = modal.one('#twitter-video-control');
        self.twitterShare.setAttribute( 'data-shareid', 'twitter:video:' + model.id);
        self.emailShare = modal.one('#email-video-control');
        self.emailShare.setAttribute( 'data-shareid', 'email:video:' + model.id);
        this.get('boundingBox').addClass('active');

        //bear in mind the model property is related *_* videos vs the ul id which is related *-* videos]
    },

   handleControlClick: function( e )
   {
       var self = this,
       container = self.get('boundingBox');
       control = e.currentTarget;
       
       if( control.hasClass( self.selectors.playClass ) )
        {
           if( self.type === self.VIDEO_ENDED_EVENT )
           {
               self._repetition = self.MODAL_DURATION;
               window.clearInterval( self.interval ); 
           };
           self._parent.play();
           //this.fire( self.TRIGGER_VIDEO_PLAY );
        }
        else if( control.hasClass( self.selectors.stopClass ) )
        {
            self._parent.stop();
            window.clearInterval( self.interval );
            return;
        }
        container.removeClass('active');
    },

    playNextVideo: function( e )
    {
        this.firstRelated.one('a').simulate("click");
    },

    closeModal: function(  ){
        var self = this;

        self.get('boundingBox').removeClass('active');
    },

    related : {

    },
    _setCurrentTime: function (time){
        var el = this._swf.getDOMNode();
        el.setCurrentTime(time);
    },
    _handleTimer: function(  )
    {
        var self = this,
            container = this.get('boundingBox');
               
        var counter = container.one(self.selectors.timer);
        if( self._repetition > 0  ){
            self._repetition = self._repetition - 1;
            counter.setHTML( self._repetition );
        }
        else{
            window.clearInterval( self.interval );
            self.playNextVideo();
            //this.fire( self.TRIGGER_VIDEO_STOP );
            self._repetition = self.MODAL_DURATION;
        }
    },
    _repetition: 0,

    _setTimer: function( ){
        var self = this;
        self.interval = window.setInterval( function(){ self._handleTimer() }, 1000 );
    }
});


if(Y.Vdgm.app)
Y.augment(VideoModal, Y.Vdgm.Logger);




}, '0.0.1', {
    "requires": [
        "node-event-html5",
        "widget",
        "vdgm-logr",
        "event-synthetic",
        "widget-child"
    ],
    "skinnable": true
});
