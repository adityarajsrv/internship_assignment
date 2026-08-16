import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';

export const RenewalsPanel: React.FC<{x: number; y: number; appearAt: number}> = ({x, y, appearAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame - appearAt;
  if (local < 0) return null;
  const pop = spring({frame: local, fps, config: {damping: 14, stiffness: 130}});

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${pop})`,
        background: '#f5943c',
        color: 'white',
        fontWeight: 700,
        fontSize: 13,
        borderRadius: 999,
        padding: '8px 26px',
        boxShadow: '0 6px 16px rgba(245,148,60,0.4)',
      }}
    >
      Renewals
    </div>
  );
};