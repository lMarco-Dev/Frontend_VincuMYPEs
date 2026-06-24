import { useState, useRef, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { useActualizarMypePerfil } from "@/features/mype-perfil/useMypePerfil";
import {
  Loader2,
  Save,
  X,
  MapPin,
  Phone,
  Mail,
  Building2,
  Globe,
  AlertCircle,
  Network,
  Fingerprint
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from "react-icons/fa";

const FONT = "'Inter', 'Outfit', sans-serif";

// Validaciones
const validators = {
  rubro: (value) => {
    if (!value.trim()) return "El rubro o sector es requerido";
    if (value.trim().length < 3) return "Mínimo 3 caracteres";
    return "";
  },
  descripcion: (value) => {
    if (!value.trim()) return "La descripción es requerida";
    if (value.trim().length < 10) return "Mínimo 10 caracteres";
    return "";
  },
  sitioWeb: (value) => {
    if (!value.trim()) return "";
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    if (!urlPattern.test(value.trim())) return "Ingresa una URL válida (ej: https://miempresa.com)";
    return "";
  },
  instagram: (value) => {
    if (!value.trim()) return "";
    if (value.trim().length < 2) return "Mínimo 2 caracteres";
    return "";
  },
  facebook: (value) => {
    if (!value.trim()) return "";
    if (value.trim().length < 2) return "Mínimo 2 caracteres";
    return "";
  },
  tiktok: (value) => {
    if (!value.trim()) return "";
    if (value.trim().length < 2) return "Mínimo 2 caracteres";
    return "";
  },
  whatsapp: (value) => {
    if (!value.trim()) return "";
    // Acepta formato internacional: +51 999 888 777 o solo números: 999888777
    const cleanNumber = value.replace(/[\s\-()]/g, "");
    const hasPlus = cleanNumber.startsWith("+");
    const digitsOnly = cleanNumber.replace(/\D/g, "");
    
    if (hasPlus) {
      if (digitsOnly.length < 11 || digitsOnly.length > 15) return "Formato inválido (ej: +51 999 888 777)";
    } else {
      if (digitsOnly.length !== 9) return "Debe tener 9 dígitos";
    }
    return "";
  },
  direccion: (value) => {
    if (!value.trim()) return "";
    if (value.trim().length < 5) return "Mínimo 5 caracteres";
    return "";
  },
  telefono: (value) => {
    if (!value.trim()) return "";
    const cleanNumber = value.replace(/[\s\-()]/g, "");
    const digitsOnly = cleanNumber.replace(/\D/g, "");
    if (digitsOnly.length !== 9) return "Debe tener 9 dígitos";
    return "";
  },
  emailContacto: (value) => {
    if (!value.trim()) return "El correo electrónico es requerido";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value.trim())) return "Ingresa un correo válido (ej: contacto@empresa.com)";
    return "";
  },
};

// Componente FormField memoizado con validación
const FormField = memo(({ label, type = "text", icon: Icon, value, fieldName, onChange, placeholder, isTextArea, error }) => (
  <div className="input-wrapper">
    <label className="input-label">{label}</label>
    <div className={`input-field ${error ? 'input-error' : ''}`} style={{ 
      alignItems: isTextArea ? "flex-start" : "center",
      borderColor: error ? '#ef4444' : '#e4e4e7',
      background: error ? '#fef2f2' : '#f4f4f5'
    }}>
      {Icon && (
        <span className="icon-area" style={{ marginTop: isTextArea ? "13px" : "0px", color: error ? '#ef4444' : '#a1a1aa' }}>
          <Icon size={16} />
        </span>
      )}
      {isTextArea ? (
        <textarea 
          className="core-input" 
          value={value} 
          onChange={(e) => onChange(fieldName, e.target.value)} 
          placeholder={placeholder} 
          rows={4} 
        />
      ) : (
        <input 
          type={type} 
          className="core-input" 
          value={value} 
          onChange={(e) => onChange(fieldName, e.target.value)} 
          placeholder={placeholder}
        />
      )}
    </div>
    {error && (
      <span style={{ fontSize: "11px", color: "#ef4444", fontWeight: 500, marginTop: "2px" }}>
        {error}
      </span>
    )}
  </div>
));

FormField.displayName = 'FormField';

