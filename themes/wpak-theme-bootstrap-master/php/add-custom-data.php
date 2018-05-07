<?php
/*
 * @desc Add custom data to what is returned by the web services. All custom data will be available to the JS API.
 * @param $post_data
 * @param $post
 * @param $component
 */
function wpak_add_custom_data( $post_data, $post, $component ) {
    //global $ai1ec_registry;
    //$ai1ec_reg = new Ai1ec_Event( $ai1ec_registry );
    //$ai1ec_reg->initialize_from_id($post->ID);
    
    //$post_data['ev'] = $ai1ec_registry;

    //$post_data['ev'] = $ai1ec_reg;
     //$post_data['ev']= get_field('ai1ec_start_time');



     $post_data['table_resultados_macho'] = get_field( 'resultados_macho' );
     $post_data['table_resultados_femea'] = get_field( 'resultados_femea' );           
     $data_start_event = get_post_meta($post->ID, 'ai1ec_start', true);
     $post_data['ai1ec_start']= strtotime($data_start_event);

     //$regis->initialize_from_id($post->ID);
    
     //$post_data['date_evento'] = $eventpp->start;
     //Ai1ec_Registry_Object $registry;

    // $event           = $registry->get( 'model.event', $post->ID );
     //$post_data['ai1ec_data_evento'] = $eventp->post_datetime;

     
     
    // get event
   // $ai1ec_events = get_event($post->ID);

  // $event = Ai1ec_Events_Helper::get_event($post->ID);
    //$post_data['event_dt'] = $eventdd->start;


    // Add subhead. Expected as a post custom field.
    // Usage in app's templates: <%= post.subhead %>
   // $post_data['subhead'] = get_post_meta($post->ID, 'subhead', true);

    // Add post thumbnail caption.
    // Usage in app's templates: <%= post.thumbnail.caption %>
    

    $thumbnail_id = get_post_thumbnail_id( $post->ID );
	if ( $thumbnail_id ) {
		$image_post = get_post( $thumbnail_id );
		if ( $image_post ) {
			if ( !empty( $post_data['thumbnail'] ) ) {
				$post_data['thumbnail']['caption'] = $image_post->post_excerpt;
			}
		}
	}
    
    return $post_data; // Return the modified $post_data

}

add_filter( 'wpak_post_data', 'wpak_add_custom_data', 10, 3 );
?>