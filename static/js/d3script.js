
const width = 1400
const height = 700
const padding = 70
let swatch1 = d3.quantize(d3.interpolateHcl("#180000", "#2976b4bb"), 10)
let swatch2 = d3.quantize(d3.interpolateHcl("#2e0300", "#66d1a438"), 20)
let swatch3 = d3.quantize(d3.interpolateHcl('#addde4b6','#addde4b6'), 20)
let color = d3.scaleOrdinal(swatch1) // tree
let color2 = d3.scaleOrdinal(swatch3) //tree
let color3 = d3.scaleOrdinal(swatch2)
let format = d3.format(" ,d")


// -------------------------------- STACKBAR TABLE -------------------------------- //
let bubble_url = '/static/data/cityportTEU2.json'
let formatBubble = d3.format(",d")
const circWidth = 1600
const circHeight = 800


let colorBubble = d3.scaleLinear()
    .domain([0, 5])
    .range(["hsl(184, 100%, 8%)", "hsl(20, 9%, 100%)"])
    .interpolate(d3.interpolateHcl)

let dataBubble = d3.json(bubble_url).then(function(data) {   
    pack = data => d3.pack()
    .size([circWidth, circHeight])
    .padding(3)
  (d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value))

    const root = pack(data);
    let focus = root;
    let view;
  
    const svg = d3.select("#bubblecanvas")
        .attr("viewBox", `-${circWidth / 2} -${circHeight / 2} ${circWidth} ${circHeight}`)
        .style("margin-right", "10%")
        .style('margin-top', '4.2%')
        .style("cursor", "pointer")
        .on("click", (event) => zoom(event, root));
  
    const node = svg.append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
        .attr("fill", d => d.children ? colorBubble(d.depth) : "#3b2730")
        .attr("pointer-events", d => !d.children ? "none" : null)
        .on("mouseover", function() { d3.select(this).attr("stroke", "grey" ); })
        .on("mouseout", function() { d3.select(this).attr("stroke", null); })
        .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));
  
    const label = svg.append("g")
        .style("font-family", "'Poppins', sans-serif")
        .style("font-weight", "400")
        .style("fill", 'white')
        .style("font-size", '1em')
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
        .style("fill-opacity", d => d.parent === root ? 1 : 0)
        .style("display", d => d.parent === root ? "inline" : "none")
        .text(d => d.data.name);
  
    zoomTo([root.x, root.y, root.r * 2]);
  
    function zoomTo(v) {
      const k = circWidth / v[2];
  
      view = v;
  
      label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
      node.attr("r", d => d.r * k);
    }
  
    function zoom(event, d) {
      const focus0 = focus;
  
      focus = d;
  
      const transition = svg.transition()
          .duration(event.altKey ? 7500 : 750)
          .tween("zoom", d => {
            const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
            return t => zoomTo(i(t));
          });
  
      label
        .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .transition(transition)
          .style("fill-opacity", d => d.parent === focus ? 1 : 0)
          .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }
  
    return svg.node();


})


// -------------------------------- STACKBAR TABLE -------------------------------- //

// let bar_url = '/static/data/pivotcityportTEU.csv'
// let outerRadius = Math.min(width, height) * 0.67
// let innerRadius = 180


// const bardata = d3.dsv(',',bar_url, function(d, i, columns, autoType){
//   let total = 0;
//   for (let i = 1; i < columns.length; ++i) total += d[columns[i]] = +d[columns[i]];
//   d.total = total;
//   return d
// }).then(function(d, i, columns){

//   newData = d.sort((a, b) => b.total - a.total)
//   console.log(newData)
  
//   let cl = newData.columns.length


// const arc = d3.arc()
//   .innerRadius(newData => y(newData[0]))
//   .outerRadius(newData => y(newData[1]))
//   .startAngle(newData => x(newData.Port))
//   .endAngle(newData => x(newData.Port) + x.bandwidth())
//   .padAngle(0.01)
//   .padRadius(innerRadius);

// const x = d3.scaleBand()
//   .domain(newData.map(d => newData.Port))
//   .range([0, 2 * Math.PI])
//   .align(0)

// const y = d3.scaleRadial()
//   .domain([0, d3.max(newData, newData => newData.total)])
//   .range([innerRadius, outerRadius])

// const z = d3.scaleOrdinal()
//   .domain(newData.columns.slice(1))
//   .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])


