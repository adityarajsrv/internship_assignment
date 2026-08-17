import React from 'react';
import {AbsoluteFill, useCurrentFrame, spring, interpolate} from 'remotion';
import {loadFont} from '@remotion/google-fonts/Quicksand';

// The reference video's typography (logo, pill labels, card subject/body
// text — all of it) uses a rounded geometric sans with a single-story "a",
// round dotted "i", and curled "t" terminals. That's Quicksand, not Inter.
const {fontFamily: QUICKSAND} = loadFont();

const fps30 = 30;
const clampI = (f: number, range: [number, number], out: [number, number]) =>
  interpolate(f, range, out, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ============================================================
// TOTAL DURATION: 596 frames @ 30fps = ~19.9 seconds.
// (was 570/19s). The Quick check-in card's hold was extended so its
// Yes / No buttons finish revealing with room to spare before the stage
// collapses (previously they resolved too late to ever be seen).
// Connector draw-in speed was also sped up throughout, so the extra
// length reads as similarly fast-paced, not slower.
// The ending still has enough room (frames ~560-596) for the CTA
// cursor to land on the Renewals button, click it, and ripple.
// Set durationInFrames={596} in Root.tsx to match.
// ============================================================

// ============ WORLD LAYOUT (unchanged — spacing you confirmed) ============
const CX = 368;
const Y_OUTREACH = 80;
const Y_WAIT = 170;
const Y_FORK = 300;
const Y_CARD = 521;
const Y_RENEWALS = 730;
const CARD_GAP = 202;
const L_X = CX - CARD_GAP;
const R_X = CX + CARD_GAP;
const Y_HERO = 250;
const Y_EMAIL_PILL = 250;
const Y_CARD1 = 420;

// ============ CAMERA (tightened timing — same path, shorter holds) ============
const camKeyframes: [number, number, number, number][] = [
  [0, CX, Y_HERO, 1.0],
  [21, CX, Y_HERO, 1.0],
  [36, CX, Y_OUTREACH + 60, 1.0],
  [65, CX, Y_EMAIL_PILL, 0.95],
  [100, CX, Y_EMAIL_PILL, 0.95], // hold — let the Email pill be seen alone first
  [125, CX, Y_CARD1, 0.85], // camera fully arrives before the card is allowed to appear
  [208, CX, Y_CARD1, 0.85], // hold — extended so the Yes / No buttons finish revealing before collapse
  [218, CX, (Y_OUTREACH + Y_WAIT) / 2, 1.0],
  [244, CX, Y_WAIT + 10, 0.95],
  [272, CX, Y_WAIT + 10, 0.95], // hold — read "Wait for 5 days"
  [298, CX, Y_FORK - 40, 0.85],
  [331, CX, Y_FORK + 120, 0.72],
  [357, L_X, Y_CARD, 1.35],
  [467, L_X, Y_CARD, 1.35], // hold — full edit sequence plays with buffer to spare
  [478, CX, Y_FORK + 140, 0.68],
  [489, R_X, Y_CARD, 1.35],
  [519, R_X, Y_CARD, 1.35], // hold — read the right card properly
  [538, CX, (Y_OUTREACH + Y_RENEWALS) / 2, 0.52],
  [596, CX, (Y_OUTREACH + Y_RENEWALS) / 2, 0.52], // room for the cursor to land + click
];

function camAt(frame: number) {
  for (let i = 0; i < camKeyframes.length - 1; i++) {
    const [f0, x0, y0, z0] = camKeyframes[i];
    const [f1, x1, y1, z1] = camKeyframes[i + 1];
    if (frame >= f0 && frame <= f1) {
      const t = f1 === f0 ? 1 : (frame - f0) / (f1 - f0);
      const ease = t * t * (3 - 2 * t);
      return {x: x0 + (x1 - x0) * ease, y: y0 + (y1 - y0) * ease, z: z0 + (z1 - z0) * ease};
    }
  }
  const last = camKeyframes[camKeyframes.length - 1];
  return {x: last[1], y: last[2], z: last[3]};
}

// ============ ICONS ============
const useIdleFrame = () => useCurrentFrame();

const IconPaperPlane = ({color = '#e07b32', size = 15}) => {
  const f = useIdleFrame();
  const bob = Math.sin(f / 9) * 2;
  const tilt = Math.sin(f / 14) * 6;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{transform: `translateY(${bob}px) rotate(${tilt}deg)`}}>
      <path d="M1 8l13-6-4 13-3-5-5-2z" fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
};
const IconEnvelope = ({color = '#c9660f', size = 14}) => {
  const f = useIdleFrame();
  const bob = Math.sin(f / 11) * 1.4;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{transform: `translateY(${bob}px)`}}>
      <rect x="1" y="3" width="14" height="10" rx="1.5" fill="none" stroke={color} strokeWidth="1.4" />
      <path d="M1.5 4l6.5 5 6.5-5" fill="none" stroke={color} strokeWidth="1.4" />
    </svg>
  );
};
const IconClock = ({color = '#d9603f', size = 15}) => {
  const f = useIdleFrame();
  const handAngle = (f * 6) % 360;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke={color} strokeWidth="1.4" />
      <g transform={`rotate(${handAngle} 8 8)`}><path d="M8 4.5v3.8" stroke={color} strokeWidth="1.4" strokeLinecap="round" /></g>
      <path d="M8 8l2.6 1.5" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
};
const IconCheck = ({color = '#3a9d5f', size = 14, appearAt = 0, frame = 0}: {color?: string; size?: number; appearAt?: number; frame?: number}) => {
  const p = appearAt ? clampI(frame - appearAt, [0, 12], [0, 1]) : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke={color} strokeWidth="1.4" />
      <path d="M5 8.2l2 2 4-4.4" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={10} strokeDashoffset={10 - 10 * p} />
    </svg>
  );
};
const IconX = ({color = '#d2483c', size = 14, appearAt = 0, frame = 0}: {color?: string; size?: number; appearAt?: number; frame?: number}) => {
  const p = appearAt ? clampI(frame - appearAt, [0, 12], [0, 1]) : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke={color} strokeWidth="1.4" />
      <path d="M5.8 5.8l4.4 4.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray={7} strokeDashoffset={7 - 7 * p} />
      <path d="M10.2 5.8l-4.4 4.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray={7} strokeDashoffset={7 - 7 * clampI(frame - appearAt - 4, [0, 12], [0, 1])} />
    </svg>
  );
};

