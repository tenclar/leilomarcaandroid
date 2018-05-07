<?php 
function custom_query( $query_args, $component ) {
    //$query_args =   array(
      //  'post_type' => 'ai1ec_event',
        //'meta_key'  => 'start',
        //'orderby'   => 'meta_value'
        
    //);

   // $event = Ai1ec_Events_Helper::get_event($post->ID);
   
   // $query_args['post_type'] = 'ai1ec_event';
    $query_args[ 'orderby' ] = 'date';	    
    //$query_args['order'] = 'DESC';
    
}



add_filter( 'wpak_posts_list_query_args', 'custom_query', 10, 1 );

?>