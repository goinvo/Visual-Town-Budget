<script>
  $(document).ready(function(){

    avb.navbar.initialize();

    // javascript init call
    <?php
    // valid pages
    $relatedPages = array("opendata" => "opendata.php", "glossary" => "glossary.php");
    // available sections
    $sections = array("revenues", "expenses", "funds");
    $mode = array("t","l");
    $params = array();

    if(isset($_GET["page"])) {

      if(in_array($_GET["page"], $sections)) {
        /*
        * Budget visualization page
        * add initialization Javascript
        */

        // set section
        $params['section'] = $_GET["page"];
        if(isset($_GET["year"])){
          $params['year'] = $_GET["year"];
        };
        // set node
        if(isset($_GET["node"])){
          $params['node'] = $_GET["node"];
        };
        // set mode (treemap / list)
        if(isset($_GET["mode"])){
          $params['mode'] = $_GET["mode"];
        };
        // initialize visualization with params above
        echo 'initialize('.json_encode($params).');';
      } else {
        /*
        * Not a budget visualization page
        * Hide visualization navigation links
        */
        echo 'avb.navbar.minimize();';
      } 
    } else {
      /*
      * Homepage
      */
      echo('avb.home.initialize();');
      echo('avb.home.show();');
    }
    ?>
  });
</script>