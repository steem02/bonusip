<?php
define('WP_CACHE', false); // Added by WP Rocket
/**
 * Основные параметры WordPress.
 *
 * Скрипт для создания wp-config.php использует этот файл в процессе
 * установки. Необязательно использовать веб-интерфейс, можно
 * скопировать файл в "wp-config.php" и заполнить значения вручную.
 *
 * Этот файл содержит следующие параметры:
 *
 * * Настройки MySQL
 * * Секретные ключи
 * * Префикс таблиц базы данных
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** Параметры MySQL: Эту информацию можно получить у вашего хостинг-провайдера ** //
/** Имя базы данных для WordPress */
define( 'DB_NAME', 'bonusip' );

/** Имя пользователя MySQL */
define( 'DB_USER', 'root' );

/** Пароль к базе данных MySQL */
define( 'DB_PASSWORD', 'root' );

/** Имя сервера MySQL */
define( 'DB_HOST', 'localhost' );

/** Кодировка базы данных для создания таблиц. */
define( 'DB_CHARSET', 'utf8mb4' );

/** Схема сопоставления. Не меняйте, если не уверены. */
define( 'DB_COLLATE', '' );

/**#@+
 * Уникальные ключи и соли для аутентификации.
 *
 * Смените значение каждой константы на уникальную фразу.
 * Можно сгенерировать их с помощью {@link https://api.wordpress.org/secret-key/1.1/salt/ сервиса ключей на WordPress.org}
 * Можно изменить их, чтобы сделать существующие файлы cookies недействительными. Пользователям потребуется авторизоваться снова.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'y.dSnnJDQEiKcmhk%@]bofdF 5XGw/%k+>R(R:O|<fdFa@VRK&KbUd}^]?Qs``@a' );
define( 'SECURE_AUTH_KEY',  '0xN&I_CjcUX_I*xkIqVL~(z&%GR-daq.$dLllC {FX;X&]P*]~8i#.dd6?/XptEz' );
define( 'LOGGED_IN_KEY',    'CAA1x=5_r#*1lQSN:RKj Rb{HGlp|~V{xk8P|cRSB0Ca6E{y3%k^;.ztTuJ=tInU' );
define( 'NONCE_KEY',        '(Ble;_84`/wP-R9x& `,r$*#[ `9XwDqA{fwJfbRc/2h]fJ*EBLCyrX`8^*~t@(Y' );
define( 'AUTH_SALT',        'ODeyPY,4.L[H6pDG$v*KA,W)$)vwb}?kFK#$m&E{NHe@8Y-0idd; We4z8.ep&^n' );
define( 'SECURE_AUTH_SALT', '%EPO9)9_>DTm}LF (Yn&]-A~Q<Emt^DW6}KHm)xIoK>~4c#kqCsj8clL6Nw(pNuR' );
define( 'LOGGED_IN_SALT',   'zHAtgOG }DjzNC?@6Y:kp!rk@sodc]%ttF.QJUjBPNp@C-T2BX}vwGAx!f7n (r{' );
define( 'NONCE_SALT',       'APIg=f+5g_~%fN?C/9gJtaAl^jII%z>}M8!%8%]at<qw0LaHPh.mP&h22t?[;j:i' );

/**#@-*/

/**
 * Префикс таблиц в базе данных WordPress.
 *
 * Можно установить несколько сайтов в одну базу данных, если использовать
 * разные префиксы. Пожалуйста, указывайте только цифры, буквы и знак подчеркивания.
 */
$table_prefix = 'wp_';

/**
 * Для разработчиков: Режим отладки WordPress.
 *
 * Измените это значение на true, чтобы включить отображение уведомлений при разработке.
 * Разработчикам плагинов и тем настоятельно рекомендуется использовать WP_DEBUG
 * в своём рабочем окружении.
 *
 * Информацию о других отладочных константах можно найти в Кодексе.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define( 'WP_DEBUG', true );

/* Это всё, дальше не редактируем. Успехов! */

/** Абсолютный путь к директории WordPress. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** Инициализирует переменные WordPress и подключает файлы. */
require_once( ABSPATH . 'wp-settings.php' );
