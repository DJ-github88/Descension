import React, { useEffect, useMemo, useRef, useState } from 'react';
import './ChaosWeaverWorkshop.css';
import ChaosWeaverResourceDisplay from '../../hud/ChaosWeaverResourceDisplay';
import {
  CHAOS_WEAVER_ACTIVE_COUNTS,
  CHAOS_WEAVER_ACTIVE_SPELLS,
  CHAOS_WEAVER_CORE_SPELLS,
  CHAOS_WEAVER_IDENTITY,
  CHAOS_WEAVER_MANUAL_ONLY_NOTICE,
  CHAOS_WEAVER_NATIVE_VARIANTS,
  CHAOS_WEAVER_OPTIONAL_SLOTS,
  CHAOS_WEAVER_ORIGIN,
  CHAOS_WEAVER_PROGRESSION,
  CHAOS_WEAVER_PROGRESSION_RULES,
  CHAOS_WEAVER_ACQUISITION_RECORDS,
  CHAOS_WEAVER_RESOURCE_RULES,
  CHAOS_WEAVER_RULESET,
  CHAOS_WEAVER_SETTLEMENT_RULES,
  CHAOS_WEAVER_SPELLS_BY_ID,
  CHAOS_WEAVER_TALENT_ACTIVE_SPELLS,
  CHAOS_WEAVER_TILE_IDS
} from '../../../data/classes/chaosWeaverData';
import {
  CHAOS_WEAVER_PASSIVE_SPELLS,
  CHAOS_WEAVER_PASSIVE_SPELLS_BY_ID,
  CHAOS_WEAVER_TALENT_CAPACITY,
  CHAOS_WEAVER_TREES
} from '../../../data/talentTrees/chaosWeaver';
import {
  aggregateMovementPenalty,
  allocationPoints,
  allocateRank,
  allocationSummary,
  canAllocateRank,
  canPickSpell,
  commitSpell,
  completeRest,
  createEmptyAllocation,
  createRehearsalSession,
  createUninitializedSession,
  endOwnTurn,
  exportPacketText,
  grantedSpellIds,
  importPacket,
  pendingSettlementPreview,
  pointBudgetForLevel,
  preparedExchange,
  previewParameterValues,
  recordFace,
  removeRank,
  resolveAnomaly,
  resolveContinuation,
  resourceSummaryText,
  setWorksheetCounters,
  settlePending,
  startOwnTurn,
  treePoints,
  validateContentPackage,
  validateRehearsalState,
  validateRecordProfile,
  voidPending,
  zoneOfTile
} from '../../../data/classes/chaosWeaverRules';

const TABS = [
  { id: 'rules', label: 'Rules' },
  { id: 'progression', label: 'Level Progression' },
  { id: 'spells', label: 'Spells' },
  { id: 'talents', label: 'Talents' },
  { id: 'origins', label: 'Origins' },
  { id: 'rehearsal', label: 'Rehearsal' },
  { id: 'authoring', label: 'Authoring/Export' }
];

const SOURCE_LABELS = {
  core: 'Core grant',
  'level-pick': 'Level pick',
  talent: 'Talent'
};

const SLOT_BY_ID = Object.fromEntries(CHAOS_WEAVER_OPTIONAL_SLOTS.map((slot) => [slot.id, slot.slot]));

const describeDescriptor = (descriptor) => {
  if (descriptor.tileIds) return `exact IDs ${descriptor.tileIds.join(', ')}`;
  if (descriptor.anyTiles) {
    return `any ${descriptor.anyTiles} tile${descriptor.anyTiles === 1 ? '' : 's'}`;
  }
  if (descriptor.anyOf) {
    const count = descriptor.count === undefined ? 1 : descriptor.count;
    const range =
      descriptor.minCount !== undefined
        ? ` between ${descriptor.minCount} and ${descriptor.maxCount}`
        : ` \u00d7${count}`;
    return `any${range} of ${descriptor.anyOf.join('/')}${descriptor.sameSymbol ? ' (one symbol)' : ''}`;
  }
  if (descriptor.symbol) {
    const count = descriptor.count === undefined ? 1 : descriptor.count;
    return `${count} \u00d7 ${descriptor.symbol}`;
  }
  return 'no tile';
};

const describeTileRule = (record) => {
  if (record.tileRule.count === 0) return 'No tile cost.';
  const inputs = record.tileRule.inputSymbols.map(describeDescriptor).join(' + ');
  return `${inputs} \u2014 ${record.tileRule.zoneFrom} \u2192 ${record.tileRule.zoneTo}; spend-all-primary ${record.tileRule.spendAllPrimary ? 'yes' : 'no'}.`;
};

const movementText = (movement) => {
  if (!movement) return null;
  return `${movement.kind} ${movement.feet}ft until ${movement.until}${movement.optional ? ' (optional)' : ''}`;
};

const outcomeText = (outcome) => {
  const parts = [];
  if (outcome.damage) parts.push(`damage ${outcome.damage.formula} (${outcome.damage.damageTypes.join(', ')})`);
  if (outcome.ward) {
    parts.push(`ward ${outcome.ward.amount} on ${outcome.ward.appliesTo} until ${outcome.ward.until}`);
  }
  const movement = movementText(outcome.movement);
  if (movement) parts.push(movement);
  if (outcome.penalty && outcome.penalty.kind === 'penalty') {
    parts.push(`caster ${movementText(outcome.penalty)}`);
  }
  if (outcome.note) parts.push(outcome.note);
  return parts.join(' \u00b7 ');
};

const costText = (record) => `${record.resourceCost.actionPoints} AP / ${record.resourceCost.mana} mana`;

const spellLabel = (record) =>
  `${record.name} (${SOURCE_LABELS[record.source] || record.source}, level ${record.level}, ${costText(record)})`;

const RECORD_FIELD_SUMMARY = [
  ['id', (record) => record.id],
  ['class', (record) => record.classId],
  ['ruleset', (record) => record.rulesetVersion],
  ['level', (record) => String(record.level)],
  ['source', (record) => SOURCE_LABELS[record.source] || record.source],
  ['tree', (record) => record.treeId || 'none'],
  ['spell type', (record) => record.spellType],
  ['cost', (record) => costText(record)],
  ['tile price', (record) => describeTileRule(record)],
  ['target roles', (record) => record.target.roles.join(', ') || 'none'],
  ['range', (record) => `${record.target.rangeFeet}ft, max ${record.target.maxSubjects}`],
  ['use', (record) => record.timing.use],
  ['expiry', (record) => record.timing.expiry || 'none'],
  ['once per rest', (record) => (record.timing.oncePerRest ? 'yes' : 'no')],
  ['authored only', (record) => String(record.authoredOnly)],
  ['execution enabled', (record) => String(record.executionEnabled)],
  ['application mode', (record) => record.applicationMode]
];

const MAP_REFERENCE = [
  ['Two IDs', 'd6: 1\u20133 first ID, 4\u20136 second ID (sorted S1,S2,M1,M2,F1,F2)'],
  ['Three IDs', 'd6: 1\u20132 first, 3\u20134 second, 5\u20136 third'],
  ['Four IDs', 'd4 direct: 1 first, 2 second, 3 third, 4 fourth']
];

