import { useState, useEffect, useRef, useMemo } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import {
  useConversaciones,
  useMensajes,
  useEnviarMensaje,
} from "@/features/mensajes/useMensajes";
import {
  MessageSquare,
  Send,
  Loader2,
  Search,
  Users,
  Building2,
  User,
  Check,
  CheckCheck,
  Activity,
  Clock,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { useChatsGrupo, useMensajesGrupo, useEnviarMensajeGrupo } from "@/features/chat-grupal/useChatGrupal";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";

const FONT = "'Angro Std', 'Outfit', sans-serif";

/* =========================================
   TEXTOS ORIGINALES INTACTOS (INFO SISTEMA)
========================================= */
function InfoSistema({ tipo }) {
  const texto =
    tipo === "EQUIPO"
      ? "Chat de equipo · Solo visible para los estudiantes del proyecto. Coordinen sus entregables y recuerden votar por su delegado."
      : tipo === "PROYECTO"
      ? "Chat del proyecto · Espacio para que el equipo se comunique con la MYPE."
      : "Chat directo · Comunicación entre el estudiante y la MYPE.";

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "24px 0 32px" }}>
      <div
        style={{
          borderTop: "1px dashed #E2E8F0",
          borderBottom: "1px dashed #E2E8F0",
          padding: "10px 16px",
          width: "100%",
          maxWidth: "600px",
          textAlign: "center"
        }}
      >
        <p
          style={{
            fontFamily: FONT,
            fontSize: 11,
            color: "#64748B",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            margin: 0,
            lineHeight: 1.6
          }}
        >
          {texto}
        </p>
      </div>
    </div>
  );
}

/* =========================================
   REDISEÑO CORPORATIVO: HILO EMPRESARIAL
========================================= */
function BurbujaEmpresarial({ mensaje, mypeNombre }) {
  const isMine = mensaje.esMio;
  const horaFormat = new Date(mensaje.fechaEnvio).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit"
  });
  
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        marginBottom: 12, // ← antes 16
        padding: "0 8%"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "750px", // ← antes 850px
          position: "relative",
          borderRadius: 6,
          background: isMine ? "#FFFFFF" : "#F8FAFC",
          borderLeft: isMine ? "3px solid #0F1F3D" : "3px solid #94A3B8",
          borderTop: "1px solid #E2E8F0",
          borderRight: "1px solid #E2E8F0",
          borderBottom: "1px solid #E2E8F0",
          boxShadow: isMine ? "0 2px 8px rgba(15,31,61,0.03)" : "none", // ← antes 4px
          padding: "12px 16px", // ← antes 16px 20px
          transition: "transform 0.2s ease",
          cursor: "default"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6 // ← antes 8
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}> {/* ← antes 10 */}
            {/* Avatar más pequeño */}
            <div style={{
              width: 24, height: 24, // ← antes 28
              borderRadius: 4, 
              background: isMine ? "#0F1F3D" : "#E2E8F0",
              color: isMine ? "#FFF" : "#0F1F3D", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: 9, // ← antes 10
              fontWeight: 800, 
              fontFamily: FONT
            }}>
              {isMine ? "MY" : "EST"}
            </div>
            <p
              style={{
                fontFamily: FONT, 
                fontSize: 12, // ← antes 13
                fontWeight: 700, 
                color: isMine ? "#0F1F3D" : "#334155", 
                margin: 0
              }}
            >
              {isMine ? (mypeNombre || "Representante (Tú)") : (mensaje.remitenteNombre || "Estudiante")}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}> {/* ← antes 8 */}
            <span style={{ fontFamily: FONT, fontSize: 10, color: "#94A3B8", fontWeight: 500 }}> {/* ← antes 11 */}
              {horaFormat}
            </span>
            {isMine && (
              <span title={mensaje.leido ? "Visualizado" : "Recibido"}>
                {mensaje.leido ? (
                  <CheckCheck size={14} color="#059669" /> // ← antes 16
                ) : (
                  <Check size={14} color="#CBD5E1" /> // ← antes 16
                )}
              </span>
            )}
          </div>
        </div>

        <p
          style={{
            fontFamily: FONT,
            fontSize: 13, // ← antes 14
            fontWeight: 400,
            color: "#334155",
            margin: "6px 0 0 32px", // ← antes 10px 0 0 38px
            lineHeight: 1.5, // ← antes 1.6
            whiteSpace: "pre-wrap",
            wordBreak: "break-word"
          }}
        >
          {mensaje.mensaje}
        </p>
      </div>
    </div>
  );
}

