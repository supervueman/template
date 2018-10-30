(function($) {
	$.fn.slider = function(options, method) {
		let settings = $.extend(
			{
				item: 1,
				item_sliding: 1,
				loop: false,
				dots: false,
				response: false,
				automove: false,
				interval: 5000,
				transition: '0.5s',
				center_mode: false,
				tabs: false,
				futurama: false,
			},
			options
		);
		const $this = this;
		function Methods() {
			this.init = function() {
				return $this.each(function() {
					let slider_wrap = $(this);
					let _ = slider_wrap.find(settings.slider);
					let slide = _.find(settings.slide_class);
					let slider_width = _.width();
					let slide_length = slide.length;
					let nav = _.find(settings.nav);
					let slide_line = _.find('.slide-line');
					let viewport = _.find('.viewport');
					let tab_container = slider_wrap.find(settings.tab_container);
					let tab = tab_container.find(settings.tab_class);
					let thumb_line = tab_container.find('.thumb-line');
					let thumb_width = tab.width();
					let translate = 0;
					let thumb_line_translate = 0;
					let futurama_frame_translate = 0;
					let futurama_frame_index = 0;
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
								settings.automove =
									settings.response[key].automove == undefined
										? settings.automove
										: settings.response[key].automove;
								settings.interval =
									settings.response[key].interval == undefined
										? settings.interval
										: settings.response[key].interval;
								settings.transition =
									settings.response[key].transition == undefined
										? settings.transition
										: settings.response[key].transition;
								settings.tabs =
									settings.response[key].tabs == undefined
										? settings.tabs
										: settings.response[key].tabs;
							}
						}
					}
					function tabsSettings() {
						settings.item = 1;
						settings.item_sliding = 1;
					}
					function futuramaSettings() {
						settings.tabs = true;
						settings.dots = false;
					}
					function resize() {
						$(window).resize(function() {
							reset();
							if (settings.response) {
								response();
							}
							if (settings.futurama) {
								futuramaSettings();
							}
							if (settings.tabs) {
								tabsSettings();
							}
							if (settings.center_mode) {
								centerMode();
							}
							build();
						});
					}
					function build() {
						slide.width(Math.floor(slider_width / settings.item));
						slide_line.width(slide.width() * slide_length);
						slide_line.css({ transform: 'translateX(0px)', transition: settings.transition });
						if (settings.dots) {
							dotBuild();
						}
						if (settings.tabs) {
							tabInit();
						}
						if (settings.futurama) {
							futuramaBuild();
						}
						slideActive();
					}
					function futuramaBuild() {
						let thumb_length = tab.length;
						const futurama_frame = $('<div/>', { class: 'futurama-frame' });
						tab_container.append(futurama_frame);
						futurama_frame.width(thumb_width).css({
							position: 'absolute',
							height: `${tab.height()}px`,
							top: 0,
							left: 0,
						});
						if (thumb_width > 80) {
							tab.width(80);
						}
						thumb_line
							.width(thumb_width * thumb_length)
							.css({ transform: `translateX(${-thumb_line_translate * index}px)` });
					}
					function thumb_line_move() {
						let futurama_frame = tab_container.find('.futurama-frame');
						let visible_thumb_count = Math.floor(slider_width / tab.width());
						let visible_thumb_width = visible_thumb_count * tab.width();
						let remnant = Math.floor(tab_container.width() - visible_thumb_width);
						// For next
						let frame_last_pos = visible_thumb_width - thumb_width;
						let last_elem_pos = (tab.length - visible_thumb_count) * thumb_width;

						switch (direction) {
							case 'next':
								if (remnant <= 25) {
									if (
										index * thumb_width + thumb_width <= frame_last_pos &&
										thumb_line_translate !== -last_elem_pos
									) {
										futurama_frame_translate = index * thumb_width;
									} else if (thumb_line_translate !== -last_elem_pos + thumb_width) {
										futurama_frame_index = frame_last_pos / thumb_width - 1;
										thumb_line_translate = -thumb_width * (index - futurama_frame_index);
										futurama_frame_translate = frame_last_pos - thumb_width;
									} else if (
										thumb_line_translate !== -last_elem_pos &&
										futurama_frame_index * thumb_width !== visible_thumb_width - thumb_width
									) {
										futurama_frame_translate += thumb_width;
									} else {
										thumb_line_translate -= thumb_width - remnant;
										futurama_frame_translate += remnant;
									}
									// console.log('next <= 25');
								} else if (remnant > 25) {
									if (
										index * thumb_width <= frame_last_pos &&
										thumb_line_translate !== -last_elem_pos
									) {
										futurama_frame_translate = index * thumb_width;
									} else if (thumb_line_translate !== -last_elem_pos + thumb_width) {
										futurama_frame_index = frame_last_pos / thumb_width;
										thumb_line_translate = -thumb_width * (index - futurama_frame_index);
										futurama_frame_translate = frame_last_pos;
									} else if (thumb_line_translate === -last_elem_pos + thumb_width) {
										thumb_line_translate -= thumb_width - remnant;
										futurama_frame_translate += remnant;
									}
									// console.log('next > 25');
								}
								thumb_line.css({ transform: `translateX(${thumb_line_translate}px)` });
								futurama_frame.css({ transform: `translateX(${futurama_frame_translate}px)` });
								break;
							case 'prev':
								let elem_index_visible_pos =
									index * thumb_width - (thumb_line_translate - visible_thumb_width);
								console.log(elem_index_visible_pos);
								if (futurama_frame_translate === thumb_line_translate) {
									futurama_frame_translate = frame_last_pos + remnant;
									thumb_line_translate = -thumb_line.width() + visible_thumb_width + remnant;
									console.log('1');
								} else if (futurama_frame_translate === thumb_width && thumb_line_translate !== 0) {
									thumb_line_translate += thumb_width;
									console.log('2');
								} else if (
									futurama_frame_translate + thumb_width ===
									Math.floor(tab_container.width())
								) {
									futurama_frame_translate -= remnant;
									thumb_line_translate += thumb_width - remnant;
									console.log('3');
								} else if (futurama_frame_translate !== thumb_width && thumb_line_translate !== 0) {
									futurama_frame_translate -= thumb_width;
									console.log('4');
								} else if (index * thumb_width) {
									console.log('4/1');
								} else {
									futurama_frame_translate -= thumb_width;
									console.log('5');
								}
								thumb_line.css({ transform: `translateX(${thumb_line_translate}px)` });
								futurama_frame.css({ transform: `translateX(${futurama_frame_translate}px)` });
								break;
						}
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
					function tabInit() {
						for (let i = 0; i <= slide_length; i++) {
							$(tab[i]).attr('data-tab', i);
						}
					}
					function navigate() {
						nav.click(function() {
							direction = $(this).hasClass('prev') ? 'prev' : 'next';
							if (direction == 'prev' && translate !== 0) {
								index--;
								translate += slide.width() * settings.item_sliding;
							} else if (
								direction == 'next' &&
								translate * -1 < slide_line.width() - slide.width() * settings.item
							) {
								index++;
								translate -= slide.width() * settings.item_sliding;
							} else if (settings.loop) {
								loop();
							}
							move();
						});
					}
					function touchMove() {
						let bool = false;
						let startX = 0;
						let endX = 0;
						let prev_translate;
						viewport.on('touchstart', function(e) {
							prev_translate = translate;
							startX = e.originalEvent.changedTouches[0].screenX;
							bool = true;
							slide_line.css({ transition: '0s' });
							viewport.on('touchmove', function(e) {
								if (bool) {
									x = e.originalEvent.changedTouches[0].screenX - startX;
									let translateX = prev_translate + x;
									slide_line.css({ transform: `translateX(${translateX}px)` });
								}
							});
						});
						viewport.on('touchend', function(e) {
							endX = e.originalEvent.changedTouches[0].screenX;
							slide_line.css({ transition: settings.transition });
							direction = endX >= startX ? 'prev' : 'next';
							if (
								(direction == 'next' && endX - startX > -130) ||
								(direction == 'prev' && endX - startX < 130)
							) {
								slide_line.css({ transform: `translateX(${translate}px)` });
								return;
							}
							if (direction == 'prev' && translate !== 0) {
								index--;
								translate += slide.width() * settings.item_sliding;
							} else if (
								direction == 'next' &&
								translate * -1 < slide_line.width() - slide.width() * settings.item
							) {
								index++;
								translate -= slide.width() * settings.item_sliding;
							} else if (settings.loop) {
								loop();
							}
							prev_translate = translate;
							move();
						});
					}
					function move() {
						slide_line.css('transform', `translateX(${translate}px)`);
						if (settings.dots) {
							dotActive();
						}
						if (settings.tabs) {
							tabActive();
						}
						if (settings.futurama) {
							thumb_line_move();
						}
						slideActive();
					}
					function autoMove() {
						settings.loop = true;
						setInterval(function() {
							if (translate * -1 < slide_line.width() - slide.width() * settings.item) {
								index++;
								translate = index * slide.width() * settings.item_sliding * -1;
								move();
							} else if (settings.loop) {
								loop();
								move();
							}
						}, settings.interval);
					}
					function dotActive() {
						_.find('.dot').removeClass('dot-active');
						_.find(`[data-dot="${index}"]`).addClass('dot-active');
					}
					function tabActive() {
						tab.removeClass('tab-active');
						tab_container.find(`[data-tab="${index}"]`).addClass('tab-active');
					}
					function dotMove() {
						_.find('.dot').click(function() {
							index = $(this).data('dot');
							translate = index * slide.width() * settings.item_sliding * -1;
							move();
						});
					}
					function tabMove() {
						tab.click(function() {
							let prev_index = index;
							index = $(this).data('tab');
							prev_index > index ? (direction = 'prev') : (direction = 'next');
							translate = index * slide.width() * settings.item_sliding * -1;
							console.log(direction);
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
								if (settings.futurama) {
									futurama_frame_translate = 0;
									thumb_line_translate = 0;
									futurama_frame_index = 0;
								}
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
						slider_width = _.width();
						_.find('.dots').remove();
					}
					if (settings.response) {
						response();
						resize();
					}
					if (settings.futurama) {
						futuramaSettings();
					}
					if (settings.tabs) {
						tabsSettings();
					}
					build();
					navigate();
					touchMove();
					if (settings.dots) {
						dotMove();
					}
					if (settings.tabs) {
						tabMove();
					}
					if (settings.automove) {
						autoMove();
					}
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
