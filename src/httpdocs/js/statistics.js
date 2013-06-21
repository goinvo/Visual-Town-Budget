
stats = {
    amount: {
        title: "Amount",
        class: "span6 top",
        value: function (d) {
            return formatcurrency(d.values[yearIndex].val);
        },
        side: function () {
            return " in " + thisYear.toString() + "."
        },
        cellClass: "value sum numeric textleft",
        cellFunction: function (d, cell) {
            avb.table.renderAmount(d, cell)
        }
    },
    impact: {
        title: "Impact",
        class: "span6 ",
        value: function (d) {
            return Math.max(0.01, (Math.round(d.values[yearIndex].val * 100 * 100 / root.values[yearIndex].val) / 100)).toString() + "%";
        },
        side: function () {
            return " of total " + section + "."
        },
        cellClass: "value sum",
        cellFunction: function (d, cell) {
            avb.table.renderImpact(d, cell)
        }
    },
    growth: {
        title: "Growth",
        class: "span6 top",
        value: function (d) {
            return growth(d);
        },
        side: " compared to last year.",
        cellFunction: function (d, cell) {
            avb.table.renderGrowth(d, cell)
        },
        cellClass: "value"
    },
    source: {
        title: "Source",
        class: "span12 card-source ",
        value: function () {
            return "Town of Arlington";
        },
        link: function () {
            return "http://www.town.arlington.ma.us/";
        },
        side: "is the data source for this entry."
    },
    mean: {
        title: "Average",
        class: "span6 ",
        value: function (d) {
            return formatcurrency(d3.mean(d.values, get_values));
        },
        side: "on average."
    },
    filler: {
        title: "",
        class: "span6 ",
        value: function (d) {
            return "";
        },
        side: ""
    },
    name: {
        title: "Name",
        cellClass: "value name long textleft",
        value: function (d) {
            return d.key;
        }
    },
    sparkline: {
        title: "Change",
        cellClass: "value sparkline",
        cellFunction: function (d, cell) {
            avb.table.renderSparkline(d, cell)
        }
    }
},

decks = {
    revenues: [stats.amount, stats.growth, stats.impact, stats.mean, stats.source],
    expenses: [stats.amount, stats.growth, stats.impact, stats.mean, stats.source],
    funds: [stats.amount, stats.growth, stats.impact, stats.mean, stats.source]
},

tables = {
    revenues: [stats.name, stats.growth, stats.sparkline, stats.impact, stats.amount],
    expenses: [stats.name, stats.growth, stats.sparkline, stats.impact, stats.amount],
    funds: [stats.name, stats.growth, stats.sparkline, stats.impact, stats.amount]
}

function formatcurrency(value) {
    if (value === undefined) {
        return "N/A";
    } else if (value >= 1000000) {
        return "$" + Math.round(value / 1000000).toString() + " M";
    } else if (value < 1000000 && value >= 1000) {
        return "$" + Math.round(value / 1000).toString() + " K";
    } else if (value < 1 && value != 0) {
        return "¢" + Math.round(value * 100).toString();
    } else {
        return "$ " + value.toString();
    }
}

function formatCurrencyExact(value) {
    var commasFormatter = d3.format(",.0f")
    return "$ " + commasFormatter(value);
}

function formatPercentage(value) {
    if (value > 0) {
        return "+ " + value.toString() + "%";
    } else if (value < 0) {
        return "- " + Math.abs(value).toString() + "%";
    } else {
        return Math.abs(value).toString() + "%";
    }
}

function growth(data) {
    var previous = (data.values[yearIndex - 1] !== undefined) ? data.values[yearIndex - 1].val : 0;
    var perc = Math.round(100 * 100 * (data.values[yearIndex].val - previous) / data.values[yearIndex].val) / 100;
    return formatPercentage(perc);
};