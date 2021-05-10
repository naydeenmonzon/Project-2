gsap.registerPlugin(ScrollTrigger, TextPlugin);


//let tl = gsap.timeline({
  // scrollTrigger: {
  //   trigger: ".page",
  //   pin: true,   // pin the trigger element while active
  //   start: "top top", // when the top of the trigger hits the top of the viewport
  //   end: "+=500", // end after scrolling 500px beyond the start
  //   scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
  //   markers:true,
  //   snap: {
  //     snapTo: "labels", // snap to the closest label in the timeline
  //     duration: {min: 0.2, max: 3}, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
  //     delay: 0.2, // wait 0.2 seconds from the last scroll event before doing the snapping
  //     ease: "power1.inOut" // the ease of the snap animation ("power3" by default)
    // }
//  }
//});

// add animations and labels to the timeline
// tl.addLabel("start")
// .from(".box p", {scale: 0.3, rotation:45, autoAlpha: 0})
// .addLabel("color")
// .from(".box", {backgroundColor: "#28a92b"})
// .addLabel("spin")
// .to(".box", {rotation: 360})
// .addLabel("end");

// -------------------------------- Navigation -------------------------------- //



gsap.set(".page", { zIndex: (i, target, targets) => targets.length - i });

const navLinks = gsap.utils.toArray(".section_nav a");
navLinks.forEach((link, i) => {
link.addEventListener("click", e => {
    e.preventDefault();
    gsap.to(window, {scrollTo: i * innerHeight, duration: 2.5, ease: "back.inOut(1.7)"});
  });
});

const page = gsap.utils.toArray(".page");

page.forEach((page, i) => {
  ScrollTrigger.create({
    start: 0,
    end: (i + 1) * innerHeight - innerHeight / 2,
    markers: false,
    onLeave: () => {
    if(navLinks[i + 1]) {
        gsap.to(navLinks[i + 1], {transformOrigin:"right", scale: 2, color: "white"});
        gsap.to(navLinks[i], {scale: 1, color: "#355f66"});
    }
    }, 
    onEnterBack: () => {
    gsap.to(navLinks[i], {transformOrigin:"right", scale: 2, color: "white"});
    if(navLinks[i + 1]) {
        gsap.to(navLinks[i + 1], {scale: 1, color: "#355f66"});
      }
    },
  })
});

// -------------------------------- Intro / Map -------------------------------- //
gsap.to(".worldmap path", 1,{
  fill: "#013c584d",
  stagger: {
  each: 0.1,
  ease: "power2",
  from:".China"},
  scrollTrigger: {
    trigger:".intro",
    start:"top center",
    markers: false}
  });


// --------- letter animation --------- // 


gsap.fromTo('#cursor', {
  autoAlpha: 0,
  x:-10},{
  autoAlpha: 1, duration: 1, repeat: -1, ease: SteppedEase.config(1)
});

let tween = gsap.to("#text", {
  text: {
    value: "The virus has thrown off the choreography of moving cargo from one continent to another. Americans stuck in their homes have set off a surge of orders from factories in China, much of it carried across the Pacific in containers — the metal boxes that move goods in towering stacks atop enormous vessels. As households in the United States have filled bedrooms with office furniture and basements with treadmills, the demand for shipping has outstripped the availability of containers in Asia, yielding shortages there just as the boxes pile up at American ports."
  },
  duration: 120,
  delay: 1,
  ease: "slow"});




// -------------------------------- Port -------------------------------- //

gsap.to(".column-3",  {
  duration: 4,
  opacity: 0,
  ease: "steps(4)",
  stagger: {
    grid: [1,4],
    from: "random",
    amount: 1
  },
  scrollTrigger: {
    trigger:".Port",
    start:"top 100%",
    markers:true,
    toggleActions: "play none none reverse"
  },
});

// -------------------------------- TABLE -------------------------------- //


