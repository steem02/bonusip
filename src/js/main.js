document.addEventListener('DOMContentLoaded', function() {

	//	все переменные

	const imagesForLoad = $('.js-image-load');
	const mqmd = '(min-width: 768px)';
	const mq = window.matchMedia(mqmd);

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

	  var start = performance.now();

	  requestAnimationFrame(function animate(time) {
	    // timeFraction от 0 до 1
	    var timeFraction = (time - start) / options.duration;
	    if (timeFraction > 1) timeFraction = 1;

	    // текущее состояние анимации
	    var progress = options.timing(timeFraction)

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
			const scroll = $(this).scrollTop() + $(this).height();
			for (let i = 0; i < arr.length; i++) {
				const position = arr[i].position || 0;
				const hide = arr[i].hide.bind(arr[i]) || false;
				arr[i].elems.each((o, val) => {
					const pos = $(val).offset().top;
					if (pos < (scroll - position)) {
						arr[i].show(o, val);
					} else {
						if (hide) hide(o,val);
					}
				})
			}
		});
	}
	loadImage(mqmd, mq, imagesForLoad);

	// вызов анимации при скролле на элементы, параметром передается массив с объектами

	scrollAnimate([
		// безопасность
		{
			elems: line,
			status: [],
			show: function(i, elem) {
					if (!this.status[i]) {
						const data = $(elem).data('width');
						animate({
							duration: 3000,
							timing: function(timeFraction) {
								return timeFraction;
							},
							draw: function(progress) {
								const pr = Math.round(progress*data);
								$(elem).css('width', `${pr}%`).find('span').text(`${pr}%`);
							}
						});


						
						this.status[i] = true;
					}
			}, 
			hide: function(i, elem) {
				$(elem).css('width', ``).find('span').text(`0%`);
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
							timing: function(timeFraction) {
								return timeFraction;
							},
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
});
