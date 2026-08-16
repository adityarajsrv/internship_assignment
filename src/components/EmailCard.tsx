import React from 'react';
import {useCurrentFrame, useVideoConfig, spring, interpolate} from 'remotion';

export const EmailCard: React.FC<{
  x: number;
  y: number;
  subject: string;
  body: string;
  buttons: [string, string];
  appearAt: number;
  collapseAt?: number;
  scale?: number;
  tagLabel?: string;
}> = ({x, y, subject, body, buttons, appearAt, collapseAt, scale = 1, tagLabel}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame - appearAt;
  if (local < 0) return null;

  const pop = spring({frame: local, fps, config: {damping: 15, stiffness: 120}});
  const shrink = collapseAt
    ? interpolate(frame, [collapseAt, collapseAt + 15], [1, 0.4], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 1;

  const lineOpacity = (delay: number) =>
    interpolate(local - delay, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${pop * shrink * scale})`,
        background: 'white',
        borderRadius: 14,
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        padding: 16,
        width: 220,
      }}
    >
      {tagLabel && (
        <div style={{fontSize: 9, color: '#999', marginBottom: 6, opacity: lineOpacity(0)}}>{tagLabel}</div>
      )}
      <div style={{fontWeight: 700, fontSize: 11, marginBottom: 6, opacity: lineOpacity(4)}}>
        Subject: {subject}
      </div>
      <div style={{fontSize: 9.5, color: '#555', lineHeight: 1.4, marginBottom: 10, opacity: lineOpacity(10)}}>
        {body}
      </div>
      <div
        style={{
          background: '#f6c344',
          borderRadius: 6,
          textAlign: 'center',
          padding: '6px 0',
          fontSize: 9,
          fontWeight: 600,
          marginBottom: 6,
          opacity: lineOpacity(18),
        }}
      >
        {buttons[0]}
      </div>
      <div
        style={{
          background: '#f6c344',
          borderRadius: 6,
          textAlign: 'center',
          padding: '6px 0',
          fontSize: 9,
          fontWeight: 600,
          opacity: lineOpacity(22),
        }}
      >
        {buttons[1]}
      </div>
    </div>
  );
};