
<div class="container" id="avb-body">

  <div class="row-fluid" id="avb-wrap" style="width:auto;">

    <div id="navigation-container">
      <div id="arrow"> </div>
      <div id="navigation" style="height:100%;width:100%;"> </div>
    </div>

    <div id="bottom-wrap" class="row-fluid">
      <div  id="bottom-left-wrap" class="span3">
        <div id="bottom-left">

          <div>
          <div class="title-head" id="title-head"></div>
          <div class="title-descr" id="titledescr-container" > 
            <div id="title-descr"></div>
          </div>
        </div>

        </div>

      </div>
      <div id="bottom-center-wrap" class="span5" style="height:100%" > 


          <div id='chart' class="chart"> </div>
      </div>

      <div class="span4" id="bottom-right-wrap" style="height:100%" >

        <div id="bottom-right">

        <div id="bottom-controls">

        <div style="float:right; z-index:1200;">
          <img id="chart-expand" src='img/expand.png' width=22 height=22 style="z-index:1200;"> 
        </div>

        <div id="bottom-switch" style="height:25px; margin-bottom:5px;" >
          <div style="float:left; margin-right:10px;">
            Layers
          </div>

          <div style="display:inline-block">
            <div class="onoffswitch" >
              <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="layer-switch" >
              <label class="onoffswitch-label" for="layer-switch">
                <div class="onoffswitch-inner"></div>
                <div class="onoffswitch-switch"></div>
              </label>
            </div>
          </div>
        </div>



      </div>

        <div id="bottom-right-content" style="width:100%; position:relative;">
          <div id="legend-wrap">
            <div id="legend">
              <table>
                <tbody>
                </tbody>
              </table>
            </div>
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
<div class="{{class}} card">
  <div class="card-img"> </div>
  <div class="card-text">
    <div class="cardvalue"></div>
    <div class="carddesc"></div>
  </div>
</div>
</script>