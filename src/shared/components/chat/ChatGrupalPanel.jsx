import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Loader2,
  Check,
  CheckCheck,
} from "lucide-react";
import {
  useMensajesGrupo,
  useEnviarMensajeGrupo,
} from "@/features/chat-grupal/useChatGrupal";
import { format } from "date-fns";
import { es } from "date-fns/locale/es";

const FONT = "'Angro Std', 'Outfit', sans-serif";

export function ChatGrupalPanel({ proyectoId, chat, mypeNombre }) {
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
  // Título que se muestra encima de los mensajes
  const tituloChat = esChatEquipo ? "Equipo" : mypeNombre || "MYPE";

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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <p style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "#9CA3AF" }}>
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
      {/* Título discreto sobre los mensajes */}
      <div
        style={{
          padding: "10px 20px 0",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 4,
            height: 16,
            borderRadius: 2,
            background: esChatEquipo ? "#1B6FE8" : "#10b981",
          }}
        />
        <span
          style={{
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 600,
            color: "#0f1f3d",
          }}
        >
          {tituloChat}
        </span>
        <span
          style={{
            fontFamily: FONT,
            fontSize: 10,
            color: "#9ca3af",
            marginLeft: 4,
          }}
        >
          {esChatEquipo ? "Solo estudiantes" : "Equipo + MYPE"}
        </span>
      </div>

      {/* Mensajes */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 20px 16px",
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
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <p
              style={{
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 600,
                color: "#9CA3AF",
              }}
            >
              Aún no hay mensajes. ¡Sé el primero en escribir!
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
                    {/* Nombre del remitente (solo cuando no es mío) */}
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
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            background: esChatEquipo ? "#eff6ff" : "#ecfdf5",
                            color: esChatEquipo ? "#1d4ed8" : "#047857",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 9,
                            fontWeight: 700,
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
                    {/* Burbuja del mensaje */}
                    <div
                      style={{
                        padding: "10px 14px",
                        borderRadius: 16,
                        background: msg.esMio ? "#1B6FE8" : "#ffffff",
                        border: msg.esMio ? "none" : "1px solid #e5e7eb",
                        color: msg.esMio ? "#fff" : "#0F1F3D",
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
                              ? "rgba(255,255,255,0.7)"
                              : "#9CA3AF",
                          }}
                        >
                          {msg.fechaEnvio
                            ? format(new Date(msg.fechaEnvio), "HH:mm")
                            : ""}
                        </span>
                        {msg.esMio && (
                          msg.leido ? (
                            <CheckCheck size={14} color="#7DD3FC" />
                          ) : (
                            <Check size={14} color="rgba(255,255,255,0.7)" />
                          )
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
            background: texto.trim() ? "#1B6FE8" : "#f3f4f6",
            border: "none",
            cursor: texto.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
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