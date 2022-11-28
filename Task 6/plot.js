async function build(data, text){
    
    var data0 = await d3.csv(data);

    var dimension = {
        
        width_box: window.innerWidth*0.9,
        height_box: window.innerHeight*0.8,
        width_plot: window.innerWidth*0.7,
        height_plot: window.innerHeight*0.55,
        nodePadding: 5,
        margin: {
            top: 25,
            left: 25,
            bottom: 25,
            right: 25
        }
    }

    dimension.boundedWidth = dimension.width_box - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height_box - dimension.margin.top - dimension.margin.bottom;
    dimension.boundedPlotWidth = dimension.width_plot - dimension.margin.left - dimension.margin.right;
    dimension.boundedPlotHeight = dimension.height_plot - dimension.margin.top - dimension.margin.bottom;

    var colorScale = d3.scaleOrdinal()
    .domain(['0', '1', '2'])
    .range(["#75739F", "#41A368", "#FE9922"]);


    d3.select("#wrapper").append("h3").text(text)

    const svg = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimension.width_plot)
    .attr("height", dimension.height_plot)
    
    const boundedPlot = svg.append("g");
    boundedPlot.style("transform", `translate(${dimension.margin.left}px, ${dimension.margin.top}px)`);

    const yScaler = d3.scaleLinear()
    .domain([-100, 100])
    .range([dimension.boundedPlotHeight, 0]);

    const xScaler = d3.scaleLinear()
    .domain([-100, 100])
    .range([-100, dimension.boundedPlotWidth]);

    const yAxisGenerator = d3.axisLeft().scale(yScaler);
    const xAxisGenerator = d3.axisBottom().scale(xScaler);

    boundedPlot.append("g").call(yAxisGenerator);
    boundedPlot.append("g").call(xAxisGenerator).style("transform",`translateY(${dimension.boundedPlotHeight}px)`);

    boundedPlot.append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(data0)
    .enter()
    .append("circle")
    .attr("r", 3)
    .attr("cx", d=>xScaler(d.x))
    .attr("cy", d=>yScaler(d.y))
    .style("label", d=>d.label)
    .style("fill", d => colorScale(d.labels));
}

build("tsne.csv", "T-SNE")
build("umap.csv", "UMAP")