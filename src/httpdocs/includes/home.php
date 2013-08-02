<div id="overlay"></div>

<div id="avb-home">
    <div class="container">
        <div class="hero-unit">
            <div id="welcome-hero">
                <h1>See your town's budget.</h1>

                <div class="home-column" id="home-col1" style=
                "display:inline-block;">
                    <p>It's tough to understand, let alone have access to,
                    your town's budget. Now, Arlington, Massachusetts has
                    released its yearly data for all citizens to view,
                    engage with, and discuss.</p>

                    <div style="margin-top: 25px;">
                        <div>
                            Arlington residents, see where your tax dollars
                            go:
                        </div>

                        <div style="display:inline-block;">
                            Your property tax last year:
                        </div>

                        <div style="display:inline-block;">
                            <span class="currencyinput">$</span>
                            <input class="currencyinput" data-section=
                            "expenses" id="tax-input" maxlength="6" name=
                            "tax-amount" onkeypress=
                            'avb.home.validate(event)' type="text">
                            <a class="link" data-section="expenses" id=
                            "tax-input-start" style=
                            "text-decoration:underline;">Start</a>
                        </div>
                    </div>
                </div>

                <div class="home-column" id="home-col2" style=
                "display:inline-block; margin-left:5%;">
                    <div>
                        Start learning about Arlington:

                        <div>
                            <a class='link' data-section="expenses" id='q1'
                            style='color:#db4e86'>What is the fire
                            department annual cost?</a>
                        </div>

                        <div>
                            <a class='link' data-section="expenses" id='q2'
                            style='color:#db4e86'>How much money does the
                            town spend on schools?</a>
                        </div>

                        <div>
                            <a class='link' data-section="expenses" id='q3'
                            style='color:#db4e86'>How expensive is to take
                            care of snow over the winter?</a>
                        </div>
                    </div>

                    <p style="margin-top:20px;"><a class="link" href=
                    "javascript:;" onclick="avb.home.hide(true);" style=
                    "text-decoration:underline;">Start the tour</a> or
                    <a class="link" href="javascript:;" onclick=
                    "avb.home.hide();" style=
                    "text-decoration:underline;">Dive in</a></p>
                </div>
            </div>

            <div id="home-col3">
                <div id="home-map-svg">
                    <div>
                        <div style="position: relative;height: 200px;">
                            <div class="node" data-section="revenues"
                            style="left: 0px; width: 100px;">
                                <div>
                                    Revenues
                                </div>

                                <div class="node-bar" id="revenues-node"
                                style=
                                " background-color: rgb(31, 119, 180);">
                                    <div class="node-value">
                                        11
                                    </div>
                                </div>
                            </div>

                            <div class="node" data-section="expenses"
                            style="left: 100px; width: 100px;">
                                <div>
                                    Expenses
                                </div>

                                <div class="node-bar" id="expenses-node"
                                style=" background-color: #56b356;">
                                    <div class="node-value">
                                        11
                                    </div>
                                </div>
                            </div>

                            <div class="node" data-section="funds" style=
                            "left: 200px; width: 100px;">
                                <div>
                                    Funds
                                </div>

                                <div class="node-bar" id="funds-node"
                                style=" background-color: #ff993e;">
                                    <div class="node-value">
                                        11
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