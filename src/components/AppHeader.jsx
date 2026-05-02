import React from 'react';
import { T } from '../theme';

// ─── AppHeader ────────────────────────────────────────────────────────────────
// Shared logo + title + PDF download button used in both desktop sidebar
// and the mobile top bar. Props mirror the original inline implementations.
const AppHeader = ({
    quoteLoading = false,
    quantity = 0,
    onDownloadPdf = null,
    compact = false,          // true → mobile-sized variant
    marginBottom = undefined, // override default spacing
}) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? '10px' : '12px',
        marginBottom: marginBottom ?? (compact ? '12px' : '24px'),
    }}>
        <img
            src="/logo-modul-hd-negro.png"
            alt="Modul Logo"
            style={{
                width: compact ? '32px' : '40px',
                height: compact ? '32px' : '40px',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
                opacity: 0.9,
            }}
        />
        <div>
            <h1 style={{
                margin: 0,
                fontFamily: T.fontHead,
                fontSize: compact ? '1.15rem' : '1.35rem',
                fontWeight: 700,
                color: T.onSurface,
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
            }}>Mi Modul</h1>
            <div style={{
                fontFamily: T.fontBody,
                fontSize: compact ? '0.75rem' : '0.85rem',
                color: T.onSurfaceVariant,
                marginTop: compact ? '2px' : '3px',
            }}>Configurador</div>
        </div>

        {/* PDF button */}
        <button
            id={compact ? 'btn-download-pdf-mobile' : 'btn-download-pdf'}
            onClick={onDownloadPdf}
            disabled={quoteLoading || quantity === 0}
            title="Descargar cotización PDF"
            style={{
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: compact ? '5px' : '6px',
                padding: compact ? '7px 12px' : '8px 14px',
                borderRadius: '8px',
                border: `1px solid rgba(0,218,243,0.25)`,
                background: quoteLoading || quantity === 0
                    ? 'rgba(255,255,255,0.04)'
                    : 'rgba(0,218,243,0.10)',
                color: quoteLoading || quantity === 0
                    ? T.outline
                    : T.surfaceTint,
                fontFamily: T.fontHead,
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: quoteLoading || quantity === 0 ? 'not-allowed' : 'pointer',
                letterSpacing: '0.01em',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease',
                boxShadow: quoteLoading || quantity === 0
                    ? 'none'
                    : '0 0 10px rgba(0,218,243,0.15)',
            }}
        >
            {quoteLoading ? '⏳' : ''}
            {quoteLoading ? 'Generando…' : 'Obtener Cotización'}
        </button>
    </div>
);

export default AppHeader;
