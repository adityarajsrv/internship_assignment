import React from 'react';
import {AbsoluteFill, useCurrentFrame, spring, interpolate} from 'remotion';

const fps30 = 30;
const clampI = (f: number, range: [number, number], out: [number, number]) =>
  interpolate(f, range, out, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ============================================================
// WORLD LAYOUT — derived from measuring the final overview frame
// ============================================================
const CX = 368;
const Y_OUTREACH = 80;
const Y_WAIT = 170;
const Y_FORK = 300;
const Y_CARD = 481;
const Y_RENEWALS = 680;
const CARD_GAP = 202;
const L_X = CX - CARD_GAP;
const R_X = CX + CARD_GAP;

// stage-1 detour (email demo) — separate, temporary, collapses away
const Y_HERO = 250;      // big centered intro pill position
const Y_EMAIL_PILL = 250; // relative offset below outreach during detour (world-local)
const Y_CARD1 = 420;

// ============================================================
// CAMERA
// ============================================================
const camKeyframes: [number, number, number, number][] = [
  [0, CX, Y_HERO, 1.0],       // centered hero pill
  [25, CX, Y_HERO, 1.0],
  [40, CX, Y_OUTREACH + 60, 1.0], // settle to top position
  [65, CX, Y_EMAIL_PILL, 0.95],
  [90, CX, Y_CARD1, 0.85],    // push into first demo card
  [115, CX, Y_CARD1, 0.85],
  [128, CX, (Y_OUTREACH + Y_WAIT) / 2, 1.0], // detour gone, simple 2-node view
  [155, CX, Y_WAIT + 10, 0.95],
  [185, CX, Y_FORK - 40, 0.85], // reveal fork
  [220, CX, Y_FORK + 120, 0.72], // pull back for labels + both cards starting
  [245, L_X, Y_CARD, 1.35],    // push into left card
  [270, L_X, Y_CARD, 1.35],
  [285, CX, (Y_OUTREACH + Y_RENEWALS) / 2, 0.44], // full pull-back
  [476, CX, (Y_OUTREACH + Y_RENEWALS) / 2, 0.44],
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
const IconPaperPlane = ({color = '#e07b32', size = 15}) => (
  <svg width={size} height={size} viewBox="0 0 16 16"><path d="M1 8l13-6-4 13-3-5-5-2z" fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" /></svg>
);
const IconEnvelope = ({color = '#c9660f', size = 14}) => (
  <svg width={size} height={size} viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="10" rx="1.5" fill="none" stroke={color} strokeWidth="1.4" /><path d="M1.5 4l6.5 5 6.5-5" fill="none" stroke={color} strokeWidth="1.4" /></svg>
);
const IconClock = ({color = '#d9603f', size = 15}) => (
  <svg width={size} height={size} viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" fill="none" stroke={color} strokeWidth="1.4" /><path d="M8 4.5v3.8l2.6 1.5" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" /></svg>
);
const IconCheck = ({color = '#3a9d5f', size = 14}) => (
  <svg width={size} height={size} viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" fill="none" stroke={color} strokeWidth="1.4" /><path d="M5 8.2l2 2 4-4.4" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const IconX = ({color = '#d2483c', size = 14}) => (
  <svg width={size} height={size} viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" fill="none" stroke={color} strokeWidth="1.4" /><path d="M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4" stroke={color} strokeWidth="1.5" strokeLinecap="round" /></svg>
);
const PencilBadge: React.FC<{size?: number}> = ({size = 30}) => (
  <div style={{width: size, height: size, borderRadius: 999, background: 'white', boxShadow: '0 3px 10px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 16 16"><path d="M2 14l1-3.5L10.5 2l3 3L6 12.5 2 14z" fill="none" stroke="#4aa3d8" strokeWidth="1.3" strokeLinejoin="round" /></svg>
  </div>
);

// ============ PRIMITIVES ============
const Pill: React.FC<{x: number; y: number; label: string; icon?: React.ReactNode; appearAt: number; frame: number; borderColor?: string; textColor?: string; bg?: string; fontSize?: number}> = ({
  x, y, label, icon, appearAt, frame, borderColor = '#f2a565', textColor = '#c9660f', bg = '#fce3cf', fontSize = 17,
}) => {
  if (frame < appearAt) return null;
  const s = spring({frame: frame - appearAt, fps: fps30, config: {damping: 15, stiffness: 150, mass: 0.5}});
  return (
    <div style={{
      position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`,
      background: bg, border: `2px solid ${borderColor}`, borderRadius: 999,
      padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 8,
      color: textColor, fontWeight: 700, fontSize, whiteSpace: 'nowrap',
    }}>
      {icon}{label}
    </div>
  );
};

// empty outline-only pill (used just before text fills in)
const EmptyPill: React.FC<{x: number; y: number; w: number; appearAt: number; frame: number; borderColor?: string; bg?: string; icon?: React.ReactNode}> = ({x, y, w, appearAt, frame, borderColor = '#f2a565', bg = '#fce3cf', icon}) => {
  if (frame < appearAt) return null;
  const s = spring({frame: frame - appearAt, fps: fps30, config: {damping: 15, stiffness: 150}});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, width: w, height: 56, background: bg, border: `2px solid ${borderColor}`, borderRadius: 999, display: 'flex', alignItems: 'center', paddingLeft: 24}}>
      {icon}
    </div>
  );
};

// straight connector with arrowhead + optional mid pencil badge
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
      {withBadge && (
        <div style={{position: 'absolute', left: x, top: mid, transform: 'translate(-50%,-50%)', opacity: badgeOpacity}}>
          <PencilBadge />
        </div>
      )}
    </>
  );
};

// tree fork with smooth curved branches + arrowheads
const ForkConnector: React.FC<{x: number; yTop: number; yMid: number; xL: number; xR: number; yBot: number; appearAt: number; frame: number}> = ({
  x, yTop, yMid, xL, xR, yBot, appearAt, frame,
}) => {
  const p1 = clampI(frame - appearAt, [0, 10], [0, 1]);
  const p2 = clampI(frame - appearAt, [9, 26], [0, 1]);
  const leftPath = `M${x},${yMid} C${x - 70},${yMid} ${xL + 70},${yBot} ${xL},${yBot}`;
  const rightPath = `M${x},${yMid} C${x + 70},${yMid} ${xR - 70},${yBot} ${xR},${yBot}`;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
      <circle cx={x} cy={yTop} r={4} fill="#6b6b62" opacity={clampI(frame - appearAt, [0, 4], [0, 1])} />
      <line x1={x} y1={yTop} x2={x} y2={yTop + (yMid - yTop) * p1} stroke="#8a8a80" strokeWidth={2} strokeLinecap="round" />
      <circle cx={x} cy={yMid} r={4} fill="#8a8a80" opacity={p1} />
      <path d={leftPath} fill="none" stroke="#8a8a80" strokeWidth={2} strokeLinecap="round" strokeDasharray={320} strokeDashoffset={320 - 320 * p2} />
      <path d={rightPath} fill="none" stroke="#8a8a80" strokeWidth={2} strokeLinecap="round" strokeDasharray={320} strokeDashoffset={320 - 320 * p2} />
      {p2 > 0.9 && (
        <>
          <polygon points={`${xL - 5},${yBot - 6} ${xL + 5},${yBot - 6} ${xL},${yBot + 2}`} fill="#8a8a80" opacity={clampI(frame - appearAt, [22, 26], [0, 1])} />
          <polygon points={`${xR - 5},${yBot - 6} ${xR + 5},${yBot - 6} ${xR},${yBot + 2}`} fill="#8a8a80" opacity={clampI(frame - appearAt, [22, 26], [0, 1])} />
        </>
      )}
    </svg>
  );
};

const EmailCard: React.FC<{
  x: number; y: number; subject: string; lines: string[]; buttons: [string, string];
  appearAt: number; frame: number; badge?: boolean; width?: number;
}> = ({x, y, subject, lines, buttons, appearAt, frame, badge = true, width = 300}) => {
  if (frame < appearAt) return null;
  const s = spring({frame: frame - appearAt, fps: fps30, config: {damping: 17, stiffness: 130}});
  const charCount = Math.floor(clampI(frame - appearAt, [8, 55], [0, 240]));
  let shown = 0;

  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`}}>
      {badge && <div style={{position: 'absolute', top: -14, left: -14, zIndex: 2}}><PencilBadge /></div>}
      <div style={{background: '#fdf9f0', border: '1px solid #ece0c8', borderRadius: 16, boxShadow: '0 12px 26px rgba(0,0,0,0.09)', padding: '20px 22px', width}}>
        <div style={{fontSize: 13, color: '#333', marginBottom: 9, borderBottom: '1px solid #eee', paddingBottom: 9}}>
          <span style={{color: '#999'}}>Subject: </span><b>{subject}</b>
        </div>
        {lines.map((text, i) => {
          const start = shown; shown += text.length;
          const localShown = Math.max(0, Math.min(text.length, charCount - start));
          return (
            <div key={i} style={{fontSize: 11, color: '#444', marginBottom: 9, lineHeight: 1.5, minHeight: 15}}>
              {text.slice(0, localShown)}
            </div>
          );
        })}
        <div style={{background: 'linear-gradient(180deg,#f8ca4a,#f3a83c)', borderRadius: 7, textAlign: 'center', padding: '9px 0', fontSize: 10.5, fontWeight: 600, color: '#4a3200', marginTop: 12, marginBottom: 8, opacity: clampI(frame - appearAt, [55, 63], [0, 1])}}>
          {buttons[0]}
        </div>
        <div style={{background: 'linear-gradient(180deg,#f8ca4a,#f3a83c)', borderRadius: 7, textAlign: 'center', padding: '9px 0', fontSize: 10.5, fontWeight: 600, color: '#4a3200', opacity: clampI(frame - appearAt, [60, 68], [0, 1])}}>
          {buttons[1]}
        </div>
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

  const detourActive = frame < 128;   // email-demo detour visible
  const detourCollapse = clampI(frame, [110, 128], [1, 0]); // fades/shrinks away
  const finalFrame = frame >= 285;

  // outreach pill: starts centered+big, animates to final top position
  const heroT = clampI(frame, [25, 42], [0, 1]);
  const outreachX = CX;
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
          <div style={{
            position: 'absolute', left: CX, top: (Y_OUTREACH + Y_RENEWALS) / 2,
            transform: `translate(-50%,-50%) scale(${spring({frame: frame - 285, fps: fps30, config: {damping: 18, stiffness: 100}})})`,
            width: 720, height: Y_RENEWALS - Y_OUTREACH + 140, background: '#fdf9f0', borderRadius: 28, boxShadow: '0 24px 60px rgba(0,0,0,0.14)',
          }} />
        )}

        {/* Outreach pill — animates from centered hero to fixed top slot, stays forever */}
        <div style={{
          position: 'absolute', left: outreachX, top: outreachY,
          transform: `translate(-50%,-50%) scale(${outreachScale * spring({frame, fps: fps30, config: {damping: 15, stiffness: 150, mass: 0.5}})})`,
          background: '#fce3cf', border: '2px solid #f2a565', borderRadius: 999, padding: '10px 22px',
          display: 'flex', alignItems: 'center', gap: 8, color: '#c9660f', fontWeight: 700, fontSize: 17, whiteSpace: 'nowrap',
        }}>
          {frame >= 25 && <IconPaperPlane />}
          {'Initial Outreach'.slice(0, Math.max(4, Math.floor(clampI(frame, [8, 22], [4, 16]))))}
        </div>

        {/* ===== STAGE 1 DETOUR: Email pill + demo card (collapses before Wait) ===== */}
        {detourActive && (
          <div style={{opacity: detourCollapse, transform: `scale(${interpolate(detourCollapse, [0, 1], [0.85, 1])})`, transformOrigin: `${CX}px ${Y_OUTREACH}px`}}>
            <VConnector x={CX} y1={Y_OUTREACH + 26} y2={Y_EMAIL_PILL - 26} appearAt={42} frame={frame} withBadge />
            <Pill x={CX} y={Y_EMAIL_PILL} label="Email" icon={<IconEnvelope />} appearAt={55} frame={frame}
              bg="#fdf1e0" borderColor="#e8c07a" textColor="#a9770f" fontSize={14} />
            <EmailCard x={CX} y={Y_CARD1} appearAt={70} frame={frame} width={300} badge={false}
              subject="Quick check-in"
              lines={[
                'I wanted to reach out — are you getting what you need from your membership right now?',
                'If not, what would make it more relevant or useful for you?',
                'If pricing is the concern just hit reply yes!',
              ]}
              buttons={['Yes', 'No, its something else']}
            />
          </div>
        )}

        {/* ===== STAGE 2: direct Outreach -> Wait for 5 days ===== */}
        {frame >= 118 && (
          <>
            <VConnector x={CX} y1={Y_OUTREACH + 26} y2={Y_WAIT - 26} appearAt={125} frame={frame} />
            {frame < 140 ? (
              <EmptyPill x={CX} y={Y_WAIT} w={210} appearAt={132} frame={frame} borderColor="#e0684a" bg="#fbdcd0" icon={<IconClock color="#d9603f" />} />
            ) : (
              <Pill x={CX} y={Y_WAIT} label="Wait for 5 days" icon={<IconClock />} appearAt={140} frame={frame}
                bg="#fbdcd0" borderColor="#e0684a" textColor="#d9603f" />
            )}
          </>
        )}

        {/* ===== STAGE 3: fork ===== */}
        {frame >= 185 && (
          <>
            <ForkConnector x={CX} yTop={Y_WAIT + 26} yMid={Y_WAIT + 55} xL={L_X} xR={R_X} yBot={Y_FORK - 20} appearAt={185} frame={frame} />
            <Pill x={L_X} y={Y_FORK} label="Responded" icon={<IconCheck />} appearAt={208} frame={frame} fontSize={14}
              bg="#e9f6ee" borderColor="#8fd1a8" textColor="#3a9d5f" />
            <Pill x={R_X} y={Y_FORK} label="Didn't Respond" icon={<IconX />} appearAt={208} frame={frame} fontSize={14}
              bg="#fbeceb" borderColor="#e3a099" textColor="#d2483c" />
          </>
        )}

        {/* labels */}
        {frame >= 222 && (
          <>
            <div style={{position: 'absolute', left: L_X, top: Y_FORK + 34, transform: 'translateX(-50%)', fontSize: 13, fontWeight: 700, color: '#333', whiteSpace: 'nowrap', opacity: clampI(frame, [222, 232], [0, 1])}}>
              Relevance objection confirmed
            </div>
            <div style={{position: 'absolute', left: R_X, top: Y_FORK + 34, transform: 'translateX(-50%)', fontSize: 13, fontWeight: 700, color: '#333', whiteSpace: 'nowrap', opacity: clampI(frame, [222, 232], [0, 1])}}>
              Follow-up for members
            </div>
          </>
        )}

        {/* cards */}
        <EmailCard
          x={L_X} y={Y_CARD} appearAt={228} frame={frame} width={300}
          subject="Quick follow-up"
          lines={[
            'Thanks for sharing that with us.',
            'We understand cost matters, and we want your membership to feel meaningful.',
            'If helpful, we can show you benefits that fit what matters most to you.',
          ]}
          buttons={['Ok, lets talk', "I really can't justify it"]}
        />
        <EmailCard
          x={R_X} y={Y_CARD} appearAt={228} frame={frame} width={300}
          subject="Before you decide about next year"
          lines={[
            'Before you decide about next year I wanted to check in.',
            "We'd love to make sure you're getting real value from your membership.",
            "If there's something you want more of, just let me know — we're here to help.",
          ]}
          buttons={['Ok, lets talk', "I really can't justify it"]}
        />

        {/* large title shown only while camera is pushed into left card */}
        {frame >= 245 && frame < 285 && (
          <div style={{position: 'absolute', left: CX, top: Y_FORK - 90, transform: 'translateX(-50%)', fontSize: 26, fontWeight: 700, color: '#222', whiteSpace: 'nowrap', opacity: clampI(frame, [245, 253], [0, 1]) * clampI(frame, [278, 285], [1, 0])}}>
            Relevance objection confirmed
          </div>
        )}

        {finalFrame && (
          <>
            <div style={{position: 'absolute', left: CX, top: Y_RENEWALS, transform: 'translate(-50%,-50%)', opacity: clampI(frame, [300, 315], [0, 1])}}>
              <div style={{
                background: 'linear-gradient(180deg,#f89b46,#f3782e)', borderRadius: 999, padding: '15px 50px',
                color: 'white', fontWeight: 800, fontSize: 23, boxShadow: '0 10px 24px rgba(243,120,46,0.4)',
                transform: `scale(${spring({frame: frame - 300, fps: fps30, config: {damping: 12, stiffness: 140}})})`,
              }}>
                Renewals
              </div>
            </div>
            {frame > 340 && (
              <svg style={{position: 'absolute', left: CX + 40, top: Y_RENEWALS + 60, opacity: clampI(frame, [340, 350], [0, 1])}} width="22" height="22" viewBox="0 0 20 20">
                <path d="M2 2l6 16 2-6 6-2z" fill="white" stroke="black" strokeWidth="1" />
              </svg>
            )}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};