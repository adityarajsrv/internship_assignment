import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

export const BranchSplit: React.FC<{x: number; y: number; appearAt: number; leftLabel: string; rightLabel: string}> = ({
  x,
  y,
  appearAt,
  leftLabel,
  rightLabel,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - appearAt, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const spread = 130 * progress;

  return (
    <>
      <svg style={{position: 'absolute', left: 0, top: 0}} width={736} height={414}>
        <line x1={x - spread} y1={y} x2={x + spread} y2={y} stroke="#ccc" strokeWidth={1.5} />
        <line x1={x} y1={y - 20} x2={x} y2={y} stroke="#ccc" strokeWidth={1.5} />
      </svg>
      <div style={{position: 'absolute', left: x - spread, top: y, transform: 'translate(-50%,10px)', fontSize: 10, opacity: progress}}>
        🔵 {leftLabel}
      </div>
      <div style={{position: 'absolute', left: x + spread, top: y, transform: 'translate(-50%,10px)', fontSize: 10, opacity: progress}}>
        🔵 {rightLabel}
      </div>
    </>
  );
};