"use strict";

document.addEventListener('DOMContentLoaded', function () {
  //	запускаем слайдер
  new Glide('.glide').mount(); //	вопросы. событие раскрытия.

  $('.questions__collapse').on('show.bs.collapse', function () {
    var id = $(this).attr('id');
    $(".arrow[href=\"#".concat(id, "\"]")).addClass('arrow_active');
  });
  $('.questions__collapse').on('hide.bs.collapse', function () {
    var id = $(this).attr('id');
    $(".arrow[href=\"#".concat(id, "\"]")).removeClass('arrow_active');
  });
});