var data = d3.csv("/static/data/gport.csv").then(function(data){

  var P = Array.from(d3.rollup(data,v=>v.length, d=>d.Port))
  P.forEach(function(Array) {Array.pop()});
  
  const Port = P.forEach(function(){})
  
  return Port
});
console.log(data)
// d3.rollup(data, v => v.length, d => d.key);




//console.log(map)
// var colorDomain = d3.extent(data, function(d){
//   return d.value;});

// var colorScale = d3.scaleLinear()
//   .domain(colorDomain)
//   .range(["lightblue","blue"]);

// var rectangles = svg.selectAll("rect")
//   .data(data)
//   .enter()
//   .append("rect");
//   rectangles
//   .attr("x", function(d){
//   return d.day * 50;})
//   .attr("y", function(d){
//   return d.week * 50;})
//   .attr("width", 50)
//   .attr("height", 50).
//   style("fill", function(d){
//     return colorScale(d.value); 
//   });  





















// // set the dimensions and margins of the graph
// var margin = {top: 100, right: 100, bottom: 100, left: 100},
//   width = 1600 - margin.left - margin.right,
//   height = 800 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svg = d3.select("#heatmap")
// .append("svg")
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom)
// .append("g")
//   .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");


// //Read the data
// d3.csv("/static/data/gport.csv", function(data) {
  

//   // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
//   var myGroups = ['2019-01',	'2019-02',	'2019-03',	'2019-04',	'2019-05',	'2019-06',	'2019-07',	'2019-08',	'2019-09',	'2019-10',	'2019-11',	'2019-12',	'2020-01',	'2020-02',	'2020-03',	'2020-04',	'2020-05',	'2020-06',	'2020-07',	'2020-08',	'2020-09',	'2020-10',	'2020-11',	'2020-12',	'2021-01',	'2021-02',	'2021-03']
//   var myVars = ['AK',	'AL',	'CA',	'CT',	'DC',	'DE',	'FL',	'GA',	'HI',	'IL',	'IN',	'KY',	'LA',	'MA',	'MD',	'ME',	'MI',	'MN',	'MS',	'NC',	'NH',	'NJ',	'NY',	'OH',	'OR',	'PA',	'PR',	'RI',	'SC',	'TX',	'VA',	'VI',	'WA',	'WI']

//   // Build X scales and axis:
//   var x = d3.scaleBand()
//     .range([ 0, width ])
//     .domain(myGroups)
//     .padding(0.05);
//   svg.append("g")
//     .style("font-size", '.7em')
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x).tickSize(0))
//     .select(".domain")


//   // Build Y scales and axis:
//   var y = d3.scaleBand()
//     .range([ height, 0 ])
//     .domain(myVars)
//     .padding(0.05);
//   svg.append("g")
//     .style("font-size", ".7em")
//     .call(d3.axisLeft(y).tickSize(0))
//     .select(".domain")

//   // Build color scale
//   var myColor = d3.scaleSequential()
//     .interpolator(d3.interpolateYlGn(0))
//     .domain([1,800])



//   // add the squares
//   svg.selectAll()
//     .data(data, d=>d)
//     .enter()
//     .append("rect")
//       .attr("x", function(d) { return x(d => d.Date) })
//       .attr("y", function(d) { return y(d => d.Port) })
//       .attr("rx", 4)
//       .attr("ry", 4)
//       .attr("width", x.bandwidth() )
//       .attr("height", y.bandwidth() )
//       .style("fill", function(d) { return myColor(d.TEU)} )
//       .style("stroke-width", 4)
//       .style("stroke", "none")
//       .style("opacity", 0.8)
// });

// // Add title to graph
// svg.append("text")
//         .attr("x", 0)
//         .attr("y", -50)
//         .attr("text-anchor", "left")
//         .style("font-size", "22px")
//         .text("A d3.js heatmap");

// // Add subtitle to graph
// svg.append("text")
//         .attr("x", 0)
//         .attr("y", -20)
//         .attr("text-anchor", "left")
//         .style("font-size", "14px")
//         .style("fill", "grey")
//         .style("max-width", 400)
//         .text("A short description of the take-away message of this chart.");