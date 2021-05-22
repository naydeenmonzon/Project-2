
const width = 1400
const height = 700
const padding = 70


// -------------------------------- HEATMAP TABLE -------------------------------- //

let url = '/static/data/cityportTEU.csv'
// let req = new XMLHttpRequest()
var colorSchema = new Array(3).concat(
  "e0ecf49ebcda8856a7",
  "edf8fbb3cde38c96c688419d",
  "edf8fbb3cde38c96c68856a7810f7c",
  "edf8fbbfd3e69ebcda8c96c68856a7810f7c",
  "edf8fbbfd3e69ebcda8c96c68c6bb188419d6e016b",
  "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d6e016b",
  "f7fcfde0ecf4bfd3e69ebcda8c96c68c6bb188419d810f7c4d004b"
)

let xScale
let yScale
let TEUmap
let port = []
let datelist = []
let startDate
let endDate
let domdate
let monthDelta

let colorScale = d3.scaleOrdinal(d3.schemeCategory10)



let canvas = d3.select('#canvas')
canvas.attr('width', width)
canvas.attr('height', height)
canvas.selectAll('g')



let generateScales = () => {

  xScale = d3.scaleBand()
  .domain(d3.range(151))
  .range([padding, width-padding])
  

  yScale = d3.scaleTime()
  .range([padding, height-padding])
  .domain([endDate, startDate])



  // xScale = d3.scaleLinear()
  //     .range([colorSchema[0], colorSchema[colorSchema.length - 1]])
  //     .domain(d3.extent(port, function (d) { return d[2] }))
  //     .interpolate(d3.interpolateHcl);

}


let drawCells = () => {

  canvas.selectAll('rect')
  .data(TEUmap)
  .enter()
  .append('rect')
  .attr('class', 'cell')
  .attr('fill', function(d) { return colorScale(d)})
  .attr('data-Port',function(d){return (d[0])})
  .attr('height',(height)/(monthDelta*1.5))
  .attr('y', function(d) {return yScale(d)})
  .attr('width',function(d) {return (width) /((d.length)*padding)})
  .attr('x', function(d) { return xScale(d)})
  .attr("transform", "translate(" + padding + ", " + padding + ")")
  .classed('rect', true)
}


let drawAxes = () => {

  let xAxis = d3.axisBottom(xScale)
  // .tickValues(tport)

                  
  let yAxis = d3.axisLeft(yScale)
  .ticks(d3.timeMonth.every(1))


  canvas.append('g')
  .call(xAxis)
  .attr('id', 'x-axis')
  .attr("transform", "translate(" + 0 + ", " + (height-padding) + ")")
  .selectAll('text')
    .style("text-anchor",'middle')
      .attr("dx",".8em")
      .attr('transform', "rotate(-90)")
      

  canvas.append('g')
  .call(yAxis)
  .attr('id', 'y-axis')
  .attr("transform", "translate(" + padding + ", " + 0 + ")")
  
  
}







let heatmapdata = d3.text(url).then(function(data){
  
  hmdata = d3.csvParse(data, d3.autoType)
  hmdata.forEach(d=> port.push(d.Port))
  hmdata.forEach(d=> datelist.push(new Date(d.Date)))

  obj = d3.rollups(hmdata, v=> d3.sum(v, d=> d.TEU), d=>d.Date, d=>d.Port);


  function nest(rollup) {
    return Array.from(rollup, ([key, value]) =>
      value instanceof Map
        ? { name: key, children: nest(value) }
        : { name: key, value: value });
      };
  TEUnest = nest(obj)
  TEUcol = []
  TEUnest.forEach (element => (TEUcol.push(element.value)))
  TEUArray = TEUcol.flatMap(d=>Array.from(d))
  
  
  TEUmap = new Map(d3.sort(TEUArray))
  domdate = d3.extent(datelist)
  startDate = domdate[0]
  endDate = domdate[1]

  tvalue = d3.transpose(Array.from(TEUmap))
  tport = tvalue.reverse().slice(1)
  monthDelta = d3.timeMonth.count(startDate, endDate)

generateScales()
drawCells()
drawAxes()

return {
  TEUmap:TEUmap,
  tvalue:tvalue,
  tport:tport,
  portCount: tport[0].length,
  domdate:domdate,
  startDate:startDate,
  endDate:endDate,
  monthDelta:monthDelta};
})

