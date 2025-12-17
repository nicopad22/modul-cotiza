import React, { useState } from 'react';

const Sidebar = () => {
    const [sliderValue, setSliderValue] = useState(50);
    const [termination, setTermination] = useState('Standard');
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="w-[20%] min-w-[300px] h-full bg-neutral-100 p-5 box-border flex flex-col border-l border-neutral-200 overflow-y-auto">
            <div className="mb-8 text-center">
                <div className="flex items-center justify-center mb-2.5">
                    <img src="/Logo-png-1-112x106.png" alt="Modul Logo" className="w-20 h-20 object-contain" />
                </div>
                <h1 className="m-0 text-2xl text-neutral-800">Mi Modul</h1>
            </div>

            <div className="bg-white p-4 rounded-lg mb-5 shadow-sm">
                <h3 className="mt-0 mb-2.5 text-base">Dimensions</h3>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(e.target.value)}
                    className="w-full"
                />
                <p className="mt-1.5 text-sm text-neutral-500">Value: {sliderValue}</p>
            </div>

            <div className="bg-white p-4 rounded-lg mb-5 shadow-sm">
                <h3 className="mt-0 mb-2.5 text-base">Terminaciones</h3>
                <div className="flex flex-col gap-2">
                    {['Standard', 'Premium', 'Luxury'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setTermination(opt)}
                            className={`p-2 border rounded text-left cursor-pointer transition-colors ${termination === opt
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-neutral-200 bg-white hover:bg-neutral-50'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg mb-5 shadow-sm">
                <h3 className="mt-0 mb-2.5 text-base">Módulos</h3>
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setQuantity(Math.max(0, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center p-0 cursor-pointer bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded"
                    >
                        -
                    </button>
                    <span className="text-xl font-bold">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center p-0 cursor-pointer bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded"
                    >
                        +
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
