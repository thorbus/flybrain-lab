/* Local Three.js stage. Graphics read choreography and existing simulation state. */
(function(){
  'use strict';
  if(!window.THREE||!window.FlyRig)return;
  const T=THREE;
  const host=document.createElement('div');host.id='fly-scene';host.setAttribute('aria-label','Interactive 3D fly stage. Drag to orbit and scroll to zoom.');document.body.appendChild(host);
  let renderer;
  try {renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}
  catch(e){host.remove();console.warn('3D unavailable; keeping 2D arena.',e);return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
  renderer.outputEncoding=T.sRGBEncoding;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.domElement.setAttribute('aria-label','3D fly in a neon studio');host.appendChild(renderer.domElement);
  const scene=new T.Scene();scene.background=new T.Color(0x050b16);scene.fog=new T.FogExp2(0x06101c,.025);
  const camera=new T.PerspectiveCamera(42,1,.1,150);
  const orbit=new T.OrbitControls(camera,renderer.domElement);orbit.enableDamping=true;orbit.dampingFactor=.07;
  orbit.minDistance=5;orbit.maxDistance=24;orbit.maxPolarAngle=Math.PI*.47;orbit.minPolarAngle=.3;orbit.enablePan=false;
  let active=true, pixel=false, lastPanel=0;
  let seed=7331;function random(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}
  const mat=(color,roughness=.65,metalness=.2)=>new T.MeshStandardMaterial({color:new T.Color(color).convertSRGBToLinear(),roughness,metalness,flatShading:true});
  const graphite=mat(0x0b1529),deskMat=mat(0x12172e,.5,.35),shell=mat(0x688897,.75,.18),darkShell=mat(0x25313d,.7,.3),legMat=mat(0x85969c,.58,.25);
  const eyeMat=mat(0xa92345,.25,.25),jointMat=mat(0x566b78,.45,.35);
  const cyan=new T.MeshBasicMaterial({color:0x69f5e3}),pink=new T.MeshBasicMaterial({color:0xe755a5});
  function mesh(geometry,material,parent=scene){const m=new T.Mesh(geometry,material);parent.add(m);return m;}
  function box(w,h,d,x,y,z,material,parent=scene){const m=mesh(new T.BoxGeometry(w,h,d),material,parent);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m;}
  function oval(x,y,z,sx,sy,sz,material,parent,detail=2){const m=mesh(new T.IcosahedronGeometry(1,detail),material,parent);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;return m;}
  const up=new T.Vector3(0,1,0),a=new T.Vector3(),b=new T.Vector3(),delta=new T.Vector3();
  function setBone(m,from,to){a.fromArray(from);b.fromArray(to);delta.subVectors(b,a);m.position.copy(a).add(b).multiplyScalar(.5);m.scale.y=delta.length();m.quaternion.setFromUnitVectors(up,delta.normalize());}
  function bone(from,to,r,material,parent){const m=mesh(new T.CylinderGeometry(r*.65,r,1,6),material,parent);setBone(m,from,to);m.castShadow=true;return m;}
  function line(points,color,parent=scene,opacity=1){const g=new T.BufferGeometry().setFromPoints(points.map(p=>new T.Vector3(...p)));const l=new T.Line(g,new T.LineBasicMaterial({color,transparent:opacity<1,opacity}));parent.add(l);return l;}
  // Lighting: broad cool key, magenta rim, warm front fill.
  scene.add(new T.HemisphereLight(0x8faec8,0x101026,.85));
  const key=new T.DirectionalLight(0xaad8ed,1.8);key.position.set(-4,10,7);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-10;key.shadow.camera.right=10;key.shadow.camera.top=10;key.shadow.camera.bottom=-10;key.shadow.bias=-.001;scene.add(key);
  const rim=new T.PointLight(0xd74dc2,1.6,24);rim.position.set(-5,5,-5);scene.add(rim);
  const fill=new T.PointLight(0x4effe3,1.2,18);fill.position.set(6,3,4);scene.add(fill);
  // A physical desktop and luminous inlays give the feet a visible ground plane.
  box(19,.5,12,0,-.32,-1,deskMat);
  box(18.6,.035,.035,0,-.02,4.9,cyan);box(.035,.035,11.6,-9.2,-.02,-1,cyan);box(.035,.035,11.6,9.2,-.02,-1,pink);
  for(let i=0;i<5;i++)line([[-8,.005,-5+i*2],[8,.005,-5+i*2]],0x26344c);
  const ring=mesh(new T.TorusGeometry(3.1,.015,4,96),cyan);ring.rotation.x=-Math.PI/2;ring.position.set(-1.8,.025,.5);
  const ring2=mesh(new T.TorusGeometry(3.28,.008,4,96),pink);ring2.rotation.x=-Math.PI/2;ring2.position.copy(ring.position);
  // Distant faceted skyline with instanced lit windows, entirely local geometry.
  const windowGeo=new T.BoxGeometry(.10,.24,.015),windowMat=new T.MeshBasicMaterial({color:0x467f93});
  const windows=new T.InstancedMesh(windowGeo,windowMat,620);let wi=0;const dummy=new T.Object3D();
  for(let n=0;n<26;n++){
    const x=-27+n*2.15,h=5+random()*14,z=-12-random()*7,w=1.2+random()*.8;
    box(w,h,1.8,x,h/2-1,z,mat(n%3===0?0x152238:0x0b172b));
    for(let row=0;row<16;row++)for(let col=0;col<3;col++)if(random()>.5&&wi<620&&row*.8<h-1){
      dummy.position.set(x+(col-1)*.33,row*.8,z+.91);dummy.updateMatrix();windows.setMatrixAt(wi,dummy.matrix);
      windows.setColorAt(wi,new T.Color(random()>.85?0x984877:0x35667d));wi++;
    }
  }
  windows.count=wi;scene.add(windows);
  for(const x of [-8,8])box(.08,14,.1,x,6,-8.5,cyan);
  box(16,.07,.1,0,10,-8.5,pink);
  // A screen in the room shows measured simulation activity, never invented market data.
  const display=document.createElement('canvas');display.width=768;display.height=432;const dc=display.getContext('2d');
  const texture=new T.CanvasTexture(display);texture.encoding=T.sRGBEncoding;texture.minFilter=T.LinearFilter;
  const monitor=new T.Group();monitor.position.set(3.1,2.6,-3.1);monitor.rotation.y=-.18;scene.add(monitor);
  box(5.2,3,.24,0,0,0,graphite,monitor);
  const screen=mesh(new T.PlaneGeometry(4.91,2.73),new T.MeshBasicMaterial({map:texture,toneMapped:false}),monitor);screen.position.z=.131;
  box(.27,1.3,.22,0,-2,0,graphite,monitor);box(1.65,.08,1,3.1,.04,-3.1,graphite);
  box(5.18,.035,.03,0,-1.48,.15,cyan,monitor);
  // Keyboard and near-field speakers.
  const keyboard=new T.Group();keyboard.position.set(3.2,.13,-.6);keyboard.rotation.y=-.15;scene.add(keyboard);box(3.2,.16,1.1,0,0,0,graphite,keyboard);
  for(let row=0;row<4;row++)for(let col=0;col<12;col++)box(.19,.045,.17,-1.36+col*.245,.11,-.37+row*.23,col%7===0?jointMat:darkShell,keyboard);
  for(const x of [-6.2,6.7]){
    box(1.2,2.3,1,x,1.15,-.2,graphite);
    for(const y of [.7,1.65]){
      const cone=mesh(new T.CylinderGeometry(.35,.28,.04,24),darkShell);cone.rotation.x=Math.PI/2;cone.position.set(x,y,.315);
      const rim=mesh(new T.TorusGeometry(.37,.028,5,32),x<0?pink:cyan);rim.position.set(x,y,.35);
    }
  }
  // Faceted fly, with six separately articulated, three-segment legs.
  const actor=new T.Group();scene.add(actor);
  oval(0,0,-.08,.66,.65,.94,shell,actor);
  oval(0,-.12,-1.35,.69,.52,1.02,darkShell,actor);
  for(let j=0;j<5;j++){
    const band=mesh(new T.TorusGeometry(.56-j*.055,.035,5,16),jointMat,actor);band.position.set(0,-.1,-1-j*.22);band.scale.y=.77;
  }
  const head=new T.Group();head.position.set(0,.08,.95);actor.add(head);
  oval(0,0,0,.6,.52,.5,shell,head);
  for(const side of [-1,1]){
    oval(side*.47,.04,.12,.39,.49,.40,eyeMat,head,2);
    // Compound-eye glints follow the faceted red surface.
    for(let j=0;j<14;j++){
      const angle=j*2.4,ry=Math.sqrt((j+.5)/14)*.8;
      oval(side*(.55+.19*Math.sqrt(1-ry*ry)),Math.sin(angle)*ry*.4,.13+Math.cos(angle)*ry*.30,.026,.026,.026,mat(0xbf4c60,.35,.25),head,0);
    }
    const antenna=new T.Group();antenna.position.set(side*.22,.16,.36);head.add(antenna);
    bone([0,0,0],[side*.2,.14,.53],.022,legMat,antenna);bone([side*.2,.14,.53],[side*.42,.36,.7],.012,legMat,antenna);
    head.userData['antenna'+side]=antenna;
  }
  bone([0,-.25,.25],[0,-.5,.6],.06,darkShell,head);
  // Thorax bristles are short real 3D lines, not a flat texture.
  const bristles=[];
  for(let i=0;i<85;i++){
    const az=random()*Math.PI*2,el=random()*Math.PI*.65;
    const x=Math.cos(az)*Math.sin(el)*.64,y=Math.cos(el)*.65,z=Math.sin(az)*Math.sin(el)*.9;
    bristles.push(x,y,z,x*1.15,y+.12+random()*.1,z*1.12);
  }
  const hairGeo=new T.BufferGeometry();hairGeo.setAttribute('position',new T.Float32BufferAttribute(bristles,3));actor.add(new T.LineSegments(hairGeo,new T.LineBasicMaterial({color:0x354751})));
  const wingRoots=[];
  for(const side of [-1,1]){
    const pivot=new T.Group();pivot.position.set(side*.35,.48,-.28);actor.add(pivot);wingRoots.push(pivot);
    const outline=[[0,0],[.75,.14],[1.65,.75],[1.95,1.6],[1.75,2.4],[1.15,2.9],[.65,2.65],[.1,.55]];
    const shape=new T.Shape();outline.forEach((p,i)=>i?shape.lineTo(p[0]*side,p[1]):shape.moveTo(p[0]*side,p[1]));shape.closePath();
    const geo=new T.ShapeGeometry(shape);geo.rotateX(-Math.PI/2);
    mesh(geo,new T.MeshStandardMaterial({color:0xb6e0ec,side:T.DoubleSide,transparent:true,opacity:.35,roughness:.3,metalness:.1,depthWrite:false}),pivot);
    const veinColor=0x779da9;
    line(outline.concat([outline[0]]).map(p=>[p[0]*side,.008,-p[1]]),veinColor,pivot,.75);
    for(const end of [[1.65,.75],[1.95,1.6],[1.75,2.4],[1.15,2.9]])line([[0,.009,0],[side*.65,.009,-.9],[side*end[0],.009,-end[1]]],veinColor,pivot,.48);
    line([[side*.75,.012,-.14],[side*.65,.012,-.9],[side*.65,.012,-2.65]],veinColor,pivot,.5);
  }
  const legs=Array.from({length:6},()=>({bones:Array.from({length:3},(_,i)=>bone([0,0,0],[0,1,0],.048-i*.011,legMat,actor)),joints:Array.from({length:2},()=>oval(0,0,0,.078,.078,.078,jointMat,actor,1))}));
  // Screen overlay keeps controls usable without obscuring the subject.
  const chrome=document.createElement('div');chrome.id='stage-chrome';chrome.innerHTML=`
    <header class="stage-heading"><span class="stage-kicker">FLYBRAIN LAB / LOCAL SIMULATION</span><h1>BOLLYWOOD<span>FLY</span></h1><p>Six legs. A new dimension.</p></header>
    <nav class="stage-actions" aria-label="Scene controls"><button id="stage-settings">Dance controls</button><button id="stage-camera">Reset camera</button><button id="stage-pixel" aria-pressed="false">Retro pixels</button><button id="stage-2d">2D arena</button></nav>
    <section id="stage-telemetry"><div class="telemetry-label"><i></i> LIVE NEURAL ACTIVITY <span id="stage-brain-status">LOADING</span></div><div class="telemetry-numbers"><strong id="stage-fired">—</strong><span>NEURONS FIRING<br>LAST SIMULATION TICK</span></div><canvas id="stage-raster" width="360" height="44" aria-label="Recent activity from sampled neurons"></canvas><div class="telemetry-foot"><span id="stage-count">Loading connectome…</span><span>96 SAMPLED CELLS</span></div></section>
    <div class="stage-bottom"><span>DRAG TO ORBIT · SCROLL TO ZOOM</span><button id="stage-play">▶ Start dancing</button></div>`;document.body.appendChild(chrome);
  const raster=document.getElementById('stage-raster'),rc=raster.getContext('2d');rc.fillStyle='#091521';rc.fillRect(0,0,360,44);
  const $=id=>document.getElementById(id);
  const toggle=document.createElement('button');toggle.id='stage-return';toggle.textContent='3D studio';toggle.className='tool-btn';document.querySelector('.toolbar-left').appendChild(toggle);
  function view(on){active=on;document.body.classList.toggle('stage-3d',on);host.hidden=!on;chrome.hidden=!on;window.FlyStage.active=on;if(on)resize();}
  function reset(){camera.position.set(8.2,5.7,11.8);orbit.target.set(-.4,1.15,-.6);orbit.update();}
  function resize(){const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setPixelRatio(pixel?.75:Math.min(devicePixelRatio,1.75));renderer.setSize(w,h);}
  $('stage-settings').onclick=()=>document.body.classList.toggle('stage-controls-open');
  $('stage-camera').onclick=reset;
  $('stage-pixel').onclick=()=>{pixel=!pixel;$('stage-pixel').setAttribute('aria-pressed',String(pixel));host.classList.toggle('pixelated',pixel);resize();};
  $('stage-2d').onclick=()=>view(false);toggle.onclick=()=>view(true);
  $('stage-play').onclick=()=>$('dance-play').click();
  window.addEventListener('resize',resize);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();view(false);});
  renderer.domElement.addEventListener('webglcontextrestored',()=>view(true));
  const activityHistory=[];
  function updateScreens(now,state){
    const fired=BRAIN.workerFiredNeurons||0,total=BRAIN.workerNeuronCount||0,ready=!!BRAIN.workerReady;
    $('stage-fired').textContent=ready?fired.toLocaleString():'—';$('stage-count').textContent=ready?total.toLocaleString()+' NEURONS':'Loading connectome…';$('stage-brain-status').textContent=ready?'LIVE':'LOADING';
    $('stage-play').textContent=$('dance-play').textContent;
    activityHistory.push(ready?fired/Math.max(total,1):0);if(activityHistory.length>90)activityHistory.shift();
    rc.drawImage(raster,0,0,358,44,2,0,358,44);rc.fillStyle='#091521';rc.fillRect(0,0,2,44);
    const fire=BRAIN.latestFireState;
    if(fire&&fire.length){for(let i=0;i<96;i++){if(fire[Math.floor(i*(fire.length-1)/95)]>0){rc.fillStyle=i%3?'#6ce8dd':'#ef85b9';rc.fillRect(0,i/96*44,2,1);}}}
    dc.fillStyle='#050e1b';dc.fillRect(0,0,768,432);dc.fillStyle='#6ce8dd';dc.font='18px monospace';dc.fillText('FLYBRAIN / LIVE SIGNAL',30,37);dc.fillStyle='#66828f';dc.font='13px monospace';dc.fillText('FAFB v783    •    LOCAL CONNECTOME',30,63);
    dc.fillStyle='#e4f3f4';dc.font='bold 35px monospace';dc.fillText(ready?total.toLocaleString():'LOADING',30,119);dc.font='14px monospace';dc.fillStyle='#7897a9';dc.fillText('SIMULATED NEURONS',30,145);
    dc.fillStyle='#d579a9';dc.fillText(state.running&&state.mode==='dance'?'CHOREOGRAPHED DANCE':state.mode==='brain'?'BRAIN RESPONSE':'SIMULATION RUNNING',395,109);
    dc.fillStyle='#536d82';dc.fillText(state.pose?state.pose.name.toUpperCase():String(behavior.current).toUpperCase(),395,139);
    for(let i=0;i<5;i++){dc.strokeStyle='#17283b';dc.beginPath();dc.moveTo(30,190+i*30);dc.lineTo(737,190+i*30);dc.stroke();}
    dc.strokeStyle='#6ce8dd';dc.lineWidth=2;dc.beginPath();activityHistory.forEach((v,i)=>{const x=30+i*707/89,y=303-Math.min(1,v*12)*110;i?dc.lineTo(x,y):dc.moveTo(x,y);});dc.stroke();
    dc.fillStyle='#7897a9';dc.fillText('FIRING ACTIVITY / RECENT SAMPLES',30,333);
    dc.drawImage(raster,30,352,708,42);dc.fillStyle='#506d80';dc.font='12px monospace';dc.fillText('96 sampled cells • graphical sampling, not a full spike log',30,416);texture.needsUpdate=true;
  }
  function render(now){
    if(!active||document.hidden)return;
    const state=window.FlyDanceState?window.FlyDanceState():{running:false,mode:'dance',phase:0};
    state.behavior=behavior.current;
    const rig=FlyRig.sample(state,now/1000);
    actor.position.fromArray(rig.position);actor.rotation.set(...rig.rotation);
    if(!(state.running&&state.mode==='dance')){
      // Project the original arena position into a bounded stage area.
      actor.position.x=-1.8+Math.max(-1.2,Math.min(1.2,(fly.x/innerWidth-.5)*3));
      actor.position.z=.55+Math.max(-.8,Math.min(.8,(fly.y/innerHeight-.5)*2));
      actor.rotation.y=.45+(Math.PI/2-facingDir);
    }
    for(let i=0;i<6;i++){const points=rig.legs[i];for(let j=0;j<3;j++)setBone(legs[i].bones[j],points[j],points[j+1]);for(let j=0;j<2;j++)legs[i].joints[j].position.fromArray(points[j+1]);}
    wingRoots.forEach((w,i)=>{const side=i===0?-1:1;w.rotation.z=side*rig.wings;w.rotation.y=side*(.06+rig.wings*.3);});
    head.rotation.y=rig.antenna;ring.material.color.setHSL(.47, .8, .53+(state.running?(state.pulse||0)*.2:0));
    orbit.update();renderer.render(scene,camera);
    if(now-lastPanel>100){updateScreens(now,state);lastPanel=now;}
  }
  window.FlyStage={active:true,render,reset,view};
  const previousDraw=draw;
  draw=function(){if(active)render(performance.now());else previousDraw();};
  reset();view(true);resize();
})();
