import React from 'react';
import {AbsoluteFill, useCurrentFrame, spring, interpolate} from 'remotion';

const fps30 = 30;
const clampI = (f: number, range: [number, number], out: [number, number]) =>
  interpolate(f, range, out, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ============================================================
// TOTAL DURATION: 450 frames @ 30fps = exactly 15 seconds
// Set durationInFrames={450} in Root.tsx to match.
// ============================================================

// ============ WORLD LAYOUT ============
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

// ============ CAMERA ============
const camKeyframes: [number, number, number, number][] = [
  [0, CX, Y_HERO, 1.0],
  [25, CX, Y_HERO, 1.0],
  [40, CX, Y_OUTREACH + 60, 1.0],
  [65, CX, Y_EMAIL_PILL, 0.95],
  [90, CX, Y_CARD1, 0.85],
  [115, CX, Y_CARD1, 0.85],
  [128, CX, (Y_OUTREACH + Y_WAIT) / 2, 1.0],
  [155, CX, Y_WAIT + 10, 0.95],
  [190, CX, Y_FORK - 40, 0.85],
  [225, CX, Y_FORK + 120, 0.72],
  [250, L_X, Y_CARD, 1.35],
  [358, L_X, Y_CARD, 1.35],
  [368, CX, Y_FORK + 140, 0.68],
  [380, R_X, Y_CARD, 1.35],
  [408, R_X, Y_CARD, 1.35],
  [420, CX, (Y_OUTREACH + Y_RENEWALS) / 2, 0.52],
  [450, CX, (Y_OUTREACH + Y_RENEWALS) / 2, 0.52],
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
// select/delete/retype animation inside cards.
const TextCursor: React.FC<{h?: number}> = ({h = 15}) => {
  const f = useIdleFrame();
  const on = Math.floor(f / 8) % 2 === 0;
  return (
    <svg width={h * 0.6} height={h} viewBox="0 0 50 50" style={{display: 'inline-block', verticalAlign: '-0.15em', opacity: on ? 1 : 0, marginLeft: 1, marginRight: 1}}>
      <path d="M 20,9 C 23,9 25,11 25,14 L 25,23 M 22,23 L 28,23 M 25,23 L 25,36 C 25,39 23,41 20,41 M 30,9 C 27,9 25,11 25,14 M 25,36 C 25,39 27,41 30,41"
        fill="none" stroke="#333333" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

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
  const p = clampI(frame - appearAt, [0, 18], [0, 1]);
  const y = y1 + (y2 - y1) * p;
  const mid = (y1 + y2) / 2;
  const badgeOpacity = withBadge ? clampI(frame - appearAt, [4, 10], [0, 1]) * (1 - clampI(frame - appearAt, [22, 30], [0, 1])) : 0;
  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
        <circle cx={x} cy={y1} r={4} fill="#6b6b62" opacity={clampI(frame - appearAt, [0, 4], [0, 1])} />
        <line x1={x} y1={y1} x2={x} y2={y} stroke="#8a8a80" strokeWidth={2} strokeLinecap="round" />
        {p > 0.85 && <polygon points={`${x - 4.5},${y - 7} ${x + 4.5},${y - 7} ${x},${y}`} fill="#8a8a80" opacity={clampI(frame - appearAt, [15, 18], [0, 1])} />}
      </svg>
      {withBadge && <div style={{position: 'absolute', left: x, top: mid, transform: 'translate(-50%,-50%)', opacity: badgeOpacity}}><MagicBadge /></div>}
    </>
  );
};

// Orthogonal rounded-corner fork — SOLID line throughout (no dashing once drawn)
const ForkConnector: React.FC<{x: number; yTop: number; yMid: number; xL: number; xR: number; yBot: number; appearAt: number; frame: number}> = ({
  x, yTop, yMid, xL, xR, yBot, appearAt, frame,
}) => {
  const p1 = clampI(frame - appearAt, [0, 8], [0, 1]);
  const p2 = clampI(frame - appearAt, [7, 30], [0, 1]);
  const r = 26;
  const turnY = yMid + 42;

  const leftPath = `M${x},${yMid} L${x},${turnY - r} Q${x},${turnY} ${x - r},${turnY} L${xL + r},${turnY} Q${xL},${turnY} ${xL},${turnY + r} L${xL},${yBot - 8}`;
  const rightPath = `M${x},${yMid} L${x},${turnY - r} Q${x},${turnY} ${x + r},${turnY} L${xR - r},${turnY} Q${xR},${turnY} ${xR},${turnY + r} L${xR},${yBot - 8}`;

  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      <circle cx={x} cy={yTop} r={4} fill="#6b6b62" opacity={clampI(frame - appearAt, [0, 4], [0, 1])} />
      <line x1={x} y1={yTop} x2={x} y2={yTop + (yMid - yTop) * p1} stroke="#8a8a80" strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={x} cy={yMid} r={4} fill="#8a8a80" opacity={p1} />
      <path d={leftPath} fill="none" stroke="#8a8a80" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={420} strokeDashoffset={420 - 420 * p2} />
      <path d={rightPath} fill="none" stroke="#8a8a80" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={420} strokeDashoffset={420 - 420 * p2} />
      {p2 > 0.9 && (
        <>
          <polygon points={`${xL - 4.5},${yBot - 7} ${xL + 4.5},${yBot - 7} ${xL},${yBot}`} fill="#8a8a80" opacity={clampI(frame - appearAt, [26, 30], [0, 1])} />
          <polygon points={`${xR - 4.5},${yBot - 7} ${xR + 4.5},${yBot - 7} ${xR},${yBot}`} fill="#8a8a80" opacity={clampI(frame - appearAt, [26, 30], [0, 1])} />
        </>
      )}
    </svg>
  );
};

// type -> select(pink) -> delete -> retype(green, settles) sequence, with
// the custom I-beam cursor tracking the active edit point.
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

  const selectDur = 12, deleteAt = 16, typeAt = 22, typeDur = 20, settleAt = 48;

  if (t < 0 || localShown < text.length) return <>{base}</>;

  if (t < deleteAt) {
    const selP = clampI(t, [0, selectDur], [0, 1]);
    const selChars = Math.floor(edit.find.length * selP);
    const midSelect = selP > 0 && selP < 1;
    return (<>{before}<span style={{background: '#f6cfc7', borderRadius: 2}}>{edit.find.slice(0, selChars)}</span>{midSelect && <TextCursor />}{edit.find.slice(selChars)}{after}</>);
  }
  if (t < typeAt) return <>{before}<TextCursor />{after}</>;

  const typeP = clampI(t, [typeAt, typeAt + typeDur], [0, 1]);
  const typedChars = Math.floor(edit.replace.length * typeP);
  const settleP = clampI(t, [settleAt, settleAt + 12], [0, 1]);
  const green = `rgba(58,157,95,${1 - settleP})`;
  const stillTyping = typeP > 0 && typeP < 1;

  return (<>{before}<span style={{color: typedChars > 0 ? green : undefined}}>{edit.replace.slice(0, typedChars)}</span>{stillTyping && <TextCursor />}{after}</>);
};

