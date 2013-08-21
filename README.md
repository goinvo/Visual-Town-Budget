Budget Visualization Framework
========
![screenshot](https://raw.github.com/goinvo/Visual-Town-Budget/develop/docs/img/example_screenshot.png)
Open-source budget visualization framework.

##Requirements
* PHP-enabled webserver
* SCSS compiler

##Components
####Cards
Report statical information about dataset (`src/httpdocs/js/cards.js`).

![card-img](https://raw.github.com/goinvo/Visual-Town-Budget/develop/docs/img/cards.png)

####Chart
Shows data values change over time (`src/httpdocs/js/chart.js`).

![chart-img](https://raw.github.com/goinvo/Visual-Town-Budget/develop/docs/img/chart.png)


####Treemap
Used as the main navigation component (`src/httpdocs/js/treemap.js`).

![treemap-img](https://raw.github.com/goinvo/Visual-Town-Budget/develop/docs/img/treemap.png)

####Table
Alternative navigation technique to a treemap (`src/httpdocs/js/tables.js`).

![table-img](https://raw.github.com/goinvo/Visual-Town-Budget/develop/docs/img/table.png)

####Component Interface
Each component implements a common interface of 3 calls:

* `Initialize`: called only once, prepares the component to show data
* `Open`: opens a data object and displays its contents using the specified component
* `Update`: refreshes component data (useful when year changes and new values need to be plotted)

##Directory Structure
* **/config**: Compass configuration files
* **/src/httpdocs**: Application root directory
	*	**css**: compiled SCSS and libraries (bootstrap, introJs)
	*	**data**: CSV and JSON data files
		*	**processing**:	temporary directory for data conversion
	*	**img**: image assets
	*	**includes**: templates and website components
		*	imports.php: CSS and JS assets import
		*	datafiles.php: json datafiles loaded with the page (AJAX can be used as an alternative)
		*	home.php: homescreen php
		*	navbar.php: navigation bar html
	*	**js**:	Javascript assets
		*	avb.js: helper functions and initialization routines
		*	cards.js: cards component routines
		*	chart.js: chart component routines
		*	home.js: homescreen routines and tutorials code
		*	statistics.js: functions used to generate statistical info and number formatting functions
		* 	table.js: table component routines
		*	treemap.js: treemap component routines
* **/src/scss**: SCSS files
	*	print.scss:  SCSS applied when printing a Visual Budget page
	*	global.scss: main SCSS file (imports all the partials defined below)
	*	**partials**: contains components SCSS files
		*	_avb.scss: contains section styles
		* 	_base.scss: contains html, body styles, colors and font variables
		*	_cards.scss: styles for card component
		*	_chart.scss: styles for chart component
		*	_home.scss: styles for homescreen
		*	_navbar.scss: styles for top navigation bar
		*	_table.scss: styles for tabular view
		*	_treemap.scss: styles for treemap component

##Sample Datasets
Sample Expenses, Revenues and Funds from Arlington, MA in `src/httpdocs/data/`.

Two data is kept in JSON and CSV format. The JSON format is actively used for computation while the CSV is kept for reference and data download.

####Data pipeline
Town representatives are likely to be proficient in editing spreadsheets. The Visual Budget application currently uses a pipeline that converts CSV files (created with Microsoft Excel) to nested JSON files used for computation.

A python script `src/httpdocs/data/processing/processCSV.py` converts a flat CSV file into a nested JSON structure. A php script `src/httpdocs/data/processing/update.php` orchestrates the entire data update procedure.

For more information about data formats or update procedures check `docs/data`.