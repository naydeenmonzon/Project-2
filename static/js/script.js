gsap.registerPlugin(ScrollTrigger, TextPlugin);




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
})

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