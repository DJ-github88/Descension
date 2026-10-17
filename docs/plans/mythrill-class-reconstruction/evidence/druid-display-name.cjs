/* Planning display policy only. Never translate class/spell/resource IDs. */
const boundary='DESIGN INTENT — player-facing name Druid is approved; Metamorph is rejected. Bodily transformation/adaptation remains core. Anatomy, specializations and native assignments are PROPOSED under HeadQ review. No conventional Druid mechanics, worship, companion requirement or heritage inheritance is imported. Preserve Shaper IDs/compatibility until explicit migration approval.';
const publicProse=text=>typeof text==='string'?text.replace(/\bMetamorph\b(?! is rejected)/g,'Druid'):text;
function labelProfiles(profiles){
 for(const profile of Object.values(profiles))for(const key of ['pitch','decisions','role','noncombat','acquisition','institution','wizard','hud','overlap','migration'])if(profile[key])profile[key]=publicProse(profile[key]);
 profiles.metamorph.name='Druid';
 profiles.metamorph.institution=profiles.metamorph.institution.replace('Shapeshifter remains a familiar naming alternative; investigate Monk/Bladedancer separately.','Druid is the approved player-facing name only; investigate Monk/Bladedancer separately.');
 profiles.metamorph.migration='Druid is approved as the player-facing name only. Preserve all56 Shaper spells, six forms, Flux0–20/Body Toll0–10, old talent IDs, saves and art paths. No application ID, ruleset, resource or character migration is approved. Existing R1 metamorph/metamorph-body/cr1_metamorph_* handles are provisional internal proposal keys, not player-facing names or selected final IDs. Any later anatomical conversion requires a separately approved preview/reselection; it is not a numerical conversion or permission to import conventional Druid rules.';
}
module.exports={boundary,publicProse,labelProfiles};
