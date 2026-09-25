/* Renderer-independent articulated fly poses; units are scene units. */
(function(root){
  'use strict';
  function sample(state,time){
    const dance=!!(state.running&&state.mode==='dance'&&state.pose);
    const p=dance?state.pose:null, phase=state.phase||0;
    const moving=!dance&&['walk','explore','phototaxis','startle'].includes(state.behavior);
    const gait=dance?phase*Math.PI*2:time*(moving?8:1);
    const bounce=dance?Math.abs(Math.sin(phase*Math.PI))*.12:Math.sin(time*2)*.025;
    const height=1.6+bounce;
    const legs=[];
    for(let i=0;i<6;i++){
      const pair=Math.floor(i/2),side=i%2===0?-1:1;
      const stride=(dance||moving)?Math.sin(gait+(i%2?Math.PI:0)+pair*.7):0;
      const entry=p&&p.legs?p.legs[i]:null;
      const raised=dance&&pair===0;
      const footY=raised?.15+(entry?Math.max(0,-entry.hip)*.48:0):-height+.055+Math.max(0,stride)*.16;
      const z=[.65,0,-.8][pair];
      const xSpread=raised?1.05+(entry?Math.sin(entry.knee)*.2:0):[1.35,1.85,1.65][pair];
      const targetZ=[1.55,.25,-1.8][pair]+stride*.3;
      legs.push([
        [side*.42,-.22,z],
        [side*(raised?.85:1.02),raised?.25:-.55,z+(pair===0?.42:pair===2?-.3:.05)],
        [side*xSpread,footY+.12,targetZ],
        [side*(xSpread+.2),footY,targetZ+.2]
      ]);
    }
    return {
      position:[-1.8+(p?p.x*.012:0),height+(p?Math.max(0,-p.y)*.006:0),.55+(p?p.y*.006:0)],
      rotation:[dance?Math.sin(gait)*.035:0,.45+(p?p.turn:0),dance?Math.sin(gait/2)*.075:0],
      wings:dance?.15+(p.wings||0)*.55:.1+Math.sin(time*3)*.025,
      antenna:Math.sin(time*5)*.055,legs
    };
  }
  if(typeof module!=='undefined'&&module.exports)module.exports={sample};else root.FlyRig={sample};
})(typeof window!=='undefined'?window:globalThis);
