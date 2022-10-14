function ScatterPlot(do_update)
{

    var histoData = [];
    newData()

    function newData() {
        histoData = [];
        for (var i = 0; i < 25; i++) {
            histoData.push([Math.random() * 20, Math.random() * 20])
        }
    }

    var w = 700;
    var h = 450;
    var chartMargin = {top: 30, right: 60, bottom: 30, left: 60},
        wChart = w - chartMargin.left - chartMargin.right;

    hChart = h - chartMargin.top - chartMargin.bottom;

    var x = d3.scaleLinear()
        .domain([0, 20])
        .range([0, wChart]);

    var y = d3.scaleLinear()
        .domain([0, 20])
        .range([hChart, 0]);

    var color = d3.scaleLinear()
        .domain([0, 5, 10, 20])
        .range(["#CF3466", "#D9A953", "#86CADA", "#63B794"])
        .interpolate(d3.interpolateHcl)

    var xAxis = d3.axisBottom(x)
        .ticks(5)

    var yAxis = d3.axisLeft(y)
        .ticks(8)

    var svg = d3.select("#output").append("svg")
        .attr("height", h)
        .attr("width", w)

    var chart = svg.append("g")
        .attr("height", hChart)
        .attr("width", wChart)
        .attr("transform", "translate(" + chartMargin.left + "," + chartMargin.top + ")");

    chart.selectAll(".circles")
        .data(histoData)
        .enter()
        .append("circle")
        .attr("class", "circles")
        .attr("r", 15)
        .attr("cx", function (d) {
            return x(d[0])
        })
        .attr("cy", function (d) {
            return y(d[1])
        })
        .attr("fill", function (d) {
            return color(d[1])
        })

    chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + hChart + ")")
        .call(xAxis);

    chart.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + wChart + ",0)")
        .call(yAxis);

    function update() {
        newData();
        d3.selectAll(".circles")
            .data(histoData)
            .transition()
            .duration(1000)
            .delay(250)
            .attr("cx", function (d) {
                return x(d[0])
            })
            .attr("cy", function (d) {
                return y(d[1])
            })
            .attr("fill", function (d) {
                return color(d[1])
            })
    }

    if (do_update == 'update') update();
}

ScatterPlot();