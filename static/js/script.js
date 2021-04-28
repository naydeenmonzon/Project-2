gsap.registerPlugin(ScrollTrigger);

// -------------------------------- sliding effect -------------------------------- //

gsap.to(".content:not(:last-child)", {
    yPercent: -100,
    ease: "slow(0.9,0.4, false)",
    stagger: .2,
    scrollTrigger: {
        trigger: "content",
        start: "top top",
        end: "+=500%",
        scrub: 1,
        pin: true,
    }
});


// -------------------------------- Navigation -------------------------------- //

gsap.set(".content", { zIndex: (i, target, targets) => targets.length - i });

const navLinks = gsap.utils.toArray(".section_nav a");
navLinks.forEach((link, i) => {
link.addEventListener("click", e => {
    e.preventDefault();
    gsap.to(window, {scrollTo: i * innerHeight});
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

// -------------------------------- Map -------------------------------- //



gsap.to(".worldmap path", 1, {
  fill: "#013c584d",
  stagger: {
    each: .1,
    ease: "power2",
    from:".China"},
    scrollTrigger: {
      trigger:".intro",
      start:"top top",
      markers:true}
})


gsap.from('.test', {duration: 2, y: "-100%", ease:"bounce"});
