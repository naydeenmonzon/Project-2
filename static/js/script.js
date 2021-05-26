gsap.registerPlugin(ScrollTrigger, TextPlugin);

const spacerInnerHeight = $('.page.empty').innerHeight()

function topscroll(i, inHgth){
  if (i === 0) {
    return 0}
    else return (i * ( inHgth + (spacerInnerHeight / i)*i))
  }


  ScrollTrigger.refresh()

// add animations and labels to the timeline
// scroller.addLabel("start")
// .from(".box p", {scale: 0.3, rotation:45, autoAlpha: 0})
// .addLabel("color")
// .from(".box", {backgroundColor: "#28a92b"})
// .addLabel("spin")
// .to(".box", {rotation: 360})
// .addLabel("end");

// let tl = gsap.timeline({
//   scrollTrigger: {
//     trigger: ".page",
//     pin: true,   // pin the trigger element while active
//     start: "top top", // when the top of the trigger hits the top of the viewport
//     end: "+=500", // end after scrolling 500px beyond the start
//     scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
//     markers:true,
//     snap: {
//       snapTo: "labels", // snap to the closest label in the timeline
//       duration: {min: 0.2, max: 3}, // the snap animation should be at least 0.2 seconds, but no more than 3 seconds (determined by velocity)
//       delay: 0.2, // wait 0.2 seconds from the last scroll event before doing the snapping
//       ease: "power1.inOut" // the ease of the snap animation ("power3" by default)
//     }
//  }
// });



// -------------------------------- Navigation -------------------------------- //

const target = gsap.set(".content", { zIndex: (i, targets) => targets.length});

const navLinks = gsap.utils.toArray(".section_nav a");
navLinks.forEach((link, i) => {
link.addEventListener("click", e => {
    e.preventDefault();
    gsap.to(window, {scrollTo: topscroll(i, innerHeight), duration: 4, ease: "back.inOut(1.7)"});
  });
});


const Navpage = gsap.utils.toArray(".content");

Navpage.forEach((_page, i) => {
  ScrollTrigger.create({
    start: 0,
    end: (i+1)  * (innerHeight+spacerInnerHeight) - (innerHeight+spacerInnerHeight) / 2,
    markers: true,
    onLeave: () => {
    if(navLinks[i + 1]) {
        gsap.to(navLinks[i + 1], {transformOrigin:"right", scale: 2, color: "white"});
        gsap.to(navLinks[i], {scale: 1, color: "#7cc4d1"});
    }
    }, 
    onEnterBack: () => {
    gsap.to(navLinks[i], {transformOrigin:"right", scale: 2, color: "white"});
    if(navLinks[i + 1]) {
        gsap.to(navLinks[i + 1], {scale: 1, color: "#7cc4d1"});
      }
    },
  })
});

ScrollTrigger.refresh()
// -------------------------------- Intro / Map -------------------------------- //



const worldmapdata = d3.json('/static/data/worldgeojson.json').then(function (data){
    
  var svg = d3.select('#worldmap')
  .attr("width", width)
  .attr("height", height)
  
  
  var projection = d3.geoNaturalEarth1()
  .scale(width / 1.3 / Math.PI)
  .translate([width / 2, height / 2])


svg.append("g")
    .selectAll("path")
    .data(data.features)
    .enter()
    .append("path").attr("id", d=> d.properties.name)
        .attr("d", d3.geoPath()
            .projection(projection))

        
      
gsap.to("#worldmap path", 1,{
  fill: "#013c584d",
  stagger: {
  each: 0.1,
  ease: "power2",
  from:"#China"},
  scrollTrigger: {
    trigger:".intro",
    start:"top center",
    markers: false}
  });      
  return data
  })
            
  
  console.log(worldmapdata)

  ScrollTrigger.refresh()



// -------------------------------- letter animation -------------------------------- // 


gsap.fromTo('#cursor', {
  autoAlpha: 0,
  x:-10},{
  autoAlpha: 1, duration: 1, repeat: -1, ease: SteppedEase.config(1)
});

ScrollTrigger.refresh()
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
    markers:false,
    toggleActions: "play none none reverse"
  },
});


ScrollTrigger.refresh()


// -------------------------------- Global -------------------------------- //




const globalsections = gsap.utils.toArray("#global section");
console.log(globalsections)


let maxWidth = 0;
const getMaxWidth = () => {       
  maxWidth = 0;
  globalsections.forEach((section) => {
    maxWidth += section.offsetWidth;
  });
}; 
getMaxWidth();
ScrollTrigger.addEventListener("refreshInit", getMaxWidth);

gsap.to(globalsections, {
  x: () => `-${maxWidth - window.innerWidth}`,
  ease: "none",
  scrollTrigger: {
    trigger: ".global.wrapper",
    pin: true,
    scrub: 0.5,
    end: () => `+=${maxWidth}`,
    invalidateOnRefresh: true,
    markers: true
  }
});

ScrollTrigger.refresh()
globalsections.forEach((sct, _i) => {
  ScrollTrigger.create({
    trigger: sct,
    start: () => 'top top-=' + (sct.offsetLeft - window.innerWidth/2) * (maxWidth / (maxWidth - window.innerWidth)),
    end: () => '+=' + sct.offsetWidth * (maxWidth / (maxWidth - window.innerWidth)),
    toggleClass: {targets: sct, className: "active"}
  });
});


ScrollTrigger.refresh()





