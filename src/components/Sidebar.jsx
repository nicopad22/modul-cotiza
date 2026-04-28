import React from 'react';

// ─── Design tokens (from design.md) ───────────────────────────────────────────
const T = {
    // Surfaces
    bg:               '#131313',
    surfaceContLow:   '#1c1b1b',
    surfaceCont:      '#201f1f',
    surfaceContHigh:  '#2a2a2a',
    surfaceContHighest: '#353534',
    // Text
    onSurface:        '#e5e2e1',
    onSurfaceVariant: '#bac9cc',
    outline:          '#849396',
    outlineVariant:   '#3b494c',
    // Accent – Electric Cyan
    primary:          '#c3f5ff',
    primaryCont:      '#00e5ff',
    onPrimary:        '#00363d',
    surfaceTint:      '#00daf3',
    // Error / tertiary warn
    tertiary:         '#ffe7e7',
    tertiaryContainer:'#ffc1c4',
    // Fonts
    fontHead:         "'Space Grotesk', system-ui, sans-serif",
    fontBody:         "'Manrope', system-ui, sans-serif",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Section label – uppercase, letter-spaced, muted */
const SectionLabel = ({ children, style = {} }) => (
    <div style={{
        fontFamily: T.fontHead,
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: T.onSurfaceVariant,
        marginBottom: '10px',
        ...style,
    }}>
        {children}
    </div>
);

/** Glassmorphic card container */
const Card = ({ children, style = {} }) => (
    <div style={{
        background: T.surfaceContLow,
        borderRadius: '12px',
        border: `1px solid ${T.outlineVariant}`,
        padding: '16px',
        marginBottom: '12px',
        ...style,
    }}>
        {children}
    </div>
);

/** Toggle pill button (active = cyan glow) */
const ToggleBtn = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        style={{
            flex: 1,
            padding: '11px 0',
            borderRadius: '8px',
            border: active ? `1px solid ${T.surfaceTint}` : '1px solid transparent',
            cursor: 'pointer',
            fontFamily: T.fontHead,
            fontSize: '0.92rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            transition: 'all 0.2s ease',
            background: active
                ? `rgba(0, 218, 243, 0.15)`
                : 'transparent',
            color: active ? T.primaryCont : T.onSurfaceVariant,
            boxShadow: active
                ? '0 0 12px rgba(0, 229, 255, 0.25)'
                : 'none',
        }}
    >
        {children}
    </button>
);

/** Metric mini-card (surface + cyan value) */
const MetricCard = ({ label, value, unit }) => (
    <div style={{
        flex: 1,
        background: T.surfaceContHigh,
        borderRadius: '8px',
        padding: '14px 14px',
        border: `1px solid ${T.outlineVariant}`,
    }}>
        <div style={{
            fontFamily: T.fontHead,
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: T.onSurfaceVariant,
            marginBottom: '8px',
        }}>{label}</div>
        <div style={{
            fontFamily: T.fontHead,
            fontSize: '1.65rem',
            fontWeight: 700,
            color: T.primaryCont,
            lineHeight: 1,
            fontVariantNumeric: 'tabular-nums',
        }}>{value}</div>
        <div style={{
            fontFamily: T.fontBody,
            fontSize: '0.78rem',
            color: T.outline,
            marginTop: '5px',
        }}>{unit}</div>
    </div>
);

/** Segmented selector (3 options in a row) */
const SegmentedSelector = ({ options, value, onChange }) => (
    <div style={{
        background: T.surfaceCont,
        borderRadius: '10px',
        padding: '4px',
        display: 'flex',
        gap: '4px',
        border: `1px solid ${T.outlineVariant}`,
    }}>
        {options.map(opt => (
            <ToggleBtn
                key={opt.value}
                active={value === opt.value}
                onClick={() => onChange(opt.value)}
            >
                {opt.label}
            </ToggleBtn>
        ))}
    </div>
);

