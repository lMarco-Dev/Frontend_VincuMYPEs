import { useState } from "react";
import {
  Vote,
  Clock,
  CheckCircle2,
  Loader2,
  X,
  Trophy,
  Users,
  Shield,
  TrendingUp,
} from "lucide-react";
import { useVotacion, useVotar } from "@/features/votacion/useVotacion";
import { formatDistanceToNow, format } from "date-fns";
import { es } from "date-fns/locale/es";

export function VotacionModal({ proyectoId, onClose }) {
  const { votacion, isLoading, refetch } = useVotacion(proyectoId);
  const { votar, isVotando } = useVotar(proyectoId);
  const [votoExitoso, setVotoExitoso] = useState(false);
  const [votandoId, setVotandoId] = useState(null);

  const handleVotar = (candidatoId) => {
    if (isVotando || votacion?.yaVote) return;
    setVotandoId(candidatoId);
    setVotoExitoso(false);
    votar(candidatoId, {
      onSuccess: () => {
        setVotoExitoso(true);
        setTimeout(() => {
          refetch();
          setVotoExitoso(false);
          setVotandoId(null);
        }, 1200);
      },
      onError: () => {
        setVotandoId(null);
      },
    });
  };

  const tiempoRestante = votacion?.fechaLimite
    ? formatDistanceToNow(new Date(votacion.fechaLimite), { addSuffix: true, locale: es })
    : "";

  const fechaFormateada = votacion?.fechaLimite
    ? format(new Date(votacion.fechaLimite), "d 'de' MMMM 'a las' HH:mm", { locale: es })
    : "";

  if (isLoading) {
    return (
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(15,23,42,0.7)", backdropFilter: "blur(6px)",
      }}>
        <div style={{
          background: "#fff", borderRadius: 20, padding: 48,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        }}>
          <Loader2 size={28} color="#1B6FE8" style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ fontSize: 14, fontWeight: 500, color: "#6b7280" }}>Cargando votación...</span>
        </div>
      </div>
    );
  }

  const completada = votacion?.estado === "COMPLETADA";
  const ganador = votacion?.candidatos?.find((c) => c.esGanador);
  const totalVotos = votacion?.totalVotos || 0;
  const totalCandidatos = votacion?.candidatos?.length || 0;

  const ranking = [...(votacion?.candidatos || [])].sort(
    (a, b) => (b.votosRecibidos || 0) - (a.votosRecibidos || 0)
  );

    const getPosicion = (idx) => {
    // 🥇 1° lugar: Dorado destacado
    if (idx === 0) return { 
      color: "#f59e0b", 
      bg: "#fffbeb", 
      border: "#fbbf24",
      textColor: "#92400e",
      barra: "linear-gradient(90deg, #fbbf24, #f59e0b)",
    };
    // 🥈 2° lugar: Naranja cálido
    if (idx === 1) return { 
      color: "#f97316", 
      bg: "#fff7ed", 
      border: "#fdba74",
      textColor: "#9a3412",
      barra: "linear-gradient(90deg, #fb923c, #f97316)",
    };
    // 🥉 3° lugar: Ámbar suave
    if (idx === 2) return { 
      color: "#d97706", 
      bg: "#fffbeb", 
      border: "#fcd34d",
      textColor: "#92400e",
      barra: "linear-gradient(90deg, #fbbf24, #d97706)",
    };
    // 4° en adelante: Piedra/gris cálido
    return { 
      color: "#78716c", 
      bg: "#fafaf9", 
      border: "#e7e5e4",
      textColor: "#57534e",
      barra: "linear-gradient(90deg, #a8a29e, #78716c)",
    };
  };

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, background: "rgba(15,23,42,0.7)", backdropFilter: "blur(6px)",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 24, width: "100%",
        maxWidth: 800, maxHeight: "90vh",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        border: "1px solid #e8e8e4",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* ═══════════════ CABECERA ═══════════════ */}
        <div style={{
          padding: "24px 32px", borderBottom: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: completada
                ? "linear-gradient(135deg, #fef3c7, #fde68a)"
                : "linear-gradient(135deg, #0d1b35, #1a1a2e)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {completada ? <Trophy size={22} color="#f59e0b" /> : <Vote size={22} color="#fff" />}
            </div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f1f3d", margin: 0 }}>
                {completada ? "Resultado de la votación" : "Elegir delegado del equipo"}
              </h2>
              <p style={{ fontSize: 12, color: "#6b7280", margin: "2px 0 0" }}>
                {votacion?.proyectoTitulo || "Proyecto"}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!completada && (
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 10,
                background: "#fffbeb", border: "1px solid #fde68a",
                fontSize: 12, fontWeight: 600, color: "#92400e",
              }}>
                <Clock size={14} />
                Cierra {tiempoRestante}
              </div>
            )}
            <button onClick={onClose} style={{
              padding: 8, borderRadius: 10, border: "1px solid #e8e8e4",
              background: "#fff", cursor: "pointer", color: "#6b7280",
              display: "flex",
            }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ═══════════════ CUERPO ═══════════════ */}
        <div style={{ padding: "24px 32px", overflowY: "auto", flex: 1 }}>
          {/* Feedback voto exitoso */}
          {votoExitoso && (
            <div style={{
              marginBottom: 16, padding: "10px 16px",
              background: "#ecfdf5", border: "1px solid #a7f3d0",
              borderRadius: 10, display: "flex", alignItems: "center",
              gap: 8, color: "#059669", fontSize: 13, fontWeight: 600,
            }}>
              <CheckCircle2 size={16} /> Voto registrado
            </div>
          )}

          {/* ═══════════════ MODO COMPLETADA ═══════════════ */}
          {completada && ganador ? (
            <div style={{ display: "flex", gap: 24 }}>
              {/* Ganador - Panel izquierdo */}
              <div style={{
                flex: "0 0 260px", background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
                border: "1px solid #fbbf24", borderRadius: 16,
                padding: "28px 24px", textAlign: "center",
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 14px", boxShadow: "0 6px 20px rgba(245,158,11,0.25)",
                }}>
                  <Trophy size={28} color="#fff" />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f1f3d", margin: "0 0 6px" }}>
                  {ganador.estudianteNombre}
                </h3>
                <p style={{ fontSize: 12, color: "#92400e", margin: "0 0 14px", lineHeight: 1.5 }}>
                  {ganador.votosRecibidos} voto{ganador.votosRecibidos !== 1 ? "s" : ""} ·{" "}
                  {totalVotos > 0 ? Math.round((ganador.votosRecibidos / totalVotos) * 100) : 0}%
                </p>
                <div style={{
                  padding: "8px 14px", borderRadius: 16,
                  background: "#eff6ff", border: "1px solid #bfdbfe",
                  color: "#1d4ed8", fontSize: 11, fontWeight: 600,
                  display: "inline-flex", alignItems: "center", gap: 5,
                }}>
                  <Shield size={12} /> Delegado del equipo
                </div>
              </div>

              {/* Ranking - Panel derecho */}
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: 13, fontWeight: 700, color: "#6b7280",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  margin: "0 0 12px",
                }}>
                  Clasificación final
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {ranking.map((c, idx) => {
                    const pos = getPosicion(idx);
                    const pct = totalVotos > 0 ? Math.round((c.votosRecibidos / totalVotos) * 100) : 0;
                    return (
                      <div key={c.estudianteId} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "12px 16px", borderRadius: 10,
                        background: pos.bg, border: `1px solid ${pos.border}`,
                      }}>
                        <span style={{
                          width: 30, height: 30, borderRadius: 8,
                          background: pos.color, display: "flex",
                          alignItems: "center", justifyContent: "center",
                          color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0,
                        }}>
                          {idx + 1}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "#0f1f3d" }}>
                              {c.estudianteNombre}
                            </span>
                            {c.esYo && (
                              <span style={{
                                fontSize: 10, fontWeight: 600, color: "#1B6FE8",
                                background: "#eff6ff", padding: "1px 7px", borderRadius: 5,
                              }}>Tú</span>
                            )}
                            {c.esGanador && (
                              <span style={{
                                fontSize: 10, fontWeight: 600, color: "#92400e",
                                background: "#fef3c7", padding: "1px 7px", borderRadius: 5,
                              }}>Ganador</span>
                            )}
                          </div>
                          <div style={{ height: 5, borderRadius: 3, background: "#e5e7eb", overflow: "hidden" }}>
                            <div style={{
                              height: "100%", borderRadius: 3, width: `${pct}%`,
                              background: c.esGanador
                                ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                                : "linear-gradient(90deg, #1B6FE8, #06B6D4)",
                              transition: "width 0.8s ease",
                            }} />
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#0f1f3d" }}>{c.votosRecibidos}</span>
                          <span style={{ fontSize: 10, color: "#6b7280", display: "block" }}>{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ═══════════════ MODO VOTACIÓN EN CURSO ═══════════════ */
            <div style={{ display: "flex", gap: 24 }}>
              {/* Panel izquierdo: Candidatos */}
              <div style={{ flex: 1 }}>
                <h4 style={{
                  fontSize: 13, fontWeight: 700, color: "#6b7280",
                  textTransform: "uppercase", letterSpacing: "0.05em",
                  margin: "0 0 10px",
                }}>
                  Candidatos ({totalCandidatos})
                </h4>

                {totalCandidatos === 0 ? (
                  <div style={{
                    textAlign: "center", padding: "40px 20px",
                    background: "#f9fafb", borderRadius: 14, border: "1px solid #e5e7eb",
                  }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", margin: "0 0 8px" }}>
                      No hay candidatos aún
                    </p>
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                      Espera a que se confirmen los miembros del equipo
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {votacion?.candidatos?.map((candidato) => {
                      const isSelected = votandoId === candidato.estudianteId;
                      const disabled = isVotando || votacion?.yaVote;
                      return (
                        <button
                          key={candidato.estudianteId}
                          onClick={() => handleVotar(candidato.estudianteId)}
                          disabled={disabled}
                          style={{
                            width: "100%", padding: "12px 16px",
                            borderRadius: 10, textAlign: "left",
                            border: isSelected ? "2px solid #1B6FE8" : "1px solid #e8e8e4",
                            background: isSelected ? "#eff6ff" : "#fff",
                            cursor: disabled ? "default" : "pointer",
                            opacity: disabled && !isSelected ? 0.5 : 1,
                            fontFamily: "inherit", transition: "all 0.15s",
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                          }}
                          onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.borderColor = "#1B6FE8"; }}
                          onMouseLeave={(e) => { if (!disabled && !isSelected) e.currentTarget.style.borderColor = "#e8e8e4"; }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                              width: 38, height: 38, borderRadius: 10,
                              background: isSelected
                                ? "linear-gradient(135deg, #1B6FE8, #06B6D4)"
                                : "#f1f5f9",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: isSelected ? "#fff" : "#6b7280",
                              fontWeight: 700, fontSize: 14, flexShrink: 0,
                            }}>
                              {isVotando && isSelected
                                ? <Loader2 size={16} color="#fff" style={{ animation: "spin 0.8s linear infinite" }} />
                                : candidato.estudianteNombre?.charAt(0)
                              }
                            </div>
                            <div>
                              <span style={{ fontSize: 13, fontWeight: 600, color: "#0f1f3d" }}>
                                {candidato.estudianteNombre}
                              </span>
                              {candidato.esYo && (
                                <span style={{
                                  fontSize: 10, fontWeight: 600, color: "#1B6FE8",
                                  background: "#eff6ff", padding: "1px 7px",
                                  borderRadius: 5, marginLeft: 8,
                                }}>Tú</span>
                              )}
                            </div>
                          </div>
                          {!votacion?.yaVote && !isVotando && (
                            <span style={{ fontSize: 12, fontWeight: 600, color: "#1B6FE8" }}>Votar</span>
                          )}
                          {isVotando && isSelected && (
                            <span style={{ fontSize: 11, color: "#1B6FE8" }}>Votando...</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {votacion?.yaVote && (
                  <div style={{
                    marginTop: 12, padding: "10px 14px",
                    background: "#eff6ff", border: "1px solid #bfdbfe",
                    borderRadius: 10, display: "flex", alignItems: "center",
                    gap: 8, color: "#1d4ed8", fontSize: 12, fontWeight: 600,
                  }}>
                    <CheckCircle2 size={15} />
                    Ya has votado. Espera los resultados.
                  </div>
                )}
              </div>

              {/* Panel derecho: Info + Tendencia */}
              <div style={{ flex: "0 0 280px", display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Info: Todos son candidatos */}
                <div style={{
                  padding: "16px 18px", background: "#f0fdf4",
                  borderRadius: 14, border: "1px solid #bbf7d0",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: "#dcfce7", display: "flex",
                      alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 2,
                    }}>
                      <Users size={16} color="#16a34a" />
                    </div>
                    <div>
                      <span style={{
                        fontSize: 13, fontWeight: 700, color: "#166534",
                        display: "block", marginBottom: 4,
                      }}>
                        Todos son candidatos
                      </span>
                      <span style={{
                        fontSize: 11, color: "#15803d",
                        display: "block", lineHeight: 1.5,
                      }}>
                        Todos los miembros confirmados del equipo participan automáticamente. Vota por quien consideres más preparado.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tendencia en tiempo real */}
                {totalVotos > 0 && !votacion?.yaVote && (
                  <div style={{
                    padding: "16px 18px", background: "#f8fafc",
                    borderRadius: 14, border: "1px solid #e8e8e4",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                      <TrendingUp size={14} color="#1B6FE8" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0f1f3d" }}>Tendencia</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {ranking.slice(0, 3).map((c, idx) => {
                        const pct = totalVotos > 0 ? Math.round((c.votosRecibidos / totalVotos) * 100) : 0;
                        return (
                          <div key={c.estudianteId} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{
                              fontSize: 11, fontWeight: 700,
                              color: getPosicion(idx).color, width: 18,
                            }}>
                              {idx + 1}°
                            </span>
                            <span style={{ fontSize: 11, fontWeight: 500, color: "#0f1f3d", flex: 1 }}>
                              {c.estudianteNombre?.split(" ")[0]}
                            </span>
                            <div style={{
                              flex: 1.5, height: 4, borderRadius: 2,
                              background: "#e5e7eb", overflow: "hidden",
                            }}>
                              <div style={{
                                height: "100%", borderRadius: 2,
                                width: `${pct}%`, background: "#1B6FE8",
                                transition: "width 0.6s ease",
                              }} />
                            </div>
                            <span style={{ fontSize: 10, fontWeight: 600, color: "#6b7280" }}>{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Info delegado */}
                <div style={{
                  padding: "14px 16px", background: "#f9fafb",
                  borderRadius: 12, border: "1px solid #e5e7eb",
                }}>
                  <p style={{ fontSize: 11, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>
                    <strong style={{ color: "#0f1f3d" }}>El delegado</strong> será el único que pueda{" "}
                    <strong style={{ color: "#0f1f3d" }}>subir entregables</strong> en nombre del equipo.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════ FOOTER ═══════════════ */}
        <div style={{
          padding: "12px 32px", borderTop: "1px solid #f1f5f9",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: 11, color: "#9ca3af", flexShrink: 0, background: "#fafafa",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Users size={12} /> {totalCandidatos} candidatos
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Vote size={12} /> {totalVotos} votos
            </span>
          </div>
          <button onClick={refetch} style={{
            background: "none", border: "none", color: "#1B6FE8",
            fontSize: 11, fontWeight: 600, cursor: "pointer",
          }}>
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}