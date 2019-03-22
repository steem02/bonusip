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
	const animateBlind = 'animate-blind'; // класс активации шторки на элементах
	const blind = $('.blind'); // элементы со шторкой
	const circle = $('.circle');
	const line = $('.level__line');
	// переменные для яндекс карт
	const ym = $('#map-yandex');

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
	* Получение координат дом элемента относительно документа
	*	@param {object} elem DOM элемент
	*	@return {object} свойства top, left внутри
	*/
	function getCoords(elem) {
	  const box = elem.getBoundingClientRect();
	  return {
	    top: box.top + pageYOffset,
	    left: box.left + pageXOffset
	  };

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
			let hide = false;
			for (let i = 0; i < arr.length; i++) {
				const position = arr[i].position || 0;
				if (arr[i].hide) hide = arr[i].hide.bind(arr[i]);
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

	// обработка кликов по навигационным элементам

	scrollToElem.on('click', (e) => {
		const href = $(e.target).attr('href');
		const coord = getCoords(document.querySelector(href)).top - 100;
		const scroll = pageYOffset || html.scrollTop;
		animate({
			duration: 500,
			draw: function(p) {
				let progress;
				if (scroll === coord) return false;
				if (scroll - coord > 0) {
					progress = Math.floor(scroll - scroll*p);
					progress > coord ?	scrollTo(0, progress) : scrollTo(0, coord);
				} else {
					let step = coord - scroll;
					progress = Math.floor(scroll + step*p);
					progress < coord ? scrollTo(0, progress) : scrollTo(0, coord);
				}
			}
		})
		navbarCollapse.collapse('hide');
		e.preventDefault();
	});

	loadImage(mqmd, mq, imagesForLoad);

	// вызов анимации при скролле на элементы, параметром передается массив с объектами

	scrollAnimate([
		// активация анимаций на блоках
		{
			elems: blind,
			scroll: false,
			show: function (i, elem) {
				$(elem).addClass(animateBlind);
			},
			hide: function (i, elem) {
				$(elem).removeClass(animateBlind);
			}
		},
		// скрытие меню
		{
			elems: navbar,
			scroll: false,
			show: function (i, elem) {
				const scrollTop = window.pageYOffset || html.scrollTop; 
				if (this.scroll > scrollTop) {
					$(elem).removeClass(addClass);

				} else if (scrollTop > 300) {
					$(elem).addClass(addClass);
					navbarCollapse.collapse('hide');
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
						const count = $(elem).data('count');
						const width = $(elem).data('width');
						animate({
							duration: 2000,
							draw: function(progress) {
								const prCount = Math.round(progress*count);
								const prWidth = Math.round(progress*width);
								$(elem).css('width', `${prWidth}%`).find('span').text(`${prCount} Р`);
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
	// подгрузка Яндекс карт при наведении

	//Переменная для включения/отключения индикатора загрузки
	const spinner = $('.ymap-container .loader');
	//Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
	let check_if_load = false;
	//Необходимые переменные для того, чтобы задать координаты на Яндекс.Карте
	let myMapTemp, myPlacemarkTemp;
	 
	//Функция создания карты сайта и затем вставки ее в блок с идентификатором &#34;map-yandex&#34;
	function init () {
	  const myMapTemp = new ymaps.Map("map-yandex", {
	    center: [+ym.data('centerx'), +ym.data('centery')], // координаты центра на карте
	    zoom: +ym.data('zoom'), // коэффициент приближения карты
	    controls: ['zoomControl', 'fullscreenControl'] // выбираем только те функции, которые необходимы при использовании
	  });
	  const myPlacemarkTemp = new ymaps.GeoObject({
	    geometry: {
	        type: "Point",
	        coordinates: [+ym.data('flagx'),+ym.data('flagy')] // координаты, где будет размещаться флажок на карте
	    }
	  });
	  myMapTemp.geoObjects.add(myPlacemarkTemp); // помещаем флажок на карту
	 
	  // Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
	  let layer = myMapTemp.layers.get(0).get(0);
	 
	  // Решение по callback-у для определения полной загрузки карты
	  waitForTilesLoad(layer).then(function() {
	    // Скрываем индикатор загрузки после полной загрузки карты
	    spinner.removeClass('is-active');
	  });
	}
	 
	// Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов) 
	function waitForTilesLoad(layer) {
	  return new ymaps.vow.Promise(function (resolve, reject) {
	    let tc = getTileContainer(layer), readyAll = true;
	    tc.tiles.each(function (tile, number) {
	      if (!tile.isReady()) {
	        readyAll = false;
	      }
	    });
	    if (readyAll) {
	      resolve();
	    } else {
	      tc.events.once("ready", function() {
	        resolve();
	      });
	    }
	  });
	}
	 
	function getTileContainer(layer) {
	  for (let k in layer) {
	    if (layer.hasOwnProperty(k)) {
	      if (
	        layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer
	        || layer[k] instanceof ymaps.layer.tileContainer.DomContainer
	      ) {
	        return layer[k];
	      }
	    }
	  }
	  return null;
	}
	 
	// Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)
	function loadScript(url, callback){
	  const script = document.createElement("script");
	 
	  if (script.readyState){  // IE
	    script.onreadystatechange = function(){
	      if (script.readyState == "loaded" ||
	              script.readyState == "complete"){
	        script.onreadystatechange = null;
	        callback();
	      }
	    };
	  } else {  // Другие браузеры
	    script.onload = function(){
	      callback();
	    };
	  }
	 
	  script.src = url;
	  document.getElementsByTagName("head")[0].appendChild(script);
	}
	 
	// Основная функция, которая проверяет когда мы навели на блок с классом &#34;ymap-container&#34;
	const ymap = function() {
	  $('.ymap-container').mouseenter(function(){
	      if (!check_if_load) { // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем
	 
		  	// Чтобы не было повторной загрузки карты, мы изменяем значение переменной
	        check_if_load = true; 
	 
			// Показываем индикатор загрузки до тех пор, пока карта не загрузится
	        spinner.addClass('is-active');
	 
			// Загружаем API Яндекс.Карт
	        loadScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;loadByRequire=1", function(){
	           // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором &#34;map-yandex&#34;
	           ymaps.load(init);
	        });                
	      }
	    }
	  );  
	}
	 
	$(function() {
	 
	  //Запускаем основную функцию
	  ymap();
	 
	});

});

