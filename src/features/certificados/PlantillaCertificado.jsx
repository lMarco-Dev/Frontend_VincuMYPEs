const FONT_SERIF = "Georgia, 'Times New Roman', serif";

export function PlantillaCertificado({ datos, isForPreviewCanvas = false }) {
  const hoy = new Date().toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" });
  const codigoCert = datos.codigo || `CTX-V${new Date().getFullYear()}-${String(datos.proyectoId || "1").padStart(6, "0")}`;

  return (
    <div
      id="certificado-preview"
      style={{
        width: "297mm",
        height: "210mm",
        background: "#FFFFFF",
        position: "relative",
        boxSizing: "border-box",
        fontFamily: FONT_SERIF,
        color: "#1E293B",
        boxShadow: isForPreviewCanvas ? "0 30px 60px rgba(0,0,0,0.1), 0 5px 25px rgba(0,0,0,0.08)" : "none",
        overflow: "hidden",
        border: "none",
        transformOrigin: "top left",
      }}
    >
      <div style={{
        position: "absolute",
        top: "20mm",
        right: "20mm",
        zIndex: 10,
        background: "transparent"
      }}>
        <img
          src="/linkuy_logo_Blanco.svg"
          alt="Logo Linkuy"
          style={{ width: "35mm", height: "auto", objectFit: "contain" }}
        />
      </div>
      <div style={{
        position: "absolute", top: "15mm", bottom: "15mm",
        left: "15mm", right: "15mm",
        border: "1.5px solid #0F172A", padding: "3px"
      }}>
        <div style={{
          border: "0.5px solid #475569", height: "100%", width: "100%", position: "relative",
          boxSizing: "border-box", display: "flex", flexDirection: "column", padding: "26mm 35mm",
          background: "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(248,250,252,0.8) 100%)"
        }}>
          {[
            { top: -2, left: -2, borderBottom: "1.5px solid #0F172A", borderRight: "1.5px solid #0F172A" },
            { top: -2, right: -2, borderBottom: "1.5px solid #0F172A", borderLeft: "1.5px solid #0F172A" },
            { bottom: -2, left: -2, borderTop: "1.5px solid #0F172A", borderRight: "1.5px solid #0F172A" },
            { bottom: -2, right: -2, borderTop: "1.5px solid #0F172A", borderLeft: "1.5px solid #0F172A" }
          ].map((style, idx) => (
            <div key={idx} style={{ position: "absolute", width: "12px", height: "12px", background: "#FFFFFF", ...style }} />
          ))}

          {/* Código en esquina superior izquierda */}
          <div style={{ position: "absolute", top: "8mm", left: "12mm", fontFamily: "monospace", fontSize: 10, color: "#94A3B8", letterSpacing: "0.05em" }}>
            {codigoCert}
          </div>

          <div style={{ textAlign: "center", marginBottom: 15 }}>
            <h4 style={{
              margin: 0, fontSize: 13, fontWeight: 400, letterSpacing: "0.4em", textTransform: "uppercase", color: "#64748B",
              fontFamily: "system-ui, sans-serif"
            }}>Certificado Oficial</h4>
            <div style={{ width: 45, height: "1.5px", background: "#D4AF37", margin: "14px auto" }} />
            <h1 style={{ margin: 0, fontSize: 46, fontWeight: 400, color: "#0F172A", lineHeight: 1.1 }}>
              Constancia de Participación
            </h1>
          </div>

          <div style={{ textAlign: "center", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: 18, fontStyle: "italic", color: "#475569" }}>Por conducto de este documento se confiere validación expresa a:</p>
            <h2 style={{
              margin: "18px 0", fontSize: 38, fontWeight: 400,
              borderBottom: "1.5px dashed #CBD5E1", paddingBottom: "4px", display: "inline-block",
              letterSpacing: "-0.01em"
            }}>
              {datos.estudianteNombre || "Individuo Calificado / Talento Estratégico"}
            </h2>
            <p style={{ margin: "0", fontSize: 16, color: "#475569", lineHeight: 1.8, maxWidth: "90%" }}>
              Por su participación activa, cumplimiento de hitos y calidad en los entregables, demostrando habilidades técnicas y trabajo en equipo durante el desarrollo del proyecto.
            </p>
            <div style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", padding: "18px 24px", margin: "22px 0", borderRadius: "2px", width: "100%", maxWidth: "80%" }}>
              <h3 style={{ margin: 0, fontSize: 19, fontWeight: 600, fontFamily: "system-ui, sans-serif", letterSpacing: "-0.01em", color: "#1E293B" }}>
                {datos.proyectoTitulo || "[Referencia Oficial de Operación Acreditada]"}
              </h3>
            </div>
          </div>

          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-end",
            marginTop: "auto", borderTop: "1.5px solid rgba(15,23,42,0.1)", paddingTop: 15,
            fontFamily: "system-ui, sans-serif"
          }}>
            {/* Izquierda: nombre MYPE + RUC */}
            <div style={{ flex: 1, textAlign: "left", marginTop: 20 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", margin: "0 0 4px" }}>
                {datos.mypeNombre || "CORPORACIÓN TITULAR"}
              </p>
              {datos.rucMype && (
                <p style={{ fontSize: 11, color: "#64748B", margin: 0, letterSpacing: "0.05em" }}>
                  RUC: {datos.rucMype}
                </p>
              )}
            </div>

            {/* Centro: firma + representante + cargo */}
            <div style={{ flex: 1.5, textAlign: "center", paddingBottom: "2px" }}>
              {datos.firmaUrl ? (
                (() => {
                  if (datos.firmaUrl.startsWith('data:image')) {
                    return <img src={datos.firmaUrl} alt="Firma" style={{ height: 76, objectFit: "contain", display: "block", margin: "0 auto", marginBottom: -22 }} />;
                  } else if (datos.certificadoId) {
                    const token = localStorage.getItem('accessToken');
                    const proxyUrl = `/api/certificados/${datos.certificadoId}/firma?token=${encodeURIComponent(token)}`;
                    return <img src={proxyUrl} alt="Firma" style={{ height: 76, objectFit: "contain", display: "block", margin: "0 auto", marginBottom: -22 }} onError={(e) => { e.target.style.display = 'none'; }} />;
                  } else if (datos.firmaUrl.startsWith('http')) {
                    return <img src={datos.firmaUrl} alt="Firma" style={{ height: 76, objectFit: "contain", display: "block", margin: "0 auto", marginBottom: -22 }} crossOrigin="anonymous" onError={(e) => { e.target.style.display = 'none'; }} />;
                  } else {
                    return <img src={`data:image/png;base64,${datos.firmaUrl}`} alt="Firma" style={{ height: 76, objectFit: "contain", display: "block", margin: "0 auto", marginBottom: -22 }} />;
                  }
                })()
              ) : (
                <div style={{ height: 60, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ border: "1px dashed #CBD5E1", padding: "5px 15px", color: "#94A3B8", fontSize: 11 }}>Firma Digital Pendiente</span>
                </div>
              )}
              <div style={{ width: "65%", height: "1px", background: "#0F172A", margin: "0 auto" }} />
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", margin: "0 0 4px" }}>
                {datos.gerente || "Representante Legal"}
              </p>
              <p style={{ fontSize: 12, color: "#64748B", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {datos.cargo || "CARGO DEL REPRESENTANTE"}
              </p>
            </div>

            {/* Derecha: fecha */}
            <div style={{ flex: 1, textAlign: "right" }}>
              <p style={{ fontSize: 10, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 6px" }}>Acta Fechada en Perú</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B", margin: 0 }}>{hoy}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
