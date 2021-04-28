gsap.registerPlugin(ScrollTrigger);

gsap.registerEffect({
  name: "fade",
  effect: (targets, config) => {
      return gsap.to(targets, {duration: config.duration, opacity: 0});
  },
  defaults: {duration: 2}, //defaults get applied to any "config" object passed to the effect
  extendTimeline: true, //now you can call the effect directly on any GSAP timeline to have the result immediately inserted in the position you define (default is sequenced at the end)
});

// -------------------------------- sliding effect -------------------------------- //

gsap.to(".content:not(:last-child)", {
    yPercent: -100,
    ease: "slow(0.9,0.4, false)",
    stagger: .5,
    scrollTrigger: {
        trigger: "content",
        start: "top top",
        end: "=500%",
        scrub: 1,
        pin: true
    }
});


// -------------------------------- Navigation -------------------------------- //

gsap.set(".content", { zIndex: (i, target, targets) => targets.length - i });

const navLinks = gsap.utils.toArray(".section_nav a");
navLinks.forEach((link, i) => {
link.addEventListener("click", e => {
    e.preventDefault();
    gsap.to(window, {scrollTo: i * innerHeight, ease:"back.inOut", duration:1.5});
});
});

const content = gsap.utils.toArray(".content");
content.forEach((content, i) => {
  ScrollTrigger.create({
    start: 0,
    end: (i + 1) * innerHeight - innerHeight / 2,
    markers: false,
    onLeave: () => {
    if(navLinks[i + 1]) {
        gsap.to(navLinks[i + 1], {transformOrigin:"right", scale: 2, color: "white"});
        gsap.to(navLinks[i], {scale: 1, color: "#203538"});
    }
    }, 
    onEnterBack: () => {
    gsap.to(navLinks[i], {transformOrigin:"right", scale: 2, color: "white"});
    if(navLinks[i + 1]) {
        gsap.to(navLinks[i + 1], {scale: 1, color: "#203538"});
    }
    }, 
})
});

// -------------------------------- Intro / Map -------------------------------- //



gsap.to(".worldmap path", 1, {
  fill: "#013c584d",
  stagger: {
    each: .1,
    ease: "power2",
    from:".China"},
    scrollTrigger: {
      trigger:".intro",
      start:"top 100%",
      markers:true,
      toggleActions: "play none none reverse"}
})


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
