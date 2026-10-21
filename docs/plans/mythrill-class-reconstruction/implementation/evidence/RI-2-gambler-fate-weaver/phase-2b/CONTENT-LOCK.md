# Fate Weaver Phase 2B Content Lock

Status: authored before application records. Manual tabletop only; no automatic execution.

Identity rules: all new Fate Weaver records and nodes use `cr1_fate_weaver_*`. Legacy `gambit_*`, `gambler_*`, `fate_weaver_*`, `augur_*` and `talent-spell-*` IDs are never reused. Every record carries `authoredOnly: true`, `executionEnabled: false`, `applicationMode: 'manual-tabletop'`, an empty `automatedCapabilities` array and the manual notice.

## Core and progression

- Core grants: `cr1_fate_weaver_tie_thread` (Tie the Thread, level 1, 1 AP, `link.tie`) and `cr1_fate_weaver_cut_clean` (Cut Clean, level 1, 1 AP, `link.cut`).
- Starting picks: one level-1 optional. Four optional records exist at every level 1-10; exactly one optional pick per level from that level or an earlier unchosen pool. Talent actives never consume optional picks.
- Talent budget: 5 points per level, character cap 50. Signature requires 10 same-tree points and level 3. Capstone requires 45 same-tree points and level 10. Every predecessor fully ranked; points must be in the same tree.
- Tree capacity: 18 nodes per tree, 50 ranks per tree, 150 total rank capacity. Each tree has 16 three-rank passives, one signature and one capstone.
- Resource: exactly three thread tokens in `free`, `reserved` or `recovering`; at most three active links; one reserved token per link; no second bank, debt pool or fourth tree. A link ends by expiry, consent withdrawal, range loss or severance. Expired links release their token to `recovering`; a completed long rest returns all `recovering` tokens to `free`.
- Link invariants: distinct actor endpoints, recorded consent, 60 ft maximum formation range, one consequence per link per round, original-assigned-damage only, transfer amount at most 3, one to two uses, no recursion, no derived-damage transfer and no transfer of another link's consequence.

## Optional spells (40)

