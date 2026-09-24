/* Independent choreography presets. Beat positions are measured in quarter notes. */
(function(root) {
  'use strict';
  const TAU=Math.PI*2;
  function bollywood(beat, energy=1) {
    const b=((beat%32)+32)%32, section=Math.floor(b/8), t=b%8;
    const wave=Math.sin(beat*Math.PI), bounce=Math.abs(Math.sin(beat*Math.PI));
    const names=['Shoulder bounce','Side-step & wave','Arms up','Turn & pose'];
    const legs=Array.from({length:6},(_,i)=>{
      const pair=Math.floor(i/2), side=i%2===0?-1:1;
      let hip=[-.5,.1,.65][pair], knee=[-.65,.45,.55][pair];
      if(pair===0) {
        hip=-.85+.35*Math.sin(beat*TAU+side*.6);
        knee=-.7+.4*Math.sin(beat*Math.PI+side);
        if(section===1){hip=-.4+side*.55*wave;knee=-.8+.4*wave;}
        if(section===2){hip=-1.35+.2*wave;knee=-.45+.2*Math.cos(beat*TAU);}
        if(section===3){hip=t<4?-.5:-1.2;knee=t<4?-.7:-.4;}
      } else {
        hip+=Math.sin(beat*TAU+(i%2)*Math.PI)*.32;
        knee+=bounce*.18;
      }
      return {hip:hip*energy,knee:knee*energy,tarsus:.3+.3*wave*energy};
    });
    return {
      name:names[section], legs,
      x:(section===1?Math.sin(t*Math.PI/2)*75:Math.sin(beat*Math.PI/4)*28)*energy,
      y:((section===2?-bounce*27:-bounce*12)+(section===3&&t<4?Math.sin(t*Math.PI/2)*25:0))*energy,
      turn:(section===3?Math.min(t/4,1)*TAU:wave*(section===0?.25:.12))*energy,
      wings:(.16+bounce*.25)*energy,
      scale:1.9+bounce*.08*energy,
      phase:beat*TAU
    };
  }
  function disco(beat, energy=1) {
    const a=beat*Math.PI;
    return {name:'Disco groove',legs:null,x:Math.sin(a/2)*65*energy,y:Math.cos(a)*18*energy,
      turn:Math.sin(a)*.4*energy+(Math.floor(beat/8)%2===1?(beat%8)/8*TAU:0),
      wings:.12+Math.abs(Math.sin(a))*.42*energy,scale:1.8,phase:a*2};
  }
  const routines={bollywood,disco};
  if(typeof module!=='undefined'&&module.exports)module.exports=routines;
  else root.FlyDanceRoutines=routines;
})(typeof window!=='undefined'?window:globalThis);