// const xAxis = g => g
//   .attr("text-anchor", "middle")
//   .call(g => g.selectAll("g")
//     .data(newData)
//     .enter().append("g")
//       .attr("transform", d => `
//         rotate(${((x(newData.Port) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
//         translate(${innerRadius},0)
//       `)
//       .call(g => g.append("line")
//           .attr("x2", -5)
//           .attr("stroke", "#000"))
//       .call(g => g.append("text")
//           .attr("transform", d => (x(newData.Port) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
//               ? "rotate(90) translate(0,16)"
//               : "rotate(-90) translate(0,-9)")
//           .text(newData => newData.Port)))

// const yAxis = g => g
//   .attr("text-anchor", "end")
//   .call(g => g.append("text")
//       .attr("x", -6)
//       .attr("y", d => -y(y.ticks(10).pop()))
//       .attr("dy", "-1em")
//       .text("Population"))
//   .call(g => g.selectAll("g")
//     .data(y.ticks(10).slice(1))
//     .join("g")
//       .attr("fill", "none")
//       .call(g => g.append("circle")
//           .attr("stroke", "#000")
//           .attr("stroke-opacity", 0.5)
//           .attr("r", y))
//       .call(g => g.append("text")
//           .attr("x", -6)
//           .attr("y", newData => -y(newData))
//           .attr("dy", "0.35em")
//           .attr("stroke", "#fff")
//           .attr("stroke-width", 5)
//           .text(y.tickFormat(10, "s"))
//         .clone(true)
//           .attr("fill", "#000")
//           .attr("stroke", "none")));



// const legend = g => g.append("g")
//   .selectAll("g")
//   .data(newData.columns.slice(1).reverse())
//   .join("g")
//     .attr("transform", (newData, i) => `translate(-40,${(i - (cl - 1) / 2) * 20})`)
//     .call(g => g.append("rect")
//         .attr("width", 18)
//         .attr("height", 18)
//         .attr("fill", z))
//     .call(g => g.append("text")
//         .attr("x", 24)
//         .attr("y", 9)
//         .attr("dy", "0.35em")
//         .text(newData => newData));

//   svg = d3.select('#chartcanvas')
//           .attr("viewBox", `${-width / 2} ${-height * 0.69} ${width} ${height}`)
//           .style("width", "100%")
//           .style("height", "auto")
//           .style("font", "10px sans-serif");
  
//     svg.append("g")
//       .selectAll("g")
//       .data(d3.stack().keys(newData.columns.slice(1))(newData))
//       .join("g")
//         .attr("fill", newData => z(newData.key))
//       .selectAll("path")
//       .data(newData => newData)
//       .join("path")
//         .attr("d", arc);
  
//     svg.append("g")
//         .call(xAxis);
  
//     svg.append("g")
//         .call(yAxis);
  
//     svg.append("g")
//         .call(legend);
  
//     return svg.node();
// })





/*--------------------------------------------------------------- TREE MAP ------------------------------------------------------------------------*/
const tree_url = '/static/data/endusedatatest.json'


function tile(node, x0, y0, x1, y1) {
  d3.treemapSquarify(node, 0, 0, treeWidth, treeHeight);
  for (const child of node.children) {
    child.x0 = x0 + child.x0 / treeWidth * (x1 - x0);
    child.x1 = x0 + child.x1 / treeWidth * (x1 - x0);
    child.y0 = y0 + child.y0 / treeHeight * (y1 - y0);
    child.y1 = y0 + child.y1 / treeHeight * (y1 - y0);
  }
}
/*----------------------------------------------------*/

const treeWidth = 1600
const treeHeight = 800