| ID | Name | Lvl | AP | Cost / target | Exact manual effect |
|---|---|---:|---:|---|---|
| `cr1_fate_weaver_trace_the_line` | Trace the Line | 1 | 1 | self, 30 ft | Inspect one visible link or covenant in range. Learn its endpoints and declared public purpose, not hidden thoughts or private clauses. |
| `cr1_fate_weaver_steady_the_hand` | Steady the Hand | 1 | 1 | one ally, 30 ft | +2 to that ally's next otherwise legal check or save before the start of your next turn. One use. |
| `cr1_fate_weaver_borrowed_step` | Borrowed Step | 1 | 1 | one willing ally, 30 ft | Move up to 10 ft using remaining legal movement; ordinary consequences and no reaction immunity. |
| `cr1_fate_weaver_fraying_lash` | Fraying Lash | 1 | 2 | one enemy, 30 ft | 1d6 wyrd and -1 to the target's next save before your next turn. One damage event. |
| `cr1_fate_weaver_read_bond` | Read the Bond | 2 | 2 | self, 30 ft | Inspect one visible bond: public purpose, consent state, remaining uses and expiry. No private memory, hidden clause or future certainty. |
| `cr1_fate_weaver_shared_burden` | Shared Burden | 2 | 1 | one linked ally, 30 ft | When that ally takes original assigned damage before your next turn, redirect up to 2 of it to you after normal mitigation. One use. |
| `cr1_fate_weaver_thread_sense` | Thread Sense | 2 | 1 | self, 30 ft | Detect the presence and direction of links and covenants in range; no identities beyond observable endpoints, no thoughts. |
| `cr1_fate_weaver_guiding_pull` | Guiding Pull | 2 | 1 | one linked willing ally, 30 ft | Move up to 10 ft along a legal path using remaining movement; cannot pull through obstacles or into harm. |
| `cr1_fate_weaver_fray_the_edge` | Fray the Edge | 3 | 1 | one linked enemy, 30 ft | -2 to the target's next save before your next turn; one use and no condition unless the table applies one separately. |
| `cr1_fate_weaver_anchored_step` | Anchored Step | 3 | 1 | one ally, 30 ft | +10 ft to that ally's remaining movement this turn; no extra action, disengage or teleport. |
| `cr1_fate_weaver_covenant_of_silence` | Covenant of Silence | 3 | 2 | one ally, 30 ft | +2 to one Stealth check and one Deception check made within 10 minutes; each check declared separately. |
| `cr1_fate_weaver_witness_echo` | Witness Echo | 3 | 1 | self | Replay one observable visual or audible event you witnessed within the last minute. Does not recover hidden information or create evidence. |
| `cr1_fate_weaver_cut_and_run` | Cut and Run | 4 | 1 | self | End one link you created; move up to 15 ft using remaining legal movement. No extra severance effect. |
| `cr1_fate_weaver_twin_threads` | Twin Threads | 4 | 2 | two willing allies, 30 ft | Create two links, one token each. Both require consent and count against the three-link cap. |
| `cr1_fate_weaver_soothing_weave` | Soothing Weave | 4 | 1 | one linked ally, 30 ft | Reduce the next original damage that ally takes before your next turn by 3; one use. Not healing or temporary HP. |
| `cr1_fate_weaver_read_the_room` | Read the Room | 4 | 1 | self, 30 ft | +3 to one Investigation or Insight check about observable links, obligations or conduct in range; declared before rolling. |
| `cr1_fate_weaver_bind_the_blow` | Bind the Blow | 5 | 2 | one linked ally, 30 ft | A capacity-4, one-use damage ward until your next turn starts. Applies after normal mitigation and before Fate routing or temporary HP. |
| `cr1_fate_weaver_redirect_fate` | Redirect Fate | 5 | 2 | one linked ally, 30 ft | Transfer up to 3 original assigned damage from that ally to you after mitigation; one use and no recursive transfer. |
| `cr1_fate_weaver_thread_of_haste` | Thread of Haste | 5 | 1 | one ally, 30 ft | +15 ft to remaining legal movement this turn; no extra action and no ignoring obstacles. |
| `cr1_fate_weaver_quiet_covenant` | Quiet Covenant | 5 | 1 | one ally, 30 ft | +2 to one Stealth check and one Sleight of Hand check within 10 minutes; each check declared separately. |
| `cr1_fate_weaver_severing_word` | Severing Word | 6 | 2 | one linked enemy, 30 ft | End the link and impose -2 on the target's next save before your next turn. No damage by itself. |
| `cr1_fate_weaver_woven_guard` | Woven Guard | 6 | 2 | one ally, 30 ft | Damage reduction 2 against the next two original damage events before your next turn; separate events, no pooling. |
| `cr1_fate_weaver_distant_thread` | Distant Thread | 6 | 1 | self | The next link you create this turn may form at 60 ft beyond its normal range, to a maximum of 90 ft; still requires consent and a slot. |
| `cr1_fate_weaver_borrowed_eyes` | Borrowed Eyes | 6 | 1 | one linked willing ally, 60 ft | Share that ally's visual perspective for 1 minute; no telepathy, memory access or hidden information. |
| `cr1_fate_weaver_covenant_of_steel` | Covenant of Steel | 7 | 2 | one ally, 30 ft | Reduce the next two original damage events by 3 each before your next turn; no stacking with itself. |
| `cr1_fate_weaver_cut_the_current` | Cut the Current | 7 | 2 | one linked enemy, 30 ft | End the link and deal 2d6 wyrd; one damage event. No transfer or secondary effect. |
| `cr1_fate_weaver_tapestry_step` | Tapestry Step | 7 | 1 | self | Move up to 20 ft along a visible legal path using remaining movement; no teleport, phasing or opportunity immunity. |
| `cr1_fate_weaver_fate_read` | Fate Read | 7 | 2 | self | Ask one bounded question about the likely immediate consequence of a declared action; GM answers from observable evidence. No certainty or hidden plans. |
| `cr1_fate_weaver_threefold_knot` | Threefold Knot | 8 | 2 | three willing allies, 30 ft | Create three links, one token each, up to the three-link cap. Each link remains separately severable. |
| `cr1_fate_weaver_sever_the_anchor` | Sever the Anchor | 8 | 2 | one linked enemy, 30 ft | End the link and impose -3 on the target's next save before your next turn; no damage by itself. |
| `cr1_fate_weaver_shared_fate` | Shared Fate | 8 | 2 | one linked ally, 30 ft | The next time either endpoint takes original assigned damage before your next turn, the other may take up to 2 of it after mitigation. One use total. |
| `cr1_fate_weaver_woven_sight` | Woven Sight | 8 | 2 | self, 60 ft | +3 to one Perception check to notice visible links, wards or deliberate concealment; declared before rolling. |
| `cr1_fate_weaver_grand_covenant` | Grand Covenant | 9 | 3 | two willing allies, 30 ft | Each gains a capacity-6, one-use damage ward until your next turn starts; separate wards, no shared pool. |
| `cr1_fate_weaver_sever_all` | Sever All | 9 | 3 | self, 30 ft | End any number of links you created; each affected enemy takes 1d4 wyrd, one damage event per enemy. No token refund beyond normal recovery. |
| `cr1_fate_weaver_tapestry_ward` | Tapestry Ward | 9 | 2 | one ally, 30 ft | Capacity-6, one-use damage ward until your next turn starts; applies after normal mitigation. |
| `cr1_fate_weaver_fate_audit` | Fate Audit | 9 | 2 | self, 60 ft | Inspect every visible link in range and learn endpoints, consent state and public purpose. No hidden clauses or private intentions. |
| `cr1_fate_weaver_final_weave` | Final Weave | 10 | 3 | three willing allies, 30 ft | Each gains a capacity-6, one-use ward and may move 10 ft using remaining movement. Separate wards; no shared damage pool. |
| `cr1_fate_weaver_cut_the_last_thread` | Cut the Last Thread | 10 | 3 | one linked enemy, 30 ft | End the link and deal 3d8 wyrd; one damage event. No execution, recursion or extra severance. |
| `cr1_fate_weaver_eternal_tapestry` | Eternal Tapestry | 10 | 3 | self | Return all `recovering` thread tokens to `free` immediately. Once per completed long rest. |
| `cr1_fate_weaver_read_the_whole` | Read the Whole | 10 | 2 | self, 120 ft | Reveal the visible link map in range, including endpoints and public purposes. No hidden links, thoughts or future outcomes. |