const MagicBadge: React.FC<{size?: number}> = ({size = 30}) => {
  const f = useIdleFrame();
  const wandAngle = Math.sin(f / 6) * 14;
  const sparkle = (phase: number, cx: number, cy: number, s: number) => {
    const o = (Math.sin(f / 5 + phase) + 1) / 2;
    return (
      <g style={{opacity: 0.3 + o * 0.7, transform: `translate(${cx}px, ${cy}px) rotate(${f * 3 + phase * 40}deg) scale(${0.6 + o * 0.5})`, transformOrigin: 'center'}}>
        <path d={`M0,-${s} L${s * 0.28},-${s * 0.28} L${s},0 L${s * 0.28},${s * 0.28} L0,${s} L-${s * 0.28},${s * 0.28} L-${s},0 L-${s * 0.28},-${s * 0.28} Z`} fill="#8ec9e8" />
      </g>
    );
  };
  return (
    <div style={{width: size, height: size, borderRadius: 999, background: 'white', boxShadow: '0 3px 10px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative'}}>
      <svg width={size} height={size} viewBox="-15 -15 30 30" style={{position: 'absolute', overflow: 'visible'}}>
        {sparkle(0, 8, -8, 3)}
        {sparkle(2.1, -9, 6, 2.2)}
        {sparkle(4.2, 9, 7, 2)}
      </svg>
      <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 16 16" style={{transform: `rotate(${wandAngle}deg)`}}>
        <path d="M2 14l8.5-8.5" stroke="#4aa3d8" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M10.5 5.5l1.2-1.2" stroke="#4aa3d8" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M12 2l0.6 1.4L14 4l-1.4 0.6L12 6l-0.6-1.4L10 4l1.4-0.6z" fill="#8ec9e8" stroke="#4aa3d8" strokeWidth="0.6" />
      </svg>
    </div>
  );
};

