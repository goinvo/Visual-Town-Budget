#!/bin/bash

java -jar ~/Downloads/compiler.jar --js=chart.js --js=treemap.js --js=cards.js  --js=navbar.js --js=table.js --js=statistics.js --js=home.js --js_output_file=components.js > components.js
java -jar ~/Downloads/compiler.jar --js=lib/d3/d3.v3.min.js --js=lib/jquery/jquery-1.9.1.min.js --js=lib/mustache/mustache.js --js=lib/bootstrap.min.js --js=lib/intro/intro.min.js --js=lib/detectmobilebrowser.js --js=lib/cookie/jquery.cookie.js > lib/dependencies.js
