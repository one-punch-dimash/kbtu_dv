async function plotHist(t) {
    const dataset = await d3.json("my_weather_data.json");
    //d3.select("#wrapper").html("");

    if (t == "low") {
        var xAccessor = d => d.temperatureLow;
    }
    else if (t == "high") {
        var xAccessor = d => d.temperatureHigh;
    }
    else if (t == "min") {
        var xAccessor = d => d.temperatureMin;
    }
    else if (t == "max") {
        var xAccessor = d => d.temperatureMax;
    }

    const yAccessor = (d) => d.length;
    const mean = d3.mean(dataset, xAccessor);
    const numberOfBins = 10;
    // Функции для инкапсуляции доступа к колонкам набора данных

    let dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height);

    const bounded = wrapper.append("g");

    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top}px)`);

    const xScaler = d3.scaleLinear()
        .domain(d3.extent(dataset,xAccessor))
        .range([0,dimension.boundedWidth]);

    const histogram = d3.bin()
        .domain(xScaler.domain())
        .value(xAccessor)
        .thresholds(10);

    const bins = histogram(dataset);

    const yScaler = d3.scaleLinear()
        .domain([0, d3.max(histogram, yAccessor)])
        .range([dimension.boundedHeight, 0]);

    const bin = bounded.append("g");
    const groupBin = bin.selectAll("g")
        .data(bins)
        .enter()
        .append("g");

    const binPadding = 1;

    const barRect = groupBin.append("rect")
        .attr("x", (d) => xScaler(d.x0) + binPadding/2)
        .attr("y", (d) => yScaler(yAccessor(d)))
        .attr("width", (d) => d3.max([0, xScaler(d.x1) - xScaler(d.x0) - binPadding]))
        .attr("height", (d) => dimension.boundedHeight - yScaler(yAccessor(d)))
        .attr("fill", "#AAAAEE");

    const meanLine = bounded.append("line")
        .attr("x1", xScaler(mean))
        .attr("x2", xScaler(mean))
        .attr("y1", -15)
        .attr("y2", dimension.boundedHeight)
        .attr("stroke", "black")
        .attr("stroke-dasharray", "2px 4px");

    const meanLabel = bounded.append("text")
        .attr("x", xScaler(mean))
        .attr("y", 10)
        .text(t)
        .attr("fill", "maroon")
        .attr("font-size", "12px");

    const xAxisGen = d3.axisBottom()
        .scale(xScaler);

    const xAxis = bounded.append("g")
        .call(xAxisGen)
        .style("transform", `translateY(${dimension.boundedHeight}px)`);

    /*const barText = groupBin.filter(yAccessor)
        .append("text")
        .attr("x", d => xScaler(d.x0) + (xScaler(d.x1) - xScaler(d.x0))/2)
        .attr("y", d => yScaler(yAccessor(d)) - 5)
        .text(yAccessor)
        .attr("fill", "darkgrey")
        .attr("font-size", "12px")
        .attr("text-anchor", "middle");

    var dataCallback = function(d) {
        d.x = +d[0];
        d.y = +d[1];
    };*/
}

plotHist("low");