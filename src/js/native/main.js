"use strict";

document.addEventListener('DOMContentLoaded', function () {
  //	все переменные
  var imagesForLoad = $('.js-image-load');
  var mqmd = '(min-width: 768px)';
  var mq = window.matchMedia(mqmd); //	переменные для анимаций по скроллу

  var addClass = 'animate-go';
  var circle = $('.circle'); // показ бэкграунда из data атрибутов data-big, data-small (jQuery)

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
  *	jQuery
  * выполнение действий с элементом при скролле
  *	@param {object} obj
  *		@param {callback} show действие при видимости эл-та
  * 	@param {callback} hide дуйствие при исчезании эл-та
  *		@param {object} elems jQuery массив элементов
  *		@param {number} position расстояние до появления эл-та
  */


  function scrollAnimate(obj) {
    $(window).scroll(function () {
      var scroll = $(this).scrollTop() + $(this).height();
      var position = obj.position || 0;
      var hide = obj.hide.bind(obj) || false;
      obj.elems.each(function (i, val) {
        var pos = $(val).offset().top;

        if (pos < scroll - position) {
          obj.show(val);
        } else {
          if (hide) hide(val);
        }
      });
    });
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
      if (timeFraction > 1) timeFraction = 1; // текущее состояние анимации

      var progress = options.timing(timeFraction);
      if (progress > 0) options.draw(progress);

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  }

  loadImage(mqmd, mq, imagesForLoad);
  scrollAnimate({
    elems: circle,
    status: false,
    show: function show(elem) {
      if (!this.status) {
        $(elem).addClass(addClass);
        animate({
          duration: 3000,
          timing: function timing(timeFraction) {
            return timeFraction;
          },
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
    hide: function hide(elem) {
      $(elem).removeClass(addClass);
      $(elem).find('text').text('');
      this.status = false;
    }
  }); //	вопросы. событие раскрытия.

  $('.questions__collapse').on('show.bs.collapse', function () {
    var id = $(this).attr('id');
    $(".arrow[href=\"#".concat(id, "\"]")).addClass('arrow_active');
  });
  $('.questions__collapse').on('hide.bs.collapse', function () {
    var id = $(this).attr('id');
    $(".arrow[href=\"#".concat(id, "\"]")).removeClass('arrow_active');
  });
});