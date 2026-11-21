import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { assess, canSubmit, createSession, readSession, summarize, validateSession } from '../quiz.mjs';
const rounds=JSON.parse(await readFile(new URL('../content/rounds.json',import.meta.url),'utf8'));

test('each round has four unique local assets and complete provenance',async()=>{
  assert.equal(rounds.length,8);
  const products=rounds.flatMap(r=>r.products);
  assert.equal(new Set(products.map(p=>p.id)).size,32);
  assert.equal(products.filter(p=>p.real).length,8);
  for(const r of rounds){assert.equal(r.products.length,4);assert.ok(r.products.filter(p=>p.real).length<=2);}
  for(const p of products){assert.ok((await stat(new URL('../'+p.image,import.meta.url))).size>1000);if(p.real){assert.match(p.sourceUrl,/^https:\/\//);assert.match(p.evidenceUrl,/^https:\/\//);}else{assert.ok(p.creationTool);}}
});
test('a round with no documented products accepts none as exact',()=>{
  const r=rounds.find(r=>r.products.every(p=>!p.real));
  assert.equal(assess(r,{mode:'none',selected:[],confidence:2}).exact,true);
  assert.equal(assess(r,{mode:'items',selected:[r.products[0].id],confidence:2}).falseSelections.length,1);
});
test('multiple real products must both be selected for an exact answer',()=>{
  const r=rounds.find(r=>r.products.filter(p=>p.real).length===2);
  const ids=r.products.filter(p=>p.real).map(p=>p.id);
  assert.equal(assess(r,{mode:'items',selected:ids,confidence:1}).exact,true);
  assert.equal(assess(r,{mode:'items',selected:ids.slice(0,1),confidence:1}).exact,false);
});
test('uncertainty is distinct from rejecting all real products',()=>{
  const answer={mode:'unsure',selected:[],confidence:null};
  assert.equal(canSubmit(answer),true);
  assert.equal(assess(rounds[0],answer).exact,false);
  const s=summarize(rounds,[answer]);
  assert.equal(s.unsureRounds,1);assert.equal(s.realRejected,0);assert.equal(s.exactRounds,0);
});
test('an explicit choice can be submitted immediately',()=>{
  assert.equal(canSubmit({mode:'items',selected:[]}),false);
  assert.equal(canSubmit({mode:'none',selected:[]}),true);
  assert.equal(canSubmit({mode:'items',selected:[rounds[0].products[0].id]}),true);
});
test('counts selected concepts and rejected real products',()=>{
  const r=rounds[0];const fake=r.products.filter(p=>!p.real).map(p=>p.id);
  const summary=summarize([r],[{mode:'items',selected:fake,confidence:2}]);
  assert.equal(summary.conceptsSelected,3);assert.equal(summary.realRejected,1);
});
test('restores valid ordering and rejects corrupt, stale or inconsistent saves',()=>{
  const s=createSession(rounds,()=>0.4);assert.equal(validateSession(s,rounds),true);
  assert.deepEqual(readSession({getItem:()=>JSON.stringify(s)},rounds),s);
  const legacy={...s,draft:{...s.draft,confidence:2}};
  assert.deepEqual(readSession({getItem:()=>JSON.stringify(legacy)},rounds),s);
  for(const corrupt of [null,{}, {...s,version:0},{...s,roundIndex:99},{...s,view:'results'},{...s,orders:[]},{...s,answers:[{mode:'items',selected:['unknown'],confidence:2}]}]) assert.equal(validateSession(corrupt,rounds),false);
  assert.equal(readSession({getItem:()=>'{broken'},rounds),null);
  assert.equal(readSession({getItem:()=>{throw new Error('blocked')}},rounds),null);
});
