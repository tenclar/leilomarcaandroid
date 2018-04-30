define( function ( require ) {

	"use strict";

	return {
		app_slug : 'leilomarca',
		wp_ws_url : 'http://www.leilomarca.com.br/portal/wp-appkit-api/leilomarca',
		wp_url : 'http://www.leilomarca.com.br/portal',
		theme : 'wpak-theme-bootstrap-master',
		version : '1.0',
		app_type : 'phonegap-build',
		app_title : 'LeiloMarca - Leilão Rural',
		app_platform : 'android',
		app_path: '',
		gmt_offset : -5,
		debug_mode : 'off',
		auth_key : 'P%C|b ze~%|f{FJkBL$WnU3K}lPJ r-v<|bzH;Rkq899hw{]XCR}(2n,U/jVpFW%',
		options : {"refresh_interval":1,"pushwoosh":{"pwid":"B6166-5B76B","googleid":"1011179920641"}},
		theme_settings : [],
		addons : [{"name":"Pushwoosh for WP-AppKit","slug":"wpak-addon-pushwoosh","url":"http:\/\/www.leilomarca.com.br\/portal\/wp-content\/plugins\/wpak-addon-pushwoosh","js_files":[{"file":"js\/wpak-pushwoosh.js","type":"module","position":""},{"file":"js\/wpak-pushwoosh-app.js","type":"init","position":"before"}],"css_files":[],"html_files":[],"template_files":[],"app_data":null}]
	};

});
