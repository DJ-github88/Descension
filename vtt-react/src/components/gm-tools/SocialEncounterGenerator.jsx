import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from "react";
import "./SocialEncounter.css";

const ICON = (path) => `/assets/icons/${path}`;

const ENCOUNTER_TYPES = [
  { value: "Single NPC", icon: ICON("Status/physical/humanoid-figure-character.png") },
  { value: "Group", icon: ICON("abilities/Social/GroupGathering.png") },
];
const DISPOSITIONS = [
  { value: "Evil", icon: ICON("Status/mental/horned-mask-mental.png"), color: "#a12323" },
  { value: "Neutral", icon: ICON("Status/mental/stylized-face-mask.png"), color: "#8c5e20" },
  { value: "Good", icon: ICON("Status/buff/halo-divine-buff.png"), color: "#2d8552" },
];
const REELS = [
  {
    label: "Scene", icon: ICON("Status/utility/forking-path.png"), items: [
      { value: "Tavern", icon: ICON("Status/utility/mug-tankard-potion.png") },
      { value: "Alleyway", icon: ICON("Status/utility/hooded-figure-cloak.png") },
      { value: "Crossroads", icon: ICON("Status/utility/forking-path.png") },
      { value: "Wilderness", icon: ICON("Status/utility/paw-print-animal.png") },
      { value: "Ruins", icon: ICON("Status/debuff/broken-fragmented-disc.png") },
      { value: "Market", icon: ICON("Status/utility/money-bag-currency.png") },
      { value: "High Road", icon: ICON("Status/movement/boot-glow-movement.png") },
      { value: "Sewers", icon: ICON("Status/utility/grid-lattice-structure.png") },
      { value: "Graveyard", icon: ICON("Status/debuff/undead-bone.png") },
      { value: "Docks", icon: ICON("Status/utility/hand-reaching-grasping.png") },
      { value: "Bridge", icon: ICON("Status/utility/forking-path.png") },
      { value: "Prison", icon: ICON("Status/utility/grid-lattice-structure.png") },
      { value: "Desert", icon: ICON("Status/movement/boot-glow-movement.png") },
      { value: "Cave", icon: ICON("Status/debuff/broken-fragmented-disc.png") },
      { value: "Ship", icon: ICON("Status/movement/boot-glow-movement.png") },
      { value: "Mansion", icon: ICON("Status/defensive/fortified-tower.png") },
      { value: "Slums", icon: ICON("Status/utility/grid-lattice-structure.png") },
      { value: "Festival", icon: ICON("Status/social/bardic-note.png") },
    ],
  },
  {
    label: "Form", icon: ICON("Status/physical/humanoid-figure-character.png"), items: [
      { value: "Humanoid", icon: ICON("Status/physical/humanoid-figure-character.png") },
      { value: "Goblin Stack", icon: ICON("abilities/Dual Knife Goblin.png") },
      { value: "Wild Gnome", icon: ICON("Status/utility/paw-print-glowing.png") },
      { value: "Undead", icon: ICON("Status/debuff/undead-bone.png") },
      { value: "Beastkin", icon: ICON("abilities/Nature/Claw.png") },
      { value: "Construct", icon: ICON("Status/utility/gear-cog-turns.png") },
      { value: "Fiend", icon: ICON("creatures/Demon/Icon1.png") },
      { value: "Ethereal", icon: ICON("Status/magical/ethereal-blob.png") },
      { value: "Giant", icon: ICON("Status/physical/humanoid-figure-character.png") },
      { value: "Dragonkin", icon: ICON("abilities/Nature/Claw.png") },
      { value: "Elemental", icon: ICON("Status/magical/ethereal-blob.png") },
      { value: "Fey", icon: ICON("Status/buff/winged-humanoid-buff.png") },
      { value: "Ooze", icon: ICON("Status/debuff/broken-fragmented-disc.png") },
      { value: "Orcish", icon: ICON("Status/physical/humanoid-figure-character.png") },
      { value: "Celestial", icon: ICON("Status/buff/halo-divine-buff.png") },
      { value: "Aberration", icon: ICON("Status/utility/multiple-eyes-detection.png") },
      { value: "Florakin", icon: ICON("abilities/Nature/Claw.png") },
      { value: "Swarm", icon: ICON("abilities/Social/GroupGathering.png") },
    ],
  },
  {
    label: "Persona", icon: ICON("Status/mental/joyful-mask-mental.png"), items: [
      { value: "Gruff", icon: ICON("Status/mental/face-fangs-eyes-rage.png") },
      { value: "Charming", icon: ICON("Status/buff/smiling-face-glow-buff.png") },
      { value: "Nervous", icon: ICON("Status/mental/fearful-face.png") },
      { value: "Arrogant", icon: ICON("abilities/Social/Golden Crown.png") },
      { value: "Jolly", icon: ICON("Status/mental/joyful-mask-mental.png") },
      { value: "Suspicious", icon: ICON("Status/utility/multiple-eyes-detection.png") },
      { value: "Melancholy", icon: ICON("Status/mental/dazed-blank.png") },
      { value: "Cunning", icon: ICON("Status/mental/brain-intelligence.png") },
      { value: "Cowardly", icon: ICON("Status/mental/fearful-face.png") },
      { value: "Boastful", icon: ICON("Status/mental/face-fangs-eyes-rage.png") },
      { value: "Apathetic", icon: ICON("Status/mental/dazed-blank.png") },
      { value: "Flirtatious", icon: ICON("Status/buff/smiling-face-glow-buff.png") },
      { value: "Enraged", icon: ICON("Status/mental/face-fangs-eyes-rage.png") },
      { value: "Sarcastic", icon: ICON("Status/mental/joyful-mask-mental.png") },
      { value: "Pompous", icon: ICON("abilities/Social/Golden Crown.png") },
      { value: "Weary", icon: ICON("Status/mental/dazed-blank.png") },
      { value: "Zealous", icon: ICON("Status/buff/smiling-face-glow-buff.png") },
      { value: "Cryptic", icon: ICON("Status/utility/multiple-eyes-detection.png") },
    ],
  },
  {
    label: "Hook", icon: ICON("Status/utility/hand-reaching-grasping.png"), items: [
      { value: "Seeks Aid", icon: ICON("Status/utility/hand-reaching-grasping.png") },
      { value: "Offers Work", icon: ICON("items/Misc/Books/book-scroll-parchment-rolled.png") },
      { value: "Has Info", icon: ICON("Status/utility/glasses-goggles-vision.png") },
      { value: "Wants Trade", icon: ICON("Status/utility/swap-exchange.png") },
      { value: "Flees Trouble", icon: ICON("Status/movement/upward-arrow-speed.png") },
      { value: "Blocks Path", icon: ICON("Status/debuff/shield-blocked-debuff.png") },
      { value: "Owes a Debt", icon: ICON("Status/debuff/weight-kg-burden.png") },
      { value: "Needs Escort", icon: ICON("Status/buff/winged-humanoid-buff.png") },
      { value: "Lost Item", icon: ICON("items/Misc/Books/book-scroll-parchment-rolled.png") },
      { value: "Needs Direction", icon: ICON("Status/utility/forking-path.png") },
      { value: "Evading Beast", icon: ICON("Status/movement/upward-arrow-speed.png") },
      { value: "Setting Trap", icon: ICON("Status/combat/concentric-target.png") },
      { value: "Selling Scam", icon: ICON("Status/utility/money-bag-currency.png") },
      { value: "Revenge", icon: ICON("Status/combat/concentric-target.png") },
      { value: "Defending", icon: ICON("Status/defensive/fortified-tower.png") },
      { value: "Foraging", icon: ICON("Status/utility/paw-print-animal.png") },
      { value: "Ransom", icon: ICON("Status/utility/money-bag-currency.png") },
      { value: "Gambling", icon: ICON("abilities/Social/Dice Roll.png") },
    ],
  },
  {
    label: "Secret", icon: ICON("Status/utility/disguise-mask.png"), items: [
      { value: "Is Hunted", icon: ICON("Status/combat/concentric-target.png") },
      { value: "In Disguise", icon: ICON("Status/utility/disguise-mask.png") },
      { value: "Is Cursed", icon: ICON("Status/debuff/glowing-skull-curse.png") },
      { value: "A Betrayer", icon: ICON("Status/debuff/broken-loop.png") },
      { value: "A Witness", icon: ICON("Status/utility/eye-watch-detection.png") },
      { value: "A Spy", icon: ICON("Status/utility/hooded-cloak-stealth.png") },
      { value: "Grieving", icon: ICON("Status/healing/heart-outline-healing.png") },
      { value: "Deep in Debt", icon: ICON("Status/debuff/weight-kg-encumbrance.png") },
      { value: "Is Royalty", icon: ICON("abilities/Social/Golden Crown.png") },
      { value: "Has Illness", icon: ICON("Status/debuff/glowing-skull-curse.png") },
      { value: "Cultist", icon: ICON("Status/debuff/broken-loop.png") },
      { value: "Deserter", icon: ICON("Status/utility/disguise-mask.png") },
      { value: "Possessed", icon: ICON("Status/debuff/undead-bone.png") },
      { value: "Vampiric", icon: ICON("Status/debuff/undead-bone.png") },
      { value: "Amnesiac", icon: ICON("Status/mental/dazed-blank.png") },
      { value: "Smuggler", icon: ICON("Status/utility/hooded-cloak-stealth.png") },
      { value: "Assassin", icon: ICON("Status/combat/concentric-target.png") },
      { value: "Wealthy", icon: ICON("Status/utility/money-bag-currency.png") },
    ],
  },
  {
    label: "Quirk", icon: ICON("Status/social/bardic-note.png"), items: [
      { value: "Back to Wall", icon: ICON("Status/defensive/fortified-tower.png") },
      { value: "Talks to Self", icon: ICON("Status/utility/sound-waves.png") },
      { value: "Always Eating", icon: ICON("Status/utility/chicken-drumstick-food.png") },
      { value: "Avoids Eyes", icon: ICON("abilities/Utility/Senses Closed Eye.png") },
      { value: "Hums Off-Key", icon: ICON("Status/social/bardic-note.png") },
      { value: "Laughs Wrong", icon: ICON("Status/buff/laughing-face-fiery-buff.png") },
      { value: "Counts Things", icon: ICON("abilities/Social/Dice Roll.png") },
      { value: "Never Sits", icon: ICON("Status/movement/upward-arrow-speed.png") },
      { value: "Whispers", icon: ICON("Status/utility/sound-waves.png") },
      { value: "Scratches", icon: ICON("abilities/Nature/Claw.png") },
      { value: "Blind", icon: ICON("abilities/Utility/Senses Closed Eye.png") },
      { value: "Rhymes", icon: ICON("Status/social/bardic-note.png") },
      { value: "Stares", icon: ICON("Status/utility/multiple-eyes-detection.png") },
      { value: "Bows Often", icon: ICON("Status/movement/upward-arrow-speed.png") },
      { value: "Coin Flip", icon: ICON("Status/utility/swap-exchange.png") },
      { value: "Hiccups", icon: ICON("Status/utility/sound-waves.png") },
      { value: "Twitchy", icon: ICON("Status/mental/fearful-face.png") },
      { value: "Limping", icon: ICON("Status/debuff/weight-kg-encumbrance.png") },
    ],
  },
];

