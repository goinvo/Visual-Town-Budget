data/<a href="https://github.com/goinvo/Visual-Town-Budget"><img alt=
"Fork me on GitHub" src=
"https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
style="position: absolute; top: 0; right: 0; border: 0;"></a>

<section id="avb-opendata" style="padding:10px;">
    <div class="separator" style="margin-bottom:20px;">
        <div class="title-head">
            Data
        </div>

        <?php
            foreach($dataSections as $section){
                echo '<div class="dataDownload">';
                echo '<span><i class="icon-download"></i></span>';
                echo '<span class="name">'.ucfirst($section).'</span> <span>-</span>';
                echo '<a href="' . $app_dir . 'data/'.$section.'.csv" target="_blank">CSV</a> <span>-</span>';
                echo '<a href="' . $app_dir . 'data/'.$section.'.json" target="_blank">Json</a>';
                echo '</div>';
            }
        ?>

    </div>

    <div class="separator" style="margin-bottom:20px;">
        <div class="title-head">
            Code
        </div>

        <div class="dataDownload">
            <a href="https://github.com/goinvo/Visual-Town-Budget" target="_blank">GitHub
            Repo</a>
        </div>
    </div>

    <div>
        <div>
            <?php echo $siteName; ?> is licensed under <a class="link" href=
            "http://www.apache.org/licenses/LICENSE-2.0.html">Apache 2</a>
            and was created using open source code and data.
        </div>

        <div>
            Download, examine, and contribute to <?php echo $siteName; ?>
            using the links provided.
        </div>
    </div>
</section>
