import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import useCharacterStore from '../../store/characterStore';
import useInventoryStore from '../../store/inventoryStore';
import useAuthStore from '../../store/authStore';
import useConditionStore from '../../store/conditionStore';
import useGameStore from '../../store/gameStore';
import useQuestStore from '../../store/questStore';
import usePersistenceStatusStore from '../../store/persistenceStatusStore';
import { registerStore } from '../../store/storeRegistry';
import { useCharacterPersistence } from '../../hooks/useCharacterPersistence';
import { activatePrivateScope, resetBootstrapGateForTests } from '../bootstrapPrivacyGate';
import { resetHandoffCoordinatorForTests, whenHandoffIdle } from '../handoff/accountHandoffCoordinator';
import { captureConsumerContext } from '../scopedConsumer';
import { resetCharacterSaveOutcomeForTests, getCharacterCandidate, exportCharacterDraft, importCharacterDraft,
  preservePersonalConditionRecovery, getPersonalConditionRecovery, stageCharacterDraft, saveCharacterDraft } from '../characterSaveOutcome';
import { discardCharacterAutoSave } from '../../store/characterHelpers';
import * as firestore from 'firebase/firestore';

jest.mock('../../config/firebase', () => ({ db: {}, auth: { currentUser: { uid:'u-a' } },
  isFirebaseConfigured:true,isDemoMode:false,isMockOrDevUser:()=>false }));
jest.mock('firebase/auth', () => ({ onAuthStateChanged:()=>()=>{} }));
jest.mock('firebase/firestore', () => ({
  doc:(_db,...parts)=>parts.join('/'),collection:(_db,...parts)=>parts.join('/'),
  getDoc:jest.fn(async()=>({exists:()=>false})),getDocs:jest.fn(async()=>({forEach:()=>{}})),
  setDoc:jest.fn(async()=>{}),updateDoc:jest.fn(async()=>{}),addDoc:jest.fn(),
  query:()=>({}),where:()=>({}),orderBy:()=>({}),limit:()=>({}),deleteDoc:jest.fn(),
  serverTimestamp:()=> 'SERVER',onSnapshot:jest.fn(()=>()=>{}),runTransaction:jest.fn(),writeBatch:jest.fn()
}));
jest.mock('../../services/firebase/characterBackupService', () => ({ default:{autoBackup:async()=>true} }));
const raw = (id='unknown') => ({id,name:'Legacy manual',targetId:'unknown-token',targetType:'character',
  remainingRounds:0,endTime:1234567,privateUnknown:{text:'exact recovery bytes\u0000\u2603',nested:[0,false,null,{'original key':' unchanged '}]}});
const source = (id='unknown') => ({observedOwnerUid:'u-a',observedCharacterId:'c-a',records:[raw(id)]});
const settle = async()=>{for(let i=0;i<16;i++)await Promise.resolve();};
let hook;
function Mounted() { hook=useCharacterPersistence(); return <div>mounted selected runtime</div>; }
beforeEach(async()=>{
  cleanup();discardCharacterAutoSave();resetCharacterSaveOutcomeForTests();resetBootstrapGateForTests();resetHandoffCoordinatorForTests();
  localStorage.clear();sessionStorage.clear();jest.clearAllMocks();
  Object.defineProperty(navigator,'onLine',{configurable:true,value:true});
  for(const [name,store] of Object.entries({authStore:useAuthStore,characterStore:useCharacterStore,inventoryStore:useInventoryStore,
    conditionStore:useConditionStore,gameStore:useGameStore,questStore:useQuestStore}))registerStore(name,store);
  require('../../config/firebase').auth.currentUser={uid:'u-a'};
  useAuthStore.getState().setUser({uid:'u-a'});await whenHandoffIdle();activatePrivateScope({scopeKind:'user',scopeId:'u-a'});
  useCharacterStore.setState({characters:[{id:'c-a',name:'A'}],currentCharacterId:'c-a',
    health:{current:42,max:50},mana:{current:20,max:30},actionPoints:{current:2,max:3},roomActorRecoveryCandidates:[]});
  useGameStore.setState({isInMultiplayer:true,multiplayerRoom:{id:'unmatched'},personalConditionRecoveryCandidates:[]});
  useConditionStore.setState({activeBuffs:[],activeDebuffs:[]});usePersistenceStatusStore.setState({statuses:{}});
});
afterEach(()=>{cleanup();discardCharacterAutoSave();jest.restoreAllMocks();});

