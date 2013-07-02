<div id="overlay"> </div>

<div style="height:100%;">
  <div id="avb-home"> 
    <div class="container">
      <div id="welcome" class="hero-unit">


        <div id="welcome-hero"  >
        <h1 >See your town's budget.</h1>

        <div class="home-column" style="display:inline-block; width:46%;"> 
          <p >It's tough to understand, let alone have access to, your town's budget. 
            Now, Arlington, Massachusetts has released its yearly data for all citizens to view, engage with, and discuss.
          </p>

          <div style="margin-top: 25px;">
            <div> Arlington residents, see where your tax dollars go: </div>
            <div style="display:inline-block;"> Your property tax last year: </div> 
            <div style="display:inline-block;"> 
              <span class="currencyinput">$ </span> 
              <input class="currencyinput" MAXLENGTH="6" data-section="expenses" type="text" onkeypress='avb.home.validate(event)' id="tax-input" name="tax-amount"/> 
              <a id="tax-input-start" data-section="expenses" class="link" style="text-decoration:underline;">Start</a>
            </div>
          </div>
        </div>
        <div class="home-column" style="display:inline-block; margin-left:5%; width:46%;"> 
          <div> Start learning about Arlington:
            <div> <a class='link' style='color:#db4e86' id='q1' data-section="expenses"> What is the fire department annual cost? </a> </div>
            <div> <a class='link' style='color:#db4e86' id='q2' data-section="expenses"> How much money does the town spend on schools? </a> </div>
            <div> <a class='link' style='color:#db4e86' id='q3' data-section="expenses"> How expensive is to take care of snow over the winter? </a> </div>
          </div>

          <p style="margin-top:20px;">
            <a href="javascript:;" onclick="avb.home.hide(true);" class="link" style="text-decoration:underline;">Start the tour</a>
            or
            <a href="javascript:;" onclick="avb.home.hide();" class="link" style="text-decoration:underline;">Dive in</a>
          </p>

        </div>


      </div>


        <div id="home-map">
          <div id="home-map-svg">

            <div><div style="position: relative;height: 200px;"> 

              <div class="node" data-section="revenues" style="left: 0px; width: 100px;">
                <div> Revenues </div>
                <div id="revenues-node" class="node-bar"  style=" background-color: rgb(31, 119, 180);"> 
                  <div class="node-value"> 11 </div>
                </div>
              </div>

              <div class="node" data-section="expenses" style="left: 100px; width: 100px;">
                <div> Expenses </div>
                <div id="expenses-node" class="node-bar" style=" background-color: #56b356; "> 
                  <div class="node-value"> 11 </div>
                </div>
              </div>

              <div class="node" data-section="funds" style="left: 200px; width: 100px;">
                <div> Funds</div>
                <div id="funds-node" class="node-bar" style=" background-color: #ff993e; "> 
                  <div class="node-value" > 11 </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</div>

</div>
