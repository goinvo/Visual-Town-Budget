
  <div class="container" id="avb-body">

    <div class="div" id="navigation-container">
      <div id="navigation" style="height:100%;width:100%;"> </div>
    </div>

    <div class="row-fluid arrow_box" id="bottom-container" style="width:auto;">
      <div class="row-fluid" style="height:100%">
        <div id="title-container" class="span3">

            <div  style="margin-top:1%; "> 
              <span id="title-head"></span>
            </div>

            <div id="titledescr-container" > 
              <span id="title-descr"></span>
            </div>
          </div>
        <div class="span5" style="height:100%" > 
          <div class="row-fluid" style="height:10%" > hello </div>
          <div id='chart' style="height:90%" class="row-fluid"> </div>
        </div>

        <div class="span4" id="cards" > </div>
      </div>
    </div>

      <div id='mod' style='display:none'>
          MODAL
      </div>

  </div>

  <div id="popover-html" style="display:none;">
    <div id="popover-value"> </div>
  </div>


  <script type="text/html" id="card-template">
  <div class="span6 card">
  <div class="card-img">
  <img src="{{icon}}" height="25" width="25" style="float: left;">
  </div>
  <div style="margin-left: 35px;" class="card-text">
  <div class="cardtitle">{{title}}</div>
  <div class="cardvalue"></div>
  </div>
  </div>
  </script>