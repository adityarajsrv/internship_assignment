import React from 'react';
import {AbsoluteFill} from 'remotion';

export const Logo: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 14,
      left: 14,
      background: 'white',
      borderRadius: 8,
      padding: '4px 10px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
      fontWeight: 800,
      fontSize: 15,
    }}
  >
    beliv<span style={{color: '#7c3aed'}}>8</span>.
    <div style={{fontSize: 6, fontWeight: 400, color: '#999'}}>
      Believe in the Magic of Motion
    </div>
  </div>
);