/** Numeric stepper (+/− buttons) */
const Stepper = ({ label, value, min = 1, max = 10, onChange }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: T.surfaceContHigh,
        borderRadius: '8px',
        padding: '10px 14px',
        border: `1px solid ${T.outlineVariant}`,
    }}>
        <span style={{
            fontFamily: T.fontHead,
            fontSize: '0.85rem',
            fontWeight: 600,
            color: T.onSurface,
        }}>{label}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={value <= min}
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    border: `1px solid ${T.outlineVariant}`,
                    background: value <= min ? T.surfaceCont : T.surfaceContLow,
                    color: value <= min ? T.outlineVariant : T.primaryCont,
                    cursor: value <= min ? 'not-allowed' : 'pointer',
                    fontFamily: T.fontHead,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                }}
            >−</button>
            <span style={{
                fontFamily: T.fontHead,
                fontSize: '1.3rem',
                fontWeight: 700,
                color: T.primaryCont,
                minWidth: '28px',
                textAlign: 'center',
                fontVariantNumeric: 'tabular-nums',
            }}>{value}</span>
            <button
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={value >= max}
                style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    border: `1px solid ${T.outlineVariant}`,
                    background: value >= max ? T.surfaceCont : T.surfaceContLow,
                    color: value >= max ? T.outlineVariant : T.primaryCont,
                    cursor: value >= max ? 'not-allowed' : 'pointer',
                    fontFamily: T.fontHead,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease',
                }}
            >+</button>
        </div>
    </div>
);

