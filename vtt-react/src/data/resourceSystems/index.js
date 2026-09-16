import { arcanoneerResourceGuide } from './arcanoneerResourceGuide';
import { crusaderResourceGuide } from './crusaderResourceGuide';
import { wardenResourceGuide } from './wardenResourceGuide';
import { augurResourceGuide } from './augurResourceGuide';
import { chronarchResourceGuide } from './chronarchResourceGuide';
import { animistResourceGuide } from './animistResourceGuide';
import { martyrResourceGuide } from './martyrResourceGuide';
import { toxicologistResourceGuide } from './toxicologistResourceGuide';
import { berserkerResourceGuide } from './berserkerResourceGuide';
import { inquisitorResourceGuide } from './inquisitorResourceGuide';
import { spellguardResourceGuide } from './spellguardResourceGuide';
import { apexResourceGuide } from './apexResourceGuide';
import { lunarchResourceGuide } from './lunarchResourceGuide';
import { minstrelResourceGuide } from './minstrelResourceGuide';
import { harbingerResourceGuide } from './harbingerResourceGuide';
import { plaguebringerResourceGuide } from './plaguebringerResourceGuide';
import { pyrofiendResourceGuide } from './pyrofiendResourceGuide';
import { shaperResourceGuide } from './shaperResourceGuide';
import { revenantResourceGuide } from './revenantResourceGuide';
import { falseProphetResourceGuide } from './falseProphetResourceGuide';
import { gambitResourceGuide } from './gambitResourceGuide';

/**
 * Registry of classes whose Resource System tab uses the v2 layout.
 * Every class now has an authored guide; keys must match the class id
 * (lowercased, spaces -> underscores).
 */
export const RESOURCE_SYSTEM_GUIDES = {
 arcanoneer: arcanoneerResourceGuide,
 crusader: crusaderResourceGuide,
 warden: wardenResourceGuide,
 augur: augurResourceGuide,
 chronarch: chronarchResourceGuide,
 animist: animistResourceGuide,
 martyr: martyrResourceGuide,
 toxicologist: toxicologistResourceGuide,
 berserker: berserkerResourceGuide,
 inquisitor: inquisitorResourceGuide,
 spellguard: spellguardResourceGuide,
 apex: apexResourceGuide,
 lunarch: lunarchResourceGuide,
 minstrel: minstrelResourceGuide,
 harbinger: harbingerResourceGuide,
 plaguebringer: plaguebringerResourceGuide,
 pyrofiend: pyrofiendResourceGuide,
 shaper: shaperResourceGuide,
 revenant: revenantResourceGuide,
 false_prophet: falseProphetResourceGuide,
 gambit: gambitResourceGuide,
};

export const getResourceSystemGuide = (classId) =>
 RESOURCE_SYSTEM_GUIDES[classId] || null;

export const hasResourceSystemGuide = (classId) =>
 Boolean(RESOURCE_SYSTEM_GUIDES[classId]);
