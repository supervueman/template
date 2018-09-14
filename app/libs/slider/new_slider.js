(function($) {
	$.fn.slider = function(options, method) {
		let settings = $.extend(
			{
				item: 1,
				item_sliding: 1,
				loop: false,
				dots: false,
				response: false,
			},
			options
		);
		const $this = this;
		function Methods() {
			this.init = function() {
				return $this.each(function() {
					const _ = $(this);
					let slide = _.find(settings.slide_class);
					let slider_width = _.width();
					let slide_length = slide.length;
					let nav = _.find(settings.nav);
					let slide_line = _.find('.slide-line');
					let translate = 0;
					let direction = 'next';
					let index = 0;
					function response() {
						for (let key in settings.response) {
							if ($(window).width() >= key) {
								settings.item =
									settings.response[key].item == undefined
										? settings.item
										: settings.response[key].item;
								settings.item_sliding =
									settings.response[key].item_sliding == undefined
										? settings.item_sliding
										: settings.response[key].item_sliding;
								settings.loop =
									settings.response[key].loop == undefined
										? settings.loop
										: settings.response[key].loop;
								settings.dots =
									settings.response[key].dots == undefined
										? settings.dots
										: settings.response[key].dots;
							}
						}
						reset();
						build();
					}
					function resize() {
						$(window).resize(function() {
							slider_width = _.width();
							response();
						});
					}
					function build() {
						slide.width(Math.floor(slider_width / settings.item));
						slide_line.width(slide.width() * slide_length);
						slide_line.css('transform', 'translateX(0px)');
						if (settings.dots) {
							dotBuild();
						}
						slideActive();
					}
					function dotBuild() {
						const dots_container = $('<div/>', { class: 'dots' });
						let html = '';
						for (let i = 0; i <= Math.round((slide_length - settings.item) / settings.item_sliding); i++) {
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
						slideActive();
					}
					function dotActive() {
						_.find('.dot').removeClass('dot-active');
						_.find(`[data-dot="${index}"]`).addClass('dot-active');
					}
					function dotMove() {
						_.find('.dot').click(function() {
							index = $(this).data('dot');
							translate = index * slide.width() * settings.item_sliding * -1;
							move();
						});
					}
					function slideActive() {
						slide.removeClass('slide-active');
						let arr = slide.slice(
							Math.round((translate / _.width()) * settings.item * -1),
							Math.round((translate / _.width()) * settings.item * -1 + settings.item)
						);
						for (let i = 0; i <= arr.length; i++) {
							$(arr[i]).addClass('slide-active');
						}
					}
					function loop() {
						switch (direction) {
							case 'next':
								index = 0;
								translate = 0;
								break;
							case 'prev':
								index = Math.round((slide_length - settings.item) / settings.item_sliding);
								translate = (slide_line.width() - slide.width() * settings.item) * -1;
								break;
						}
					}
					function reset() {
						translate = 0;
						direction = 'next';
						index = 0;
						_.find('.dots').remove();
					}
					if (settings.response) {
						response();
						resize();
					}
					build();
					navigate();
					dotMove();
				});
			};
		}
		const methods = new Methods();
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Метод с именем ' + method + ' не существует для jQuery.mmenu');
		}
	};
})(jQuery);
