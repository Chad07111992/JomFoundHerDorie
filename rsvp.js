/* =========================================================
   GOOGLE SHEET LINK — PASTE YOUR DEPLOYED APPS SCRIPT URL HERE
   (Deploy the code.gs provided separately as a Web App,
   then paste the resulting /exec URL below)
========================================================= */
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxpcxzDipUZEOJIkqXm7Mi5DeeXkUC8dl58HhOGg2sSzsMCfpkNAPAlVIMSkxK7dH_n/exec";

/* ---------------- floating decor: petals, confetti, roses ---------------- */
(function(){
  const decor = document.getElementById('decor');
  const roseSVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <g>
      <circle cx="12" cy="12" r="5.4" fill="#8a3b3b"/>
      <circle cx="12" cy="12" r="3.6" fill="#b5524f"/>
      <circle cx="12" cy="12" r="1.8" fill="#d97b6f"/>
    </g>
  </svg>`;
  const total = 22;
  for(let i=0;i<total;i++){
    const el = document.createElement('div');
    const kind = i % 5 === 0 ? 'rose' : (i % 2 === 0 ? 'petal' : 'confetti');
    el.className = kind;
    if(kind === 'rose'){ el.innerHTML = roseSVG; }
    const left = Math.random()*100;
    const duration = 12 + Math.random()*14;
    const delay = Math.random()*-20;
    const drift = (Math.random()*80 - 40) + 'px';
    el.style.left = left + 'vw';
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = delay + 's';
    el.style.setProperty('--drift', drift);
    if(kind === 'confetti'){
      el.style.background = ['#c9a866','#b9926a','#e6cd94','#93aecb'][i % 4];
    }
    decor.appendChild(el);
  }
})();

/* ---------------- form submit ---------------- */
const form = document.getElementById('rsvpForm');
const submitBtn = document.getElementById('submitBtn');
const statusMsg = document.getElementById('statusMsg');
const successOverlay = document.getElementById('successOverlay');

function showStatus(text, type){
  statusMsg.textContent = text;
  statusMsg.className = 'status-msg show ' + type;
}

form.addEventListener('submit', function(e){
  e.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const numGuests = document.getElementById('numGuests').value;
  const attending = document.getElementById('attending').value;
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const diet = document.getElementById('diet').value.trim();
  const message = document.getElementById('message').value.trim();

  if(!fullName || !numGuests || !attending || !email){
    showStatus('Please complete all required fields marked with *.', 'err');
    return;
  }

  const payload = {
    fullName, numGuests, attending, email, phone, diet, message,
    timestamp: new Date().toISOString()
  };

  if(!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.indexOf('PASTE_YOUR') === 0){
    showStatus('Setup needed: paste your Google Apps Script URL in the code.', 'err');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  showStatus('', '');

  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(function(){
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send My RSVP';
    successOverlay.classList.add('show');
    form.reset();
  })
  .catch(function(err){
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send My RSVP';
    showStatus('Something went wrong. Please try again.', 'err');
  });
});

document.getElementById('closeSuccess').addEventListener('click', function(){
  successOverlay.classList.remove('show');
  statusMsg.className = 'status-msg';
});