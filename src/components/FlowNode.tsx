import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

export const FlowNode: React.FC<{
  label: string;
  icon: 'target' | 'clock';
  x: number;
  y: number;
  appearAt: number;
  shrinkAt?: number;
  small?: boolean;
}> = ({label, x, y, appearAt, shrinkAt, small}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const localFrame = frame - appearAt;
  if (localFrame < 0) return null;

  const pop = spring({frame: localFrame, fps, config: {damping: 14, stiffness: 140, mass: 0.6}});
  const shrunk = shrinkAt ? interpolate(frame, [shrinkAt, shrinkAt + 15], [1, 0.55], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;

  // letters revealed over first 20 frames for the typing effect
  const charsToShow = Math.floor(interpolate(localFrame, [0, 20], [3, label.length], {extrapolateRight: 'clamp'}));
  const displayLabel = shrinkAt && frame > appearAt + 20 ? label : label.slice(0, charsToShow);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${pop * shrunk})`,
        background: small ? '#fdf1e6' : '#fce3cf',
        border: '1.5px solid #f2a565',
        borderRadius: 999,
        padding: '8px 22px',
        color: '#c9660f',
        fontWeight: 700,
        fontSize: 15,
        whiteSpace: 'nowrap',
      }}
    >
      {displayLabel}
    </div>
  );
};