/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Usuario, Charla, RegistroFirma } from './types';

// SVG Path-based realistic signatures for Good Hope operators
export const MOCK_SIGNATURES = {
  yorlyn: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='60' viewBox='0 0 150 60'><path d='M12,35 C30,15 45,55 75,30 C105,5 115,45 135,25 M20,20 L130,45' fill='none' stroke='%230f172a' stroke-width='2' stroke-linecap='round'/></svg>",
  carlos: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='60' viewBox='0 0 150 60'><path d='M15,45 Q40,5 60,35 T100,10 T140,25 M40,25 L120,25' fill='none' stroke='%231e3a8a' stroke-width='2' stroke-linecap='round'/></svg>",
  alba: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='60' viewBox='0 0 150 60'><path d='M20,20 C40,40 50,10 70,30 C90,50 100,5 120,40' fill='none' stroke='%230f172a' stroke-width='2' stroke-linecap='round'/></svg>",
  arias: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='60' viewBox='0 0 150 60'><path d='M10,40 Q30,10 50,35 T90,20 T130,30' fill='none' stroke='%230f172a' stroke-width='2' stroke-linecap='round'/><path d='M30,30 Q60,15 110,45' fill='none' stroke='%230f172a' stroke-width='1.5' stroke-linecap='round'/></svg>",
  arteaga: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='60' viewBox='0 0 150 60'><path d='M15,25 Q45,45 75,15 T135,35 M50,45 L110,15' fill='none' stroke='%2316a34a' stroke-width='2.2' stroke-linecap='round'/></svg>"
};

export const DEFAULT_USUARIOS: Usuario[] = [
  // ADMINISTRATORS
  {
    dni: "60268650",
    nombreCompleto: "HUAMAN FLORES, YORLYN TONY",
    area: "Mantenimiento General",
    cargo: "Supervisor de Mantenimiento",
    rol: "admin",
    clave: "60268650"
  },
  {
    dni: "43688568",
    nombreCompleto: "HERBAY CHECCORI, CARLOS ALBERTO",
    area: "Mantenimiento General",
    cargo: "Supervisor de Mantenimiento",
    rol: "admin",
    clave: "43688568"
  },
  // OPERATORS / WORKERS
  {
    dni: "09831991",
    nombreCompleto: "ALBA SALAS, PAUL ESTEBAN",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "09831991"
  },
  {
    dni: "40609977",
    nombreCompleto: "ARIAS LOPEZ, DANIEL ARTURO",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "40609977"
  },
  {
    dni: "45789989",
    nombreCompleto: "ARTEAGA IPARRAGUIRRE, DANIEL ARMANDO",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "45789989"
  },
  {
    dni: "75198988",
    nombreCompleto: "AYACHI CERVANTES, ANGEL LAISAMON",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "75198988"
  },
  {
    dni: "09021358",
    nombreCompleto: "BALBUENA FERNANDEZ, LUIS",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "09021358"
  },
  {
    dni: "42223162",
    nombreCompleto: "CAHUAZA SAJAMI, LEONEL",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "42223162"
  },
  {
    dni: "73334376",
    nombreCompleto: "CASTILLO SANCHEZ, ALEX",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "73334376"
  },
  {
    dni: "73183490",
    nombreCompleto: "GALLARDO FLORES, LUIS LEODAN",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "73183490"
  },
  {
    dni: "08551989",
    nombreCompleto: "GONZALES SANTA MARIA, ELI EMERSON",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "08551989"
  },
  {
    dni: "72305417",
    nombreCompleto: "HERBAY CHECCORI, NICOLAS",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "72305417"
  },
  {
    dni: "28444863",
    nombreCompleto: "HUAMANI TANTA, GILVER",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "28444863"
  },
  {
    dni: "28444339",
    nombreCompleto: "HUAMANÍ TANTA, RICARDO",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "28444339"
  },
  {
    dni: "75173218",
    nombreCompleto: "HUAMANI VELAZQUE, ALEX ALEJANDRO",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "75173218"
  },
  {
    dni: "17982488",
    nombreCompleto: "LEON SANCHEZ, JORGE LUIS",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "17982488"
  },
  {
    dni: "27144036",
    nombreCompleto: "LEON SANCHEZ, ODAR HUMBERTO",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "27144036"
  },
  {
    dni: "46301106",
    nombreCompleto: "MANRIQUE SOLORZANO, CRISTHIAN JOSE",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "46301106"
  },
  {
    dni: "10387638",
    nombreCompleto: "PANANA MARIN, ANGEL",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "10387638"
  },
  {
    dni: "46993155",
    nombreCompleto: "PAUCAR ALCALA, HAROL DAVIS",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "46993155"
  },
  {
    dni: "80096878",
    nombreCompleto: "PEDROZA BARBOZA, MIGUEL",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "80096878"
  },
  {
    dni: "42858782",
    nombreCompleto: "QUISPE CHOQUE, MIDWARD",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "42858782"
  },
  {
    dni: "41487487",
    nombreCompleto: "QUISPE CHOQUE, WILLY ADRIAN",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "41487487"
  },
  {
    dni: "40603461",
    nombreCompleto: "RAMOS ROMISONCCO, ALFREDO VICTOR",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "40603461"
  },
  {
    dni: "40933608",
    nombreCompleto: "RAMOS TIPULA, HECTOR FERNANDO",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "40933608"
  },
  {
    dni: "62948991",
    nombreCompleto: "RISCO GUTIERREZ, RONALDO GERSON",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "62948991"
  },
  {
    dni: "47564409",
    nombreCompleto: "RISCO QUINTOS, ENGEL ES SOL",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "47564409"
  },
  {
    dni: "05344919",
    nombreCompleto: "SANGAMA CURITIMA, PABLO",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "05344919"
  },
  {
    dni: "48545406",
    nombreCompleto: "VILCHEZ GUIDO, WENSESLAO",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "48545406"
  },
  {
    dni: "43638919",
    nombreCompleto: "ZAMALLOA CHICORE, ALVARO",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    rol: "staff",
    clave: "43638919"
  }
];