## Talent actives (6)

| ID | Name | Tree | Lvl | AP | Effect |
|---|---|---|---:|---:|---|
| `cr1_fate_weaver_witnessed_covenant` | Witnessed Covenant | covenant | 3 | 2 | Signature `link.covenant`: create one covenant link with a declared reciprocal obligation, one token, at most two uses and expiry at the end of the second subsequent turn. Both actors must consent; a broken obligation ends the link and returns its token to `recovering`. |
| `cr1_fate_weaver_sever_borrowed_crown` | Sever the Borrowed Crown | 3 | 2 | severance | Signature `link.sever`: end one link and suppress one declared benefit or condition sourced from that link until the end of the target's next turn. No damage and no transfer. |
| `cr1_fate_weaver_reanchor_tapestry` | Reanchor the Tapestry | 3 | 1 | tapestry | Signature `link.reanchor`: move one existing link's endpoint to a willing actor within 30 ft, preserving source, token, uses and absolute expiry. No renewal, extra use or new consent bypass. |
| `cr1_fate_weaver_threefold_compact` | Threefold Compact | 10 | 2 | covenant | Capstone `link.threefold`: create up to three covenant links, one token each, with one shared declared obligation. Each link remains separately severable; no shared damage pool and no fourth link. Once per completed long rest. |
| `cr1_fate_weaver_sever_throughline` | Sever the Throughline | 10 | 2 | severance | Capstone `link.sever-sustained`: end one link and suppress its source benefit for up to two rounds, then the link closes normally. No damage, recursion or permanent removal. Once per completed long rest. |
| `cr1_fate_weaver_grand_relay` | The Grand Relay | 10 | 2 | tapestry | Capstone `link.relay`: reanchor up to two links you created to willing actors within 30 ft, preserving each source, token, uses and expiry. No new links, renewal or extra tokens. Once per completed long rest. |

## Ranked passives (48)

Each passive has exactly three ranks. Absolute rank values are authored below; only the highest learned rank applies.

### Covenant Weaver (tree `covenant`)