test('mounted collection preserves exact private bytes separately before runtime save; reload/export/import never execute them',async()=>{
  render(<Mounted/>);await act(settle);
  const local={id:'local',name:'Local',type:'debuff',targetId:'c-a',targetType:'character',durationType:'rounds',durationValue:2,remainingRounds:2};
  act(()=>useConditionStore.setState({activeDebuffs:[local,raw(),{id:'foreign',target:{roomId:'unmatched',kind:'character',ownerUid:'u-b',characterId:'c-b'}}]}));
  expect(getPersonalConditionRecovery('c-a')).toEqual([source()]);
  expect(getCharacterCandidate('c-a','runtime').payload.debuffs).toEqual([local]);
  const captured=getPersonalConditionRecovery('c-a');captured[0].records[0].privateUnknown.text='mutated';
  expect(getPersonalConditionRecovery('c-a')).toEqual([source()]);
  let result;await act(async()=>{result=await hook.forceSave();});expect(result.success).toBe(true);
  const cloud=firestore.setDoc.mock.calls.find(([key])=>key==='users/u-a/characterStates/c-a')[1];
  expect(cloud.debuffs).toEqual([local]);expect(cloud.conditionRecovery).toBeUndefined();expect(JSON.stringify(cloud)).not.toContain('privateUnknown');
  cleanup();resetCharacterSaveOutcomeForTests();useGameStore.setState({personalConditionRecoveryCandidates:[]});
  useConditionStore.setState({activeBuffs:[],activeDebuffs:[]});
  const exported=JSON.parse(exportCharacterDraft('c-a'));expect(exported.conditionRecovery).toEqual([source()]);
  // Real page.reload is covered by verification/p7/condition-recovery-browser.cjs.
  render(<Mounted/>);await act(settle);
  const file=JSON.parse(exportCharacterDraft('c-a'));file.canonical=null;file.runtime=null;
  await act(async()=>hook.importSelectedDraft(JSON.stringify(file)));
  expect(useConditionStore.getState().activeDebuffs).not.toContainEqual(raw());
  expect(getPersonalConditionRecovery('c-a')).toEqual([source()]);
});

test('scoped storage refusal keeps prior device bytes and latest raw memory/export; runtime refuses then heals without a new edit',async()=>{
  preservePersonalConditionRecovery('c-a',[source('first')]);
  const key=Object.keys(localStorage).find(key=>key.includes('conditionRecovery'));const before=localStorage.getItem(key);
  render(<Mounted/>);await act(settle);
  const original=Storage.prototype.setItem;
  const refusal=jest.spyOn(Storage.prototype,'setItem').mockImplementation(function(key,value){
    if(String(key).includes('conditionRecovery'))throw new DOMException('quota','QuotaExceededError');
    return original.call(this,key,value);
  });
  act(()=>useConditionStore.setState({activeDebuffs:[raw('second')]}));
  expect(getCharacterCandidate('c-a','conditionRecovery')).toMatchObject({status:'error',retention:'memory'});
  expect(localStorage.getItem(key)).toBe(before);
  const writes=firestore.setDoc.mock.calls.length;
  let result;await act(async()=>{result=await hook.forceSave();});
  expect(result).toMatchObject({success:false,reason:'condition-recovery-retention-failed'});
  expect(firestore.setDoc.mock.calls).toHaveLength(writes);
  expect(getCharacterCandidate('c-a','runtime')).toMatchObject({status:'error',message:expect.stringContaining('memory only')});
  expect(JSON.parse(exportCharacterDraft('c-a')).conditionRecovery).toEqual([source('first'),source('second')]);
  refusal.mockRestore();await act(async()=>{result=await hook.forceSave();});expect(result.success).toBe(true);
  expect(getCharacterCandidate('c-a','conditionRecovery').retention).toBe('device');
  resetCharacterSaveOutcomeForTests();expect(getPersonalConditionRecovery('c-a')).toEqual([source('first'),source('second')]);
});

