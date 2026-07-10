// src/components/MapComponent.tsx
// COTA - Cooperativa de Gestão de Táxis JK
// High-fidelity Interactive Simulated Vector Map (OpenStreetMap compatible)

import React, { useState } from 'react';
import { MapPin, Navigation, Car, Compass, Layers } from 'lucide-react';
import { Viatura } from '../types';

interface MapProps {
  viaturas: Viatura[];
  onLocationSelect?: (lat: number, lng: number, address: string) => void;
  interactive?: boolean;
  theme?: 'light' | 'dark';
}

export default function MapComponent({ viaturas, onLocationSelect, interactive = false, theme = 'dark' }: MapProps) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Simulated Luanda landmarks map layout
  const landmarks = [
    { name: 'Aeroporto 4 de Fevereiro', lat: -8.8522, lng: 13.2325, x: 120, y: 380, desc: 'Hub de Passageiros' },
    { name: 'Marginal de Luanda', lat: -8.8055, lng: 13.2435, x: 380, y: 110, desc: 'Zona Costeira / Admin' },
    { name: 'Talatona Shopping', lat: -8.9142, lng: 13.1812, x: 180, y: 520, desc: 'Zona Empresarial' },
    { name: 'Bairro Azul / Maianga', lat: -8.8252, lng: 13.2198, x: 260, y: 220, desc: 'Zona Residencial' },
    { name: 'Cazenga', lat: -8.8110, lng: 13.2920, x: 450, y: 280, desc: 'Parque de Estacionamento COTA' },
  ];

  // Convert GPS coordinates to local viewport X/Y for rendering
  const getXY = (lat: number, lng: number) => {
    // Luanda bounds: Lat (-8.95 to -8.78), Lng (13.15 to 13.32)
    const latMin = -8.95;
    const latMax = -8.78;
    const lngMin = 13.15;
    const lngMax = 13.32;

    const percentX = (lng - lngMin) / (lngMax - lngMin);
    // Invert Y because SVG coordinates start from top-left
    const percentY = 1 - (lat - latMin) / (latMax - latMin);

    return {
      x: Math.max(50, Math.min(550, percentX * 500 + 50)),
      y: Math.max(50, Math.min(550, percentY * 500 + 50)),
    };
  };

  const handleLandmarkClick = (landmark: typeof landmarks[0]) => {
    if (!interactive) return;
    setSelectedZone(landmark.name);
    if (onLocationSelect) {
      onLocationSelect(landmark.lat, landmark.lng, landmark.name);
    }
  };

  return (
    <div className={`relative w-full h-[400px] rounded-2xl border overflow-hidden shadow-md flex flex-col transition-colors duration-200 ${
      theme === 'light'
        ? 'bg-slate-100 border-slate-200/80 text-slate-800'
        : 'bg-slate-900 border-slate-800 text-slate-300'
    }`}>
      {/* Top Map Utility Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs backdrop-blur-md pointer-events-auto shadow-sm transition-colors ${
          theme === 'light'
            ? 'bg-white/95 border-slate-200/80 text-slate-700'
            : 'bg-slate-950/90 border-slate-800 text-slate-300'
        }`}>
          <Compass className="w-4 h-4 text-emerald-500 animate-spin-slow" />
          <span className="font-mono uppercase tracking-wider text-[10px]">OSM LUANDA SIMULATOR</span>
        </div>
 
        <div className="flex gap-2 pointer-events-auto">
          <div className={`p-1.5 rounded-lg border text-xs backdrop-blur-md shadow-sm transition-colors ${
            theme === 'light'
              ? 'bg-white/95 border-slate-200/80 text-slate-500'
              : 'bg-slate-950/90 border-slate-800 text-slate-400'
          }`}>
            <Layers className="w-4 h-4" />
          </div>
        </div>
      </div>
 
      {/* SVG Navigation Layer */}
      <div className={`flex-1 relative select-none transition-colors duration-200 ${
        theme === 'light' ? 'bg-slate-50' : 'bg-slate-950'
      }`}>
        <svg className="w-full h-full" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={theme === 'light' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(51, 65, 85, 0.15)'}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
 
          {/* Luanda Coastline vector */}
          <path
            d="M 10 50 Q 80 120 180 180 T 350 250 T 480 320 T 590 390"
            fill="none"
            stroke={theme === 'light' ? 'rgba(186, 230, 253, 0.6)' : 'rgba(30, 41, 59, 0.4)'}
            strokeWidth="32"
            strokeLinecap="round"
          />
          <path
            d="M 10 50 Q 80 120 180 180 T 350 250 T 480 320 T 590 390"
            fill="none"
            stroke={theme === 'light' ? 'rgba(14, 165, 233, 0.08)' : 'rgba(14, 165, 233, 0.05)'}
            strokeWidth="16"
            strokeLinecap="round"
          />
 
          {/* Major simulated highways & roads of Luanda */}
          {/* Avenida 21 de Janeiro */}
          <line x1="120" y1="380" x2="260" y2="220" stroke={theme === 'light' ? 'rgba(148, 163, 184, 0.35)' : 'rgba(71, 85, 105, 0.25)'} strokeWidth="6" strokeLinecap="round" />
          {/* Estrada de Talatona */}
          <line x1="120" y1="380" x2="180" y2="520" stroke={theme === 'light' ? 'rgba(148, 163, 184, 0.35)' : 'rgba(71, 85, 105, 0.25)'} strokeWidth="6" strokeLinecap="round" />
          {/* Estrada de Cacuaco */}
          <line x1="380" y1="110" x2="450" y2="280" stroke={theme === 'light' ? 'rgba(148, 163, 184, 0.35)' : 'rgba(71, 85, 105, 0.25)'} strokeWidth="5" strokeLinecap="round" />
          {/* Avenida Deolinda Rodrigues */}
          <line x1="260" y1="220" x2="450" y2="280" stroke={theme === 'light' ? 'rgba(148, 163, 184, 0.35)' : 'rgba(71, 85, 105, 0.25)'} strokeWidth="7" strokeLinecap="round" />
          {/* Via Expresso Ring */}
          <path d="M 180 520 Q 350 500 450 280" fill="none" stroke={theme === 'light' ? 'rgba(148, 163, 184, 0.22)' : 'rgba(71, 85, 105, 0.15)'} strokeWidth="8" strokeLinecap="round" />
 
          {/* Landmark Hotspots */}
          {landmarks.map((landmark) => (
            <g
              key={landmark.name}
              className={`cursor-pointer transition-all ${interactive ? 'hover:scale-110' : ''}`}
              onClick={() => handleLandmarkClick(landmark)}
            >
              <circle
                cx={landmark.x}
                cy={landmark.y}
                r="16"
                fill={selectedZone === landmark.name ? 'rgba(16, 185, 129, 0.15)' : theme === 'light' ? 'rgba(241, 245, 249, 0.95)' : 'rgba(30, 41, 59, 0.4)'}
                stroke={selectedZone === landmark.name ? '#10b981' : theme === 'light' ? '#cbd5e1' : '#334155'}
                strokeWidth="1.5"
              />
              <circle
                cx={landmark.x}
                cy={landmark.y}
                r="4"
                fill={selectedZone === landmark.name ? '#10b981' : theme === 'light' ? '#94a3b8' : '#64748b'}
              />
              <text
                x={landmark.x}
                y={landmark.y - 20}
                textAnchor="middle"
                className={`text-[10px] font-medium font-sans pointer-events-none drop-shadow-sm ${
                  theme === 'light' ? 'fill-slate-600 font-semibold' : 'fill-slate-300'
                }`}
              >
                {landmark.name.split(' ')[0]}
              </text>
            </g>
          ))}
 
          {/* Live GPS Vehicles Overlay */}
          {viaturas.map((via) => {
            const pos = getXY(via.latitudeSim || -8.8368, via.longitudeSim || 13.2332);
            const isMoving = (via.velocidadeSim || 0) > 0;
            
            return (
              <g
                key={via.id}
                className="transition-all duration-1000 ease-in-out"
                transform={`translate(${pos.x}, ${pos.y})`}
              >
                {/* Ripple indicator */}
                <circle
                  cx="0"
                  cy="0"
                  r={isMoving ? "14" : "8"}
                  className={`fill-none ${
                    via.estado === 'ATIVO'
                      ? 'stroke-emerald-500 animate-ping'
                      : via.estado === 'MANUTENCAO'
                      ? 'stroke-amber-500'
                      : 'stroke-slate-500'
                  }`}
                  strokeWidth="1.5"
                  opacity={isMoving ? 0.4 : 0.2}
                />
                
                {/* Vehicle Pin */}
                <g className="cursor-pointer">
                  <circle
                    cx="0"
                    cy="0"
                    r="9"
                    fill={
                      via.estado === 'ATIVO'
                        ? '#10b981'
                        : via.estado === 'MANUTENCAO'
                        ? '#f59e0b'
                        : '#475569'
                    }
                    className="shadow-sm"
                  />
                  <Car className="w-3.5 h-3.5 text-slate-950 absolute -left-[7px] -top-[7px]" />
                </g>
 
                {/* Micro tooltip label */}
                <text
                  x="0"
                  y="16"
                  textAnchor="middle"
                  className={`text-[8px] font-mono font-bold ${
                    theme === 'light' ? 'fill-slate-600 font-extrabold' : 'fill-slate-400'
                  }`}
                >
                  {via.matricula.substring(3)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
 
      {/* Map Legend Footer */}
      <div className={`px-4 py-2.5 border-t flex flex-wrap items-center justify-between gap-2 text-xs transition-colors ${
        theme === 'light'
          ? 'bg-slate-50 border-slate-200/80 text-slate-600'
          : 'bg-slate-950 border-slate-800 text-slate-400'
      }`}>
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ativo (Livre/Em Serviço)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Manutenção</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-500" />
            <span>Parqueado</span>
          </div>
        </div>
 
        {interactive && (
          <span className="text-[10px] text-emerald-600 font-mono italic animate-pulse font-medium">
            * Clique num local para selecionar Origem/Destino
          </span>
        )}
      </div>
    </div>
  );
}
