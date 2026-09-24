/* Local FlyBrain remix. Dance is choreography; Brain response only adds sensory input. */
(function () {
  'use strict';
  const panel = document.createElement('section');
  panel.id = 'disco'; panel.setAttribute('aria-label', 'Fly Disco controls');
  panel.innerHTML = `<div class="eyebrow">Running on your Mac · Local</div><h1>Bollywood Fly 🪰</h1>
    <p>Dhol-style beats and a six-legged routine.</p>
    <select id="dance-routine" aria-label="Dance routine"><option value="bollywood">Bollywood-inspired</option><option value="disco">Disco</option></select>
    <select id="dance-mode" aria-label="Movement mode"><option value="dance">Dance · choreographed</option><option value="brain">Brain response · experiment</option></select>
    <button id="dance-play" class="primary">▶ Start dancing</button>
    <div class="row"><label class="file-label">Choose song<input id="dance-file" type="file" accept="audio/*"></label><button id="dance-demo">Built-in beat</button></div>
    <label>Tempo <output id="dance-bpm-label">112 BPM</output><input id="dance-bpm" type="range" min="60" max="180" value="112"></label>
    <label>Volume <input id="dance-volume" type="range" min="0" max="100" value="25"></label>
    <small id="dance-move" aria-live="polite">Ready · 32-beat routine</small>
    <div class="meter"><i id="dance-meter"></i></div>
    <small id="dance-track">Built-in dhol-style beat · original rhythm</small>
    <small id="dance-note">Beat-driven choreography. The brain simulation continues, but does not generate these dance moves.</small>`;
  document.body.appendChild(panel);
  const $ = id => document.getElementById(id);
  const audio = new Audio(); audio.loop = true;
  let ac, master, analyser, bins, media, objectURL;
  let running = false, useSong = false, mode = 'dance';
  let last = 0, phase = 0, pulse = 0, beat = -1, level = 0;
  let savedView, pose=null, routine='bollywood';
  function sound() {
    if (ac) return;
    ac = new AudioContext(); master = ac.createGain(); master.gain.value = Number($('dance-volume').value)/100;
    analyser = ac.createAnalyser(); analyser.fftSize = 256; bins = new Uint8Array(analyser.frequencyBinCount);
    analyser.connect(master); master.connect(ac.destination);
    media = ac.createMediaElementSource(audio); media.connect(analyser);
  }
  function tone(freq, end, duration, type, volume) {
    const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
    o.type = type; o.frequency.setValueAtTime(freq,t); o.frequency.exponentialRampToValueAtTime(end,t+duration);
    g.gain.setValueAtTime(volume,t); g.gain.exponentialRampToValueAtTime(.001,t+duration);
    o.connect(g); g.connect(analyser); o.start(t); o.stop(t+duration);
    o.onended = () => {o.disconnect();g.disconnect();};
  }
  function percussion(step) {
    if(routine==='disco') {
      if(step%2===0){tone(145,42,.18,'sine',.65);tone([130.81,164.81,196,164.81][Math.floor(step/2)%4],65,.15,'triangle',.16);}
      tone(step%4===2?850:4200,step%4===2?180:2500,.035,'square',.04);
      return;
    }
    // An original eight-beat dhol-inspired pattern, synthesized locally.
    const i=step%16;
    if([0,3,6,8,11,14].includes(i)) {
      tone(125,48,.22,'sine',.65);tone(190,90,.08,'triangle',.12);
    }
    if([2,4,7,10,12,15].includes(i)) {
      tone(380,170,.10,'triangle',.26);tone(1100,420,.04,'square',.035);
    }
    tone(2600,1800,.022,'triangle',i%2?.055:.035);
  }
  function setNote() {
    $('dance-note').textContent = mode === 'dance'
      ? 'Beat-driven choreography. The brain simulation continues, but does not generate these dance moves.'
      : 'Music intensity stimulates sensory neuron groups. Movement uses the existing brain and behavior model; dancing is not guaranteed.';
  }
  function resetView() {
    const b = getLayoutBounds();
    fly.x = Math.max(100, (innerWidth - (innerWidth > 800 ? 315 : 250)) / 2);
    fly.y = (b.top + b.bottom) / 2; zoomLevel = 1; panX = 0; panY = 0;
  }
  function stop() {
    running = false; audio.pause(); BRAIN.musicIntensity = 0; pulse = level = 0; pose=null;
    $('dance-move').textContent='Ready · 32-beat routine';
    $('dance-play').textContent = '▶ Start dancing';
    $('dance-meter').style.width = '0%';
    if (savedView) {zoomLevel = savedView.zoom; panX=savedView.x; panY=savedView.y; savedView=null;}
    anim.wingSpread = 0;
  }
  $('dance-play').onclick = async () => {
    if (running) {stop();return;}
    try {
      sound(); await ac.resume();
      if (useSong) await audio.play();
      running = true; last=performance.now(); phase=0;beat=-1;
      savedView={zoom:zoomLevel,x:panX,y:panY}; resetView();
      $('dance-play').textContent = '■ Stop'; setNote();
    } catch(e) { stop(); $('dance-note').textContent = 'Could not play this audio. Try another song or the built-in beat.'; }
  };
  $('dance-routine').onchange=e=>{routine=e.target.value;phase=0;beat=-1;pose=null;if(!useSong)$('dance-track').textContent=routine==='bollywood'?'Built-in dhol-style beat · original rhythm':'Built-in disco beat · original rhythm';};
  $('dance-mode').onchange = e => { mode=e.target.value; BRAIN.musicIntensity=0; setNote(); if(running) resetView(); };
  $('dance-bpm').oninput = e => {$('dance-bpm-label').textContent=e.target.value+' BPM';};
  $('dance-volume').oninput = e => {if(master) master.gain.setTargetAtTime(Number(e.target.value)/100,ac.currentTime,.03);};
  $('dance-demo').onclick = () => {stop();$('dance-play').disabled=false;useSong=false;audio.removeAttribute('src');audio.load();if(objectURL)URL.revokeObjectURL(objectURL);objectURL=null;$('dance-file').value='';$('dance-track').textContent=routine==='bollywood'?'Built-in dhol-style beat · original rhythm':'Built-in disco beat · original rhythm';setNote();};
  $('dance-file').onchange = e => {
    const file=e.target.files[0]; if(!file)return;
    stop(); if(objectURL)URL.revokeObjectURL(objectURL);
    objectURL=URL.createObjectURL(file); audio.src=objectURL; useSong=true;
    $('dance-track').textContent=file.name+' · stays on your computer';
    $('dance-play').disabled=true;
    $('dance-note').textContent='Loading your song…';
    audio.oncanplay=()=>{$('dance-play').disabled=false;setNote();};
    audio.onerror=()=>{$('dance-play').disabled=false;useSong=false;$('dance-note').textContent='That file could not be played. The built-in beat is ready instead.';};
    audio.load();
  };
  const originalUpdate=update;
  update=function(dt){
    originalUpdate(dt);
    if(!running)return;
    const now=performance.now(), elapsed=Math.min(.1,(now-last)/1000);last=now;
    phase+=elapsed*Number($('dance-bpm').value)/60;
    let energy=0;
    if(useSong){
      analyser.getByteFrequencyData(bins);
      for(let i=0;i<bins.length;i++)energy+=bins[i]/255;
      energy/=bins.length; level=energy;
      pulse += (Math.min(1,energy*3)-pulse)*.35;
    }else{
      const n=Math.floor(phase*2);
      if(n!==beat){beat=n;
        percussion(n);
      }
      pulse=Math.exp(-(phase%1)*8);level=pulse;
    }
    BRAIN.musicIntensity=mode==='brain'?Math.min(1,level*2):0;
    $('dance-meter').style.width=(Math.min(1,level*2)*100)+'%';
    if(mode!=='dance'){pose=null;$('dance-move').textContent='Brain response · '+behavior.current;return;}
    const b=getLayoutBounds(), cx=Math.max(100,(innerWidth-(innerWidth>800?315:250))/2), cy=(b.top+b.bottom)/2;
    const strength=useSong?Math.min(1,energy*4):1;
    pose=FlyDanceRoutines[routine](phase,strength);
    fly.x=cx+pose.x;fly.y=cy+pose.y;
    facingDir=Math.PI/2+pose.turn;
    anim.walkPhase=pose.phase; anim.wingSpread=pose.wings;
    const move=pose.name+' · '+(Math.floor(phase)%32+1)+'/32';
    if($('dance-move').textContent!==move)$('dance-move').textContent=move;
  };
  const originalBody=drawFlyBody;
  drawFlyBody=function(dt){
    if(!running||mode!=='dance'){originalBody(dt);return;}
    ctx.save();
    const size=pose?pose.scale:1.9;ctx.scale(size,size);
    window.FlyDancePose=pose;
    const previous=behavior.current;behavior.current='walk';
    try {originalBody(dt);} finally {window.FlyDancePose=null;behavior.current=previous;ctx.restore();}
  };
  const originalDraw=draw;
  draw=function(){
    originalDraw();
    if(!running)return;
    ctx.save();
    const b=getLayoutBounds(), cx=Math.max(100,(innerWidth-(innerWidth>800?315:250))/2),cy=(b.top+b.bottom)/2;
    ctx.globalCompositeOperation='destination-over';
    const glow=ctx.createRadialGradient(cx,cy,10,cx,cy,240);
    glow.addColorStop(0,`hsla(${(routine==='bollywood'?30:270)+Math.sin(phase)*25},70%,45%,${.10+pulse*.12})`);glow.addColorStop(1,'transparent');
    ctx.fillStyle=glow;ctx.fillRect(0,b.top,innerWidth,b.bottom-b.top);
    ctx.strokeStyle=routine==='bollywood'?'#ffbb662b':'#ca9af52b';ctx.lineWidth=1;
    for(let r=85;r<=205;r+=40){ctx.beginPath();ctx.ellipse(cx,cy+30,r,r*.42,0,0,Math.PI*2);ctx.stroke();}
    ctx.restore();
  };
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&running)stop();});
  window.addEventListener('pagehide',()=>{stop();if(objectURL)URL.revokeObjectURL(objectURL);if(ac)ac.close();});
})();
