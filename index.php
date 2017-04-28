    <?php
      $d = dirname(__FILE__) . '/';
      require_once $d . 'includes/localized_variables.php';
      $dataSections = array('revenues', 'expenses', 'funds');
    ?>
    <script>
      var longName = "<?php echo $longName; ?>";
      var municipalURL = "<?php echo $municipalURL; ?>";
      var app_path = '<?php echo $app_dir; ?>';
    </script>
 

    <?php
      require_once $d . 'includes/home.php';
      require_once $d . 'includes/navbar.php';
      require_once $d . 'includes/container.php';
      require_once $d . 'includes/templates.php';
      require_once $d . "includes/datafiles.php";
    ?>