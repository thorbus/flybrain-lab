const test = require('node:test');
const assert = require('node:assert/strict');
const {sample} = require('../js/fly-rig.js');
const routines = require('../js/dance-routines.js');

test('both routines produce six finite articulated legs over two complete cycles', () => {
  for (const routine of Object.values(routines)) {
    for (let beat=0;beat<64;beat+=.125) {
      const pose=sample({running:true,mode:'dance',phase:beat,pose:routine(beat)},beat/2);
      assert.equal(pose.legs.length,6);
      for(const leg of pose.legs) {
        assert.equal(leg.length,4);
        for(const point of leg) for(const value of point) assert(Number.isFinite(value));
        for(let j=1;j<4;j++) {
          const length=Math.hypot(...leg[j].map((v,k)=>v-leg[j-1][k]));
          assert(length>.05&&length<3,'No collapsed or explosive limb segments');
        }
      }
      for(const value of [...pose.position,...pose.rotation,pose.wings])assert(Number.isFinite(value));
    }
  }
});

test('brain-response and stopped modes ignore choreographed poses', () => {
  const baseline=sample({running:false,mode:'dance',behavior:'idle'},1);
  const injected={phase:16,pose:routines.bollywood(16),behavior:'idle'};
  assert.deepEqual(sample({...injected,running:false,mode:'dance'},1),baseline);
  assert.deepEqual(sample({...injected,running:true,mode:'brain'},1),baseline);
});

test('idle feet rest at table height and dance lifts front legs', () => {
  const idle=sample({running:false,mode:'dance',behavior:'idle'},0);
  idle.legs.forEach(leg=>assert(Math.abs(idle.position[1]+leg[3][1]-.055)<1e-9));
  const dance=sample({running:true,mode:'dance',phase:18,pose:routines.bollywood(18)},9);
  for(let i=0;i<2;i++)assert(dance.legs[i][3][1]+dance.position[1]>1.6);
});
