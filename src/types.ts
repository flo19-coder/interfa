/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Usuario {
  dni: string;
  nombreCompleto: string;
  area: string;
  cargo: string;
  rol: 'admin' | 'staff';
  clave: string;
}

export interface Charla {
  id: string;
  titulo: string;
  expositor: string;
  area: string;
  fecha: string;
  horaInicio: string; // Default: '08:30'
  horaFin: string;    // Default: '08:35'
  duracion: string;   // Default: '5 minutos'
  objetivo: string;
  puntosPrincipales: string[];
  riesgoPrincipal: string;
  activo: boolean;
}

export interface RegistroFirma {
  id: string;
  charlaId: string;
  userDni: string;
  nombreCompleto: string;
  area: string;
  cargo: string;
  horaFirma: string; // e.g. "08:32:15 a.m."
  firmaDataUrl: string; // Base64 signature image
  estado: 'Asistió' | 'Ausente';
}