test('owner/character and account-generation fences refuse foreign recovery adoption and late-origin writes',async()=>{
  const origin=captureConsumerContext().context;preservePersonalConditionRecovery('c-a',[source()]);
  const original=exportCharacterDraft('c-a');
  expect(getPersonalConditionRecovery('c-b')).toEqual([]);expect(()=>importCharacterDraft(original,'c-b')).toThrow();
  for(const [field,value] of [['observedOwnerUid','u-b'],['observedCharacterId','c-b']]){
    const file=JSON.parse(original);file.conditionRecovery[0][field]=value;
    expect(()=>importCharacterDraft(JSON.stringify(file),'c-a')).toThrow('recovery owner or character');
    expect(exportCharacterDraft('c-a')).toBe(original);
  }
  useAuthStore.getState().setUser({uid:'u-b'});await whenHandoffIdle();activatePrivateScope({scopeKind:'user',scopeId:'u-b'});
  expect(getPersonalConditionRecovery('c-a')).toEqual([]);expect(()=>importCharacterDraft(original,'c-a')).toThrow();
  expect(preservePersonalConditionRecovery('c-a',[source('late')],origin)).toBeNull();
  useAuthStore.getState().setUser({uid:'u-a'});await whenHandoffIdle();activatePrivateScope({scopeKind:'user',scopeId:'u-a'});
  expect(preservePersonalConditionRecovery('c-a',[source('late')],origin)).toBeNull();
  expect(getPersonalConditionRecovery('c-a')).toEqual([source()]);
});

test('recovery-only imports union exact sources idempotently without replacing pending executable drafts',()=>{
  stageCharacterDraft('c-a','runtime',{health:{current:7,max:50}});
  const file={format:'mythrill-character-draft',version:1,owner:{scopeKind:'user',scopeId:'u-a'},characterId:'c-a',
    conditionRecovery:[source()],canonical:null,runtime:null};
  // Recovery-only files do not compete with executable lanes.
  importCharacterDraft(JSON.stringify(file),'c-a');
  file.conditionRecovery=[source('second')];importCharacterDraft(JSON.stringify(file),'c-a');importCharacterDraft(JSON.stringify(file),'c-a');
  expect(getPersonalConditionRecovery('c-a')).toEqual([source(),source('second')]);
  expect(getCharacterCandidate('c-a','runtime').payload.health.current).toBe(7);
});

test('an old cloud ACK cannot label newly refused private recovery as saved',async()=>{
  const runtime=stageCharacterDraft('c-a','runtime',{health:{current:7,max:50}});
  let finish;const saving=saveCharacterDraft(runtime,()=>new Promise(resolve=>{finish=resolve;}));
  const refusal=jest.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new DOMException('quota','QuotaExceededError');});
  preservePersonalConditionRecovery('c-a',[source()]);finish({success:true});
  expect(await saving).toEqual({success:false,reason:'condition-recovery-retention-failed',runtimeCloudConfirmed:true});
  expect(runtime.status).toBe('error');expect(JSON.parse(exportCharacterDraft('c-a')).conditionRecovery).toEqual([source()]);
  refusal.mockRestore();
});

test('recovery capacity and serialization refusal never overwrite prior device source or lose retained memory',()=>{
  preservePersonalConditionRecovery('c-a',[source()]);const key=Object.keys(localStorage).find(key=>key.includes('conditionRecovery'));
  const before=localStorage.getItem(key);
  const overflow=Array.from({length:8},(_,i)=>source('extra-'+i));preservePersonalConditionRecovery('c-a',overflow);
  expect(getCharacterCandidate('c-a','conditionRecovery')).toMatchObject({retention:'memory',status:'error'});
  expect(localStorage.getItem(key)).toBe(before);expect(JSON.parse(exportCharacterDraft('c-a')).conditionRecovery).toHaveLength(9);
  const bad=source('bad');bad.records[0].privateUnknown.bad=1n;
  preservePersonalConditionRecovery('c-b',[{...bad,observedCharacterId:'c-b'}]);
  expect(getCharacterCandidate('c-b','conditionRecovery').retention).toBe('memory');
  expect(()=>exportCharacterDraft('c-b')).toThrow();expect(getPersonalConditionRecovery('c-b')[0].records[0].privateUnknown.bad).toBe(1n);
});
