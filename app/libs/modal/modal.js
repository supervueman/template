(function() {
	function SpacePopup(options) {
		var _ = this;
		_.opened;
		_.closed;
		_.close_btn = $(options.close_btn);
		_.link = $(options.popup) || $('.open-popup');
		_.body = $('body');
		_.transition = options.transition || 500;
		_.body_class;
		_.popup_class;
		_.btn_closed_class;
		_.visible_class;
		_.fun_open = options.when_open;
		_.fun_close = options.when_close;
		_.to = options.to;
		_.parent;
		_.ths_button;
		_.from = $(options.from);
		_.wrap = options.wrap;
		_.btn_open = function() {
			_.link.click(function(e) {
				e.preventDefault();
				var ths = $(this),
					str = options.popup.substr(1, options.popup.length),
					href = ths.attr('href');
				_.ths_button = ths;
				_.parent = ths.closest(_.wrap).find(_.to);
				if (ths.hasClass('appender')) {
					_.opened = _.from.find(href);
					_.parent.append(_.opened);
					_.parent.closest(_.wrap).addClass('appender-popup-wrap');
					_.visible_class = 'appender-popup';
				} else {
					_.visible_class = 'visible-popup';
					_.opened = $(href);
				}
				_.body_class = 'popup-' + str;
				_.popup_class = 'popup-opened-' + str;
				_.btn_closed_class = 'closed-' + str;
				_.opened.addClass(_.visible_class);
				_.close_btn.addClass(_.btn_closed_class);
				setTimeout(function() {
					_.body.addClass(_.body_class);
					_.opened.addClass(_.popup_class);
				}, 50);
				_.when_open();
			});
		};
		_.btn_close = function() {
			_.close_btn.click(function(e) {
				e.preventDefault();
				if (_.parent != undefined) {
					_.body.removeClass(_.body_class);
					if (_.parent.closest(_.wrap).hasClass('appender-popup-wrap')) {
						_.parent.closest(_.wrap).removeClass('appender-popup-wrap');
						_.opened.removeClass(_.visible_class);
						setTimeout(function() {
							_.from.append(_.opened);
						}, _.transition);
					}
					_.opened.removeClass(_.popup_class);
					setTimeout(function() {
						_.opened.removeClass(_.visible_class);
					}, _.transition);
					_.when_close();
				}
			});
		};
		_.close = function() {
			if (_.body_class != undefined && _.popup_class != undefined) {
				if (_.parent.closest(_.wrap).hasClass('appender-popup-wrap')) {
					_.parent.closest(_.wrap).removeClass('appender-popup-wrap');
					_.opened.removeClass(_.visible_class);
					setTimeout(function() {
						_.from.append(_.opened);
					}, _.transition);
				}
				_.body.removeClass(_.body_class);
				_.opened.removeClass(_.popup_class);
				_.close_btn.removeClass(_.btn_closed_class);
				_.when_close();
			}
		};
		_.when_open = function() {
			_.fun_open();
		};
		_.when_close = function() {
			_.fun_close();
		};
		_.init = function() {
			_.btn_open();
			_.btn_close();
		};
	}
	window.spop = SpacePopup;
})();

(function($) {
	$.fn.modal = function(options, method) {
		var settings = $.extend(
			{
				hamburger: '#hamburger',
				close_elements: '.blocker',
			},
			options
		);
		var $this = this;
		function Methods() {
			var ths = this;
			ths.init = function() {
				return $this.each(function() {
					var _ = $(this);
					var modal_count;
					function click_open() {
						_.click(function(e) {
							e.preventDefault();
							open_modal();
						});
					}
					function click_close() {
						$(settings.btn_close).click(function(e) {
							e.preventDefault();
							close_modal($(this));
						});
					}
					function open_modal() {
						var id = _.attr('href').substr(1, _.attr('href').length);
						function activate_modal() {
							$(settings.to).addClass('animate-modal animate-' + id);
							$('.active-modal').css('z-index', '8000');
							$('#' + id)
								.addClass('active-modal')
								.css('z-index', '9000');
						}
						if (_.hasClass('appender')) {
							$(settings.to).addClass('modal-opened append-' + id);
							$(settings.to).append($('#' + id));
							setTimeout(function() {
								activate_modal();
								count_modals();
							}, 50);
						} else {
							$(settings.to).addClass('modal-opened append-' + id);
							activate_modal();
							count_modals();
						}
					}
					function close_modal(elem) {
						var id = elem.data('modal');
						function deactivate_modal() {
							if (modal_count < 1) {
								$(settings.to).removeClass('animate-modal');
							}
							$(settings.to).removeClass('animate-' + id);
							$('#' + id).removeClass('active-modal');
						}
						function deactivate_wrapper() {
							if (modal_count < 1) {
								$(settings.to).removeClass('modal-opened');
							}
							$(settings.to).removeClass('append-' + id);
						}
						if (_.hasClass('appender')) {
							count_modals();
							deactivate_modal();
							setTimeout(function() {
								$(settings.from).append($('#' + id));
								deactivate_wrapper();
							}, 500);
						} else {
							count_modals();
							deactivate_wrapper();
							deactivate_modal();
						}
					}
					function z_modal() {
						$('.modal').click(function() {
							$('.active-modal').css('z-index', '8000');
							$(this).css('z-index', '9000');
						});
					}
					function count_modals() {
						modal_count = $('.active-modal').length;
					}
					click_open();
					click_close();
					z_modal();
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
