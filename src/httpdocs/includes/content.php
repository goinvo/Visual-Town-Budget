
<div class="container" id="avb-body">

  <div class="div" id="navigation-container">
    <div id="navigation" style="height:100%;width:100%;"> </div>
  </div>

  <div class="row-fluid arrow_box" id="bottom-container" style="width:auto;">
    <div id="bottom-wrap" class="row-fluid" style="height:100%">
      <div  id="bottom-left-wrap" class="span3">
        <div id="bottom-left">

          <div class="title-head" id="title-head"></div>

          <div class="title-descr" id="titledescr-container" > 
            <div id="title-descr"></div>
          </div>
        </div>

      </div>
      <div id="bottom-center-wrap" class="span5" style="height:100%" > 
        <div id="bottom-switch" style="height:25px; margin-bottom:5px;" >
          <div style="float:left; margin-right:10px;">
            Layers
          </div>

          <div style="display:inline-block">
            <div class="onoffswitch" >
              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" >
              <label class="onoffswitch-label" for="myonoffswitch">
                <div class="onoffswitch-inner"></div>
                <div class="onoffswitch-switch"></div>
              </label>
            </div>
          </div>


        </div>

          <div id='chart' class="chart"> </div>


      </div>

      <div class="span4" id="bottom-right-wrap" style="height:100%" >

        <div style="float:right; z-index:1200;">
          <img id="chart-expand" src='img/expand.png' width=22 height=22 style="z-index:1200;"> 
        </div>
        <div id="bottom-right">
        <div style="width:100%; height:100%; position:relative;">
          <div id="legend">
            <table>
              <tbody>
              </tbody>
            </table>
          </div>
          <div id="cards" > </div>
        </div>

        </div>
      </div>

      </div>
    </div>



</div>

<div id="popover-html" style="display:none;">
  <div id="popover-value"> </div>
</div>


<div id="modal-container">
  <div class='row-fluid' id="modal-toprow">
    <div class="span12" id="modal-title" > 
      <div class="title-head"></div>
      <div class="title-descr"> 
        <div></div>
      </div>
    </div>
  </div>
  <div class='row-fluid' id="modal-bottomrow"> 
    <div class="span8" > 
      <div id="modal-switch"> </div>
      <div  class="chart" id="modal-chart" > </div>
    </div>
    <div class="span4" > 
      <div id="modal-right"> </div>
    </div>
  </div>
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