export function MypePerfilEditarModal({ perfil, onClose }) {
  const { actualizar, isLoading, error } = useActualizarMypePerfil(perfil.id);
  const backdropRef = useRef(null);
  // 🔍 DIAGNÓSTICO TEMPORAL AQQUIIIIIIIIIIIIIIIIIIIIIIIII
  console.log("=== DATOS DEL PERFIL ===");
  console.log("perfil completo:", perfil);
  console.log("emailContacto:", perfil.emailContacto);//ESTO AGREGAMOS
  console.log("telefono:", perfil.telefono);
  console.log("direccion:", perfil.direccion);
  console.log("nivelAcceso:", perfil.nivelAcceso);
   // 🔍 DIAGNÓSTICO TEMPORAL AQQUIIIIIIIIIIIIIIIIIIIIIIIII
  const [form, setForm] = useState({
    rubro: perfil.rubro ?? "",
    descripcion: perfil.descripcion ?? "",
    sitioWeb: perfil.sitioWeb ?? "",
    instagram: perfil.instagram ?? "",
    facebook: perfil.facebook ?? "",
    tiktok: perfil.tiktok ?? "",
    whatsapp: perfil.whatsapp ?? "",
    direccion: perfil.direccion ?? "",
    telefono: perfil.telefono ?? "",
    emailContacto: perfil.emailContacto ?? "",
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((fieldName, value) => {
    // Teléfono: solo números, máximo 9 dígitos
    if (fieldName === "telefono") {
      const cleaned = value.replace(/[^\d]/g, "");
      if (cleaned.length <= 9) {
        setForm((prev) => ({ ...prev, [fieldName]: cleaned }));
      }
    } 
    // WhatsApp: acepta formato internacional (+51 999 888 777) o solo números
    else if (fieldName === "whatsapp") {
      const cleaned = value.replace(/[^\d+\s\-()]/g, "");
      setForm((prev) => ({ ...prev, [fieldName]: cleaned }));
    } 
    else {
      setForm((prev) => ({ ...prev, [fieldName]: value }));
    }
    
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  }, []);

  // Validar campo específico cuando pierde el foco
  const handleBlur = useCallback((fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const value = form[fieldName] || "";
    const validator = validators[fieldName];
    if (validator) {
      const errorMsg = validator(value);
      setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
    }
  }, [form]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    const allTouched = {};
    Object.keys(form).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    Object.keys(validators).forEach(fieldName => {
      const value = form[fieldName] || "";
      const errorMsg = validators[fieldName](value);
      if (errorMsg) {
        newErrors[fieldName] = errorMsg;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    actualizar(form, { onSuccess: onClose });
  };

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const getFieldError = (fieldName) => {
    if (!touched[fieldName]) return "";
    return errors[fieldName] || "";
  };

  return (
    <div 
      ref={backdropRef}
      style={{ 
        position: "fixed", 
        inset: 0, 
        zIndex: 50, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: "32px", 
        fontFamily: FONT,
        background: "rgba(0, 0, 0, 0.45)", 
        backdropFilter: "blur(12px)", 
        WebkitBackdropFilter: "blur(12px)" 
      }}
      onClick={handleBackdropClick}
    >
      <style>{`
        * { box-sizing: border-box; }
        
        .saas-modal { background: #FFFFFF; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 10px 15px rgba(0,0,0,0.04), 0 40px 60px -10px rgba(0,0,0,0.08); border: 1px solid rgba(0,0,0, 0.06); }

        .saas-scroll::-webkit-scrollbar { width: 5px; }
        .saas-scroll::-webkit-scrollbar-track { background: transparent; }
        .saas-scroll::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 4px; }
        .saas-scroll::-webkit-scrollbar-thumb:hover { background: #a3a3a3; }

        .setting-row { display: grid; grid-template-columns: 260px 1fr; gap: 32px; padding: 28px 40px; border-bottom: 1px solid #f4f4f5; }
        .setting-row:last-child { border-bottom: none; }
        @media (max-width: 768px) { .setting-row { grid-template-columns: 1fr; gap: 16px; padding: 24px; } }

        .info-column h3 { font-size: 14px; font-weight: 600; color: #09090b; margin: 0 0 6px 0; letter-spacing: -0.2px; }
        .info-column p { font-size: 13px; color: #71717a; line-height: 1.5; margin: 0; }

        .input-wrapper { display: flex; flex-direction: column; gap: 6px; width: 100%; }
        .input-label { font-size: 13px; font-weight: 500; color: #3f3f46; display: flex; justify-content: space-between; align-items: center; }
        
        .input-field { display: flex; align-items: center; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 10px; padding: 0 14px; min-height: 44px; transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
        .input-field:focus-within { background: #ffffff; border-color: #09090b; box-shadow: 0 0 0 1px #09090b; transform: translateY(-1px); }
        .input-field.input-error:focus-within { border-color: #ef4444; box-shadow: 0 0 0 1px #ef4444; }
        
        .icon-area { display: flex; align-items: center; justify-content: center; color: #a1a1aa; margin-right: 12px; flex-shrink: 0; transition: color 0.2s ease; }
        .input-field:focus-within .icon-area { color: #09090b; }
        .input-field.input-error:focus-within .icon-area { color: #ef4444; }

        .core-input { flex: 1; width: 100%; background: transparent; border: none; outline: none; font-family: 'Inter', 'Outfit', sans-serif; font-size: 14px; color: #18181b; padding: 0; line-height: normal; }
        textarea.core-input { padding: 12px 0; line-height: 1.6; resize: vertical; min-height: 44px; }

        .btn-secondary { height: 42px; padding: 0 20px; border-radius: 8px; font-weight: 500; font-size: 13px; background: #ffffff; color: #18181b; border: 1px solid #e4e4e7; cursor: pointer; transition: 0.2s; }
        .btn-secondary:hover { background: #f4f4f5; color: #09090b; }
        
        .btn-primary { height: 42px; padding: 0 24px; border-radius: 8px; font-weight: 500; font-size: 13px; background: #09090b; color: #ffffff; border: 1px solid #09090b; cursor: pointer; transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1); display: flex; align-items: center; gap: 8px; }
        .btn-primary:hover:not(:disabled) { background: #27272a; border-color: #27272a; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .btn-icon-close { width: 34px; height: 34px; border-radius: 6px; display: flex; align-items: center; justify-content: center; background: transparent; border: none; cursor: pointer; color: #71717a; transition: 0.2s; }
        .btn-icon-close:hover { background: #f4f4f5; color: #18181b; }
        ::placeholder { color: #a1a1aa; font-weight: 400; }
      `}</style>
      
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.99 }} 
        animate={{ opacity: 1, y: 0, scale: 1 }} 
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} 
        className="saas-modal" 
        style={{ width: "100%", maxWidth: "920px", maxHeight: "94vh", display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 40px", borderBottom: "1px solid #e4e4e7", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 600, color: "#09090b", margin: 0, letterSpacing: "-0.3px" }}>Editar perfil</h2>
            <div style={{width: 4, height: 4, background: "#d4d4d8", borderRadius: 4}}/>
            <span style={{ fontSize: "13px", color: "#71717a", fontWeight: 400 }}>{perfil.nombreComercial || "Empresa"}</span>
          </div>
          <button onClick={onClose} className="btn-icon-close"> <X size={20} /> </button>
        </div>

        <div className="saas-scroll" style={{ flex: 1, overflowY: "auto", background: "#ffffff" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            
            {/* SECCIÓN 1: Información general */}
            <div className="setting-row">
              <div className="info-column">
                <h3>Información general</h3>
                <p>Datos principales que verán los visitantes en tu perfil público.</p>
                
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "14px" }}>
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: ["4px", "14px", "4px"] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                        style={{ width: "3px", background: "#71717a", borderRadius: "2px" }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: "11px", color: "#71717a", fontWeight: 500 }}>Perfil público activo</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div onBlur={() => handleBlur("rubro")}>
                  <FormField 
                    label="Rubro o sector" 
                    icon={Building2} 
                    value={form.rubro} 
                    fieldName="rubro" 
                    onChange={handleChange} 
                    placeholder="Ej: Tecnología, Restaurante, Comercio" 
                    error={getFieldError("rubro")}
                  />
                </div>
                <div onBlur={() => handleBlur("descripcion")}>
                  <FormField 
                    label="Descripción de la empresa" 
                    value={form.descripcion} 
                    fieldName="descripcion" 
                    onChange={handleChange} 
                    isTextArea={true} 
                    placeholder="Cuéntanos sobre tu empresa: qué hacen, su misión, servicios..." 
                    error={getFieldError("descripcion")}
                  />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: Redes sociales */}
            <div className="setting-row">
              <div className="info-column">
                <h3>Redes sociales</h3>
                <p>Canales donde los clientes pueden encontrarte y contactarte.</p>
                
                <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "6px", maxWidth: "200px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Network size={12} color="#71717a"/>
                    <span style={{ fontSize: "11px", color: "#71717a", fontWeight: 500 }}>Conexiones disponibles</span>
                  </div>
                  <div style={{ height: "4px", background: "#f4f4f5", borderRadius: "4px", position: "relative", overflow: "hidden" }}>
                    <motion.div
                      animate={{ left: ["-20%", "120%"] }} 
                      transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
                      style={{ position: "absolute", width: "40%", height: "100%", background: "linear-gradient(90deg, transparent, #a1a1aa, transparent)", top: 0, borderRadius: "4px" }}
                    />
                  </div>
                </div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div onBlur={() => handleBlur("sitioWeb")}>
                  <FormField 
                    label="Sitio web" 
                    icon={Globe} 
                    value={form.sitioWeb} 
                    fieldName="sitioWeb" 
                    onChange={handleChange} 
                    placeholder="https://miempresa.com"
                    error={getFieldError("sitioWeb")}
                  />
                </div>
                <div onBlur={() => handleBlur("whatsapp")}>
                  <FormField 
                    label="WhatsApp" 
                    icon={FaWhatsapp} 
                    value={form.whatsapp} 
                    fieldName="whatsapp" 
                    onChange={handleChange} 
                    placeholder="+51 999 888 777"
                    error={getFieldError("whatsapp")}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "4px" }}>
                   <div onBlur={() => handleBlur("instagram")}>
                     <FormField 
                       label="Instagram" 
                       icon={FaInstagram} 
                       value={form.instagram} 
                       fieldName="instagram" 
                       onChange={handleChange} 
                       placeholder="@usuario"
                       error={getFieldError("instagram")}
                     />
                   </div>
                   <div onBlur={() => handleBlur("facebook")}>
                     <FormField 
                       label="Facebook" 
                       icon={FaFacebook} 
                       value={form.facebook} 
                       fieldName="facebook" 
                       onChange={handleChange} 
                       placeholder="@página"
                       error={getFieldError("facebook")}
                     />
                   </div>
                   <div style={{gridColumn: "1 / -1"}} onBlur={() => handleBlur("tiktok")}> 
                     <FormField 
                       label="TikTok" 
                       icon={FaTiktok} 
                       value={form.tiktok} 
                       fieldName="tiktok" 
                       onChange={handleChange} 
                       placeholder="@usuario"
                       error={getFieldError("tiktok")}
                     /> 
                   </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN 3: Datos de contacto */}
            <div className="setting-row" style={{ background: "#FAFAFA", paddingBottom: "36px" }}>
              <div className="info-column">
                <div style={{display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px"}}>
                  <h3>Datos de contacto</h3>
                </div>
                <p>Estos datos solo son visibles para estudiantes aceptados en tus proyectos.</p>
                
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "24px" }}>
                  <div style={{ position: "relative", width: "64px", height: "64px", background: "#f4f4f5", border: "1px solid #e4e4e7", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                    <Fingerprint size={38} color="#a1a1aa" strokeWidth={1.5} style={{ opacity: 0.6 }} />
                    
                    <motion.div
                      animate={{ top: ["-10%", "110%"] }} 
                      transition={{ duration: 1.6, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
                      style={{ 
                        position: "absolute", left: 0, right: 0, height: "2px", 
                        background: "#71717a", boxShadow: "0 0 10px 4px rgba(113, 113, 122, 0.4)", zIndex: 10 
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "11px", color: "#71717a", fontWeight: 500 }}>Datos protegidos</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div onBlur={() => handleBlur("emailContacto")}>
                  <FormField 
                    type="email" 
                    label="Correo electrónico" 
                    icon={Mail} 
                    value={form.emailContacto} 
                    fieldName="emailContacto" 
                    onChange={handleChange} 
                    placeholder="contacto@empresa.com"
                    error={getFieldError("emailContacto")}
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{gridColumn: "1 / -1"}} onBlur={() => handleBlur("direccion")}>
                    <FormField 
                      label="Dirección" 
                      icon={MapPin} 
                      value={form.direccion} 
                      fieldName="direccion" 
                      onChange={handleChange} 
                      placeholder="Jr. Amazonas 123, Cajamarca"
                      error={getFieldError("direccion")}
                    />
                  </div>
                  <div style={{gridColumn: "1 / -1"}} onBlur={() => handleBlur("telefono")}>
                    <FormField 
                      label="Teléfono" 
                      icon={Phone} 
                      value={form.telefono} 
                      fieldName="telefono" 
                      onChange={handleChange} 
                      placeholder="999 888 777"
                      error={getFieldError("telefono")}
                    />
                  </div>
                </div>

                {error && (
                  <div style={{ marginTop: "10px", padding: "14px", display: "flex", gap: "10px", background: "#fef2f2", borderRadius: "10px", border: "1px solid #fecaca", alignItems: "flex-start" }}>
                    <AlertCircle size={18} color="#ef4444" style={{flexShrink: 0}} />
                    <p style={{fontSize: "13px", color: "#b91c1c", margin: 0, fontWeight: 500, lineHeight: 1.5}}>{error}</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "16px 40px", borderTop: "1px solid #e4e4e7", background: "#fcfcfc", flexShrink: 0, gap: "12px" }}>
          <button type="button" onClick={onClose} disabled={isLoading} className="btn-secondary">Cancelar</button>
          <button type="button" onClick={handleSubmit} disabled={isLoading} className="btn-primary">
            {isLoading ? ( <><Loader2 size={16} style={{ animation: "spin 1.2s linear infinite" }} /> Guardando... </> ) : ( <>Guardar cambios<Save size={14} style={{ opacity: 0.8 }} /> </> )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}