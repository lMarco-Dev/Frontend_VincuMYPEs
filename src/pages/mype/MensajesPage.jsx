import { useState, useEffect, useRef } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import {
  useConversaciones,
  useMensajes,
  useEnviarMensaje,
} from "@/features/mensajes/useMensajes";
import {
  MessageSquare, Send, Loader2, Search,
  Users, Building2, User, CheckCircle2,
} from "lucide-react";
import { useChatsGrupo, useMensajesGrupo, useEnviarMensajeGrupo } from "@/features/chat-grupal/useChatGrupal";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";

const FONT = "'Angro Std', 'Outfit', sans-serif";

function Burbuja({ mensaje, mypeNombre }) {
  const hora = new Date(mensaje.fechaEnvio).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  return (
    <div style={{ display: "flex", justifyContent: mensaje.esMio ? "flex-end" : "flex-start", marginBottom: 6 }}>
      <div style={{ maxWidth: "70%", padding: "10px 14px", borderRadius: mensaje.esMio ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: mensaje.esMio ? "linear-gradient(135deg, #1B6FE8, #0E54C4)" : "#fff", border: mensaje.esMio ? "none" : "1px solid #e5e7eb", color: mensaje.esMio ? "#fff" : "#0F1F3D", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
        {!mensaje.esMio && <p style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, color: "#1B6FE8", margin: "0 0 3px" }}>{mensaje.remitenteNombre || mypeNombre}</p>}
        <p style={{ fontFamily: FONT, fontSize: 13, margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{mensaje.mensaje}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end", marginTop: 4 }}>
          <span style={{ fontFamily: FONT, fontSize: 10, color: mensaje.esMio ? "rgba(255,255,255,0.6)" : "#9CA3AF" }}>{hora}</span>
          {mensaje.esMio && <CheckCircle2 size={10} color="rgba(255,255,255,0.6)" />}
        </div>
      </div>
    </div>
  );
}

function ChatPanel({ tipo, data, mypeNombre, onEnviar, isEnviando, isLoading }) {
  const [texto, setTexto] = useState("");
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [data?.mensajes]);

  const handleEnviar = (e) => { e.preventDefault(); if (!texto.trim() || isEnviando) return; onEnviar(texto.trim()); setTexto(""); };

  const getIcon = () => {
    if (tipo === "EQUIPO") return <Users size={18} color="#1D4ED8" />;
    if (tipo === "PROYECTO") return <Building2 size={18} color="#7C3AED" />;
    return <User size={18} color="#059669" />;
  };
  const getBg = () => {
    if (tipo === "EQUIPO") return "linear-gradient(135deg, #EFF6FF, #DBEAFE)";
    if (tipo === "PROYECTO") return "linear-gradient(135deg, #F5F3FF, #EDE9FE)";
    return "linear-gradient(135deg, #ECFDF5, #D1FAE5)";
  };
  const getBorder = () => {
    if (tipo === "EQUIPO") return "2px solid #BFDBFE";
    if (tipo === "PROYECTO") return "2px solid #DDD6FE";
    return "2px solid #A7F3D0";
  };
  const mensajes = data?.mensajes || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: getBg(), border: getBorder(), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{getIcon()}</div>
        <div>
          <p style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "#0F1F3D", margin: 0 }}>{data?.nombre || data?.estudianteNombre || "Chat"}</p>
          <p style={{ fontFamily: FONT, fontSize: 11, color: "#9CA3AF", margin: "2px 0 0" }}>{tipo === "EQUIPO" ? "Solo estudiantes" : tipo === "PROYECTO" ? "Equipo + MYPE" : "Chat directo"}</p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", background: "#f8fafc" }}>
        {isLoading ? <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}><Loader2 size={24} color="#9CA3AF" style={{ animation: "spin 1s linear infinite" }} /></div>
        : mensajes.length === 0 ? <div style={{ textAlign: "center", paddingTop: 60 }}><div style={{ width: 56, height: 56, borderRadius: 16, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><MessageSquare size={24} color="#d1d5db" /></div><p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#9CA3AF" }}>No hay mensajes aún</p></div>
        : mensajes.map((msg, idx) => (<Burbuja key={msg.id || idx} mensaje={msg} mypeNombre={mypeNombre} />))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleEnviar} style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb", background: "#fff", display: "flex", gap: 10, flexShrink: 0 }}>
        <input type="text" value={texto} onChange={(e) => setTexto(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleEnviar()} placeholder="Escribe un mensaje..."
          style={{ flex: 1, padding: "10px 16px", borderRadius: 12, fontFamily: FONT, fontSize: 13, border: "1px solid #e5e7eb", outline: "none", background: "#f9fafb", color: "#111827", transition: "border-color 0.2s" }}
          onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")} onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} />
        <button type="submit" disabled={!texto.trim() || isEnviando}
          style={{ width: 44, height: 44, borderRadius: 12, flexShrink: 0, background: texto.trim() ? "linear-gradient(135deg, #1B6FE8, #0E54C4)" : "#f3f4f6", border: "none", cursor: texto.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: texto.trim() ? "0 2px 8px rgba(27,111,232,0.3)" : "none" }}>
          {isEnviando ? <Loader2 size={18} color="#9CA3AF" style={{ animation: "spin 1s linear infinite" }} /> : <Send size={18} color={texto.trim() ? "#fff" : "#9CA3AF"} />}
        </button>
      </form>
    </div>
  );
}

