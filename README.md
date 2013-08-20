Budget Visualization Framework
========
![screenshot](https://raw.github.com/goinvo/Visual-Town-Budget/develop/docs/img/example_screenshot.png)
Open-source budget visualization framework.

##Components
####Treemap
![treemap-img](https://raw.github.com/goinvo/Visual-Town-Budget/develop/docs/img/treemap.png)
####Cards
![card-img](https://raw.github.com/goinvo/Visual-Town-Budget/develop/docs/img/cards.png)
####Chart
![chart-img](https://raw.github.com/goinvo/Visual-Town-Budget/develop/docs/img/chart.png)
####Table
![table-img](https://raw.github.com/goinvo/Visual-Town-Budget/develop/docs/img/table.png)


##Requirements
* PHP-enabled webserver
* Compass for SCSS editing

##Structure
* **/config**: Compass configuration files
* **/src/scss**: SCSS files
* **/src/httpdocs**: Application root directory
	*	**css**: compiled SCSS and libraries CSS
	*	**data**: CSV and JSON data files
		*	**processing**:	temporary directory for data conversion
	*	**img**: image assets
	*	**includes**: templates and website components
	*	**js**:	Javascript assets
		*	avb.js: helper functions and initialization routines
		*	cards.js: cards routines
		*	chart.js: chart routines
		*	home.js: homescreen routines and tutorials code
		*	statistics.js: statistical and number formatting functions
		* 	table.js: table routines
		*	treemap.js: treemap routines

##Sample Datasets
Expenses, Revenues and Funds from Arlington, MA.