/** Pulsing skeleton for loading state */
const SkeletonPulse = ({ width = '100%', height = '2.1rem' }) => (
    <div style={{
        width,
        height,
        borderRadius: '6px',
        background: `linear-gradient(90deg, ${T.surfaceContHigh} 25%, ${T.surfaceContHighest} 50%, ${T.surfaceContHigh} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
    }} />
);

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({
    quantity,
    viewMode, setViewMode,
    environment, setEnvironment,
    selections, setSelections,
    estimate, estimateLoading,
}) => {
    const placedCount = quantity;

    // Derive display values from the API estimate, fall back to simple math
    const totalSqm = estimate?.geometry?.gross_area_m2 ?? (placedCount * 10.89);
    const totalUF = estimate?.totals?.final_total_uf;
    const pricePerM2UF = estimate?.totals?.price_per_m2_uf;
    const ufSource = estimate?.totals?.uf_source ?? 'pendiente';

    // Max constraints for steppers
    const maxBedrooms = Math.max(1, placedCount - 1);
    const maxBathrooms = Math.max(1, Math.floor(placedCount / 2));

    const updateSelection = (key, value) => {
        setSelections(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div style={{
            width: '22%',
            minWidth: '340px',
            maxWidth: '400px',
            height: '100%',
            background: T.bg,
            borderRight: `1px solid ${T.outlineVariant}`,
            display: 'flex',
            flexDirection: 'column',
            padding: '24px 20px',
            boxSizing: 'border-box',
            overflowY: 'auto',
            fontFamily: T.fontBody,
            fontSize: '1rem',
            color: T.onSurface,
            // Custom scrollbar
            scrollbarWidth: 'thin',
            scrollbarColor: `${T.outlineVariant} transparent`,
        }}>

            {/* ── Logo + title ─────────────────────────────── */}
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                    src="/logo-modul-hd-negro.png"
                    alt="Modul Logo"
                    style={{
                        width: '40px',
                        height: '40px',
                        objectFit: 'contain',
                        filter: 'brightness(0) invert(1)',
                        opacity: 0.9,
                    }}
                />
                <div>
                    <h1 style={{
                        margin: 0,
                        fontFamily: T.fontHead,
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        color: T.onSurface,
                        letterSpacing: '-0.01em',
                        lineHeight: 1.1,
                    }}>Mi Modul</h1>
                    <div style={{
                        fontFamily: T.fontBody,
                        fontSize: '0.85rem',
                        color: T.onSurfaceVariant,
                        marginTop: '3px',
                    }}>Configurador</div>
                </div>
            </div>

            {/* ── View mode toggle ─────────────────────────── */}
            <div style={{ marginBottom: '12px' }}>
                <SectionLabel>Vista</SectionLabel>
                <div style={{
                    background: T.surfaceCont,
                    borderRadius: '10px',
                    padding: '4px',
                    display: 'flex',
                    gap: '4px',
                    border: `1px solid ${T.outlineVariant}`,
                }}>
                    <ToggleBtn active={viewMode === '3d'} onClick={() => setViewMode('3d')}>
                        🧊 3D
                    </ToggleBtn>
                    <ToggleBtn active={viewMode === '2d'} onClick={() => setViewMode('2d')}>
                        🗺 Planta
                    </ToggleBtn>
                </div>
            </div>

            {/* ── Environment toggle (3D only) ─────────────── */}
            {viewMode === '3d' && (
                <div style={{ marginBottom: '12px' }}>
                    <SectionLabel>Entorno</SectionLabel>
                    <div style={{
                        background: T.surfaceCont,
                        borderRadius: '10px',
                        padding: '4px',
                        display: 'flex',
                        gap: '4px',
                        border: `1px solid ${T.outlineVariant}`,
                    }}>
                        <ToggleBtn active={environment === 'norte'} onClick={() => setEnvironment('norte')}>
                            🏜 Norte
                        </ToggleBtn>
                        <ToggleBtn active={environment === 'sur'} onClick={() => setEnvironment('sur')}>
                            🌲 Sur
                        </ToggleBtn>
                    </div>
                </div>
            )}

            {/* ── Wall panel type ──────────────────────────── */}
            <div style={{ marginBottom: '12px' }}>
                <SectionLabel>Panel de muro</SectionLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                        { value: 'mgo_sip_122', label: 'SIP MgO 122 mm', desc: 'Aislación estándar' },
                        { value: 'mgo_sip_152', label: 'SIP MgO 152 mm', desc: 'Aislación reforzada' },
                    ].map((opt) => {
                        const active = selections.wallPanelType === opt.value;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => updateSelection('wallPanelType', opt.value)}
                                style={{
                                    padding: '13px 16px',
                                    borderRadius: '8px',
                                    border: active
                                        ? `1px solid ${T.surfaceTint}`
                                        : `1px solid ${T.outlineVariant}`,
                                    cursor: 'pointer',
                                    background: active
                                        ? `rgba(0, 218, 243, 0.10)`
                                        : T.surfaceContHigh,
                                    color: active ? T.primaryCont : T.onSurface,
                                    fontFamily: T.fontHead,
                                    fontSize: '0.92rem',
                                    fontWeight: 600,
                                    textAlign: 'left',
                                    transition: 'all 0.18s ease',
                                    boxShadow: active
                                        ? '0 0 12px rgba(0, 229, 255, 0.2)'
                                        : 'none',
                                }}
                            >
                                <div>{opt.label}</div>
                                <div style={{
                                    fontFamily: T.fontBody,
                                    fontSize: '0.75rem',
                                    fontWeight: 400,
                                    color: active ? T.onSurfaceVariant : T.outline,
                                    marginTop: '3px',
                                }}>{opt.desc}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Kitchen quality ───────────────────────────── */}
            <div style={{ marginBottom: '12px' }}>
                <SectionLabel>Cocina</SectionLabel>
                <SegmentedSelector
                    options={[
                        { value: 'basic', label: 'Basic' },
                        { value: 'standard', label: 'Standard' },
                        { value: 'premium', label: 'Premium' },
                    ]}
                    value={selections.kitchenType}
                    onChange={(v) => updateSelection('kitchenType', v)}
                />
            </div>

            {/* ── Bathroom quality ──────────────────────────── */}
            <div style={{ marginBottom: '12px' }}>
                <SectionLabel>Baño</SectionLabel>
                <SegmentedSelector
                    options={[
                        { value: 'basic', label: 'Basic' },
                        { value: 'standard', label: 'Standard' },
                        { value: 'premium', label: 'Premium' },
                    ]}
                    value={selections.bathroomType}
                    onChange={(v) => updateSelection('bathroomType', v)}
                />
            </div>

            {/* ── Bedrooms / Bathrooms steppers ─────────────── */}
            <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <SectionLabel>Habitaciones</SectionLabel>
                <Stepper
                    label="Dormitorios"
                    value={selections.bedrooms}
                    min={1}
                    max={maxBedrooms}
                    onChange={(v) => updateSelection('bedrooms', v)}
                />
                <Stepper
                    label="Baños"
                    value={selections.bathrooms}
                    min={1}
                    max={maxBathrooms}
                    onChange={(v) => updateSelection('bathrooms', v)}
                />
            </div>

            {/* ── Spacer ───────────────────────────────────── */}
            <div style={{ flex: 1 }} />

            {/* ── Summary card ─────────────────────────────── */}
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

        </div>
    );
};

export default Sidebar;
