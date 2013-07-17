<!doctype html>
<html>
<head>
  <link type="text/css" rel="stylesheet" href="/css/update.css">
  <link type="text/css" rel="stylesheet" href="/css/global.css">
  <script type="text/javascript" src ="/js/lib/jquery/jquery-1.9.1.min.js"></script>
  <script type="text/javascript" src ="/js/lib/bootstrap-file.js"></script>


  <script>
    $(document).ready(function(){
      $('.controls.file').append('<span class="file-input-name">Select a file</span>');
      $("#upload-button").click(function(){
        var fileName = $("#upload-file").val();
        if(fileName === 'revenues.csv' || fileName === 'expenses.csv' || fileName === 'funds.csv'){

        } else {

        }
      })

    });
  </script>

  <title> Data Update </title>

</head>
<body>

  <span>


  </span>

  <div  style="margin-left:20px; display:inline-block;">
    <div >
      <h1> AVB Data Upload </h1>
    </div>
    <form action="update" enctype="multipart/form-data" method="post" class="form-horizontal">
      <div class="control-group">
        <label class="control-label" for="inputEmail">Username</label>
        <div class="controls">
          <input type="text" id="inputEmail" name="user" placeholder="Username">
        </div>
      </div>
      <div class="control-group">
        <label class="control-label" for="inputPassword">Password</label>
        <div class="controls">
          <input type="password" id="inputPassword" name="pass" placeholder="Password">
        </div>
      </div>
      <div class="control-group">
        <label class="control-label" for="inputPassword">File</label>
        <div class="controls file">
          <input type="hidden" name="MAX_FILE_SIZE" value="100000" />
          <input id="upload-file" name="file" type="file" />
        </div>
      </div>

      <div class="control-group">
        <div class="controls">
          <button id="upload-button" style="margin-left:0" class="btn">Upload</button>
        </div>
      </div> 
    </form>

    <div id="error">
      <?php

      // calls python script to convert file to json
      function process($filename){
        $curpath = getcwd().'/';

        // commands to be launched
        $cmd = 'python processCSV.py '.$curpath.$filename;
        $exitCode = -1;
        // command launched
        exec($cmd, $output, $exitCode);
        // script executed correctly
        if($exitCode === 0){
          $jsonfile = $output[0];
          // bring files to data directory
          // (old files are wiped out)
          copy($jsonfile, '../'.$jsonfile);
          copy($filename, '../'.$filename);
          // success
          printSuccess($filename." updated.");
        } else {
          // script failed, print error message
          printError($output[0]);
        }

        // update home
        $cmd = 'python processCSV.py updatehome';
        $exitCode = -1;
        exec($cmd, $output, $exitCode);
        if($exitCode === 0){
          $jsonfile = $output[0];
          // bring files to data directory
          copy('home.json', '../home.json');
          printSuccess("Homepage data updated.");
        } else {
          printError($output[0]);
        }

      }

      // prints error message to screen
      function printError($msg){
        echo '<div class="alert alert-error" style="max-width:600px;">'.$msg.'</div>';
        exit();
      }

      // prints success message to screen
      function printSuccess($msg){
        echo '<div class="alert alert-success">'.$msg.'</div>';
      }

      // example credential, will be changed on production server
      $user = 'admin';
      $pass = 'pass';

      // credentials check
      if(!isset($_POST['user']) || !isset($_POST['pass'])) {
        exit();
      } else if ($_POST['user'] !== $user ||  $_POST['pass'] !== $pass){
        printError('Invalid username and/or password.');
      } else {

      }
      
      $file = $_FILES["file"];
      $filesize = $file["size"];
      $filename = $file["name"];

      // upload check
      if( $filesize <= 0) {
        printError("No file specified.");
      }

      // array of valid files that can be uploaded
      $validFiles = array('revenues.csv', 'expenses.csv', 'funds.csv', 'glossary.csv');

      // array of files that needs to be converted to json format
      $tojsonFiles = array('revenues.csv', 'expenses.csv', 'funds.csv');

      // return error if uploaded filename is not in valid files list
      if (in_array($filename, $validFiles)) {
        $destFile = getcwd().'/'.$filename;
        // delete old files
        if (file_exists($destFile)){
           unlink($destFile);
        }
        // save uploaded file
        if(move_uploaded_file($file['tmp_name'], getcwd().'/'.$filename)){
          // convert csv to json if needed
          if(in_array($filename, $tojsonFiles)){
            process($filename);
          } else {
            copy($filename, '../'.$filename);
            printSuccess($filename." updated.");
          }
        }  else {
         printError('Unable to replace previous data file, check permissions.');
        }
      } else {
       printError('Valid files are "revenues.csv", "expenses.csv", "funds.csv" and "glossary.csv".');
      }

      ?>
    </div>



  </body>