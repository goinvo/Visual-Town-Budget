<!DOCTYPE HTML>
<html>
<head>

  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta charset="utf-8">
  <title>Arlington Visual Budget</title>
  <meta name="description" content="An interactive tool to learn more about the town of Arlington, Massachusetts." />

  <link href='http://fonts.googleapis.com/css?family=Strait' rel='stylesheet' type='text/css'>
  <link href="/css/lib/bootstrap/bootstrap.css" rel="stylesheet">
  <link rel="stylesheet" type="text/css" href="/css/lib/intro/introjs.min.css">
  <link rel="stylesheet" type="text/css" href="/css/global.css">
  <link rel="stylesheet" media="print" type="text/css" href="/css/print.css">
  <script type="text/javascript" src="/js/lib/mustache/mustache.js"></script>
  <script type="text/javascript" src ="/js/lib/d3/d3.v3.min.js"></script>
  <script type="text/javascript" src ="/js/lib/jquery/jquery-1.9.1.min.js"></script>
  <script type="text/javascript" src ="/js/lib/bootstrap.min.js"></script>
  <script type="text/javascript" src ="/js/lib/detectmobilebrowser.js"></script>
  <script type="text/javascript" src ="/js/lib/intro/intro.min.js"></script>
  <script type="text/javascript" src ="/js/lib/cookie/jquery.cookie.js"></script>
  <script type="text/javascript" src ="/js/treemap.js"></script>
  <script type="text/javascript" src ="/js/chart.js"></script>
  <script type="text/javascript" src ="/js/cards.js"></script>
  <script type="text/javascript" src ="/js/avb.js"></script>
  <script type="text/javascript" src ="/js/navbar.js"></script>
  <script type="text/javascript" src ="/js/table.js"></script>
  <script type="text/javascript" src ="/js/statistics.js"></script>
  <script type="text/javascript" src ="/js/home.js"></script>



  <script>
  $(document).ready(function(){

    avb.navbar.initialize();

    // direct url load
    <?php
    $allpages = array("opendata" => "opendata.php", "glossary" => "glossary.php");
    $sections = array("revenues", "expenses", "funds");
    $mode = array("t","l");
    $params = array();
    if(isset($_GET["page"])) {
      if(in_array($_GET["page"], $sections)) {
        $params['section'] = $_GET["page"];
        if(isset($_GET["year"])){
          $params['year'] = $_GET["year"];
        };
        if(isset($_GET["node"])){
          $params['node'] = $_GET["node"];
        };
        if(isset($_GET["mode"])){
          $params['mode'] = $_GET["mode"];
        };
        echo 'initialize('.json_encode($params).');';
      } else {
        echo 'avb.navbar.minimize();';
      } 
    } else {
      echo('avb.home.initialize();');
      echo('avb.home.show();');
    }
    ?>
  });

  </script>

</head>

  <body>
    
  
    <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-10273473-12', 'arlingtonvisualbudget.org');
    ga('send', 'pageview');

    </script>

    <?php
      require_once 'includes/home.php';
      require_once 'includes/navbar.php';
      require_once 'includes/templates.php';
    ?>

    <div class="container" id="avb-body">
      <div class="row-fluid" id="avb-wrap" style="width:auto;">
        <?php
        if(isset($_GET["page"])) {
          if(array_key_exists($_GET["page"], $allpages)) {
           require_once 'includes/'.$allpages[$_GET["page"]];
         }
       } else {
      }

      ?>
    </div>
  </div>

  <div id="footer" style="font-size:1.2em">
    <a class="link" href="/glossary">Glossary</a> - 
    <a class="link" href="http://www.town.arlington.ma.us/">Town of Arlington</a> - 
    <a class="link" href="http://www.goinvo.com">by Involution Studios</a> -
    <a class="link" href="/opendata"> Open Data + Code</a> -
    <a class="link" href="javascript:;" onclick="fby.push(['showForm', '4389']);return false;">Feedback</a>
  </div>

</body>

</html>