/* =========================================
   LÓGICA FORMATO FECHA EXACTA MANTENIDA
========================================= */
function formatHoraLista(fecha) {
  if (!fecha) return "";
  const d = new Date(fecha);
  const hoy = new Date();
  const mismoDia = d.toDateString() === hoy.toDateString();
  return mismoDia
    ? d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit" });
}

function timeSince(dateObj) {
  if (!dateObj) return "Sin actividad";
  const minutes = Math.floor((new Date() - dateObj) / 60000);
  if (minutes < 1) return "Justo ahora";
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} hr`;
  const days = Math.floor(hours / 24);
  return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
}

/* =========================================
   PANTALLA PRINCIPAL: MANTENIMIENTO ESTRUCTURA DATOS
========================================= */
export function MensajesPage() {
  const { conversaciones, isLoading: loadingConversaciones } = useConversaciones();
  const { proyectos } = useMisProyectos();
  const [searchTerm, setSearchTerm] = useState("");
  const [chatSel, setChatSel] = useState(null);

  const idParaListar = conversaciones?.[0]?.proyectoId || proyectos?.[0]?.id || null;
  const { chats: chatsGrupales } = useChatsGrupo(idParaListar);

  const esPrivada = chatSel?.tipo === "PRIVADA";

  const convId = esPrivada ? chatSel.id : null;
  const { mensajes: mensajes1v1, isLoading: loading1v1 } = useMensajes(convId);
  const { enviar: enviar1v1, isLoading: enviando1v1 } = useEnviarMensaje(convId);

  const grupoProyectoId = !esPrivada ? chatSel?.proyectoId : null;
  const grupoChatId = !esPrivada ? chatSel?.id : null;
  const { mensajes: mensajesGrupo, isLoading: loadingGrupo } = useMensajesGrupo(grupoProyectoId, grupoChatId);
  const { enviar: enviarGrupo, isEnviando: enviandoGrupo } = useEnviarMensajeGrupo(grupoProyectoId, grupoChatId);

  const proyectosConDirecto = new Set((conversaciones || []).map((c) => c.proyectoId));
  const grupalesVisibles = (chatsGrupales || []).filter((c) => {
    const equipoDeUno = (c.totalMiembros ?? 99) <= 2;
    const tieneDirecto = proyectosConDirecto.has(c.proyectoId);
    return !(equipoDeUno && tieneDirecto);
  });

  const allChats = useMemo(() => [
    ...(conversaciones || []).map((c) => ({
      tipo: "PRIVADA",
      id: c.id,
      proyectoId: c.proyectoId,
      label: c.estudianteNombre,
      subtitulo: c.proyectoTitulo || "Atención directa de seguimiento",
      ultimoMensaje: c.ultimoMensaje,
      fechaUltimoMensaje: c.fechaUltimoMensaje,
      noLeidos: c.noLeidos || 0,
      totalMiembros: 2, // Representativo
    })),
    ...grupalesVisibles.map((c) => ({
      tipo: c.tipo,
      id: c.id,
      proyectoId: c.proyectoId,
      label: c.nombre || (c.tipo === "EQUIPO" ? "Gestión de Equipo" : "Coordinación Proyecto"),
      subtitulo: c.tipo === "EQUIPO" ? "Comunicaciones Operativas" : (c.proyectoTitulo || "Coordinación Ejecutiva MYPE-Talento"),
      ultimoMensaje: c.ultimoMensaje,
      fechaUltimoMensaje: c.fechaUltimoMensaje,
      noLeidos: c.mensajesNoLeidos ?? 0,
      totalMiembros: c.totalMiembros,
    })),
  ], [conversaciones, grupalesVisibles]);

  useEffect(() => {
    if (!chatSel && allChats.length > 0) setChatSel(allChats[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allChats.length]);

  const filteredChats = allChats.filter((c) =>
    c.label?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.subtitulo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnviar = (texto) => (esPrivada ? enviar1v1(texto) : enviarGrupo(texto));

  const currentData = {
    mensajes: esPrivada ? (mensajes1v1 || []) : (mensajesGrupo || []),
    nombre: chatSel?.label,
  };
  const currentLoading = esPrivada ? loading1v1 : loadingGrupo;
  const currentEnviando = esPrivada ? enviando1v1 : enviandoGrupo;
  const mypeNombre = "Representante";

  // Panel Inteligente Cálculo Variables sin APIs extra
  const [textoInbound, setTextoInbound] = useState("");
  const bottomRef = useRef(null);
  
  useEffect(() => { 
    if(!currentLoading) bottomRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [currentData.mensajes, currentLoading]);

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if (!textoInbound.trim() || currentEnviando) return; 
    handleEnviar(textoInbound.trim()); 
    setTextoInbound(""); 
  };

  const currentMsgsLength = currentData.mensajes.length;
  const msgUltimo = currentMsgsLength > 0 ? currentData.mensajes[currentMsgsLength - 1] : null;
  const fechaRecienteObj = msgUltimo ? new Date(msgUltimo.fechaEnvio) : null;
  
  // Lógica Estado Acción: Quién mandó el último define de quién es la 'pelota' en la cancha
  const necesitaRespuestaMYPE = msgUltimo && !msgUltimo.esMio;
  
  return (
    <MypeLayout titulo="Centro de Mensajes">
      <style>{`
        @keyframes customSpin { from {transform: rotate(0deg)} to {transform: rotate(360deg)} }
        @keyframes customPulse { 0%,100%{opacity:1} 50%{opacity:.6} }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
        input::placeholder, textarea::placeholder { color: #94A3B8; }
      `}</style>
      
      {loadingConversaciones ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[1,2,3].map((i) => (<div key={i} style={{ height: 96, borderRadius: 6, background: "#F1F5F9", border: "1px solid #E2E8F0", animation: "customPulse 2s ease-in-out infinite" }} />))}
        </div>
      ) : allChats.length === 0 ? (
        <div style={{ textAlign: "center", padding: "100px 40px", border: "1px dashed #CBD5E1", borderRadius: "20px", background: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <MessageSquare size={48} color="#CBD5E1" strokeWidth={1} style={{ marginBottom: 20 }} />
          <h3 style={{ margin: "0 0 8px 0", fontFamily: FONT, fontSize: 18, fontWeight: 500, color: "#0F1F3D" }}>
            Sin conversaciones activas
          </h3>
          <p style={{ margin: 0, fontFamily: FONT, fontSize: 14, color: "#64748B", maxWidth: 450, lineHeight: 1.6 }}>
            Cuando tengas proyectos activos, los mensajes aparecerán aquí.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", height: "calc(100vh - 120px)", background: "#FFF", borderRadius: 8, border: "1px solid #E2E8F0", boxShadow: "0 1px 12px rgba(15,31,61,0.04), 0 1px 3px rgba(15,31,61,0.02)", overflow: "hidden" }}>
          
          {/* ==============================================
              PANEL 1: PORTAFOLIO DE PROYECTOS (IZQUIERDA) 
          ===============================================*/}
          <div style={{ width: 340, borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column", flexShrink: 0, background: "#FAFAFA" }}>
            <div style={{ padding: "20px 24px", background: "#FFFFFF", borderBottom: "1px solid #E2E8F0", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontFamily: FONT, fontSize: 15, fontWeight: 800, color: "#0F1F3D", letterSpacing: "-0.02em", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                 
                  Conversaciones
                </h2>
                <span style={{ background: "#E2E8F0", color: "#334155", fontFamily: FONT, fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 12 }}>
                  {allChats.length} ACTIVOS
                </span>
              </div>
              
              <div style={{ position: "relative" }}>
                <Search size={14} color="#94A3B8" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input type="text" placeholder="Filtrar por proyecto, integrante o estado..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 4, fontFamily: FONT, fontSize: 12, border: "1px solid #CBD5E1", outline: "none", background: "#FFF", color: "#0F1F3D", boxSizing: "border-box", transition: "all 0.2s" }}
                  onFocus={(e) => (e.target.style.borderColor = "#0F1F3D", e.target.style.boxShadow = "0 0 0 3px rgba(15,31,61,0.05)")}
                  onBlur={(e) => (e.target.style.borderColor = "#CBD5E1", e.target.style.boxShadow = "none")}
                />
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
              {filteredChats.map((c) => {
                const isActive = chatSel?.tipo === c.tipo && chatSel?.id === c.id;
                const tieneNoLeidos = c.noLeidos > 0 && !isActive;
                
                const typeInfo = c.tipo === "EQUIPO" ? { ic: Users, clr: "#0EA5E9" } :
                                 c.tipo === "PROYECTO" ? { ic: Building2, clr: "#6366F1" } : 
                                 { ic: User, clr: "#059669" };

                return (
                  <button key={`${c.tipo}-${c.id}`} onClick={() => setChatSel(c)}
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: 6,
                      background: isActive ? "#FFFFFF" : "transparent",
                      border: isActive ? "1px solid #E2E8F0" : "1px solid transparent",
                      boxShadow: isActive ? "0 2px 8px rgba(0,0,0,0.03)" : "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#F1F5F9"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                    
                    {/* Indicador Izquierdo de Actividad Pendiente */}
                    {tieneNoLeidos && (
                      <div style={{ position: "absolute", left: -6, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, background: "#EF4444", borderRadius: 3 }} />
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: isActive ? 800 : 600, color: "#0F1F3D", margin: 0, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, paddingRight: 10 }}>
                        {c.label}
                      </p>
                      <span style={{ fontFamily: FONT, fontSize: 10, color: tieneNoLeidos ? "#EF4444" : "#94A3B8", fontWeight: tieneNoLeidos ? 800 : 500, flexShrink: 0, textTransform: "uppercase" }}>
                        {formatHoraLista(c.fechaUltimoMensaje) || "N/D"}
                      </span>
                    </div>
                    
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                       <typeInfo.ic size={12} color={typeInfo.clr} />
                       <span style={{ fontFamily: FONT, fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.03em" }}>{c.subtitulo}</span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontFamily: FONT, fontSize: 12, color: tieneNoLeidos ? "#0F1F3D" : "#64748B", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {c.ultimoMensaje || <span style={{ fontStyle: "italic", color: "#94A3B8" }}>Sin mensajes aún.</span>}
                      </p>
                      {tieneNoLeidos && (
                         <div style={{ background: "#FEE2E2", color: "#B91C1C", border: "1px solid #FECACA", fontSize: 9, fontWeight: 800, padding: "2px 6px", borderRadius: 4, fontFamily: FONT }}>
                           REQUERIDO
                         </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* ==============================================
              PANEL 2: GESTOR DE REGISTROS CONVERSACIONAL (CENTRO) 
          ===============================================*/}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF", position: "relative" }}>
            {chatSel ? (
              <>
                <div style={{ padding: "20px 32px", borderBottom: "1px solid #E2E8F0", background: "#FFF", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexShrink: 0 }}>
                  <div>
                    <span style={{ fontFamily: FONT, fontSize: 10, color: "#64748B", letterSpacing: "0.05em", fontWeight: 600, display: "flex", gap: 4, alignItems: "center", marginBottom: 6 }}>
                        Espacio de desarrollo empresarial
                    </span>
                    <h1 style={{ fontFamily: FONT, fontSize: 15, fontWeight: 800, color: "#0F1F3D", margin: 0, letterSpacing: "-0.01em" }}>
                      {chatSel.label || "Tablero sin Asignación"}
                    </h1>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", background: "#FFFFFF" }}>
                  <InfoSistema tipo={chatSel.tipo} />
                  
                  {currentLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 100, flexDirection: "column", gap: 12 }}>
                      <Loader2 size={24} color="#0F1F3D" style={{ animation: "customSpin 1s linear infinite" }} />
                      <p style={{ fontFamily: FONT, fontSize: 12, color: "#64748B", fontWeight: 600 }}>Cargando mensajes...</p>
                    </div>
                  ) : currentData.mensajes.length === 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "40%" }}>
                       
                    </div>
                  ) : (
                    currentData.mensajes.map((msg, idx) => (
                      <BurbujaEmpresarial key={msg.id || idx} mensaje={msg} mypeNombre={mypeNombre} />
                    ))
                  )}
                  <div ref={bottomRef} style={{ height: 20 }} />
                </div>

                {/* Zona Formulario Control Ejecutiva */}
                <form onSubmit={handleSubmit} style={{ padding: "16px 32px 24px", borderTop: "1px solid #E2E8F0", background: "#FAFAFA", flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, color: "#64748B", textTransform: "uppercase", margin: 0 }}>Escribir mensaje</p>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
                    <div style={{ flex: 1, background: "#FFF", borderRadius: 4, border: "1px solid #CBD5E1", padding: "12px", transition: "all 0.2s" }}
                         onFocus={(e) => {e.currentTarget.style.borderColor = "#0F1F3D"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(15,31,61,0.05)"}}
                         onBlur={(e) => {e.currentTarget.style.borderColor = "#CBD5E1"; e.currentTarget.style.boxShadow = "none"}}>
                      <textarea
                        value={textoInbound}
                        onChange={(e) => setTextoInbound(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                        placeholder="Escriba su mensaje aquí..."
                        style={{ width: "100%", minHeight: "44px", border: "none", outline: "none", resize: "none", fontFamily: FONT, fontSize: 14, lineHeight: 1.5, color: "#0F1F3D", background: "transparent", boxSizing: "border-box" }}
                        rows={1}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={!textoInbound.trim() || currentEnviando}
                      style={{
                        height: "70px", width: "90px",
                        padding: "0 16px",
                        background: textoInbound.trim() ? "#0F1F3D" : "#E2E8F0",
                        color: textoInbound.trim() ? "#FFF" : "#94A3B8",
                        border: "none", borderRadius: 4, cursor: textoInbound.trim() ? "pointer" : "not-allowed",
                        fontFamily: FONT, fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.03em",
                        transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 6, alignItems: "center", justifyContent: "center"
                      }}>
                      {currentEnviando ? (
                         <Loader2 size={20} style={{ animation: "customSpin 1s linear infinite" }} />
                      ) : (
                        <>
                           <Send size={18} strokeWidth={2.5} />
                           Enviar
                        </>
                      )}
                    </button>
                  </div>
                  <span style={{ fontFamily: FONT, fontSize: 10, color: "#94A3B8" }}>Presione ENTER para enviar. SHIFT+ENTER para línea nueva. No se permiten archivos adjuntos </span>
                </form>
              </>
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#FAFAFA" }}>
                 <p style={{ fontFamily: FONT, fontSize: 16, color: "#64748B", fontWeight: 500 }}>Haga clic en un registro a la izquierda para cargar información</p>
              </div>
            )}
          </div>

          {/* ==============================================
              PANEL 3: INTELIGENCIA CONVERSACIONAL (DERECHA) 
          ===============================================*/}
          {chatSel && (
            <div style={{ width: 280, borderLeft: "1px solid #E2E8F0", display: "flex", flexDirection: "column", flexShrink: 0, background: "#FFFFFF" }}>
              <div style={{ padding: "20px", borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                <h3 style={{ fontFamily: FONT, fontSize: 13, fontWeight: 800, color: "#0F1F3D", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.03em", display: "flex", alignItems: "center", gap: 6 }}>
                   Información del chat
                </h3>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px" }}>
                
                {/* Bloque: Resumen Operativo */}
                <div style={{ marginBottom: 32 }}>
                  <span style={{ fontFamily: FONT, fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 12 }}>
                    Tipo de conversación
                  </span>
                  
                  <div style={{ background: "#F1F5F9", borderRadius: 4, padding: "12px", borderLeft: "3px solid #0EA5E9", display: "flex", flexDirection: "column", gap: 4 }}>
                    <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: "#0F1F3D", margin: 0 }}>Tipología</p>
                    <p style={{ fontFamily: FONT, fontSize: 12, color: "#334155", margin: 0, textTransform: "capitalize" }}>
                      {chatSel.tipo === "PRIVADA" ? "Seguimiento 1-a-1" : 
                       chatSel.tipo === "EQUIPO" ? "Gestión Interna Equipo" : "Coordinación Global Empresarial"}
                    </p>
                  </div>
                  
                  <div style={{ marginTop: 12, borderTop: "1px dashed #E2E8F0", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontFamily: FONT, fontSize: 12, color: "#64748B", margin: 0, fontWeight: 500 }}>Participantes</p>
                    <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 800, color: "#0F1F3D", margin: 0 }}>{chatSel.totalMiembros || 1}</p>
                  </div>
                </div>

                {/* Bloque: Telemetría Transaccional */}
                <div style={{ marginBottom: 32 }}>
                  <span style={{ fontFamily: FONT, fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 12 }}>
                    Resumen de actividad
                  </span>
                  
                  <div style={{ border: "1px solid #E2E8F0", borderRadius: 6, overflow: "hidden" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: "1px solid #E2E8F0", background: "#FFF" }}>
                        <Clock size={16} color="#94A3B8" />
                        <div>
                          <p style={{ fontFamily: FONT, fontSize: 11, color: "#64748B", margin: "0 0 2px" }}>Último mensaje</p>
                          <p style={{ fontFamily: FONT, fontSize: 13, color: "#0F1F3D", fontWeight: 700, margin: 0 }}>
                            {timeSince(fechaRecienteObj)}
                          </p>
                        </div>
                     </div>
                     <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#FFF" }}>
                        <MessageSquare size={16} color="#94A3B8" />
                        <div>
                          <p style={{ fontFamily: FONT, fontSize: 11, color: "#64748B", margin: "0 0 2px" }}>Total de mensajes</p>
                          <p style={{ fontFamily: FONT, fontSize: 13, color: "#0F1F3D", fontWeight: 700, margin: 0 }}>
                            {currentMsgsLength} anotaciones
                          </p>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Bloque: Status Acción (Semáforo Inteligente) */}
                <div>
                  <span style={{ fontFamily: FONT, fontSize: 10, color: "#64748B", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: 12 }}>
                    Estado de la conversación
                  </span>

                  {currentMsgsLength === 0 ? (
                     <div style={{ display: "flex", gap: 12, padding: "14px", background: "#F1F5F9", borderRadius: 4, alignItems: "center" }}>
                        <AlertCircle size={20} color="#64748B" />
                        <p style={{ fontFamily: FONT, fontSize: 12, color: "#334155", margin: 0, fontWeight: 600, lineHeight: 1.4 }}>Sin mensajes aún, puede comenzar.</p>
                     </div>
                  ) : necesitaRespuestaMYPE ? (
                     <div style={{ display: "flex", gap: 12, padding: "14px", background: "#FEF2F2", borderRadius: 4, alignItems: "center", border: "1px solid #FECACA" }}>
                        <div style={{ width: 8, height: 8, borderRadius: 4, background: "#EF4444", flexShrink: 0, animation: "customPulse 2s infinite" }} />
                        <p style={{ fontFamily: FONT, fontSize: 12, color: "#991B1B", margin: 0, fontWeight: 600, lineHeight: 1.4 }}>	Requiere respuesta.<br/><span style={{ fontWeight: 400 }}>Mensaje sin respuesta por el estudiante/equipo.</span></p>
                     </div>
                  ) : (
                     <div style={{ display: "flex", gap: 12, padding: "14px", background: "#F0FDF4", borderRadius: 4, alignItems: "center", border: "1px solid #BBF7D0" }}>
                        <CheckCheck size={20} color="#16A34A" flexShrink={0} />
                        <p style={{ fontFamily: FONT, fontSize: 12, color: "#166534", margin: 0, fontWeight: 600, lineHeight: 1.4 }}>Mensaje respondido.<br/><span style={{ fontWeight: 400 }}>Última emisión delegada de forma eficiente.</span></p>
                     </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </MypeLayout>
  );
}