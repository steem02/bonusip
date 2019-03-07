<?php
/**
 * The header for our theme
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package bonusip
 */

?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
  <header class="font-weight-bold header text-light">
    <nav class="navbar navbar-expand-lg px-md-5 text-nowrap navbar-dark fixed-top"><a class="navbar-brand m-0" href="<?php echo home_url( '/' ); ?>" title="Лого"><img src="<?php the_field('logo', 'option'); ?>" alt="<?php the_field('alt', 'option'); ?>" title="логотип сайта"/></a><a class="navbar-text ml-sm-n5 ml-lg-0 order-lg-last text-success" href="tel:<?php the_field('tel-2', 'option')?>" title="Номер телефона"><?php the_field('tel-1', 'option')?></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-collapse"><span class="navbar-toggler-icon"></span></button>
      <div class="collapse navbar-collapse mr-lg-4 mx-auto mx-lg-0 justify-content-end" id="navbar-collapse">
        <ul class="navbar-nav text-center">
					<?php
						if (have_rows('menu', 'option')):
							while (have_rows('menu', 'option')):the_row();
								$elem = get_sub_field('elem');
								$id = get_sub_field('id');
					?>
								<li class="nav-item js-scroll"><a class="nav-link" href="<?php echo $id?>" title="<?php echo $elem?>"><?php echo $elem?></a></li>
					
          <?php 
          		endwhile;
        		endif;
        	?>
        </ul>
      </div>
    </nav>
  </header>
