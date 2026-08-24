/* ================================================================
   CONFIG — paste your links here
   ================================================================ */
// 1) Background music: paste a direct audio URL (mp3/ogg) for
//    "Power of Two" by MYMP into the <source src="..."> tag above.

/* ================================================================
   REVEAL ON SCROLL
   ================================================================ */
const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
},{threshold:.15});
revealEls.forEach(el=>io.observe(el));

/* ================================================================
   COUNTDOWN
   ================================================================ */
const weddingDate = new Date("2026-12-15T10:00:00+08:00").getTime();
function updateCountdown(){
  const now = new Date().getTime();
  let diff = weddingDate - now;
  if(diff < 0) diff = 0;
  const d = Math.floor(diff/(1000*60*60*24));
  const h = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const m = Math.floor((diff%(1000*60*60))/(1000*60));
  const s = Math.floor((diff%(1000*60))/1000);
  document.getElementById('cd-days').textContent = String(d).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-mins').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-secs').textContent = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ================================================================
   BACKGROUND MUSIC TOGGLE + AUTOPLAY ATTEMPT
   ================================================================ */
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let musicPlaying = false;

function tryAutoplay(){
  const p = bgMusic.play();
  if(p !== undefined){
    p.then(()=>{ musicPlaying = true; musicToggle.classList.add('spinning'); })
     .catch(()=>{ musicPlaying = false; }); // browsers block autoplay until interaction
  }
}
window.addEventListener('load', tryAutoplay);
// fallback: start on first user interaction if autoplay was blocked
function unlockAudioOnce(){
  if(!musicPlaying){ tryAutoplay(); }
  document.removeEventListener('click', unlockAudioOnce);
}
document.addEventListener('click', unlockAudioOnce);

musicToggle.addEventListener('click', ()=>{
  if(musicPlaying){
    bgMusic.pause(); musicPlaying = false; musicToggle.classList.remove('spinning');
  } else {
    bgMusic.play().then(()=>{ musicPlaying = true; musicToggle.classList.add('spinning'); }).catch(()=>{});
  }
});

/* ================================================================
   FLOATING PETALS & CONFETTI (rose petals + confetti only)
   ================================================================ */
const petalField = document.getElementById('petal-field');
const petalColors = ['#c9a66b','#8b6f47','#c0392b','#d98880'];
const confettiColors = ['#4a6fa5','#c9a66b','#8b6f47','#f5f0e6'];

function makePetal(){
  const el = document.createElement('div');
  const isConfetti = Math.random() < 0.35;
  el.className = isConfetti ? 'confetti' : 'petal';
  const size = isConfetti ? (6+Math.random()*6) : (10+Math.random()*10);
  const left = Math.random()*100;
  const dur = 9+Math.random()*10;
  const drift = (Math.random()*160-80)+'px';
  el.style.left = left+'vw';
  el.style.animationDuration = dur+'s';
  el.style.setProperty('--drift', drift);
  if(isConfetti){
    el.style.width = size+'px'; el.style.height = size*0.5+'px';
    el.style.background = confettiColors[Math.floor(Math.random()*confettiColors.length)];
  } else {
    el.style.width = size+'px'; el.style.height = size*1.2+'px';
    el.style.borderRadius = '0 100% 0 100%';
    el.style.background = petalColors[Math.floor(Math.random()*petalColors.length)];
  }
  petalField.appendChild(el);
  setTimeout(()=>el.remove(), dur*1000+200);
}
setInterval(makePetal, 500);
for(let i=0;i<12;i++) setTimeout(makePetal, i*180);

/* ================================================================
   PRENUP CIRCULAR GALLERY
   ================================================================ */
const prenupPhotos = [
  {src:'Gallery/prenup1.jpg', name:'Prenup 1'},
  {src:'Gallery/prenup2.jpg', name:'Prenup 2'},
  {src:'Gallery/prenup3.jpg', name:'Prenup 3'},
  {src:'Gallery/prenup4.jpg', name:'Prenup 4'},
  {src:'Gallery/prenup5.jpg', name:'Prenup 5'},
  {src:'Gallery/prenup6.jpg', name:'Prenup 6'},
];
const stage = document.getElementById('prenupStage');
let order = [0,1,2,3,4,5]; // order[0] = front photo index

