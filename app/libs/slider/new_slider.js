(function($) {
	$.fn.slider = function(options, method) {
		var settings = $.extend(
			{
				item: 1,
				item_sliding: 1,
				loop: false,
				dots: false,
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
					var translate = 0;
					var direction = 'next';
					var index = 0;
					function build() {
						slide.width(Math.round(slider_width / settings.item));
						slide_line.width(slide.width() * slide_length);
						slide_line.css('transform', 'translateX(0px)');
						if (settings.dots) {
							dotBuild();
						}
					}
					function dotBuild() {
						var dots_container = $('<div/>', { class: 'dots' });
						var html = '';
						for (var i = 0; i <= Math.round((slide_length - settings.item) / settings.item_sliding); i++) {
							html += `<div class="dot" data-dot="${i}"></div>`;
						}
						_.append(dots_container.html(html));
						_.find('.dot')
							.first()
							.addClass('dot-active');
					}
					function navigate() {
						nav.click(function() {
							direction = $(this).hasClass('prev') ? 'prev' : 'next';
							if ($(this).hasClass('prev') && translate !== 0) {
								index--;
								translate += slide.width() * settings.item_sliding;
								move();
							} else if (
								$(this).hasClass('next') &&
								translate * -1 < slide_line.width() - slide.width() * settings.item
							) {
								index++;
								translate -= slide.width() * settings.item_sliding;
								move();
							} else if (settings.loop) {
								loop();
								move();
							}
						});
					}
					function move() {
						slide_line.css('transform', `translateX(${translate}px)`);
						if (settings.dots) {
							dotActive();
						}
					}
					function dotActive() {
						console.log(index);
						_.find('.dot').removeClass('dot-active');
						_.find(`[data-dot="${index}"]`).addClass('dot-active');
					}
					function loop() {
						switch (direction) {
							case 'next':
								index = 0;
								translate = 0;
								break;
							case 'prev':
								index = _.find('.dot').length;
								translate = (slide_line.width() - slide.width() * settings.item) * -1;
								break;
						}
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
