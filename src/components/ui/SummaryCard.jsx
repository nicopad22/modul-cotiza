import React from 'react';
import { T } from '../../theme';
import { MetricCard } from './MetricCard';
import { SkeletonPulse } from './SkeletonPulse';

export default function SummaryCard({
    placedCount,
    totalSqm,
    totalUF,
    pricePerM2UF,
    ufSource,
    estimateLoading,
    estimate,
    clpTotal,
}) {
    return (
        <div style={{
            background: `linear-gradient(160deg, rgba(14,28,31,0.92) 0%, rgba(10,18,20,0.96) 100%)`,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '14px',
            border: `1px solid rgba(0, 218, 243, 0.22)`,
            padding: '14px 16px',
            boxShadow: '0 4px 32px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 218, 243, 0.06)',
            minWidth: '240px',
        }}>
            {/* Product label + price row */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{
                    fontFamily: T.fontBody,
                    fontSize: '1.5rem',
                    fontWeight: 600,
                    color: T.onSurfaceVariant,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                }}>
                    {`Modul ${placedCount}×`}
                </span>
                {pricePerM2UF != null && (
                    <span style={{
                        fontFamily: T.fontHead,
                        fontSize: '0.85rem',
                        color: T.outline,
                        opacity: estimateLoading ? 0.5 : 1,
                        transition: 'opacity 0.2s ease',
                    }}>
                        {pricePerM2UF.toLocaleString('es-CL', { maximumFractionDigits: 1 })} UF/m²
                    </span>
                )}
            </div>

            {/* Metrics row */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                {/* Total price card */}
                <div style={{
                    flex: 1,
                    background: T.surfaceContHigh,
                    borderRadius: '10px',
                    padding: '10px 12px',
                    border: `1px solid rgba(0, 218, 243, 0.15)`,
                }}>
                    <div style={{
                        fontFamily: T.fontBody,
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: T.onSurfaceVariant,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        marginBottom: '4px',
                    }}>Precio estimado</div>

                    {estimateLoading && !estimate ? (
                        <SkeletonPulse height="1.8rem" />
                    ) : totalUF != null ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                                <span style={{
                                    fontFamily: T.fontHead,
                                    fontSize: '1.6rem',
                                    fontWeight: 700,
                                    color: T.primaryCont,
                                    letterSpacing: '-0.02em',
                                    fontVariantNumeric: 'tabular-nums',
                                    textShadow: '0 0 16px rgba(0, 229, 255, 0.35)',
                                    opacity: estimateLoading ? 0.5 : 1,
                                    transition: 'opacity 0.2s ease',
                                }}>
                                    {totalUF.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                                </span>
                                <span style={{
                                    fontFamily: T.fontHead,
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    color: T.surfaceTint,
                                }}>UF</span>
                            </div>
                            {clpTotal != null && (
                                <div style={{
                                    fontFamily: T.fontBody,
                                    fontSize: '0.72rem',
                                    color: T.outline,
                                    marginTop: '2px',
                                    opacity: estimateLoading ? 0.5 : 1,
                                    transition: 'opacity 0.2s ease',
                                }}>
                                    ≈ ${clpTotal.toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                                </div>
                            )}
                        </>
                    ) : (
                        <div style={{ fontFamily: T.fontBody, fontSize: '0.85rem', color: T.outline }}>
                            Configurando…
                        </div>
                    )}
                </div>

                {/* Surface area card */}
                <MetricCard
                    label="Superficie"
                    value={typeof totalSqm === 'number' ? totalSqm.toFixed(1) : '—'}
                    unit="m²"
                />
            </div>

            {/* Disclaimer — compact */}
            <div style={{
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
            }}>
                <span style={{ fontSize: '0.75rem', flexShrink: 0 }}>⚠️</span>
                <p style={{
                    margin: 0,
                    fontFamily: T.fontBody,
                    fontSize: '0.68rem',
                    lineHeight: 1.4,
                    color: 'rgba(255, 220, 130, 0.7)',
                }}>
                    Precio referencial. UF{ufSource !== 'SII' ? ' aprox.' : ''} · sujeto a terreno y confirmación de ventas.
                </p>
            </div>
        </div>
    );
}