const RulesTab = () => (
  <div className="cw-panel">
    <section className="cw-card">
      <h3>{CHAOS_WEAVER_IDENTITY.name}</h3>
      <p className="cw-lead">{CHAOS_WEAVER_IDENTITY.pitch}</p>
      <dl className="cw-facts">
        <div><dt>Role</dt><dd>{CHAOS_WEAVER_IDENTITY.role}</dd></div>
        <div><dt>Primary attributes</dt><dd>{CHAOS_WEAVER_IDENTITY.primaryAttributes.join(', ')}</dd></div>
        <div><dt>Payload affinity</dt><dd>{CHAOS_WEAVER_IDENTITY.payloadAffinity}</dd></div>
        <div><dt>Group verb</dt><dd>{CHAOS_WEAVER_IDENTITY.groupVerb}</dd></div>
        <div><dt>Equipment training</dt><dd>{CHAOS_WEAVER_IDENTITY.equipmentTraining}</dd></div>
      </dl>
      <h4>Weaknesses stay explicit</h4>
      <ul className="cw-list">
        {CHAOS_WEAVER_IDENTITY.weaknesses.map((weakness) => <li key={weakness}>{weakness}</li>)}
      </ul>
      <p className="cw-boundary">{CHAOS_WEAVER_IDENTITY.boundary}</p>
    </section>

    <section className="cw-card">
      <h3>Six Tiles and Four Zones</h3>
      <p>
        Six exact IDs <strong>{CHAOS_WEAVER_TILE_IDS.join(', ')}</strong> ({CHAOS_WEAVER_RULESET.tileIds.length} IDs,
        symbols S = Surge, M = Shift, F = Fracture) live in exactly one of the four zones
        ({CHAOS_WEAVER_RULESET.zones.join(', ')}). Conservation is absolute in every transition.
      </p>
      <h4>Resource rules</h4>
      <ol className="cw-rule-list">
        {CHAOS_WEAVER_RESOURCE_RULES.map((rule) => (
          <li key={rule.id}>
            <strong>{rule.title}.</strong> {rule.text}
          </li>
        ))}
      </ol>
      <h4>Settlement constraints</h4>
      <ul className="cw-list">
        {Object.entries(CHAOS_WEAVER_SETTLEMENT_RULES).map(([key, text]) => (
          <li key={key}>{text}</li>
        ))}
      </ul>
    </section>

    <section className="cw-card">
      <h3>Talent capacity</h3>
      <ul className="cw-list">
        <li>{CHAOS_WEAVER_RULESET.talents.nodesPerTree} nodes and {CHAOS_WEAVER_RULESET.talents.maxRanksPerTree} max ranks per tree; {CHAOS_WEAVER_TALENT_CAPACITY.nodes} nodes total.</li>
        <li>Character budget {CHAOS_WEAVER_RULESET.talents.pointsPerLevel} points per level, capped at {CHAOS_WEAVER_RULESET.talents.characterPointCap}.</li>
        <li>Signature opens after {CHAOS_WEAVER_RULESET.talents.signatureMinPoints} points at level {CHAOS_WEAVER_RULESET.talents.signatureMinLevel}; capstone after {CHAOS_WEAVER_RULESET.talents.capstoneMinPoints} points at level {CHAOS_WEAVER_RULESET.talents.capstoneMinLevel}.</li>
        <li>{CHAOS_WEAVER_RULESET.talents.prerequisiteRule}</li>
      </ul>
      <p className="cw-boundary">{CHAOS_WEAVER_MANUAL_ONLY_NOTICE}</p>
    </section>
  </div>
);

