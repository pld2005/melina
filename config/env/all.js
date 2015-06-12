'use strict';

module.exports = {
	app: {
		title: 'Melina',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all',
				'public/assets/global/plugins/font-awesome/css/font-awesome.min.css',
				'public/assets/global/plugins/simple-line-icons/simple-line-icons.min.css',
				'public/assets/global/plugins/bootstrap/css/bootstrap.css',
				'public/assets/global/plugins/uniform/css/uniform.default.css',
				'public/assets/global/css/components-rounded.css',

				'public/assets/global/plugins/select2/select2.css',
				'public/assets/global/plugins/bootstrap-datepicker/css/datepicker3.css',
				//'public/lib/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.min.css',
				
				'public/assets/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

				'public/assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
				'public/assets/global/css/plugins.css',
				'public/assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
				'public/assets/admin/pages/css/login.css',
				'public/assets/admin/layout3/css/layout.css',
				'public/assets/admin/layout3/css/themes/default.css',
				'public/assets/admin/layout3/css/custom.css',		

				'public/datatables/media/css/jquery.dataTables.min.css',
 'public/lib/angular-ui-select/dist/select.css',
 //'public/assets/global/plugins/angularjs/plugins/ui-select/select.min.css',

			],
			js: [

				'public/assets/global/plugins/jquery.min.js',
				'public/assets/global/plugins/jquery-migrate.min.js',
				'public/assets/global/plugins/jquery-ui/jquery-ui.min.js',
				'public/assets/global/plugins/jquery-ui/jquery-ui-1.10.3.custom.min.js',
				'public/assets/global/plugins/bootstrap/js/bootstrap.min.js',
				'public/assets/global/plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js',
				'public/assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js',
				'public/assets/global/plugins/jquery.blockui.min.js',
				'public/assets/global/plugins/jquery.cokie.min.js',
				'public/assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
				'public/assets/global/plugins/uniform/jquery.uniform.min.js',
				'public/assets/global/plugins/jquery.blockui.min.js',

				'public/assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
				//angular				
				'public/lib/angular/angular.js',  
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/assets/global/plugins/angularjs/plugins/ocLazyLoad.min.js',
				
				'public/assets/global/plugins/angularjs/plugins/ui-bootstrap-tpls.min.js',			
				//'public/lib/angular-boostrap/ui-bootstrap-tpls.min.js',			
				'public/lib/angular-ui-utils/ui-utils.js',

				'public/assets/global/plugins/angularjs/plugins/ui-select/select.min.js',

				'public/lib/datatables/media/js/jquery.dataTables.min.js',
				
				//'public/lib/moment/locale/es.js',
				'public/lib/moment/moment.js',
				'public/lib/angular-moment/angular-moment.js',
				
				'public/lib/angular-ui-select/dist/select.js',


				'public/lib/angular-datatables/dist/angular-datatables.js',
				'public/lib/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.js',
				'public/lib/angular-datatables/dist/plugins/colvis/angular-datatables.colvis.min.js',
				'public/lib/angular-datatables/dist/plugins/tabletools/angular-datatables.tabletools.min.js',
				'public/assets/global/plugins/select2/select2.min.js',
                
                'public/assets/global/plugins/datatables/all.min.js',

'public/assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',

				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 

				'public/lib/angular-input-masks/angular-input-masks.js', 

				
				 

				'public/assets/global/plugins/bootbox/bootbox.min.js',

				'public/assets/global/scripts/metronic.js',
				'public/assets/admin/layout3/scripts/layout.js',
				'public/assets/admin/layout3/scripts/demo.js',  


			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};