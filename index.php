    <?php
      $d = dirname(__FILE__) . '/';
      require_once $d . 'includes/localized_variables.php';
      $dataSections = array('revenues', 'expenses', 'funds');
      require_once $d . 'includes/imports.php';
    ?>
    <script>

      function readLocationHash(path){
        if(path == '') return {};
        if(path[0] == '#'){
          path = path.substr(1);
        }
        var fields = ['page', 'year', 'mode', 'node'];
        var tmp = path.split('/');
        var p = {};
        for(var i = 0; i < tmp.length; i++){
          p[fields[i]] = tmp[i];
        }
        return p;
      }



      var longName = "<?php echo $longName; ?>";
      var municipalURL = "<?php echo $municipalURL; ?>";
      $(document).ready(initialize);
      var app_path = '<?php echo $app_dir; ?>';
      var pageParams = readLocationHash(window.location.hash);
    </script>
 

    <?php
      require_once $d . 'includes/home.php';
      require_once $d . 'includes/navbar.php';
      require_once $d . 'includes/container.php';
      require_once $d . "includes/footer.php";
      require_once $d . 'includes/templates.php';
      require_once $d . "includes/datafiles.php";
    ?>

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', "<?php echo $gaKey; ?>", "<?php echo $siteURL; ?>");
      ga('send', 'pageview');
    </script>
  </body>
</html>
