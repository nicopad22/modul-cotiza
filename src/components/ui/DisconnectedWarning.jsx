import React from 'react';

export default function DisconnectedWarning({ index, cellCount, onDelete }) {
    return (
        <div style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '14px 18px',
            background: 'rgba(15,10,10,0.82)',
            backdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(239,68,68,0.55)',
            borderLeft: '4px solid #ef4444',
            borderRadius: '12px',
            animation: 'slideUp 0.3s ease, warnPulse 2.5s ease-in-out 0.3s infinite',
        }}>
            {/* Warning icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="rgba(239,68,68,0.2)" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" />
                <line x1="12" y1="9" x2="12" y2="13" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="12" cy="17" r="1" fill="#ef4444" />
            </svg>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.82rem', color: '#fca5a5', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    ATENCIÓN{index ? ` (estructura ${index})` : ''}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '2px' }}>
                    Estructura separada de la casa principal detectada.{' '}
                    <span style={{ color: '#94a3b8', fontWeight: 400 }}>
                        ({cellCount} {cellCount === 1 ? 'módulo' : 'módulos'})
                    </span>
                </div>
            </div>

            {/* Delete button */}
            <button
                onClick={onDelete}
                style={{
                    flexShrink: 0,
                    background: 'rgba(239,68,68,0.15)',
                    border: '1px solid rgba(239,68,68,0.45)',
                    borderRadius: '8px',
                    padding: '7px 14px',
                    color: '#fca5a5',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'background 0.15s, border-color 0.15s',
                    whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.3)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.7)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.45)'; }}
            >
                Eliminar estructura
            </button>
        </div>
    );
}