export function MensajesPage() {
  const { conversaciones, isLoading: loadingConversaciones } = useConversaciones();
  const [seleccionada, setSeleccionada] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [proyectoId, setProyectoId] = useState(null);

  const { proyectos } = useMisProyectos();

  // ✅ Obtener proyectoId: del estado > primera conversación > primer proyecto
  const idParaChats = proyectoId || conversaciones?.[0]?.proyectoId || proyectos?.[0]?.id || null;

  const { mensajes: mensajes1v1, isLoading: loading1v1 } = useMensajes(seleccionada?.id);
  const { enviar: enviar1v1, isLoading: enviando1v1 } = useEnviarMensaje(seleccionada?.id);

  const { chats: chatsGrupales } = useChatsGrupo(idParaChats);
  const chatActivo = chatsGrupales?.find(c => c.tipo === activeTab);
  const { mensajes: mensajesGrupo, isLoading: loadingGrupo } = useMensajesGrupo(idParaChats, chatActivo?.id);
  const { enviar: enviarGrupo, isEnviando: enviandoGrupo } = useEnviarMensajeGrupo(idParaChats, chatActivo?.id);

  useEffect(() => {
    if (conversaciones.length > 0 && !seleccionada) {
      setSeleccionada(conversaciones[0]);
      setProyectoId(conversaciones[0].proyectoId);
      setActiveTab("PRIVADA");
    }
  }, [conversaciones]);

  const handleSelectConv = (conv) => {
    setSeleccionada(conv);
    setProyectoId(conv.proyectoId);
    setActiveTab("PRIVADA");
  };

  const handleSelectGrupal = (tipo, chat) => {
    setActiveTab(tipo);
    setSeleccionada(null);
    if (chat?.proyectoId) setProyectoId(chat.proyectoId);
  };

  const handleEnviar = (texto) => {
    if (activeTab === "PRIVADA") enviar1v1(texto);
    else enviarGrupo(texto);
  };

  // ✅ Lista unificada de TODOS los chats (1:1 + grupales)
  const allChats = [
    ...(conversaciones || []).map(c => ({ ...c, tipo: "PRIVADA", label: c.estudianteNombre, subtitulo: c.proyectoTitulo || "Chat directo" })),
    ...(chatsGrupales || []).map(c => ({ ...c, label: c.nombre || (c.tipo === "EQUIPO" ? "Chat de Equipo" : "Chat del Proyecto"), subtitulo: c.tipo === "EQUIPO" ? "Solo estudiantes" : "Equipo + MYPE" })),
  ];

  const filteredChats = allChats.filter(c => c.label?.toLowerCase().includes(searchTerm.toLowerCase()));

  const getIcon = (tipo) => {
    if (tipo === "EQUIPO") return <Users size={16} />;
    if (tipo === "PROYECTO") return <Building2 size={16} />;
    return <User size={16} />;
  };
  const getChatBg = (tipo, isActive) => {
    if (isActive) return "linear-gradient(135deg, #1B6FE8, #06B6D4)";
    if (tipo === "EQUIPO") return "linear-gradient(135deg, #EFF6FF, #DBEAFE)";
    if (tipo === "PROYECTO") return "linear-gradient(135deg, #F5F3FF, #EDE9FE)";
    return "linear-gradient(135deg, #ECFDF5, #D1FAE5)";
  };
  const getChatBorder = (tipo, isActive) => {
    if (isActive) return "2px solid #1B6FE8";
    if (tipo === "EQUIPO") return "2px solid #BFDBFE";
    if (tipo === "PROYECTO") return "2px solid #DDD6FE";
    return "2px solid #A7F3D0";
  };
  const getIconColor = (tipo, isActive) => {
    if (isActive) return "#fff";
    if (tipo === "EQUIPO") return "#1D4ED8";
    if (tipo === "PROYECTO") return "#7C3AED";
    return "#059669";
  };

  const currentData = activeTab === "PRIVADA"
    ? { mensajes: mensajes1v1 || [], nombre: seleccionada?.estudianteNombre }
    : { mensajes: mensajesGrupo || [], nombre: chatActivo?.nombre };
  const currentLoading = activeTab === "PRIVADA" ? loading1v1 : loadingGrupo;
  const currentEnviando = activeTab === "PRIVADA" ? enviando1v1 : enviandoGrupo;
  const mypeNombre = "MYPE";

  return (
    <MypeLayout titulo="Mensajes">
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
      {loadingConversaciones ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{[1,2,3].map((i) => (<div key={i} style={{ height: 64, borderRadius: 12, background: "#e5e7eb", animation: "pulse 1.5s ease-in-out infinite" }} />))}</div>
      ) : allChats.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 24px", border: "1px dashed #e5e7eb", borderRadius: 16, background: "#fff" }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><MessageSquare size={28} color="#d1d5db" /></div>
          <p style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 6 }}>No tienes conversaciones</p>
        </div>
      ) : (
        <div style={{ display: "flex", height: "calc(100vh - 140px)", background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ width: 300, borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", flexShrink: 0, background: "#fff" }}>
            <div style={{ padding: "16px", borderBottom: "1px solid #f3f4f6" }}>
              <h2 style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: "#0F1F3D", margin: "0 0 12px" }}>Conversaciones</h2>
              <div style={{ position: "relative" }}>
                <Search size={14} color="#9CA3AF" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
                <input type="text" placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px 8px 32px", borderRadius: 10, fontFamily: FONT, fontSize: 12, border: "1px solid #e5e7eb", outline: "none", background: "#f9fafb", color: "#111827", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filteredChats.map((c) => {
                const isActive = activeTab === c.tipo && (c.tipo === "PRIVADA" ? seleccionada?.id === c.id : chatActivo?.id === c.id);
                return (
                  <button key={c.id || c.tipo} onClick={() => c.tipo === "PRIVADA" ? handleSelectConv(c) : handleSelectGrupal(c.tipo, c)}
                    style={{ width: "100%", padding: "12px 16px", background: isActive ? "#eff6ff" : "transparent", border: "none", borderBottom: "1px solid #f9fafb", borderLeft: isActive ? "3px solid #1B6FE8" : "3px solid transparent", cursor: "pointer", textAlign: "left", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 10 }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#f9fafb"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: getChatBg(c.tipo, isActive), border: getChatBorder(c.tipo, isActive), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ color: getIconColor(c.tipo, isActive) }}>{getIcon(c.tipo)}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#0F1F3D", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</p>
                      <p style={{ fontFamily: FONT, fontSize: 11, color: "#9CA3AF", margin: "2px 0 0" }}>{c.subtitulo || c.proyectoTitulo}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div style={{ padding: "10px 16px", borderTop: "1px solid #f3f4f6", textAlign: "center" }}>
              <span style={{ fontFamily: FONT, fontSize: 10, color: "#d1d5db" }}>{allChats.length} conversación{allChats.length !== 1 ? "es" : ""}</span>
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {activeTab ? (
              <ChatPanel tipo={activeTab} data={currentData} mypeNombre={mypeNombre} onEnviar={handleEnviar} isEnviando={currentEnviando} isLoading={currentLoading} />
            ) : (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><MessageSquare size={28} color="#d1d5db" /></div>
                  <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#9CA3AF" }}>Selecciona una conversación</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </MypeLayout>
  );
}