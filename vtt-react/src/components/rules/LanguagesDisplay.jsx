import React, { useState } from 'react';
import { LANGUAGES, LANGUAGE_CATEGORIES } from '../../data/languages';
import './BackgroundSelector.css';

const PUB = process.env.PUBLIC_URL || '';

const LANG_WATERCOLOR = {
  standard: 'watercolor_scroll',
  exotic: 'watercolor_dragon',
  racial: 'watercolor_shield',
  elemental: 'watercolor_flask',
  secret: 'watercolor_shackles',
  special: 'watercolor_tome'
};

const CATEGORY_SCRIPT_META = {
  standard: { scriptLabel: 'Trade Script', scriptSample: 'Well met, good merchant', ink: 'Ink: Iron-gall, common hand' },
  exotic: { scriptLabel: 'Otherworld Script', scriptSample: "X'keth-vorath ix'amar", ink: 'Ink: Ash & ember-glass' },
  racial: { scriptLabel: 'Ancestral Script', scriptSample: 'Frosthald hungrvegr', ink: 'Ink: Stone-dust & frost' },
  elemental: { scriptLabel: 'Elemental Script', scriptSample: "Kh'aur-dra ign'vael", ink: 'Ink: Air, fire, water, earth' },
  secret: { scriptLabel: 'Cipher Script', scriptSample: 'The red door is warm', ink: 'Ink: Invisible until shared' },
  special: { scriptLabel: 'Scholar Script', scriptSample: 'Words without sound', ink: 'Ink: Universal gesture' }
};

const COMMON_LANGUAGES = LANGUAGES;

