import React, { useState } from 'react';

const Sidebar = ({ quantity, viewMode, setViewMode, environment, setEnvironment }) => {
    const [sliderValue, setSliderValue] = useState(50);
    const [termination, setTermination] = useState('Standard');

    const placedCount = quantity;

    return (
        <div className="w-[20%] min-w-[300px] h-full bg-neutral-100 p-5 box-border flex flex-col border-l border-neutral-200 overflow-y-auto">

            {/* Logo */}
            <div className="mb-6 text-center">
                <div className="flex items-center justify-center mb-2.5">
                    <img src="/logo-modul-hd-negro.png" alt="Modul Logo" className="w-20 h-20 object-contain" />
                </div>
                <h1 className="m-0 text-2xl text-neutral-800">Mi Modul</h1>
            </div>

            {/* View mode toggle */}
            <div className="bg-neutral-200 rounded-xl p-1 flex gap-1 mb-5">
                <button
                    onClick={() => setViewMode('3d')}
                    style={{
                        flex: 1,
                        padding: '8px 0',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        background: viewMode === '3d'
                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                            : 'transparent',
                        color: viewMode === '3d' ? '#fff' : '#64748b',
                        boxShadow: viewMode === '3d'
                            ? '0 2px 8px rgba(99,102,241,0.4)'
                            : 'none',
                    }}
                >
                    🧊 Vista 3D
                </button>
                <button
                    onClick={() => setViewMode('2d')}
                    style={{
                        flex: 1,
                        padding: '8px 0',
                        borderRadius: '10px',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                        background: viewMode === '2d'
                            ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                            : 'transparent',
                        color: viewMode === '2d' ? '#fff' : '#64748b',
                        boxShadow: viewMode === '2d'
                            ? '0 2px 8px rgba(99,102,241,0.4)'
                            : 'none',
                    }}
                >
                    🗺 Planta 2D
                </button>
            </div>

            {/* Environment toggle */}
            {viewMode === '3d' && (
                <div className="bg-neutral-200 rounded-xl p-1 flex gap-1 mb-5">
                    <button
                        onClick={() => setEnvironment('norte')}
                        style={{
                            flex: 1,
                            padding: '8px 0',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            transition: 'all 0.2s ease',
                            background: environment === 'norte'
                                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                : 'transparent',
                            color: environment === 'norte' ? '#fff' : '#64748b',
                            boxShadow: environment === 'norte'
                                ? '0 2px 8px rgba(99,102,241,0.4)'
                                : 'none',
                        }}
                    >
                        🏜 Norte
                    </button>
                    <button
                        onClick={() => setEnvironment('sur')}
                        style={{
                            flex: 1,
                            padding: '8px 0',
                            borderRadius: '10px',
                            border: 'none',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            fontSize: '0.82rem',
                            fontWeight: 600,
                            transition: 'all 0.2s ease',
                            background: environment === 'sur'
                                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                                : 'transparent',
                            color: environment === 'sur' ? '#fff' : '#64748b',
                            boxShadow: environment === 'sur'
                                ? '0 2px 8px rgba(99,102,241,0.4)'
                                : 'none',
                        }}
                    >
                        🌲 Sur
                    </button>
                </div>
            )}

            {/* Module count (read-only) */}
            <div className="bg-white p-4 rounded-lg mb-5 shadow-sm">
                <h3 className="mt-0 mb-2.5 text-base text-neutral-800 font-semibold">Módulos</h3>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: placedCount > 1
                            ? 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.06))'
                            : 'rgba(0,0,0,0.03)',
                        border: placedCount > 1
                            ? '1px solid rgba(99,102,241,0.2)'
                            : '1px solid rgba(0,0,0,0.06)',
                    }}
                >
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="8" width="18" height="12" rx="2" fill="rgba(255,255,255,0.9)" />
                            <rect x="7" y="4" width="10" height="6" rx="1.5" fill="rgba(255,255,255,0.6)" />
                        </svg>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '1.15rem', color: '#1e293b', lineHeight: 1 }}>
                            {placedCount}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                            {placedCount === 1 ? 'módulo' : 'módulos'}
                            {viewMode === '3d' && placedCount <= 1
                                ? ' — configura en Planta 2D'
                                : ''}
                        </div>
                    </div>
                </div>
                {viewMode === '3d' && (
                    <p style={{ margin: '8px 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>
                        Cambia a <strong>Planta 2D</strong> para colocar módulos en el plano.
                    </p>
                )}
            </div>

            {/* Terminaciones */}
            <div className="bg-white p-4 rounded-lg mb-5 shadow-sm">
                <h3 className="mt-0 mb-2.5 text-base text-neutral-800 font-semibold">Terminaciones</h3>
                <div className="flex flex-col gap-2">
                    {['Standard', 'Premium', 'Luxury'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setTermination(opt)}
                            className={`p-2 border rounded text-left cursor-pointer transition-colors text-neutral-900 ${termination === opt
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-neutral-200 bg-white hover:bg-neutral-50'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