const EmailCard: React.FC<{
  x: number; y: number; subject: string; lines: string[]; buttons: [string, string];
  appearAt: number; frame: number; badge?: boolean; width?: number;
  edit?: {lineIndex: number; find: string; replace: string; at: number};
}> = ({x, y, subject, lines, buttons, appearAt, frame, badge = true, width = 300, edit}) => {
  if (frame < appearAt) return null;
  const s = spring({frame: frame - appearAt, fps: fps30, config: {damping: 17, stiffness: 130}});
  const charCount = Math.floor(clampI(frame - appearAt, [8, 55], [0, 240]));
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
        <div style={{background: 'linear-gradient(180deg,#f8ca4a,#f3a83c)', borderRadius: 7, textAlign: 'center', padding: '9px 0', fontSize: 10.5, fontWeight: 600, color: '#4a3200', marginTop: 12, marginBottom: 8, opacity: clampI(frame - appearAt, [55, 63], [0, 1])}}>{buttons[0]}</div>
        <div style={{background: 'linear-gradient(180deg,#f8ca4a,#f3a83c)', borderRadius: 7, textAlign: 'center', padding: '9px 0', fontSize: 10.5, fontWeight: 600, color: '#4a3200', opacity: clampI(frame - appearAt, [60, 68], [0, 1])}}>{buttons[1]}</div>
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

  const detourActive = frame < 128;
  const detourCollapse = clampI(frame, [110, 128], [1, 0]);
  const finalFrame = frame >= 420;

  const heroT = clampI(frame, [25, 42], [0, 1]);
  const outreachY = interpolate(heroT, [0, 1], [Y_HERO, Y_OUTREACH]);
  const outreachScale = interpolate(heroT, [0, 1], [1.25, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: '#f4efe6', fontFamily: 'Inter, sans-serif', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 12, left: 12, zIndex: 10, background: 'white', borderRadius: 8, padding: '4px 10px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)'}}>
        <div style={{fontWeight: 800, fontSize: 14}}>beliv<span style={{color: '#7c3aed'}}>8</span>.</div>
        <div style={{fontSize: 5.5, color: '#999'}}>Believe in the Magic of Motion</div>
      </div>

      <div style={{position: 'absolute', left: 0, top: 0, width: 736, height: 414, transform: `translate(${tx}px, ${ty}px) scale(${worldScale})`, transformOrigin: '0 0'}}>

        {finalFrame && (
          <div style={{position: 'absolute', left: CX, top: (Y_OUTREACH + Y_RENEWALS) / 2, transform: `translate(-50%,-50%) scale(${spring({frame: frame - 420, fps: fps30, config: {damping: 18, stiffness: 100}})})`, width: 900, height: Y_RENEWALS - Y_OUTREACH + 220, background: '#fdf9f0', borderRadius: 30, boxShadow: '0 24px 60px rgba(0,0,0,0.14)'}} />
        )}

        <div style={{position: 'absolute', left: CX, top: outreachY, transform: `translate(-50%,-50%) scale(${outreachScale * spring({frame, fps: fps30, config: {damping: 15, stiffness: 150, mass: 0.5}})})`, background: '#fce3cf', border: '2px solid #f2a565', borderRadius: 999, padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 8, color: '#c9660f', fontWeight: 700, fontSize: 17, whiteSpace: 'nowrap'}}>
          {frame >= 25 && <IconPaperPlane />}
          {'Initial Outreach'.slice(0, Math.max(4, Math.floor(clampI(frame, [8, 22], [4, 16]))))}
        </div>

        {detourActive && (
          <div style={{opacity: detourCollapse, transform: `scale(${interpolate(detourCollapse, [0, 1], [0.85, 1])})`, transformOrigin: `${CX}px ${Y_OUTREACH}px`}}>
            <VConnector x={CX} y1={Y_OUTREACH + 26} y2={Y_EMAIL_PILL - 26} appearAt={42} frame={frame} withBadge />
            <Pill x={CX} y={Y_EMAIL_PILL} label="Email" icon={<IconEnvelope />} appearAt={55} frame={frame} bg="#fdf1e0" borderColor="#e8c07a" textColor="#a9770f" fontSize={14} />
            <EmailCard x={CX} y={Y_CARD1} appearAt={70} frame={frame} width={300} badge={false}
              subject="Quick check-in"
              lines={['I wanted to reach out — are you getting what you need from your membership right now?', 'If not, what would make it more relevant or useful for you?', 'If pricing is the concern just hit reply yes!']}
              buttons={['Yes', 'No, its something else']} />
          </div>
        )}

        {frame >= 118 && (
          <>
            <VConnector x={CX} y1={Y_OUTREACH + 26} y2={Y_WAIT - 26} appearAt={125} frame={frame} />
            {frame < 140 ? (
              <EmptyPill x={CX} y={Y_WAIT} w={210} appearAt={132} frame={frame} borderColor="#e0684a" bg="#fbdcd0" icon={<IconClock color="#d9603f" />} />
            ) : (
              <Pill x={CX} y={Y_WAIT} label="Wait for 5 days" icon={<IconClock />} appearAt={140} frame={frame} bg="#fbdcd0" borderColor="#e0684a" textColor="#d9603f" />
            )}
          </>
        )}

        {frame >= 190 && (
          <>
            <ForkConnector x={CX} yTop={Y_WAIT + 26} yMid={Y_WAIT + 55} xL={L_X} xR={R_X} yBot={Y_FORK - 20} appearAt={190} frame={frame} />
            <Pill x={L_X} y={Y_FORK} label="Responded" icon={<IconCheck appearAt={213} frame={frame} />} appearAt={213} frame={frame} fontSize={14} bg="#e9f6ee" borderColor="#8fd1a8" textColor="#3a9d5f" />
            <Pill x={R_X} y={Y_FORK} label="Didn't Respond" icon={<IconX appearAt={213} frame={frame} />} appearAt={213} frame={frame} fontSize={14} bg="#fbeceb" borderColor="#e3a099" textColor="#d2483c" />
          </>
        )}

        {frame >= 227 && (
          <>
            <div style={{position: 'absolute', left: L_X, top: Y_FORK + 34, transform: 'translateX(-50%)', fontSize: 13, fontWeight: 700, color: '#333', whiteSpace: 'nowrap', opacity: clampI(frame, [227, 237], [0, 1])}}>Relevance objection confirmed</div>
            <div style={{position: 'absolute', left: R_X, top: Y_FORK + 34, transform: 'translateX(-50%)', fontSize: 13, fontWeight: 700, color: '#333', whiteSpace: 'nowrap', opacity: clampI(frame, [227, 237], [0, 1])}}>Follow-up for members</div>
          </>
        )}

        <EmailCard x={L_X} y={Y_CARD} appearAt={232} frame={frame} width={300}
          subject="Quick follow-up"
          lines={['Thanks for sharing that with us.', 'We understand cost matters, and we want your membership to feel worth it.', 'If helpful, we can show you benefits that fit what matters most to you.']}
          buttons={['Ok, lets talk', "I really can't justify it"]}
          edit={{lineIndex: 1, find: 'worth it.', replace: 'meaningful.', at: 306}} />

        <EmailCard x={R_X} y={Y_CARD} appearAt={232} frame={frame} width={300}
          subject="Before you decide about next year"
          lines={['Before you decide about next year I wanted to check in.', "We'd love to make sure you're getting real value from your membership.", "If there's something you want more of, just let me know — we're here to help."]}
          buttons={['Ok, lets talk', "I really can't justify it"]} />

        {frame >= 250 && frame < 368 && (
          <div style={{position: 'absolute', left: CX, top: Y_FORK - 90, transform: 'translateX(-50%)', fontSize: 26, fontWeight: 700, color: '#222', whiteSpace: 'nowrap', opacity: clampI(frame, [250, 258], [0, 1]) * clampI(frame, [360, 368], [1, 0])}}>Relevance objection confirmed</div>
        )}
        {frame >= 380 && frame < 420 && (
          <div style={{position: 'absolute', left: CX, top: Y_FORK - 90, transform: 'translateX(-50%)', fontSize: 26, fontWeight: 700, color: '#222', whiteSpace: 'nowrap', opacity: clampI(frame, [380, 388], [0, 1]) * clampI(frame, [412, 420], [1, 0])}}>Follow-up for members</div>
        )}

        {finalFrame && (
          <>
            <div style={{position: 'absolute', left: CX, top: Y_RENEWALS, transform: 'translate(-50%,-50%)', opacity: clampI(frame, [430, 440], [0, 1])}}>
              <div style={{background: 'linear-gradient(180deg,#f89b46,#f3782e)', borderRadius: 999, padding: '15px 50px', color: 'white', fontWeight: 800, fontSize: 23, boxShadow: '0 10px 24px rgba(243,120,46,0.4)', transform: `scale(${spring({frame: frame - 430, fps: fps30, config: {damping: 12, stiffness: 140}})})`}}>Renewals</div>
            </div>
            {frame > 442 && (
              <svg style={{position: 'absolute', left: CX + 40, top: Y_RENEWALS + 60, opacity: clampI(frame, [442, 448], [0, 1])}} width="22" height="22" viewBox="0 0 20 20"><path d="M2 2l6 16 2-6 6-2z" fill="white" stroke="black" strokeWidth="1" /></svg>
            )}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};