let treedata = d3.json('/static/data/endusedata2.json').then(function(data) {
  var name = d => d.ancestors().reverse().map(d => d.data.name).join("/")
  
  
  treemap = data => d3.treemap()
  .tile(tile)
(d3.hierarchy(data)
  .sum(d => d.value)
  .sort(function(a, b) { return  a.depth - b.depth || b.value - a.value; }))
  
  
// console.log(treemap(data).links().filter(d=>d))

  const x = d3.scaleLinear().rangeRound([0, treeWidth]);
  const y = d3.scaleLinear().rangeRound([0, treeHeight]);


  const svg = d3.select("#treecanvas")
      .attr("viewBox", [0.5, -60.5, treeWidth, treeHeight + 60])
      .style("font", ".8em 'Poppins', sans-serif");

  let group = svg.append("g")
      .call(render, treemap(data))
      

  function render(group, root) {
    const node = group
      .selectAll("g")
      .data(root.children.concat(root))
      .join("g");


    node.filter(d => d === root ? d.parent : d.children)
        .attr("cursor", "pointer")
        .on("click", (event, d) => d === root ? zoomout(root) : zoomin(d));

    node.append("rect")
      .attr('class',d=>( d === root? name(d):d.data.name))
      .attr("id", d => (d.leafUid = Node.ENTITY_REFERENCE_NODE))
        .attr("fill", d => d === root ? "#transparent" : d.children ? color(d.value) : color(d.value))
        .attr("stroke", "black")

    node.append("clipPath")
        .attr("id", SVGPathElement.id)
        .append("use")
        .attr("xlink:href", d => d.leafUid.href)

    node.filter(":not(:last-child)").append("title")
        .text(d => `${name(d)} ${d.child} \n${format(d.value)}`)

    node.filter(":not(:last-child)").append("text")
        .attr("fill", d =>  d.children ? color2(d.value) : color2(d.value))
        .attr("font-weight", d => d === root ? "bold" : null).attr('font-size', d => d === root ?'1.8em': '1.2em')
      .selectAll("tspan")
      .data(d => (d === root ? name(d) : d.data.name).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
      .join("tspan")
        .attr("x", 10)
        .attr("y", (d, i, nodes) => `${(i === nodes.length) * 1 + 2 + i * 0.9}em`)
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 1 : null)
        .attr("font-weight", (d, i, nodes) => i === nodes.length - 1 ? "normal" : null)
        .text(d => d);


    node.filter(":last-child").append("title")
    .text(d => `${name(d)} ` + `${format(d.value)}`)

    node.filter(":last-child").append("text")
        .attr("fill", d =>  d.children ? color2(d.value) : color2(d.value))
        .attr("font-weight", d => d === root ? "bold" : null).attr('font-size', d => d === root ?'1.8em': '1.2em')
      .selectAll("tspan")
      .data(d => (d === root ? name(d) : d.data.name).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
      .join("tspan")
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 1 : null)
        .attr("font-weight", (d, i, nodes) => i === nodes.length - 1 ? "normal" : null)      
        .filter(":first-child")
        .attr("x", 10)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * .8 + 1.2 + i * 0.9}em`)
        .text(d => d)
        

        node.filter(":last-child").selectAll("tspan")
        .data(d => (d === root ? name(d) : d.data.name).split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
        .join("tspan")
        .filter(":not(:first-child)")
        .text(d => d)

      

    group.call(position, root);

  }

  function position(group, root) {
    group.selectAll("g")
        .attr("transform", d => d === root ? `translate(0,-60)` : `translate(${x(d.x0)},${y(d.y0)})`)
      .select("rect")
        .attr("width", d => d === root ? treeWidth : x(d.x1) - x(d.x0))
        .attr("height", d => d === root ? 60 : y(d.y1) - y(d.y0));
  }

  function zoomin(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = group = svg.append("g").call(render, d);

    x.domain([d.x0, d.x1]);
    y.domain([d.y0, d.y1]);

    svg.transition()
        .duration(750)
        .call(t => group0.transition(t).remove()
          .call(position, d.parent))
        .call(t => group1.transition(t)
          .attrTween("opacity", () => d3.interpolate(0, 1))
          .call(position, d));
  }

  function zoomout(d) {
    const group0 = group.attr("pointer-events", "none");
    const group1 = group = svg.insert("g", "*").call(render, d.parent);

    x.domain([d.parent.x0, d.parent.x1]);
    y.domain([d.parent.y0, d.parent.y1]);

    svg.transition()
        .duration(750)
        .call(t => group0.transition(t).remove()
          .attrTween("opacity", () => d3.interpolate(1, 0))
          .call(position, d))
        .call(t => group1.transition(t)
          .call(position, d.parent));
  }
 
  
  return svg.node
})

console.log(treedata)


/*----------------------------------------------------*/

var formatDate = (date) => {
  var format = d3.timeFormat("%Y %B")
  var formatdate = new Date(date)
  return format(formatdate)}


  function splitter(string){ 
    text = string.split(/(d)/).slice(0,1)
    return text
  }
  
  function fixCallback(callback) {
    return function(error, xhr) {
      callback(error == null ? xhr : null);
    };
  }
  