// Custom I-beam text cursor (provided SVG), blinking, used during the
// select/erase/retype animation inside cards. Position is controlled
// entirely by the parent (via marginLeft on the wrapping inline span order),
// so it can be dropped anywhere in the character stream.
const TextCursor: React.FC<{h?: number}> = ({h = 22}) => {
  const f = useIdleFrame();
  const on = Math.floor(f / 8) % 2 === 0;
  return (
    <svg width={h * 0.6} height={h} viewBox="0 0 50 50" style={{display: 'inline-block', verticalAlign: '-0.15em', opacity: on ? 1 : 0, marginLeft: 1, marginRight: 1}}>
      <path d="M 20,9 C 23,9 25,11 25,14 L 25,23 M 22,23 L 28,23 M 25,23 L 25,36 C 25,39 23,41 20,41 M 30,9 C 27,9 25,11 25,14 M 25,36 C 25,39 27,41 30,41"
        fill="none" stroke="#333333" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

// Mouse-pointer cursor used for the final "click the CTA" beat. Standard
// arrow-pointer silhouette (white fill, dark outline, soft drop shadow) so
// it reads clearly against the orange Renewals button.
const MouseCursor: React.FC<{scale?: number}> = ({scale = 1}) => (
  <svg
    width={30}
    height={34}
    viewBox="0 0 20 22"
    style={{filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))', transform: `scale(${scale})`, transformOrigin: '3px 3px'}}
  >
    <path
      d="M2.2 1.6 L2.2 17.6 L6.4 14.1 L8.8 19.8 L11.3 18.7 L8.9 13.1 L13.6 13.1 Z"
      fill="#ffffff"
      stroke="#2a2a2a"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

// ============ PRIMITIVES ============
const Pill: React.FC<{x: number; y: number; label: string; icon?: React.ReactNode; appearAt: number; frame: number; borderColor?: string; textColor?: string; bg?: string; fontSize?: number}> = ({
  x, y, label, icon, appearAt, frame, borderColor = '#f2a565', textColor = '#c9660f', bg = '#fce3cf', fontSize = 17,
}) => {
  if (frame < appearAt) return null;
  const s = spring({frame: frame - appearAt, fps: fps30, config: {damping: 15, stiffness: 150, mass: 0.5}});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, background: bg, border: `2px solid ${borderColor}`, borderRadius: 999, padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 8, color: textColor, fontWeight: 700, fontSize, whiteSpace: 'nowrap'}}>
      {icon}{label}
    </div>
  );
};

const EmptyPill: React.FC<{x: number; y: number; w: number; appearAt: number; frame: number; borderColor?: string; bg?: string; icon?: React.ReactNode}> = ({x, y, w, appearAt, frame, borderColor = '#f2a565', bg = '#fce3cf', icon}) => {
  if (frame < appearAt) return null;
  const s = spring({frame: frame - appearAt, fps: fps30, config: {damping: 15, stiffness: 150}});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, width: w, height: 56, background: bg, border: `2px solid ${borderColor}`, borderRadius: 999, display: 'flex', alignItems: 'center', paddingLeft: 24}}>
      {icon}
    </div>
  );
};

const VConnector: React.FC<{x: number; y1: number; y2: number; appearAt: number; frame: number; withBadge?: boolean}> = ({x, y1, y2, appearAt, frame, withBadge}) => {
  const p = clampI(frame - appearAt, [0, 11], [0, 1]);
  const y = y1 + (y2 - y1) * p;
  const mid = (y1 + y2) / 2;
  const badgeOpacity = withBadge ? clampI(frame - appearAt, [3, 8], [0, 1]) * (1 - clampI(frame - appearAt, [18, 24], [0, 1])) : 0;
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
        <circle cx={x} cy={y1} r={4} fill="#6b6b62" opacity={clampI(frame - appearAt, [0, 3], [0, 1])} />
        <line x1={x} y1={y1} x2={x} y2={y} stroke="#8a8a80" strokeWidth={2} strokeLinecap="round" />
        {p > 0.85 && <polygon points={`${x - 4.5},${y - 7} ${x + 4.5},${y - 7} ${x},${y}`} fill="#8a8a80" opacity={clampI(frame - appearAt, [9, 11], [0, 1])} />}
      </svg>
      {withBadge && <div style={{position: 'absolute', left: x, top: mid, transform: 'translate(-50%,-50%)', opacity: badgeOpacity}}><MagicBadge /></div>}
    </>
  );
};

