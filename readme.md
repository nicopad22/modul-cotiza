# modul-cotiza

Plataforma interactiva para diseñar y cotizar casas modulares Modul. El usuario configura su casa módulo por módulo en un editor 2D/3D, ajusta terminaciones y calidades, y obtiene una estimación de precio en tiempo real.

## Arquitectura

```
modul-cotiza/
├── src/              ← Frontend Vite + React + R3F
├── api/              ← Backend FastAPI (serverless en Vercel)
│   ├── index.py      ← Endpoints: /api/estimate, /api/quote, /api/uf
│   ├── modul_cad/    ← Motor de estimación de precios
│   └── config/       ← pricing.json (valores configurables)
├── vercel.json       ← Routing: estáticos + funciones Python
└── requirements.txt  ← Dependencias Python
```

## Features

- [x] Visualización 3D de la casa modular (React Three Fiber)
- [x] Editor 2D de planta (grid con validación de conectividad)
- [x] Estimación de precio en tiempo real vía API
- [x] Selector de panel de muro (SIP MgO 122mm / 152mm)
- [x] Selector de calidad de cocina y baño (basic / standard / premium)
- [x] Contador de dormitorios y baños
- [x] Precios vivos de perfiles de acero desde Sodimac
- [x] Valor UF del día desde SII
- [ ] Descarga de cotización PDF desde el navegador
- [ ] Modelos 3D reales de casas Modul
- [ ] Tutorial interactivo paso a paso

## Desarrollo local

### Frontend
```bash
npm install
npm run dev          # → localhost:5173
```

### Backend (en terminal separada)
```bash
pip install -r requirements.txt
uvicorn api.index:app --reload --port 8000
```

El proxy de Vite redirige `/api/*` → `localhost:8000` automáticamente.

### Alternativa: Vercel CLI
```bash
npx vercel dev       # Frontend + backend integrados
```

## Deploy

Push a GitHub → Vercel detecta automáticamente Vite + Python serverless.

## Configuración de precios

Los valores de negocio están en `api/config/pricing.json`. Cambios en este archivo se reflejan en el siguiente deploy sin tocar código.

## TODO

### INTERNO
- [x] Iniciar servidor + cliente básico, integrar dependencias (R3F, React)
- [x] Crear visualización básica de una casa modular con R3F
- [x] Integrar motor de precios como API
- [x] Controles de configuración en sidebar
- [ ] Descarga de cotización PDF

### EXTERNO
- [x] Modelo de precios integrado
- [ ] Conseguir modelos 3D casas Modul