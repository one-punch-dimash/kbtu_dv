var NODES = []
var EDGES = []

async function bootstraping(){
    var nodes = await d3.csv("nodelist.csv");
    var edges = await d3.csv("edgelist.csv");
    
    var nodeHash = nodes.reduce((hash, node) => {hash[node.id] = node;
        return hash;
    }, {})
    
    edges.forEach(edge => {
        edge.weight = parseInt(edge.weight)
        edge.source = nodeHash[edge.source]
        edge.target = nodeHash[edge.target]
    })

    NODES = nodes
    EDGES = edges

    createForceLayout(NODES, EDGES)
}

bootstraping()

async function createForceLayout(NODES, EDGES) {
    console.log("working creating force layout")
    var nodes = NODES
    var edges = EDGES

    var roleScale = d3.scaleOrdinal()
        .domain(["contractor", "employee", "manager"])
        .range(["#75739F", "#41A368", "#FE9922"]);

    
    var dimension = {
        width: window.innerWidth*0.8,
        height: window.innerWidth*0.8,
        margin: {
            top: 50,
            right: 10,
            bottom: 10,
            left: 55
        }
    }

    dimension.boundedWidth = dimension.width
        - dimension.margin.right
        - dimension.margin.left;

    dimension.boundedHeight = dimension.height
        - dimension.margin.top
        - dimension.margin.bottom;

    
  
    var width = window.innerWidth*0.8
    var height = window.innerWidth*0.8

    margin= {
        top: 50,
        right: 10,
        bottom: 10,
        left: 55
    }

    const svg = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    simulation = d3.forceSimulation()
        .force("link", d3.forceLink() 
        .id(d => d.id) 
    ) 
    .force("charge", d3.forceManyBody().strength(-40)) 
    .force("center", d3.forceCenter(width/2, height/2)); 

    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(edges)
        .enter()
        .append("line")
        .style("stroke", "#9A8B7A")
        .style("opacity", .5)
        .style("stroke-width", d => d.weight);

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter()
        .append("circle")
        .attr("r", 10)
        .style("fill", d => roleScale(d.role))
        .call(d3.drag() 
            .on("start", dragstarted) 
            .on("drag", dragged)      
            .on("end", dragended)     
        );

    const text = svg.append("g")
        .attr("class", "text")
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .text(d => d.id)

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(edges);

    function ticked() {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);

        text.attr("x", d => d.x - 5) 
            .attr("y", d => d.y + 5);
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fy = d.y;
        d.fx = d.x;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

function add(){

    let toNode = $("#toNode").val()
    let newNode = $("#newNode").val()

    var map = d3.map(NODES, function(d) { return d.id; });
    let found = map.get(toNode)
    console.log(found);   

    let nodeExist = map.has(toNode)
    let nodeAlreadyExist = map.has(newNode)

    if (nodeAlreadyExist){
        alert("This new node already exists!!!")
        return
    }

    if (!nodeExist){
        alert("This node doesn't exists!!!")
        return
    }

    if (nodeExist){
        NODES.push({
            id: newNode,
            role: 'test',
            salary: '2000'
        });
    
        EDGES.push(
            {
                source: toNode,
                target: newNode,
                weight: 5
            }
        )

        d3.select("svg").remove();

        createForceLayout(NODES, EDGES)
    
    }else{
        alert("This node doesn't exist")
    }
}


function change(){

    console.log("NODE: ", NODES)

    let oldNodeName = $("#oldNodeName").val()
    let newNodeName = $("#newNodeName").val()

    var map = d3.map(NODES, function(d) { return d.id; });

    let nodeAlreadyExist = map.has(newNodeName)
    let nodeExist = map.has(oldNodeName)
    

    if (nodeAlreadyExist){
        alert("This new name of node already exists!!!")
        return
    }

    if (!nodeExist) {
        alert("This old name of node doesn't exists!!!")
        return
    }

    console.log(NODES)

    for (let i = 0; i < NODES.length; i++) {
        console.log(NODES[i].id)

        if (NODES[i].id == oldNodeName){
            console.log(oldNodeName)
            console.log("found!!!!", i)
            NODES[i].id = newNodeName
        }
    }

    console.log(NODES)

    d3.select("svg").remove();
    createForceLayout(NODES, EDGES)
}