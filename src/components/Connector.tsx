import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

export const Connector: React.FC<{x: number; fromY: number; toY: number; appearAt: number}> = ({
  x,
  fromY,
  toY,
  appearAt,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - appearAt, [0, 15], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const currentY = fromY + (toY - fromY) * progress;

  return (
    <svg style={{position: 'absolute', left: 0, top: 0}} width={736} height={414}>
      <line x1={x} y1={fromY} x2={x} y2={currentY} stroke="#e6a86a" strokeWidth={2} strokeDasharray="3 4" />
      <circle cx={x} cy={currentY} r={4} fill="#e6a86a" opacity={progress} />
    </svg>
  );
};