const ITEM_H = 48;
const VISIBLE = 3;
const REEL_OFFSET = 10;

const easeOut3 = (t) => 1 - Math.pow(1 - t, 3);
const easeOut5 = (t) => 1 - Math.pow(1 - t, 5);

const IconImg = memo(({ src, size = 20, style = {} }) => {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        pointerEvents: "none",
        ...style,
      }}
    />
  );
});

const Reel = memo(({ items, targetIdx, onDone, index, spinning }) => {
  const n = items.length;
  const REPEATS = 12;
  const extended = useMemo(
    () => Array(REPEATS).fill(null).flatMap(() => items),
    [items]
  );

  const posRef = useRef(null);
  const blurRef = useRef(null);
  const rafRef = useRef(null);
  const slotRef = useRef(targetIdx + n * REEL_OFFSET);

  const [done, setDone] = useState(true);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (posRef.current)
      posRef.current.style.transform = `translate3d(0, ${-(slotRef.current - 1) * ITEM_H}px, 0)`;
  }, []);

  useEffect(() => {
    if (!spinning) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    setDone(false);
    setFlash(false);

    const curSym = Math.round(slotRef.current) % n;
    const freshStart = curSym + n * REEL_OFFSET;
    slotRef.current = freshStart;

    if (posRef.current) {
      posRef.current.style.transform = `translate3d(0, ${-(freshStart - 1) * ITEM_H}px, 0)`;
    }

    const slotsBackward = ((curSym - targetIdx) + n) % n;
    const baseLoops = 4 + index;
    const totalBackward = baseLoops * n + (slotsBackward === 0 ? n : slotsBackward);
    const endSlot = freshStart - totalBackward;

    const totalDuration = 1800 + index * 400;
    const T_WIND = 0.08;
    const T_SPIN = 0.85;
    const T_BOUNCE = 0.92;

    const spinTime = (T_SPIN - T_WIND) * totalDuration;
    const cruiseVelMs = Math.abs(endSlot - (freshStart + 0.4)) * 1.14285 / spinTime;
    const cruiseVel = cruiseVelMs * 16.67;

    let startTime = null;
    let lastPos = freshStart;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const t = Math.min(elapsed / totalDuration, 1);

      let pos;
      if (t < T_WIND) {
        const pt = t / T_WIND;
        pos = freshStart + easeOut3(pt) * 0.4;
      } else if (t < T_SPIN) {
        const pt = (t - T_WIND) / (T_SPIN - T_WIND);
        const startPos = freshStart + 0.4;
        const dist = endSlot - startPos;
        let ease;
        if (pt < 0.25) {
          ease = 2.2857 * pt * pt;
        } else {
          const v = 2 * 2.2857 * 0.25;
          const y0 = 2.2857 * 0.0625;
          ease = y0 + v * (pt - 0.25);
        }
        pos = startPos + ease * dist;
      } else if (t < T_BOUNCE) {
        const pt = (t - T_SPIN) / (T_BOUNCE - T_SPIN);
        pos = endSlot - easeOut3(pt) * 0.35;
      } else {
        const pt = (t - T_BOUNCE) / (1 - T_BOUNCE);
        pos = (endSlot - 0.35) + easeOut5(pt) * 0.35;
      }

      const vel = Math.abs(pos - lastPos);
      lastPos = pos;
      const norm = Math.min(vel / cruiseVel, 1);
      const blur = norm * 4;

      if (posRef.current) posRef.current.style.transform = `translate3d(0, ${-(pos - 1) * ITEM_H}px, 0)`;
      if (blurRef.current) blurRef.current.style.filter = blur > 0.1 ? `blur(${blur}px)` : "";

        if (t >= 1) {
          slotRef.current = endSlot;
          if (posRef.current) posRef.current.style.transform = `translateY(${-(endSlot - 1) * ITEM_H}px)`;
          if (blurRef.current) blurRef.current.style.filter = "";
          setDone(true);
          setFlash(true);
          setTimeout(() => setFlash(false), 480);
          onDone(index);
        } else {
          rafRef.current = requestAnimationFrame(animate);
        }
    };

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = requestAnimationFrame(animate);
    });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [spinning, targetIdx, index, n, onDone]);

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        height: ITEM_H * VISIBLE,
        background: "linear-gradient(180deg, #100804 0%, #0c0602 50%, #100804 100%)",
        borderRadius: 4,
        border: done ? "2px solid #c8a050" : "2px solid #2e1804",
        boxShadow: flash
          ? "inset 0 0 50px rgba(255,215,80,0.9), 0 0 28px rgba(255,215,80,0.7)"
          : done
            ? "inset 0 0 24px rgba(0,0,0,0.98), 0 0 12px rgba(170,120,30,0.25)"
            : "inset 0 0 40px rgba(0,0,0,0.98)",
        transition: "border-color 0.35s ease, box-shadow 0.35s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 30,
          pointerEvents: "none",
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.055) 3px, rgba(0,0,0,0.055) 4px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          pointerEvents: "none",
          height: "38%",
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 45%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          pointerEvents: "none",
          height: "38%",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 45%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          zIndex: 10,
          pointerEvents: "none",
          top: ITEM_H,
          height: ITEM_H,
          borderTop: done ? "2px solid rgba(255,210,80,0.9)" : "1px solid rgba(180,130,40,0.12)",
          borderBottom: done ? "2px solid rgba(255,200,70,0.85)" : "1px solid rgba(180,130,40,0.12)",
          background: flash ? "rgba(255,210,80,0.22)" : done ? "rgba(200,150,50,0.04)" : "transparent",
          transition: "border-color 0.3s, background 0.3s",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            width: 10,
            height: 2,
            marginTop: -1,
            background: done ? "#ffda75" : "#3a2008",
            transition: "background 0.3s",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            width: 10,
            height: 2,
            marginTop: -1,
            background: done ? "#ffda75" : "#3a2008",
            transition: "background 0.3s",
          }}
        />
      </div>

      <div
        ref={posRef}
        style={{
          position: "relative",
          zIndex: 5,
          willChange: "transform",
        }}
      >
        <div ref={blurRef}>
          {(() => {
            if (!done) {
              return extended.map((item, i) => (
                <div
                  key={i}
                  style={{
                    height: ITEM_H,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                    flexShrink: 0,
                  }}
                >
                  <IconImg src={item.icon} size={22} />
                  <span
                    style={{
                      fontSize: 7,
                      fontFamily: "'Cinzel', serif",
                      fontWeight: 900,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: flash ? "#fff" : "#d4aa4b",
                      textAlign: "center",
                      padding: "0 2px",
                      lineHeight: 1.2,
                      opacity: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "90%",
                    }}
                  >
                    {item.value}
                  </span>
                </div>
              ));
            }

            const slotIndex = Math.round(slotRef.current);
            const startVis = Math.max(0, slotIndex - 3);
            const endVis = Math.min(extended.length - 1, slotIndex + 3);

            return (
              <>
                {startVis > 0 && <div style={{ height: startVis * ITEM_H, flexShrink: 0 }} />}
                {extended.slice(startVis, endVis + 1).map((item, i) => {
                  const actualIdx = startVis + i;
                  return (
                    <div
                      key={actualIdx}
                      style={{
                        height: ITEM_H,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        flexShrink: 0,
                      }}
                    >
                      <IconImg src={item.icon} size={22} />
                      <span
                        style={{
                          fontSize: 7,
                          fontFamily: "'Cinzel', serif",
                          fontWeight: 900,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: flash ? "#fff" : "#d4aa4b",
                          textAlign: "center",
                          padding: "0 2px",
                          lineHeight: 1.2,
                          opacity: 1,
                          transition: "color 0.3s",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "90%",
                        }}
                      >
                        {item.value}
                      </span>
                    </div>
                  );
                })}
                {endVis < extended.length - 1 && <div style={{ height: (extended.length - 1 - endVis) * ITEM_H, flexShrink: 0 }} />}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
});

const Toggle = memo(({ label, options, selected, onChange, disabled }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1, minWidth: 0 }}>
      <span
        style={{
          fontSize: 8,
          fontFamily: "'Cinzel',serif",
          fontWeight: 700,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#7a5828",
        }}
      >
        {label}
      </span>
      <div
        style={{
          display: "flex",
          width: "100%",
          borderRadius: 6,
          overflow: "hidden",
          border: "2px solid #b89850",
          boxShadow: "0 2px 8px rgba(80,40,0,0.2), inset 0 1px 0 rgba(255,240,180,0.4)",
          opacity: disabled ? 0.5 : 1,
          transition: "opacity 0.2s",
        }}
      >
        {options.map((opt, i) => {
          const active = selected === opt.value;
          return (
            <button
              key={i}
              onClick={() => !disabled && onChange(opt.value)}
              style={{
                flex: 1,
                padding: "6px 2px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                background: active ? "#2c1808" : "transparent",
                border: "none",
                borderLeft: i > 0 ? "1px solid #b89850" : "none",
                cursor: disabled ? "default" : "pointer",
                transition: "background 0.15s",
              }}
            >
              <IconImg
                src={opt.icon}
                size={14}
                style={{
                  filter: active ? "drop-shadow(0 0 3px rgba(200,150,50,0.6))" : "grayscale(1) brightness(0.5)",
                  opacity: active ? 1 : 0.5,
                  transition: "filter 0.15s, opacity 0.15s",
                }}
              />
              <span
                style={{
                  fontSize: 7,
                  fontFamily: "'Cinzel',serif",
                  fontWeight: 900,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: active ? "#e8c56b" : "#7a5828",
                  transition: "color 0.15s",
                }}
              >
                {opt.value}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

function generateName(type, disp, form, quirk) {
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  

  const formNames = {
    "Goblin Stack": ["Gruk", "Snag", "Zonk", "Borg", "Kuz", "Brak", "Grit"],
    "Orcish": ["Gruush", "Balgor", "Vrak", "Urzal", "Thokk", "Morg"],
    "Wild Gnome": ["Fuzzle", "Pip", "Glimmer", "Sprocket", "Fizzle", "Tink"],
    "Fey": ["Thorn", "Moss", "Oberon", "Elara", "Puck", "Nim"],
    "Florakin": ["Briar", "Oak", "Petal", "Ash", "Sap", "Pine"],
    "Undead": ["Malthus", "Vorag", "Hollow", "Bone-Clatter", "Grave", "Dirge"],
    "Fiend": ["Azazel", "Krul", "Malakor", "Ira", "Vex", "Zarg"],
    "Aberration": ["X'thul", "Glarb", "Vrrss", "Oom", "Zzt", "Gargle"],
    "Ooze": ["Gloop", "Squelch", "Slurp", "Viscous", "Glob", "Drip"],
    "Construct": ["Unit-7", "Aegis", "Gear-Shift", "Brass", "Sentinel", "Bolt"],
    "Elemental": ["Ash", "Crag", "Zephyr", "Ripple", "Ember", "Flint"],
    "Giant": ["Goliath", "Throm", "Ursa", "Krag", "Boulda", "Grum"],
    "Dragonkin": ["Ignis", "Rhaegon", "Drakar", "Vyre", "Zin", "Scale"],
    "Celestial": ["Seraphiel", "Aura", "Luz", "Caelum", "Pax", "Dawn"],
    "Beastkin": ["Fang", "Claw", "Mane", "Talon", "Roar", "Snout"],
    "Ethereal": ["Wraith", "Whisper", "Echo", "Shade", "Fist", "Mist"],
    "Humanoid": ["Kaelen", "Thaddeus", "Bram", "Lyra", "Vane", "Corvo", "Silas", "Elsa", "Finn"]
  };
  
  const epithets = {
    "Whispers": "the Quiet", "Talks to Self": "the Mad", "Hums Off-Key": "the Tone-Deaf",
    "Rhymes": "the Poet", "Always Eating": "the Hungry", "Hiccups": "the Drunk",
    "Blind": "the Unseeing", "Avoids Eyes": "the Shy", "Stares": "the Watcher",
    "Coin Flip": "the Gambler", "Counts Things": "the Calculator",
    "Limping": "the Lame", "Back to Wall": "the Paranoid", "Never Sits": "the Restless",
    "Twitchy": "the Jittery", "Scratches": "the Flea-Bitten", "Laughs Wrong": "the Chuckler",
    "Bows Often": "the Polite"
  };

  const genIndiv = () => {
    const first = rand(formNames[form] || formNames["Humanoid"]);
    const dispEpithet = disp === "Evil" ? rand(["the Vile", "the Cruel", "the Bloodied"]) : 
                        disp === "Good" ? rand(["the Pure", "the Kind", "the Just"]) : 
                        rand(["the Wanderer", "the Unknown", "the Gray"]);
    const useQuirk = Math.random() > 0.3;
    const epithet = useQuirk && epithets[quirk] ? epithets[quirk] : dispEpithet;
    return `${first} ${epithet}`;
  };

  if (type === "Group" || form === "Swarm") {
     const evilAdj = ["Bloodstained", "Shadow", "Vile", "Cruel", "Ruthless", "Shattered"];
     const neutralAdj = ["Wandering", "Silent", "Dusty", "Iron", "Forgotten", "Hidden"];
     const goodAdj = ["Valiant", "Golden", "Bright", "Hopeful", "Noble", "Radiant"];
     
     const quirkMap = {
        "Whispers": "Whispering", "Talks to Self": "Babbling", "Hums Off-Key": "Singing", "Rhymes": "Rhyming",
        "Always Eating": "Gluttonous", "Hiccups": "Drinking", 
        "Blind": "Blind", "Avoids Eyes": "Unseen", "Stares": "Watching",
        "Coin Flip": "Lucky", "Counts Things": "Calculating",
        "Limping": "Broken", "Back to Wall": "Cautious", "Never Sits": "Restless",
        "Twitchy": "Restless", "Scratches": "Itching", "Laughs Wrong": "Laughing",
        "Bows Often": "Courteous"
     };
     
     let adj = quirkMap[quirk] || rand(disp === "Evil" ? evilAdj : disp === "Good" ? goodAdj : neutralAdj);
     
     const hordeNouns = ["Horde", "Legion", "Coven", "Scourge"];
     const natureNouns = ["Court", "Circle", "Thicket", "Grove"];
     const beastNouns = ["Pack", "Hive", "Herd", "Swarm"];
     const civNouns = ["Brotherhood", "Clan", "Company", "Syndicate", "Guild", "Band"];
     
     let noun = civNouns;
     if (["Undead", "Fiend", "Ooze", "Aberration", "Vampiric"].includes(form)) noun = hordeNouns;
     if (["Fey", "Wild Gnome", "Florakin"].includes(form)) noun = natureNouns;
     if (["Beastkin", "Swarm"].includes(form)) noun = beastNouns;
     if (["Construct", "Elemental"].includes(form)) noun = ["Assembly", "Conclave", "Forged"];
     
     const groupSize = Math.floor(Math.random() * 4) + 2; // 2 to 5 members
     const members = Array.from({length: groupSize}, genIndiv);
     
     return { title: `The ${adj} ${rand(noun)}`, members, isGroup: true };
  } else {
     return { title: genIndiv(), members: [], isGroup: false };
  }
}

function analyzeEncounter(type, disp, resultArr) {
  if (!resultArr) return null;
  const [scene, form, personality, hook, secret, quirk] = resultArr.map((r) => r.value);

  const adjectives = {
    Nervous: "Paranoid", Gruff: "Abrasive", Jolly: "Smiling", Cunning: "Scheming",
    Arrogant: "Haughty", Melancholy: "Sorrowful", Charming: "Alluring", Suspicious: "Watchful",
    Cowardly: "Craven", Boastful: "Proud", Apathetic: "Bored", Flirtatious: "Winking", Enraged: "Furious",
    Sarcastic: "Smirking", Pompous: "Haughty", Weary: "Exhausted", Zealous: "Fervent", Cryptic: "Mysterious"
  };
  const nouns = {
    "A Betrayer": "Traitor", "A Spy": "Infiltrator", Grieving: "Mourner", "Deep in Debt": "Debtor",
    "Is Hunted": "Fugitive", "Is Cursed": "Pariah", "In Disguise": "Imposter", "Seeks Aid": "Supplicant",
    "Offers Work": "Contractor", "Has Info": "Informant", "Wants Trade": "Merchant",
    "Blocks Path": "Obstruction", "Flees Trouble": "Runner", "Needs Escort": "Vagabond",
    "Lost Item": "Seeker", "Needs Direction": "Wanderer", "Evading Beast": "Prey", "Setting Trap": "Hunter", "Selling Scam": "Charlatan",
    "Revenge": "Avenger", "Defending": "Guardian", "Foraging": "Gatherer", "Ransom": "Captor", "Gambling": "Risk-taker",
    "Vampiric": "Bloodsucker", "Amnesiac": "Blank-mind", "Smuggler": "Contrabandist", "Assassin": "Killer", "Wealthy": "Aristocrat",
    "Cultist": "Zealot", "Deserter": "Coward", "Possessed": "Vessel", "Is Royalty": "Monarch", "Has Illness": "Plagued"
  };
  const titleNoun = nouns[secret] || nouns[hook] || "Traveler";
  const archetypeTitle = `The ${adjectives[personality] || disp} ${form} ${titleNoun}`;

  const sceneLine = {
    Tavern: "Through the haze of pipe smoke in the noisy tavern,",
    Alleyway: "Shadows cling tightly in the cramped alleyway as",
    Crossroads: "Rain-slicked mud squelches at the crossroads where",
    Wilderness: "The natural sounds of the wild suddenly fall dead silent as",
    Ruins: "Dust motes dance in shafts of broken light among the ruins as",
    Market: "Pushing through the cacophony of shouting merchants,",
    "High Road": "Visible from quite a distance down the open high road,",
    Sewers: "Echoing footsteps over the rushing of foul water announce that",
    Cave: "Moisture drips echoing in the pitch black cavern as",
    Ship: "The deck pitches violently on the crashing waves while",
    Mansion: "Amidst the opulent silk and crystal decor of the estate,",
    Slums: "The stench of poverty and desperation is palpable as",
    Festival: "Over the joyful music and cheering crowds,",
    Graveyard: "Mist curls around the weathered tombstones as",
    Docks: "The smell of salt and rotting fish is overwhelming while",
    Bridge: "Wind howls across the narrow expanse of the bridge where",
    Prison: "The clanking of iron chains echoes down the cold block as",
    Desert: "Heatwaves distort the shimmering horizon above the dunes where",
  };
  const intros = {
    "Single NPC": {
      Evil: `a menacing ${form.toLowerCase()} catches your eye.`,
      Neutral: `a solitary ${form.toLowerCase()} crosses your path.`,
      Good: `a welcoming ${form.toLowerCase()} approaches openly.`,
    },
    Group: {
      Evil: `a dangerous-looking band of individuals led by a ${form.toLowerCase()} block the way.`,
      Neutral: `a small, tight-knit group led by a ${form.toLowerCase()} watches you approach.`,
      Good: `a collective of travelers containing a ${form.toLowerCase()} hail you warmly.`,
    },
  };
  const hookLine = {
    "Seeks Aid": "They look desperate for capable assistance.",
    "Offers Work": "They carry the air of someone looking to hire talent.",
    "Has Info": "They watch you with the confidence of someone holding valuable secrets.",
    "Wants Trade": "They gesture toward their wares, looking to make a deal.",
    "Flees Trouble": "They are breathing heavily, glancing back as if pursued.",
    "Blocks Path": "They stand firmly in the chokepoint, refusing to yield the way.",
    "Owes a Debt": "They look like someone looking for a fast way to make a lot of coin.",
    "Needs Escort": "They look entirely unsuited for the dangers of this area.",
    "Lost Item": "They are frantically searching the ground and their pockets.",
    "Needs Direction": "They hold a crumpled map, looking thoroughly lost.",
    "Evading Beast": "They keep checking the tree line, gripping their weapons tightly.",
    "Setting Trap": "They wait with an unnatural stillness, trying to appear innocuous.",
    "Selling Scam": "They approach with a wide, overly-rehearsed merchant's smile.",
    "Revenge": "They are sharpening a blade, muttering a specific name under their breath.",
    "Defending": "They have makeshift barricades set up and eye you warningly.",
    "Foraging": "They are distracted, harvesting local flora with careful precision.",
    "Ransom": "They are holding someone or something hostage, waiting for a payout.",
    "Gambling": "They are tossing dice or a coin, looking perfectly bored."
  };
  const narrative = `${sceneLine[scene]} ${intros[type]?.[disp] || intros["Single NPC"]["Neutral"]} ${hookLine[hook]}`;

  const voiceNotes = {
    Gruff: "Gravelly, short, punchy sentences. Sounds impatient.",
    Charming: "Smooth, melodic. Uses terms of endearment, maintains intense eye contact.",
    Nervous: "Slightly too high-pitched, stutters on hard consonants, speaks quickly.",
    Arrogant: "Slow, condescending tone. Sighs before answering questions.",
    Jolly: "Booming, warm. Frequently laughs at their own terrible jokes.",
    Suspicious: "Quiet, almost whispering. Answers questions with other questions.",
    Melancholy: "Flat, monotone. Trails off at the end of their sentences.",
    Cunning: "Calculated, precise enunciation. Emphasizes specific, suggestive words.",
    Cowardly: "Trembling voice, frequently apologizes, speaks softly.",
    Boastful: "Loud, takes up auditory space, name-drops frequently.",
    Apathetic: "Flat, bored tone. Sighs frequently, doesn't finish thoughts.",
    Flirtatious: "Playful lilt, overly familiar, lowers voice conspiratorially.",
    Enraged: "Spits words out, barely contained yelling, grinds teeth.",
    Sarcastic: "Dripping with irony, emphasizes the wrong words mockingly.",
    Pompous: "Uses unnecessarily large words, speaks slowly as if to children.",
    Weary: "Heavy sighs between words, sounds like they haven't slept in days.",
    Zealous: "Passionate, speaks with absolute certainty, raises volume randomly.",
    Cryptic: "Answers in riddles, speaks in a slow, measured cadence."
  };

  const postureNotes = {
    "Back to Wall": "Keep your shoulders rigid. If sitting, pretend you are checking your peripheral vision constantly.",
    "Talks to Self": "Look past the players. Nod to an unseen person next to you before replying to the party.",
    "Always Eating": "Mime picking at food or chewing. Point with your 'utensil' or 'apple'. Talk with your mouth full.",
    "Avoids Eyes": "Look mostly at the table, your hands, or the players' boots. Shrink your physical profile.",
    "Hums Off-Key": "Hum a tuneless, grating melody during silences. Tap your foot irregularly.",
    "Laughs Wrong": "Smile too wide. Chuckle nervously right after hearing bad news or a threat.",
    "Counts Things": "Twitch your fingers. Mime tallying coins, counting floorboards, or the weapons the party carries.",
    "Never Sits": "Shift your weight constantly from foot to foot. Lean forward as if ready to bolt.",
    "Whispers": "Lean in close to speak. Look around as if being eavesdropped on.",
    "Scratches": "Constantly itch your arm, neck, or head. Move jerkily.",
    "Blind": "Stare blankly at a fixed point past the players. Tilt your head to 'listen'.",
    "Rhymes": "Over-enunciate the end of sentences gently tapping a rhythm.",
    "Stares": "Maintain completely unbroken, uncomfortable eye contact with one player.",
    "Bows Often": "Nod deeply and constantly. Keep hands clasped in front.",
    "Coin Flip": "Mime tossing and catching a small object endlessly.",
    "Hiccups": "Interrupt your own sentences with a gentle jerk or burp.",
    "Twitchy": "Flinch at loud noises or sudden questions. Dart your eyes.",
    "Limping": "Lean heavily to one side. Wince when shifting weight."
  };

  const acting = {
    voice: voiceNotes[personality] || "Speak normally.",
    posture: postureNotes[quirk] || "Neutral posture.",
  };

  let threat = { level: "Medium", bg: "#fffbeb", border: "#f59e0b", icon: ICON("Status/utility/alert-warning.png"), text: "#b45309" };
  let dcBase = 14;
  if (disp === "Evil") {
    threat = { level: "High", bg: "#fef2f2", border: "#ef4444", icon: ICON("Status/combat/concentric-target.png"), text: "#b91c1c" };
    dcBase = 16;
    if (type === "Group" || ["A Betrayer", "A Spy", "In Disguise"].includes(secret) || ["Sewers", "Alleyway", "Ruins"].includes(scene)) {
      threat = { level: "Critical", bg: "#4c0519", border: "#e11d48", icon: ICON("Status/debuff/skull-crossbones-poison.png"), text: "#ffe4e6", isDark: true };
      dcBase = 18;
    }
  } else if (disp === "Good") {
    threat = { level: "Low", bg: "#ecfdf5", border: "#10b981", icon: ICON("Status/buff/shield-protection.png"), text: "#047857" };
    dcBase = 12;
    if (["Is Hunted", "Is Cursed"].includes(secret) || ["Wilderness", "Sewers", "Ruins"].includes(scene))
      threat = { level: "Medium", bg: "#fffbeb", border: "#f59e0b", icon: ICON("Status/utility/alert-warning.png"), text: "#b45309" };
  } else {
    if (["A Betrayer", "A Spy"].includes(secret) || hook === "Blocks Path") {
      threat = { level: "High", bg: "#fef2f2", border: "#ef4444", icon: ICON("Status/combat/concentric-target.png"), text: "#b91c1c" };
      dcBase = 15;
    }
  }

  const realities = [];

  if (form === "Goblin Stack")
    realities.push({
      title: "Unstable Architecture",
      desc: "They are literally three goblins in a coat. Their physical coordination is terrible, and a solid strike to the middle goblin will cause the entire entity to collapse into a chaotic scramble.",
    });
  else if (form === "Wild Gnome")
    realities.push({
      title: "Alchemical Overdrive",
      desc: "They are completely out of their mind on strange glowing substances. They cannot be conventionally charmed or intimidated, as they are perceiving a completely different reality.",
    });

  if (["Seeks Aid", "Offers Work", "Needs Escort"].includes(hook) && ["A Betrayer", "A Spy", "In Disguise"].includes(secret))
    realities.push({
      title: "The Honey Trap",
      desc: `Their requested need (${hook}) is entirely fabricated. They are using vulnerability to lure the party into an isolated or compromised position.`,
    });
  else if (["Arrogant", "Gruff"].includes(personality) && ["Seeks Aid", "Needs Escort", "Flees Trouble"].includes(hook))
    realities.push({
      title: "Wounded Pride",
      desc: `They despise their reliance on the party. They frame their desperation (${hook}) as a "favor" to the players, masking their deep insecurity.`,
    });
  else if (["Jolly", "Charming"].includes(personality) && ["Grieving", "Deep in Debt", "Is Cursed", "Is Hunted"].includes(secret))
    realities.push({
      title: "The Painted Smile",
      desc: `Their extreme warmth is overcompensation for their secret (${secret}). Pushing the right emotional pressure point will cause a complete breakdown.`,
    });
  else if ((hook === "Flees Trouble" || secret === "Is Hunted") && (["Avoids Eyes", "Nervous", "Suspicious"].includes(personality) || ["Back to Wall", "Never Sits"].includes(quirk)))
    realities.push({
      title: "Hair-Trigger Paranoia",
      desc: "They are operating on pure terror. Sudden movements, drawing steel, or asking too many questions might trigger an immediate preemptive attack or flight.",
    });
  else if (["Has Info", "A Witness"].includes(hook) && ["Talks to Self", "Hums Off-Key", "Laughs Wrong", "Melancholy"].includes(quirk))
    realities.push({
      title: "Fragmented Reality",
      desc: "Their intelligence is genuine, but trauma makes it hard to decipher. The truth is buried beneath layers of eccentric, cryptic metaphors.",
    });
  else if (hook === "Wants Trade" && (secret === "Deep in Debt" || secret === "Flees Trouble"))
    realities.push({
      title: "Firesale Liquidation",
      desc: "They possess highly valuable -- likely traceable or stolen -- goods that they are willing to part with for pennies on the dollar just to get away.",
    });

  if (realities.length === 0)
    realities.push({
      title: "Concealed Depths",
      desc: `What they show on the surface (${personality}) is a deliberate shield to protect their true vulnerability (${secret}).`,
    });

  const checks = [
    { skill: "Insight", dc: dcBase, pass: `Notices their ${quirk.toLowerCase()} is a direct manifestation of their secret (${secret}).` },
    { skill: "Perception", dc: dcBase - 2, pass: `Spots a hidden emblem, weapon, or injury that contradicts their stated goal (${hook}).` },
  ];

  let escalation = `They will turn hostile or flee if the party pushes them on their secret (${secret}).`;
  if (disp === "Evil") escalation = "They are looking for an excuse to strike. Showing weakness or flaunting wealth will trigger an ambush.";
  else if (disp === "Good") escalation = "They will refuse to cooperate and leave if the party acts overly cruel, selfish, or impatient.";

  const lootItems = [
    "a half-eaten ration", "a marked map", "a tarnished silver ring", "a cryptic ledger",
    "a vial of strange liquid", "3d6 loose coins", "a loaded die", "a broken compass",
  ];
  if (form === "Goblin Stack") lootItems.push("three left shoes", "a suspiciously long trenchcoat");
  if (form === "Wild Gnome") lootItems.push("a pouch of glowing, pungent mushrooms", "a jittery clockwork toy");
  if (form === "Undead") lootItems.push("a locket with a faded portrait", "grave dirt");
  if (form === "Construct") lootItems.push("a leaking oil flask", "spare brass cogs");
  if (form === "Fiend") lootItems.push("a vial of hellfire ash", "a contract written in blood");

  const loot = `${lootItems[Math.floor(Math.random() * lootItems.length)]} and ${lootItems[Math.floor(Math.random() * lootItems.length)]}`;

  const nameData = generateName(type, disp, form, quirk);

  return { archetypeTitle, generatedName: nameData.title, nameData, narrative, threat, realities, acting, mechanics: { checks, escalation, loot } };
}

const reelPairs = [
  [0, 1],
  [2, 3],
  [4, 5],
];

const ResultDossier = memo(({ insight, result, encObj, dispObj, copyStatus, handleCopy, showResult, onRerollName }) => {
  if (!showResult || !insight || !result) return null;

  return (
    <div
      id="gm-encounter-dossier"
      className="enc-animate"
      style={{
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        background: "#f9f7f1",
        border: "2px solid #cda65a",
        position: "relative",
      }}
    >
      <div
        style={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          position: "relative",
          overflow: "hidden",
          background: insight.threat.bg,
          borderBottom: `3px solid ${insight.threat.border}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -20,
            top: -30,
            opacity: 0.04,
            pointerEvents: "none",
            transform: "rotate(-15deg)",
          }}
        >
          <IconImg src={insight.threat.icon} size={100} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, zIndex: 1 }}>
          <IconImg
            src={insight.threat.icon}
            size={36}
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
          />
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 900,
                marginBottom: 2,
                color: insight.threat.text,
                opacity: 0.9,
              }}
            >
              Threat: {insight.threat.level}
            </div>
            <h3
              style={{
                fontFamily: "'Cinzel Decorative',serif",
                fontSize: "clamp(16px,3.5vw,22px)",
                margin: 0,
                lineHeight: 1.1,
                color: insight.threat.text,
              }}
            >
              {insight.archetypeTitle}
            </h3>
            {insight.nameData && (
              <div style={{ 
                fontSize: 14, 
                fontFamily: "'Cinzel',serif", 
                color: insight.threat.text, 
                opacity: 0.9, 
                marginTop: 6, 
                background: "rgba(0,0,0,0.05)",
                padding: "4px 8px",
                borderRadius: 4,
                width: "fit-content"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <strong style={{ opacity: 0.6, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>Appellation:</strong> 
                  <span style={{ fontWeight: 700, fontStyle: "italic" }}>"{insight.nameData.title}"</span>
                  <button 
                    onClick={onRerollName}
                    title="Reroll Names"
                    style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px 4px", margin: "-2px 0", marginLeft: 4, display: "flex", alignItems: "center", borderRadius: 4 }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.1)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                  >
                    <IconImg src={ICON("abilities/Social/Dice Roll.png")} size={12} style={{ filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.2))" }} />
                  </button>
                </div>
                {insight.nameData.isGroup && insight.nameData.members.length > 0 && (
                  <div style={{ marginTop: 4, fontFamily: "'Inter',sans-serif", fontSize: 12, color: insight.threat.text, opacity: 0.8 }}>
                    <strong>Members ({insight.nameData.members.length}):</strong> {insight.nameData.members.join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleCopy}
          style={{
            zIndex: 1,
            padding: "6px 10px",
            borderRadius: 4,
            border: `1px solid ${insight.threat.border}`,
            background: "rgba(255,255,255,0.7)",
            color: insight.threat.text,
            fontWeight: 700,
            fontSize: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 4,
            fontFamily: "'Inter',sans-serif",
            backdropFilter: "none",
            transition: "all 0.2s",
          }}
        >
          <IconImg
            src={copyStatus === "Copied!" ? ICON("Status/buff/shield-protection.png") : ICON("items/Misc/Books/book-scroll-parchment-rolled.png")}
            size={12}
          />
          {copyStatus}
        </button>
      </div>

      <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          className="enc-animate enc-delay-1"
          style={{ opacity: 0, display: "flex", flexWrap: "wrap", gap: 4 }}
        >
          {[
            { v: encObj.value, i: encObj.icon },
            { v: dispObj.value, i: dispObj.icon },
            ...result.map((r) => ({ v: r.value, i: r.icon })),
          ].map((tag, idx) => (
            <div
              key={idx}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "3px 8px",
                borderRadius: 12,
                background: "#fff",
                border: "1px solid #e8dcc4",
                fontSize: 12,
                fontWeight: 600,
                color: "#5a4634",
                gap: 4,
              }}
            >
              <IconImg src={tag.i} size={12} />
              {tag.v}
            </div>
          ))}
        </div>

        <div
          className="enc-animate enc-delay-1"
          style={{
            opacity: 0,
            borderLeft: "3px solid #cda65a",
            background: "linear-gradient(to right,rgba(205,166,90,0.12),transparent)",
            padding: "10px 14px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#a38b62",
              fontWeight: 900,
              marginBottom: 4,
              fontFamily: "'Inter',sans-serif",
            }}
          >
            READ ALOUD TO PLAYERS
          </div>
          <p
            style={{
              fontFamily: "'IM Fell English',serif",
              fontSize: "clamp(15px,3vw,17px)",
              lineHeight: 1.5,
              color: "#2a1808",
              margin: 0,
              fontStyle: "italic",
            }}
          >
            "{insight.narrative}"
          </p>
        </div>

        <div
          className="enc-animate enc-delay-2"
          style={{ opacity: 0, display: "flex", flexDirection: "column", gap: 10 }}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #e8dcc4",
              borderRadius: 6,
              padding: 10,
            }}
          >
            <div
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 13,
                fontWeight: 900,
                color: "#8a2e2e",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderBottom: "1px solid #f0e8d8",
                paddingBottom: 6,
              }}
            >
              <IconImg src={ICON("Status/mental/joyful-mask-mental.png")} size={14} />
              Acting the Part
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: 16,
                display: "flex",
                flexDirection: "column",
                gap: 6,
                fontFamily: "'Inter',sans-serif",
                fontSize: 13,
                color: "#3a3028",
                lineHeight: 1.5,
              }}
            >
              <li>
                <strong>Voice:</strong> {insight.acting.voice}
              </li>
              <li>
                <strong>Posture:</strong> {insight.acting.posture}
              </li>
            </ul>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e8dcc4",
              borderRadius: 6,
              padding: 10,
            }}
          >
            <div
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 13,
                fontWeight: 900,
                color: "#8a2e2e",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderBottom: "1px solid #f0e8d8",
                paddingBottom: 6,
              }}
            >
              <IconImg src={ICON("Status/utility/disguise-mask.png")} size={14} />
              The Truth
            </div>
            <div
              style={{
                fontFamily: "'Inter',sans-serif",
                fontSize: 13,
                color: "#3a3028",
                lineHeight: 1.5,
              }}
            >
              <strong style={{ display: "block", color: "#a12323", marginBottom: 4 }}>
                {insight.realities[0].title}
              </strong>
              {insight.realities[0].desc}
            </div>
          </div>

          <div
            style={{
              background: "#fcfbf9",
              border: "1px solid #d3cabc",
              borderRadius: 6,
              padding: 10,
            }}
          >
            <div
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 13,
                fontWeight: 900,
                color: "#2d3748",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                borderBottom: "1px solid #f0e8d8",
                paddingBottom: 6,
              }}
            >
              <IconImg src={ICON("abilities/Social/Dice Roll.png")} size={14} />
              Mechanics & Triggers
            </div>
            <ul
              style={{
                margin: 0,
                paddingLeft: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
                fontFamily: "'Inter',sans-serif",
                fontSize: 13,
                color: "#3a3028",
                lineHeight: 1.5,
              }}
            >
              {insight.mechanics.checks.map((c, i) => (
                <li key={i}>
                  <strong style={{ color: "#2b6cb0" }}>
                    {c.skill} (DC {c.dc}):
                  </strong>{" "}
                  {c.pass}
                </li>
              ))}
              <li>
                <strong style={{ color: "#c53030" }}>Flashpoint Trigger:</strong>{" "}
                {insight.mechanics.escalation}
              </li>
              <li>
                <strong style={{ color: "#744210" }}>Pockets/Loot:</strong>{" "}
                {insight.mechanics.loot}.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});

function SocialEncounterGenerator() {
  const [encounterType, setEncounterType] = useState("Single NPC");
  const [disposition, setDisposition] = useState("Neutral");
  const [spinningReels, setSpinningReels] = useState([false, false, false, false, false, false]);
  const anySpinning = spinningReels.some(Boolean);
  const [targetIdxs, setTargetIdxs] = useState(() =>
    REELS.map((r) => Math.floor(Math.random() * r.items.length))
  );
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [machineShake, setMachineShake] = useState(false);
  const [copyStatus, setCopyStatus] = useState("Copy to Notes");
  const [nameSeed, setNameSeed] = useState(0);

  const onRerollName = useCallback(() => {
    setNameSeed((s) => s + 1);
  }, []);

  const dossierRef = useRef(null);
  const doneRef = useRef(0);

  const spin = () => {
    if (anySpinning) return;
    const idxs = REELS.map((r) => Math.floor(Math.random() * r.items.length));
    setTargetIdxs(idxs);
    setResult(idxs.map((idx, i) => REELS[i].items[idx]));
    setSpinningReels([true, true, true, true, true, true]);
    setShowResult(false);
    setCopyStatus("Copy to Notes");
    setMachineShake(true);
    setTimeout(() => setMachineShake(false), 600);
  };

  const spinSingle = useCallback((reelIdx) => {
    if (anySpinning) return;
    const items = REELS[reelIdx].items;
    const newIdx = Math.floor(Math.random() * items.length);
    setTargetIdxs(prev => {
      const next = [...prev];
      next[reelIdx] = newIdx;
      return next;
    });
    setResult(prev => {
      if (!prev) return prev;
      const next = [...prev];
      next[reelIdx] = items[newIdx];
      return next;
    });
    setSpinningReels(prev => {
      const next = [...prev];
      next[reelIdx] = true;
      return next;
    });
    setShowResult(false);
    setCopyStatus("Copy to Notes");
  }, [anySpinning]);

  const onReelDone = useCallback((reelIdx) => {
    setSpinningReels(prev => {
      const next = [...prev];
      next[reelIdx] = false;
      if (!next.some(Boolean)) {
        setShowResult(true);
        setTimeout(() => {
          if (dossierRef.current) {
            dossierRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }
      return next;
    });
  }, []);

  const dispObj = DISPOSITIONS.find((d) => d.value === disposition);
  const encObj = ENCOUNTER_TYPES.find((e) => e.value === encounterType);
  const insight = useMemo(
    () => analyzeEncounter(encounterType, disposition, result),
    [encounterType, disposition, result, nameSeed]
  );

  const handleCopy = () => {
    if (!insight || !result) return;

    const md = `
# ${insight.archetypeTitle}
**Known As:** ${insight.nameData.title} ${insight.nameData.isGroup ? `\n**Members:** ${insight.nameData.members.join(", ")}` : ''}
**Threat Level:** ${insight.threat.level} | **Type:** ${encObj.value} (${dispObj.value})

> *${insight.narrative}*

## Traits
* **Scene:** ${result[0].value}
* **Form:** ${result[1].value}
* **Persona:** ${result[2].value}
* **Hook:** ${result[3].value}
* **Secret:** ${result[4].value}
* **Quirk:** ${result[5].value}

## GM Roleplay Notes
* **Voice:** ${insight.acting.voice}
* **Posture/Action:** ${insight.acting.posture}

## The Truth (${insight.realities[0].title})
${insight.realities[0].desc}

## Mechanics & Triggers
* **Insight (DC ${insight.mechanics.checks[0].dc}):** ${insight.mechanics.checks[0].pass}
* **Perception (DC ${insight.mechanics.checks[1].dc}):** ${insight.mechanics.checks[1].pass}
* **Escalation Trigger:** ${insight.mechanics.escalation}
* **Pockets/Loot:** On their person, they carry ${insight.mechanics.loot}.
    `.trim();

    const textArea = document.createElement("textarea");
    textArea.value = md;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy to Notes"), 3000);
    } catch (err) {
      console.error("Failed to copy", err);
      setCopyStatus("Error copying");
    }

    document.body.removeChild(textArea);
  };

  // Optimized Render Elements
  const headerUI = useMemo(() => (
    <div style={{ textAlign: "center", marginBottom: 4 }}>
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.5em",
          color: "#a38b62",
          marginBottom: 4,
          fontWeight: 900,
          textTransform: "uppercase",
        }}
      >
        Oracle of Fate
      </div>
      <h2
        style={{
          fontFamily: "'Cinzel Decorative', serif",
          fontWeight: 700,
          fontSize: "clamp(18px, 4vw, 24px)",
          margin: 0,
          lineHeight: 1.1,
          background: "linear-gradient(120deg, #4a2a0a 0%, #c8952a 30%, #f0c060 50%, #c8952a 70%, #4a2a0a 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        Social Encounter
      </h2>
    </div>
  ), []);

  const controlsUI = useMemo(() => (
    <div
      style={{
        borderRadius: 8,
        padding: "10px 12px",
        border: "2px solid #b89850",
        background: "linear-gradient(145deg, #efe6cc, #e4d2a0)",
        boxShadow: "0 4px 16px rgba(80, 40, 0, 0.15), inset 0 2px 0 rgba(255, 240, 180, 0.8)",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        <Toggle label="Scenario Type" options={ENCOUNTER_TYPES} selected={encounterType} onChange={setEncounterType} disabled={anySpinning} />
        <Toggle label="Initial Outlook" options={DISPOSITIONS} selected={disposition} onChange={setDisposition} disabled={anySpinning} />
      </div>
    </div>
  ), [encounterType, disposition, anySpinning]);

  const reelsUI = useMemo(() => (
    <div
      style={{
        borderRadius: 12,
        padding: "10px 10px 14px",
        position: "relative",
        background: "linear-gradient(160deg, #2e1a08 0%, #160a02 50%, #2e1a08 100%)",
        border: "3px solid #5a3810",
        boxShadow: "0 0 0 1px #3a2208, 0 14px 40px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 200, 80, 0.08)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 2px" }}>
        {reelPairs.map(([a, b], rowIdx) => (
          <div key={rowIdx} style={{ display: "flex", gap: 4 }}>
            {[a, b].map((reelIdx) => (
              <div 
                key={reelIdx} 
                className="individual-reel-wrapper"
                style={{ 
                  flex: 1, 
                  display: "flex", 
                  flexDirection: "column", 
                  gap: 2, 
                  cursor: anySpinning ? "default" : "pointer",
                  position: "relative",
                  transition: "transform 0.15s ease",
                  willChange: "transform",
                }}
                onClick={() => !anySpinning && spinSingle(reelIdx)}
                title={anySpinning ? "" : "Click to reroll this slot"}
                onMouseEnter={(e) => { if (!anySpinning) e.currentTarget.style.transform = "scale(1.02) translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1) translateY(0)"; }}
              >
                <div
                  style={{
                    textAlign: "center",
                    fontSize: 7,
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 900,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#7a5020",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 3,
                  }}
                >
                  <IconImg src={REELS[reelIdx].icon} size={10} style={{ filter: "brightness(0.6)" }} />
                  {REELS[reelIdx].label}
                </div>
                <Reel index={reelIdx} items={REELS[reelIdx].items} targetIdx={targetIdxs[reelIdx]} onDone={onReelDone} spinning={spinningReels[reelIdx]} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  ), [targetIdxs, spinningReels, anySpinning, onReelDone, spinSingle]);

  const spinButtonUI = useMemo(() => (
    <div style={{ width: "100%" }}>
      <button
        onClick={spin}
        disabled={anySpinning}
        style={{
          width: "100%",
          boxSizing: "border-box",
          marginTop: 4,
          padding: "12px",
          borderRadius: 8,
          border: "none",
          background: anySpinning ? "#3d2a1d" : "linear-gradient(to bottom, #7a3b2e, #5e2e23)",
          color: anySpinning ? "#a38b62" : "#f0e6d2",
          cursor: anySpinning ? "default" : "pointer",
          fontFamily: "'Cinzel', serif",
          fontSize: 14,
          fontWeight: 900,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          position: "relative",
          boxShadow: anySpinning ? "none" : "0 4px 15px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          overflow: "hidden",
        }}
      >
      {!anySpinning && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "10%",
            right: "10%",
            height: "45%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)",
            borderRadius: "0 0 50% 50%",
            pointerEvents: "none",
          }}
        />
      )}
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <IconImg
          src={ICON("abilities/Social/Dice Roll.png")}
          size={16}
          style={{ filter: anySpinning ? "brightness(0.3)" : "brightness(0.4) drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
        />
        {anySpinning ? "The Fates Align..." : "Cast the Oracle"}
      </span>
      </button>
    </div>
  ), [anySpinning, spin]);

  return (
    <div
      id="social-encounter-scroll-container"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        fontFamily: "'Cinzel', serif",
        padding: 16,
        paddingTop: 8,
        height: "100%",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        color: "#2a1808",
        position: "relative",
      }}
    >
      {headerUI}
      {controlsUI}
      {reelsUI}
      {spinButtonUI}

      <div ref={dossierRef} style={{ scrollMarginTop: "16px" }}>
        <ResultDossier
          insight={insight}
          result={result}
          encObj={encObj}
          dispObj={dispObj}
          copyStatus={copyStatus}
          handleCopy={handleCopy}
          showResult={showResult}
          onRerollName={onRerollName}
        />
      </div>
    </div>
  );
}

export default SocialEncounterGenerator;