// Smooth continuous fork — a single curved stroke per branch (no flat
// orthogonal middle segment, matching the reference), using pathLength
// normalization so the draw-in animation always ends exactly at the
// path's true endpoint.
const ForkConnector: React.FC<{x: number; yTop: number; yMid: number; xL: number; xR: number; yBot: number; appearAt: number; frame: number}> = ({
  x, yTop, yMid, xL, xR, yBot, appearAt, frame,
}) => {
  const p1 = clampI(frame - appearAt, [0, 5], [0, 1]);
  const p2 = clampI(frame - appearAt, [4, 22], [0, 1]);

  const lineEndY = yBot - 3;
  const arrowBaseY = yBot - 7;
  const arrowTipY = yBot + 5;

  const leftPath = `M${x},${yMid} C${x},${yMid + 62} ${xL},${yMid + 18} ${xL},${lineEndY}`;
  const rightPath = `M${x},${yMid} C${x},${yMid + 62} ${xR},${yMid + 18} ${xR},${lineEndY}`;

  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      <circle cx={x} cy={yTop} r={4} fill="#6b6b62" opacity={clampI(frame - appearAt, [0, 3], [0, 1])} />
      <line x1={x} y1={yTop} x2={x} y2={yTop + (yMid - yTop) * p1} stroke="#8a8a80" strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={x} cy={yMid} r={4} fill="#8a8a80" opacity={p1} />
      <path d={leftPath} fill="none" stroke="#8a8a80" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p2} />
      <path d={rightPath} fill="none" stroke="#8a8a80" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p2} />
      {p2 > 0.92 && (
        <>
          <polygon points={`${xL - 6},${arrowBaseY} ${xL + 6},${arrowBaseY} ${xL},${arrowTipY}`} fill="#8a8a80" opacity={clampI(frame - appearAt, [20, 22], [0, 1])} />
          <polygon points={`${xR - 6},${arrowBaseY} ${xR + 6},${arrowBaseY} ${xR},${arrowTipY}`} fill="#8a8a80" opacity={clampI(frame - appearAt, [20, 22], [0, 1])} />
        </>
      )}
    </svg>
  );
};

