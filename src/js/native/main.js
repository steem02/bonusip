"use strict";

document.addEventListener('DOMContentLoaded', function () {
  //	общие переменные
  var html = document.documentElement;
  var imagesForLoad = $('.js-image-load');
  var mqmd = '(min-width: 768px)';
  var mq = window.matchMedia(mqmd); // навигация

  var navbar = $('.navbar-nav');
  var jsScroll = $('.js-scroll'); // фиксированные кнопки внизу экрана

  var tel = $('.tel');
  var up = $('.up'); //	переменные для анимаций по скроллу

  var addClass = 'animate-go';
  var circle = $('.circle');
  var line = $('.level__line'); // показ бэкграунда из data атрибутов data-big, data-small (jQuery)

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

      var _loop = function _loop(i) {
        var position = arr[i].position || 0;
        var hide = arr[i].hide.bind(arr[i]) || false;
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
  } // обработка кликов по навигационным элементам


  jsScroll.on('click', function (e) {
    var href = $(e.target).attr('href');
    var coord = getCoords(document.querySelector(href)).top - 100;
    var scroll = window.pageYOffset || html.scrollTop;
    animate({
      duration: 500,
      draw: function draw(p) {
        var progress;
        if (scroll == coord) return false;

        if (scroll - coord > 0) {
          progress = Math.floor(scroll - scroll * p);
          progress > coord ? window.scrollTo(0, progress) : window.scrollTo(0, coord);
        } else {
          var step = coord - scroll;
          progress = Math.floor(scroll + step * p);
          progress < coord ? window.scrollTo(0, progress) : window.scrollTo(0, coord);
        }
      }
    });
    e.preventDefault();
  });
  loadImage(mqmd, mq, imagesForLoad); // вызов анимации при скролле на элементы, параметром передается массив с объектами

  scrollAnimate([// безопасность
  {
    elems: line,
    status: [],
    show: function show(i, elem) {
      if (!this.status[i]) {
        var data = $(elem).data('width');
        animate({
          duration: 3000,
          draw: function draw(progress) {
            var pr = Math.round(progress * data);
            $(elem).css('width', "".concat(pr, "%")).find('span').text("".concat(pr, "%"));
          }
        });
        this.status[i] = true;
      }
    },
    hide: function hide(i, elem) {
      $(elem).css('width', "").find('span').text("0%");
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
  });
});