"use strict";

document.addEventListener('DOMContentLoaded', function () {
  //	общие переменные
  var html = document.documentElement;
  var imagesForLoad = $('.js-image-load');
  var mqmd = '(min-width: 768px)';
  var mq = window.matchMedia(mqmd); // навигация

  var navbar = $('.navbar');
  var navbarNav = $('.navbar-nav');
  var scrollToElem = $('.js-scroll');
  var navbarCollapse = $('#navbar-collapse'); // фиксированные кнопки внизу экрана

  var tel = $('.tel');
  var up = $('.up'); //	переменные для анимаций по скроллу

  var addClass = 'animate-go';
  var animateBlind = 'animate-blind'; // класс активации шторки на элементах

  var blind = $('.blind'); // элементы со шторкой

  var circle = $('.circle');
  var line = $('.level__line'); // переменные для яндекс карт

  var ym = $('#map-yandex'); // показ бэкграунда из data атрибутов data-big, data-small (jQuery)

  function loadImage(str, match, elem) {
    function eventWin(e) {
      if (e.matches) {
        elem.each(function (i, el) {
          var item = $(el);
          item.css('background-image', "url(".concat(item.data('big'), ")"));
        });
      } else {
        elem.each(function (i, el) {
          var item = $(el);
          item.css('background-image', "url(".concat(item.data('small'), ")"));
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
    var box = elem.getBoundingClientRect();
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
    var start = performance.now();
    requestAnimationFrame(function animate(time) {
      var progress; // timeFraction от 0 до 1

      var timeFraction = (time - start) / options.duration;
      if (timeFraction > 1) timeFraction = 1; // текущее состояние анимации

      progress = options.timing ? options.timing(timeFraction) : timeFraction;
      if (progress > 0) options.draw(progress);

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
    $(window).scroll(function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var scroll = scrollTop + $(this).height();
      var hide = false;

      var _loop = function _loop(i) {
        var position = arr[i].position || 0;
        if (arr[i].hide) hide = arr[i].hide.bind(arr[i]);
        arr[i].elems.each(function (o, val) {
          var pos = $(val).offset().top;

          if (pos < scroll - position) {
            arr[i].show(o, val);
          } else {
            if (hide) hide(o, val);
          }
        });
      };

      for (var i = 0; i < arr.length; i++) {
        _loop(i);
      }
    });
  } // обработка кликов по навигационным элементам


  scrollToElem.on('click', function (e) {
    var href = $(e.target).attr('href');
    var coord = getCoords(document.querySelector(href)).top - 100;
    var scroll = pageYOffset || html.scrollTop;
    animate({
      duration: 500,
      draw: function draw(p) {
        var progress;
        if (scroll === coord) return false;

        if (scroll - coord > 0) {
          progress = Math.floor(scroll - scroll * p);
          progress > coord ? scrollTo(0, progress) : scrollTo(0, coord);
        } else {
          var step = coord - scroll;
          progress = Math.floor(scroll + step * p);
          progress < coord ? scrollTo(0, progress) : scrollTo(0, coord);
        }
      }
    });
    navbarCollapse.collapse('hide');
    e.preventDefault();
  });
  loadImage(mqmd, mq, imagesForLoad); // вызов анимации при скролле на элементы, параметром передается массив с объектами

  scrollAnimate([// активация анимаций на блоках
  {
    elems: blind,
    scroll: false,
    show: function show(i, elem) {
      $(elem).addClass(animateBlind);
    },
    hide: function hide(i, elem) {
      $(elem).removeClass(animateBlind);
    }
  }, // скрытие меню
  {
    elems: navbar,
    scroll: false,
    show: function show(i, elem) {
      var scrollTop = window.pageYOffset || html.scrollTop;

      if (this.scroll > scrollTop) {
        $(elem).removeClass(addClass);
      } else if (scrollTop > 300) {
        $(elem).addClass(addClass);
        navbarCollapse.collapse('hide');
      }

      this.scroll = scrollTop;
    }
  }, // безопасность
  {
    elems: line,
    status: [],
    show: function show(i, elem) {
      if (!this.status[i]) {
        var count = $(elem).data('count');
        var width = $(elem).data('width');
        animate({
          duration: 2000,
          draw: function draw(progress) {
            var prCount = Math.round(progress * count);
            var prWidth = Math.round(progress * width);
            $(elem).css('width', "".concat(prWidth, "%")).find('span').text("".concat(prCount, " \u0420"));
          }
        });
        this.status[i] = true;
      }
    },
    hide: function hide(i, elem) {
      $(elem).css('width', '').find('span').text('0%');
      this.status[i] = false;
    }
  }, // svg круги со статистикой
  {
    elems: circle,
    status: false,
    show: function show(i, elem) {
      if (!this.status) {
        $(elem).addClass(addClass);
        animate({
          duration: 3000,
          draw: function draw(progress) {
            $(elem).find('text').each(function (i, v) {
              var val = $(v).data('num');
              $(v).text(Math.round(progress * val));
            });
          }
        });
        this.status = true;
      }
    },
    hide: function hide(i, elem) {
      $(elem).removeClass(addClass);
      $(elem).find('text').text('');
      this.status = false;
    }
  }]); //	вопросы. событие раскрытия.

  $('.questions__collapse').on('show.bs.collapse', function () {
    var id = $(this).attr('id');
    $(".arrow[href=\"#".concat(id, "\"]")).addClass('arrow_active');
  });
  $('.questions__collapse').on('hide.bs.collapse', function () {
    var id = $(this).attr('id');
    $(".arrow[href=\"#".concat(id, "\"]")).removeClass('arrow_active');
  }); // скролл в начало страницы по кнопке

  up.on('click', function (e) {
    var scrollTop = window.pageYOffset || html.scrollTop;
    animate({
      duration: 500,
      draw: function draw(p) {
        var progress = Math.floor(scrollTop - scrollTop * p);
        progress ? window.scrollTo(0, progress) : window.scrollTo(0, 0);
      }
    });
  }); // подгрузка Яндекс карт при наведении
  //Переменная для включения/отключения индикатора загрузки

  var spinner = $('.ymap-container .loader'); //Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)

  var check_if_load = false; //Необходимые переменные для того, чтобы задать координаты на Яндекс.Карте

  var myMapTemp, myPlacemarkTemp; //Функция создания карты сайта и затем вставки ее в блок с идентификатором &#34;map-yandex&#34;

  function init() {
    var myMapTemp = new ymaps.Map("map-yandex", {
      center: [+ym.data('centerx'), +ym.data('centery')],
      // координаты центра на карте
      zoom: +ym.data('zoom'),
      // коэффициент приближения карты
      controls: ['zoomControl', 'fullscreenControl'] // выбираем только те функции, которые необходимы при использовании

    });
    var myPlacemarkTemp = new ymaps.GeoObject({
      geometry: {
        type: "Point",
        coordinates: [+ym.data('flagx'), +ym.data('flagy')] // координаты, где будет размещаться флажок на карте

      }
    });
    myMapTemp.geoObjects.add(myPlacemarkTemp); // помещаем флажок на карту
    // Получаем первый экземпляр коллекции слоев, потом первый слой коллекции

    var layer = myMapTemp.layers.get(0).get(0); // Решение по callback-у для определения полной загрузки карты

    waitForTilesLoad(layer).then(function () {
      // Скрываем индикатор загрузки после полной загрузки карты
      spinner.removeClass('is-active');
    });
  } // Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов) 


  function waitForTilesLoad(layer) {
    return new ymaps.vow.Promise(function (resolve, reject) {
      var tc = getTileContainer(layer),
          readyAll = true;
      tc.tiles.each(function (tile, number) {
        if (!tile.isReady()) {
          readyAll = false;
        }
      });

      if (readyAll) {
        resolve();
      } else {
        tc.events.once("ready", function () {
          resolve();
        });
      }
    });
  }

  function getTileContainer(layer) {
    for (var k in layer) {
      if (layer.hasOwnProperty(k)) {
        if (layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer || layer[k] instanceof ymaps.layer.tileContainer.DomContainer) {
          return layer[k];
        }
      }
    }

    return null;
  } // Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)


  function loadScript(url, callback) {
    var script = document.createElement("script");

    if (script.readyState) {
      // IE
      script.onreadystatechange = function () {
        if (script.readyState == "loaded" || script.readyState == "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      // Другие браузеры
      script.onload = function () {
        callback();
      };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
  } // Основная функция, которая проверяет когда мы навели на блок с классом &#34;ymap-container&#34;


  var ymap = function ymap() {
    $('.ymap-container').mouseenter(function () {
      if (!check_if_load) {
        // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем
        // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
        check_if_load = true; // Показываем индикатор загрузки до тех пор, пока карта не загрузится

        spinner.addClass('is-active'); // Загружаем API Яндекс.Карт

        loadScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU&amp;loadByRequire=1", function () {
          // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором &#34;map-yandex&#34;
          ymaps.load(init);
        });
      }
    });
  };

  $(function () {
    //Запускаем основную функцию
    ymap();
  });
});