// type -> select(pink) -> erase(right-to-left, char by char) -> brief pause
// -> retype(green, left-to-right) -> settle sequence, with the custom
// I-beam cursor tracking the active edit point the whole way through.
const EditableLine: React.FC<{
  text: string; charStart: number; charCount: number; frame: number;
  edit?: {lineIndex: number; find: string; replace: string; at: number};
  lineIndex: number;
}> = ({text, charStart, charCount, frame, edit, lineIndex}) => {
  const localShown = Math.max(0, Math.min(text.length, charCount - charStart));
  const base = text.slice(0, localShown);

  if (!edit || edit.lineIndex !== lineIndex || !text.includes(edit.find)) return <>{base}</>;

  const idx = text.indexOf(edit.find);
  const before = text.slice(0, idx);
  const after = text.slice(idx + edit.find.length);
  const t = frame - edit.at;

  const selectDur = 14;
  const eraseDur = 14;
  const pauseDur = 6;
  const typeDur = 22;
  const settleDur = 16;

  const selectEnd = selectDur;
  const eraseEnd = selectEnd + eraseDur;
  const pauseEnd = eraseEnd + pauseDur;
  const typeEnd = pauseEnd + typeDur;
  const settleEnd = typeEnd + settleDur;

  if (t < 0 || localShown < text.length) return <>{base}</>;

  if (t < selectEnd) {
    const selP = clampI(t, [0, selectDur], [0, 1]);
    const selChars = Math.floor(edit.find.length * selP);
    const midSelect = selP > 0 && selP < 1;
    return (
      <>
        {before}
        <span style={{background: '#f6cfc7', borderRadius: 2}}>{edit.find.slice(0, selChars)}</span>
        {midSelect && <TextCursor />}
        {edit.find.slice(selChars)}
        {after}
      </>
    );
  }

  if (t < eraseEnd) {
    const eraseP = clampI(t, [selectEnd, eraseEnd], [0, 1]);
    const erasedChars = Math.floor(edit.find.length * eraseP);
    const remaining = edit.find.slice(0, edit.find.length - erasedChars);
    const stillErasing = eraseP > 0 && eraseP < 1;
    return (
      <>
        {before}
        <span style={{background: remaining.length > 0 ? '#f6cfc7' : 'transparent', borderRadius: 2}}>{remaining}</span>
        {stillErasing && <TextCursor />}
        {after}
      </>
    );
  }

  if (t < pauseEnd) {
    return (
      <>
        {before}
        <TextCursor />
        {after}
      </>
    );
  }

  const typeP = clampI(t, [pauseEnd, typeEnd], [0, 1]);
  const typedChars = Math.floor(edit.replace.length * typeP);
  const settleP = clampI(t, [typeEnd, settleEnd], [0, 1]);
  const rr = Math.round(58 + (68 - 58) * settleP);
  const gg = Math.round(157 + (68 - 157) * settleP);
  const bb = Math.round(95 + (68 - 95) * settleP);
  const settledColor = `rgb(${rr},${gg},${bb})`;
  const stillTyping = typeP > 0 && typeP < 1;

  return (
    <>
      {before}
      <span style={{color: typedChars > 0 ? settledColor : undefined}}>{edit.replace.slice(0, typedChars)}</span>
      {stillTyping && <TextCursor />}
      {after}
    </>
  );
};

