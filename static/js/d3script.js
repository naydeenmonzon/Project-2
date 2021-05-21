
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



var dx = 12
var dy = 120
var tree = d3.tree().nodeSize([dx, dy])
var treeLink = d3.linkHorizontal().x(d => d.y).y(d => d.x)




function graph(root, {
  label = d => d.data.id, 
  highlight = () => false,
  marginLeft = 40
} = {}) {
  root = tree(root);

  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });




  const svg = d3.select("#treecanvas")
      .attr("viewBox", [0, 00, width, x1 - x0 + dx * 2])
      // .attr("width", width)
      // .attr("height", height)
      .style("overflow", "visible");
  
  const g = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("transform", `translate(${marginLeft},${dx - x0})`);
    
  const link = g.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
  .selectAll("path")
    .data(root.links())
    .join("path")
      .attr("stroke", d => highlight(d.source) && highlight(d.target) ? "red" : null)
      .attr("stroke-opacity", d => highlight(d.source) && highlight(d.target) ? 1 : null)
      .attr("d", treeLink);
  
  const node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

  node.append("circle")
      .attr("fill", d => highlight(d) ? "red" : d.children ? "#555" : "#999")
      .attr("r", 2.5);

  node.append("text")
      .attr("fill", d => highlight(d) ? "red" : null)
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -6 : 6)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(label)
    .clone(true).lower()
      .attr("stroke", "white");
  
  return svg.node();
}





/*--------------------------------------------------------------- TREE MAP ------------------------------------------------------------------------*/

const tree_url = '/static/data/endusedata.csv'
let req = new XMLHttpRequest()
let color = d3.scaleOrdinal(d3.schemeCategory10)

const text = "A bad excuse is better than none."

let treedata = d3.text(tree_url).then(function(data){

  parsed = d3.hierarchy(
    data,
    id => {
      for (const split of [/[^\w\s]/, /\s/]) {
        const children = id && id.split(split).filter(id => id.length > 0);
        if (children.length > 1) return children;
      }
    }
  )

return  graph(parsed, {marginLeft: 200, label: d => d.data})

})








//Create SVG element
// var svg = d3.select("#treemap")
// .append("svg")
// .attr("width", 600)
// .attr("height", 600);


// let arraytree = []


// let treedata = d3.text(tree_url).then(function(data){

//   treedata2 = d3.csvParse(data, function(d){
//   // d.forEach(item => arraytree.push(item))
  // return {
  //   ENDUSE: d.ENDUSE,
  //   District: d.District,
  //   treeWeight: d.Weight,
  //   value: d.Value,
  //   item_count: d.Item_Count,
  //   treeDate: d.Date};})

    // reduceFn = treedata2 => d3.sum(treedata2, d => d['value'] + d['item_count'] + d['treeWeight']);
    // groupingFns = [d => d.treeDate, d => d.ENDUSE, d => d.District]
    // rollupData = d3.rollup(treedata2, reduceFn, ...groupingFns)

    // groupmap = d3.group(treedata2, d=>new Date(d.treeDate), d=>d.ENDUSE, d=>d.District)
    // valuesum = d3.sum(treedata2, d=>d.value + d.item_count + d.treeWeight)
    // // finalmap = Array.from(treedata2map,
    // //   ([key,value])=>({key, value:value[0].item_count}))

    // finalmap = d3.rollup(treedata2, valuesum, groupmap)

    // testmap = d3.group(trdata, d=>d.treeDate, d=>d.ENDUSE, d=>d.District)
    // itemsum = d3.rollup(treedata2, v=> d3.sum(v, d=> d.item_count), d=>d.treeDate, d=>d.ENDUSE, d=>d.District)
    // weightsum = d3.rollups(treedata2, v=> d3.sum(v, d=> d.treeWeight), d=>d.treeDate, d=>d.ENDUSE, d=>d.District)
    // valuesum = d3.rollups(treedata2, v=> d3.sum(v, d=> d.value), d=>d.treeDate, d=>d.ENDUSE, d=>d.District)
    // testmap = new Map(d3.transpose(valuesum,itemsum))

  //   ttt = new Map(treedata2)


  // function makeHierarchy(config) {
  //   const defaultConfig = {
  //     childrenAccessorFn: ([key, value]) => value.size && Array.from(value),
  //     sumFn: ([key, value]) => value,
  //     sortFn: (a, b) => b.value - a.value,
  //   };
  //   const { 
  //     data,
  //     reduceFn,
  //     groupByFns,
  //     childrenAccessorFn,
  //     sumFn,
  //     sortFn
  //   } = { ...defaultConfig, ...config };
  //   const rollupData = d3.rollup(data, reduceFn, ...groupByFns);
  //   const hierarchyData = d3.hierarchy([null, rollupData], childrenAccessorFn)
  //   .sum(sumFn)
  //   .sort(sortFn);
  //   return hierarchyData;
  //  }
  
  //  makeHierarchy({
  //   data: treedata2,
  //   groupByFns: [d => d.treeDate, d => d.ENDUSE, d => d.District],
  //   reduceFn: v => d3.sum(v, d =>d['value'] + d['item_count'] + d['treeWeight'])
  //  });



  // });
  // console.log(treedata)



  // var root = d3.stratify()
  // .id(function(d){ return d.item_count})
  // .id(function(d){ return d.value})
  // .id(function(d){ return d.treeWeight})
  // .parentId(function(d){return d.District})
  // .parentId(function(d){return d.ENDUSE})
  // .parentId(function(d){return d.treeDate})
  // (treedata)

// const jsontree = d3.json('/static/data/endusedata.json').then(function(data){return data})



// console.log(jsontree)

// const root = d3.hierarchy({
//   data: treedata,
//   name: 'endusedata',
//   parent:
//     {name: treedata.Date,
//     children: [
//       {name: treedata.ENDUSE,
//         children: [
//         {name: 'District',
//           children: [
//             {name: 'treeWeight'},
//             {name: 'Value'},
//             {name: 'Item_Count'}]
//           }
//         ]
//       }
//     ]
//   }
// })



//   console.log(root)

// root.sum(function(d) { return d.value ? 1 : 0; });

// var treemap = d3.treemap()
//     .size([width, height])
//     .padding(2);

// var nodes = treemap(root
//     .sum(function(d) { return d.value; })
//     .sort(function(a, b) { return b.height - a.height || b.value - a.value; }))
//   .descendants();

// console.log(root)

// const treecanvas = d3.select('#treemap')
//     .selectAll('svg')
//       .attr('width', width)
//       .attr('height', height)
//     .selectAll('g')
//     .data(root.leaves())
//     .append('g')
//     .attr("transform", d=> "translate(" + d.x0 + ", " + d.y0 + ")");


//     treecanvas.append("title")
//     .text(d => {d.ancestors().reverse().map(d => d.data)});

//     treecanvas.append("rect")
//     // .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
//     .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
//     .attr("fill-opacity", 0.6)
//     .attr("width", d => d.x1 - d.x0)
//     .attr("height", d => d.y1 - d.y0);

//     treecanvas.append("clipPath")
//     .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
//   .append("use")
//     .attr("xlink:href", d => d.leafUid.href);

//     treecanvas.append("text")
//     .attr("clip-path", d => d.clipUid)
//   .selectAll("tspan")
//   .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
//   .join("tspan")
//     .attr("x", 3)
//     .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
//     .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
//     .text(d => d);



  