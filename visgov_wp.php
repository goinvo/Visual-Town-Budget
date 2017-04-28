<?php
 	/**
	 * @package visgov_wp
	 */
	/*
	Plugin Name: Open Maine - Visual Budget Plugin
	Plugin URI: https://openmaine.org/
	Description: Based on the Visual Budget app developed in Arlington, MA this plugin creates an interactive
	visual representation of municipal revenues, funds and spending.
	Version: 1.0
	Author: Rob Korobkin
	Author URI: https://robkorobkin.org
	License: GPLv2 or later
	Text Domain: visgov_wp
	*/

	/*
	This program is free software; you can redistribute it and/or
	modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation; either version 2
	of the License, or (at your option) any later version.

	This program is distributed in the hope that it will be useful,
	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	GNU General Public License for more details.

	You should have received a copy of the GNU General Public License
	along with this program; if not, write to the Free Software
	Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

	Copyright 2005-2015 Automattic, Inc.
	*/




function registerVisGovClient(){


	// USE CDNs WHERE AVAILABLE
	$app_dir = plugins_url('visgov_wp') .  '/';


	// LOAD CSS - ALWAYS LOAD
	wp_register_style( 'intro-css', '//cdnjs.cloudflare.com/ajax/libs/intro.js/2.5.0/introjs.min.css', false, NULL, 'all' );
	wp_register_style( 'bootstrap-css', '//maxcdn.bootstrapcdn.com/bootstrap/2.3.2/css/bootstrap.min.css', false, NULL, 'all' );
	wp_register_style( 'vg-global-css', $app_dir . 'client/css/global.css', array('intro-css', 'bootstrap-css'), NULL, 'all' );
	wp_register_style( 'vg-print-css', $app_dir . 'client/css/print.css', array('vg-global-css'), NULL, 'print' );
	wp_enqueue_style( 'vg-print-css');

	// REGISTER JS LIBRARIES
	wp_register_script( 'bootstrap-js', '//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js', array('jquery'), NULL, true );
	wp_register_script( 'mustache-js', '//cdnjs.cloudflare.com/ajax/libs/mustache.js/2.3.0/mustache.min.js', false, NULL, true );
	wp_register_script( 'd3-js', $app_dir . 'client/_lib/d3.v3.min.js', array('jquery'), NULL, true );
	wp_register_script( 'detectmobilebrowser-js', $app_dir . 'client/_lib/detectmobilebrowser.js',false, NULL, true );
	wp_register_script( 'jquerycookie-js', $app_dir . 'client/_lib/jquery.cookie.js', array('jquery'), NULL, true );
	wp_register_script( 'intro-js', '//cdnjs.cloudflare.com/ajax/libs/intro.js/2.5.0/intro.min.js', array('jquery'), NULL, true );


	// REGISTER APP SCRIPTS
	wp_register_script( 'vg-treemap-js', $app_dir . 'client/js/treemap.js',false, NULL, true );
	wp_register_script( 'vg-chart-js', $app_dir . 'client/js/chart.js',false, NULL, true );
	wp_register_script( 'vg-cards-js', $app_dir . 'client/js/cards.js',false, NULL, true );
	wp_register_script( 'vg-table-js', $app_dir . 'client/js/table.js',false, NULL, true );
	wp_register_script( 'vg-navbar-js', $app_dir . 'client/js/navbar.js',false, NULL, true );
	wp_register_script( 'vg-statistic-js', $app_dir . 'client/js/statistics.js',false, NULL, true );
	wp_register_script( 'vg-home-js', $app_dir . 'client/js/home.js',false, NULL, true );


	// REGISTER MASTER APP FILE
	wp_register_script( 'vg-avb-js', $app_dir . 'client/js/avb.js', 
						array(	'bootstrap-js', 'mustache-js', 'd3-js', 'detectmobilebrowser-js', 'jquerycookie-js', 'intro-js',
								'vg-treemap-js', 'vg-chart-js', 'vg-cards-js', 'vg-table-js', 'vg-navbar-js', 'vg-statistic-js', 'vg-home-js'), 
						NULL, true );

	
	

}
add_action( 'wp_enqueue_scripts', 'registerVisGovClient' );







function visgov_wp_template_main(){
	wp_enqueue_script('vg-avb-js');
	include(dirname(__FILE__) . '/index.php');
}
add_shortcode( 'visgov', 'visgov_wp_template_main' );

function visgov_wp_template_glossary(){
	wp_enqueue_style( 'vg-print-css');
	$_GET["page"] = "glossary";
	include(dirname(__FILE__) . '/includes/glossary.php');
}
add_shortcode( 'visgov_glossary', 'visgov_wp_template_glossary' );


