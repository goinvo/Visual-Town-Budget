
  <div class="container" id="avb-body">

    <div class="div" id="navigation-container">
      <div id="navigation" style="height:100%;width:100%;"> </div>
    </div>

    <div class="row-fluid bottom" id="bottom-container" style="width:auto; margin-top:1%; margin-bottom:1%; ">
      <div class="arrow"> </div>
      <div>
        <div id="title-container" class="span3">
          <div class="row-fluid">
            <div class="span12" style="margin-top:1%; "> 
              <span id="title-head"></span>
            </div>
          </div>
          <div class="row-fluid">
            <div id="titledescr-container" class="span12"> 
              <span id="title-descr"></span>
            </div>
          </div>
        </div>

        <div class="span5" id="chart" style="height:100%;"> </div>
        <div class="span4" id="cards" > </div>
      </div>
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