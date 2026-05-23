import { useState, useEffect, useRef } from "react";
import { MypeLayout } from "@shared/layouts/MypeLayout";
import {
  useConversaciones,
  useMensajes,
  useEnviarMensaje,
} from "@/features/mensajes/useMensajes";
import { motion } from "framer-motion";
import { MessageSquare, Send, Loader2, Clock } from "lucide-react";

const FONT = "'Angro Std', 'Outfit', sans-serif";

// ── Burbuja de mensaje ────────────────────────────────────────
function Burbuja({ mensaje }) {
  const hora = new Date(mensaje.fechaEnvio).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: mensaje.esMio ? "flex-end" : "flex-start",
        marginBottom: 8,
      }}
    >
      <div
        style={{
          maxWidth: "72%",
          padding: "10px 14px",
          borderRadius: mensaje.esMio
            ? "16px 16px 4px 16px"
            : "16px 16px 16px 4px",
          background: mensaje.esMio
            ? "linear-gradient(135deg,#1B6FE8,#0E54C4)"
            : "#F1F5F9",
          color: mensaje.esMio ? "#fff" : "#0F1F3D",
        }}
      >
        {!mensaje.esMio && (
          <p
            style={{
              fontFamily: FONT,
              fontSize: 10,
              fontWeight: 700,
              color: "#1B6FE8",
              margin: "0 0 3px",
            }}
          >
            {mensaje.remitenteNombre}
          </p>
        )}
        <p
          style={{ fontFamily: FONT, fontSize: 13, margin: 0, lineHeight: 1.5 }}
        >
          {mensaje.mensaje}
        </p>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 10,
            margin: "4px 0 0",
            color: mensaje.esMio ? "rgba(255,255,255,0.6)" : "#9CA3AF",
            textAlign: "right",
          }}
        >
          {hora}
        </p>
      </div>
    </div>
  );
}

// ── Panel del chat ────────────────────────────────────────────
function PanelChat({ conversacion }) {
  const { mensajes, isLoading } = useMensajes(conversacion.id);
  const { enviar, isLoading: enviando } = useEnviarMensaje(conversacion.id);
  const [texto, setTexto] = useState("");
  const bottomRef = useRef(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleEnviar = () => {
    if (!texto.trim() || enviando) return;
    enviar(texto.trim());
    setTexto("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header del chat */}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "0.5px solid #E5E7EB",
          background: "#F9FAFB",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 700,
            color: "#0F1F3D",
            margin: 0,
          }}
        >
          {conversacion.estudianteNombre}
        </p>
        <p
          style={{
            fontFamily: FONT,
            fontSize: 11,
            color: "#9CA3AF",
            margin: "2px 0 0",
          }}
        >
          Proyecto: {conversacion.proyectoTitulo}
        </p>
      </div>

      {/* Mensajes */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 20,
            }}
          >
            <Loader2
              size={20}
              color="#9CA3AF"
              style={{ animation: "spin 1s linear infinite" }}
            />
          </div>
        ) : mensajes.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <MessageSquare
              size={28}
              color="#D1D5DB"
              style={{ marginBottom: 8 }}
            />
            <p style={{ fontFamily: FONT, fontSize: 13, color: "#9CA3AF" }}>
              Inicia la conversación enviando un mensaje
            </p>
          </div>
        ) : (
          mensajes.map((m) => <Burbuja key={m.id} mensaje={m} />)
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input de mensaje */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "0.5px solid #E5E7EB",
          display: "flex",
          gap: 8,
          flexShrink: 0,
        }}
      >
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleEnviar()}
          placeholder="Escribe un mensaje..."
          style={{
            flex: 1,
            padding: "10px 14px",
            borderRadius: 10,
            fontFamily: FONT,
            fontSize: 13,
            border: "1px solid #E5E7EB",
            outline: "none",
            background: "#fff",
            color: "#111827",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#1B6FE8")}
          onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
        />
        <button
          onClick={handleEnviar}
          disabled={!texto.trim() || enviando}
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            flexShrink: 0,
            background: texto.trim()
              ? "linear-gradient(135deg,#1B6FE8,#0E54C4)"
              : "#F3F4F6",
            border: "none",
            cursor: texto.trim() ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          {enviando ? (
            <Loader2
              size={16}
              color="#9CA3AF"
              style={{ animation: "spin 1s linear infinite" }}
            />
          ) : (
            <Send size={16} color={texto.trim() ? "#fff" : "#9CA3AF"} />
          )}
        </button>
      </div>
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────
export function MensajesPage() {
  const { conversaciones, isLoading } = useConversaciones();
  const [seleccionada, setSeleccionada] = useState(null);

  // Seleccionar primera al cargar
  useEffect(() => {
    if (conversaciones.length > 0 && !seleccionada) {
      setSeleccionada(conversaciones[0]);
    }
  }, [conversaciones]);

  return (
    <MypeLayout titulo="Mensajes">
      <style>{`
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      `}</style>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 64,
                borderRadius: "1rem",
                background: "#E5E7EB",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      ) : conversaciones.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 24px",
            border: "1px dashed #E5E7EB",
            borderRadius: "1rem",
            background: "#fff",
          }}
        >
          <MessageSquare
            size={32}
            color="#D1D5DB"
            style={{ marginBottom: 12 }}
          />
          <p
            style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 700,
              color: "#374151",
              marginBottom: 6,
            }}
          >
            No tienes conversaciones activas
          </p>
          <p style={{ fontFamily: FONT, fontSize: 13, color: "#9CA3AF" }}>
            Las conversaciones se crean automáticamente cuando un estudiante es
            confirmado en un proyecto
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr",
            gap: 0,
            height: "calc(100vh - 160px)",
            background: "#fff",
            borderRadius: "1rem",
            border: "0.5px solid #E5E7EB",
            overflow: "hidden",
          }}
        >
          {/* Lista de conversaciones */}
          <div
            style={{ borderRight: "0.5px solid #E5E7EB", overflowY: "auto" }}
          >
            <div
              style={{
                padding: "14px 16px",
                borderBottom: "0.5px solid #F3F4F6",
              }}
            >
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  margin: 0,
                }}
              >
                Conversaciones
              </p>
            </div>
            {conversaciones.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSeleccionada(conv)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  background: "transparent",
                  border: "none",
                  borderBottom: "0.5px solid #F9FAFB",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.15s",
                  background:
                    seleccionada?.id === conv.id ? "#EFF6FF" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (seleccionada?.id !== conv.id)
                    e.currentTarget.style.background = "#F9FAFB";
                }}
                onMouseLeave={(e) => {
                  if (seleccionada?.id !== conv.id)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
                      border: "1.5px solid #BFDBFE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#1D4ED8",
                    }}
                  >
                    {conv.estudianteNombre
                      ?.split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: FONT,
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#0F1F3D",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {conv.estudianteNombre}
                      </p>
                      {conv.mensajesNoLeidos > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            background: "#1B6FE8",
                            color: "#fff",
                            borderRadius: "50%",
                            width: 18,
                            height: 18,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {conv.mensajesNoLeidos}
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 11,
                        color: "#9CA3AF",
                        margin: "2px 0 0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {conv.ultimoMensaje || conv.proyectoTitulo}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Panel del chat */}
          {seleccionada ? (
            <PanelChat key={seleccionada.id} conversacion={seleccionada} />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p style={{ fontFamily: FONT, fontSize: 13, color: "#9CA3AF" }}>
                Selecciona una conversación
              </p>
            </div>
          )}
        </div>
      )}
    </MypeLayout>
  );
}