export const DEFAULT_CHARLAS: Charla[] = [
  {
    id: "charla-01",
    titulo: "Uso Correcto de Herramientas Eléctricas",
    expositor: "HUAMAN FLORES, YORLYN TONY",
    area: "Mantenimiento Eléctrico",
    fecha: "2026-07-19",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Recordar las medidas preventivas para el uso seguro de herramientas eléctricas.",
    puntosPrincipales: [
      "Inspeccionar herramientas antes de usarlas.",
      "Usar EPP adecuado (guantes dieléctricos, lentes de seguridad, etc.).",
      "No trabajar en equipos energizados sin bloqueo y etiquetado (LOTO).",
      "Mantener el área de trabajo limpia y libre de humedad."
    ],
    riesgoPrincipal: "Descarga eléctrica, cortes, de atrapamientos y quemaduras.",
    activo: true
  },
  {
    id: "charla-02",
    titulo: "Prevención de Caídas en Trabajos en Altura",
    expositor: "HERBAY CHECCORI, CARLOS ALBERTO",
    area: "Mantenimiento Civil y Mecánico",
    fecha: "2026-07-18",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Concientizar sobre el uso correcto del arnés de seguridad y líneas de vida.",
    puntosPrincipales: [
      "Inspección obligatoria del arnés y conector de anclaje antes de cada uso.",
      "Anclaje siempre por encima del nivel de los hombros.",
      "Asegurar el perímetro inferior para evitar caída de herramientas (uso de cordones).",
      "Mantener contacto de tres puntos al subir o bajar escaleras."
    ],
    riesgoPrincipal: "Caídas a distinto nivel, golpes graves y fatalidades.",
    activo: false
  },
  {
    id: "charla-03",
    titulo: "Uso Obligatorio de Equipo de Protección Personal (EPP)",
    expositor: "HUAMAN FLORES, YORLYN TONY",
    area: "Seguridad y Salud en el Trabajo",
    fecha: "2026-07-17",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Garantizar que todo el personal de mantenimiento use adecuadamente su EPP básico y específico.",
    puntosPrincipales: [
      "Casco de seguridad, lentes y botas con punta de acero son de uso permanente.",
      "Uso de protección auditiva en zonas con ruido mayor a 85 dB.",
      "Reemplazar el EPP dañado o desgastado inmediatamente.",
      "Limpieza y almacenamiento correcto del EPP al finalizar la jornada."
    ],
    riesgoPrincipal: "Proyección de partículas, traumatismos, pérdida auditiva y golpes.",
    activo: false
  },
  {
    id: "charla-04",
    titulo: "Peligros del asbesto",
    expositor: "LEON SANCHEZ, ODAR HUMBERTO",
    area: "Mantenimiento General",
    fecha: "2026-07-20",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Identificar y prevenir riesgos asociados con la manipulación involuntaria o exposición al asbesto.",
    puntosPrincipales: [
      "Reconocer materiales sospechosos que contengan asbesto.",
      "Evitar la rotura, lijado o alteración de materiales sospechosos.",
      "Uso obligatorio de respirador con filtro HEPA si hay sospecha.",
      "Notificar inmediatamente al supervisor ante la presencia de asbesto deteriorado."
    ],
    riesgoPrincipal: "Enfermedades respiratorias crónicas, asbestosis y cáncer pulmonar.",
    activo: false
  },
  {
    id: "charla-05",
    titulo: "Cilindros de oxígeno y aire comprimido",
    expositor: "PANANA MARIN, ANGEL",
    area: "Mantenimiento General",
    fecha: "2026-07-21",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Establecer pautas para el almacenamiento, traslado y manipulación segura de cilindros de gases comprimidos.",
    puntosPrincipales: [
      "Mantener cilindros siempre asegurados verticalmente con cadenas.",
      "No permitir contacto con aceites o grasas en válvulas de oxígeno.",
      "Transportar cilindros utilizando carretillas adecuadas, nunca arrastrándolos.",
      "Verificar que la caperuza de protección de la válvula esté colocada cuando no esté en uso."
    ],
    riesgoPrincipal: "Explosiones, fugas a alta presión, proyección de válvulas e incendios.",
    activo: false
  },
  {
    id: "charla-06",
    titulo: "Protección de caídas – Escaleras",
    expositor: "PAUCAR ALCALA, HAROL DAVIS",
    area: "Mantenimiento General",
    fecha: "2026-07-22",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Garantizar el uso correcto y seguro de escaleras portátiles de mano.",
    puntosPrincipales: [
      "Inspeccionar peldaños, largueros y zapatas antideslizantes antes de usar.",
      "Mantener siempre tres puntos de apoyo (dos manos y un pie, o dos pies y una mano).",
      "Colocar la escalera en relación de inclinación 4:1 (un metro de base por cada cuatro de altura).",
      "No subir más allá del antepenúltimo peldaño."
    ],
    riesgoPrincipal: "Caídas a distinto nivel, golpes severos, fracturas.",
    activo: false
  },
  {
    id: "charla-07",
    titulo: "Líquidos inflamables: manejo y almacenamiento",
    expositor: "CAHUAZA SAJAMI, LEONEL",
    area: "Mantenimiento General",
    fecha: "2026-07-23",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Prevenir amagos de incendio mediante el control de líquidos inflamables y combustibles.",
    puntosPrincipales: [
      "Almacenar solo en gabinetes aprobados y rotulados contra incendios.",
      "Utilizar recipientes de seguridad herméticos con arrestallamas para trasvases.",
      "Prohibir estrictamente fumar o realizar trabajos en caliente cerca del almacenamiento.",
      "Mantener kits de derrames y extintores accesibles en la zona."
    ],
    riesgoPrincipal: "Incendios, explosiones, inhalación de vapores tóxicos.",
    activo: false
  },
  {
    id: "charla-08",
    titulo: "Emisiones fugitivas en gas industrial",
    expositor: "QUISPE CHOQUE, MIDWARD",
    area: "Mantenimiento General",
    fecha: "2026-07-24",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Detectar y controlar pérdidas no deseadas de gases en tuberías y conexiones de mantenimiento.",
    puntosPrincipales: [
      "Realizar pruebas periódicas de hermeticidad con agua jabonosa o detectores.",
      "Verificar el estado de empaquetaduras y bridas en líneas de gas.",
      "Reportar cualquier olor o silbido inusual en el sistema de distribución.",
      "Aplicar ventilación adecuada en áreas cerradas con conexiones de gas."
    ],
    riesgoPrincipal: "Fugas, asfixia, atmósferas explosivas e incendios.",
    activo: false
  },
  {
    id: "charla-09",
    titulo: "Equipo de protección para ojos y cara",
    expositor: "HUAMANI VELAZQUE, ALEX ALEJANDRO",
    area: "Mantenimiento General",
    fecha: "2026-07-25",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Concientizar sobre el uso obligatorio de lentes de seguridad, caretas y antiparras en tareas con riesgo de proyección.",
    puntosPrincipales: [
      "Usar lentes de seguridad de manera permanente en el taller.",
      "Utilizar careta facial completa para trabajos de esmerilado, corte o manipulación química.",
      "Verificar que la protección ocular tenga certificación ANSI Z87.1.",
      "Limpiar los lentes regularmente para evitar distorsión visual."
    ],
    riesgoPrincipal: "Incrustación de partículas extrañas, quemaduras químicas y pérdida de visión.",
    activo: false
  },
  {
    id: "charla-10",
    titulo: "Protección de caídas – Andamios",
    expositor: "ZAMALLOA CHICORE, ALVARO",
    area: "Mantenimiento General",
    fecha: "2026-07-27",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Promover el trabajo seguro en andamios y plataformas de trabajo elevadas.",
    puntosPrincipales: [
      "Verificar que el andamio cuente con tarjeta verde de aprobación antes de subir.",
      "Usar arnés de seguridad enganchado a un punto de anclaje independiente de la estructura.",
      "Asegurar la instalación de rodapiés para evitar la caída de herramientas.",
      "No exceder la carga máxima de trabajo especificada para el andamio."
    ],
    riesgoPrincipal: "Colapso de estructuras, caídas a diferente nivel, caída de objetos.",
    activo: false
  },
  {
    id: "charla-11",
    titulo: "Inventario y rotulación de productos químicos peligrosos",
    expositor: "VILCHEZ GUIDO, WENSESLAO",
    area: "Mantenimiento General",
    fecha: "2026-07-28",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Garantizar que toda sustancia química esté debidamente rotulada bajo el Sistema Globalmente Armonizado (SGA).",
    puntosPrincipales: [
      "Todo envase secundario debe tener etiqueta con pictogramas del SGA.",
      "Mantener el inventario de sustancias químicas actualizado.",
      "Asegurar que las Hojas de Datos de Seguridad (SGA/FDS) estén disponibles en el área.",
      "No almacenar productos químicos incompatibles juntos."
    ],
    riesgoPrincipal: "Reacciones químicas peligrosas, quemaduras, envenenamiento y derrames.",
    activo: false
  },
  {
    id: "charla-12",
    titulo: "Protección auditiva",
    expositor: "CASTILLO SANCHEZ, ALEX",
    area: "Mantenimiento General",
    fecha: "2026-07-29",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Prevenir la pérdida auditiva inducida por ruido en el taller de mantenimiento.",
    puntosPrincipales: [
      "Identificar zonas ruidosas señalizadas que requieren uso de protección auditiva.",
      "Utilizar correctamente tapones u orejeras de acuerdo al nivel de ruido.",
      "Limpiar los tapones reutilizables diariamente con agua y jabón neutro.",
      "Colocarse los tapones con las manos limpias levantando la oreja hacia arriba y atrás."
    ],
    riesgoPrincipal: "Hipoacusia inducida por ruido, fatiga y estrés laboral.",
    activo: false
  },
  {
    id: "charla-13",
    titulo: "Aseo en el trabajo",
    expositor: "SANGAMA CURITIMA, PABLO",
    area: "Mantenimiento General",
    fecha: "2026-07-30",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Mantener el orden, la limpieza y la higiene en todas las áreas de trabajo para evitar accidentes.",
    puntosPrincipales: [
      "Mantener pasillos, rutas de evacuación y salidas de emergencia completamente libres.",
      "Clasificar y disponer adecuadamente los residuos en sus respectivos tachos de color.",
      "Limpiar inmediatamente cualquier derrame de aceite o grasa en el piso.",
      "Almacenar adecuadamente herramientas y materiales al finalizar el trabajo."
    ],
    riesgoPrincipal: "Tropiezos, resbalones, golpes con objetos y propagación de plagas o infecciones.",
    activo: false
  },
  {
    id: "charla-14",
    titulo: "Seguridad en la iluminación",
    expositor: "RISCO QUINTOS, ENGEL ES SOL",
    area: "Mantenimiento General",
    fecha: "2026-07-31",
    horaInicio: "08:30",
    horaFin: "08:35",
    duracion: "5 minutos",
    objetivo: "Asegurar niveles adecuados de iluminación en las zonas de trabajo para evitar fatiga visual y accidentes.",
    puntosPrincipales: [
      "Reportar de inmediato luminarias parpadeantes o inoperativas en pasillos y talleres.",
      "Asegurar el uso de iluminación portátil a prueba de explosión en espacios confinados.",
      "Evitar el deslumbramiento directo redirigiendo reflectores de trabajo.",
      "Mantener limpias las cubiertas de las luminarias para maximizar el rendimiento de luz."
    ],
    riesgoPrincipal: "Fatiga visual, caídas al mismo nivel por falta de visibilidad y errores operativos.",
    activo: false
  }
];

// Seed initial signatures for the active talk using actual new staff members
export const DEFAULT_REGISTROS: RegistroFirma[] = [
  {
    id: "reg-01",
    charlaId: "charla-01",
    userDni: "09831991",
    nombreCompleto: "ALBA SALAS, PAUL ESTEBAN",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    horaFirma: "08:31:12 a.m.",
    firmaDataUrl: MOCK_SIGNATURES.alba,
    estado: "Asistió"
  },
  {
    id: "reg-02",
    charlaId: "charla-01",
    userDni: "40609977",
    nombreCompleto: "ARIAS LOPEZ, DANIEL ARTURO",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    horaFirma: "08:32:05 a.m.",
    firmaDataUrl: MOCK_SIGNATURES.arias,
    estado: "Asistió"
  },
  {
    id: "reg-03",
    charlaId: "charla-01",
    userDni: "45789989",
    nombreCompleto: "ARTEAGA IPARRAGUIRRE, DANIEL ARMANDO",
    area: "Mantenimiento General",
    cargo: "Operador de Mantenimiento",
    horaFirma: "08:32:45 a.m.",
    firmaDataUrl: MOCK_SIGNATURES.arteaga,
    estado: "Asistió"
  }
];
