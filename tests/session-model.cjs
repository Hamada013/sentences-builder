const assert=require('node:assert/strict');
const M=require('../assets/session-model.js');
const s={key:'s:2/1/1',title:'ولد يأكل',presentation:'advanced',imgPath:'img.webp',soundPath:'audio.m4a',slots:[{categoryId:'01 subject',id:1},{categoryId:'02 verbs',id:2}],slotContexts:[{title:'ولد',segments:[{path:'a.m4a'}]},{title:'يأكل',segments:[{path:'b.m4a'}]}]};
const stages=M.stages([s,{...s,key:'s:2/1/2'}]);
// Repetition → comprehension → failed sentences repeated → games box → the chosen games.
assert.deepEqual(stages.map(stage=>stage.id),['repetition','receptive-advanced','receptive-slots','review','choose','missing','expressive-advanced','expressive-slots']);
assert.ok(stages.filter(stage=>stage.id!=='choose').every(stage=>stage.indices.length===2));assert.equal(stages[0].repeats,5);
assert.deepEqual(M.stages([{...s,imgPath:null}]).map(stage=>stage.id),['repetition','receptive-slots','review','choose','missing','expressive-slots']);
// The box picks the games; stages before it keep their positions.
const two=[s,{...s,key:'s:2/1/2'}];
assert.deepEqual(M.stages(two,['expressive']).map(stage=>stage.id),['repetition','receptive-advanced','receptive-slots','review','choose','expressive-advanced','expressive-slots']);
assert.deepEqual(M.stages(two,['missing']).map(stage=>stage.id).slice(-1),['missing']);
assert.deepEqual(M.stages(two,[]).map(stage=>stage.id),['repetition','receptive-advanced','receptive-slots','review','choose']);
const targets=M.targets(s);assert.equal(targets.length,3);assert.equal(targets[0].entity,'sentence');assert.equal(targets[2].key,'w:02 verbs/2');
assert.equal(M.targets({...s,presentation:'slots'}).length,2);
assert.equal(M.record(s,'receptive','slots',false).correct,0);
assert.deepEqual(M.record(s,'expressive','advanced',1,2),{key:s.key,title:s.title,entity:'sentence',domain:'expressive',presentation:'advanced',correct:1,total:2});
console.log('PASS: exact worked-sentence plan: repetition, comprehension, review of failed sentences, games box, chosen games; independent word targets.');
