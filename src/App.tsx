/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  PlusCircle, 
  History, 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  Shield, 
  LogOut, 
  Search, 
  Printer, 
  PenTool, 
  UserPlus, 
  Check, 
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
  Briefcase,
  Layers,
  Database,
  Building,
  Edit2,
  Trash2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Usuario, Charla, RegistroFirma } from './types';
import { DEFAULT_USUARIOS, DEFAULT_CHARLAS, DEFAULT_REGISTROS, MOCK_SIGNATURES } from './data';
import SignaturePad from './components/SignaturePad';
import FormatoPdfGoodHope from './components/FormatoPdfGoodHope';
import ClinicaLogo from './components/ClinicaLogo';

export default function App() {
  // --- DATABASE STATE WITH LOCALSTORAGE PERSISTENCE ---
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    // If we have an existing localstorage with dummy users, let's make sure we reset or merge to have the updated 30 official operators
    const saved = localStorage.getItem('gh_usuarios');
    if (saved) {
      const parsed = JSON.parse(saved);
      // If the saved list has dummy users like "Juan Pérez Ramírez", reset to DEFAULT_USUARIOS
      if (parsed.some((u: any) => u.dni === "12345678")) {
        return DEFAULT_USUARIOS;
      }
      return parsed;
    }
    return DEFAULT_USUARIOS;
  });

  const [charlas, setCharlas] = useState<Charla[]>(() => {
    const saved = localStorage.getItem('gh_charlas');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.some((c: any) => c.expositor === "Carlos Mendoza") || parsed.length < DEFAULT_CHARLAS.length) {
        return DEFAULT_CHARLAS;
      }
      return parsed;
    }
    return DEFAULT_CHARLAS;
  });

  const [registros, setRegistros] = useState<RegistroFirma[]>(() => {
    const saved = localStorage.getItem('gh_registros');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.some((r: any) => r.userDni === "12345678")) {
        return DEFAULT_REGISTROS;
      }
      return parsed;
    }
    return DEFAULT_REGISTROS;
  });

  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(() => {
    const saved = localStorage.getItem('gh_usuario_actual');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.dni === "12345678") {
        return null;
      }
      return parsed;
    }
    return null;
  });

  // Sync to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('gh_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem('gh_charlas', JSON.stringify(charlas));
  }, [charlas]);

  useEffect(() => {
    localStorage.setItem('gh_registros', JSON.stringify(registros));
  }, [registros]);

  useEffect(() => {
    if (usuarioActual) {
      localStorage.setItem('gh_usuario_actual', JSON.stringify(usuarioActual));
    } else {
      localStorage.removeItem('gh_usuario_actual');
    }
  }, [usuarioActual]);

  // --- NAVIGATION & UI STATE ---
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'charlas' | 'usuarios' | 'pdf-preview' | 'historial' | 'asistencia-directa'>('dashboard');
  const [dniLogin, setDniLogin] = useState('');
  const [claveLogin, setClaveLogin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Direct signature states for administrators signing operators directly
  const [selectedWorkerToSign, setSelectedWorkerToSign] = useState<Usuario | null>(null);
  const [directSignatureData, setDirectSignatureData] = useState('');
  const [isConfirmingDirectRead, setIsConfirmingDirectRead] = useState(false);

  // Signature state for staff signing
  const [temporarySignature, setTemporarySignature] = useState('');
  const [hasConfirmedRead, setHasConfirmedRead] = useState(false);
  const [signingSuccess, setSigningSuccess] = useState(false);

  // Search/Filter queries
  const [searchQuery, setSearchQuery] = useState('');

  // Manage Talks Forms
  const [isCreatingCharla, setIsCreatingCharla] = useState(false);
  const [editingCharla, setEditingCharla] = useState<Charla | null>(null);
  const [newCharla, setNewCharla] = useState<Omit<Charla, 'id' | 'activo'>>({
    titulo: '',
    expositor: 'Carlos Mendoza',
    area: 'Mantenimiento General',
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: '08:30',
    horaFin: '08:35',
    duracion: '5 minutos',
    objetivo: '',
    puntosPrincipales: ['', ''],
    riesgoPrincipal: ''
  });

  // Manage Staff Forms
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [newUser, setNewUser] = useState<Usuario>({
    dni: '',
    nombreCompleto: '',
    area: 'Mantenimiento General',
    cargo: 'Técnico',
    rol: 'staff',
    clave: ''
  });

  // Active Selected Talk for Viewing/PDF Report (Defaults to active/first talk)
  const activeTalk = charlas.find(c => c.activo) || charlas[0];
  const [selectedReportTalkId, setSelectedReportTalkId] = useState<string>(activeTalk?.id || '');
  const selectedTalk = charlas.find(c => c.id === selectedReportTalkId) || activeTalk;

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Set selected report talk once charlas load
  useEffect(() => {
    if (charlas.length > 0 && !selectedReportTalkId) {
      setSelectedReportTalkId(charlas[0].id);
    }
  }, [charlas]);

  // --- HANDLERS ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!dniLogin || !claveLogin) {
      setLoginError('Por favor ingrese su DNI y contraseña.');
      return;
    }

    const user = usuarios.find(u => u.dni === dniLogin && u.clave === claveLogin);
    if (user) {
      setUsuarioActual(user);
      setDniLogin('');
      setClaveLogin('');
      // Route admin to dashboard, staff to charlas immediately
      if (user.rol === 'admin') {
        setCurrentTab('dashboard');
      } else {
        setCurrentTab('charlas');
      }
    } else {
      setLoginError('DNI o contraseña incorrectos. Intente nuevamente.');
    }
  };

  const handleDemoLogin = (dni: string, clave: string) => {
    const user = usuarios.find(u => u.dni === dni && u.clave === clave);
    if (user) {
      setUsuarioActual(user);
      setLoginError('');
      if (user.rol === 'admin') {
        setCurrentTab('dashboard');
      } else {
        setCurrentTab('charlas');
      }
    }
  };

  const handleLogout = () => {
    setUsuarioActual(null);
    setCurrentTab('dashboard');
    setSigningSuccess(false);
    setTemporarySignature('');
    setHasConfirmedRead(false);
  };

  // Staff submits their digital signature to current active talk
  const handleSaveSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuarioActual) return;
    if (!activeTalk) {
      alert('No hay ninguna charla activa hoy para firmar.');
      return;
    }

    if (!temporarySignature) {
      alert('Por favor realice su firma digital en el recuadro antes de guardar.');
      return;
    }

    if (!hasConfirmedRead) {
      alert('Debe confirmar que ha leído y comprendido la charla marcando la casilla.');
      return;
    }

    // Check if already signed this talk
    const yaFirmado = registros.some(r => r.charlaId === activeTalk.id && r.userDni === usuarioActual.dni);
    if (yaFirmado) {
      alert('Ya ha registrado su firma para esta charla de seguridad.');
      return;
    }

    const formattedTime = new Date().toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });

    const nuevoRegistro: RegistroFirma = {
      id: `reg-${Date.now()}`,
      charlaId: activeTalk.id,
      userDni: usuarioActual.dni,
      nombreCompleto: usuarioActual.nombreCompleto,
      area: usuarioActual.area,
      cargo: usuarioActual.cargo,
      horaFirma: formattedTime,
      firmaDataUrl: temporarySignature,
      estado: 'Asistió'
    };

    setRegistros(prev => [nuevoRegistro, ...prev]);
    setSigningSuccess(true);
    setTemporarySignature('');
    setHasConfirmedRead(false);
  };

  // Direct administrator registration of worker attendance & signature
  const handleSaveDirectAttendance = () => {
    if (!selectedWorkerToSign) return;
    if (!activeTalk) {
      alert("No hay una charla activa configurada para registrar firmas.");
      return;
    }
    if (!directSignatureData) {
      alert("Por favor, dibuje una firma antes de registrar la asistencia.");
      return;
    }
    if (!isConfirmingDirectRead) {
      alert("Debe confirmar que el colaborador asistió a la charla de 5 minutos.");
      return;
    }

    const formattedTime = new Date().toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });

    const nuevoRegistro: RegistroFirma = {
      id: `reg-${Date.now()}`,
      charlaId: activeTalk.id,
      userDni: selectedWorkerToSign.dni,
      nombreCompleto: selectedWorkerToSign.nombreCompleto,
      area: selectedWorkerToSign.area,
      cargo: selectedWorkerToSign.cargo,
      horaFirma: formattedTime,
      firmaDataUrl: directSignatureData,
      estado: 'Asistió'
    };

    // Remove previous register if any
    setRegistros(prev => {
      const filtered = prev.filter(r => !(r.charlaId === activeTalk.id && r.userDni === selectedWorkerToSign.dni));
      return [nuevoRegistro, ...filtered];
    });

    // Reset and close
    setSelectedWorkerToSign(null);
    setDirectSignatureData('');
    setIsConfirmingDirectRead(false);
  };

  const handleRemoveAttendance = (dni: string) => {
    if (!activeTalk) return;
    if (window.confirm("¿Está seguro que desea eliminar el registro de asistencia y firma de este colaborador?")) {
      setRegistros(prev => prev.filter(r => !(r.charlaId === activeTalk.id && r.userDni === dni)));
    }
  };

  // Admin toggles active safety talk
  const handleToggleActiveTalk = (id: string) => {
    setCharlas(prev => prev.map(c => ({
      ...c,
      activo: c.id === id
    })));
  };

  // Create new safety talk
  const handleCreateTalk = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `charla-${Date.now()}`;
    const cleanPoints = newCharla.puntosPrincipales.filter(p => p.trim() !== '');
    
    const nueva: Charla = {
      id,
      ...newCharla,
      puntosPrincipales: cleanPoints.length > 0 ? cleanPoints : ['Punto de seguridad 1'],
      activo: false
    };

    setCharlas(prev => [nueva, ...prev]);
    setIsCreatingCharla(false);
    setSelectedReportTalkId(id); // Set active focus to new talk
    setNewCharla({
      titulo: '',
      expositor: 'Carlos Mendoza',
      area: 'Mantenimiento General',
      fecha: new Date().toISOString().split('T')[0],
      horaInicio: '08:30',
      horaFin: '08:35',
      duracion: '5 minutos',
      objetivo: '',
      puntosPrincipales: ['', ''],
      riesgoPrincipal: ''
    });
  };

  // Edit talk
  const handleUpdateTalk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCharla) return;

    setCharlas(prev => prev.map(c => c.id === editingCharla.id ? editingCharla : c));
    setEditingCharla(null);
  };

  // Delete talk
  const handleDeleteTalk = (id: string) => {
    if (confirm('¿Está seguro de que desea eliminar esta charla de seguridad? Se borrarán también sus registros.')) {
      setCharlas(prev => prev.filter(c => c.id !== id));
      setRegistros(prev => prev.filter(r => r.charlaId !== id));
      if (selectedReportTalkId === id) {
        setSelectedReportTalkId(charlas.find(c => c.id !== id)?.id || '');
      }
    }
  };

  // Create new worker
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (usuarios.some(u => u.dni === newUser.dni)) {
      alert('Ya existe un usuario registrado con ese DNI.');
      return;
    }

    setUsuarios(prev => [...prev, newUser]);
    setIsCreatingUser(false);
    setNewUser({
      dni: '',
      nombreCompleto: '',
      area: 'Mantenimiento General',
      cargo: 'Técnico',
      rol: 'staff',
      clave: ''
    });
  };

  // Delete worker
  const handleDeleteUser = (dni: string) => {
    if (dni === '99999999') {
      alert('No se puede eliminar la cuenta del administrador principal.');
      return;
    }
    if (confirm('¿Está seguro de que desea eliminar este usuario de la base de datos?')) {
      setUsuarios(prev => prev.filter(u => u.dni !== dni));
    }
  };

  // Auto-simulate other staff signing for the selected talk (amazing for demos and filling the template!)
  const handleSimulateSignatures = () => {
    if (!selectedTalk) return;
    
    // Find staff who haven't signed this selected talk yet
    const signedDnis = registros.filter(r => r.charlaId === selectedTalk.id).map(r => r.userDni);
    const unsignedStaff = usuarios.filter(u => u.rol === 'staff' && !signedDnis.includes(u.dni));

    if (unsignedStaff.length === 0) {
      alert('Todos los trabajadores ya han firmado esta charla.');
      return;
    }

    const newSimulatedRegistros: RegistroFirma[] = unsignedStaff.map((staff, index) => {
      // Pick a preset stroke signature or assign random
      const key = Object.keys(MOCK_SIGNATURES)[index % Object.keys(MOCK_SIGNATURES).length] as keyof typeof MOCK_SIGNATURES;
      const signatureImg = MOCK_SIGNATURES[key] || MOCK_SIGNATURES.alba;

      const randomMin = Math.floor(Math.random() * 5); // 08:30 to 08:34
      const randomSec = Math.floor(Math.random() * 60);
      const timeStr = `08:3${randomMin}:${randomSec.toString().padStart(2, '0')} a.m.`;

      return {
        id: `reg-sim-${Date.now()}-${index}`,
        charlaId: selectedTalk.id,
        userDni: staff.dni,
        nombreCompleto: staff.nombreCompleto,
        area: staff.area,
        cargo: staff.cargo,
        horaFirma: timeStr,
        firmaDataUrl: signatureImg,
        estado: 'Asistió'
      };
    });

    setRegistros(prev => [...newSimulatedRegistros, ...prev]);
  };

  // Clear all signatures for the selected talk
  const handleClearSelectedTalkSignatures = () => {
    if (!selectedTalk) return;
    if (confirm('¿Está seguro de eliminar todas las firmas de asistencia de esta charla?')) {
      setRegistros(prev => prev.filter(r => r.charlaId !== selectedTalk.id));
    }
  };

  // Print function (opens system print view for perfect FO-GTH-SST-09 layout)
  const handlePrintPdf = () => {
    window.print();
  };

  // --- STATS COMPUTATIONS ---
  const activeTalkRegistros = registros.filter(r => r.charlaId === (selectedTalk?.id || ''));
  const totalPersonalSoporte = usuarios.filter(u => u.rol === 'staff').length;
  const totalAsistentes = activeTalkRegistros.length;
  const totalAusentes = Math.max(0, totalPersonalSoporte - totalAsistentes);
  const porcentajeAsistencia = totalPersonalSoporte > 0 
    ? Math.round((totalAsistentes / totalPersonalSoporte) * 100) 
    : 0;

  // Filtered lists based on search
  const filteredPersonal = usuarios.filter(u => 
    u.nombreCompleto.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.dni.includes(searchQuery) ||
    u.cargo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.area.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans relative">
      
      {/* -------------------- PRINT ONLY WRAPPER -------------------- */}
      <div className="hidden print:block absolute inset-0 bg-white z-[999999]">
        {selectedTalk && (
          <FormatoPdfGoodHope 
            charla={selectedTalk} 
            registros={activeTalkRegistros} 
          />
        )}
      </div>

      {/* -------------------- MAIN APP BODY (HIDDEN WHEN PRINTING) -------------------- */}
      <div className="flex-1 flex flex-col md:flex-row print:hidden">
        
        {/* SIDEBAR FOR AUTHENTICATED USERS */}
        {usuarioActual && (
          <aside id="sidebar-panel" className="w-full md:w-64 bg-[#0c1e35] text-white flex flex-col shrink-0 border-r border-[#152e4f] shadow-lg">
            
            {/* Header / Brand */}
            <div className="p-4 border-b border-[#152e4f] flex items-center justify-center">
              <ClinicaLogo variant="white" className="h-12" />
            </div>

            {/* Logged in User Badge */}
            <div className="p-4 bg-[#0e2540] border-b border-[#152e4f] flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-800 font-bold uppercase border-2 border-sky-400">
                {usuarioActual.nombreCompleto.substring(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xs font-bold text-slate-100 truncate">{usuarioActual.nombreCompleto}</h2>
                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-sky-300 uppercase mt-0.5">
                  <Shield className="h-2.5 w-2.5" />
                  {usuarioActual.rol === 'admin' ? 'Supervisor / Admin' : 'Técnico de Mantenimiento'}
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 p-3 space-y-1">
              
              {/* ADMIN ONLY BUTTONS */}
              {usuarioActual.rol === 'admin' && (
                <>
                  <div className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider py-2">Panel Administrador</div>
                  
                  <button
                    onClick={() => setCurrentTab('dashboard')}
                    id="tab-dashboard-btn"
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      currentTab === 'dashboard' 
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-900/30' 
                        : 'text-slate-300 hover:bg-[#112a4c] hover:text-white'
                    }`}
                  >
                    <Layers className="h-4 w-4 shrink-0 text-sky-400" />
                    Panel Control & Stats
                  </button>

                  <button
                    onClick={() => setCurrentTab('pdf-preview')}
                    id="tab-pdf-preview-btn"
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      currentTab === 'pdf-preview' 
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-900/30' 
                        : 'text-slate-300 hover:bg-[#112a4c] hover:text-white'
                    }`}
                  >
                    <FileText className="h-4 w-4 shrink-0 text-amber-400" />
                    Vista Formato FO-GTH
                  </button>

                  <button
                    onClick={() => setCurrentTab('historial')}
                    id="tab-historial-btn"
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      currentTab === 'historial' 
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-900/30' 
                        : 'text-slate-300 hover:bg-[#112a4c] hover:text-white'
                    }`}
                  >
                    <History className="h-4 w-4 shrink-0 text-teal-400" />
                    Gestión de Charlas
                  </button>

                  <button
                    onClick={() => setCurrentTab('usuarios')}
                    id="tab-usuarios-btn"
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      currentTab === 'usuarios' 
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-900/30' 
                        : 'text-slate-300 hover:bg-[#112a4c] hover:text-white'
                    }`}
                  >
                    <Users className="h-4 w-4 shrink-0 text-emerald-400" />
                    Base de Datos Personal
                  </button>

                  <button
                    onClick={() => setCurrentTab('asistencia-directa')}
                    id="tab-asistencia-directa-btn"
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                      currentTab === 'asistencia-directa' 
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-900/30' 
                        : 'text-slate-300 hover:bg-[#112a4c] hover:text-white'
                    }`}
                  >
                    <PenTool className="h-4 w-4 shrink-0 text-amber-400" />
                    Registrar Asistencias
                  </button>
                </>
              )}

              {/* STAFF VIEW BUTTONS */}
              <div className="text-[10px] font-bold text-slate-400 px-3 uppercase tracking-wider py-2 pt-4">Portal de Charlas</div>
              
              <button
                onClick={() => setCurrentTab('charlas')}
                id="tab-charlas-btn"
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === 'charlas' 
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-900/30' 
                    : 'text-slate-300 hover:bg-[#112a4c] hover:text-white'
                }`}
              >
                <FileCheck className="h-4 w-4 shrink-0 text-sky-400" />
                Charla del Día (Firma)
              </button>

            </nav>

            {/* Logout Footer */}
            <div className="p-3 border-t border-[#152e4f] bg-[#091729]">
              <button
                onClick={handleLogout}
                id="logout-btn"
                className="w-full flex items-center justify-between px-3 py-2 text-slate-400 hover:text-red-400 rounded-lg text-xs font-semibold hover:bg-red-500/10 transition-all cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

          </aside>
        )}

        {/* MAIN DISPLAY AREA */}
        <main className="flex-1 overflow-y-auto">
          
          {/* 1. GUEST LOGIN SCREEN */}
          {!usuarioActual && (
            <div className="min-h-screen bg-[#0e2238] flex flex-col justify-center items-center p-4 relative overflow-hidden">
              {/* Abstract decorative backgrounds */}
              <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-600/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

              <div className="w-full max-w-md bg-[#132c4a] rounded-2xl border border-[#1e3c63] shadow-2xl p-6 md:p-8 z-10 transition-all">
                
                {/* Brand Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <ClinicaLogo variant="white" className="h-16 text-white" />
                  </div>
                  <p className="text-[10px] text-sky-300 font-bold uppercase tracking-widest mt-3">Área de Mantenimiento - Charlas de 5 Minutos</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  {loginError && (
                    <div id="login-error-alert" className="p-3 bg-red-500/15 border border-red-500/30 text-red-200 rounded-xl text-xs flex items-start gap-2.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label htmlFor="dni-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wide">DNI del Trabajador</label>
                    <div className="relative">
                      <input
                        type="text"
                        id="dni-input"
                        placeholder="Ingrese su DNI de 8 dígitos"
                        value={dniLogin}
                        onChange={(e) => setDniLogin(e.target.value.replace(/\D/g, '').substring(0, 8))}
                        className="w-full bg-[#0a1829] border border-[#23426a] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="clave-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wide">Clave de Acceso</label>
                    <div className="relative">
                      <input
                        type="password"
                        id="clave-input"
                        placeholder="Ingrese su contraseña"
                        value={claveLogin}
                        onChange={(e) => setClaveLogin(e.target.value)}
                        className="w-full bg-[#0a1829] border border-[#23426a] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="submit-login-btn"
                    className="w-full bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-950/40 cursor-pointer flex items-center justify-center gap-2"
                  >
                    Ingresar al Portal
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>

                {/* Demo accounts info has been removed for the final production version */}

              </div>
            </div>
          )}

          {/* 2. AUTHENTICATED WORKER VIEW: CHARLA DEL DIA & FIRMA */}
          {usuarioActual && currentTab === 'charlas' && (
            <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
              
              {/* Header Bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight">Charla de Seguridad del Día</h1>
                  <p className="text-xs text-slate-500 mt-1">Estimado colaborador, lea atentamente la charla y registre su firma para certificar su asistencia.</p>
                </div>
                
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0">
                  <Clock className="h-4 w-4 text-sky-600 animate-pulse" />
                  <div className="text-right">
                    <span className="block text-[8px] text-slate-400 font-bold uppercase leading-none">Hora Actual</span>
                    <span className="block text-xs font-mono font-bold text-slate-800 mt-0.5">
                      {currentTime.toLocaleTimeString('es-PE')}
                    </span>
                  </div>
                </div>
              </div>

              {activeTalk ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Talk Content Column */}
                  <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    
                    {/* Header Banner */}
                    <div className="bg-[#0f2a4a] text-white p-5">
                      <span className="bg-sky-500 text-white text-[9px] uppercase font-bold tracking-wider px-2 py-1 rounded">Charla Activa Hoy</span>
                      <h2 className="text-lg md:text-xl font-bold mt-2 text-white leading-tight">{activeTalk.titulo}</h2>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-[10px] text-slate-300">
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Expositor</span>
                          <span className="font-semibold text-white">{activeTalk.expositor}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Hora Obligatoria</span>
                          <span className="font-semibold text-white">08:30 a.m. - 08:35 a.m.</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Área</span>
                          <span className="font-semibold text-white">{activeTalk.area}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-slate-400 font-bold">Duración</span>
                          <span className="font-semibold text-white">{activeTalk.duracion}</span>
                        </div>
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="p-5 space-y-4 flex-1">
                      
                      <div className="space-y-1">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Objetivo Principal</h3>
                        <p className="text-sm font-medium text-slate-700 italic">{activeTalk.objetivo}</p>
                      </div>

                      <hr className="border-slate-100" />

                      <div className="space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Puntos Principales a Evaluar</h3>
                        <ul className="space-y-2 text-xs md:text-sm text-slate-700">
                          {activeTalk.puntosPrincipales.map((punto, index) => (
                            <li key={index} className="flex items-start gap-2.5">
                              <span className="bg-emerald-50 text-emerald-600 rounded-full p-0.5 mt-0.5 shrink-0 border border-emerald-200">
                                <Check className="h-3 w-3" />
                              </span>
                              <span>{punto}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <hr className="border-slate-100" />

                      {/* Main Risks Banner */}
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">Riesgo Crítico Asociado</h4>
                          <p className="text-xs font-medium text-amber-700 mt-0.5">{activeTalk.riesgoPrincipal}</p>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Signing Panel Column */}
                  <div className="lg:col-span-5 space-y-4">
                    
                    {/* Check if already signed this talk */}
                    {registros.some(r => r.charlaId === activeTalk.id && r.userDni === usuarioActual.dni) || signingSuccess ? (
                      
                      <div className="bg-white border-2 border-emerald-100 rounded-2xl shadow-sm p-6 text-center space-y-4">
                        <div className="inline-flex bg-emerald-100 text-emerald-600 p-3 rounded-full border border-emerald-200 mb-2">
                          <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">¡Asistencia Registrada!</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Su firma digital ha sido registrada y guardada de manera automática en el 
                          <span className="font-bold text-slate-700"> Formato FO-GTH-SST-09</span> de la clínica. Su asistencia está asegurada.
                        </p>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">Su Firma Registrada</span>
                          
                          {/* Fetch the signature data of this logged user */}
                          {(() => {
                            const miRegistro = registros.find(r => r.charlaId === activeTalk.id && r.userDni === usuarioActual.dni);
                            if (miRegistro) {
                              return (
                                <div className="mt-2 bg-white rounded-lg border border-slate-200 p-2 max-w-[200px]">
                                  <img 
                                    src={miRegistro.firmaDataUrl} 
                                    alt="Su firma" 
                                    referrerPolicy="no-referrer"
                                    className="h-12 object-contain" 
                                  />
                                </div>
                              );
                            }
                            return null;
                          })()}

                          <div className="text-[10px] text-slate-600 font-mono mt-2 font-medium">
                            Hora: {registros.find(r => r.charlaId === activeTalk.id && r.userDni === usuarioActual.dni)?.horaFirma || '08:31 a.m.'}
                          </div>
                        </div>

                        <div className="pt-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                            Estado: Asistió el {activeTalk.fecha}
                          </span>
                        </div>
                      </div>

                    ) : (

                      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 space-y-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                          <PenTool className="h-4 w-4 text-sky-600" />
                          <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wide">Firma de Asistencia Digital</h3>
                        </div>

                        <form onSubmit={handleSaveSignature} className="space-y-4">
                          
                          {/* Signature Pad Canvas */}
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Firme con su dedo en celulares o con el mouse en PC:</label>
                            <SignaturePad 
                              onSave={(dataUrl) => setTemporarySignature(dataUrl)} 
                              onClear={() => setTemporarySignature('')}
                            />
                          </div>

                          {/* Comprehension Checkbox */}
                          <label className="flex items-start gap-2.5 cursor-pointer bg-slate-50 border border-slate-100 p-3 rounded-xl hover:bg-slate-100/65 transition-all">
                            <input
                              type="checkbox"
                              checked={hasConfirmedRead}
                              onChange={(e) => setHasConfirmedRead(e.target.checked)}
                              id="confirm-read-checkbox"
                              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4 mt-0.5"
                            />
                            <span className="text-xs text-slate-600 font-medium leading-tight">
                              Confirmo que he leído, comprendido y me comprometo a cumplir las instrucciones de seguridad indicadas en esta charla de 5 minutos.
                            </span>
                          </label>

                          <button
                            type="submit"
                            id="save-signature-btn"
                            disabled={!temporarySignature || !hasConfirmedRead}
                            className={`w-full py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
                              temporarySignature && hasConfirmedRead
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-md'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            }`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Registrar Mi Asistencia
                          </button>
                        </form>
                      </div>

                    )}

                    {/* Flow Info Card removed for production */}

                  </div>

                </div>
              ) : (
                <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
                  <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-950">No hay charla activa</h3>
                  <p className="text-xs text-slate-500">Pida al supervisor de mantenimiento que active o cree la charla del día.</p>
                </div>
              )}

            </div>
          )}

          {/* 3. ADMIN PANEL - DASHBOARD WITH CHARTS & STATS */}
          {usuarioActual?.rol === 'admin' && currentTab === 'dashboard' && (
            <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight">Panel de Control General</h1>
                  <p className="text-xs text-slate-500 mt-1">Monitoree la asistencia de los técnicos de mantenimiento en tiempo real.</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={selectedReportTalkId}
                    onChange={(e) => setSelectedReportTalkId(e.target.value)}
                    id="select-talk-report"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 shadow-sm"
                  >
                    {charlas.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.titulo} ({c.fecha})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* STATS BENTO GRID */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Stat 1 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asistentes</span>
                    <span className="block text-2xl font-black text-emerald-600 mt-1">{totalAsistentes}</span>
                    <span className="text-[9px] text-slate-500 font-medium">Técnicos firmados</span>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl border border-emerald-100">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Faltantes</span>
                    <span className="block text-2xl font-black text-rose-500 mt-1">{totalAusentes}</span>
                    <span className="text-[9px] text-slate-500 font-medium">Sin firmar hoy</span>
                  </div>
                  <div className="bg-rose-50 text-rose-500 p-2.5 rounded-xl border border-rose-100">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total de Plantilla</span>
                    <span className="block text-2xl font-black text-slate-900 mt-1">{totalPersonalSoporte}</span>
                    <span className="text-[9px] text-slate-500 font-medium">Técnicos registrados</span>
                  </div>
                  <div className="bg-slate-50 text-slate-600 p-2.5 rounded-xl border border-slate-200">
                    <Users className="h-5 w-5" />
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tasa de Progreso</span>
                    <span className="block text-2xl font-black text-sky-600 mt-1">{porcentajeAsistencia}%</span>
                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2 border border-slate-200">
                      <div className="bg-sky-500 h-full rounded-full" style={{ width: `${porcentajeAsistencia}%` }}></div>
                    </div>
                  </div>
                  <div className="bg-sky-50 text-sky-600 p-2.5 rounded-xl border border-sky-100">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </div>

              </div>

              {/* QUICK CONTROL ACTIONS BAR */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider">
                    <Database className="h-4 w-4" />
                    Simulaciones y Relleno Rápido
                  </div>
                  <p className="text-[11px] text-slate-400">Rellene firmas ficticias para evaluar el formato PDF FO-GTH impreso de manera inmediata.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleSimulateSignatures}
                    id="simulate-signatures-btn"
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow flex items-center gap-1.5"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Simular Firmas Restantes
                  </button>

                  <button
                    onClick={handleClearSelectedTalkSignatures}
                    id="clear-signatures-btn"
                    className="px-3 py-2 bg-slate-800 hover:bg-red-900 text-slate-300 hover:text-white border border-slate-700 hover:border-red-800 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Limpiar Firmas
                  </button>
                </div>
              </div>

              {/* LIST OF SIGNED ATTENDEES FOR THE SELECTED TALK */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 uppercase tracking-tight">
                      Lista de Asistencia ({selectedTalk?.titulo || 'Charla'})
                    </h3>
                    <p className="text-[11px] text-slate-500">Muestra la hora exacta del registro y la firma manuscrita digitalizada de cada técnico.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentTab('pdf-preview')}
                      className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Imprimir Formato PDF
                    </button>
                  </div>
                </div>

                {activeTalkRegistros.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                          <th className="p-3 text-center w-12">#</th>
                          <th className="p-3">DNI</th>
                          <th className="p-3">Nombre Completo</th>
                          <th className="p-3">Área de Mantenimiento</th>
                          <th className="p-3">Cargo del Puesto</th>
                          <th className="p-3 text-center">Hora de Registro</th>
                          <th className="p-3 text-center">Firma Digital</th>
                          <th className="p-3 text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeTalkRegistros.map((reg, index) => (
                          <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 text-center font-bold text-slate-400">{index + 1}</td>
                            <td className="p-3 font-mono font-bold text-slate-700">{reg.userDni}</td>
                            <td className="p-3 font-semibold text-slate-900 uppercase">{reg.nombreCompleto}</td>
                            <td className="p-3 text-slate-600">{reg.area}</td>
                            <td className="p-3 text-slate-600">{reg.cargo}</td>
                            <td className="p-3 text-center font-mono text-slate-600 font-medium">{reg.horaFirma}</td>
                            <td className="p-3 text-center align-middle">
                              <div className="bg-slate-50 border border-slate-200/50 p-1 rounded-lg inline-block shadow-sm">
                                <img 
                                  src={reg.firmaDataUrl} 
                                  alt="Firma" 
                                  referrerPolicy="no-referrer"
                                  className="h-8 w-24 object-contain mx-auto" 
                                />
                              </div>
                            </td>
                            <td className="p-3 text-center">
                              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200 uppercase">
                                {reg.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-10 text-center space-y-2">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
                    <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wide">Sin registros de firmas</h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">Ningún técnico ha firmado la asistencia para esta charla todavía. Cambie a una cuenta de técnico para simular el firmado o haga clic en "Simular Firmas Restantes".</p>
                  </div>
                )}
              </div>

              {/* FLOW AND USABILITY FOOTER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">¿Cómo funciona el flujo de firmas?</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Cada mañana, de 08:30 a 08:35 a.m., los operarios acceden al portal con su DNI. Al firmar con su pantalla táctil o mouse, 
                      su firma manuscrita y metadatos se adhieren en tiempo real en la fila correspondiente del formato reglamentario FO-GTH-SST-09.
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Validez y Auditoría</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      El formato resultante es idéntico al documento impreso exigido por Calidad y Seguridad de la Clínica Adventista Good Hope. 
                      Puede guardarlo como PDF o imprimirlo directamente haciendo clic en el botón de impresión.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 4. ADMIN PANEL - PDF FORM PREVIEW (FO-GTH-SST-09) */}
          {usuarioActual?.rol === 'admin' && currentTab === 'pdf-preview' && (
            <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight">Vista del Formato Reglamentario</h1>
                  <p className="text-xs text-slate-500 mt-1">Este es el resultado final exacto sin cambios que requiere Calidad (Código: FO-GTH-SST-09).</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedReportTalkId}
                    onChange={(e) => setSelectedReportTalkId(e.target.value)}
                    id="pdf-talk-selector"
                    className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 shadow-sm"
                  >
                    {charlas.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.titulo}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handlePrintPdf}
                    id="print-pdf-top-btn"
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-900/10 hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <Printer className="h-4 w-4" />
                    Generar PDF / Imprimir
                  </button>
                </div>
              </div>

              {/* Informational banner about starting hours */}
              <div className="bg-sky-50 border border-sky-100 p-3.5 rounded-2xl flex items-start gap-3 text-sky-900 text-xs">
                <Clock className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold uppercase tracking-wider block text-sky-800">Parámetro Obligatorio de Horarios</span>
                  <span className="block mt-0.5 text-sky-700">El formato de charla del área de mantenimiento está configurado estrictamente con la hora de inicio de <strong>08:30 a.m. a 08:35 a.m.</strong> conforme al requerimiento corporativo.</span>
                </div>
              </div>

              {/* THE LIVE COMPONENT DISPLAY */}
              <div className="bg-slate-100 p-2 md:p-6 rounded-3xl border border-slate-200 overflow-x-auto shadow-inner">
                {selectedTalk && (
                  <FormatoPdfGoodHope 
                    charla={selectedTalk} 
                    registros={activeTalkRegistros} 
                  />
                )}
              </div>

            </div>
          )}

          {/* 5. ADMIN PANEL - MANAGE TALKS (HISTORIAL) */}
          {usuarioActual?.rol === 'admin' && currentTab === 'historial' && (
            <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight">Gestión de Charlas de 5 Minutos</h1>
                  <p className="text-xs text-slate-500 mt-1">Cree, active, edite o elimine las charlas de capacitación de su área.</p>
                </div>

                <button
                  onClick={() => setIsCreatingCharla(true)}
                  id="btn-trigger-create-talk"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <PlusCircle className="h-4 w-4" />
                  Nueva Charla de Seguridad
                </button>
              </div>

              {/* CREATE TALK MODAL PANEL */}
              {isCreatingCharla && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase">Registrar Nueva Charla</h3>
                    <button 
                      onClick={() => setIsCreatingCharla(false)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase"
                    >
                      Cancelar
                    </button>
                  </div>

                  <form onSubmit={handleCreateTalk} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Tema de la Charla</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Ej. Uso Correcto de Herramientas Eléctricas"
                        value={newCharla.titulo}
                        onChange={(e) => setNewCharla(prev => ({ ...prev, titulo: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Nombre del Expositor</label>
                      <input 
                        type="text" 
                        required 
                        value={newCharla.expositor}
                        onChange={(e) => setNewCharla(prev => ({ ...prev, expositor: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Área Responsable</label>
                      <input 
                        type="text" 
                        required 
                        value={newCharla.area}
                        onChange={(e) => setNewCharla(prev => ({ ...prev, area: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase">Fecha</label>
                        <input 
                          type="date" 
                          required 
                          value={newCharla.fecha}
                          onChange={(e) => setNewCharla(prev => ({ ...prev, fecha: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase">Hora Inicio</label>
                        <input 
                          type="text" 
                          value="08:30" 
                          disabled 
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-500 cursor-not-allowed text-center"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase">Hora Fin</label>
                        <input 
                          type="text" 
                          value="08:35" 
                          disabled 
                          className="w-full bg-slate-100 border border-slate-200 rounded-xl px-2 py-2 text-xs text-slate-500 cursor-not-allowed text-center"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Objetivo Preventivo</label>
                      <textarea 
                        required 
                        placeholder="Describa el objetivo de la capacitación..."
                        value={newCharla.objetivo}
                        onChange={(e) => setNewCharla(prev => ({ ...prev, objetivo: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 h-16 resize-none"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Riesgo Crítico Relacionado</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Ej. Descarga eléctrica, caídas, proyección de esquirlas"
                        value={newCharla.riesgoPrincipal}
                        onChange={(e) => setNewCharla(prev => ({ ...prev, riesgoPrincipal: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Puntos Principales de la Charla (1 por línea)</label>
                      <div className="space-y-2">
                        {newCharla.puntosPrincipales.map((punto, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">#{i + 1}</span>
                            <input 
                              type="text" 
                              value={punto}
                              placeholder="Ej. Usar botas dieléctricas en zonas húmedas"
                              onChange={(e) => {
                                const copy = [...newCharla.puntosPrincipales];
                                copy[i] = e.target.value;
                                setNewCharla(prev => ({ ...prev, puntosPrincipales: copy }));
                              }}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                            />
                            {newCharla.puntosPrincipales.length > 1 && (
                              <button 
                                type="button"
                                onClick={() => {
                                  const copy = newCharla.puntosPrincipales.filter((_, idx) => idx !== i);
                                  setNewCharla(prev => ({ ...prev, puntosPrincipales: copy }));
                                }}
                                className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                              >
                                Quitar
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewCharla(prev => ({ ...prev, puntosPrincipales: [...prev.puntosPrincipales, ''] }))}
                        className="text-xs text-sky-600 hover:text-sky-500 font-bold flex items-center gap-1 mt-1"
                      >
                        <PlusCircle className="h-3 w-3" />
                        Añadir punto clave
                      </button>
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm w-full"
                      >
                        Guardar y Publicar Charla
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* EDITING CHARLA MODAL */}
              {editingCharla && (
                <div className="bg-white border-2 border-sky-400 rounded-2xl shadow-md p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase">Editar Charla: {editingCharla.titulo}</h3>
                    <button 
                      onClick={() => setEditingCharla(null)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase"
                    >
                      Cerrar
                    </button>
                  </div>

                  <form onSubmit={handleUpdateTalk} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Tema de la Charla</label>
                      <input 
                        type="text" 
                        required 
                        value={editingCharla.titulo}
                        onChange={(e) => setEditingCharla(prev => prev ? { ...prev, titulo: e.target.value } : null)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Nombre del Expositor</label>
                      <input 
                        type="text" 
                        required 
                        value={editingCharla.expositor}
                        onChange={(e) => setEditingCharla(prev => prev ? { ...prev, expositor: e.target.value } : null)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Área Responsable</label>
                      <input 
                        type="text" 
                        required 
                        value={editingCharla.area}
                        onChange={(e) => setEditingCharla(prev => prev ? { ...prev, area: e.target.value } : null)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Riesgo Crítico Relacionado</label>
                      <input 
                        type="text" 
                        required 
                        value={editingCharla.riesgoPrincipal}
                        onChange={(e) => setEditingCharla(prev => prev ? { ...prev, riesgoPrincipal: e.target.value } : null)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Objetivo Preventivo</label>
                      <textarea 
                        required 
                        value={editingCharla.objetivo}
                        onChange={(e) => setEditingCharla(prev => prev ? { ...prev, objetivo: e.target.value } : null)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none h-16 resize-none"
                      />
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm w-full"
                      >
                        Actualizar Cambios de la Charla
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* LIST OF REGISTERED TALKS */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-tight">Historial de Charlas Registradas</h3>
                  <p className="text-[11px] text-slate-500">Active la charla que corresponda al día de hoy para habilitar el firmado de los técnicos.</p>
                </div>

                <div className="divide-y divide-slate-100">
                  {charlas.map(charla => {
                    const totalFirmas = registros.filter(r => r.charlaId === charla.id).length;
                    return (
                      <div key={charla.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/40 transition-all">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">{charla.titulo}</h4>
                            {charla.activo ? (
                              <span className="px-2 py-0.5 bg-sky-50 border border-sky-200 text-sky-700 text-[9px] font-black uppercase rounded-full animate-pulse">
                                Activa hoy para firmar
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 text-[9px] font-bold uppercase rounded-full">
                                Cerrada
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                            <span><strong>Expositor:</strong> {charla.expositor}</span>
                            <span><strong>Fecha:</strong> {charla.fecha}</span>
                            <span><strong>Horas:</strong> 08:30 - 08:35</span>
                            <span><strong>Registros:</strong> <strong className="text-slate-800 font-bold">{totalFirmas}</strong> firmas</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!charla.activo && (
                            <button
                              onClick={() => handleToggleActiveTalk(charla.id)}
                              id={`activate-talk-${charla.id}`}
                              className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
                            >
                              Activar como Hoy
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedReportTalkId(charla.id);
                              setCurrentTab('pdf-preview');
                            }}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                          >
                            Ver PDF FO-GTH
                          </button>

                          <button
                            onClick={() => setEditingCharla(charla)}
                            id={`edit-talk-${charla.id}`}
                            className="p-1.5 text-slate-500 hover:text-sky-600 rounded-lg hover:bg-sky-50 transition-all"
                            title="Editar charla"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteTalk(charla.id)}
                            id={`delete-talk-${charla.id}`}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all"
                            title="Eliminar charla"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* 6. ADMIN PANEL - MANAGE STAFF (USUARIOS) */}
          {usuarioActual?.rol === 'admin' && currentTab === 'usuarios' && (
            <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight">Base de Datos de Personal de Mantenimiento</h1>
                  <p className="text-xs text-slate-500 mt-1">Gestione las cuentas (DNI y Claves) que acceden al portal de firmado.</p>
                </div>

                <button
                  onClick={() => setIsCreatingUser(true)}
                  id="btn-trigger-create-user"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <UserPlus className="h-4 w-4" />
                  Agregar Nuevo Técnico
                </button>
              </div>

              {/* SEARCH FILTER */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por DNI, Nombre Completo, Cargo o Área..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 shadow-sm"
                />
              </div>

              {/* CREATE WORKER MODAL PANEL */}
              {isCreatingUser && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 uppercase">Registrar Nuevo Colaborador</h3>
                    <button 
                      onClick={() => setIsCreatingUser(false)}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase"
                    >
                      Cancelar
                    </button>
                  </div>

                  <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase">DNI del Trabajador (8 dígitos)</label>
                      <input 
                        type="text" 
                        required 
                        maxLength={8}
                        placeholder="Ej. 12345678"
                        value={newUser.dni}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setNewUser(prev => ({ ...prev, dni: val, clave: val })); // Password defaults to DNI for ease!
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                      <span className="text-[10px] text-slate-400 block">La contraseña inicial se configurará igual al DNI automáticamente.</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Apellidos y Nombres Completos</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Ej. Pérez Ramírez, Juan"
                        value={newUser.nombreCompleto}
                        onChange={(e) => setNewUser(prev => ({ ...prev, nombreCompleto: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Área de Mantenimiento</label>
                      <select
                        value={newUser.area}
                        onChange={(e) => setNewUser(prev => ({ ...prev, area: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      >
                        <option value="Mantenimiento Eléctrico">Mantenimiento Eléctrico</option>
                        <option value="Mantenimiento Mecánico">Mantenimiento Mecánico</option>
                        <option value="Mantenimiento HVAC">Mantenimiento HVAC</option>
                        <option value="Mantenimiento Preventivo">Mantenimiento Preventivo</option>
                        <option value="Mantenimiento de Soldadura">Mantenimiento de Soldadura</option>
                        <option value="Mantenimiento General">Mantenimiento General</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Cargo del Colaborador</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Ej. Técnico Electricista, Auxiliar"
                        value={newUser.cargo}
                        onChange={(e) => setNewUser(prev => ({ ...prev, cargo: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Rol en el Sistema</label>
                      <select
                        value={newUser.rol}
                        onChange={(e) => setNewUser(prev => ({ ...prev, rol: e.target.value as 'admin' | 'staff' }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      >
                        <option value="staff">Técnico (Firma Charlas)</option>
                        <option value="admin">Supervisor (Control / PDF)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 uppercase">Contraseña Personalizada</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="Mínimo 4 caracteres"
                        value={newUser.clave}
                        onChange={(e) => setNewUser(prev => ({ ...prev, clave: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-sm w-full"
                      >
                        Guardar Colaborador en Base de Datos
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* LIST OF WORKERS */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-950 uppercase tracking-tight">Colaboradores Registrados ({usuarios.length})</h3>
                  <p className="text-[11px] text-slate-500">Muestra los datos de accesos. Utilice el buscador para localizar un colaborador rápidamente.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                        <th className="p-3">DNI</th>
                        <th className="p-3">Nombre Completo</th>
                        <th className="p-3">Área de Trabajo</th>
                        <th className="p-3">Cargo</th>
                        <th className="p-3">Rol</th>
                        <th className="p-3">Clave de Acceso</th>
                        <th className="p-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPersonal.map((user) => (
                        <tr key={user.dni} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 font-mono font-bold text-slate-700">{user.dni}</td>
                          <td className="p-3 font-semibold text-slate-900 uppercase">{user.nombreCompleto}</td>
                          <td className="p-3 text-slate-600">{user.area}</td>
                          <td className="p-3 text-slate-600">{user.cargo}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full border uppercase ${
                              user.rol === 'admin' 
                                ? 'bg-sky-50 text-sky-700 border-sky-200' 
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                              {user.rol === 'admin' ? 'Supervisor' : 'Técnico'}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                              <Lock className="h-3 w-3 text-slate-400" />
                              <span>{user.clave}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            {user.dni !== '99999999' ? (
                              <button
                                onClick={() => handleDeleteUser(user.dni)}
                                id={`delete-user-${user.dni}`}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                title="Eliminar Colaborador"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Protegido</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* 7. ADMIN PANEL - DIRECT ATTENDANCE & SIGNING FOR OPERATORS */}
          {usuarioActual?.rol === 'admin' && currentTab === 'asistencia-directa' && (
            <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
              
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-tight">Registro Directo de Asistencias y Firmas</h1>
                  <p className="text-xs text-slate-500 mt-1">Marque la asistencia y firme directamente para cada operario de la plantilla en la charla activa.</p>
                </div>
              </div>

              {/* ACTIVE TALK BANNER */}
              {activeTalk ? (
                <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full uppercase">Charla de 5 Minutos Activa Hoy</span>
                    <span className="text-xs font-semibold text-slate-400">Hora programada: <strong className="text-white font-black">08:30 - 08:35 AM</strong></span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-sky-400 uppercase tracking-tight">{activeTalk.titulo}</h3>
                    <p className="text-xs text-slate-300 mt-1"><strong>Expositor/Tutor:</strong> {activeTalk.expositor} | <strong>Fecha:</strong> {activeTalk.fecha} | <strong>Área:</strong> {activeTalk.area}</p>
                  </div>
                  <div className="w-full bg-slate-800/60 h-[1px] my-1"></div>
                  <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-[11px] text-slate-400">
                    <div>Asistentes: <strong className="text-emerald-400 font-bold">{totalAsistentes}</strong></div>
                    <div>Faltantes: <strong className="text-rose-400 font-bold">{totalAusentes}</strong></div>
                    <div>Tasa de Asistencia: <strong className="text-sky-400 font-bold">{porcentajeAsistencia}%</strong></div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span>No hay charlas registradas. Vaya a <strong>Gestión de Charlas</strong> para crear una charla antes de tomar asistencia.</span>
                </div>
              )}

              {/* SEARCH FILTER */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar operarios por DNI, Nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 shadow-sm"
                />
              </div>

              {/* TABLE OF WORKERS AND DIRECT ACTIONS */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 uppercase tracking-tight">Plantilla de Operarios de Mantenimiento</h3>
                    <p className="text-[11px] text-slate-500">Muestra a los colaboradores y su estado de firmado actual para la charla seleccionada.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                        <th className="p-3 text-center w-12">#</th>
                        <th className="p-3">DNI</th>
                        <th className="p-3">Nombre Completo</th>
                        <th className="p-3">Área de Mantenimiento</th>
                        <th className="p-3">Cargo del Puesto</th>
                        <th className="p-3 text-center">Estado de Firma</th>
                        <th className="p-3 text-center">Firma Digital</th>
                        <th className="p-3 text-center">Acciones Directas</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usuarios.filter(u => u.rol === 'staff' && (
                        u.nombreCompleto.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        u.dni.includes(searchQuery)
                      )).map((user, index) => {
                        const registro = registros.find(r => r.charlaId === activeTalk?.id && r.userDni === user.dni);
                        const tieneFirma = !!registro;

                        return (
                          <tr key={user.dni} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3 text-center font-bold text-slate-400">{index + 1}</td>
                            <td className="p-3 font-mono font-bold text-slate-700">{user.dni}</td>
                            <td className="p-3 font-semibold text-slate-900 uppercase">{user.nombreCompleto}</td>
                            <td className="p-3 text-slate-600">{user.area}</td>
                            <td className="p-3 text-slate-600">{user.cargo}</td>
                            <td className="p-3 text-center">
                              {tieneFirma ? (
                                <div className="space-y-0.5">
                                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-200 uppercase">
                                    Firmado
                                  </span>
                                  <div className="text-[9px] text-slate-400 font-medium">{registro.horaFirma}</div>
                                </div>
                              ) : (
                                <span className="px-2.5 py-1 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full border border-rose-200 uppercase">
                                  Pendiente
                                  </span>
                              )}
                            </td>
                            <td className="p-3 text-center align-middle">
                              {tieneFirma ? (
                                <div className="bg-slate-50 border border-slate-200/50 p-1 rounded-lg inline-block shadow-sm">
                                  <img 
                                    src={registro.firmaDataUrl} 
                                    alt="Firma" 
                                    referrerPolicy="no-referrer"
                                    className="h-7 w-20 object-contain mx-auto" 
                                  />
                                </div>
                              ) : (
                                <span className="text-slate-400 italic text-[10px]">-</span>
                              )}
                            </td>
                            <td className="p-3 text-center">
                              {tieneFirma ? (
                                <button
                                  onClick={() => handleRemoveAttendance(user.dni)}
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  Borrar Firma
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedWorkerToSign(user);
                                    setDirectSignatureData('');
                                    setIsConfirmingDirectRead(false);
                                  }}
                                  className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-[10px] font-bold shadow-sm transition-all cursor-pointer inline-flex items-center gap-1"
                                >
                                  <PenTool className="h-3 w-3" />
                                  Firmar Aquí
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DIRECT SIGNATURE MODAL OVERLAY */}
              {selectedWorkerToSign && (
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in">
                  <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
                    
                    {/* Modal Header */}
                    <div className="bg-[#0c1e35] p-5 text-white flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wide">Firma Directa de Asistencia</h3>
                        <p className="text-[10px] text-sky-300 mt-0.5">Charla activa: {activeTalk?.titulo}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedWorkerToSign(null)}
                        className="text-white hover:text-slate-200 text-xs uppercase font-bold"
                      >
                        Cerrar
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-5 space-y-4">
                      
                      {/* Worker Metadata Summary */}
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-left space-y-1">
                        <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Colaborador Seleccionado</span>
                        <div className="text-sm font-bold text-slate-900 uppercase">{selectedWorkerToSign.nombreCompleto}</div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 mt-1 pt-1.5 border-t border-slate-200/60">
                          <div><strong>DNI:</strong> {selectedWorkerToSign.dni}</div>
                          <div><strong>Cargo:</strong> {selectedWorkerToSign.cargo}</div>
                        </div>
                      </div>

                      {/* Signature Area */}
                      <div className="space-y-1.5">
                        <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Firma Digital del Colaborador</span>
                        <SignaturePad 
                          onSave={(dataUrl) => setDirectSignatureData(dataUrl)} 
                          onClear={() => setDirectSignatureData('')} 
                        />
                      </div>

                      {/* Confirmation Checkbox */}
                      <label className="flex items-start gap-3 p-3 bg-sky-50/50 hover:bg-sky-50 border border-sky-100 rounded-xl cursor-pointer transition-all">
                        <input 
                          type="checkbox" 
                          checked={isConfirmingDirectRead}
                          onChange={(e) => setIsConfirmingDirectRead(e.target.checked)}
                          className="mt-1 h-4 w-4 text-sky-600 border-sky-300 rounded focus:ring-sky-500 cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-600 leading-normal font-medium">
                          Certifico que el operario asistió y firmó en la mesa de control de mantenimiento para la charla de hoy.
                        </span>
                      </label>

                    </div>

                    {/* Modal Footer */}
                    <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                      <button
                        onClick={() => setSelectedWorkerToSign(null)}
                        className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveDirectAttendance}
                        disabled={!directSignatureData || !isConfirmingDirectRead}
                        className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow transition-all cursor-pointer flex items-center gap-1.5 ${
                          directSignatureData && isConfirmingDirectRead
                            ? 'bg-emerald-600 hover:bg-emerald-500'
                            : 'bg-slate-300 cursor-not-allowed shadow-none'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                        Registrar Asistencia
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
