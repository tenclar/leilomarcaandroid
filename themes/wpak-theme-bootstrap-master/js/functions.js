define( 
	[ 
	'jquery',
	 'core/theme-app', 
	 'core/theme-tpl-tags', 
	 'core/modules/storage', 	 
	 'theme/photoswipe/photoswipe.min',
	 'theme/photoswipe/photoswipe-ui-default.min',
	 'theme/js/cf7',
	 'theme/js/bootstrap.min' 
	 ], function( $, App, TemplateTags, Storage, PhotoSwipe, PhotoSwipeUI_Default  ) {


	 

	var $refresh_button = $( '#refresh-button' );

	var current_search = { search_principal: '' , search_secundario:''  };
	var photoswipe_element = $( '.pswp' )[0]; //Memorize PhotoSwipe gallery HTML layout element
    var photoswipe_instance = null; //PhotoSwipe JS Object that we will instanciate         
	var img_dragging = false;
	
	

	//App.addCustomRoute( 'archive-agenda', 'archive-agenda' );

   /*App.filter( 'template', function( def_template, current_screen) {
	 if( TemplateTags.isTaxonomy('events_categories',['agenda','elite'], current_screen )) {
		   def_template = 'archive-agenda'; //Don't need .html here.
	  
	 }
	 return def_template;
   });*/

   /*App.filter( 'template-args', function( template_args, view_type, view_template ) { 
   if( view_template == 'agenda' ) {
	   //template_args.my_custom_arg = { my: custom_dynamic_value };
	   if( TemplateTags.isCategory('agenda', current_screen) ){
		   template = 'archive-my-category'; //Don't need .html here.
	 }
   }
   return template_args;
   });*/

   // Don't automatically show default screen after a refresh	
	App.setParam( 'go-to-default-route-after-refresh', false ); 

   App.addCustomRoute( 'home', 'home' );

    App.filter( 'default-route', function( default_route ) {
 	   default_route = 'home';
 	   return default_route ;
    });

    // 	App.filter( 'launch-route', function( launch_route ) {
	// 	launch_route = 'home';
	// 	return launch_route ;
	// });
 
  
   App.filter( 'make-history', function( history_action, history_stack, queried_screen, current_screen, previous_screen ) {
   //If coming from "home" screen and going to a "single" screen, consider it as a "push" in app history:

   	/* 	if(  _.isEmpty( current_screen )  && queried_screen.screen_type === 'single' ) {
			history_action = 'pop';	
		} 
		*/
	
	  /*   if( current_screen.item_id === 'home' && queried_screen.screen_type === 'single' ) {
	 	   history_action = 'push';			
	    } */
	  
	   if( current_screen.item_id === 'list' && queried_screen.screen_type === 'single' ) {
		   history_action = 'push';			
	   }
	   /*
	     if( current_screen.item_id === 'home' && queried_screen.screen_type === 'list' ) {
		   history_action = 'push';			
	 	 } 
	  */
	   
	   return history_action;
   });
/* 
   App.filter( 'transition-direction', function ( direction, current_screen, queried_screen ) {
	   
	   if ( current_screen.item_id === 'home' && queried_screen.screen_type === 'list' ) {
		   direction = 'next-screen';
	   } 
	   //If coming back from a "single" screen to the "home" screen, consider it as a "previous screen" transition:
	   else if ( current_screen.screen_type === 'list' && queried_screen.item_id === 'home' ) {
		   direction = 'previous-screen';
	   }
	   return direction;
   });
 */
   
  

    /*     
     * Opens the given image (or list of images) with PhotoSwipe
     */
    function open_with_photoswipe( $images, index ) {

        index = index || 0;

        var photoswipe_items = [];

        //For each image, create the corresponding PhotoSwipe item by retrieving
        //the full size information in data attributes set on server side:
        $images.each( function() {
            var $image = $( this );

            //Retrieve image caption if any:
            var $caption = $( this ).closest('.gallery-item, .wp-caption').find( '.wp-caption-text' );

            //Add PhotoSwipe item corresponding to
            photoswipe_items.push({
                src: $image.data( 'full-img' ), //Data attribute that was added by modifying the webservice earlier
                w: $image.data( 'width' ),
                h: $image.data( 'height' ),
                title: $caption.length ? $caption.text() : ''
            });
        } );

        //Lots of PhotoSwipe options can be found here for customization:
        //http://photoswipe.com/documentation/options.html
        var photoswipe_options = {
            index: index, //start gallery at the image we clicked on (used for image galleries)
            shareEl: false //don't display Share element
        };

        //Open the given images with PhotoSwipe:
        photoswipe_instance = new PhotoSwipe( photoswipe_element, PhotoSwipeUI_Default, photoswipe_items, photoswipe_options);
        photoswipe_instance.init();
    }     
         
         
         
     $( "#app-layout" ).on( "touchstart", "#single-content img", function() {
        img_dragging = false; //Reinit image dragging when starting to touch an image
        });

    $( "#app-layout" ).on( "touchmove", "#single-content img", function() {
        img_dragging = true; //Activate image dragging when starting to swipe on the image to make post content scroll
    });
         
    $( "#app-layout" ).on( "touchend", "#single-content img", function() {
	    
        if (img_dragging){
            return;
        }
        
        //Open PhotoSwipe for the image we just touched:
	   open_with_photoswipe( $( this ) );
    });


	 /*
     * @desc Display default image if an error occured when loading an image element (eg. offline)
     * 1. Binding onerror event doesn't seem to work properly in functions.js
     * 2. Binding is done directly on image elements
     * 3. You can't use UnderscoreJS tags directly in WordPress content. So we have to attach an event to window.
     * 4. Content image onerror handlers are set in prepare-content.php
     * 5. Thumbnail event handlers are done in the templates archive.html and single.html
     */
    // window.displayDefaultImage = function(o) {
    //     $(o).attr('src',TemplateTags.getThemeAssetUrl('img/img-icon.svg'));
    // }

	$('#container').on('click','#ag-corte',function(e){
    e.preventDefault();
    //Set search params from HTML form:
    //current_search.search_string = $('#corte').val().trim();
    

    current_search.search_principal = 'agenda';
    current_search.search_secundario = 'corte';
    

		 //Get updated data from server for the current component:
		App.refreshComponent({
			success: function(answer, update_results) {
			    //Server answered with a filtered list of posts. 
			    //Reload current screen to see the result:
			    App.reloadCurrentScreen();
			},
			error: function(error) {
		    //Maybe do something if filtering went wrong.
		    //Note that "No network" error events are triggered automatically by core
			}
		});

	});

	$('#container').on('click','#ag-elite',function(e){
    e.preventDefault();
    //Set search params from HTML form:
    //current_search.search_string = $('#corte').val().trim();
    

    current_search.search_principal = 'agenda';
    current_search.search_secundario = 'elite';
    

		 //Get updated data from server for the current component:
		App.refreshComponent({
			success: function(answer, update_results) {
			    //Server answered with a filtered list of posts. 
			    //Reload current screen to see the result:
			    App.reloadCurrentScreen();
			},
			error: function(error) {
		    //Maybe do something if filtering went wrong.
		    //Note that "No network" error events are triggered automatically by core
			}
		});

	});

	$('#app-layout').on('click','#agenda',function(e){
    e.preventDefault();
    //Set search params from HTML form:
    //current_search.search_string = $('#corte').val().trim();
    

    current_search.search_principal = 'agenda';
    current_search.search_secundario = '';
    

		 //Get updated data from server for the current component:
		App.refreshComponent({
			success: function(answer, update_results) {
			    //Server answered with a filtered list of posts. 
			    //Reload current screen to see the result:
			    App.reloadCurrentScreen();
			},
			error: function(error) {
		    //Maybe do something if filtering went wrong.
		    //Note that "No network" error events are triggered automatically by core
			}
		});

	});



	$('#container').on('click','#res-corte',function(e){
    e.preventDefault();
    //Set search params from HTML form:
    //current_search.search_string = $('#corte').val().trim();
    

    current_search.search_principal = 'resultados';
    current_search.search_secundario = 'corte';
    

		 //Get updated data from server for the current component:
		App.refreshComponent({
			success: function(answer, update_results) {
			    //Server answered with a filtered list of posts. 
			    //Reload current screen to see the result:
			    App.reloadCurrentScreen();
			},
			error: function(error) {
		    //Maybe do something if filtering went wrong.
		    //Note that "No network" error events are triggered automatically by core
			}
		});

	});

	$('#container').on('click','#res-elite',function(e){
    e.preventDefault();
    //Set search params from HTML form:
    //current_search.search_string = $('#corte').val().trim();
    

    current_search.search_principal = 'resultados';
    current_search.search_secundario = 'elite';
    

		 //Get updated data from server for the current component:
		App.refreshComponent({
			success: function(answer, update_results) {
			    //Server answered with a filtered list of posts. 
			    //Reload current screen to see the result:
			    App.reloadCurrentScreen();
			},
			error: function(error) {
		    //Maybe do something if filtering went wrong.
		    //Note that "No network" error events are triggered automatically by core
			}
		});

	});

	$('#app-layout').on('click','#resultados',function(e){
    e.preventDefault();
    //Set search params from HTML form:
    //current_search.search_string = $('#corte').val().trim();
    

    current_search.search_principal = 'resultados';
    current_search.search_secundario = '';
    

		 //Get updated data from server for the current component:
		App.refreshComponent({
			success: function(answer, update_results) {
			    //Server answered with a filtered list of posts. 
			    //Reload current screen to see the result:
			    App.reloadCurrentScreen();
			},
			error: function(error) {
		    //Maybe do something if filtering went wrong.
		    //Note that "No network" error events are triggered automatically by core
			}
		});

	});





		/**
	 * Add our search params to web services that retrieve our post list.
	 * Applies to "Live Query" web service (that retrieves filtered component's post list)
	 * and to "Get More Posts" web service (so that search filters apply to pagination too).
	 */
	App.filter( 'web-service-params', function( web_service_params ) {

	    //If the user provided non empty search params:
	    if( current_search.search_principal !== '' ) {
	        //Add search params to the data sent to web service:
	        //web_service_params.my_search_filters = current_search;
	        web_service_params.my_search_filters = current_search;
	        //Those params will be retrieved with WpakWebServiceContext::getClientAppParam( 'my_search_filters' )
	        //on server side.
	    }

	    return web_service_params;
	} );


		/**
	 * Add 
	 * - current search params to the archive template, so that they're available in archive.html.
	 */
	App.filter( 'template-args', function( template_args, view_type, view_template ) {

	    if ( view_type === 'archive' ) {
	        template_args.current_search = current_search;
	    }

	    return template_args;
	} );





	/**
	 * Open all links inside single content with the inAppBrowser
	 */
	$( '#app-layout' ).on( 'click', '#linkaovivo a', function( e ) {
		e.preventDefault();	
		 openWithInAppBrowser( 'https://www.youtube.com/channel/UCd68n27RpAW2MXXvAAS6Mvw/live' );
	} );

	/**
	 * Launch app contents refresh when clicking the refresh button :
	 */
	$refresh_button.click( function( e ) {
		e.preventDefault();
		closeMenu();
		App.refresh();
	} );

	/**
	 * Animate refresh button when the app starts refreshing
	 */
	App.on( 'refresh:start', function() {
		$refresh_button.addClass( 'refreshing' );
	} );

	/**
	 * When the app stops refreshing :
	 * - scroll to top
	 * - stop refresh button animation
	 * - display success or error message
	 *
	 * Callback param : result : object {
	 *		ok: boolean : true if refresh is successful,
	 *		message: string : empty if success, error message if refresh fails,
	 *		data: object : empty if success, error object if refresh fails :
	 *					   use result.data to get more info about the error
	 *					   if needed.
	 * }
	 */
	App.on( 'refresh:end', function( result ) {
		scrollTop();
		Storage.clear( 'scroll-pos' );
		$refresh_button.removeClass( 'refreshing' );
		if ( result.ok ) {
			$( '#feedback' ).removeClass( 'error' ).html( 'Conteudo atualizado com Sucesso!' ).slideDown();
		} else {
			$( '#feedback' ).addClass( 'error' ).html( result.message ).slideDown();
		}
	} );

	/**
	 * When an error occurs, display it in the feedback box
	 */
	App.on( 'error', function( error ) {
		$( '#feedback' ).addClass( 'error' ).html( error.message ).slideDown();
	} );

	/**
	 * Hide the feedback box when clicking anywhere in the body
	 */
	$( 'body' ).click( function( e ) {
		$( '#feedback' ).slideUp();
	} );

	/**
	 * Back button 
	 */
	var $back_button = $( '#go-back' );
	
	//Show/Hide back button (in place of refresh button) according to current screen:
	App.on( 'screen:showed', function ( current_screen, view ) {
		var display = App.getBackButtonDisplay();
		if ( display === 'show' ) {
			$refresh_button.hide();
			$back_button.show();
		} else if ( display === 'hide' ) {
			$back_button.hide();
			$refresh_button.show();
		}
		$( 'div.wpcf7 > form' ).each( function() {
			var $form = $( this );
			wpcf7.initForm( $form );
			if ( wpcf7.cached ) {
				wpcf7.refill( $form );
			}
		} );
	});

	

	//Go to previous screen when clicking back button:
	$back_button.click( function ( e ) {
		e.preventDefault();
		App.navigateToPreviousScreen();
	} );


	/* 
	document.addEventListener("backbutton", onBackKeyDown, false);
		function onBackKeyDown() {
    		//Retrieve app's history
    		var history = App.getHistory();

			//Check that there's only one screen in history (the current one):
			
    	if ( history.length === 1 ) {
        		//Check that this element is the default (home) screen:
        		var history_screen = history[0];
        		if ( TemplateTags.getDefaultRouteLink().replace('#','') === history_screen.fragment ) {
            		//Only one element in history and this element is default screen: exit app on back button:
            		navigator.app.exitApp();
            	return;
        	}
    	}

    	//History has at least one previous element: just go back to it:
    	navigator.app.backHistory();
	} 
	*/
	

	/**
	 * Allow to click anywhere on post list <li> to go to post detail :
	 */
	$( '#container' ).on( 'click', 'li.media', function( e ) {
		e.preventDefault();
		var navigate_to = $( 'a', this ).attr( 'href' );
		App.navigate( navigate_to );
	} );

	/**
	 * Close menu when we click a link inside it.
	 * The menu can be dynamically refreshed, so we use "on" on parent div (which is always here):
	 */
	$( '#navbar-collapse' ).on( 'click', 'a', function( e ) {
		closeMenu();
			App.refresh();
			App.reloadCurrentScreen();
	} );

	/**
	 * Open all links inside single content with the inAppBrowser
	 */
	$( "#container" ).on( "click", ".single-content a, .page-content a", function( e ) {
		e.preventDefault();
		openWithInAppBrowser( e.target.href );
	} );
	
	$( "#container" ).on( "click", ".comments", function( e ) {
		e.preventDefault();
		
		$('#waiting').show();
		
		App.displayPostComments( 
			$(this).attr( 'data-post-id' ),
			function( comments, post, item_global ) {
				//Do something when comments display is ok
				//We hide the waiting panel in 'screen:showed'
			},
			function( error ){
				//Do something when comments display fail (note that an app error is triggered automatically)
				$('#waiting').hide();
			}
		);
	} );

	/**
	 * "Get more" button in post lists
	 */
	$( '#container' ).on( 'click', '.get-more', function( e ) {
		e.preventDefault();

		var $this = $( this );
		
		var text_memory = $this.text();
		$this.attr( 'disabled', 'disabled' ).text( 'Carregando...' );

		App.getMoreComponentItems( 
			function() {
				//If something is needed once items are retrieved, do it here.
				//Note : if the "get more" link is included in the archive.html template (which is recommended),
				//it will be automatically refreshed.
				$this.removeAttr( 'disabled' );
			},
			function( error, get_more_link_data ) {
				$this.removeAttr( 'disabled' ).text( text_memory );
			}
		);
	} );

	/**
	 * Do something before leaving a screen.
	 * Here, if we're leaving a post list, we memorize the current scroll position, to
	 * get back to it when coming back to this list.
	 */
	App.on( 'screen:leave', function( current_screen, queried_screen, view ) {
		//current_screen.screen_type can be 'list','single','page','comments'
		if ( current_screen.screen_type == 'list' ) {
			Storage.set( 'scroll-pos', current_screen.fragment, $( 'body' ).scrollTop() );
		}
		
	});

	/**
	 * Do something when a new screen is showed.
	 * Here, if we arrive on a post list, we resore the scroll position
	 */
	App.on( 'screen:showed', function( current_screen, queried_screen, view ) {
		//current_screen.screen_type can be 'list','single','page','comments'
		if(  _.isEmpty( current_screen )  && queried_screen.screen_type === 'single' ) {
			App.refresh();
		} 
		if ( current_screen.screen_type == 'list' ) {
			var pos = Storage.get( 'scroll-pos', current_screen.fragment );
			if ( pos !== null ) {
				$( 'body' ).scrollTop( pos );
			} else {
				scrollTop();
			}
		} else {
			scrollTop();
		}
		
		if ( current_screen.screen_type == 'comments' ) {
			$('#waiting').hide();
		}
		
	} );

	/**
	 * Example of how to react to network state changes :
	 */
	/*
	 App.on( 'network:online', function(event) {
	 $( '#feedback' ).removeClass( 'error' ).html( "Internet connexion ok :)" ).slideDown();
	 } );
	 
	 App.on( 'network:offline', function(event) {
	 $( '#feedback' ).addClass( 'error' ).html( "Internet connexion lost :(" ).slideDown();
	 } );
	 */

	/**
	 * Manually close the bootstrap navbar
	 */
	function closeMenu() {
		var navbar_toggle_button = $( ".navbar-toggle" ).eq( 0 );
		if ( !navbar_toggle_button.hasClass( 'collapsed' ) ) {
			navbar_toggle_button.click();
		}
	}

	/**
	 * Get back to the top of the screen
	 */
	function scrollTop() {
		window.scrollTo( 0, 0 );
	}

	/**
	 * Opens the given url using the inAppBrowser
	 */
	function openWithInAppBrowser( url ) {
		window.open( url, "_blank", "location=no" );
	}

} );