<?php
/**
 * bonusip functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package bonusip
 */

if ( ! function_exists( 'bonusip_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function bonusip_setup() {
		// глобальные настройки сайта через ACF
		$option_page = acf_add_options_page(array(
			'page_title' => 'Настройки сайта',
			'menu_title' => 'Настройки сайта',
			'menu_slug' => 'theme-general-settings',
			'capability' => 'edit_posts',
			'redirect' => false
		));

		// Включение возможности создавать отдельные шаблоны для постов single
		add_filter('single_template', 'my_single_template');

		function my_single_template($single) {
		global $wp_query, $post;
		foreach((array)get_the_category() as $cat) {
		if(file_exists(get_template_directory() . '/single-' . $cat->slug . '.php')) {
		return get_template_directory() . '/single-' . $cat->slug . '.php';
		} elseif(file_exists('/single-' . $cat->term_id . '.php')) {
		return get_template_directory() . '/single-' . $cat->term_id . '.php';
		}
		}
		return $single;
		}

		// хук для Contact form 7
		add_filter('wpcf7_autop_or_not', '__return_false');

		add_filter('wpcf7_form_elements', function($content) {
		    $content = preg_replace('/<(span).*?class="\s*(?:.*\s)?wpcf7-form-control-wrap(?:\s[^"]+)?\s*"[^\>]*>(.*)<\/\1>/i', '\2', $content);

		    return $content;
		});

		/*
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on bonusip, use a find and replace
		 * to change 'bonusip' to the name of your theme in all the template files.
		 */
		load_theme_textdomain( 'bonusip', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		// Удаление лишних P и BR

		remove_filter( 'the_content', 'wpautop' );// для контента
		remove_filter( 'the_excerpt', 'wpautop' );// для анонсов
		remove_filter( 'comment_text', 'wpautop' );// для комментарий

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );
		set_post_thumbnail_size(250, 150); // задаем размер миниатюрам 250x150
		add_image_size('big-thumb', 400, 400, true); // добавляем еще один размер картинкам 400x400 с обрезкой

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus(array( // Регистрируем 2 меню
			'top' => 'Верхнее', // Верхнее
			'bottom' => 'Внизу' // Внизу
		));

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );

		// Set up the WordPress core custom background feature.
		add_theme_support( 'custom-background', apply_filters( 'bonusip_custom_background_args', array(
			'default-color' => 'ffffff',
			'default-image' => '',
		) ) );

		// Add theme support for selective refresh for widgets.
		add_theme_support( 'customize-selective-refresh-widgets' );

		/**
		 * Add support for core custom logo.
		 *
		 * @link https://codex.wordpress.org/Theme_Logo
		 */
		add_theme_support( 'custom-logo', array(
			'height'      => 250,
			'width'       => 250,
			'flex-width'  => true,
			'flex-height' => true,
		) );
	}
endif;
add_action( 'after_setup_theme', 'bonusip_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function bonusip_content_width() {
	// This variable is intended to be overruled from themes.
	// Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
	// phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
	$GLOBALS['content_width'] = apply_filters( 'bonusip_content_width', 640 );
}
add_action( 'after_setup_theme', 'bonusip_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function bonusip_widgets_init() {
	register_sidebar(array( // регистрируем левую колонку, этот кусок можно повторять для добавления новых областей для виджитов
		'name' => 'Сайдбар', // Название в админке
		'id' => "sidebar", // идентификатор для вызова в шаблонах
		'description' => 'Обычная колонка в сайдбаре', // Описалово в админке
		'before_widget' => '<div id="%1$s" class="widget %2$s">', // разметка до вывода каждого виджета
		'after_widget' => "</div>\n", // разметка после вывода каждого виджета
		'before_title' => '<span class="widgettitle">', //  разметка до вывода заголовка виджета
		'after_title' => "</span>\n", //  разметка после вывода заголовка виджета
	));
}
add_action( 'widgets_init', 'bonusip_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function bonusip_scripts() {
	// стили
  wp_enqueue_style( 'bootstrap-style', '//stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css' );
	wp_enqueue_style( 'main', get_template_directory_uri().'/css/build.min.css' ); // основные стили шаблона
	// скрипты
	wp_deregister_script('jquery'); // выключаем стандартный jquery
	wp_enqueue_script('jquery','//code.jquery.com/jquery-3.3.1.slim.min.js','','3.3.1',true); // добавляем свой
	wp_enqueue_script('bootstrap-js', '//stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.bundle.min.js', array('jquery'), '4.2.1', true);
	// wp_enqueue_script('lazyload', get_template_directory_uri().'/js/lazyload.min.js','','',true);
	wp_enqueue_script('main', get_template_directory_uri().'/js/build.min.js', array('jquery'),'',true);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'bonusip_scripts' );

/**
 * Add integrity/crossorigin for CDN styles.
 */
function new_style_loader_tag( $html, $handle ) {
	$scripts_to_load = array(
		array(
			( 'name' )      => 'bootstrap-style',
			( 'integrity' ) => 'sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS'
		)
	);

	$key = array_search( $handle, array_column( $scripts_to_load, 'name' ) );

	if ( $key !== false ) {
		$html = str_replace( '/>', ' integrity=\'' . $scripts_to_load[$key]['integrity'] . '\' crossorigin=\'anonymous\' />', $html );
	}

	return $html;
}
add_filter( 'style_loader_tag', 'new_style_loader_tag', 10, 2 );

/**
 * Add integrity/crossorigin for CDN scripts.
 */
function new_script_loader_tag( $tag, $handle ) {
	$scripts_to_load = array(
		array(
			( 'name' )      => 'jquery',
			( 'integrity' ) => 'sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo',
		),
		array(
			( 'name' )      => 'bootstrap-js',
			( 'integrity' ) => 'sha384-zDnhMsjVZfS3hiP7oCBRmfjkQC4fzxVxFhBx8Hkz2aZX8gEvA/jsP3eXRCvzTofP',
		)
	);

	$key = array_search( $handle, array_column( $scripts_to_load, 'name' ) );

	if ( $key !== false ) {
		$tag = str_replace( '></script>', ' integrity=\'' . $scripts_to_load[$key]['integrity'] . '\' crossorigin=\'anonymous\'></script>', $tag );
	}

	return $tag;
}
add_filter( 'script_loader_tag', 'new_script_loader_tag', 10, 2 );

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . '/inc/custom-header.php';

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Customizer additions.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Load Jetpack compatibility file.
 */
if ( defined( 'JETPACK__VERSION' ) ) {
	require get_template_directory() . '/inc/jetpack.php';
}

?>