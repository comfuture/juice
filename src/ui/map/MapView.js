/**
 * 
 */
__TOP__.namespace('ui.map');
__TOP__.include('http://maps.google.com/maps/api/js?sensor=true', function() {
	(function($){
		__TOP__.ui.map.MapView = function(el, options) {
			$this = this;
			this.options = $.extend({
				'zoom': 8,
				'center': new google.maps.LatLng(-34.397, 150.644),
				'mapTypeId': google.maps.MapTypeId.ROADMAP
			}, options);
			this.container = $(el).get(0);
			this.map = new google.maps.Map(this.container, this.options);

			this.setCenter = function(lat, lng) {
				$this.map.setCenter(new google.maps.LatLng(lat, lng));
			}
		}
		
		$.fn.mapView = function(options) {
			return this.data('map', new __TOP__.ui.map.MapView(this.get(0), options));
		}
	})(jQuery);
});