function renderPrenup(){
  stage.innerHTML = '';
  const n = order.length;
  order.forEach((photoIdx, pos)=>{
    const wrap = document.createElement('div');
    wrap.className = 'prenup-photo';
    const img = document.createElement('img');
    img.src = prenupPhotos[photoIdx].src;
    img.alt = prenupPhotos[photoIdx].name;
    wrap.appendChild(img);

    // layout: pos 0 = front & centered; others fan out behind, blurred
    const spread = 60; // px horizontal spread per step back
    const scaleStep = 0.09;
    const blurStep = 2.2;
    const x = pos === 0 ? 0 : (pos % 2 === 1 ? 1 : -1) * (Math.ceil(pos/2)) * spread;
    const y = pos * 10;
    const scale = 1 - pos*scaleStep;
    const blur = pos===0 ? 0 : Math.min(pos*blurStep, 8);
    const z = n - pos;
    const rotate = pos === 0 ? 0 : (pos % 2 === 1 ? -1 : 1) * (4+pos*1.5);

    wrap.style.transform = `translate(-50%,-50%) translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
    wrap.style.filter = `blur(${blur}px)`;
    wrap.style.opacity = pos===0 ? 1 : Math.max(0.45, 1 - pos*0.13);
    wrap.style.zIndex = z;

    wrap.addEventListener('click', ()=>{
      if(pos === 0){
        openLightbox(prenupPhotos[photoIdx].src);
      } else {
        // bring clicked photo to front
        order = order.filter(i=>i!==photoIdx);
        order.unshift(photoIdx);
        renderPrenup();
      }
    });
    stage.appendChild(wrap);
  });
}
renderPrenup();

// auto-rotate gently every few seconds
setInterval(()=>{
  const last = order.pop();
  order.unshift(last);
  renderPrenup();
}, 4500);

/* Lightbox */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
function openLightbox(src){ lightboxImg.src = src; lightbox.classList.add('open'); }
document.getElementById('lightboxClose').addEventListener('click', ()=>lightbox.classList.remove('open'));
lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) lightbox.classList.remove('open'); });

/* ================================================================
   SECRET KEYS GAME
   ================================================================ */
document.querySelectorAll('.key-card').forEach(card=>{
  const answer = card.dataset.answer.toLowerCase();
  const input = card.querySelector('.key-input');
  const btn = card.querySelector('.key-check');
  const msg = card.querySelector('.key-msg');

  function attempt(){
    const val = input.value.trim().toLowerCase();
    if(!val){ return; }
    if(val === answer){
      card.classList.add('unlocked');
      msg.textContent = 'Correct! ✨';
      msg.classList.remove('wrong');
      spawnGlow(btn);
    } else {
      msg.textContent = 'Not quite — try again.';
      msg.classList.add('wrong');
      card.style.animation = 'shake .4s';
      setTimeout(()=>card.style.animation='', 400);
    }
  }
  btn.addEventListener('click', attempt);
  input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); attempt(); }});
});

function spawnGlow(target){
  const rect = target.getBoundingClientRect();
  for(let i=0;i<14;i++){
    const p = document.createElement('div');
    p.className = 'glow-particle';
    const angle = Math.random()*Math.PI*2;
    const dist = 40+Math.random()*50;
    p.style.setProperty('--gx', Math.cos(angle)*dist+'px');
    p.style.setProperty('--gy', Math.sin(angle)*dist+'px');
    p.style.left = (rect.left+rect.width/2)+'px';
    p.style.top = (rect.top+rect.height/2)+'px';
    p.style.position = 'fixed';
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), 950);
  }
}

const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake{0%,100%{transform:translateX(0);}25%{transform:translateX(-6px);}75%{transform:translateX(6px);}}`;
document.head.appendChild(shakeStyle);