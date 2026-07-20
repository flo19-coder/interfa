/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Charla, RegistroFirma } from '../types';
import { MOCK_SIGNATURES } from '../data';
import ClinicaLogo from './ClinicaLogo';

interface FormatoPdfGoodHopeProps {
  charla: Charla;
  registros: RegistroFirma[];
  supervisorName?: string;
  supervisorCargo?: string;
}

export default function FormatoPdfGoodHope({
  charla,
  registros,
  supervisorName = "Carlos Mendoza",
  supervisorCargo = "Supervisor de Mantenimiento"
}: FormatoPdfGoodHopeProps) {
  
  // Ensure we have exactly 20 rows to match the physical template page perfectly
  const totalRows = 20;
  const rows = Array.from({ length: totalRows }).map((_, index) => {
    const registro = registros[index];
    return {
      num: index + 1,
      nombre: registro ? registro.nombreCompleto : '',
      dni: registro ? registro.userDni : '',
      area: registro ? registro.area : '',
      firma: registro ? registro.firmaDataUrl : '',
      observaciones: registro ? (registro.estado === 'Asistió' ? 'Asistió' : '') : ''
    };
  });

  return (
    <div id="print-format-goodhope" className="bg-white text-black p-4 md:p-8 font-sans max-w-[850px] mx-auto border border-slate-300 shadow-sm print:border-0 print:shadow-none print:p-0 select-none text-[11px] leading-snug">
      
      {/* HEADER SECTION */}
      <table className="w-full border-collapse border border-slate-900 mb-4 text-left">
        <tbody>
          <tr>
            <td className="border border-slate-900 p-2 font-bold text-center w-[55%] text-[11px] uppercase">
              Formato Registro de Inducción, Capacitación, Entrenamiento y Simulacros de Emergencia
            </td>
            <td className="border border-slate-900 p-2 w-[45%] text-center" rowSpan={1}>
              <div className="flex items-center justify-center py-1">
                <ClinicaLogo variant="color" className="h-10 text-[9px]" />
              </div>
            </td>
          </tr>
          <tr>
            <td className="border border-slate-900 p-2 font-semibold">
              <span className="font-bold">RELACIONADA (S):</span> Procedimiento de Gestión del Plan de Capacitaciones
            </td>
            <td className="border border-slate-900 p-2">
              <div className="grid grid-cols-2 gap-1 text-[9px]">
                <div><span className="font-bold">N° DE IDENTIFICACIÓN:</span><br />FO-GTH-SST-09</div>
                <div><span className="font-bold">ÚLTIMA REVISIÓN:</span><br />06/05/2024</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* DATOS DEL EMPLEADOR PRINCIPAL */}
      <div className="bg-slate-100 font-bold border border-slate-900 px-2 py-1 uppercase text-[10px] tracking-wide mb-1">
        Datos del Empleador Principal
      </div>
      <table className="w-full border-collapse border border-slate-900 mb-4">
        <tbody>
          <tr>
            <td className="border border-slate-900 p-1.5 w-[70%]" colSpan={2}>
              <span className="font-bold">RAZÓN SOCIAL:</span><br />
              <span className="text-slate-800 font-medium">ASOCIACION PASTORAL DE SERVICIOS MEDICO ASISTENCIALES GOOD HOPE DE LA IGLESIA ADVENTISTA DEL SEPTIMO DÍA</span>
            </td>
            <td className="border border-slate-900 p-1.5 w-[30%]">
              <span className="font-bold">RUC:</span><br />
              <span className="text-slate-800 font-mono font-medium">20337889167</span>
            </td>
          </tr>
          <tr>
            <td className="border border-slate-900 p-1.5" colSpan={3}>
              <span className="font-bold">DOMICILIO (DIRECCIÓN COMPLETA):</span><br />
              <span className="text-slate-800 font-medium text-[10px]">MLC.BALTA NRO. 956 RES. MIRAFLORES (ALTURA PARQUE DEL AMOR) LIMA - LIMA - MIRAFLORES</span>
            </td>
          </tr>
          <tr>
            <td className="border border-slate-900 p-1.5 w-[50%]">
              <span className="font-bold">TIPO DE ACTIVIDAD ECONÓMICA:</span><br />
              <span className="text-slate-800 font-medium">8610 - ACTIVIDADES DE HOSPITALES</span>
            </td>
            <td className="border border-slate-900 p-1.5 w-[50%]" colSpan={2}>
              <span className="font-bold">Nº DE TRABAJADORES EN EL CENTRO LABORAL:</span><br />
              <span className="text-slate-800 font-medium">1174</span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* SELECCIONAR TIPO DE EVENTO */}
      <div className="bg-slate-100 font-bold border border-slate-900 px-2 py-1 uppercase text-[10px] tracking-wide mb-1">
        Seleccionar Tipo de Evento
      </div>
      <div className="border border-slate-900 p-2 mb-4 grid grid-cols-3 sm:grid-cols-6 gap-2">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={false} readOnly className="rounded border-slate-400 text-sky-600 focus:ring-sky-500 h-3.5 w-3.5" />
          <span>Inducción</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={false} readOnly className="rounded border-slate-400 text-sky-600 focus:ring-sky-500 h-3.5 w-3.5" />
          <span>Entrenamiento</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={false} readOnly className="rounded border-slate-400 text-sky-600 focus:ring-sky-500 h-3.5 w-3.5" />
          <span>Campaña de Salud</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={true} readOnly className="rounded border-slate-400 text-sky-600 focus:ring-sky-500 h-3.5 w-3.5" />
          <span className="font-semibold text-sky-700">Capacitación</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={false} readOnly className="rounded border-slate-400 text-sky-600 focus:ring-sky-500 h-3.5 w-3.5" />
          <span>Simulacro</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={true} readOnly className="rounded border-slate-400 text-sky-600 focus:ring-sky-500 h-3.5 w-3.5" />
          <span className="text-[10px] font-semibold text-slate-700">Otros (Charla 5m)</span>
        </label>
      </div>

      {/* DATOS DEL EVENTO */}
      <div className="bg-slate-100 font-bold border border-slate-900 px-2 py-1 uppercase text-[10px] tracking-wide mb-1">
        Datos del Evento (Charla de Seguridad de 5 Minutos)
      </div>
      <table className="w-full border-collapse border border-slate-900 mb-4">
        <tbody>
          <tr>
            <td className="border border-slate-900 p-1.5 w-[65%]" colSpan={2}>
              <span className="font-bold uppercase text-[9px] text-slate-500">TEMA DE LA CHARLA:</span><br />
              <span className="text-slate-900 font-bold text-[12px]">{charla.titulo}</span>
            </td>
            <td className="border border-slate-900 p-1.5 w-[35%]">
              <span className="font-bold uppercase text-[9px] text-slate-500">EMPRESA RESPONSABLE:</span><br />
              <span className="text-slate-800 font-medium">AREA DE MANTENIMIENTO - GH</span>
            </td>
          </tr>
          <tr>
            <td className="border border-slate-900 p-1.5" colSpan={3}>
              <span className="font-bold uppercase text-[9px] text-slate-500">NOMBRE DEL CAPACITADOR / EXPOSITOR:</span><br />
              <span className="text-slate-800 font-semibold text-[11px]">{charla.expositor}</span>
            </td>
          </tr>
          <tr className="font-mono text-[10px]">
            <td className="border border-slate-900 p-1.5 w-[30%]">
              <span className="font-bold uppercase text-[9px] font-sans text-slate-500">FECHA:</span><br />
              <span className="text-slate-800 font-medium">{charla.fecha}</span>
            </td>
            <td className="border border-slate-900 p-1.5 w-[35%]">
              <span className="font-bold uppercase text-[9px] font-sans text-slate-500">HORA INICIO (0-24HRS):</span><br />
              <span className="text-slate-900 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">08:30 a.m.</span>
            </td>
            <td className="border border-slate-900 p-1.5 w-[35%]">
              <span className="font-bold uppercase text-[9px] font-sans text-slate-500">HORA TÉRMINO (0-24HRS):</span><br />
              <span className="text-slate-900 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">08:35 a.m.</span>
            </td>
          </tr>
          <tr>
            <td className="border border-slate-900 p-1.5" colSpan={2}>
              <span className="font-bold uppercase text-[9px] text-slate-500">OBJETIVO:</span><br />
              <span className="text-slate-700 italic text-[10px]">{charla.objetivo}</span>
            </td>
            <td className="border border-slate-900 p-1.5">
              <span className="font-bold uppercase text-[9px] text-slate-500">N° HORAS / DURACIÓN:</span><br />
              <span className="text-slate-800 font-medium">5 minutos (0.08 horas)</span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* REGISTRO DE ASISTENCIAS */}
      <table className="w-full border-collapse border border-slate-900 text-left mb-4">
        <thead>
          <tr className="bg-slate-100 text-slate-800 uppercase font-bold text-[9px] tracking-wider">
            <th className="border border-slate-900 p-1 text-center w-[5%]">Nº</th>
            <th className="border border-slate-900 p-1 w-[40%]">Apellidos y Nombres</th>
            <th className="border border-slate-900 p-1 text-center w-[15%]">DNI</th>
            <th className="border border-slate-900 p-1 w-[20%]">Área / Cargo</th>
            <th className="border border-slate-900 p-1 text-center w-[12%]">Firma</th>
            <th className="border border-slate-900 p-1 text-center w-[8%]">Observ.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.num} className="h-7 border-b border-slate-900">
              <td className="border border-slate-900 p-0.5 text-center font-bold text-slate-500 text-[9px]">{row.num}</td>
              <td className="border border-slate-900 px-1.5 py-0.5 font-medium text-[10px] text-slate-800 uppercase">
                {row.nombre}
              </td>
              <td className="border border-slate-900 p-0.5 text-center font-mono text-[9px] text-slate-700">
                {row.dni}
              </td>
              <td className="border border-slate-900 px-1.5 py-0.5 text-[9px] text-slate-600">
                {row.area}
              </td>
              <td className="border border-slate-900 p-0.5 text-center align-middle relative overflow-hidden bg-white">
                {row.firma ? (
                  <img 
                    src={row.firma} 
                    alt="Firma" 
                    referrerPolicy="no-referrer"
                    className="max-h-5 max-w-[80px] mx-auto object-contain select-none" 
                  />
                ) : (
                  <span className="text-[8px] text-slate-300 font-serif italic">No firmó</span>
                )}
              </td>
              <td className="border border-slate-900 p-0.5 text-center text-[9px]">
                {row.observaciones ? (
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-1 rounded border border-emerald-100 text-[8px]">
                    {row.observaciones}
                  </span>
                ) : (
                  <span className="text-[8px] text-red-300 font-mono">Falta</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* RESPONSABLE DEL REGISTRO */}
      <div className="bg-slate-100 font-bold border border-slate-900 px-2 py-1 uppercase text-[10px] tracking-wide mb-1">
        Responsable del Registro de Charla
      </div>
      <table className="w-full border-collapse border border-slate-900 text-left text-[10px]">
        <tbody>
          <tr>
            <td className="border border-slate-900 p-2 w-[55%]">
              <div><span className="font-bold">NOMBRE:</span> {supervisorName}</div>
              <div className="mt-1"><span className="font-bold">CARGO:</span> {supervisorCargo}</div>
              <div className="grid grid-cols-2 gap-1 mt-1 text-[9px]">
                <div><span className="font-bold">ÁREA:</span> Mantenimiento General</div>
                <div><span className="font-bold">FECHA:</span> {charla.fecha}</div>
              </div>
            </td>
            <td className="border border-slate-900 p-2 w-[45%] text-center align-middle relative bg-slate-50/50">
              <span className="block text-[8px] text-slate-500 uppercase font-bold absolute top-1 left-2">Firma del Responsable</span>
              <div className="py-2 flex flex-col items-center justify-center">
                <img 
                  src={MOCK_SIGNATURES.carlos} 
                  alt="Firma Supervisor" 
                  referrerPolicy="no-referrer"
                  className="h-10 object-contain" 
                />
                <div className="w-[180px] border-t border-slate-400 mt-1"></div>
                <span className="text-[8px] text-slate-500 font-mono font-medium">{supervisorName}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* FOOTER METADATA */}
      <div className="flex justify-between items-center text-[8px] text-slate-400 mt-3 border-t border-slate-200 pt-1">
        <div>Publicado en <span className="font-semibold">2024 Clínica Adventista Good Hope</span> .</div>
        <div className="font-medium">© 2024 Gestión de la Calidad. Se puede adaptar para uso interno. V3</div>
        <div className="font-semibold">Página 1 de 1</div>
      </div>

    </div>
  );
}
