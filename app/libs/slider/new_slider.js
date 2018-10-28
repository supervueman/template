(function($) {
	$.fn.slider = function(options, method) {
		// Настройки по дефолту
		let settings = $.extend(
			{
				item: 1, // Количество отображаемых слайдов
				item_sliding: 1, // По сколько слайдов должно слайдиться
				loop: false, // Свойство для включения или выключения бесконечной прокрутки
				dots: false, // Свойство для включения или выключения точек
				response: false, // Свойство для включения или выключения адаптива
				automove: false, // Свойство для включения или выключения автопроигрывания
				interval: 5000, // Свойство для определения интервала автопроигрывания
				transition: '0.5s', // Свойство для определения transition
				center_mode: false, // Свойство для включения или выключения режима определения центрального слайда
				tabs: false, // Свойство для включения или выключения табов
				fotorama: false, // Свойство активирующее фотораму (работает только я tabs === true)
			},
			options // Настройки из вызова плагина
		);
		const $this = this; // Переменная содержащая все слайдеры
		function Methods() {
			this.init = function() {
				return $this.each(function() {
					let slider_wrap = $(this);
					let _ = slider_wrap.find(settings.slider); // Текущий слайдер
					let slide = _.find(settings.slide_class); // Находим все слайды
					let slider_width = _.width(); // Ширина слайда
					let slide_length = slide.length; // Количество слайдов
					let nav = _.find(settings.nav); // Находим стрелочки для навигации
					let slide_line = _.find('.slide-line'); // Находим обертку слайдов
					let viewport = _.find('.viewport'); // Находим вьюпорт который отображает видимые элементы
					let tab_container = slider_wrap.find(settings.tab_container); // Находим обертку табов
					let tab = tab_container.find(settings.tab_class); // Находим табы
					let translate = 0; // Изначально смещение линии слайдов равно 0
					let direction = 'next'; // Изначальное направление движения линии слайдов
					let index = 0; // Изначальный индекс, определяется для точек и табов
					// Функция для выделения центрального слайда
					// TODO: пока не работает как надо
					function centerMode() {
						_.addClass('center-mode'); // Добавляем текущему слайдеру класс center-mode
						// Количество отображаемых слайдов должно быть нечетным, поэтому плюсуем 1 если четное
						if (settings.item % 2 == 0) {
							settings.item = settings.item + 1;
							settings.item_sliding = 1;
						}
					}
					// Функция для непосредственного определения и выделения центрального слайда
					function centerElement() {
						let slide_active = _.find('.slide-active'); // Находим все активные слайды
						let slide_active_length = slide_active.length; // Определяем их количество
						let center_element = $(slide_active[Math.floor(slide_active_length / 2)]); // Находим центральный слайд
						slide.removeClass('center-element'); // Предварительно у всех слайдов удаляем класс center-element
						center_element.addClass('center-element'); // Присваиваем центральному слайду класс center-element
					}
					// Функция вызываемая если у нас есть настройки для адаптивного режима
					function response() {
						// Пробегаем циклом по объекту с настройками адаптива
						for (let key in settings.response) {
							// Определяем ширину экрана и сравниваем с брейкпоинтом переданном в настройках адаптива
							if ($(window).width() >= key) {
								// При совпадении меняем текущие настройки на настройки в текущем брейкпоинте
								// Если каких то настроек нет, то присвоить изначальные
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
					function fotoramaSettings() {
						settings.tabs = true;
						settings.dots = false;
					}
					// Функция вызываемая при ресайзе экрана для обновления состояния сладера
					// Срабатывает если только настройка response !== false || undefined
					function resize() {
						$(window).resize(function() {
							// Функция для возврата настроек в исходное положение
							reset();
							// Функция для присвоения настроек в зависимости от ширины экрана
							if (settings.response) {
								response();
							}
							// Функция установки настроек для фоторамы
							if (settings.fotorama) {
								fotoramaSettings();
							}
							// Функция установки настроек для табов
							if (settings.tabs) {
								tabsSettings();
							}
							// TODO: это пока не работает
							if (settings.center_mode) {
								centerMode();
							}
							// Построение сладера
							build();
						});
					}
					// Функция для построения сладера
					function build() {
						// Считаем ширину слайда из ширины слайдера деленной на количество отображаемых слайдов и присваиваем слайдам
						slide.width(Math.floor(slider_width / settings.item));
						// Считаем и присваиваем ширину линии слайдов из ширины одного слайда умноженного на количество слайдов
						slide_line.width(slide.width() * slide_length);
						// Присваиваем свойства transform и transition линии слайдов
						slide_line.css({ transform: 'translateX(0px)', transition: settings.transition });
						// Если настройка dots === true то вызываем функцию построения точек
						if (settings.dots) {
							dotBuild();
						}
						if (settings.tabs) {
							tabInit(); // Инициализируем табы
						}
						// Функция для определения активных (видимых) слайдов отображаемых во viewport
						slideActive();
					}
					// Функция для построения точек
					function dotBuild() {
						// Создаем контейнер для точек и присваиваем класс dots
						const dots_container = $('<div/>', { class: 'dots' });
						// Переменная для хранения генерируемой разметки всех точек
						let html = '';
						// Цикл в условии которого высчитывается количество точек (надеюсь это правильная формула, но вроде все норм считает)
						for (let i = 0; i <= Math.round((slide_length - settings.item) / settings.item_sliding); i++) {
							// Генерируется разметка для всех точек и конкатенируется в строку с присвоением индекса точки в data-dot
							html += `<div class="dot" data-dot="${i}"></div>`;
						}
						// В слайдер аппендится контейнер точек в который рендерится сгенерированная разметка со всеми точками
						_.append(dots_container.html(html));
						// Находим первую точку и присваиваем ей класс dot-active
						_.find('.dot')
							.first()
							.addClass('dot-active');
					}
					// Функция для индексации табов
					function tabInit() {
						for (let i = 0; i <= slide_length; i++) {
							// Присваиваем каждому табу атрибут data-tab со значением индекса
							$(tab[i]).attr('data-tab', i);
						}
					}
					// Функция навигации по стрелочкам
					function navigate() {
						nav.click(function() {
							// Определяем наличие класса направления у текущей стрелки и устанавливаем направление движения
							direction = $(this).hasClass('prev') ? 'prev' : 'next';
							// Если направление движения prev и смещение линии слайдов не 0, то есть линия слайдов уже смещена
							if (direction == 'prev' && translate !== 0) {
								// Уменьшаем индекс на еденицу
								index--;
								// Считаем смещение линии слайдов, плюсуется потому, что нужно смещать вправо
								translate += slide.width() * settings.item_sliding;
							}
							// Если направление движения next и смещение меньше чем позиция последнего слайда
							else if (
								direction == 'next' &&
								translate * -1 < slide_line.width() - slide.width() * settings.item
							) {
								// Увеличиваем индекс на еденицу
								index++;
								// Считаем смещение, минусуем потому что линию слайдов нужно смещать влево
								translate -= slide.width() * settings.item_sliding;
							}
							// Если настройка loop === true то вызываем функцию возврата в начало или в конец в зависимости от направления движения
							else if (settings.loop) {
								loop();
							}
							// Функция для присвоения расчетного смещения (translate) линии слайдов
							move();
						});
					}
					// Функция реализующая свайп на мобиле
					function touchMove() {
						let bool = false; // Переменная которая разрешает или запрещает смещение
						let startX = 0; // Переменная для определения начальной координаты движения
						let endX = 0; // Переменная для определения конечной координаты движения
						let prev_translate; // Переменная для хранения предыдущего смещения
						// Событие прикосновения к экрану на эелементе viewport
						viewport.on('touchstart', function(e) {
							// Присваиваем текущее смещение линии слайдов
							prev_translate = translate;
							// Определяем начальную координату
							startX = e.originalEvent.changedTouches[0].screenX;
							// Разрешаем смещение
							bool = true;
							// Устанавливаем transition в 0
							slide_line.css({ transition: '0s' });
							// Вызываем событие движения по экрану
							viewport.on('touchmove', function(e) {
								// Если смещение разрешено
								if (bool) {
									// Определяем координату x на протяжении смещения
									x = e.originalEvent.changedTouches[0].screenX - startX;
									// Высчитываем смещение
									let translateX = prev_translate + x;
									// Присваиваем расчетное смещение линии слайдов
									slide_line.css({ transform: `translateX(${translateX}px)` });
								}
							});
						});
						// Вызываем событие окончания смещения
						viewport.on('touchend', function(e) {
							// Запрещаем смещение
							bool = false;
							// Определяем конечную координату
							endX = e.originalEvent.changedTouches[0].screenX;
							// Возвращаем transition
							slide_line.css({ transition: settings.transition });
							// Определяем направление смещения
							direction = endX >= startX ? 'prev' : 'next';
							// Не выполнять дальнейший код если разница между конечной и начальной координатой смещения менее 80 пикселей
							if (
								(direction == 'next' && endX - startX > -80) ||
								(direction == 'prev' && endX - startX < 80)
							) {
								// Восстановить смещение линии слайдов
								slide_line.css({ transform: `translateX(${translate}px)` });
								return;
							}
							// Если направление движения prev и смещение линии слайдов не 0, то есть линия слайдов уже смещена
							if (direction == 'prev' && translate !== 0) {
								// Уменьшаем индекс на еденицу
								index--;
								// Считаем смещение линии слайдов, плюсуется потому, что нужно смещать вправо
								translate += slide.width() * settings.item_sliding;
							}
							// Если направление движения next и смещение меньше чем позиция последнего слайда
							else if (
								direction == 'next' &&
								translate * -1 < slide_line.width() - slide.width() * settings.item
							) {
								// Увеличиваем индекс на еденицу
								index++;
								// Считаем смещение, минусуем потому что линию слайдов нужно смещать влево
								translate -= slide.width() * settings.item_sliding;
							}
							// Если настройка loop === true то вызываем функцию возврата в начало или в конец в зависимости от направления движения
							else if (settings.loop) {
								loop();
							}
							// Сохраняем предыдущее смещение
							prev_translate = translate;
							// Вызываем функцию смещения
							move();
						});
					}
					// Функция для смещения слайдов
					function move() {
						// Присваиваем расчетное смещение к линии слайдов
						// translate глобальная переменная
						slide_line.css('transform', `translateX(${translate}px)`);
						// Функция для определения активной точки
						if (settings.dots) {
							dotActive();
						}
						if (settings.tabs) {
							tabActive();
						}
						// Функция для определения активных (видимых) слайдов
						slideActive();
					}
					// Функция для автоматического пролистывания слайдов
					function autoMove() {
						// Настройка loop выставляется в true потому что в конце слайда необходимо возвращаться в начало а иначе он просто встанет на месте
						settings.loop = true;
						// Устнавливаем интервал через который будет происходить смещение
						setInterval(function() {
							// Если смещение меньше позиции последнего слайда
							if (translate * -1 < slide_line.width() - slide.width() * settings.item) {
								// Увеличиваем индекс на еденицу
								index++;
								// Высчитываем смещение в зависимости от индекса
								translate = index * slide.width() * settings.item_sliding * -1;
								// Вызываем функцию смещения
								move();
							}
							// TODO: это скорей всего не нужно, но это не точно
							else if (settings.loop) {
								loop();
								move();
							}
						}, settings.interval); // Интервал указывается в настройках
					}
					// Функция для определения активной точки
					function dotActive() {
						// Находим все точки в слайдере и предварительно убираем класс dot-active
						_.find('.dot').removeClass('dot-active');
						// Находим точку по индексу и присваиваем ей класс dot-active
						_.find(`[data-dot="${index}"]`).addClass('dot-active');
					}
					// Функция для определения активного таба
					function tabActive() {
						// Находим все табы в слайдере и предварительно убираем класс tab-active
						tab.removeClass('tab-active');
						// Находим таб по индексу и присваиваем ему класс tab-active
						tab_container.find(`[data-tab="${index}"]`).addClass('tab-active');
					}
					// Функция для расчета смещения при нажатии на точку
					function dotMove() {
						_.find('.dot').click(function() {
							// У текущей точки забираем значение атрибута data-dot и устанавливаем его в index
							index = $(this).data('dot');
							// Расчитываем смещение в зависимости от индекса
							translate = index * slide.width() * settings.item_sliding * -1;
							// Вызываем функцию смещения
							move();
						});
					}
					// Функция для расчета смещения при нажатии на таб
					function tabMove() {
						tab.click(function() {
							// У текущего таба забираем значение атрибута data-tab и устанавливаем его в index
							index = $(this).data('tab');
							// Расчитываем смещение в зависимости от индекса
							translate = index * slide.width() * settings.item_sliding * -1;
							// Вызываем функцию смещения
							move();
						});
					}
					// Функция орпеделяющая активные (видимые слайды)
					function slideActive() {
						// Предварительно у всех слайдов удаляем класс slide-active
						slide.removeClass('slide-active');
						// Из всех слайдов находим видимые (надеюсь формула правильная, но вроде все работает нормально) и помещаем их в массив
						let arr = slide.slice(
							Math.round((translate / _.width()) * settings.item * -1),
							Math.round((translate / _.width()) * settings.item * -1 + settings.item)
						);
						// Бежим циклом по созданному массиву и всем элементам присваиваем класс slide-active
						for (let i = 0; i <= arr.length; i++) {
							$(arr[i]).addClass('slide-active');
						}
						// TODO: Это пока не работает
						if (settings.center_mode) {
							centerElement();
						}
					}
					// Функция вызываемая при достижении конца слайда, либо при направлении prev находясь в самом начале
					function loop() {
						// Сравниваем направление движения линии слайдов
						switch (direction) {
							// Если next то обнуляем index и смещение
							case 'next':
								index = 0;
								translate = 0;
								break;
							// Если prev то устанавливаем индекс и смещение в максимальные занчения
							case 'prev':
								index = Math.round((slide_length - settings.item) / settings.item_sliding);
								translate = (slide_line.width() - slide.width() * settings.item) * -1;
								break;
						}
					}
					// Сброс настроек в первоначальные
					function reset() {
						translate = 0;
						direction = 'next';
						index = 0;
						slider_width = _.width();
						// Удаляем точки
						_.find('.dots').remove();
					}
					if (settings.response) {
						response(); // Функция для адаптива слайдера
						resize(); // Функция для обновления состояния слайдера при изменения ширины экрана
					}
					if (settings.fotorama) {
						fotoramaSettings(); // Функция для установки настроек для фоторамы
					}
					if (settings.tabs) {
						tabsSettings(); // Функция для установки настроек для табов
					}
					if (settings.center_mode) {
						centerMode(); // TODO: это пока не работает
					}
					build(); // Функция для построения слайдера
					navigate(); // Функция для навигации по стрелочкам
					touchMove(); // Функция для навигации при свайпе
					if (settings.dots) {
						dotMove(); // Функция для навигации по точкам
					}
					if (settings.tabs) {
						tabMove(); // Функция для навигации по табам
					}
					if (settings.automove) {
						autoMove(); // Функция для автопроигрывания слайдера
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