const EmailCard: React.FC<{
  x: number; y: number; subject: string; lines: string[]; buttons: [string, string];
  appearAt: number; frame: number; badge?: boolean; width?: number;
  edit?: {lineIndex: number; find: string; replace: string; at: number};
  fastReveal?: boolean;
}> = ({x, y, subject, lines, buttons, appearAt, frame, badge = true, width = 300, edit, fastReveal = false}) => {
  if (frame < appearAt) return null;
  const s = spring({frame: frame - appearAt, fps: fps30, config: {damping: 17, stiffness: 130}});
  const textRange: [number, number] = fastReveal ? [6, 32] : [8, 55];
  const btn1Range: [number, number] = fastReveal ? [30, 38] : [55, 63];
  const btn2Range: [number, number] = fastReveal ? [34, 42] : [60, 68];
  const charCount = Math.floor(clampI(frame - appearAt, textRange, [0, 240]));
  let shown = 0;

  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`}}>
      {badge && <div style={{position: 'absolute', top: -14, left: -14, zIndex: 2}}><MagicBadge /></div>}
      <div style={{background: '#fdf9f0', border: '1px solid #ece0c8', borderRadius: 16, boxShadow: '0 12px 26px rgba(0,0,0,0.09)', padding: '20px 22px', width}}>
        <div style={{fontSize: 13, color: '#333', marginBottom: 9, borderBottom: '1px solid #eee', paddingBottom: 9}}>
          <span style={{color: '#999'}}>Subject: </span><b>{subject}</b>
        </div>
        {lines.map((text, i) => {
          const start = shown; shown += text.length;
          return (
            <div key={i} style={{fontSize: 11, color: '#444', marginBottom: 9, lineHeight: 1.5, minHeight: 15}}>
              <EditableLine text={text} charStart={start} charCount={charCount} frame={frame} edit={edit} lineIndex={i} />
            </div>
          );
        })}
        <div style={{background: 'linear-gradient(180deg,#f8ca4a,#f3a83c)', borderRadius: 7, textAlign: 'center', padding: '9px 0', fontSize: 10.5, fontWeight: 600, color: '#4a3200', marginTop: 12, marginBottom: 8, opacity: clampI(frame - appearAt, btn1Range, [0, 1])}}>{buttons[0]}</div>
        <div style={{background: 'linear-gradient(180deg,#f8ca4a,#f3a83c)', borderRadius: 7, textAlign: 'center', padding: '9px 0', fontSize: 10.5, fontWeight: 600, color: '#4a3200', opacity: clampI(frame - appearAt, btn2Range, [0, 1])}}>{buttons[1]}</div>
      </div>
    </div>
  );
};

// ============ MAIN ============
export const Template: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camAt(frame);
  const worldScale = cam.z;
  const tx = 368 - cam.x * worldScale;
  const ty = 207 - cam.y * worldScale;

  const detourActive = frame < 218;
  const detourCollapse = clampI(frame, [208, 218], [1, 0]);
  const finalFrame = frame >= 538;

  const heroT = clampI(frame, [21, 36], [0, 1]);
  const outreachY = interpolate(heroT, [0, 1], [Y_HERO, Y_OUTREACH]);
  const outreachScale = interpolate(heroT, [0, 1], [1.25, 1]);

  // ---- End-card CTA cursor: slides in from the lower-right and lands on
  // the Renewals button, then does a quick "click" pulse. Timed to sit
  // fully inside the final hold (538 -> 596) with room to spare.
  const cursorStartF = 560;
  const cursorLandF = 574;
  const clickStartF = 574;
  const clickEndF = 585;
  const cursorInT = clampI(frame, [cursorStartF, cursorLandF], [0, 1]);
  const cursorEase = cursorInT * cursorInT * (3 - 2 * cursorInT);
  // Renewals button center is (CX, Y_RENEWALS); the cursor lands just
  // inside its bottom-right edge, tip pointing up-left into the label —
  // matching the reference frame, without overlapping the cards above.
  const cursorFromX = CX + 230;
  const cursorFromY = Y_RENEWALS + 130;
  const cursorToX = CX + 92;
  const cursorToY = Y_RENEWALS + 24;
  const cursorX = cursorFromX + (cursorToX - cursorFromX) * cursorEase;
  const cursorY = cursorFromY + (cursorToY - cursorFromY) * cursorEase;
  const cursorOpacity = clampI(frame, [cursorStartF, cursorStartF + 6], [0, 1]);
  const clickT = clampI(frame, [clickStartF, clickEndF], [0, 1]);
  // quick, more emphatic down-up pulse: 1 -> 0.72 -> 1
  const clickScale = clickT < 0.5 ? interpolate(clickT, [0, 0.5], [1, 0.72]) : interpolate(clickT, [0.5, 1], [0.72, 1]);
  const buttonPressScale = clickT > 0 && clickT < 1 ? interpolate(clickT, [0, 0.5, 1], [1, 0.9, 1.04]) : 1;
  // expanding click ripple, fired right as the cursor taps down
  const rippleT = clampI(frame, [clickStartF, clickStartF + 22], [0, 1]);
  const rippleScale = interpolate(rippleT, [0, 1], [0.3, 2.2]);
  const rippleOpacity = interpolate(rippleT, [0, 0.15, 1], [0, 0.55, 0]);
  // brief brightness flash on the button itself at the moment of contact
  const flashT = clampI(frame, [clickStartF, clickStartF + 10], [1, 0]);

  return (
    <AbsoluteFill style={{backgroundColor: '#f4efe6', fontFamily: QUICKSAND, overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 12, left: 12, zIndex: 10, background: 'white', borderRadius: 8, padding: '4px 10px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)'}}>
        <div style={{fontWeight: 800, fontSize: 14}}>beliv<span style={{color: '#7c3aed'}}>8</span>.</div>
        <div style={{fontSize: 5.5, color: '#999'}}>Believe in the Magic of Motion</div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 0, width: 736, height: 414, transform: `translate(${tx}px, ${ty}px) scale(${worldScale})`, transformOrigin: '0 0'}}>

        {finalFrame && (
          <div
            style={{
              position: 'absolute',
              left: CX,
              top: (Y_OUTREACH + Y_RENEWALS) / 2,
              transform: `translate(-50%,-50%) rotate(${interpolate(spring({frame: frame - 538, fps: fps30, config: {damping: 14, stiffness: 90}}), [0, 1], [-7, 0])}deg) scale(${spring({frame: frame - 538, fps: fps30, config: {damping: 18, stiffness: 100}})})`,
              width: 900,
              height: Y_RENEWALS - Y_OUTREACH + 220,
              background: '#fdf9f0',
              borderRadius: 30,
              boxShadow: '0 24px 60px rgba(0,0,0,0.14)',
            }}
          />
        )}

        <div style={{position: 'absolute', left: CX, top: outreachY, transform: `translate(-50%,-50%) scale(${outreachScale * spring({frame, fps: fps30, config: {damping: 15, stiffness: 150, mass: 0.5}})})`, background: '#fce3cf', border: '2px solid #f2a565', borderRadius: 999, padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 8, color: '#c9660f', fontWeight: 700, fontSize: 17, whiteSpace: 'nowrap'}}>
          {frame >= 21 && <IconPaperPlane />}
          {'Initial Outreach'.slice(0, Math.max(4, Math.floor(clampI(frame, [6, 19], [4, 16]))))}
        </div>

        {detourActive && (
          <div style={{opacity: detourCollapse, transform: `scale(${interpolate(detourCollapse, [0, 1], [0.85, 1])})`, transformOrigin: `${CX}px ${Y_OUTREACH}px`}}>
            <VConnector x={CX} y1={Y_OUTREACH + 26} y2={Y_EMAIL_PILL - 26} appearAt={36} frame={frame} withBadge />
            <Pill x={CX} y={Y_EMAIL_PILL} label="Email" icon={<IconEnvelope />} appearAt={54} frame={frame} bg="#fdf1e0" borderColor="#e8c07a" textColor="#a9770f" fontSize={14} />
            {/* Card appears once the camera fully lands at Y_CARD1 (frame 125).
                fastReveal makes the text + both Yes/No buttons finish revealing
                with a full ~28-frame hold to spare before the stage collapses
                at frame 208 — previously the buttons resolved too late to ever
                be seen before the card collapsed. */}
            <EmailCard x={CX} y={Y_CARD1} appearAt={138} frame={frame} width={300} badge={false} fastReveal
              subject="Quick check-in"
              lines={['I wanted to reach out — are you getting what you need from your membership right now?', 'If not, what would make it more relevant or useful for you?', 'If pricing is the concern just hit reply yes!']}
              buttons={['Yes', 'No, its something else']} />
          </div>
        )}

        {frame >= 218 && (
          <>
            <VConnector x={CX} y1={Y_OUTREACH + 26} y2={Y_WAIT - 26} appearAt={216} frame={frame} />
            {frame < 229 ? (
              <EmptyPill x={CX} y={Y_WAIT} w={210} appearAt={222} frame={frame} borderColor="#e0684a" bg="#fbdcd0" icon={<IconClock color="#d9603f" />} />
            ) : (
              <Pill x={CX} y={Y_WAIT} label="Wait for 5 days" icon={<IconClock />} appearAt={229} frame={frame} bg="#fbdcd0" borderColor="#e0684a" textColor="#d9603f" />
            )}
          </>
        )}

        {frame >= 298 && (
          <>
            <ForkConnector x={CX} yTop={Y_WAIT + 26} yMid={Y_WAIT + 55} xL={L_X} xR={R_X} yBot={Y_FORK - 20} appearAt={298} frame={frame} />
            <Pill x={L_X} y={Y_FORK} label="Responded" icon={<IconCheck appearAt={319} frame={frame} />} appearAt={319} frame={frame} fontSize={14} bg="#e9f6ee" borderColor="#8fd1a8" textColor="#3a9d5f" />
            <Pill x={R_X} y={Y_FORK} label="Didn't Respond" icon={<IconX appearAt={319} frame={frame} />} appearAt={319} frame={frame} fontSize={14} bg="#fbeceb" borderColor="#e3a099" textColor="#d2483c" />
          </>
        )}

        {frame >= 330 && (
          <>
            <div style={{position: 'absolute', left: L_X, top: Y_FORK + 34, transform: 'translateX(-50%)', fontSize: 13, fontWeight: 700, color: '#333', whiteSpace: 'nowrap', opacity: clampI(frame, [330, 338], [0, 1])}}>Relevance objection confirmed</div>
            <div style={{position: 'absolute', left: R_X, top: Y_FORK + 34, transform: 'translateX(-50%)', fontSize: 13, fontWeight: 700, color: '#333', whiteSpace: 'nowrap', opacity: clampI(frame, [330, 338], [0, 1])}}>Follow-up for members</div>
          </>
        )}

        <EmailCard x={L_X} y={Y_CARD} appearAt={339} frame={frame} width={300}
          subject="Quick follow-up"
          lines={['Thanks for sharing that with us.', 'We understand cost matters, and we want your membership to feel worth it.', 'If helpful, we can show you benefits that fit what matters most to you.']}
          buttons={['Ok, lets talk', "I really can't justify it"]}
          edit={{lineIndex: 1, find: 'worth it.', replace: 'meaningful.', at: 393}} />

        <EmailCard x={R_X} y={Y_CARD} appearAt={339} frame={frame} width={300}
          subject="Before you decide about next year"
          lines={['Before you decide about next year I wanted to check in.', "We'd love to make sure you're getting real value from your membership.", "If there's something you want more of, just let me know — we're here to help."]}
          buttons={['Ok, lets talk', "I really can't justify it"]} />

        {frame >= 357 && frame < 467 && (
          <div style={{position: 'absolute', left: CX, top: Y_FORK - 90, transform: 'translateX(-50%)', fontSize: 26, fontWeight: 700, color: '#222', whiteSpace: 'nowrap', opacity: clampI(frame, [357, 364], [0, 1]) * clampI(frame, [460, 467], [1, 0])}}>Relevance objection confirmed</div>
        )}
        {frame >= 478 && frame < 519 && (
          <div style={{position: 'absolute', left: CX, top: Y_FORK - 90, transform: 'translateX(-50%)', fontSize: 26, fontWeight: 700, color: '#222', whiteSpace: 'nowrap', opacity: clampI(frame, [478, 484], [0, 1]) * clampI(frame, [513, 519], [1, 0])}}>Follow-up for members</div>
        )}

        {finalFrame && (
          <>
            <div
              style={{
                position: 'absolute',
                left: CX,
                top: Y_RENEWALS,
                transform: 'translate(-50%,-50%)',
                opacity: clampI(frame, [545, 554], [0, 1]),
              }}
            >
              {/* expanding click ripple, fired the moment the cursor taps down */}
              {frame > clickStartF && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: 130,
                    height: 130,
                    marginLeft: -65,
                    marginTop: -65,
                    borderRadius: 999,
                    border: '3px solid #f3782e',
                    opacity: rippleOpacity,
                    transform: `scale(${rippleScale})`,
                    pointerEvents: 'none',
                  }}
                />
              )}
              <div
                style={{
                  position: 'relative',
                  background: `linear-gradient(180deg, ${flashT > 0 ? '#ffcf8a' : '#fbb15a'}, ${flashT > 0 ? '#f38a3a' : '#f3782e'})`,
                  borderRadius: 999,
                  padding: '24px 76px',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: 34,
                  letterSpacing: 0.4,
                  boxShadow: `0 16px 36px rgba(243,120,46,0.45), 0 0 0 ${5 + flashT * 4}px rgba(243,120,46,${0.14 + flashT * 0.18})`,
                  transform: `scale(${spring({frame: frame - 545, fps: fps30, config: {damping: 12, stiffness: 140}}) * buttonPressScale})`,
                }}
              >
                Renewals
              </div>
            </div>
            {frame > cursorStartF && (
              <div
                style={{
                  position: 'absolute',
                  left: cursorX,
                  top: cursorY,
                  opacity: cursorOpacity,
                  zIndex: 5,
                }}
              >
                <MouseCursor scale={clickScale} />
              </div>
            )}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};