// console.log(heatmapdata)








/*--------------------------------------------------------------- TREE MAP ------------------------------------------------------------------------*/



// var dx = 12
// var dy = 120
// var tree = d3.tree().nodeSize([dx, dy])
// var treeLink = d3.linkHorizontal().x(d => d.y).y(d => d.x)




// function graph(root, {
//   label = d => d.data.id, 
//   highlight = () => false,
//   marginLeft = 40
// } = {}) {
//   root = tree(root);

//   let x0 = Infinity;
//   let x1 = -x0;
//   root.each(d => {
//     if (d.x > x1) x1 = d.x;
//     if (d.x < x0) x0 = d.x;
//   });




//   const svg = d3.select("#treecanvas")
//       .attr("viewBox", [0, 00, width, x1 - x0 + dx * 2])
//       // .attr("width", width)
//       // .attr("height", height)
//       .style("overflow", "visible");
  
//   const g = svg.append("g")
//       .attr("font-family", "sans-serif")
//       .attr("font-size", 10)
//       .attr("transform", `translate(${marginLeft},${dx - x0})`);
    
//   const link = g.append("g")
//     .attr("fill", "none")
//     .attr("stroke", "#555")
//     .attr("stroke-opacity", 0.4)
//     .attr("stroke-width", 1.5)
//   .selectAll("path")
//     .data(root.links())
//     .join("path")
//       .attr("stroke", d => highlight(d.source) && highlight(d.target) ? "red" : null)
//       .attr("stroke-opacity", d => highlight(d.source) && highlight(d.target) ? 1 : null)
//       .attr("d", treeLink);
  
//   const node = g.append("g")
//       .attr("stroke-linejoin", "round")
//       .attr("stroke-width", 3)
//     .selectAll("g")
//     .data(root.descendants())
//     .join("g")
//       .attr("transform", d => `translate(${d.y},${d.x})`);

//   node.append("circle")
//       .attr("fill", d => highlight(d) ? "red" : d.children ? "#555" : "#999")
//       .attr("r", 2.5);

//   node.append("text")
//       .attr("fill", d => highlight(d) ? "red" : null)
//       .attr("dy", "0.31em")
//       .attr("x", d => d.children ? -6 : 6)
//       .attr("text-anchor", d => d.children ? "end" : "start")
//       .text(label)
//     .clone(true).lower()
//       .attr("stroke", "white");
  
//   return svg.node();
// }





/*--------------------------------------------------------------- TREE MAP ------------------------------------------------------------------------*/
const tree_url = '/static/data/endusedatatest.json'
let req = new XMLHttpRequest()
let color = d3.scaleSequential([8, 0], d3.interpolateMagma)
let format = d3.format(",d")

/*----------------------------------------------------*/


let treedata = d3.json('/static/data/endusedata.json').then(function(data) {
  
  
  let treemap = data => d3.treemap()
  .size([width, height])
  .paddingOuter(3)
  .paddingTop(19)
  .paddingInner(1)
  .round(true)
(d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value))

    const root = treemap(data);

    const svg = d3.select("#treecanvas")
        .attr("viewBox", [0, 0, width, height])
        .style("font", "10px sans-serif");
  
    const shadow = d3.selectAll("shadow");
  
    svg.append("filter")
        .attr("id", shadow.id)
      .append("feDropShadow")
        .attr("flood-opacity", 0.3)
        .attr("dx", 0)
        .attr("stdDeviation", 3);
  
    const node = svg.selectAll("g")
      .data(d3.group(root, d => d.height))
      .join("g")
        .attr("filter", shadow)
      .selectAll("g")
      .data(d => d[1])
      .join("g")
        .attr("transform", d => `translate(${d.x0},${d.y0})`);
  
    node.append("title")
        .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}\n${format(d.value)}`);
  
    node.append("rect")
        .attr("id", d => (d.nodeUid =  d3.selectAll("node")).id)
        .attr("fill", d => color(d.height))
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0);
  
    node.append("clipPath")
        .attr("id", d => (d.clipUid =  d3.selectAll("clip")).id)
      .append("use")
        .attr("xlink:href", d => d.nodeUid.href);
  
    node.append("text")
        .attr("clip-path", d => d.clipUid)
      .selectAll("tspan")
      .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g).concat(format(d.value)))
      .join("tspan")
        .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
        .text(d => d);
  
    node.filter(d => d.children).selectAll("tspan")
        .attr("dx", 3)
        .attr("y", 13);
  
    node.filter(d => !d.children).selectAll("tspan")
        .attr("x", 3)
        .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`);
  
    return svg.node();
})

