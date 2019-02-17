document.addEventListener('DOMContentLoaded', function() {
	//	запускаем слайдер
	new Glide('.glide').mount();
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
