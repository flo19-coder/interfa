/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ClinicaLogoProps {
  className?: string;
  variant?: 'white' | 'dark' | 'color';
}

export default function ClinicaLogo({ className = "h-14", variant = 'color' }: ClinicaLogoProps) {
  // Color palette selection based on variant
  const isWhite = variant === 'white';
  const textColorPrincipal = isWhite ? 'text-white' : 'text-[#0c1e35]';
  const textColorSecundario = isWhite ? 'text-sky-200' : 'text-sky-700';
  const textMuted = isWhite ? 'text-slate-300' : 'text-slate-500';
  const logoColor = isWhite ? '#ffffff' : '#0284c7'; // Sky-600

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* HIGH-FIDELITY VECTOR OF CLINICA ADVENTISTA GOOD HOPE EMBLEM */}
      <svg 
        className="h-10 w-10 shrink-0" 
        viewBox="0 0 160 160" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer protective open circle representing the global outreach */}
        <path 
          d="M10,80 C10,35 45,10 80,10 C100,10 115,15 125,22 M150,80 C150,125 115,150 80,150 C40,150 18,122 12,100" 
          stroke={logoColor} 
          strokeWidth="6" 
          strokeLinecap="round"
        />
        
        {/* Stylized Cross / Dynamic hands motif */}
        {/* Left hand curve */}
        <path 
          d="M15,80 C40,75 55,50 65,30 C58,45 42,65 15,80 Z" 
          fill={logoColor}
        />
        {/* Right hand curve */}
        <path 
          d="M145,80 C120,75 105,50 95,30 C102,45 118,65 145,80 Z" 
          fill={logoColor}
        />
        {/* Bottom support curve */}
        <path 
          d="M80,145 C75,120 50,105 30,95 C45,102 65,118 80,145 Z" 
          fill={logoColor}
        />
        <path 
          d="M80,145 C85,120 110,105 130,95 C115,102 95,118 80,145 Z" 
          fill={logoColor}
        />

        {/* Center Adventist Flame - Three vertical wavy lines representing Grace, Healing and Salvation */}
        <path 
          d="M72,110 C68,90 85,75 75,55 C82,70 74,85 78,110" 
          fill={logoColor} 
          stroke={logoColor} 
          strokeWidth="3.5" 
          strokeLinecap="round"
        />
        <path 
          d="M80,115 C75,92 95,70 80,45 C92,65 82,85 86,115" 
          fill={logoColor} 
          stroke={logoColor} 
          strokeWidth="4.5" 
          strokeLinecap="round"
        />
        <path 
          d="M88,110 C84,92 102,78 88,58 C96,73 88,88 92,110" 
          fill={logoColor} 
          stroke={logoColor} 
          strokeWidth="3.5" 
          strokeLinecap="round"
        />
      </svg>

      {/* Brand typographic identity */}
      <div className="flex flex-col text-left select-none">
        <span className={`block font-bold text-[10px] tracking-[0.25em] ${textColorPrincipal} leading-none uppercase`}>
          CLÍNICA
        </span>
        <span className={`block font-black text-sm md:text-base tracking-tight ${textColorSecundario} leading-tight uppercase`}>
          ADVENTISTA
        </span>
        <span className={`block font-black text-base md:text-lg tracking-wide ${textColorPrincipal} leading-none uppercase -mt-0.5`}>
          GOOD HOPE
        </span>
        <span className={`block text-[8px] md:text-[9px] font-semibold italic ${textMuted} tracking-wide mt-1 whitespace-nowrap`}>
          Existimos para Servir, Sanar y Salvar
        </span>
      </div>
    </div>
  );
}
