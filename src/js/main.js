document.addEventListener('DOMContentLoaded', function() {

	//	общие переменные
	const html = document.documentElement;
	const imagesForLoad = $('.js-image-load');
	const mqmd = '(min-width: 768px)';
	const mq = window.matchMedia(mqmd);
	// навигация
	const navbar = $('.navbar');
	const navbarNav = $('.navbar-nav');
	const scrollToElem = $('.js-scroll');
	const navbarCollapse = $('#navbar-collapse');
	// фиксированные кнопки внизу экрана
	const tel = $('.tel');
	const up = $('.up');
	//	переменные для анимаций по скроллу
	const addClass = 'animate-go';
	const circle = $('.circle');
	const line = $('.level__line');
	// показ бэкграунда из data атрибутов data-big, data-small (jQuery)

	function loadImage(str, match, elem){
		function eventWin(e) {
			if (e.matches) {
				elem.each((i, el) => {
					const item = $(el);
					item.css('background-image', `url(${item.data('big')})`);
				});
			} else {
				elem.each((i, el) => {
					const item = $(el);
					item.css('background-image', `url(${item.data('small')})`);
				});
			}
		}
		eventWin(match);
		match.addListener(eventWin);
	}

	/**
	* Функция анимации
	* @param {object}
	* 	@param {number} duration Общее время, которое должна длиться анимация, в мс.
	* 	@param {founction} timing(timeFraction) временная функция
	* 	значение по умолчанию:
	* 	function linear(timeFraction) {
	* 		return timeFraction;
	* 	}
	* 	@param {founction} draw(progress) основная функция анимации
	*/
	function animate(options) {

	  let start = performance.now();
	  requestAnimationFrame(function animate(time) {
		let progress;
	    // timeFraction от 0 до 1
	    let timeFraction = (time - start) / options.duration;
	    if (timeFraction > 1) timeFraction = 1;

	    // текущее состояние анимации
	    progress = options.timing ? options.timing(timeFraction) : timeFraction;

	    if (progress>0) options.draw(progress);

	    if (timeFraction < 1) {
	      requestAnimationFrame(animate);
	    }

	  });
	}

	/**
	* jQuery
	* выполнение действий с элементом при скролле
	*	@param {array} arr
	*		@param {obj}
	*			@param {object} elems jQuery массив элементов
	*			@param {array} status пустой массив для отслеживания статуса вкл выкл
	*			@param {number} position расстояние до появления эл-та
	*			@param {callback} show действие при показе эл-та
	*	 		@param {callback} hide действие при исчезании эл-та
	*/
	function scrollAnimate(arr) {
		$(window).scroll(function() {
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
			const scroll = scrollTop + $(this).height();
			let hide;
			for (let i = 0; i < arr.length; i++) {
				const position = arr[i].position || 0;
				if (arr[i].hide) {
					hide = arr[i].hide.bind(arr[i]);
				} else {
					hide = false;
				};
				arr[i].elems.each((o, val) => {
					const pos = $(val).offset().top;
					if (pos < (scroll - position)) {
						arr[i].show(o, val);
					} else {
						if (hide) hide(o, val);
					}
				})
			}
		});
	}

	/**
	* Получение координат дом элемента относительно документа
	*	@param {object} elem DOM элемент
	*	@return {object} свойства top, left внутри
	*/
	function getCoords(elem) {
	  var box = elem.getBoundingClientRect();
	  return {
	    top: box.top + pageYOffset,
	    left: box.left + pageXOffset
	  };

	}
	// обработка кликов по навигационным элементам

	scrollToElem.on('click', (e) => {
		const href = $(e.target).attr('href');
		const coord = getCoords(document.querySelector(href)).top - 100;
		const scroll = window.pageYOffset || html.scrollTop;
		animate({
			duration: 500,
			draw: function(p) {
				let progress;
				if (scroll == coord) return false;
				if (scroll - coord > 0) {
					progress = Math.floor(scroll - scroll*p);
					if (progress > coord) {
						window.scrollTo(0, progress);
					} else {
						window.scrollTo(0, coord);
					}
				} else {
					let step = coord - scroll;
					progress = Math.floor(scroll + step*p);
					if (progress < coord) {
						window.scrollTo(0, progress);
					} else {
						window.scrollTo(0, coord);
					}
				}
			}
		})
		navbarCollapse.collapse('hide');
		e.preventDefault();
	});

	loadImage(mqmd, mq, imagesForLoad);

	// вызов анимации при скролле на элементы, параметром передается массив с объектами

	scrollAnimate([
		
		// скрытие меню
		{
			elems: navbar,
			scroll: false,
			show: function (i, elem) {
				const scrollTop = window.pageYOffset || html.scrollTop; 
				if (this.scroll > scrollTop) {
					$(elem).removeClass(addClass);
				} else {
					$(elem).addClass(addClass);
				}
				this.scroll = scrollTop;
			}
		},
		
		// безопасность
		{
			elems: line,
			status: [],
			show: function(i, elem) {
					if (!this.status[i]) {
						const data = $(elem).data('width');
						animate({
							duration: 2000,
							draw: function(progress) {
								const pr = Math.round(progress*data);
								$(elem).css('width', `${pr}%`).find('span').text(`${pr}%`);
							}
						});


						
						this.status[i] = true;
					}
			}, 
			hide: function(i, elem) {
				$(elem).css('width', '').find('span').text('0%');
				this.status[i] = false;
			}
		},
		// svg круги со статистикой
		{
			elems: circle,
			status: false,
			show: function(i, elem) {
					if (!this.status) {
						$(elem).addClass(addClass);
						animate({
							duration: 3000,
							draw: function(progress) {
								$(elem).find('text').each((i,v) => {
									const val = $(v).data('num');
									$(v).text(Math.round(progress*val));
								});
							}
						});
						this.status = true;
					}
			}, 
			hide: function(i, elem) {
					$(elem).removeClass(addClass);
					$(elem).find('text').text('');
					this.status = false;
			}
		}
	]);
	
	//	вопросы. событие раскрытия.

	$('.questions__collapse').on('show.bs.collapse', function () {
 		const id = $(this).attr('id');
 		$(`.arrow[href="#${id}"]`).addClass('arrow_active');
	});
	$('.questions__collapse').on('hide.bs.collapse', function () {
 		const id = $(this).attr('id');
 		$(`.arrow[href="#${id}"]`).removeClass('arrow_active');
	})

	// скролл в начало страницы по кнопке

	up.on('click', (e) => {
		const scrollTop = window.pageYOffset || html.scrollTop;
		animate({
			duration: 500,
			draw: function(p) {
				let progress = Math.floor(scrollTop - scrollTop*p);
				progress ? window.scrollTo(0, progress) : window.scrollTo(0, 0);
			}
		})
		
	})

});
