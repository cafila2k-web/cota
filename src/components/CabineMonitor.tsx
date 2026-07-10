// src/components/CabineMonitor.tsx
// COTA - Cooperativa de Gestão de Táxis JK
// High-fidelity CCTV Cabin Security Camera & Audio Monitor (Módulo 11)

import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Mic, MicOff, Volume2, VolumeX, Tv, Radio, Activity, Wifi, 
  Disc, Gauge, MessageSquare, Power, Maximize2, ShieldAlert, Sliders, RefreshCw
} from 'lucide-react';
import { Viatura } from '../types';

interface CabineMonitorProps {
  viaturas: Viatura[];
  theme?: 'light' | 'dark';
}

export default function CabineMonitor({ viaturas, theme = 'dark' }: CabineMonitorProps) {
  // Only monitor vehicles that are currently ATIVO or EM_SERVICO
  const activeViaturas = viaturas.filter(v => v.estado === 'ATIVO');
  
  const [selectedViaturaId, setSelectedViaturaId] = useState<string>(
    activeViaturas.length > 0 ? activeViaturas[0].id : (viaturas.length > 0 ? viaturas[0].id : '')
  );

  const selectedViatura = viaturas.find(v => v.id === selectedViaturaId);

  const [cameraMode, setCameraMode] = useState<'cabine' | 'estrada'>('cabine');
  const [isCctvOn, setIsCctvOn] = useState<boolean>(true);
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [isPttActive, setIsPttActive] = useState<boolean>(false);
  const [pttMessage, setPttMessage] = useState<string>('');
  const [showControlPanel, setShowControlPanel] = useState<boolean>(true);
  const [interference, setInterference] = useState<number>(1); // 1 = clear, 5 = heavy
  const [osdFlicker, setOsdFlicker] = useState<boolean>(false);

  // References for Canvas and Web Audio
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const oscHarmonicRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const turnSignalTimerRef = useRef<any>(null);

  // Synchronize initial selection when viaturas load
  useEffect(() => {
    if (!selectedViaturaId && activeViaturas.length > 0) {
      setSelectedViaturaId(activeViaturas[0].id);
    } else if (!selectedViaturaId && viaturas.length > 0) {
      setSelectedViaturaId(viaturas[0].id);
    }
  }, [viaturas]);

  // Handle randomly flickering OSD elements for retro CCTV realism
  useEffect(() => {
    const timer = setInterval(() => {
      setOsdFlicker(prev => !prev);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Web Audio API Synthesis: Low-frequency engine hum modulated by vehicle speed
  const startAudioEngine = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // 1. Primary Engine hum oscillator (sawtooth/triangle)
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      
      // Calculate frequency based on vehicle speed
      const speed = selectedViatura?.velocidadeSim || 0;
      const baseFreq = 45 + speed * 0.7; // Engine RPM hum
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      // 2. Secondary sub-bass harmonic for cabin vibration
      const oscHarmonic = ctx.createOscillator();
      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(baseFreq * 0.5, ctx.currentTime);

      // 3. High frequency noise filter for simulated road friction
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150 + speed * 2, ctx.currentTime); // Closed cabin filter

      // 4. Gain controller
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(volume * 0.12, ctx.currentTime);

      // Connections
      osc.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      oscHarmonic.start();

      oscRef.current = osc;
      oscHarmonicRef.current = oscHarmonic;
      gainNodeRef.current = gainNode;
      filterNodeRef.current = filter;
      setIsAudioActive(true);
    } catch (e) {
      console.error("Erro ao inicializar síntese de áudio:", e);
    }
  };

  const stopAudioEngine = () => {
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch(e){}
      oscRef.current = null;
    }
    if (oscHarmonicRef.current) {
      try { oscHarmonicRef.current.stop(); } catch(e){}
      oscHarmonicRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    setIsAudioActive(false);
  };

  // Toggle listen mode
  const toggleListening = () => {
    if (isAudioActive) {
      stopAudioEngine();
    } else {
      startAudioEngine();
    }
  };

  // Adjust volume dynamically
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume * 0.12, audioContextRef.current.currentTime);
    }
  }, [volume]);

  // Adjust frequency response dynamically based on vehicle speed
  useEffect(() => {
    if (audioContextRef.current && oscRef.current && oscHarmonicRef.current && filterNodeRef.current) {
      const speed = selectedViatura?.velocidadeSim || 0;
      const baseFreq = 45 + speed * 0.7;
      const time = audioContextRef.current.currentTime;
      
      oscRef.current.frequency.setValueAtTime(baseFreq, time);
      oscHarmonicRef.current.frequency.setValueAtTime(baseFreq * 0.5, time);
      filterNodeRef.current.frequency.setValueAtTime(150 + speed * 3, time);
    }
  }, [selectedViatura?.velocidadeSim, selectedViaturaId]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopAudioEngine();
    };
  }, []);

  // High-fidelity Render loop drawing into 2D canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    
    // Road speed variable for perspective scrolling
    let roadYOffset = 0;

    const render = () => {
      time += 0.05;
      const width = canvas.width;
      const height = canvas.height;
      
      const speed = selectedViatura?.velocidadeSim || 0;
      const isMoving = speed > 0;
      
      // Update road scroll
      roadYOffset = (roadYOffset + speed * 0.15) % 100;

      // 1. CLEAR FRAME & DRAW BACKGROUND
      if (!isCctvOn) {
        ctx.fillStyle = '#020617'; // Total black
        ctx.fillRect(0, 0, width, height);
        
        // Offline indicators
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 12px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SISTEMA CCTV DESLIGADO', width / 2, height / 2 - 10);
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText('SELECIONE "LIGAR CÂMARA" PARA INICIAR', width / 2, height / 2 + 10);
        
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // CCTV Camera On: Base Canvas color (Infrared Tint or Dark Blue Night view)
      ctx.fillStyle = '#050b14'; 
      ctx.fillRect(0, 0, width, height);

      // Draw subtle green grid background (simulating digital coordinate tracking)
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ----------------------------------------------------
      // DRAW CAMERA MODES
      // ----------------------------------------------------
      if (cameraMode === 'cabine') {
        // CABIN VIEW SIMULATION
        // Ambient glow inside cabin
        ctx.fillStyle = 'rgba(5, 46, 22, 0.2)'; // Green night-vision glow
        ctx.fillRect(0, 0, width, height);

        // A. Draw Car windshield boundary
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(40, 60);
        ctx.lineTo(width - 40, 60);
        ctx.lineTo(width - 20, height - 120);
        ctx.lineTo(20, height - 120);
        ctx.closePath();
        ctx.stroke();

        // Front window view (Luanda streetscape representation scrolling inside window)
        ctx.fillStyle = '#030712';
        ctx.beginPath();
        ctx.moveTo(42, 62);
        ctx.lineTo(width - 42, 62);
        ctx.lineTo(width - 22, height - 122);
        ctx.lineTo(22, height - 122);
        ctx.closePath();
        ctx.fill();

        // Draw passing streetlights inside the windshield window
        if (isMoving) {
          const numLights = 3;
          for (let i = 0; i < numLights; i++) {
            const lightTime = (time * 0.5 + i * (10 / numLights)) % 10;
            const xLight = width / 2 + (lightTime - 5) * (width * 0.08);
            const yLight = 65 + lightTime * 12;
            const size = lightTime * 1.5;

            ctx.fillStyle = 'rgba(234, 179, 8, 0.45)'; // Amber/Yellow light
            ctx.beginPath();
            ctx.arc(xLight, yLight, size, 0, Math.PI * 2);
            ctx.fill();
            
            // Light flare lines
            ctx.strokeStyle = 'rgba(234, 179, 8, 0.15)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(xLight - size * 4, yLight);
            ctx.lineTo(xLight + size * 4, yLight);
            ctx.stroke();
          }
        }

        // B. Draw dashboard structure
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(0, height - 110);
        ctx.lineTo(width, height - 110);
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // C. Draw glowing digital dashboard gauges
        // 1. Speedometer
        const speedArcPercent = speed / 160;
        ctx.strokeStyle = 'rgba(30, 41, 59, 1)';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(130, height - 55, 30, Math.PI * 0.8, Math.PI * 2.2);
        ctx.stroke();

        ctx.strokeStyle = '#10b981'; // Green neon speedometer
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(130, height - 55, 30, Math.PI * 0.8, Math.PI * (0.8 + 1.4 * speedArcPercent));
        ctx.stroke();

        // Gauge core
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.arc(130, height - 55, 24, 0, Math.PI * 2);
        ctx.fill();

        // Speed text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(speed)}`, 130, height - 57);
        ctx.fillStyle = '#10b981';
        ctx.font = '6px sans-serif';
        ctx.fillText('KM/H', 130, height - 48);

        // 2. RPM Gauge
        const rpmPercent = isMoving ? 0.2 + (speed % 40) / 45 : 0.08 + Math.sin(time * 3) * 0.02;
        ctx.strokeStyle = 'rgba(30, 41, 59, 1)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(190, height - 55, 20, Math.PI * 0.8, Math.PI * 2.2);
        ctx.stroke();

        ctx.strokeStyle = '#3b82f6'; // Blue RPM
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(190, height - 55, 20, Math.PI * 0.8, Math.PI * (0.8 + 1.4 * rpmPercent));
        ctx.stroke();

        // D. Draw interactive steering wheel (rotates based on time sine wave)
        const wheelAngle = isMoving ? Math.sin(time * 0.4) * 0.35 : Math.sin(time * 0.05) * 0.03;
        ctx.save();
        ctx.translate(130, height - 55);
        ctx.rotate(wheelAngle);

        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(0, 0, 42, 0, Math.PI * 2);
        ctx.stroke();

        // Center hub
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();

        // Logo center
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        // Wheel spokes
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-42, 0); ctx.lineTo(42, 0);
        ctx.moveTo(0, 0); ctx.lineTo(0, 42);
        ctx.stroke();

        ctx.restore();

        // E. Draw Simulated Driver Silhouette (Night vision look)
        ctx.save();
        // Driver sits on the left seat (Angola drives on the right side, so driver seat is on the left)
        ctx.translate(130, height - 55);
        
        const driverX = -20;
        const driverY = -15;

        // Draw driver torso/shoulders
        ctx.fillStyle = 'rgba(16, 185, 129, 0.15)'; // Infra silhouette
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(driverX - 40, driverY + 30);
        ctx.quadraticCurveTo(driverX - 35, driverY - 10, driverX - 15, driverY - 15);
        ctx.lineTo(driverX + 15, driverY - 15);
        ctx.quadraticCurveTo(driverX + 35, driverY - 10, driverX + 40, driverY + 30);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Driver Head (moves slightly)
        const headWobbleX = Math.sin(time * 0.3) * 1.5;
        const headWobbleY = Math.cos(time * 0.2) * 1.0;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.beginPath();
        ctx.arc(driverX + headWobbleX, driverY - 35 + headWobbleY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Driver Cap/Hat visor
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(driverX - 15 + headWobbleX, driverY - 42 + headWobbleY);
        ctx.lineTo(driverX + 15 + headWobbleX, driverY - 40 + headWobbleY);
        ctx.stroke();

        ctx.restore();

        // F. Passenger seat silhouette (vacant or occupied randomly)
        const seatX = width - 130;
        const seatY = height - 70;
        
        ctx.fillStyle = 'rgba(30, 41, 59, 0.4)';
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.3)';
        ctx.lineWidth = 2;
        // Draw headrest
        ctx.beginPath();
        ctx.arc(seatX, seatY - 40, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Draw seat back
        ctx.beginPath();
        ctx.moveTo(seatX - 25, seatY + 45);
        ctx.quadraticCurveTo(seatX - 20, seatY - 20, seatX - 15, seatY - 25);
        ctx.lineTo(seatX + 15, seatY - 25);
        ctx.quadraticCurveTo(seatX + 20, seatY - 20, seatX + 25, seatY + 45);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // G. Dashboard rearview mirror hanging element
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(width / 2, 60);
        ctx.lineTo(width / 2, 85);
        ctx.stroke();

        ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(width / 2 - 20, 85, 40, 12);
        ctx.fill();
        ctx.stroke();

      } else {
        // ROAD FRONT-FACING CAMERA VIEW
        // A. Draw perspective road
        ctx.fillStyle = '#090d16'; // Dark asphalt
        ctx.beginPath();
        ctx.moveTo(width / 2 - 10, height / 2 - 20);
        ctx.lineTo(width / 2 + 10, height / 2 - 20);
        ctx.lineTo(width - 20, height - 60);
        ctx.lineTo(20, height - 60);
        ctx.closePath();
        ctx.fill();

        // Draw side guardrails
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.6)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(width / 2 - 10, height / 2 - 20);
        ctx.lineTo(20, height - 60);
        ctx.moveTo(width / 2 + 10, height / 2 - 20);
        ctx.lineTo(width - 20, height - 60);
        ctx.stroke();

        // Draw moving road dashed lanes
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, height / 2 - 20, width, height / 2 + 20);
        ctx.clip();

        // Calculated relative lines based on speed scrolling offset
        for (let i = 0; i < 6; i++) {
          const progress = ((roadYOffset / 100) + i) / 5;
          const yLine = (height / 2 - 20) + progress * (height / 2 - 20);
          const scale = progress * 1.5;
          const length = progress * 35;
          
          ctx.beginPath();
          ctx.moveTo(width / 2, yLine);
          ctx.lineTo(width / 2, yLine + length);
          ctx.lineWidth = scale * 1.5;
          ctx.stroke();
        }
        ctx.restore();

        // B. Sky & horizon details
        ctx.fillStyle = '#02050b'; // Sky
        ctx.fillRect(0, 0, width, height / 2 - 20);

        // Draw horizon silhouettes (Luanda cityscape outlines)
        ctx.fillStyle = '#05070c';
        ctx.beginPath();
        ctx.moveTo(0, height / 2 - 20);
        ctx.lineTo(50, height / 2 - 20);
        ctx.lineTo(60, height / 2 - 45);
        ctx.lineTo(90, height / 2 - 45);
        ctx.lineTo(100, height / 2 - 20);
        // Tall building
        ctx.lineTo(150, height / 2 - 20);
        ctx.lineTo(155, height / 2 - 80);
        ctx.lineTo(175, height / 2 - 80);
        ctx.lineTo(180, height / 2 - 20);
        // Sprawling hills
        ctx.lineTo(300, height / 2 - 20);
        ctx.quadraticCurveTo(380, height / 2 - 40, 460, height / 2 - 20);
        ctx.lineTo(width, height / 2 - 20);
        ctx.lineTo(width, height / 2);
        ctx.lineTo(0, height / 2);
        ctx.closePath();
        ctx.fill();

        // Draw distant city windows/lights (sparkling dots)
        for (let i = 0; i < 15; i++) {
          const dotX = (Math.sin(i * 123.45) * 0.5 + 0.5) * width;
          const dotY = height / 2 - 30 - (Math.abs(Math.sin(i * 987.65)) * 15);
          const isGlowing = Math.sin(time * 2 + i) > 0.1;
          if (isGlowing && dotY > height / 2 - 80) {
            ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#ef4444';
            ctx.fillRect(dotX, dotY, 1.5, 1.5);
          }
        }

        // C. Windshield reflection / Dashboard HUD
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(0, height - 60, width, 60);
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height - 60);
        ctx.lineTo(width, height - 60);
        ctx.stroke();

        // Compass heading overlay inside camera road view
        const headingNames = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const currentHeadingIndex = Math.floor((time * 0.1) % headingNames.length);
        ctx.fillStyle = '#64748b';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('DIRECÇÃO DE CURSO', width / 2, height - 42);
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 13px "JetBrains Mono", monospace';
        ctx.fillText(headingNames[currentHeadingIndex], width / 2, height - 25);
      }

      // ----------------------------------------------------
      // OVERLAY CRT / RETRO VIDEO INTERFERENCE
      // ----------------------------------------------------
      // Scanlines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 2);
      }

      // Random high-frequency white noise grains (Simulated camera static)
      const grainDensity = Math.max(500, (interference - 1) * 3000);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < grainDensity; i++) {
        const nx = Math.random() * width;
        const ny = Math.random() * height;
        ctx.fillRect(nx, ny, 1, 1);
      }

      // Occasional visual signal lines rolling down (glitch)
      const glitchY = (time * 80) % (height + 200) - 100;
      if (glitchY > 0 && glitchY < height) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.04)';
        ctx.fillRect(0, glitchY, width, 12);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.fillRect(0, glitchY + 6, width, 2);
      }

      // ----------------------------------------------------
      // DRAW CAMERA OSD (ON SCREEN DISPLAY)
      // ----------------------------------------------------
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';

      // Blinking Record Dot + Camera Name (Top-left)
      const recordBlink = Math.floor(time * 1.5) % 2 === 0;
      if (recordBlink) {
        ctx.fillStyle = '#ef4444'; // Red recording light
        ctx.beginPath();
        ctx.arc(20, 20, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.fillStyle = '#10b981'; // CCTV Green text
      ctx.fillText(`GRAVAÇÃO DIRECTA (V-${selectedViatura?.matricula || 'N/A'})`, 32, 14);

      // Camera type sub-label
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.7)';
      ctx.fillText(cameraMode === 'cabine' ? 'CAM_01: INTERIOR CABINE (IR_NIGHT)' : 'CAM_02: CURSO FRONTAL (ROAD_HD)', 32, 28);

      // Top-Right: Telemetry stats
      ctx.textAlign = 'right';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillText(`SINAL: EXCELENTE (${65 + Math.round(Math.sin(time * 0.1) * 5)}dBm)`, width - 15, 14);
      
      const speedColor = speed > 100 ? '#ef4444' : speed > 80 ? '#f59e0b' : '#10b981';
      ctx.fillStyle = speedColor;
      ctx.fillText(`GPS_SPD: ${Math.round(speed)} KM/H`, width - 15, 28);

      // Bottom-Left OSD (UTC / Local Time + Coordinates)
      ctx.textAlign = 'left';
      ctx.fillStyle = '#10b981';
      ctx.font = '10px "JetBrains Mono", monospace';
      
      // Live dynamic date/time clock formatted beautifully
      const now = new Date();
      const pad = (num: number) => String(num).padStart(2, '0');
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const dateStr = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}`;
      
      ctx.fillText(`DATA: ${dateStr}`, 15, height - 35);
      ctx.fillText(`HORA: ${timeStr} GMT+1`, 15, height - 20);

      // Bottom-Right: Lat/Lng Coordinates
      ctx.textAlign = 'right';
      const latVal = selectedViatura?.latitudeSim || -8.8368;
      const lngVal = selectedViatura?.longitudeSim || 13.2332;
      ctx.fillText(`LAT: ${latVal.toFixed(6)} S`, width - 15, height - 35);
      ctx.fillText(`LNG: ${lngVal.toFixed(6)} E`, width - 15, height - 20);

      // Real-time Audio Spectrum indicator overlay (only when audio listening is active)
      if (isAudioActive) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#3b82f6'; // Wave blue text
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillText('AUDIO_FEED_MONITOR: ACTIVE', 15, 45);

        // Draw active oscillating voice waveform bars in OSD
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const startX = 15;
        const startY = 65;
        for (let i = 0; i < 20; i++) {
          const barHeight = Math.sin(time * 2 + i * 0.6) * 8 * (volume + 0.1) + 12 * Math.sin(time * 0.5) * (0.1 + volume);
          const currentY = Math.max(2, Math.abs(barHeight));
          ctx.moveTo(startX + i * 3, startY);
          ctx.lineTo(startX + i * 3, startY - currentY);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedViaturaId, cameraMode, isCctvOn, isAudioActive, volume, interference]);

  // Handle push-to-talk press
  const handlePttDown = () => {
    setIsPttActive(true);
    // Push visual feedback message to user interface
    setPttMessage("Sinal de Voz Aberto: Transmitindo para Cabine...");
  };

  const handlePttUp = () => {
    setIsPttActive(false);
    setPttMessage('');
  };

  return (
    <div className={`p-5 rounded-2xl border flex flex-col gap-5 ${
      theme === 'light' ? 'bg-white border-slate-200/80' : 'bg-slate-900 border-slate-800'
    }`}>
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Módulo 11: Monitorização de Cabine (Vídeo & Áudio Vivo)</span>
              <span className="bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold animate-pulse">DIRECTO</span>
            </h4>
            <p className="text-[10px] text-slate-400">Escuta oculta de cabine, intercomunicador e transmissão dupla de vídeo para viaturas em serviço.</p>
          </div>
        </div>

        {/* Selected Vehicle Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-mono hidden md:inline">VIATURA ALVO:</span>
          <select
            value={selectedViaturaId}
            onChange={(e) => {
              setSelectedViaturaId(e.target.value);
              // reset sound if changing vehicle to modulate correct frequency
              if (isAudioActive) {
                stopAudioEngine();
                setTimeout(() => startAudioEngine(), 100);
              }
            }}
            className="bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono font-semibold text-emerald-400 px-3 py-1.5 outline-none cursor-pointer focus:border-emerald-500 transition"
          >
            {viaturas.map((v) => (
              <option key={v.id} value={v.id} className="bg-slate-950 text-slate-300">
                {v.matricula} ({v.marca} {v.modelo} - {v.estado})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Left CCTV Camera / Right Telemetry controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* CCTV SCREEN AREA */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-950 shadow-2xl bg-slate-950">
            
            {/* Real HTML5 dynamic canvas screen */}
            <canvas 
              ref={canvasRef} 
              width={640} 
              height={360} 
              className="w-full h-full block object-cover"
            />

            {/* OSD Quick Control buttons (Floating inside stream) */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
              <button 
                onClick={() => setCameraMode(prev => prev === 'cabine' ? 'estrada' : 'cabine')}
                className="bg-slate-950/80 backdrop-blur border border-slate-800 text-[10px] font-bold text-slate-300 hover:text-white hover:bg-slate-900 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition"
                title="Alternar entre Câmara Interna e Frontal"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>CAM: {cameraMode === 'cabine' ? 'INTERNA' : 'FRONTAL'}</span>
              </button>

              <button 
                onClick={() => setIsCctvOn(prev => !prev)}
                className={`border text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
                  isCctvOn 
                    ? 'bg-rose-950/80 border-rose-800/80 text-rose-300 hover:bg-rose-900' 
                    : 'bg-emerald-950/80 border-emerald-800/80 text-emerald-300 hover:bg-emerald-900'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{isCctvOn ? 'DESLIGAR CAM' : 'LIGAR CAM'}</span>
              </button>
            </div>

            {/* Signal disruption overlay */}
            {isCctvOn && (
              <div className="absolute top-4 left-4 pointer-events-none bg-slate-950/60 border border-slate-800/40 text-[9px] font-mono font-bold text-slate-400 rounded px-2 py-0.5 backdrop-blur-sm">
                FPS: 30 / LAT: {8 + Math.round(Math.random() * 4)}ms
              </div>
            )}
          </div>

          {/* Quick PTT indicator text */}
          {isPttActive && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg p-2.5 text-xs font-mono font-semibold flex items-center gap-2 animate-pulse">
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>{pttMessage}</span>
            </div>
          )}
        </div>

        {/* CONTROLS AND AUDIO PANEL */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Target Status Panel */}
          {selectedViatura ? (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col gap-3 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Telemática da Viatura Alvo</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800/50 flex flex-col gap-0.5">
                  <span className="text-[9px] text-slate-500">MATRÍCULA</span>
                  <span className="font-mono font-bold text-slate-200">{selectedViatura.matricula}</span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800/50 flex flex-col gap-0.5">
                  <span className="text-[9px] text-slate-500">VELOCIDADE</span>
                  <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <Gauge className="w-3 h-3" /> {selectedViatura.velocidadeSim || 0} KM/H
                  </span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800/50 flex flex-col gap-0.5">
                  <span className="text-[9px] text-slate-500">ESTADO</span>
                  <span className={`font-bold uppercase text-[10px] ${
                    selectedViatura.estado === 'ATIVO' ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    ● {selectedViatura.estado}
                  </span>
                </div>
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800/50 flex flex-col gap-0.5">
                  <span className="text-[9px] text-slate-500">CONDUTOR</span>
                  <span className="font-semibold text-slate-300 truncate">
                    {selectedViatura.motoristaNome || 'Nenhum'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center text-xs text-slate-500 italic">
              Selecione uma viatura para monitorizar
            </div>
          )}

          {/* Audio Escuta Control Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-400" />
                <span>Canal de Áudio Oculto</span>
              </span>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                isAudioActive ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 animate-pulse' : 'bg-slate-900 text-slate-500'
              }`}>
                {isAudioActive ? 'ESCUTANDO' : 'MUDO'}
              </span>
            </div>

            {/* Audio Toggle Button */}
            <button
              onClick={toggleListening}
              disabled={!isCctvOn}
              className={`w-full py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border transition ${
                !isCctvOn
                  ? 'opacity-50 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-500'
                  : isAudioActive
                  ? 'bg-blue-600 border-blue-500 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/10'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {isAudioActive ? (
                <>
                  <VolumeX className="w-4 h-4 text-white" />
                  <span>DESLIGAR ESCUTA VIVA</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>ATÍVAR ESCUTA DO HABITÁCULO</span>
                </>
              )}
            </button>

            {/* Audio controls (Volume / Interferece) */}
            <div className="space-y-3.5 text-xs text-slate-300 border-t border-slate-900 pt-3">
              {/* Volume Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Volume de Recepção</span>
                  <span className="font-mono font-bold text-slate-300">{Math.round(volume * 100)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    disabled={!isAudioActive}
                    className="flex-1 accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-45"
                  />
                  <Volume2 className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>

              {/* Interference Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Sensibilidade / Ruído Atmosférico</span>
                  <span className="font-mono text-slate-300">{interference}x</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={interference}
                  onChange={(e) => setInterference(parseInt(e.target.value))}
                  disabled={!isCctvOn}
                  className="w-full accent-amber-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-45"
                />
              </div>
            </div>

            {/* Intercomunicador (Push-to-Talk) */}
            <div className="border-t border-slate-900 pt-3 flex flex-col gap-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Intercomunicador Direto PTT</span>
              </span>

              <button
                onMouseDown={handlePttDown}
                onMouseUp={handlePttUp}
                onTouchStart={handlePttDown}
                onTouchEnd={handlePttUp}
                disabled={!isCctvOn || !selectedViatura?.motoristaId}
                className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition select-none ${
                  !isCctvOn || !selectedViatura?.motoristaId
                    ? 'opacity-40 cursor-not-allowed bg-slate-900 border border-slate-800 text-slate-500'
                    : isPttActive
                    ? 'bg-emerald-500 text-slate-950 font-extrabold animate-pulse'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950'
                }`}
                title="Pressione e segure para falar diretamente ao condutor através da viatura"
              >
                <Mic className="w-4 h-4" />
                <span>{isPttActive ? 'TRANSMITINDO VOZ...' : 'MANTENHA PARA TRANSMITIR (PTT)'}</span>
              </button>
              <span className="text-[9px] text-slate-500 italic text-center block">
                * O intercomunicador requer microfone de rádio VHF/GPRS ativo na viatura.
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
