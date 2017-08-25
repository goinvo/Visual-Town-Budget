<?php
  global $selected_budget;
  $active_sections = $selected_budget -> meta['sections'];
?>

<div id="overlay"></div>
<div id="avb-home">
  <div class="hero-unit">
      <div id="welcome-hero">

        <!-- BUDGET TITLE -->
        <h1><?php echo $selected_budget -> meta['title']; ?></h1>


        <!-- FIRST COLUMN -->
        <div class="home-column" id="home-col1" style="display:inline-block;">
            <p><?php echo $selected_budget -> meta['header_html']; ?></p>

            <!-- TAX BLOCK -->
            <?php if($selected_budget -> meta['include_taxes']): ?>
              <div style="margin-top: 25px;">
                  <div>
                      <?php echo $shortName; ?> residents, see where your tax dollars
                      go:
                  </div>

                  <div style="display:inline-block;">
                      Your property tax last year:
                  </div>

                  <div style="display:inline-block;">
                      <span class="currencyinput">$</span>
                      <input class="currencyinput" placeholder=2000 data-section=
                      "expenses" id="tax-input" maxlength="6" name=
                      "tax-amount" onkeypress=
                      'avb.home.validate(event)' type="text">
                      <a class="link" data-section="expenses" id=
                      "tax-input-start" style="text-decoration:underline; cursor: pointer">Start</a>
                  </div>
              </div>
            <?php endif; ?>
        </div>



        <!-- SECOND COLUMN -->
        <div class="home-column" id="home-col2" style="display:inline-block; margin-left:5%;">

            <!-- BUDGET QUESTIONS -->
            <div>
                <?php echo $selected_budget -> meta['budget_questions']; ?>
            </div>

            <!-- JUMP IN QUESTIONS -->
            <p style="margin-top:20px;">
              <a  class="link" href="javascript:;" onclick="avb.home.hide(true);"
                  style="text-decoration:underline;">Start the tour</a> or

              <a class="link" href="javascript:;" onclick="avb.home.hide();"
                style="text-decoration:underline;">Dive in</a>
            </p>
        </div>

      </div>

      <!-- THIRD COLUMN -->
      <div id="home-col3">

        <!-- YEAR DROP -->
        <ul class="yeardrop nav menubutton">
          <li  class="yeardrop-container dropdown" style="display:none;">
            <a class="yeardrop-label dropdown-toggle" role="button" data-toggle="dropdown" href="#">Dropdown <b class="caret"></b></a>
            <ul class="yeardrop-list dropdown-menu vhscrollable" role="menu"></ul>
          </li>
          <li>
            <select class="yeardrop-container-mobile" style="display:none; width:100px; height:28px">
            </select>
          </li>
        </ul>

        <!-- HOME BAR GRAPH -->
        <div id="home-map-svg">
          <div style="position: relative;height: 200px;">

            <!-- REVENUES -->
            <?php if(in_array("revenues", $active_sections)):?>
              <div class="node" data-section="revenues" style="left: 0px; width: 100px;">
                  <div>Revenues</div>
                  <div class="node-bar" id="revenues-node" style="background-color: rgb(31, 119, 180);">
                      <div class="node-value">11</div>
                  </div>
              </div>
            <?php endif; ?>


            <!-- EXPENSES -->
            <?php if(in_array("expenses", $active_sections)):?>
              <div class="node" data-section="expenses" style="left: 100px; width: 100px;">
                  <div>Expenses</div>
                  <div class="node-bar" id="expenses-node" style=" background-color: #56b356;">
                      <div class="node-value">11</div>
                  </div>
              </div>
            <?php endif; ?>


            <!-- FUNDS -->
            <?php if(in_array("funds", $active_sections)):?>
              <div class="node" data-section="funds" style="left: 200px; width: 100px;">
                  <div>Assets</div>
                  <div class="node-bar" id="funds-node" style=" background-color: #ff993e;">
                      <div class="node-value">11</div>
                  </div>
              </div>
            <?php endif; ?>
          </div>
        </div>

      </div>
    </div>
</div>
