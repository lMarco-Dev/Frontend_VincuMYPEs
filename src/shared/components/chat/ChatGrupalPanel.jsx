import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Loader2,
  Users,
  Building2,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import {
  useMensajesGrupo,
  useEnviarMensajeGrupo,
} from "@/features/chat-grupal/useChatGrupal";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";

const FONT = "'Angro Std', 'Outfit', sans-serif";

export function ChatGrupalPanel({ proyectoId, chat }) {
  const { mensajes, isLoading, refetch } = useMensajesGrupo(
    proyectoId,
    chat?.id,
  );
  const { enviar, isEnviando } = useEnviarMensajeGrupo(proyectoId, chat?.id);
  const [texto, setTexto] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);
  useEffect(() => {
    const interval = setInterval(() => refetch(), 5000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handleEnviar = (e) => {
    e.preventDefault();
    if (!texto.trim() || isEnviando) return;
    enviar(texto.trim());
    setTexto("");
  };

  const esChatEquipo = chat?.tipo === "EQUIPO";

  if (!chat) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <MessageSquare size={24} color="#d1d5db" />
          </div>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 600,
              color: "#9CA3AF",
            }}
          >
            Selecciona un chat
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid #e5e7eb",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: esChatEquipo
              ? "linear-gradient(135deg, #EFF6FF, #DBEAFE)"
              : "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
            border: esChatEquipo ? "2px solid #BFDBFE" : "2px solid #DDD6FE",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {esChatEquipo ? (
            <Users size={18} color="#1D4ED8" />
          ) : (
            <Building2 size={18} color="#7C3AED" />
          )}
        </div>
        <div>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontWeight: 700,
              color: "#0F1F3D",
              margin: 0,
            }}
          >
            {chat.nombre ||
              (esChatEquipo ? "Chat de Equipo" : "Chat del Proyecto")}
          </p>
          <p
            style={{
              fontFamily: FONT,
              fontSize: 11,
              color: "#9CA3AF",
              margin: "2px 0 0",
            }}
          >
            {esChatEquipo
              ? `${chat.totalMiembros || 0} miembros · Solo estudiantes`
              : "Equipo completo + MYPE"}
          </p>
        </div>
      </div>

      {/* Mensajes */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px",
          background: "#f8fafc",
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 40,
            }}
          >
            <Loader2
              size={24}
              color="#9CA3AF"
              style={{ animation: "spin 1s linear infinite" }}
            />
          </div>
        ) : mensajes.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 60 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <MessageSquare size={24} color="#d1d5db" />
            </div>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 14,
                fontWeight: 600,
                color: "#9CA3AF",
              }}
            >
              No hay mensajes aún
            </p>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 12,
                color: "#d1d5db",
                marginTop: 4,
              }}
            >
              ¡Sé el primero en escribir!
            </p>
          </div>
        ) : (
          mensajes.map((msg, idx) => {
            const mostrarFecha =
              idx === 0 ||
              (msg.fechaEnvio &&
                mensajes[idx - 1]?.fechaEnvio &&
                format(new Date(msg.fechaEnvio), "yyyy-MM-dd") !==
                  format(new Date(mensajes[idx - 1].fechaEnvio), "yyyy-MM-dd"));
            return (
              <div key={msg.id || idx}>
                {mostrarFecha && (
                  <div style={{ textAlign: "center", margin: "16px 0 10px" }}>
                    <span
                      style={{
                        fontFamily: FONT,
                        fontSize: 10,
                        fontWeight: 600,
                        color: "#9CA3AF",
                        background: "#fff",
                        padding: "4px 12px",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      {msg.fechaEnvio
                        ? format(new Date(msg.fechaEnvio), "EEEE d 'de' MMMM", {
                            locale: es,
                          })
                        : ""}
                    </span>
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    justifyContent: msg.esMio ? "flex-end" : "flex-start",
                    marginBottom: 6,
                  }}
                >
                  <div style={{ maxWidth: "72%" }}>
                    {!msg.esMio && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 4,
                          marginLeft: 4,
                        }}
                      >
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 8,
                            background:
                              "linear-gradient(135deg, #e0e7ff, #c7d2fe)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 9,
                            fontWeight: 700,
                            color: "#4f46e5",
                          }}
                        >
                          {msg.remitenteNombre?.charAt(0) || "?"}
                        </div>
                        <span
                          style={{
                            fontFamily: FONT,
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#6b7280",
                          }}
                        >
                          {msg.remitenteNombre}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: msg.esMio
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                        background: msg.esMio
                          ? "linear-gradient(135deg, #1B6FE8, #0E54C4)"
                          : "#fff",
                        border: msg.esMio ? "none" : "1px solid #e5e7eb",
                        color: msg.esMio ? "#fff" : "#0F1F3D",
                        boxShadow: msg.esMio
                          ? "0 2px 8px rgba(27,111,232,0.2)"
                          : "0 1px 3px rgba(0,0,0,0.04)",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: FONT,
                          fontSize: 13,
                          margin: 0,
                          lineHeight: 1.5,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.mensaje}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          justifyContent: "flex-end",
                          marginTop: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: FONT,
                            fontSize: 10,
                            color: msg.esMio
                              ? "rgba(255,255,255,0.6)"
                              : "#9CA3AF",
                          }}
                        >
                          {msg.fechaEnvio
                            ? format(new Date(msg.fechaEnvio), "HH:mm")
                            : ""}
                        </span>
                        {msg.esMio && (
                          <CheckCircle2
                            size={10}
                            color="rgba(255,255,255,0.6)"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleEnviar}
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #e5e7eb",
          background: "#fff",
          display: "flex",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleEnviar()}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRadius: 12,
            fontFamily: FONT,
            fontSize: 13,
            border: "1px solid #e5e7eb",
            outline: "none",
            background: "#f9fafb",
            color: "#111827",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
        <button
          type="submit"
          disabled={!texto.trim() || isEnviando}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            flexShrink: 0,
            background: texto.trim()
              ? "linear-gradient(135deg, #1B6FE8, #0E54C4)"
              : "#f3f4f6",
            border: "none",
            cursor: texto.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            boxShadow: texto.trim() ? "0 2px 8px rgba(27,111,232,0.3)" : "none",
          }}
        >
          {isEnviando ? (
            <Loader2
              size={18}
              color="#9CA3AF"
              style={{ animation: "spin 1s linear infinite" }}
            />
          ) : (
            <Send size={18} color={texto.trim() ? "#fff" : "#9CA3AF"} />
          )}
        </button>
      </form>
    </div>
  );
}
