import React from 'react';

import { T } from '../theme';
import { SectionLabel } from './ui/SectionLabel';
import { Card } from './ui/Card';
import { ToggleBtn } from './ui/ToggleBtn';
import { SegmentedSelector } from './ui/SegmentedSelector';
import { Stepper } from './ui/Stepper';
import { Slider } from './ui/Slider';
import AppHeader from './AppHeader';

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({
    quantity,
    viewMode, setViewMode,
    environment, setEnvironment,
    selections, setSelections,
    estimate, estimateLoading,
    hideHeader = false,
    isMobile = false,
    grid = [],
    gridToStrings = (g) => g,
    quoteLoading = false,
    onDownloadPdf = null,
}) => {
    const placedCount = quantity;
    const maxBedrooms = Math.max(1, placedCount - 1);
    const maxBathrooms = Math.max(1, Math.floor(placedCount / 2));

    const updateSelection = (key, value) => {
        setSelections(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div style={{
            ...(isMobile ? {
                width: '100%',
                height: '100%',
            } : {
                width: '30%',
                minWidth: '340px',
                height: '100%',
                borderRight: `1px solid ${T.outlineVariant}`,
                overflowY: 'auto',
            }),
            background: T.bg,
            display: 'flex',
            flexDirection: 'column',
            padding: isMobile ? '16px 16px 32px' : '24px 20px',
            boxSizing: 'border-box',
            fontFamily: T.fontBody,
            fontSize: isMobile ? '0.95rem' : '1rem',
            color: T.onSurface,
            // Custom scrollbar
            scrollbarWidth: 'thin',
            scrollbarColor: `${T.outlineVariant} transparent`,
        }}>

            {/* ── Logo + title + PDF button ─────────────────── */}
            {!hideHeader && (
                <AppHeader
                    quoteLoading={quoteLoading}
                    quantity={quantity}
                    onDownloadPdf={onDownloadPdf}
                />
            )}



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

            {/* ── Module Height ─────────────────────────────── */}
            <div style={{ marginBottom: '12px' }}>
                <SectionLabel>Altura de Módulo</SectionLabel>
                <Slider
                    label="Altura"
                    value={selections.moduleHeight}
                    min={2.0}
                    max={4.0}
                    step={0.1}
                    unit="m"
                    onChange={(v) => updateSelection('moduleHeight', v)}
                />
            </div>

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

        </div>
    );
};

export default Sidebar;
