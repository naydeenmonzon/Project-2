// -------------------------------- TABLE -------------------------------- //

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


let width = 1400
let height = 700
let padding = 70

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
  .tickValues(d3.extent(tport))
console.log(tport)
                  
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

console.log(heatmapdata)