const ProgressionTab = () => (
  <div className="cw-panel">
    <section className="cw-card">
      <h3>Levels 1&ndash;10</h3>
      <p>{CHAOS_WEAVER_PROGRESSION_RULES.optionalPickRule}</p>
      <table className="cw-table">
        <thead>
          <tr>
            <th scope="col">Level</th>
            <th scope="col">Optional picks</th>
            <th scope="col">Talent budget</th>
            <th scope="col">Event</th>
            <th scope="col">New options</th>
          </tr>
        </thead>
        <tbody>
          {CHAOS_WEAVER_PROGRESSION.map((row) => (
            <tr key={row.level}>
              <td>{row.level}</td>
              <td>{row.optionalPicks}</td>
              <td>{row.talentBudget} pts</td>
              <td>{row.event}</td>
              <td>
                <ul className="cw-list">
                  {row.newChoiceIds.map((id) => {
                    const record = CHAOS_WEAVER_SPELLS_BY_ID[id];
                    return (
                      <li key={id}>
                        {record ? record.name : id} <span className="cw-muted">({id})</span>
                      </li>
                    );
                  })}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4>Progression rules</h4>
      <ul className="cw-list">
        {Object.values(CHAOS_WEAVER_PROGRESSION_RULES).map((text) => <li key={text}>{text}</li>)}
      </ul>
    </section>
  </div>
);

const SpellsTab = ({ previewLevel, pickedSpellIds, onTogglePick }) => {
  const pickChecks = useMemo(
    () =>
      Object.fromEntries(
        CHAOS_WEAVER_ACTIVE_SPELLS.map((record) => [
          record.id,
          canPickSpell(record.id, { characterLevel: previewLevel, pickedSpellIds })
        ])
      ),
    [previewLevel, pickedSpellIds]
  );

  return (
    <div className="cw-panel">
      <section className="cw-card">
        <h3>Spell catalogue</h3>
        <p>
          {CHAOS_WEAVER_ACTIVE_COUNTS.optional} optional records, {CHAOS_WEAVER_ACTIVE_COUNTS.core} core grants and{' '}
          {CHAOS_WEAVER_ACTIVE_COUNTS.talentActives} talent actives ({CHAOS_WEAVER_ACTIVE_COUNTS.total} active records).
          The 48 rank-passives live with their talent nodes.
        </p>
        <p>
          Level-pick preview uses level{' '}
          <strong>{previewLevel}</strong> (change it in the Talents tab); picks are draft bytes only.
        </p>
      </section>
      <div className="cw-spell-grid">
        {CHAOS_WEAVER_ACTIVE_SPELLS.map((record) => {
          const picked = pickedSpellIds.includes(record.id);
          const check = pickChecks[record.id];
          const slot = SLOT_BY_ID[record.id];
          return (
            <details className="cw-spell-card" key={record.id}>
              <summary>
                <span className="cw-spell-name">{record.name}</span>
                <span className="cw-badge">{SOURCE_LABELS[record.source] || record.source}</span>
                <span className="cw-badge">L{record.level}</span>
                <span className="cw-badge">{costText(record)}</span>
                {picked && <span className="cw-badge cw-badge-picked">picked</span>}
              </summary>
              <div className="cw-spell-body">
                <p className="cw-muted">
                  {record.id}
                  {slot ? ` \u00b7 slot ${slot}` : ''}
                  {record.treeId ? ` \u00b7 ${record.treeId}` : ''}
                </p>
                <p><strong>Tile price:</strong> {describeTileRule(record)}</p>
                <p>
                  <strong>Target:</strong> {record.target.roles.join(', ') || 'none'} at {record.target.rangeFeet}ft,
                  max {record.target.maxSubjects} subject(s).
                </p>
                {record.branchRule && (
                  <div>
                    <strong>Published branches ({record.branchRule.selection}):</strong>
                    <ul className="cw-list">
                      {Object.entries(record.branchRule.outcomes).map(([symbol, outcome]) => (
                        <li key={symbol}>
                          <strong>{symbol}</strong>: {outcomeText(outcome)}
                        </li>
                      ))}
                    </ul>
                    <p className="cw-muted">{record.branchRule.sampleNote}</p>
                  </div>
                )}
                {record.area && (
                  <div>
                    <p>
                      <strong>Anomaly:</strong> {record.area.radiusFeet}ft radius, placed within {record.area.placementRangeFeet}ft,
                      trigger {record.area.trigger}, expires {record.area.expires}. {record.area.occupancyNote}
                    </p>
                    {record.area.branches && (
                      <ul className="cw-list">
                        {Object.entries(record.area.branches).map(([symbol, outcome]) => (
                          <li key={symbol}>
                            <strong>{symbol}</strong>: {outcomeText(outcome)}
                          </li>
                        ))}
                      </ul>
                    )}
                    {record.area.boundary && <p className="cw-muted">{record.area.boundary}</p>}
                  </div>
                )}
                {record.continuation && (
                  <div>
                    <strong>Continuation (one only):</strong>
                    <ul className="cw-list">
                      {record.continuation.choices.map((choice) => (
                        <li key={choice.id}>
                          {choice.tileSymbols.join('/')}: {choice.effectText}
                          {choice.requiresTalentId ? ` (requires ${choice.requiresTalentId})` : ''}
                        </li>
                      ))}
                    </ul>
                    <p className="cw-muted">{record.continuation.reservationRule}</p>
                  </div>
                )}
                <p>{record.effectText}</p>
                <ul className="cw-list cw-manual">
                  {record.manualRequirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
                </ul>
                <p className="cw-muted">Sources: {record.sourceRefs.join('; ')}</p>
                {record.source === 'level-pick' && (
                  <button
                    type="button"
                    className="cw-btn"
                    onClick={() => onTogglePick(record.id)}
                    disabled={!picked && !check.ok}
                    title={!picked && !check.ok ? check.errors.join('; ') : undefined}
                  >
                    {picked ? 'Unpick' : `Pick for level ${previewLevel} preview`}
                  </button>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
};

const TalentsTab = ({ previewLevel, onPreviewLevel, allocation, onAllocate, onRemove }) => {
  const summary = allocationSummary(allocation);
  const parameters = previewParameterValues(allocation);
  const granted = grantedSpellIds(allocation);
  const budget = pointBudgetForLevel(previewLevel);
  const points = allocationPoints(allocation);

  return (
    <div className="cw-panel">
      <section className="cw-card">
        <h3>Build preview</h3>
        <label className="cw-field">
          <span>Preview character level</span>
          <select value={previewLevel} onChange={(event) => onPreviewLevel(Number(event.target.value))}>
            {Array.from({ length: 10 }, (_, index) => index + 1).map((level) => (
              <option key={level} value={level}>
                Level {level} ({pointBudgetForLevel(level)} points)
              </option>
            ))}
          </select>
        </label>
        <p>
          <strong>{points}</strong> / {budget} points spent
          {summary.primaryTreeId ? ` \u00b7 primary tree ${summary.primaryTreeId}` : ' \u00b7 no primary tree yet'}
          {points > budget ? ' \u2014 over budget for this preview level' : ''}
        </p>
        <ul className="cw-list">
          {summary.perTree.map((tree) => (
            <li key={tree.treeId}>
              {tree.name}: {tree.points} points
            </li>
          ))}
        </ul>
        {granted.length > 0 && (
          <p>
            <strong>Granted actives:</strong>{' '}
            {granted.map((id) => (CHAOS_WEAVER_SPELLS_BY_ID[id] ? CHAOS_WEAVER_SPELLS_BY_ID[id].name : id)).join(', ')}
          </p>
        )}
        {Object.keys(parameters).length > 0 && (
          <div>
            <strong>Highest-rank parameter values (manual table modifiers only):</strong>
            <ul className="cw-list">
              {Object.entries(parameters).map(([key, entry]) => (
                <li key={key}>
                  {key}: {entry.value} (rank {entry.rank})
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="cw-muted">
          Preview ranks never write to a character, library or live talent registry; removing a prerequisite removes
          dependent ranks.
        </p>
      </section>

      {CHAOS_WEAVER_TREES.map((tree) => (
        <section className="cw-card" key={tree.id}>
          <h3>
            {tree.meta.name} <span className="cw-muted">({treePoints(allocation, tree.id)} points)</span>
          </h3>
          <p className="cw-muted">{tree.meta.tagline}</p>
          <div className="cw-node-grid">
            {tree.nodes.map((node) => {
              const rank = allocation.ranks[node.id] || 0;
              const canAdd = canAllocateRank(allocation, node.id, previewLevel);
              const currentText = rank > 0 && node.rankValues[rank - 1] ? node.rankValues[rank - 1].text : node.effectText;
              const grantedActive = node.grantId ? CHAOS_WEAVER_SPELLS_BY_ID[node.grantId] : null;
              return (
                <div className="cw-node" key={node.id}>
                  <div className="cw-node-head">
                    <strong>
                      {node.number}. {node.name}
                    </strong>
                    <span className="cw-rank">
                      {rank}/{node.maxRanks}
                    </span>
                  </div>
                  <p className="cw-muted">
                    Gate {node.requiresPoints} pts &middot; min level {node.minLevel}
                    {node.requires.length > 0
                      ? ` \u00b7 requires ${node.requires
                          .map((id) => {
                            const predecessor = CHAOS_WEAVER_SPELLS_BY_ID[id];
                            return predecessor ? predecessor.name : id;
                          })
                          .join(', ')}`
                      : ''}
                  </p>
                  <p>{currentText}</p>
                  {node.rankValues.length > 1 && (
                    <ul className="cw-list cw-rank-list">
                      {node.rankValues.map((entry) => (
                        <li key={entry.rank} className={entry.rank === rank ? 'cw-rank-current' : undefined}>
                          Rank {entry.rank}: {entry.text}
                        </li>
                      ))}
                    </ul>
                  )}
                  {node.capstoneExtension && (
                    <p className="cw-capstone">
                      Capstone extension (inactive until this capstone is learned): {node.capstoneExtension.text}
                    </p>
                  )}
                  {grantedActive && (
                    <p className="cw-muted">
                      {rank === node.maxRanks
                        ? `Grants ${grantedActive.name} while fully ranked.`
                        : `Grant inactive until fully ranked (${node.maxRanks} ranks).`}
                    </p>
                  )}
                  <div className="cw-node-actions">
                    <button
                      type="button"
                      className="cw-btn cw-btn-small"
                      onClick={() => onAllocate(node.id)}
                      disabled={!canAdd.ok}
                      title={canAdd.ok ? undefined : canAdd.errors.join('; ')}
                    >
                      + rank
                    </button>
                    <button
                      type="button"
                      className="cw-btn cw-btn-small"
                      onClick={() => onRemove(node.id)}
                      disabled={rank === 0}
                    >
                      &minus; rank
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

const OriginsTab = () => (
  <div className="cw-panel">
    <section className="cw-card">
      <h3>Origin</h3>
      <p>{CHAOS_WEAVER_ORIGIN.longForm}</p>
      <dl className="cw-facts">
        <div>
          <dt>Proposed institution</dt>
          <dd>
            {CHAOS_WEAVER_ORIGIN.institution.name} — {CHAOS_WEAVER_ORIGIN.institution.kind}.{' '}
            {CHAOS_WEAVER_ORIGIN.institution.note}
          </dd>
        </div>
        <div><dt>Crisis</dt><dd>{CHAOS_WEAVER_ORIGIN.crisis}</dd></div>
        <div>
          <dt>Teaching phrase</dt>
          <dd>
            &ldquo;{CHAOS_WEAVER_ORIGIN.teachingPhrase.text}&rdquo; — {CHAOS_WEAVER_ORIGIN.teachingPhrase.attribution}
          </dd>
        </div>
      </dl>
    </section>

    <section className="cw-card">
      <h3>Acquisition records (proposed)</h3>
      <ul className="cw-list">
        {CHAOS_WEAVER_ACQUISITION_RECORDS.map((record) => (
          <li key={record.id}>
            <strong>{record.label}.</strong> {record.text}
          </li>
        ))}
      </ul>
    </section>

    {CHAOS_WEAVER_NATIVE_VARIANTS.map((variant) => (
      <section className="cw-card cw-native" key={variant.id}>
        <h3>
          Native variant: {variant.name} <span className="cw-badge cw-badge-proposed">proposed</span>
        </h3>
        <p className="cw-muted">
          {variant.id} &middot; status {variant.status} &middot; normal class play works without this edge.
        </p>
        <h4>
          {variant.edge.name} ({variant.edge.cost.actionPoints} AP / {variant.edge.cost.mana} mana &middot;{' '}
          {variant.edge.frequency})
        </h4>
        <p>{variant.edge.effect}</p>
        <strong>Requirements</strong>
        <ul className="cw-list">
          {variant.edge.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}
        </ul>
        <strong>Hard limits</strong>
        <ul className="cw-list">
          {variant.edge.cannot.map((entry) => <li key={entry}>{entry}</li>)}
        </ul>
        <p className="cw-boundary">{variant.edge.manualNote}</p>
        <p className="cw-muted">{variant.brokenStabilizer}</p>
      </section>
    ))}
  </div>
);

const EMPTY_FORM = {
  apInput: '',
  movementInput: '',
  turnInput: '',
  restLabel: '',
  spellId: '',
  primaryIds: [],
  continuationId: '',
  sourceLabel: '',
  targetLabel: '',
  faceValue: '',
  voidReason: '',
  confirmed: [],
  nativePart: '',
  nativeSpentId: '',
  nativeAvailableId: ''
};

const parseInteger = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : undefined;
};

const ChaosWeaverWorkshop = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('rules');
  const [previewLevel, setPreviewLevel] = useState(1);
  const [pickedSpellIds, setPickedSpellIds] = useState([]);
  const [allocation, setAllocation] = useState(createEmptyAllocation);
  const [rehearsal, setRehearsal] = useState(createUninitializedSession);
  const [sessionLabel, setSessionLabel] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [actionErrors, setActionErrors] = useState([]);
  const [notice, setNotice] = useState(null);
  const [inspectorTarget, setInspectorTarget] = useState(null);
  const [exportText, setExportText] = useState('');
  const [importText, setImportText] = useState('');
  const [importFeedback, setImportFeedback] = useState(null);
  const [inspectRecordId, setInspectRecordId] = useState(CHAOS_WEAVER_ACTIVE_SPELLS[0].id);
  const [branchDraft, setBranchDraft] = useState({ recordId: null, text: '', saved: false });
  const focusReturnRef = useRef(null);
  const inspectorRef = useRef(null);
  const workshopRef = useRef(null);

  useEffect(() => {
    if (workshopRef.current && workshopRef.current.focus) workshopRef.current.focus();
  }, []);

  useEffect(() => {
    if (inspectorTarget && inspectorRef.current) {
      inspectorRef.current.focus();
    }
  }, [inspectorTarget]);

  const updateForm = (patch) => setForm((previous) => ({ ...previous, ...patch }));

  const applyResult = (result) => {
    if (result.ok) {
      setRehearsal(result.session);
      setActionErrors([]);
    } else {
      setActionErrors(result.errors);
    }
    return result.ok;
  };

  const packageCheck = useMemo(() => validateContentPackage(), []);

  const knownSpells = useMemo(() => {
    const granted = new Set(grantedSpellIds(allocation));
    return [
      ...CHAOS_WEAVER_CORE_SPELLS,
      ...CHAOS_WEAVER_TALENT_ACTIVE_SPELLS.filter((record) => granted.has(record.id)),
      ...pickedSpellIds
        .map((id) => CHAOS_WEAVER_SPELLS_BY_ID[id])
        .filter((record) => record && record.source === 'level-pick')
    ];
  }, [allocation, pickedSpellIds]);

  const selectedSpell = CHAOS_WEAVER_SPELLS_BY_ID[form.spellId] || null;
  const knownTalentIds = Object.keys(allocation.ranks);
  const continuationChoices =
    selectedSpell && selectedSpell.continuation
      ? selectedSpell.continuation.choices.filter(
          (choice) => choice.requiresTalentId === null || knownTalentIds.includes(choice.requiresTalentId)
        )
      : [];
  const continuationSymbols =
    selectedSpell && selectedSpell.continuation
      ? new Set(continuationChoices.flatMap((choice) => choice.tileSymbols))
      : null;

  const session = rehearsal;
  const isActive = session.status === 'active';
  const commitZone = selectedSpell ? selectedSpell.tileRule.zoneFrom : null;
  const primaryOptions =
    selectedSpell && selectedSpell.tileRule.count > 0
      ? CHAOS_WEAVER_TILE_IDS.filter((tileId) => zoneOfTile(session.tiles, tileId) === commitZone)
      : [];
  const continuationOptions = continuationSymbols
    ? CHAOS_WEAVER_TILE_IDS.filter(
        (tileId) =>
          continuationSymbols.has(tileSymbolOf(tileId)) &&
          zoneOfTile(session.tiles, tileId) === 'available' &&
          !form.primaryIds.includes(tileId)
      )
    : [];

  const togglePrimary = (tileId) => {
    updateForm({
      primaryIds: form.primaryIds.includes(tileId)
        ? form.primaryIds.filter((id) => id !== tileId)
        : [...form.primaryIds, tileId]
    });
  };

  const toggleConfirmed = (label) => {
    updateForm({
      confirmed: form.confirmed.includes(label)
        ? form.confirmed.filter((entry) => entry !== label)
        : [...form.confirmed, label]
    });
  };

  const openInspector = (target) => {
    if (target === null || target === undefined) {
      const element = focusReturnRef.current;
      setInspectorTarget(null);
      if (element && element.focus) element.focus();
      return;
    }
    focusReturnRef.current = document.activeElement;
    setInspectorTarget(target);
  };

  const closeInspector = () => openInspector(null);

  const inspectorContent = useMemo(() => {
    if (!inspectorTarget) return null;
    if (inspectorTarget === 'tiles') {
      return {
        title: 'Tile state',
        lines: [
          resourceSummaryText(session.tiles, session.pending, session.anomaly),
          ...CHAOS_WEAVER_TILE_IDS.map(
            (tileId) => `${tileId} (${tileSymbolOf(tileId)}) in ${zoneOfTile(session.tiles, tileId)}`
          )
        ]
      };
    }
    if (inspectorTarget === 'pending') {
      if (!session.pending) return { title: 'Draw', lines: ['No unresolved draw.'] };
      const pending = session.pending;
      return {
        title: `Draw \u2014 ${pending.sourceLabel}`,
        lines: [
          `Mapping ${pending.mapping.dice} fixed before the face: ${pending.mapping.entries
            .map((entry) => `${entry.tileId} = faces ${entry.faces.join('/')}`)
            .join('; ')}`,
          `Primary IDs ${pending.primaryTileIds.join(', ')}${pending.continuationTileId ? `; continuation reserved ${pending.continuationTileId}` : ''}`,
          `Phase ${pending.phase}${pending.selectedTileId ? `; face ${pending.recordedFaces[0]} \u2192 ${pending.selectedTileId}` : ''}`
        ]
      };
    }
    if (inspectorTarget === 'anomaly') {
      if (!session.anomaly) return { title: 'Anomaly', lines: ['No anomaly.'] };
      const anomaly = session.anomaly;
      return {
        title: `Anomaly \u2014 ${anomaly.centerLabel}`,
        lines: [
          `Bound IDs ${anomaly.tileIds.join(', ')}; ${anomaly.radiusFeet}ft radius placed within ${anomaly.placementRangeFeet}ft`,
          `Trigger ${anomaly.trigger}; created own turn ${anomaly.createdOwnTurn}; expires end of own turn ${anomaly.expiresEndOwnTurn}`,
          anomaly.mapping
            ? `Mapping before the face: ${anomaly.mapping.entries
                .map((entry) => `${entry.tileId} = faces ${entry.faces.join('/')}`)
                .join('; ')}`
            : 'No mapping published for this record.',
          ...(anomaly.profile && anomaly.profile.branches
            ? Object.entries(anomaly.profile.branches).map(
                ([symbol, outcome]) => `Branch ${symbol}: ${outcomeText(outcome)}`
              )
            : ['This record has no trigger branches.']),
          'Occupants at creation do not count as entry; the table confirms paths.'
        ]
      };
    }
    const zone = zoneOfTile(session.tiles, inspectorTarget);
    return {
      title: `${inspectorTarget} \u2014 ${tileSymbolOf(inspectorTarget)}`,
      lines: [
        `Zone ${zone}`,
        zone === 'committed' && session.pending
          ? `${session.pending.sourceLabel}: committed under mapping ${session.pending.mapping.dice}.`
          : zone === 'bound' && session.anomaly
            ? `Bound to the anomaly at ${session.anomaly.centerLabel}; expires end of own turn ${session.anomaly.expiresEndOwnTurn}.`
            : 'No lock or binding recorded on this ID.'
      ]
    };
  }, [inspectorTarget, session]);

  const startRehearsal = () => {
    setRehearsal(createRehearsalSession({ label: sessionLabel }));
    setForm(EMPTY_FORM);
    setActionErrors([]);
    setNotice('Rehearsal started. Class draft bytes (picks and preview ranks) are untouched.');
  };

  const resetRehearsal = () => {
    setRehearsal(createUninitializedSession());
    setForm(EMPTY_FORM);
    setActionErrors([]);
    setNotice('Rehearsal cleared to uninitialized. Class draft bytes stay untouched.');
  };

  const handleCommit = () => {
    if (!selectedSpell) {
      setActionErrors(['Choose a spell to commit.']);
      return;
    }
    if (selectedSpell.id === 'cw1_dismiss_anomaly') {
      dismissAnomaly();
      return;
    }
    const result = commitSpell(session, {
      spellId: selectedSpell.id,
      primaryTileIds: form.primaryIds,
      continuationTileId: form.continuationId || null,
      knownTalentIds,
      sourceLabel: form.sourceLabel,
      targetLabel: form.targetLabel
    });
    const ok = applyResult(result);
    if (ok) {
      updateForm({ spellId: '', primaryIds: [], continuationId: '', targetLabel: '', confirmed: [] });
    }
  };

  const dismissAnomaly = () => {
    if (session.anomaly === null) {
      setActionErrors(['No anomaly exists to dismiss.']);
      return;
    }
    const committed = commitSpell(session, { spellId: 'cw1_dismiss_anomaly' });
    if (!committed.ok) {
      setActionErrors(committed.errors);
      return;
    }
    applyResult(resolveAnomaly(committed.session, { reason: 'dismissal' }));
  };

  const recordPhysicalFace = () => {
    updateForm({ confirmed: [] });
    applyResult(recordFace(session, { faceValue: parseInteger(form.faceValue) }));
  };

  const settlePendingAction = () => {
    const ok = applyResult(settlePending(session, { confirmations: form.confirmed }));
    if (ok) updateForm({ confirmed: [] });
  };

  const acceptContinuation = () => {
    const ok = applyResult(resolveContinuation(session, { choice: 'accept', confirmations: form.confirmed }));
    if (ok) updateForm({ confirmed: [] });
  };

  const declineContinuation = () => {
    const ok = applyResult(resolveContinuation(session, { choice: 'decline' }));
    if (ok) updateForm({ confirmed: [] });
  };

  const triggerAnomaly = () => {
    const ok = applyResult(resolveAnomaly(session, { reason: 'trigger' }));
    if (ok) updateForm({ confirmed: [] });
  };

  const handleTogglePick = (spellId) => {
    if (pickedSpellIds.includes(spellId)) {
      setPickedSpellIds(pickedSpellIds.filter((id) => id !== spellId));
      return;
    }
    const check = canPickSpell(spellId, { characterLevel: previewLevel, pickedSpellIds });
    if (!check.ok) return;
    setPickedSpellIds([...pickedSpellIds, spellId]);
  };

  const handleAllocate = (nodeId) => {
    const result = allocateRank(allocation, nodeId, previewLevel);
    if (result.ok) setAllocation(result.allocation);
    else setActionErrors(result.errors);
  };

  const handleRemove = (nodeId) => {
    const result = removeRank(allocation, nodeId);
    if (result.ok) setAllocation(result.allocation);
    else setActionErrors(result.errors);
  };

  const handleExport = () => {
    setExportText(exportPacketText({ rehearsal: session.status === 'active' ? session : null }));
    setNotice('Packet built locally from authored data only; it writes nothing.');
  };

  const handleImport = () => {
    const result = importPacket(importText);
    if (result.ok) {
      const rehearsalCheck = validateRehearsalState(result.packet.rehearsal);
      if (!rehearsalCheck.ok) {
        setImportFeedback({ ok: false, errors: rehearsalCheck.errors, retained: true });
        return;
      }
      if (rehearsalCheck.state) setRehearsal(rehearsalCheck.state);
      setImportFeedback({
        ok: true,
        errors: [],
        message:
          result.packet.rehearsal && rehearsalCheck.state
            ? 'Certified C1 packet imported; rehearsal worksheet restored.'
            : 'Certified C1 packet imported; the packet carried no rehearsal worksheet.'
      });
      return;
    }
    setImportFeedback({ ok: false, errors: result.errors, retained: true });
  };

  const handleBranchDraftChange = (recordId, text) => {
    setBranchDraft({ recordId, text, saved: false });
  };

  const saveBranchDraft = () => {
    setBranchDraft((previous) => ({ ...previous, saved: true }));
  };

  const inspectedRecord =
    CHAOS_WEAVER_SPELLS_BY_ID[inspectRecordId] ||
    CHAOS_WEAVER_PASSIVE_SPELLS_BY_ID[inspectRecordId] ||
    CHAOS_WEAVER_PASSIVE_SPELLS[0];
  const inspectedProfile = validateRecordProfile(inspectedRecord);

  const pendingPreview =
    session.pending && session.pending.phase !== 'committed' ? pendingSettlementPreview(session) : null;
  const pendingSpell = session.pending ? CHAOS_WEAVER_SPELLS_BY_ID[session.pending.spellId] : null;
  const pendingSymbol =
    session.pending && session.pending.selectedTileId ? tileSymbolOf(session.pending.selectedTileId) : null;
  const retainedOutcome =
    session.pending === null || pendingSymbol === null
      ? null
      : session.pending.kind === 'anomaly-trigger'
        ? session.anomaly && session.anomaly.profile && session.anomaly.profile.branches
          ? session.anomaly.profile.branches[pendingSymbol]
          : null
        : pendingSpell && pendingSpell.branchRule
          ? pendingSpell.branchRule.outcomes[pendingSymbol]
          : null;
  const requiredConfirmations =
    session.pending && session.pending.phase === 'continuation-pending'
      ? [...(pendingPreview ? pendingPreview.labels : []), 'continuation']
      : pendingPreview
        ? pendingPreview.labels
        : [];
  const confirmationsComplete = requiredConfirmations.every((label) => form.confirmed.includes(label));

  return (
    <section
      className="chaos-weaver-workshop"
      aria-label="Chaos Weaver class workshop"
      tabIndex={-1}
      ref={workshopRef}
    >
      <header className="cw-header">
        <button type="button" className="cw-btn cw-back" onClick={() => onBack && onBack()}>
          &larr; Back to classes
        </button>
        <div>
          <h2>Chaos Weaver</h2>
          <p className="cw-lead">
            {CHAOS_WEAVER_IDENTITY.statusLabel} &middot; candidate class rulebook, talent trees and manual rehearsal
            worksheet.
          </p>
        </div>
      </header>

      <div className="cw-manual-strip" role="status">
        <strong>Local rehearsal &mdash; does not spend AP, move tokens or apply effects.</strong>{' '}
        {CHAOS_WEAVER_MANUAL_ONLY_NOTICE}
      </div>

      <nav className="cw-tabs" aria-label="Chaos Weaver workshop sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`cw-tab ${activeTab === tab.id ? 'cw-tab-active' : ''}`}
            aria-pressed={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {actionErrors.length > 0 && (
        <div className="cw-alert" role="alert">
          <strong>Not recorded:</strong>
          <ul className="cw-list">
            {actionErrors.map((error) => <li key={error}>{error}</li>)}
          </ul>
        </div>
      )}
      {notice && <p className="cw-notice">{notice}</p>}

      <div className="cw-panel-stack">
        {activeTab === 'rules' && <RulesTab />}
        {activeTab === 'progression' && <ProgressionTab />}
        {activeTab === 'spells' && (
          <SpellsTab
            previewLevel={previewLevel}
            pickedSpellIds={pickedSpellIds}
            onTogglePick={handleTogglePick}
          />
        )}
        {activeTab === 'talents' && (
          <TalentsTab
            previewLevel={previewLevel}
            onPreviewLevel={setPreviewLevel}
            allocation={allocation}
            onAllocate={handleAllocate}
            onRemove={handleRemove}
          />
        )}
        {activeTab === 'origins' && <OriginsTab />}

        {activeTab === 'rehearsal' && (
          <div className="cw-panel">
            <section className="cw-card">
              <h3>Manual worksheet</h3>
              {!isActive ? (
                <div>
                  <p className="cw-uninitialized">
                    This session is uninitialized. It never refills silently &mdash; start a new rehearsal explicitly,
                    or import a prior worksheet in the Authoring/Export tab.
                  </p>
                  <label className="cw-field">
                    <span>New session label (optional)</span>
                    <input
                      type="text"
                      value={sessionLabel}
                      onChange={(event) => setSessionLabel(event.target.value)}
                      placeholder="Manual rehearsal"
                    />
                  </label>
                  <button type="button" className="cw-btn cw-btn-primary" onClick={startRehearsal}>
                    Start new rehearsal
                  </button>
                </div>
              ) : (
                <div>
                  <div className="cw-session-head">
                    <p>
                      <strong>{session.label}</strong> &middot; own turn {session.turn.ownTurnNumber} &middot; local AP
                      counter {session.turn.apAvailable} &middot; movement counter {session.turn.remainingMovementFeet}ft
                    </p>
                    <button type="button" className="cw-btn" onClick={resetRehearsal}>
                      Reset rehearsal
                    </button>
                  </div>

                  <div className="cw-turn-row">
                    <label className="cw-field">
                      <span>AP available (manual entry)</span>
                      <input
                        type="number"
                        min="0"
                        value={form.apInput}
                        onChange={(event) => updateForm({ apInput: event.target.value })}
                      />
                    </label>
                    <button
                      type="button"
                      className="cw-btn"
                      onClick={() => applyResult(startOwnTurn(session, { apAvailable: parseInteger(form.apInput) }))}
                    >
                      Confirm start of own turn
                    </button>
                    <button type="button" className="cw-btn" onClick={() => applyResult(endOwnTurn(session))}>
                      Confirm end of own turn
                    </button>
                  </div>

                  <div className="cw-turn-row">
                    <label className="cw-field">
                      <span>Turn number</span>
                      <input
                        type="number"
                        min="1"
                        value={form.turnInput}
                        onChange={(event) => updateForm({ turnInput: event.target.value })}
                      />
                    </label>
                    <label className="cw-field">
                      <span>Remaining movement (ft)</span>
                      <input
                        type="number"
                        min="0"
                        value={form.movementInput}
                        onChange={(event) => updateForm({ movementInput: event.target.value })}
                      />
                    </label>
                    <button
                      type="button"
                      className="cw-btn"
                      onClick={() =>
                        applyResult(
                          setWorksheetCounters(session, {
                            ownTurnNumber: parseInteger(form.turnInput),
                            apAvailable: parseInteger(form.apInput),
                            remainingMovementFeet: parseInteger(form.movementInput)
                          })
                        )
                      }
                    >
                      Apply worksheet counters
                    </button>
                  </div>

                  <div className="cw-turn-row">
                    <label className="cw-field">
                      <span>New completed long-rest label</span>
                      <input
                        type="text"
                        value={form.restLabel}
                        onChange={(event) => updateForm({ restLabel: event.target.value })}
                        placeholder="e.g. Long rest 3"
                      />
                    </label>
                    <button
                      type="button"
                      className="cw-btn"
                      onClick={() => applyResult(completeRest(session, { restLabel: form.restLabel }))}
                    >
                      Confirm completed long rest
                    </button>
                  </div>

                  <p className="cw-muted">
                    Rest refuses while an unresolved draw or anomaly exists and requires a brand-new label; movement
                    penalty now {aggregateMovementPenalty(session)}ft (largest of {session.penalties.length} record(s),
                    manual rule).
                  </p>
                </div>
              )}
            </section>

            <section className="cw-card">
              <h3>Six tiles</h3>
              <ChaosWeaverResourceDisplay
                tiles={session.tiles}
                pending={session.pending}
                anomaly={session.anomaly}
                disabledReason={
                  session.pending
                    ? 'A draw is locked: no Fold, rest or native exchange until it settles or is voided.'
                    : session.anomaly
                      ? 'One anomaly is open; a cast may still proceed only with enough other IDs available.'
                      : null
                }
                onInspect={openInspector}
              />
              {inspectorContent && (
                <div
                  className="cw-inspector"
                  ref={inspectorRef}
                  tabIndex={-1}
                  role="region"
                  aria-label={`Inspector: ${inspectorContent.title}`}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      event.stopPropagation();
                      closeInspector();
                    }
                  }}
                >
                  <div className="cw-inspector-head">
                    <strong>{inspectorContent.title}</strong>
                    <button type="button" className="cw-btn cw-btn-small" onClick={closeInspector}>
                      Close (Esc)
                    </button>
                  </div>
                  <ul className="cw-list">
                    {inspectorContent.lines.map((line) => <li key={line}>{line}</li>)}
                  </ul>
                </div>
              )}
            </section>

            {isActive && (
              <section className="cw-card">
                <h3>Commit an action</h3>
                {session.pending ? (
                  <p className="cw-muted">
                    One unresolved action exists; settle or void it before a new commitment.
                  </p>
                ) : (
                  <div>
                    <label className="cw-field">
                      <span>Spell (core, granted talent actives and rehearsal picks)</span>
                      <select value={form.spellId} onChange={(event) => updateForm({ spellId: event.target.value, primaryIds: [], continuationId: '' })}>
                        <option value="">Choose an action&hellip;</option>
                        {knownSpells.map((record) => (
                          <option key={record.id} value={record.id}>
                            {spellLabel(record)}
                          </option>
                        ))}
                      </select>
                    </label>

                    {selectedSpell && (
                      <div>
                        <p>
                          <strong>{selectedSpell.name}:</strong> {describeTileRule(selectedSpell)}
                        </p>
                        {primaryOptions.length > 0 && (
                          <fieldset className="cw-fieldset">
                            <legend>Choose exact primary IDs (zone: {commitZone})</legend>
                            {primaryOptions.map((tileId) => (
                              <label key={tileId} className="cw-check">
                                <input
                                  type="checkbox"
                                  checked={form.primaryIds.includes(tileId)}
                                  onChange={() => togglePrimary(tileId)}
                                />
                                <span>
                                  {tileId} ({tileSymbolOf(tileId)})
                                </span>
                              </label>
                            ))}
                          </fieldset>
                        )}
                        {selectedSpell.continuation && (
                          <label className="cw-field">
                            <span>Reserve one continuation ID (excluded from the primary sample)</span>
                            <select
                              value={form.continuationId}
                              onChange={(event) => updateForm({ continuationId: event.target.value })}
                            >
                              <option value="">No continuation reservation</option>
                              {continuationOptions.map((tileId) => (
                                <option key={tileId} value={tileId}>
                                  {tileId} ({tileSymbolOf(tileId)})
                                </option>
                              ))}
                            </select>
                          </label>
                        )}
                        <div className="cw-turn-row">
                          <label className="cw-field">
                            <span>Source label (optional)</span>
                            <input
                              type="text"
                              value={form.sourceLabel}
                              onChange={(event) => updateForm({ sourceLabel: event.target.value })}
                            />
                          </label>
                          <label className="cw-field">
                            <span>Target / anomaly center label (optional)</span>
                            <input
                              type="text"
                              value={form.targetLabel}
                              onChange={(event) => updateForm({ targetLabel: event.target.value })}
                            />
                          </label>
                        </div>
                        {selectedSpell.id === 'cw1_dismiss_anomaly' ? (
                          <button
                            type="button"
                            className="cw-btn cw-btn-primary"
                            onClick={dismissAnomaly}
                            disabled={session.anomaly === null}
                          >
                            Commit dismissal (1 AP, closes your one anomaly)
                          </button>
                        ) : (
                          <button type="button" className="cw-btn cw-btn-primary" onClick={handleCommit}>
                            Commit: publish the pair and lock it
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

            {isActive && session.pending && (
              <section className="cw-card">
                <h3>{session.pending.kind === 'anomaly-trigger' ? 'Unresolved anomaly trigger' : 'Unresolved draw'}</h3>
                <p>
                  <strong>{session.pending.sourceLabel}</strong> to {session.pending.targetLabel} &middot; phase{' '}
                  {session.pending.phase}
                </p>
                <ul className="cw-list">
                  {session.pending.mapping.entries.map((entry) => (
                    <li key={entry.tileId}>
                      {entry.tileId}: {session.pending.mapping.dice} faces {entry.faces.join('/')}
                    </li>
                  ))}
                </ul>
                {session.pending.continuationTileId && (
                  <p>
                    Continuation reserved: <strong>{session.pending.continuationTileId}</strong> (committed, excluded
                    from the primary sample).
                  </p>
                )}
                {session.pending.phase === 'committed' && (
                  <div className="cw-turn-row">
                    <label className="cw-field">
                      <span>Physical face entered by hand</span>
                      <input
                        type="number"
                        min="1"
                        max={session.pending.mapping.dice === 'd4' ? 4 : 6}
                        value={form.faceValue}
                        onChange={(event) => updateForm({ faceValue: event.target.value })}
                      />
                    </label>
                    <button type="button" className="cw-btn" onClick={recordPhysicalFace}>
                      Record face
                    </button>
                  </div>
                )}
                {session.pending.phase !== 'committed' && retainedOutcome && (
                  <p>
                    <strong>Retained authored result ({pendingSymbol}):</strong> {outcomeText(retainedOutcome)}
                  </p>
                )}
                {session.pending.phase !== 'committed' && requiredConfirmations.length > 0 && (
                  <fieldset className="cw-fieldset">
                    <legend>Manual table confirmations</legend>
                    {requiredConfirmations.map((label) => (
                      <label key={label} className="cw-check">
                        <input
                          type="checkbox"
                          checked={form.confirmed.includes(label)}
                          onChange={() => toggleConfirmed(label)}
                        />
                        <span>
                          {label === 'continuation'
                            ? 'Recorded the retained primary result and the continuation worksheet by hand'
                            : `Recorded the authored ${label} worksheet by hand`}
                        </span>
                      </label>
                    ))}
                  </fieldset>
                )}
                {session.pending.phase === 'continuation-pending' && (
                  <div className="cw-turn-row">
                    <p>
                      Face {session.pending.recordedFaces[0]} selected{' '}
                      <strong>{session.pending.selectedTileId}</strong>. Retain the result, then choose the single
                      continuation.
                    </p>
                    <button
                      type="button"
                      className="cw-btn"
                      onClick={acceptContinuation}
                      disabled={!confirmationsComplete}
                      title={confirmationsComplete ? undefined : 'confirm the retained result first'}
                    >
                      Accept continuation (spend the reserved ID)
                    </button>
                    <button type="button" className="cw-btn" onClick={declineContinuation}>
                      Decline continuation (return reserved ID)
                    </button>
                  </div>
                )}
                {session.pending.phase === 'face-recorded' && (
                  <button
                    type="button"
                    className="cw-btn cw-btn-primary"
                    onClick={settlePendingAction}
                    disabled={!confirmationsComplete}
                    title={confirmationsComplete ? undefined : 'record every authored worksheet component first'}
                  >
                    Settle: record the result and spend the primary IDs
                  </button>
                )}
                <div className="cw-turn-row">
                  <label className="cw-field">
                    <span>GM void reason (recorded, no refund, no new face)</span>
                    <input
                      type="text"
                      value={form.voidReason}
                      onChange={(event) => updateForm({ voidReason: event.target.value })}
                    />
                  </label>
                  <button
                    type="button"
                    className="cw-btn cw-btn-danger"
                    onClick={() => applyResult(voidPending(session, { reason: form.voidReason }))}
                  >
                    Void with reason
                  </button>
                </div>
              </section>
            )}

            {isActive && session.anomaly && (
              <section className="cw-card">
                <h3>Visible anomaly</h3>
                <p>
                  {session.anomaly.sourceLabel} at {session.anomaly.centerLabel}: {session.anomaly.radiusFeet}ft radius,
                  bound {session.anomaly.tileIds.join(', ')}, expires end of own turn{' '}
                  {session.anomaly.expiresEndOwnTurn}.
                </p>
                <p className="cw-muted">
                  Mapping published before any face:{' '}
                  {session.anomaly.mapping
                    ? `${session.anomaly.mapping.dice} \u2014 ${session.anomaly.mapping.entries
                        .map((entry) => `${entry.tileId} faces ${entry.faces.join('/')}`)
                        .join('; ')}`
                    : 'none for this record'}
                </p>
                {session.anomaly.profile && session.anomaly.profile.branches && (
                  <ul className="cw-list">
                    {Object.entries(session.anomaly.profile.branches).map(([symbol, outcome]) => (
                      <li key={symbol}>
                        <strong>{symbol}</strong>: {outcomeText(outcome)}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="cw-muted">
                  First enemy original voluntary entry only; occupants at creation do not count; the table confirms
                  paths. Avoided triggers never refund. Expiry is automatic at the end of own turn{' '}
                  {session.anomaly.expiresEndOwnTurn}. Close early only through an authored paid action: Counterseal
                  (cw1_30) or Unbind (cw1_35) as ordinary casts, or the paid dismissal below.
                </p>
                <div className="cw-turn-row">
                  <button
                    type="button"
                    className="cw-btn cw-btn-primary"
                    onClick={triggerAnomaly}
                    disabled={session.pending !== null || !(session.anomaly.profile && session.anomaly.profile.branches)}
                    title={
                      session.pending !== null
                        ? 'resolve the current unresolved action first'
                        : !(session.anomaly.profile && session.anomaly.profile.branches)
                          ? 'this record has no trigger branches; close it by expiry, dismissal or its own paid action'
                          : undefined
                    }
                  >
                    Trigger: confirm the first enemy voluntary entry (locks the action; enter the face next)
                  </button>
                  <button
                    type="button"
                    className="cw-btn"
                    onClick={dismissAnomaly}
                    disabled={session.pending !== null || session.turn.apAvailable < 1}
                    title={
                      session.pending !== null
                        ? 'resolve the unresolved action first'
                        : session.turn.apAvailable < 1
                          ? 'enter at least 1 local AP'
                          : undefined
                    }
                  >
                    Dismiss Anomaly (1 AP, spends the bound IDs)
                  </button>
                </div>
              </section>
            )}

            {isActive && (
              <section className="cw-card">
                <h3>Prepared Exchange (proposed native edge)</h3>
                <p className="cw-muted">
                  Once per completed long rest, no pending action, consume one actual prepared spare part; swap one
                  spent and one available ID of different symbols; movement&minus;5ft until next own-turn start. Manual
                  verification required; no automatic benefit.
                </p>
                <div className="cw-turn-row">
                  <label className="cw-field">
                    <span>Prepared part consumed at the table</span>
                    <input
                      type="text"
                      value={form.nativePart}
                      onChange={(event) => updateForm({ nativePart: event.target.value })}
                    />
                  </label>
                  <label className="cw-field">
                    <span>Spent ID to recover</span>
                    <select
                      value={form.nativeSpentId}
                      onChange={(event) => updateForm({ nativeSpentId: event.target.value })}
                    >
                      <option value="">Choose&hellip;</option>
                      {CHAOS_WEAVER_TILE_IDS.filter((tileId) => zoneOfTile(session.tiles, tileId) === 'spent').map((tileId) => (
                        <option key={tileId} value={tileId}>{tileId}</option>
                      ))}
                    </select>
                  </label>
                  <label className="cw-field">
                    <span>Available ID to spend</span>
                    <select
                      value={form.nativeAvailableId}
                      onChange={(event) => updateForm({ nativeAvailableId: event.target.value })}
                    >
                      <option value="">Choose&hellip;</option>
                      {CHAOS_WEAVER_TILE_IDS.filter((tileId) => zoneOfTile(session.tiles, tileId) === 'available').map((tileId) => (
                        <option key={tileId} value={tileId}>{tileId}</option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    className="cw-btn"
                    onClick={() =>
                      applyResult(
                        preparedExchange(session, {
                          spentTileId: form.nativeSpentId || undefined,
                          availableTileId: form.nativeAvailableId || undefined,
                          partLabel: form.nativePart
                        })
                      )
                    }
                  >
                    Record Prepared Exchange
                  </button>
                </div>
              </section>
            )}

            {isActive && (
              <section className="cw-card">
                <h3>Worksheet log</h3>
                {session.penalties.length > 0 && (
                  <ul className="cw-list">
                    {session.penalties.map((penalty) => (
                      <li key={`${penalty.sourceActionId}-${penalty.expiresOwnTurn}-${penalty.feet}`}>
                        Movement penalty {penalty.feet}ft ({penalty.sourceActionId}), {penalty.expiresBoundary}, own
                        turn {penalty.expiresOwnTurn}
                      </li>
                    ))}
                  </ul>
                )}
                <ol className="cw-log">
                  {session.log.map((entry) => (
                    <li key={entry.id} className={`cw-log-${entry.kind}`}>
                      {entry.text}
                    </li>
                  ))}
                </ol>
                <p className="cw-muted">
                  Closing or reloading has no durability guarantee; export the worksheet to keep it.
                </p>
              </section>
            )}
          </div>
        )}

        {activeTab === 'authoring' && (
          <div className="cw-panel">
            <section className="cw-card">
              <h3>Package validation</h3>
              <p>
                {packageCheck.ok ? (
                  <strong className="cw-ok">Certified C1 content package.</strong>
                ) : (
                  <strong className="cw-bad">Package problems detected.</strong>
                )}{' '}
                {packageCheck.counts.total} unique records: {packageCheck.counts.optional} optional,{' '}
                {packageCheck.counts.core} core, {packageCheck.counts.talentActives} talent actives,{' '}
                {packageCheck.counts.passives} rank-passives; {packageCheck.counts.nodes} nodes across{' '}
                {packageCheck.counts.trees} trees.
              </p>
              {packageCheck.errors.length > 0 && (
                <ul className="cw-list cw-bad">
                  {packageCheck.errors.map((error) => <li key={error}>{error}</li>)}
                </ul>
              )}
            </section>

            <section className="cw-card">
              <h3>Record inspector</h3>
              <label className="cw-field">
                <span>Closed C1 record profile</span>
                <select value={inspectRecordId} onChange={(event) => {
                  const recordId = event.target.value;
                  setInspectRecordId(recordId);
                  const record =
                    CHAOS_WEAVER_SPELLS_BY_ID[recordId] || CHAOS_WEAVER_PASSIVE_SPELLS_BY_ID[recordId];
                  setBranchDraft({
                    recordId,
                    text: record && record.branchRule ? JSON.stringify(record.branchRule, null, 2) : '',
                    saved: false
                  });
                }}>
                  <optgroup label="Active records">
                    {CHAOS_WEAVER_ACTIVE_SPELLS.map((record) => (
                      <option key={record.id} value={record.id}>{record.name} ({record.id})</option>
                    ))}
                  </optgroup>
                  <optgroup label="Rank-passives">
                    {CHAOS_WEAVER_PASSIVE_SPELLS.map((record) => (
                      <option key={record.id} value={record.id}>{record.name} ({record.id})</option>
                    ))}
                  </optgroup>
                </select>
              </label>
              <p>
                <strong>{inspectedRecord.name}</strong> &middot;{' '}
                {inspectedProfile.ok ? <span className="cw-ok">profile valid</span> : <span className="cw-bad">profile errors</span>}
              </p>
              {!inspectedProfile.ok && (
                <ul className="cw-list cw-bad">
                  {inspectedProfile.errors.map((error) => <li key={error}>{error}</li>)}
                </ul>
              )}
              <dl className="cw-facts">
                {RECORD_FIELD_SUMMARY.map(([label, reader]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{reader(inspectedRecord)}</dd>
                  </div>
                ))}
              </dl>
              {inspectedRecord.branchRule && (
                <div>
                  <h4>Full branch table</h4>
                  <ul className="cw-list">
                    {Object.entries(inspectedRecord.branchRule.outcomes).map(([symbol, outcome]) => (
                      <li key={symbol}>
                        <strong>{symbol}</strong>: {outcomeText(outcome)}
                      </li>
                    ))}
                  </ul>
                  <p className="cw-muted">
                    Selection {inspectedRecord.branchRule.selection}; {inspectedRecord.branchRule.sampleNote}
                  </p>
                </div>
              )}
              <h4>Mapping reference (fixed before the face)</h4>
              <ul className="cw-list">
                {MAP_REFERENCE.map(([count, text]) => (
                  <li key={count}>
                    <strong>{count}:</strong> {text}
                  </li>
                ))}
              </ul>
              <p className="cw-muted">
                One anomaly: {CHAOS_WEAVER_SETTLEMENT_RULES.oneAnomaly} One continuation:{' '}
                {CHAOS_WEAVER_SETTLEMENT_RULES.continuationTiming}
              </p>
              {inspectedRecord.rankValues && (
                <div>
                  <h4>Rank values</h4>
                  <ul className="cw-list">
                    {inspectedRecord.rankValues.map((entry) => (
                      <li key={entry.rank}>Rank {entry.rank}: {entry.text}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="cw-muted">Sources: {inspectedRecord.sourceRefs.join('; ')}</p>
            </section>

            <section className="cw-card">
              <h3>Branch replacement draft</h3>
              <p className="cw-muted">
                Editing here never touches the authored modules. A replacement may be saved as an unsupported custom
                draft; it is never executable C1 and stays outside certification.
              </p>
              {inspectedRecord.branchRule ? (
                <div>
                  <label className="cw-field">
                    <span>Replacement branch JSON (text only)</span>
                    <textarea
                      rows="8"
                      value={branchDraft.recordId === inspectedRecord.id ? branchDraft.text : JSON.stringify(inspectedRecord.branchRule, null, 2)}
                      onChange={(event) => handleBranchDraftChange(inspectedRecord.id, event.target.value)}
                    />
                  </label>
                  <button type="button" className="cw-btn" onClick={saveBranchDraft}>
                    Save as unsupported custom draft
                  </button>
                  {branchDraft.saved && branchDraft.recordId === inspectedRecord.id && (
                    <p className="cw-bad" role="status">
                      Unsupported custom draft saved locally in this view only &mdash; not executable C1, excluded from
                      the certified package.
                    </p>
                  )}
                </div>
              ) : (
                <p className="cw-muted">This record has no branch table to replace.</p>
              )}
            </section>

            <section className="cw-card">
              <h3>Export packet</h3>
              <p className="cw-muted">
                Data only: schemaVersion 1, authoredOnly true, executionEnabled false, all 97 records plus resource
                rules, progression, talents, native variants and {session.status === 'active' ? 'the active rehearsal worksheet' : 'no rehearsal (session is uninitialized)'}.
              </p>
              <button type="button" className="cw-btn cw-btn-primary" onClick={handleExport}>
                Build export packet
              </button>
              {exportText && (
                <label className="cw-field">
                  <span>Exported packet (copy manually; nothing is stored)</span>
                  <textarea rows="10" readOnly value={exportText} />
                </label>
              )}
            </section>

            <section className="cw-card">
              <h3>Import packet</h3>
              <label className="cw-field">
                <span>Paste a C1 packet</span>
                <textarea
                  rows="10"
                  value={importText}
                  onChange={(event) => setImportText(event.target.value)}
                />
              </label>
              <button type="button" className="cw-btn" onClick={handleImport} disabled={importText.trim().length === 0}>
                Inspect and import
              </button>
              {importFeedback && (
                <div role="status">
                  {importFeedback.ok ? (
                    <p className="cw-ok">{importFeedback.message}</p>
                  ) : (
                    <div className="cw-bad">
                      <p>
                        <strong>Not certified C1.</strong> The original text is retained above as draft bytes and is
                        never treated as validated content.
                      </p>
                      <ul className="cw-list">
                        {importFeedback.errors.map((error) => <li key={error}>{error}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </section>
  );
};

const TILE_SYMBOL_MAP = { S1: 'S', S2: 'S', M1: 'M', M2: 'M', F1: 'F', F2: 'F' };
const tileSymbolOf = (tileId) => TILE_SYMBOL_MAP[tileId];

export default ChaosWeaverWorkshop;