const LanguagesDisplay = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const languagesByCategory = COMMON_LANGUAGES.reduce((acc, lang) => {
    if (!acc[lang.category]) acc[lang.category] = [];
    acc[lang.category].push(lang);
    return acc;
  }, {});

  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
    setSelectedCategory(null);
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedLanguage(null);
  };

  const handleBackClick = () => {
    if (selectedLanguage) setSelectedLanguage(null);
    else if (selectedCategory) setSelectedCategory(null);
  };

  // ── Step 1: Codex landing — parchment guide + illuminated Hall of Tongues ──
  if (!selectedCategory && !selectedLanguage) {
    return (
      <div className="languages-codex">
        {/* Guide — same illuminated parchment language as Skills */}
        <div className="languages-codex-guide">
          <div className="premium-parchment-scroll">
            <div className="scroll-title-header">
              <span className="scroll-tag">
                <i className="fas fa-feather-alt"></i> POLYGLOT CODEX
              </span>
              <h3>Tongues of Mythrill</h3>
              <p className="scroll-subtitle">Standard, exotic, secret & elemental — a scribe&apos;s census of every tongue that still answers</p>
            </div>

            <div className="scroll-section">
              <h5><i className="fas fa-scroll"></i> How Tongues Work</h5>
              <p>Every creature that can be parleyed with speaks at least one tongue from this codex. <strong>Common</strong> carries you through markets and muster-fields; everything else opens a door that Common cannot — a closed court, a cold ritual, a whispering mycelium, a wind that answers back.</p>
              <ul>
                <li><strong>Your race speaks first</strong> — granted automatically and always legible on your sheet.</li>
                <li><strong>Background & path</strong> add 1–2 learned tongues of your choice.</li>
                <li><strong>Secret & exotic tongues</strong> demand a teacher, an oath, or a debt — they are never free.</li>
              </ul>
            </div>

            <div className="scroll-section">
              <h5><i className="fas fa-comments"></i> At the Table</h5>
              <p>If you speak a tongue you can <strong>understand, be understood, read, and write</strong> in it. Magical comprehension still requires the tongue to be on your list — spells translate, they do not grant fluency.</p>
              <div className="dc-reference-grid lang-at-table-grid">
                <div className="dc-row"><span>Speak</span><strong>Be understood</strong><span>Whisper, shout, or throat-sing — if the listener knows it, they hear you</span></div>
                <div className="dc-row"><span>Scribe</span><strong>Read & write</strong><span>Letters, contracts, frozen phylacteries — ink is the tongue made durable</span></div>
                <div className="dc-row"><span>Cipher</span><strong>Secret cant</strong><span>Thieves&apos; marks, druidic knots, Trickster&apos;s nested lies — meaning hidden in plain speech</span></div>
              </div>
            </div>

            <div className="scroll-section" style={{ marginBottom: 0 }}>
              <h5><i className="fas fa-map"></i> Seven Regions, Thirty-Five Tongues</h5>
              <p>From Gloom-Tongue murmured beneath Atropolis to Terran grinding in the Cragjaw deep, each language carries the <strong>memory of its people</strong> — their bargains, their exiles, their surviving gods. Learn the tongue and you inherit a fraction of that memory.</p>
            </div>
          </div>
        </div>

        {/* Directory — Hall of Tongues */}
        <div className="languages-codex-directory">
          <div className="languages-index-header">
            <h3>Hall of Tongues</h3>
            <p>Six houses of speech — choose a house to open its ledger</p>
          </div>

          <div className="languages-codex-grid">
            {Object.entries(LANGUAGE_CATEGORIES).map(([categoryId, categoryData]) => {
              const languages = languagesByCategory[categoryId] || [];
              const meta = CATEGORY_SCRIPT_META[categoryId] || {};
              const teaser = languages[0];
              return (
                <div
                  key={categoryId}
                  className="lang-codex-card"
                  data-cat={categoryId}
                  onClick={() => handleCategoryClick(categoryId)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleCategoryClick(categoryId)}
                >
                  {LANG_WATERCOLOR[categoryId] && (
                    <img
                      className="lang-codex-watermark"
                      src={`${PUB}/assets/images/${LANG_WATERCOLOR[categoryId]}.png`}
                      alt=""
                      aria-hidden="true"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}

                  <div className="lang-codex-card-top">
                    <div className="lang-codex-seal">
                      <i className={`fas ${categoryData.icon}`}></i>
                    </div>
                    <div className="lang-codex-count" title={`${languages.length} tongues in this house`}>
                      <span className="lang-count-num">{languages.length}</span>
                      <span className="lang-count-label">{languages.length === 1 ? 'tongue' : 'tongues'}</span>
                    </div>
                  </div>

                  <div className="lang-codex-body">
                    <h3 className="lang-codex-title">{categoryData.name}</h3>
                    <p className="lang-codex-desc">{categoryData.description}</p>
                  </div>

                  <div className="lang-codex-divider" aria-hidden="true">
                    <span className="lang-divider-line"></span>
                    <span className="lang-divider-glyph">◆</span>
                    <span className="lang-divider-line"></span>
                  </div>

                  <div className="lang-codex-script-preview">
                    <span className="lang-script-label">{meta.scriptLabel}</span>
                    <span className="lang-script-sample">&ldquo;{teaser?.example || meta.scriptSample}&rdquo;</span>
                    <span className="lang-script-ink">{meta.ink}</span>
                  </div>

                  <div className="lang-codex-foot">
                    <span className="lang-codex-cta">Open ledger</span>
                    <i className="fas fa-chevron-right lang-codex-arrow"></i>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Category ledger
  if (selectedCategory && !selectedLanguage) {
    const categoryLanguages = languagesByCategory[selectedCategory];
    const categoryData = LANGUAGE_CATEGORIES[selectedCategory];
    const meta = CATEGORY_SCRIPT_META[selectedCategory] || {};

    return (
      <div className="languages-codex">
        <button className="back-button" onClick={handleBackClick}>
          <i className="fas fa-arrow-left"></i> Back to Hall of Tongues
        </button>

        <div className="lang-ledger-header">
          <div className="lang-ledger-header-main">
            <div className="lang-ledger-seal">
              <i className={`fas ${categoryData.icon}`}></i>
            </div>
            <div>
              <h2>{categoryData.name}</h2>
              <p>{categoryData.description}</p>
              <div className="lang-ledger-meta">
                <span className="lang-ledger-count"><i className="fas fa-feather"></i> {categoryLanguages.length} tongues</span>
                <span className="lang-ledger-script"><i className="fas fa-pen-nib"></i> {meta.scriptLabel} — {meta.ink}</span>
              </div>
            </div>
          </div>
          <div className="lang-ledger-ornament" aria-hidden="true">— ◆ —</div>
        </div>

        <div className="lang-ledger-grid">
          {categoryLanguages.map((language) => (
            <div
              key={language.name}
              className="lang-ledger-card"
              onClick={() => handleLanguageClick(language)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleLanguageClick(language)}
            >
              <div className="lang-ledger-card-head">
                <div className="lang-ledger-icon">
                  <i className={`fas ${language.icon}`}></i>
                </div>
                <h4 className="lang-ledger-name">{language.name}</h4>
              </div>
              <p className="lang-ledger-desc">{language.description}</p>
              <div className="lang-ledger-details">
                <div className="lang-ledger-sound">
                  <i className="fas fa-music"></i>
                  <span>{language.sound}</span>
                </div>
                <div className="lang-ledger-example">
                  <i className="fas fa-quote-left"></i>
                  <div className="lang-ledger-example-content">
                    <span className="lang-ledger-example-text">"{language.example}"</span>
                    <span className="lang-ledger-example-trans">— {language.translation}</span>
                  </div>
                </div>
              </div>
              <div className="lang-ledger-badge">
                <i className={`fas ${categoryData.icon}`}></i>
                <span>{categoryData.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Step 3: Language folio
  if (selectedLanguage) {
    const categoryData = LANGUAGE_CATEGORIES[selectedLanguage.category];

    return (
      <div className="languages-codex">
        <button className="back-button" onClick={handleBackClick}>
          <i className="fas fa-arrow-left"></i> Back to {categoryData.name}
        </button>

        <div className="lang-folio">

          <div className="lang-folio-header">
            <div className="lang-folio-header-row">
              <div className="lang-folio-seal">
                <i className={`fas ${selectedLanguage.icon}`}></i>
              </div>
              <div className="lang-folio-title-block">
                <span className="lang-folio-kicker"><i className={`fas ${categoryData.icon}`}></i> {categoryData.name}</span>
                <h2>{selectedLanguage.name}</h2>
                <p className="lang-folio-desc">{selectedLanguage.description}</p>
              </div>
            </div>

            <div className="lang-folio-script-box">
              <div className="lang-folio-script-row">
                <i className="fas fa-music"></i>
                <div>
                  <strong>Sounds like</strong>
                  <span>{selectedLanguage.sound}</span>
                </div>
              </div>
              <div className="lang-folio-script-row">
                <i className="fas fa-quote-left"></i>
                <div className="lang-folio-quote">
                  <strong>Example</strong>
                  <span className="lang-folio-phrase">"{selectedLanguage.example}"</span>
                  <span className="lang-folio-trans">— {selectedLanguage.translation}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="benefits-section">
            <h4>House Ledger — {categoryData.name}</h4>
            <ul className="equipment-items">
              {languagesByCategory[selectedLanguage.category].map((language) => (
                <li key={language.name} className={language.name === selectedLanguage.name ? 'is-active' : ''}>
                  <i className={`fas ${language.icon}`}></i>
                  <span>{language.name}</span>
                  {language.name === selectedLanguage.name && <em> — you are here</em>}
                </li>
              ))}
            </ul>
            <p className="language-type-description" style={{ marginTop: 12 }}>{categoryData.description}</p>
          </div>

          <div className="benefits-section">
            <h4>Typical Speakers</h4>
            <ul className="equipment-items">
              {selectedLanguage.name === 'Deep-Thrum' && (
                <>
                  <li><i className="fas fa-check"></i> Thrumm stone-trolls of the Cragjaw Peaks</li>
                  <li><i className="fas fa-check"></i> Groven who hear the mountain in their Vat-Sleep</li>
                  <li><i className="fas fa-check"></i> Geologists and miners of the Sump Galleries</li>
                  <li><i className="fas fa-check"></i> Those who listen to the Deep Thrum's stirring</li>
                </>
              )}
              {selectedLanguage.name === 'Synod-Speak' && (
                <>
                  <li><i className="fas fa-check"></i> Astril scholars of the Synod Hold</li>
                  <li><i className="fas fa-check"></i> Lumian echo-signatures and their vessels</li>
                  <li><i className="fas fa-check"></i> Crystal-lattice archivists and historians</li>
                  <li><i className="fas fa-check"></i> Those who study spirit-genealogies</li>
                </>
              )}
              {selectedLanguage.name === 'Thrumm-Speech' && (
                <>
                  <li><i className="fas fa-check"></i> Ancient stone-trolls of the Cragjaw Peaks</li>
                  <li><i className="fas fa-check"></i> The mountain's own mineral consciousness</li>
                  <li><i className="fas fa-check"></i> Geothermal entities and deep-earth beings</li>
                  <li><i className="fas fa-check"></i> Hermits who spend decades learning a single phrase</li>
                </>
              )}
              {selectedLanguage.name === 'Gear-Cant' && (
                <>
                  <li><i className="fas fa-check"></i> Fexric Deep Alchemists and engineers</li>
                  <li><i className="fas fa-check"></i> Forge-wrights from Harath-Vault to Bloodhammer Sump</li>
                  <li><i className="fas fa-check"></i> Guild artificers and schematic-annotators</li>
                  <li><i className="fas fa-check"></i> Anyone who builds what has never been built before</li>
                </>
              )}
              {selectedLanguage.name === 'Scrap-Tongue' && (
                <>
                  <li><i className="fas fa-check"></i> Frostwood Reach salvage-crews and peat-bog scavengers</li>
                  <li><i className="fas fa-check"></i> The Revel's abandoned courtiers who never left the party</li>
                  <li><i className="fas fa-check"></i> Lesser fae who trade in fog-charms and resin</li>
                  <li><i className="fas fa-check"></i> Anyone living on the margins of the Mist-Gate Market</li>
                </>
              )}
              {selectedLanguage.name === 'Mound-Tongue' && (
                <>
                  <li><i className="fas fa-check"></i> Ordan nomads of the Sundrift Vale steppe</li>
                  <li><i className="fas fa-check"></i> Throat-singers who navigate by ancestor-harmonics</li>
                  <li><i className="fas fa-check"></i> Mound-camp elders and migration-leaders</li>
                  <li><i className="fas fa-check"></i> Travelers crossing the starless grasslands</li>
                </>
              )}
              {selectedLanguage.name === 'War-Cant' && (
                <>
                  <li><i className="fas fa-check"></i> Bloodhammer Sump veterans and skirmishers</li>
                  <li><i className="fas fa-check"></i> Nordhalla's Rime-Born warriors</li>
                  <li><i className="fas fa-check"></i> Mercenary companies operating across all seven regions</li>
                  <li><i className="fas fa-check"></i> Anyone trained in geothermal or high-altitude combat</li>
                </>
              )}
              {selectedLanguage.name === 'Abyssal' && (
                <>
                  <li><i className="fas fa-check"></i> Keth Amar's silence-spawn and demonic entities</li>
                  <li><i className="fas fa-check"></i> Cultists who serve Scathrach the Ashen Sovereign</li>
                  <li><i className="fas fa-check"></i> Corrupted creatures from the abyssal silence</li>
                  <li><i className="fas fa-check"></i> Exorcists and dark channelers who bind what they study</li>
                </>
              )}
              {selectedLanguage.name === 'Celestial' && (
                <>
                  <li><i className="fas fa-check"></i> Lumian echo and its Astril vessels</li>
                  <li><i className="fas fa-check"></i> Solari martyrs who tend Emberspire's wound</li>
                  <li><i className="fas fa-check"></i> Hollow-Solari Sun-Speakers in their sacred vigil</li>
                  <li><i className="fas fa-check"></i> Those who carry the memory of stars in their blood</li>
                </>
              )}
              {selectedLanguage.name === 'Wyrm-Script' && (
                <>
                  <li><i className="fas fa-check"></i> Ice-wyrms of the Hunger Glaciers</li>
                  <li><i className="fas fa-check"></i> Lichborne souls bound to basalt phylacteries</li>
                  <li><i className="fas fa-check"></i> Frozen Archive scholars studying the oldest texts</li>
                  <li><i className="fas fa-check"></i> Practitioners of the Rite of the Cold Hearth</li>
                </>
              )}
              {selectedLanguage.name === 'Root-Veil' && (
                <>
                  <li><i className="fas fa-check"></i> Morvane and fungal entities</li>
                  <li><i className="fas fa-check"></i> Over-Lit Vreken who hear it constantly</li>
                  <li><i className="fas fa-check"></i> Ghost-Mycelium and the Hush-Bogs themselves</li>
                  <li><i className="fas fa-check"></i> Entities that predate all surface civilization</li>
                </>
              )}
              {selectedLanguage.name === 'Infernal' && (
                <>
                  <li><i className="fas fa-check"></i> Aethil's enforcement-mechanisms</li>
                  <li><i className="fas fa-check"></i> Neth contract-houses drafting deathless clauses</li>
                  <li><i className="fas fa-check"></i> Arcanoneers who bind spells to formal agreements</li>
                  <li><i className="fas fa-check"></i> Any being bound by the First Contract's oldest sections</li>
                </>
              )}
              {selectedLanguage.name === 'Primordial' && (
                <>
                  <li><i className="fas fa-check"></i> Elementals of all four primal forces</li>
                  <li><i className="fas fa-check"></i> Mareth and the Deep Thrum's oldest dialect</li>
                  <li><i className="fas fa-check"></i> Planar scholars and elemental channelers</li>
                  <li><i className="fas fa-check"></i> Creatures native to elemental intelligences</li>
                </>
              )}
              {selectedLanguage.name === 'Sylvan' && (
                <>
                  <li><i className="fas fa-check"></i> Fae entities who accepted House Viridane's counter-bargain</li>
                  <li><i className="fas fa-check"></i> Florae Trueborn who sing to their groves</li>
                  <li><i className="fas fa-check"></i> The Revel's endlessly-celebrating courtiers</li>
                  <li><i className="fas fa-check"></i> Moonlit groves where promises echo forever</li>
                </>
              )}
              {selectedLanguage.name === 'Shanty-Patois' && (
                <>
                  <li><i className="fas fa-check"></i> Over-Shanty residents beneath Atropolis</li>
                  <li><i className="fas fa-check"></i> Drun who trade in silence-codes and rope-bridge tolls</li>
                  <li><i className="fas fa-check"></i> Cult of Forgotten Shadow memory-brokers</li>
                  <li><i className="fas fa-check"></i> Anyone trading in the Gloom without a contract-house</li>
                </>
              )}
              {selectedLanguage.name === 'Hex-Speech' && (
                <>
                  <li><i className="fas fa-check"></i> Root-ward tenders and bog-curse practitioners</li>
                  <li><i className="fas fa-check"></i> Initiates who absorbed mycelial memory-deposits</li>
                  <li><i className="fas fa-check"></i> Cannot be taught: only absorbed through exposure</li>
                  <li><i className="fas fa-check"></i> Used for secret communications in the Bryngloom</li>
                </>
              )}
              {selectedLanguage.name === 'Trickster\'s Cant' && (
                <>
                  <li><i className="fas fa-check"></i> Gamblers, information brokers, and misdirection-traders</li>
                  <li><i className="fas fa-check"></i> Smugglers and underground networks across all regions</li>
                  <li><i className="fas fa-check"></i> Spies who embed truth inside nested deceptions</li>
                  <li><i className="fas fa-check"></i> Information brokers and street informants</li>
                </>
              )}
              {selectedLanguage.name === 'Aquan' && (
                <>
                  <li><i className="fas fa-check"></i> The Iceheart Sea's consciousness: Mareth</li>
                  <li><i className="fas fa-check"></i> Myrathil of all three subraces</li>
                  <li><i className="fas fa-check"></i> Merrow sailors and Brine-marked survivors</li>
                  <li><i className="fas fa-check"></i> Water elementals and deep-ocean entities</li>
                </>
              )}
              {selectedLanguage.name === 'Auran' && (
                <>
                  <li><i className="fas fa-check"></i> Air elementals and sky-dwelling entities</li>
                  <li><i className="fas fa-check"></i> Blizzard-voices above Nordhalla's glacier-spires</li>
                  <li><i className="fas fa-check"></i> Wind-spirits and storm-chasers</li>
                </>
              )}
              {selectedLanguage.name === 'Ignan' && (
                <>
                  <li><i className="fas fa-check"></i> Fire elementals and Emberspire's magma-children</li>
                  <li><i className="fas fa-check"></i> Hollow-Solari Sun-Speakers (they speak it only in their minds)</li>
                  <li><i className="fas fa-check"></i> Salamanders and geothermal vent-creatures</li>
                  <li><i className="fas fa-check"></i> Flame-touched beings and forge-spirits</li>
                </>
              )}
              {selectedLanguage.name === 'Terran' && (
                <>
                  <li><i className="fas fa-check"></i> Earth elementals and stone-touched races</li>
                  <li><i className="fas fa-check"></i> Groven whose speech grinds like Ancestor-Spans shifting</li>
                  <li><i className="fas fa-check"></i> The Deep Thrum's slow reply to those who listen</li>
                  <li><i className="fas fa-check"></i> Mineral consciousness and geological intelligences</li>
                </>
              )}
              {selectedLanguage.name === 'Gloom-Tongue' && (
                <>
                  <li><i className="fas fa-check"></i> Vreken and Neth of the Bryngloom Forest</li>
                  <li><i className="fas fa-check"></i> The Root-Veil's mycelial network (strains it beneath words)</li>
                  <li><i className="fas fa-check"></i> Over-Lit who lose it last before the hush takes them</li>
                  <li><i className="fas fa-check"></i> Anyone raised beneath Atropolis's canopy</li>
                </>
              )}
              {selectedLanguage.name === 'Vale-Speak' && (
                <>
                  <li><i className="fas fa-check"></i> Mimir of the Frostwood Reach</li>
                  <li><i className="fas fa-check"></i> Arch and Fractured Mimir alike</li>
                  <li><i className="fas fa-check"></i> Fog-adapted communities who navigate by voice alone</li>
                  <li><i className="fas fa-check"></i> Those who lost their masks in the Purge ninety years ago</li>
                </>
              )}
              {selectedLanguage.name === 'Sundari' && (
                <>
                  <li><i className="fas fa-check"></i> Solari of Sundale: both Hollow-Solari and Waste-Solari</li>
                  <li><i className="fas fa-check"></i> Solari who tend Emberspire's wound</li>
                  <li><i className="fas fa-check"></i> Pilgrims who have witnessed Sol's Breath's fading</li>
                  <li><i className="fas fa-check"></i> Forge-priests of the Harath-Vault</li>
                </>
              )}
              {selectedLanguage.name === 'Fexric' && (
                <>
                  <li><i className="fas fa-check"></i> Fexric of Frostmaw Holdfast: Clockwork Fexric and Caustic Fexric</li>
                  <li><i className="fas fa-check"></i> Deep Alchemists operating in abyssal tunnels</li>
                  <li><i className="fas fa-check"></i> Guild artificers and vat-technicians</li>
                  <li><i className="fas fa-check"></i> Anyone who works the geothermal foundries</li>
                </>
              )}
              {selectedLanguage.name === 'Corvid-Speech' && (
                <>
                  <li><i className="fas fa-check"></i> Corvani subfolk: raven-marked glacier-dwellers of Nordhalla</li>
                  <li><i className="fas fa-check"></i> Corvid Fate-Spirits bound to Corvani bloodlines</li>
                  <li><i className="fas fa-check"></i> Messengers who carry fate-words between the frozen fjord-keeps</li>
                  <li><i className="fas fa-check"></i> Those who trade in premonition and hidden knowledge</li>
                </>
              )}
              {selectedLanguage.name === 'Old Nord' && (
                <>
                  <li><i className="fas fa-check"></i> Skald humans of Nordhalla</li>
                  <li><i className="fas fa-check"></i> Rune Keepers who trade memories for knowledge</li>
                  <li><i className="fas fa-check"></i> Bloodhammer warriors and frost-chanters</li>
                  <li><i className="fas fa-check"></i> Anyone initiated into the Frozen Archive's traditions</li>
                </>
              )}
              {selectedLanguage.name === 'Ethereal' && (
                <>
                  <li><i className="fas fa-check"></i> Spirits and the Veilborn between worlds</li>
                  <li><i className="fas fa-check"></i> Lumian echo in their vessels' dreams</li>
                  <li><i className="fas fa-check"></i> Wyrd-echoes and ghostly entities</li>
                  <li><i className="fas fa-check"></i> Mediums and spirit-channelers</li>
                </>
              )}
              {selectedLanguage.name === 'Changeling' && (
                <>
                  <li><i className="fas fa-check"></i> Changelings and shapeshifters</li>
                  <li><i className="fas fa-check"></i> Those who wear identities not their own</li>
                  <li><i className="fas fa-check"></i> Spies identifiable only by their speech-patterns</li>
                  <li><i className="fas fa-check"></i> Any being whose face is a negotiation</li>
                </>
              )}
              {selectedLanguage.name === 'Druidic' && (
                <>
                  <li><i className="fas fa-check"></i> Druids and only druids (secret by oath)</li>
                  <li><i className="fas fa-check"></i> Initiates of Bryngloom's deepest groves</li>
                  <li><i className="fas fa-check"></i> Ironwood-heart tenders of the Frostwood Reach</li>
                  <li><i className="fas fa-check"></i> Cannot be learned from books: only passed teacher to initiate</li>
                </>
              )}
              {selectedLanguage.name === 'Beast Speech' && (
                <>
                  <li><i className="fas fa-check"></i> Rangers and those who live among animals</li>
                  <li><i className="fas fa-check"></i> Thrumm stone-trolls (they understand it in their slow way)</li>
                  <li><i className="fas fa-check"></i> Ice-wyrms and crag-cats</li>
                  <li><i className="fas fa-check"></i> Does not confer obedience: only conversation</li>
                </>
              )}
              {selectedLanguage.name === 'Necril' && (
                <>
                  <li><i className="fas fa-check"></i> The undead and Debt-Revenants</li>
                  <li><i className="fas fa-check"></i> Lichborne souls in basalt phylacteries</li>
                  <li><i className="fas fa-check"></i> Necromancers and cold-ritual practitioners</li>
                  <li><i className="fas fa-check"></i> The Frozen Archive's oldest revenant-scribes</li>
                </>
              )}
              {selectedLanguage.name === 'Elemental' && (
                <>
                  <li><i className="fas fa-check"></i> Elementals of all four primal forces</li>
                  <li><i className="fas fa-check"></i> Simplified Primordial for cross-elemental consensus</li>
                  <li><i className="fas fa-check"></i> Planar travelers and elemental summoners</li>
                  <li><i className="fas fa-check"></i> Creatures of mixed elemental heritage</li>
                </>
              )}
              {selectedLanguage.name === 'Primal' && (
                <>
                  <li><i className="fas fa-check"></i> Nature itself: the world speaking to itself</li>
                  <li><i className="fas fa-check"></i> Frostwood ironwood trees and Bryngloom peat-bogs</li>
                  <li><i className="fas fa-check"></i> Wild and ancient beings across all seven regions</li>
                  <li><i className="fas fa-check"></i> Older than the Dark Bargains, older than Sol's binding</li>
                </>
              )}
              {selectedLanguage.name === 'Thieves\' Cant' && (
                <>
                  <li><i className="fas fa-check"></i> Rogues, smugglers, and underworld operatives</li>
                  <li><i className="fas fa-check"></i> The Drun's silence-coded argot</li>
                  <li><i className="fas fa-check"></i> Cult of Forgotten Shadow's corrupted dialect</li>
                  <li><i className="fas fa-check"></i> Cannot be learned without underworld initiation</li>
                </>
              )}
              {selectedLanguage.name === 'Sign Language' && (
                <>
                  <li><i className="fas fa-check"></i> Anyone: developed by Groven Vat-Breakers</li>
                  <li><i className="fas fa-check"></i> Silent communication across all language barriers</li>
                  <li><i className="fas fa-check"></i> Used in ambushes, stealth missions, and loud environments</li>
                  <li><i className="fas fa-check"></i> Adapted across all seven regions after the rebellion</li>
                </>
              )}
              {selectedLanguage.name === 'All Ancient Languages' && (
                <>
                  <li><i className="fas fa-check"></i> Elite scholars and eternal archivists</li>
                  <li><i className="fas fa-check"></i> Pre-Binding dialects from before Sol was entombed</li>
                  <li><i className="fas fa-check"></i> Languages whose last speakers calcified into Ancestor-Spans</li>
                  <li><i className="fas fa-check"></i> Granted only through decades of dedicated study</li>
                </>
              )}
              {selectedLanguage.name === 'Common' && (
                <>
                  <li><i className="fas fa-check"></i> All civilized races across the seven regions</li>
                  <li><i className="fas fa-check"></i> Merchants and traders on every trade route</li>
                  <li><i className="fas fa-check"></i> City dwellers and travelers of all backgrounds</li>
                  <li><i className="fas fa-check"></i> Born from necessity after the Dark Bargains fractured every house</li>
                </>
              )}
            </ul>
          </div>

          <div className="benefits-section">
            <h4>Learning This Tongue</h4>
            <ul className="equipment-items">
              <li><i className="fas fa-check"></i> Granted by your race (some races start with specific languages)</li>
              <li><i className="fas fa-check"></i> Choose from your background (most backgrounds grant 1–2 additional languages)</li>
              <li><i className="fas fa-check"></i> Choose from your path (some paths grant language options)</li>
              {selectedLanguage.category === 'secret' && (
                <li><i className="fas fa-exclamation-triangle"></i> Secret tongues require special training or membership</li>
              )}
              {selectedLanguage.category === 'exotic' && (
                <li><i className="fas fa-info-circle"></i> Exotic tongues are rare and usually require special circumstances to learn</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LanguagesDisplay;
