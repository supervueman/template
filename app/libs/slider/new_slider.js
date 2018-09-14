(function($) {
	$.fn.slider = function(options, method) {
		var settings = $.extend(
			{
				item: 1,
			},
			options
		);
		var $this = this;
		function Methods() {
			this.init = function() {
				return $this.each(function() {
					var _ = $(this);
					var slide = _.find(settings.slide_class);
					var slider_width = _.width();
					var slide_length = slide.length;
					var nav = _.find(settings.nav);
					var slide_line = _.find('.slide-line');
					var index = 0;
					var translate = 0;
					function build() {
						slide.width(slider_width / settings.item);
						slide_line.width(slide.width() * slide_length);
						slide_line.css('transform', 'translateX(0px)');
					}
					function navigate() {
						nav.click(function() {
							if ($(this).hasClass('prev')) {
								settings.index -= 1;
								translate -= slide.width() * settings.item_sliding;
								console.log(translate);
							} else {
								settings.index += 1;
								translate += slide.width() * settings.item_sliding;
								console.log(translate);
							}
						});
					}
					function move() {
						console.log('');
					}
					build();
					navigate();
				});
			};
		}
		var methods = new Methods();
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Метод с именем ' + method + ' не существует для jQuery.mmenu');
		}
	};
})(jQuery);
