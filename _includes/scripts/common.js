(function () {
  var $root = document.getElementsByClassName('root')[0];
  if (window.hasEvent('touchstart')) {
    $root.dataset.isTouch = true;
    document.addEventListener('touchstart', function(){}, false);
  }
})();

// Image Ring
let xPos = 0;

gsap.timeline()
  .set('.ring', { rotationY:180, cursor:'grab' }) //set initial rotationY so the parallax jump happens off screen
  .set('.img',  { // apply transform rotations to each image
    rotateY: (i)=> i*-36,
    transformOrigin: '50% 50% 500px',
    z: -500,
    backgroundImage:(i)=>'url(https://picsum.photos/id/'+(i+32)+'/600/400/)',
    backgroundPosition:(i)=>getBgPos(i),
    backfaceVisibility:'hidden'
  })    
  .from('.img', {
    duration:1.5,
    y:200,
    opacity:0,
    stagger:0.1,
    ease:'expo'
  })
  .add(()=>{
    $('.img').on('mouseenter', (e)=>{
      let current = e.currentTarget;
      gsap.to('.img', {opacity:(i,t)=>(t==current)? 1:0.5, ease:'power3'})
    })
    $('.img').on('mouseleave', (e)=>{
      gsap.to('.img', {opacity:1, ease:'power2.inOut'})
    })
  }, '-=0.5')

$(window).on('mousedown touchstart', dragStart);
$(window).on('mouseup touchend', dragEnd);
    

function dragStart(e){ 
if (e.touches) e.clientX = e.touches[0].clientX;
xPos = Math.round(e.clientX);
gsap.set('.ring', {cursor:'grabbing'})
$(window).on('mousemove touchmove', drag);
}


function drag(e){
if (e.touches) e.clientX = e.touches[0].clientX;    

gsap.to('.ring', {
  rotationY: '-=' +( (Math.round(e.clientX)-xPos)%360 ),
  onUpdate:()=>{ gsap.set('.img', { backgroundPosition:(i)=>getBgPos(i) }) }
});

xPos = Math.round(e.clientX);
}


function dragEnd(e){
$(window).off('mousemove touchmove', drag);
gsap.set('.ring', {cursor:'grab'});
}


function getBgPos(i){ //returns the background-position string to create parallax movement in each image
return ( 100-gsap.utils.wrap(0,360,gsap.getProperty('.ring', 'rotationY')-180-i*36)/360*500 )+'px 0px';
}

// scroll Image effect
function scroll() {
  gsap.set('.main', {position:'fixed', background:'#fff', width:'100%', maxWidth:'1200px', height:'100%', top:0, left:'50%', x:'-50%'})
  gsap.set('.scrollDist', {width:'100%', height:'200%'})
  gsap.timeline({scrollTrigger:{trigger:'.scrollDist', start:'top top', end:'bottom bottom', scrub:1}})
      .fromTo('.sky', {y:0},{y:-200}, 0)
      .fromTo('.cloud1', {y:100},{y:-800}, 0)
      .fromTo('.cloud2', {y:-150},{y:-500}, 0)
      .fromTo('.cloud3', {y:-50},{y:-650}, 0)
      .fromTo('.mountBg', {y:-10},{y:-100}, 0)
      .fromTo('.mountMg', {y:-30},{y:-250}, 0)
      .fromTo('.mountFg', {y:-50},{y:-600}, 0)
  
  $('#arrowBtn').on('mouseenter', (e)=>{ gsap.to('.arrow', {y:10, duration:0.8, ease:'back.inOut(3)', overwrite:'auto'}); })
  $('#arrowBtn').on('mouseleave', (e)=>{ gsap.to('.arrow', {y:0, duration:0.5, ease:'power3.out', overwrite:'auto'}); })
  $('#arrowBtn').on('click', (e)=>{ gsap.to(window, {scrollTo:innerHeight, duration:1.5, ease:'power1.inOut'}); }) // scrollTo requires the ScrollTo plugin (not to be confused w/ ScrollTrigger)
  }