console.log(treedata)

// const tree_url = '/static/data/endusedatatest.json'
// let req = new XMLHttpRequest()
// let treecolor = d3.scaleOrdinal( d3.schemePaired  )
// let margin ={top: 10, bottom: 10, right: 10, left: 10}




// /*----------------------------------------------------*/

//   const svg = d3.select('#treecanvas')
//   .style('font-family', 'sans-serif')
//   .attr('width', width)
//   .attr('height', height)


// let treedata = d3.json('/static/data/endusedata.json').then(function(data) {

//   var hierarchy = d3.hierarchy(data)
//   .sum(function(d) { return d.value; })
//   .sort(function(a, b) { return b.depth - a.depth || b.value - a.value; })
//   .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })


//   let treemap = d3.treemap()
//   .tile(d3.treemapBinary)
//   .size([ width, height ])
//   .padding(1)
//   .paddingTop(1)
//   .round(true)

//   var root = treemap(hierarchy)
    



// //  for (const descendant of root) {
// //     console.log(descendant);
// //   }
 


//   const g = svg.append('g')
//       .attr('class', 'treemap-container')

//   const leaf = g.selectAll('g.leaf')
//     // root.leaves() returns all of the leaf nodes
//     .data(root.leaves())
//     .join('g')
//       .attr('class', 'leaf')
//       // position each group at the top left corner of the rect
//       .attr('transform', d => `translate(${ d.x0 },${ d.y0 })`)


//   leaf.append('title')
//       .text(d => `${ d.parent.data.name }-${ d.data.name }\n${ d.value}`)

//     // Now we append the rects. Nothing crazy here
//   leaf.append('rect')
//       .attr('id', 'tree-rect')
//       .attr("fill", d => { while (d.depth > 1) d = d.parent; return treecolor(d.data.name); })
//       .attr('opacity', 0.7)
//       // the width is the right edge position - the left edge position
//       .attr('width', d => d.x1 - d.x0)
//       // same for height, but bottom - top
//       .attr('height', d => d.y1 - d.y0)
//       // make corners rounded
//       // .attr('rx', 3)
//       // .attr('ry', 3)

    


//   // This next section checks the width and height of each rectangle
//   // If it's big enough, it places labels. If not, it doesn't.
//   leaf.each((d, i, arr) => {
  
//     // The current leaf element
//     const current = arr[i]
    
//     const left = d.x0,
//           right = d.x1,
//           // calculate its width from the data
//           width = right - left,
//           top = d.y0,
//           bottom = d.y1,
//           // calculate its height from the data
//           height = d.y1 - d.y0

//     // too small to show text
//     const tooSmall = width < 34 || height < 25
    
//     // and append the text (you saw something similar with the pie chart (day 6)
//     const text = d3.select( current ).append('text')
//         // If it's too small, don't show the text
//         .attr('opacity', tooSmall ? 0 : 0.9)
//       .selectAll('tspan')
//       .data(d => [ d.data.name, d.value.toLocaleString() ])
//       .join('tspan')
//         .attr('x', 3)
//         .attr('y', (d,i) => i ? '.5em' : '.15em')
//         .text(d => d)
//   })



//   return(root)
//   // return svg.node()
// })

// console.log(treedata)

/*----------------------------------------------------*/

  function splitter(string){ 
    text = string.split(/(d)/).slice(0,1)
    return text
  }
  
  function fixCallback(callback) {
    return function(error, xhr) {
      callback(error == null ? xhr : null);
    };
  }
  
  