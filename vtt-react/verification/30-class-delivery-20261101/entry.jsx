import React from 'react';
import { createRoot } from 'react-dom/client';
import CovenbaneResourceDisplay from '../../src/components/hud/CovenbaneResourceDisplay';
import ExorcistResourceDisplay from '../../src/components/hud/ExorcistResourceDisplay';
import DreadnaughtResourceDisplay from '../../src/components/hud/DreadnaughtResourceDisplay';
import BladedancerResourceDisplay from '../../src/components/hud/BladedancerResourceDisplay';
import InscriptorResourceDisplay from '../../src/components/hud/InscriptorResourceDisplay';
import TotemistResourceDisplay from '../../src/components/hud/TotemistResourceDisplay';
import WitchDoctorResourceDisplay from '../../src/components/hud/WitchDoctorResourceDisplay';

function Harness() {
  return (
    <div style={{ padding: 24, background: '#111413', color: '#e5e7eb', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 22, borderBottom: '1px solid #374151', paddingBottom: 8 }}>
        Target 7 Classes — Mounted Production React Resource Displays
      </h1>

      {/* 1. BLADEDANCER */}
      <section id="section-bladedancer" style={{ marginTop: 24, padding: 16, background: '#181e1b', borderRadius: 8, border: '1px solid #2d3748' }}>
        <h2>1. Bladedancer (Kinetic Momentum 0-10)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          <div id="bd-empty" className="test-card">
            <h3>Empty (0 / 10 - Adagio)</h3>
            <BladedancerResourceDisplay resource={0} />
          </div>
          <div id="bd-partial-andante" className="test-card">
            <h3>Partial (4 / 10 - Andante)</h3>
            <BladedancerResourceDisplay resource={{ momentum: 4 }} />
          </div>
          <div id="bd-partial-allegro" className="test-card">
            <h3>Partial (7 / 10 - Allegro)</h3>
            <BladedancerResourceDisplay resource={{ momentum: 7 }} />
          </div>
          <div id="bd-full" className="test-card">
            <h3>Full (10 / 10 - Presto)</h3>
            <BladedancerResourceDisplay resource={10} />
          </div>
          <div id="bd-malformed" className="test-card">
            <h3>Malformed (null, NaN, overflow 15)</h3>
            <BladedancerResourceDisplay resource={null} />
            <div style={{ marginTop: 8 }} />
            <BladedancerResourceDisplay resource={{ momentum: NaN }} />
            <div style={{ marginTop: 8 }} />
            <BladedancerResourceDisplay resource={15} />
          </div>
        </div>
        <div id="bd-multi" style={{ marginTop: 16 }}>
          <h3>Multi-Instance (3 Tokens)</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}><BladedancerResourceDisplay resource={1} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><BladedancerResourceDisplay resource={5} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><BladedancerResourceDisplay resource={9} /></div>
          </div>
        </div>
      </section>

      {/* 2. INSCRIPTOR */}
      <section id="section-inscriptor" style={{ marginTop: 24, padding: 16, background: '#181e1b', borderRadius: 8, border: '1px solid #2d3748' }}>
        <h2>2. Inscriptor (Runic Resonance 0-10)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          <div id="insc-empty" className="test-card">
            <h3>Empty (0 / 10)</h3>
            <InscriptorResourceDisplay resource={0} />
          </div>
          <div id="insc-partial" className="test-card">
            <h3>Partial (5 / 10)</h3>
            <InscriptorResourceDisplay resource={{ resonance: 5 }} />
          </div>
          <div id="insc-full" className="test-card">
            <h3>Full (10 / 10)</h3>
            <InscriptorResourceDisplay resource={10} />
          </div>
          <div id="insc-malformed" className="test-card">
            <h3>Malformed (null, overflow 12)</h3>
            <InscriptorResourceDisplay resource={null} />
            <div style={{ marginTop: 8 }} />
            <InscriptorResourceDisplay resource={12} />
          </div>
        </div>
        <div id="insc-multi" style={{ marginTop: 16 }}>
          <h3>Multi-Instance (3 Tokens)</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}><InscriptorResourceDisplay resource={2} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><InscriptorResourceDisplay resource={6} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><InscriptorResourceDisplay resource={10} /></div>
          </div>
        </div>
      </section>

      {/* 3. TOTEMIST */}
      <section id="section-totemist" style={{ marginTop: 24, padding: 16, background: '#181e1b', borderRadius: 8, border: '1px solid #2d3748' }}>
        <h2>3. Totemist (Attunement 0-10, Pylons 0-3)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          <div id="tot-empty" className="test-card">
            <h3>Empty (0 / 10, 0 / 3 Pylons)</h3>
            <TotemistResourceDisplay resource={{ attunement: 0, activePylons: 0 }} />
          </div>
          <div id="tot-partial" className="test-card">
            <h3>Partial (4 / 10, 2 / 3 Pylons)</h3>
            <TotemistResourceDisplay resource={{ attunement: 4, activePylons: 2 }} />
          </div>
          <div id="tot-full" className="test-card">
            <h3>Full (10 / 10, 3 / 3 Pylons)</h3>
            <TotemistResourceDisplay resource={{ attunement: 10, activePylons: 3 }} />
          </div>
          <div id="tot-malformed" className="test-card">
            <h3>Malformed (null, overflow 5 pylons)</h3>
            <TotemistResourceDisplay resource={null} />
            <div style={{ marginTop: 8 }} />
            <TotemistResourceDisplay resource={{ attunement: 25, activePylons: 5 }} />
          </div>
        </div>
        <div id="tot-multi" style={{ marginTop: 16 }}>
          <h3>Multi-Instance (3 Tokens)</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}><TotemistResourceDisplay resource={{ attunement: 1, activePylons: 1 }} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><TotemistResourceDisplay resource={{ attunement: 5, activePylons: 2 }} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><TotemistResourceDisplay resource={{ attunement: 8, activePylons: 3 }} /></div>
          </div>
        </div>
      </section>

      {/* 4. WITCH DOCTOR */}
      <section id="section-witchdoctor" style={{ marginTop: 24, padding: 16, background: '#181e1b', borderRadius: 8, border: '1px solid #2d3748' }}>
        <h2>4. Witch Doctor (Bog Tallow 0-100%)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          <div id="wd-empty" className="test-card">
            <h3>Empty (0%)</h3>
            <WitchDoctorResourceDisplay resource={0} />
          </div>
          <div id="wd-partial" className="test-card">
            <h3>Partial (50% Baseline)</h3>
            <WitchDoctorResourceDisplay resource={{ tallow: 50 }} />
          </div>
          <div id="wd-full" className="test-card">
            <h3>Full (100%)</h3>
            <WitchDoctorResourceDisplay resource={100} />
          </div>
          <div id="wd-malformed" className="test-card">
            <h3>Malformed (null, overflow 150)</h3>
            <WitchDoctorResourceDisplay resource={null} />
            <div style={{ marginTop: 8 }} />
            <WitchDoctorResourceDisplay resource={150} />
          </div>
        </div>
        <div id="wd-multi" style={{ marginTop: 16 }}>
          <h3>Multi-Instance (3 Tokens)</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}><WitchDoctorResourceDisplay resource={20} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><WitchDoctorResourceDisplay resource={60} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><WitchDoctorResourceDisplay resource={90} /></div>
          </div>
        </div>
      </section>

      {/* 5. COVENBANE */}
      <section id="section-covenbane" style={{ marginTop: 24, padding: 16, background: '#181e1b', borderRadius: 8, border: '1px solid #2d3748' }}>
        <h2>5. Covenbane (Hexbreaker Charges 0-6)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          <div id="cov-empty" className="test-card">
            <h3>Empty (0 / 6)</h3>
            <CovenbaneResourceDisplay resource={0} />
          </div>
          <div id="cov-partial" className="test-card">
            <h3>Partial (3 / 6)</h3>
            <CovenbaneResourceDisplay resource={{ charges: 3 }} />
          </div>
          <div id="cov-full" className="test-card">
            <h3>Full (6 / 6)</h3>
            <CovenbaneResourceDisplay resource={6} />
          </div>
          <div id="cov-malformed" className="test-card">
            <h3>Malformed (null, overflow 10)</h3>
            <CovenbaneResourceDisplay resource={null} />
            <div style={{ marginTop: 8 }} />
            <CovenbaneResourceDisplay resource={10} />
          </div>
        </div>
        <div id="cov-multi" style={{ marginTop: 16 }}>
          <h3>Multi-Instance (3 Tokens)</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}><CovenbaneResourceDisplay resource={1} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><CovenbaneResourceDisplay resource={4} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><CovenbaneResourceDisplay resource={6} /></div>
          </div>
        </div>
      </section>

      {/* 6. EXORCIST */}
      <section id="section-exorcist" style={{ marginTop: 24, padding: 16, background: '#181e1b', borderRadius: 8, border: '1px solid #2d3748' }}>
        <h2>6. Exorcist (Purification Sanctity 0-10)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          <div id="exo-empty" className="test-card">
            <h3>Empty (0 / 10 - Depleted)</h3>
            <ExorcistResourceDisplay resource={0} />
          </div>
          <div id="exo-partial" className="test-card">
            <h3>Partial (5 / 10)</h3>
            <ExorcistResourceDisplay resource={{ sanctity: 5 }} />
          </div>
          <div id="exo-full" className="test-card">
            <h3>Full (10 / 10)</h3>
            <ExorcistResourceDisplay resource={10} />
          </div>
          <div id="exo-malformed" className="test-card">
            <h3>Malformed (null, overflow 15)</h3>
            <ExorcistResourceDisplay resource={null} />
            <div style={{ marginTop: 8 }} />
            <ExorcistResourceDisplay resource={15} />
          </div>
        </div>
        <div id="exo-multi" style={{ marginTop: 16 }}>
          <h3>Multi-Instance (3 Tokens)</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}><ExorcistResourceDisplay resource={2} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><ExorcistResourceDisplay resource={6} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><ExorcistResourceDisplay resource={10} /></div>
          </div>
        </div>
      </section>

      {/* 7. DREADNAUGHT */}
      <section id="section-dreadnaught" style={{ marginTop: 24, padding: 16, background: '#181e1b', borderRadius: 8, border: '1px solid #2d3748' }}>
        <h2>7. Dreadnaught (Furnace Pressure 0-100 PSI)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          <div id="dread-empty" className="test-card">
            <h3>Idle (0 PSI)</h3>
            <DreadnaughtResourceDisplay resource={0} />
          </div>
          <div id="dread-working" className="test-card">
            <h3>Working (45 PSI)</h3>
            <DreadnaughtResourceDisplay resource={{ psi: 45 }} />
          </div>
          <div id="dread-supercharged" className="test-card">
            <h3>Supercharged (75 PSI)</h3>
            <DreadnaughtResourceDisplay resource={{ psi: 75 }} />
          </div>
          <div id="dread-overheat" className="test-card">
            <h3>Overheat (95 PSI)</h3>
            <DreadnaughtResourceDisplay resource={95} />
          </div>
          <div id="dread-boundary" className="test-card">
            <h3>Boundary Test (90 PSI)</h3>
            <DreadnaughtResourceDisplay resource={90} />
          </div>
          <div id="dread-malformed" className="test-card">
            <h3>Malformed (null, overflow 120)</h3>
            <DreadnaughtResourceDisplay resource={null} />
            <div style={{ marginTop: 8 }} />
            <DreadnaughtResourceDisplay resource={120} />
          </div>
        </div>
        <div id="dread-multi" style={{ marginTop: 16 }}>
          <h3>Multi-Instance (3 Tokens)</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 260 }}><DreadnaughtResourceDisplay resource={20} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><DreadnaughtResourceDisplay resource={55} /></div>
            <div style={{ flex: 1, minWidth: 260 }}><DreadnaughtResourceDisplay resource={85} /></div>
          </div>
        </div>
      </section>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Harness />);