| ID | Name | Ranks | Effect |
|---|---|---:|---|
| `cr1_fate_weaver_cv_patient_thread` | Patient Thread | 5 / 10 / 15 | +{v} ft to the formation range of links you create. |
| `cr1_fate_weaver_cv_steady_knot` | Steady Knot | 1 / 2 / 3 | +{v} to the DC or check to sever your links; does not prevent voluntary release. |
| `cr1_fate_weaver_cv_gentle_pull` | Gentle Pull | 5 / 10 / 15 | +{v} ft to the movement granted by Guiding Pull. |
| `cr1_fate_weaver_cv_covenant_ward` | Covenant Ward | 1 / 2 / 3 | +{v} capacity to one-use link wards you create; never exceeds the authored ward maximum by more than 3. |
| `cr1_fate_weaver_cv_echoed_oath` | Echoed Oath | 1 / 2 / 3 | +{v} total use to one covenant link you create; no reset and no extra slot. |
| `cr1_fate_weaver_cv_clear_signal` | Clear Signal | 1 / 2 / 3 | +{v} to one check to identify or read a visible link; no hidden information. |
| `cr1_fate_weaver_cv_shared_courage` | Shared Courage | 1 / 2 / 3 | +{v} to one save against fear for a linked ally; declared before rolling. |
| `cr1_fate_weaver_cv_woven_resilience` | Woven Resilience | 1 / 2 / 3 | Reduce one original damage event against a linked ally by {v}; once per link per round. |
| `cr1_fate_weaver_cv_deepening_bond` | Deepening Bond | 1 / 2 / 3 | +{v} ft to the range at which you can maintain an existing link. |
| `cr1_fate_weaver_cv_quiet_resolve` | Quiet Resolve | 1 / 2 / 3 | +{v} to one Concentration or composure check while maintaining a link. |
| `cr1_fate_weaver_cv_twin_anchors` | Twin Anchors | 1 / 2 / 3 | The first time each round a link would end from range, extend it by {v} ft instead; one save-like reprieve. |
| `cr1_fate_weaver_cv_sheltering_weave` | Sheltering Weave | 1 / 2 / 3 | +{v} capacity to a single covenant ward; does not stack with Covenant Ward beyond the larger value. |
| `cr1_fate_weaver_cv_covenant_memory` | Covenant Memory | 1 / 2 / 3 | Recall the public terms of up to {v} links you created; no hidden clauses. |
| `cr1_fate_weaver_cv_broad_shoulders` | Broad Shoulders | 1 / 2 / 3 | When you take redirected damage, reduce it by {v}; once per round. |
| `cr1_fate_weaver_cv_witnessed_mercy` | Witnessed Mercy | 1 / 2 / 3 | +{v} to one stabilization or first-aid check on a linked ally. |
| `cr1_fate_weaver_cv_unbroken_chain` | Unbroken Chain | 1 / 2 / 3 | +{v} to the maximum number of rounds a covenant may remain before renewal; does not change token or link caps. |

### Thread Cutter (tree `severance`)

| ID | Name | Ranks | Effect |
|---|---|---:|---|
| `cr1_fate_weaver_sv_sharp_scissors` | Sharp Scissors | 1 / 2 / 3 | +{v} raw wyrd to Cut the Current or Cut the Last Thread. |
| `cr1_fate_weaver_sv_quick_cut` | Quick Cut | 5 / 10 / 15 | +{v} ft to movement granted by Cut and Run. |
| `cr1_fate_weaver_sv_clean_edge` | Clean Edge | 1 / 2 / 3 | +{v} to one check made to sever a link against an unwilling actor. |
| `cr1_fate_weaver_sv_parting_word` | Parting Word | 1 / 2 / 3 | +{v} to the save penalty from Severing Word. |
| `cr1_fate_weaver_sv_cut_the_grip` | Cut the Grip | 1 / 2 / 3 | +{v} to one escape or grapple check involving a linked actor. |
| `cr1_fate_weaver_sv_severing_reach` | Severing Reach | 5 / 10 / 15 | +{v} ft to the range of severance effects. |
| `cr1_fate_weaver_sv_cold_cut` | Cold Cut | 1 / 2 / 3 | +{v} raw wyrd to the first damage event after severing a link; once per turn. |
| `cr1_fate_weaver_sv_follow_through` | Follow Through | 1 / 2 / 3 | +{v} to one attack or check immediately after severing a link; declared before rolling. |
| `cr1_fate_weaver_sv_cut_the_chain` | Cut the Chain | 1 / 2 / 3 | Sever one additional link when you use Sever All, up to {v} extra links. |
| `cr1_fate_weaver_sv_silent_sever` | Silent Sever | 1 / 2 / 3 | +{v} to Stealth when severing a link quietly; no invisibility or evidence removal. |
| `cr1_fate_weaver_sv_fraying_pressure` | Fraying Pressure | 1 / 2 / 3 | +{v} to one Intimidation or Persuasion check against a linked actor. |
| `cr1_fate_weaver_sv_executioner_thread` | Executioner Thread | 1 / 2 / 3 | +{v} raw wyrd against a target below half health after severing its link; once per target per round. |
| `cr1_fate_weaver_sv_snip_counter` | Snip Counter | 1 / 2 / 3 | +{v} to one reaction check to interrupt a link formation; no free attack. |
| `cr1_fate_weaver_sv_broken_crown` | Broken Crown | 1 / 2 / 3 | +{v} to the suppression duration check for Sever the Borrowed Crown; never exceeds two rounds. |
| `cr1_fate_weaver_sv_throughline_precision` | Throughline Precision | 1 / 2 / 3 | +{v} raw wyrd to Sever the Throughline; no extension of suppression. |
| `cr1_fate_weaver_sv_last_cut` | Last Cut | 1 / 2 / 3 | +{v} raw wyrd to the final damage event of a severed capstone link. |

