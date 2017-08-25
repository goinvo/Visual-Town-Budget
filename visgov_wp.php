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



/*******************************************************
* BUDGETS - CUSTOM POST TYPES AND FIELDS
*
*******************************************************/

// include ACF without plugin
define( 'ACF_LITE', true );
include_once('advanced-custom-fields/acf.php');

function cptui_register_my_cpts_budget() {
	$labels = array(
		"name" => __( "Budgets", "openmaine" ),
		"singular_name" => __( "Budget", "openmaine" ),
	);
	$args = array(
		"label" => __( "Budgets", "openmaine" ),
		"labels" => $labels,
		"description" => "",
		"public" => true,
		"publicly_queryable" => true,
		"show_ui" => true,
		"show_in_rest" => false,
		"rest_base" => "",
		"has_archive" => false,
		"show_in_menu" => true,
		"exclude_from_search" => false,
		"capability_type" => "post",
		"map_meta_cap" => true,
		"hierarchical" => false,
		"rewrite" => array( "slug" => "budget", "with_front" => true ),
		"query_var" => true,
		"supports" => array( "title", "thumbnail" ),
	);
	register_post_type( "budget", $args );
}
add_action( 'init', 'cptui_register_my_cpts_budget' );

if(function_exists("register_field_group"))
{
	register_field_group(array (
		'id' => 'acf_budget-fields',
		'title' => 'Budget Fields',
		'fields' => array (
			array (
				'key' => 'field_599baba6391b3',
				'label' => 'Basic',
				'name' => '',
				'type' => 'tab',
			),
			array (
				'key' => 'field_599bd1af40f31',
				'label' => 'Page Title',
				'name' => 'page_title',
				'type' => 'text',
				'default_value' => '',
				'placeholder' => '',
				'prepend' => '',
				'append' => '',
				'formatting' => 'html',
				'maxlength' => '',
			),
			array (
				'key' => 'field_599ba1af50d17',
				'label' => 'Slug',
				'name' => 'slug',
				'type' => 'text',
				'default_value' => '',
				'placeholder' => '',
				'prepend' => '',
				'append' => '',
				'formatting' => 'html',
				'maxlength' => '',
			),
			array (
				'key' => 'field_599ba04ab1d73',
				'label' => 'Budget Sections',
				'name' => 'sections',
				'type' => 'checkbox',
				'choices' => array (
					'revenues' => 'Revenues',
					'expenses' => 'Expenses',
					'assets' => 'Assets',
				),
				'default_value' => '',
				'layout' => 'vertical',
			),
			array (
				'key' => 'field_599baa7d0e0c3',
				'label' => 'Include Taxes',
				'name' => 'include_taxes',
				'type' => 'true_false',
				'message' => '',
				'default_value' => 0,
			),
			array (
				'key' => 'field_599bca1796814',
				'label' => 'Info Source - Name',
				'name' => 'info_source_name',
				'type' => 'text',
				'default_value' => '',
				'placeholder' => '',
				'prepend' => '',
				'append' => '',
				'formatting' => 'html',
				'maxlength' => '',
			),
			array (
				'key' => 'field_599bc8c68678e',
				'label' => 'Info Source - URL',
				'name' => 'info_source_url',
				'type' => 'text',
				'default_value' => '',
				'placeholder' => '',
				'prepend' => '',
				'append' => '',
				'formatting' => 'html',
				'maxlength' => '',
			),
			array (
				'key' => 'field_599baa3603230',
				'label' => 'Home Overlay',
				'name' => '',
				'type' => 'tab',
			),
			array (
				'key' => 'field_599bab1cb9349',
				'label' => 'Title',
				'name' => 'title',
				'type' => 'text',
				'default_value' => '',
				'placeholder' => '',
				'prepend' => '',
				'append' => '',
				'formatting' => 'html',
				'maxlength' => '',
			),
			array (
				'key' => 'field_599b586155f17',
				'label' => 'Intro Paragraph',
				'name' => 'header_html',
				'type' => 'wysiwyg',
				'default_value' => '',
				'toolbar' => 'full',
				'media_upload' => 'yes',
			),
			array (
				'key' => 'field_599bab4a10f27',
				'label' => 'Tax Description',
				'name' => 'tax_description',
				'type' => 'text',
				'conditional_logic' => array (
					'status' => 1,
					'rules' => array (
						array (
							'field' => 'field_599baa7d0e0c3',
							'operator' => '==',
							'value' => '1',
						),
					),
					'allorany' => 'all',
				),
				'default_value' => '',
				'placeholder' => '',
				'prepend' => '',
				'append' => '',
				'formatting' => 'html',
				'maxlength' => '',
			),
			array (
				'key' => 'field_599bab7854811',
				'label' => 'Budget Questions',
				'name' => 'budget_questions',
				'type' => 'textarea',
				'default_value' => '',
				'placeholder' => '',
				'maxlength' => '',
				'rows' => '',
				'formatting' => 'br',
			),
			array (
				'key' => 'field_599b587255f18',
				'label' => 'Custom JS',
				'name' => 'custom_js',
				'type' => 'textarea',
				'default_value' => '',
				'placeholder' => '',
				'maxlength' => '',
				'rows' => 20,
				'formatting' => 'none',
			),
		),
		'location' => array (
			array (
				array (
					'param' => 'post_type',
					'operator' => '==',
					'value' => 'budget',
					'order_no' => 0,
					'group_no' => 0,
				),
			),
		),
		'options' => array (
			'position' => 'normal',
			'layout' => 'no_box',
			'hide_on_screen' => array (
			),
		),
		'menu_order' => 0,
	));
}





/*******************************************************
* SHORT CODES
*
*******************************************************/

function visgov_wp_template_main($atts){
  global $selected_budget, $wpdb;


  // FETCH SELECTED BUDGET
  if(!isset($atts['budget'])) {
    echo "No budget specified.";
    return;
  }

  $sql = $wpdb->prepare(
    "SELECT post_id FROM " . $wpdb -> postmeta . " where meta_key='slug' && meta_value=%s",
    $atts['budget']
  );

  $budget_id = $wpdb->get_var($sql);
  if($budget_id === NULL) {
    echo "Budget not found: " . $atts['budget'];
    return;
  }
  $selected_budget = get_post($budget_id);
  $meta = get_post_custom($budget_id);
  $selected_budget -> meta = array();
  foreach($meta as $k => $v){
    if($k[0] == '_') continue;
    if($k == "sections") $selected_budget -> meta[$k] = unserialize($v[0]);
    else $selected_budget -> meta[$k] = $v[0];
  }


  // LOAD APP JS
	wp_enqueue_script('vg-avb-js');


  // RENDER TEMPLATE
	include(dirname(__FILE__) . '/index.php');
}
add_shortcode( 'visgov', 'visgov_wp_template_main' );

function visgov_wp_template_glossary(){
	wp_enqueue_style( 'vg-print-css');
	$_GET["page"] = "glossary";
	include(dirname(__FILE__) . '/includes/glossary.php');
}
add_shortcode( 'visgov_glossary', 'visgov_wp_template_glossary' );
