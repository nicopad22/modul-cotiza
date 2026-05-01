import React from 'react';
import { T } from '../../theme';
import { SectionLabel } from './SectionLabel';
import { MetricCard } from './MetricCard';
import { SkeletonPulse } from './SkeletonPulse';

export default function SummaryCard({
    placedCount,
    totalSqm,
    totalUF,
    pricePerM2UF,
    ufSource,
    estimateLoading,
    estimate
}) {
    return (
        <>
            <div style={{
                background: `linear-gradient(160deg, ${T.surfaceContLow} 0%, #0e1c1f 100%)`,
                borderRadius: '14px',
                border: `1px solid rgba(0, 218, 243, 0.18)`,
                padding: '16px',
                boxShadow: '0 0 24px rgba(0, 218, 243, 0.08)',
            }}>
                {/* Product name */}
                <div style={{ marginBottom: '14px' }}>
                    <SectionLabel>Producto</SectionLabel>
                    <div style={{
                        fontFamily: T.fontHead,
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: T.onSurface,
                        letterSpacing: '-0.01em',
                        lineHeight: 1.25,
                    }}>{`Modul ${placedCount}×`}</div>
                </div>

                {/* Divider */}
                <div style={{
                    borderTop: `1px solid ${T.outlineVariant}`,
                    marginBottom: '14px',
                }} />

                {/* Metrics row */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    <MetricCard
                        label="Superficie"
                        value={typeof totalSqm === 'number' ? totalSqm.toFixed(1) : '—'}
                        unit="m²"
                    />
                    <MetricCard
                        label="Módulos"
                        value={placedCount}
                        unit={placedCount === 1 ? 'módulo' : 'módulos'}
                    />
                </div>

                {/* UF Price */}
                <div style={{
                    background: T.surfaceContHigh,
                    borderRadius: '10px',
                    padding: '12px 14px',
                    border: `1px solid rgba(0, 218, 243, 0.15)`,
                    marginBottom: '6px',
                }}>
                    <SectionLabel style={{ marginBottom: '6px' }}>Precio estimado</SectionLabel>
                    {estimateLoading && !estimate ? (
                        <SkeletonPulse height="2.4rem" />
                    ) : totalUF != null ? (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{
                                fontFamily: T.fontHead,
                                fontSize: '2.1rem',
                                fontWeight: 700,
                                color: T.primaryCont,
                                letterSpacing: '-0.02em',
                                fontVariantNumeric: 'tabular-nums',
                                textShadow: '0 0 20px rgba(0, 229, 255, 0.4)',
                                opacity: estimateLoading ? 0.5 : 1,
                                transition: 'opacity 0.2s ease',
                            }}>
                                {totalUF.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                            </span>
                            <span style={{
                                fontFamily: T.fontHead,
                                fontSize: '1.05rem',
                                fontWeight: 600,
                                color: T.surfaceTint,
                            }}>UF</span>
                        </div>
                    ) : (
                        <div style={{
                            fontFamily: T.fontBody,
                            fontSize: '0.9rem',
                            color: T.outline,
                        }}>Configurando...</div>
                    )}
                </div>

                {/* Price per m² */}
                {pricePerM2UF != null && (
                    <div style={{
                        fontFamily: T.fontHead,
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        color: T.onSurfaceVariant,
                        textAlign: 'right',
                        marginBottom: '10px',
                        opacity: estimateLoading ? 0.5 : 1,
                        transition: 'opacity 0.2s ease',
                    }}>
                        {pricePerM2UF.toLocaleString('es-CL', { maximumFractionDigits: 1 })} UF/m²
                    </div>
                )}

                {/* Disclaimer */}
                <div style={{
                    background: 'rgba(255, 231, 36, 0.05)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    border: '1px solid rgba(255, 213, 0, 0.15)',
                    display: 'flex',
                    gap: '7px',
                    alignItems: 'flex-start',
                }}>
                    <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: '1px' }}>⚠️</span>
                    <p style={{
                        margin: 0,
                        fontFamily: T.fontBody,
                        fontSize: '0.8rem',
                        lineHeight: 1.6,
                        color: 'rgba(255, 220, 130, 0.85)',
                    }}>
                        Precio <strong>referencial</strong> sujeto a valor de UF del día
                        {ufSource !== 'SII' && ' (UF aproximada)'} y condiciones de terreno.
                        La cotización oficial será confirmada por nuestro equipo de ventas.
                    </p>
                </div>
            </div>

            {/* ── Shimmer keyframes (injected once) ──────────── */}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </>
    );
}