### Tapestry Keeper (tree `tapestry`)

| ID | Name | Ranks | Effect |
|---|---|---:|---|
| `cr1_fate_weaver_tp_wide_weave` | Wide Weave | 5 / 10 / 15 | +{v} ft to the range of Reanchor the Tapestry. |
| `cr1_fate_weaver_tp_read_the_pattern` | Read the Pattern | 1 / 2 / 3 | +{v} to one Investigation check about visible links or their public terms. |
| `cr1_fate_weaver_tp_reanchor_step` | Reanchor Step | 5 / 10 / 15 | +{v} ft to movement granted by Tapestry Step. |
| `cr1_fate_weaver_tp_woven_insight` | Woven Insight | 1 / 2 / 3 | +{v} to one Insight or Perception check involving a linked actor. |
| `cr1_fate_weaver_tp_tapestry_guard` | Tapestry Guard | 1 / 2 / 3 | Reduce one original damage event by {v} while maintaining a link; once per round. |
| `cr1_fate_weaver_tp_thread_memory` | Thread Memory | 1 / 2 / 3 | Recall the public endpoint and purpose of up to {v} links; no hidden information. |
| `cr1_fate_weaver_tp_long_line` | Long Line | 10 / 20 / 30 | +{v} ft to link formation range while no enemy link is active. |
| `cr1_fate_weaver_tp_pattern_break` | Pattern Break | 1 / 2 / 3 | +{v} to one check to resist a link or covenant formed against you. |
| `cr1_fate_weaver_tp_swift_weave` | Swift Weave | 1 / 2 / 3 | Reduce the AP cost of one link by {v}, minimum 1; once per turn. |
| `cr1_fate_weaver_tp_sure_anchor` | Sure Anchor | 1 / 2 / 3 | +{v} to one check to maintain a link when its endpoint moves. |
| `cr1_fate_weaver_tp_tapestry_sight` | Tapestry Sight | 10 / 20 / 30 | +{v} ft to the range of Fate Audit and Read the Whole. |
| `cr1_fate_weaver_tp_grand_pattern` | Grand Pattern | 1 / 2 / 3 | +{v} to one check to identify a link's public purpose; no private clause. |
| `cr1_fate_weaver_tp_relay_ready` | Relay Ready | 1 / 2 / 3 | Reanchor one additional link with The Grand Relay, up to {v} extra links; no extra tokens. |
| `cr1_fate_weaver_tp_threefold_edge` | Threefold Edge | 1 / 2 / 3 | +{v} to one check or save made by a link affected by Threefold Compact. |
| `cr1_fate_weaver_tp_woven_fate` | Woven Fate | 1 / 2 / 3 | +{v} to one check to predict a visible link's immediate physical consequence; no future certainty. |
| `cr1_fate_weaver_tp_eternal_thread` | Eternal Thread | 1 / 2 / 3 | Return one additional `recovering` token on a long rest, up to {v} extra tokens. |

## Augur disposition inventory (380 rows)

The machine-readable inventory is `augur-disposition.json` and its summary is `AUGUR-DISPOSITION.md`. Coverage is fixed at:

- 45 active spells + 44 pool entries + 57 nodes + 150 rank rows + 57 materialized grants + 11 subrace variants + 1 variant alias + 9 heritage edges + 3 resource IDs + 3 specializations = 380 rows.
- Every row has `keep`, `adapt` or `retire`; every `adapt` has a real `cr1_fate_weaver_*` destination; every legacy row is `keep` with `automaticConversion: false`.
- No legacy ID is renamed or deleted. Fate Weaver imports no Benediction, Malediction or Omen Debt bank and gains no heritage edge.
