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


function visgov_wp_template_main(){
	include(dirname(__FILE__) . '/index.php');
}
add_shortcode( 'visgov', 'visgov_wp_template_main' );