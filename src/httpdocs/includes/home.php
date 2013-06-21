<div style="height:100%;">
  <div id="avb-home"> 
    <div class="container">
      <div id="welcome" class="hero-unit">


        <div id="welcome-hero"  >
        <h1>See your town's budget.</h1>
        <p>It's tough to understand, let alone have access to, your town's budget. 
          Now, Arlington, Massachusetts has released its yearly expenses, funds, and revenues for all citizens to view, engage with, and discuss.
        </p>
        <p style="margin-bottom:0px;">
          <a href="javascript:;" onclick="avb.home.hide(true);" class="link" style="text-decoration:underline;">Start the tour</a>
          or
          <a href="javascript:;" onclick="avb.home.hide();" class="link" style="text-decoration:underline;">Dive in</a>
        </p>
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
<div id="overlay"> </div>
</div>