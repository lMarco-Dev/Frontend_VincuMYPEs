// src/pages/admin/AdminUsuariosPage.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle2,
  Users,
  Building2,
  GraduationCap,
  ShieldCheck,
  Ban,
  Zap,
  ArrowRight,
  Loader2,
  Star,
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  X,
  Save,
  Mail,
  Phone,
  Calendar,
  Filter,
} from "lucide-react";
import { useAdminUsuarios } from "@/features/admin/useAdminUsuarios";

const FONT = "'Angro Std', 'Outfit', sans-serif";

// ─── Animaciones ───
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Helper Visual para Roles ───────────────────────────────────────────
const getRolConfig = (rol) => {
  switch (rol) {
    case "ESTUDIANTE":
      return {
        icon: GraduationCap,
        label: "Estudiante",
        color: "#1B6FE8",
        bg: "#EFF6FF",
        border: "#BFDBFE",
        badgeColor: "#2563EB",
      };
    case "MYPE":
      return {
        icon: Building2,
        label: "Empresa",
        color: "#059669",
        bg: "#ECFDF5",
        border: "#A7F3D0",
        badgeColor: "#059669",
      };
    case "ADMIN":
      return {
        icon: ShieldCheck,
        label: "Admin",
        color: "#7C3AED",
        bg: "#F5F3FF",
        border: "#DDD6FE",
        badgeColor: "#7C3AED",
      };
    default:
      return {
        icon: Users,
        label: "Usuario",
        color: "#6B7280",
        bg: "#F3F4F6",
        border: "#E5E7EB",
        badgeColor: "#6B7280",
      };
  }
};

// ─── FILTROS MODERNOS ───────────────────────────────────────────────────
const FilterButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 20px",
      borderRadius: "1rem",
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.2s ease",
      background: active ? "linear-gradient(135deg, #1B6FE8, #0E54C4)" : "#fff",
      color: active ? "#fff" : "#475569",
      border: active ? "none" : "1px solid #E5E7EB",
      boxShadow: active ? "0 4px 12px rgba(27,111,232,0.25)" : "none",
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.background = "#F8FAFC";
        e.currentTarget.style.borderColor = "#CBD5E1";
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.background = "#fff";
        e.currentTarget.style.borderColor = "#E5E7EB";
      }
    }}
  >
    {Icon && <Icon size={16} />}
    {children}
  </button>
);

// ─── MODAL: Crear/Editar Usuario ────────────────────────────────────────
function ModalUsuarioForm({ isOpen, onClose, usuario, onSave, isSaving }) {
  const isEditing = !!usuario;
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    rol: "ESTUDIANTE",
    codigoEstudiante: "",
    carrera: "Ingeniería de Sistemas Computacionales",
    universidad: "Universidad Privada del Norte",
    nombreComercial: "",
    razonSocial: "",
    ruc: "",
    rubro: "",
    direccion: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (usuario && isEditing) {
      setFormData({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        password: "",
        telefono: usuario.telefono || "",
        rol: usuario.rol || "ESTUDIANTE",
        codigoEstudiante: usuario.codigoEstudiante || "",
        carrera: usuario.carrera || "Ingeniería de Sistemas Computacionales",
        universidad: usuario.universidad || "Universidad Privada del Norte",
        nombreComercial: usuario.nombreComercial || "",
        razonSocial: usuario.razonSocial || "",
        ruc: usuario.ruc || "",
        rubro: usuario.rubro || "",
        direccion: usuario.direccion || "",
      });
    } else {
      setFormData({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
        rol: "ESTUDIANTE",
        codigoEstudiante: "",
        carrera: "Ingeniería de Sistemas Computacionales",
        universidad: "Universidad Privada del Norte",
        nombreComercial: "",
        razonSocial: "",
        ruc: "",
        rubro: "",
        direccion: "",
      });
    }
    setErrors({});
  }, [usuario, isEditing, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.email.trim()) newErrors.email = "El email es obligatorio";
    if (!isEditing && !formData.password)
      newErrors.password = "La contraseña es obligatoria";
    if (!isEditing && formData.password && formData.password.length < 8) {
      newErrors.password = "Mínimo 8 caracteres";
    }
    if (formData.telefono && !/^\d{9}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener 9 dígitos";
    }
    if (formData.rol === "ESTUDIANTE") {
      if (!formData.codigoEstudiante)
        newErrors.codigoEstudiante = "El código de estudiante es obligatorio";
      if (
        formData.codigoEstudiante &&
        !/^N00\d{6}$/.test(formData.codigoEstudiante)
      ) {
        newErrors.codigoEstudiante = "Formato: N00XXXXXX";
      }
    }
    if (formData.rol === "MYPE") {
      if (!formData.nombreComercial)
        newErrors.nombreComercial = "Nombre comercial obligatorio";
      if (formData.ruc && !/^(10|20)\d{9}$/.test(formData.ruc)) {
        newErrors.ruc = "RUC debe tener 11 dígitos y empezar con 10 o 20";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const submitData = { ...formData };
    if (isEditing && !submitData.password) delete submitData.password;
    await onSave(submitData);
    if (!isSaving) onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  if (!isOpen) return null;

  const ROLES = [
    { value: "ESTUDIANTE", label: "Estudiante" },
    { value: "MYPE", label: "Empresa" },
    { value: "ADMIN", label: "Administrador" },
  ];

  const CARRERAS = [
    "Ingeniería de Sistemas Computacionales",
    "Ingeniería de Software",
    "Ciencias de la Computación",
    "Administración de Empresas",
  ];

  const UNIVERSIDADES = [
    "Universidad Privada del Norte",
    "Universidad Nacional de Cajamarca",
    "Universidad Antonio Guillermo Urrelo",
  ];

  const inputSt = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    fontFamily: FONT,
    fontSize: 13,
    border: "1px solid #E5E7EB",
    outline: "none",
    background: "#fff",
    color: "#111827",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };

  const labelSt = {
    fontFamily: FONT,
    fontSize: 11,
    fontWeight: 700,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "block",
    marginBottom: 6,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              {isEditing ? <Save size={20} /> : <UserPlus size={20} />}
              {isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isEditing
                ? "Modifica los datos del usuario"
                : "Registra un nuevo usuario en la plataforma"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Información básica
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelSt}>
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.nombre
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200"
                  }`}
                />
                {errors.nombre && (
                  <p className="text-[10px] text-red-500 mt-1">
                    {errors.nombre}
                  </p>
                )}
              </div>
              <div>
                <label style={labelSt}>
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200"
                  }`}
                />
                {errors.email && (
                  <p className="text-[10px] text-red-500 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={labelSt}>
                  Contraseña{" "}
                  {!isEditing && <span className="text-red-500">*</span>}
                  {isEditing && (
                    <span className="text-slate-400 text-[10px] ml-1">
                      (dejar vacío para mantener)
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200"
                  }`}
                />
                {errors.password && (
                  <p className="text-[10px] text-red-500 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>
              <div>
                <label style={labelSt}>Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="9 dígitos"
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    errors.telefono
                      ? "border-red-300 bg-red-50"
                      : "border-slate-200"
                  }`}
                />
                {errors.telefono && (
                  <p className="text-[10px] text-red-500 mt-1">
                    {errors.telefono}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label style={labelSt}>Rol</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {ROLES.map((rol) => (
                  <option key={rol.value} value={rol.value}>
                    {rol.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.rol === "ESTUDIANTE" && (
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Datos del Estudiante
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelSt}>
                    Código de estudiante <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="codigoEstudiante"
                    value={formData.codigoEstudiante}
                    onChange={handleChange}
                    placeholder="N00XXXXXX"
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm ${
                      errors.codigoEstudiante
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200"
                    }`}
                  />
                  {errors.codigoEstudiante && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.codigoEstudiante}
                    </p>
                  )}
                </div>
                <div>
                  <label style={labelSt}>Carrera</label>
                  <select
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  >
                    {CARRERAS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelSt}>Universidad</label>
                <select
                  name="universidad"
                  value={formData.universidad}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                >
                  {UNIVERSIDADES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {formData.rol === "MYPE" && (
            <div className="space-y-4 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Datos de la Empresa
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelSt}>
                    Nombre Comercial <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombreComercial"
                    value={formData.nombreComercial}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm ${
                      errors.nombreComercial
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200"
                    }`}
                  />
                  {errors.nombreComercial && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.nombreComercial}
                    </p>
                  )}
                </div>
                <div>
                  <label style={labelSt}>Razón Social</label>
                  <input
                    type="text"
                    name="razonSocial"
                    value={formData.razonSocial}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelSt}>RUC</label>
                  <input
                    type="text"
                    name="ruc"
                    value={formData.ruc}
                    onChange={handleChange}
                    placeholder="11 dígitos"
                    className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm ${errors.ruc ? "border-red-300 bg-red-50" : "border-slate-200"}`}
                  />
                  {errors.ruc && (
                    <p className="text-[10px] text-red-500 mt-1">
                      {errors.ruc}
                    </p>
                  )}
                </div>
                <div>
                  <label style={labelSt}>Rubro</label>
                  <input
                    type="text"
                    name="rubro"
                    value={formData.rubro}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label style={labelSt}>Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          )}
        </form>

        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : isEditing ? (
              "Guardar cambios"
            ) : (
              "Crear usuario"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL: Ver Detalle de Usuario ──────────────────────────────────────
function ModalDetalleUsuario({ isOpen, onClose, usuario }) {
  if (!isOpen || !usuario) return null;
  const config = getRolConfig(usuario.rol);
  const Icono = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden relative z-10 flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Eye size={20} /> Detalle del Usuario
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${config.bg} ${config.border}`}
              style={{ color: config.color }}
            >
              <Icono size={28} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">
                {usuario.nombre}
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-1">
                <Mail size={12} /> {usuario.email}
              </p>
              {usuario.telefono && (
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                  <Phone size={12} /> {usuario.telefono}
                </p>
              )}
              <span
                className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold mt-2 ${config.bg}`}
                style={{ color: config.color }}
              >
                {config.label}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
              Estado de la cuenta
            </p>
            <div className="flex items-center gap-2">
              {usuario.estado === "ACTIVO" ? (
                <span className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 size={16} /> Activo
                </span>
              ) : (
                <span className="flex items-center gap-2 text-red-500">
                  <Ban size={16} /> Suspendido
                </span>
              )}
            </div>
          </div>

          {usuario.rol === "ESTUDIANTE" && (
            <>
              <div className="border-t border-slate-100 pt-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                  Datos Académicos
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Código</p>
                    <p className="text-sm font-bold text-slate-800">
                      {usuario.codigoEstudiante || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Carrera</p>
                    <p className="text-sm font-bold text-slate-800">
                      {usuario.carrera || "—"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-slate-500">Universidad</p>
                    <p className="text-sm font-bold text-slate-800">
                      {usuario.universidad || "—"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 flex justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Límite
                  </p>
                  <p className="text-xl font-black text-slate-800">
                    {usuario.limiteProyectos || 1}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Promedio
                  </p>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <span className="text-xl font-black text-slate-800">
                      {usuario.promedioEstrellas || "—"}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">
                    Completados
                  </p>
                  <p className="text-xl font-black text-slate-800">
                    {usuario.proyectosCompletados || 0}
                  </p>
                </div>
              </div>
            </>
          )}

          {usuario.rol === "MYPE" && (
            <div className="border-t border-slate-100 pt-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">
                Datos de la Empresa
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-slate-500">Nombre Comercial</p>
                  <p className="text-sm font-bold text-slate-800">
                    {usuario.nombreComercial || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">RUC</p>
                  <p className="text-sm font-bold text-slate-800">
                    {usuario.ruc || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Rubro</p>
                  <p className="text-sm font-bold text-slate-800">
                    {usuario.rubro || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Razón Social</p>
                  <p className="text-sm font-bold text-slate-800">
                    {usuario.razonSocial || "—"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-slate-500">Dirección</p>
                  <p className="text-sm font-bold text-slate-800">
                    {usuario.direccion || "—"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL: Eliminar Usuario ─────────────────────────────────────────────
function ModalEliminarUsuario({
  isOpen,
  onClose,
  usuario,
  onConfirm,
  isDeleting,
}) {
  if (!isOpen || !usuario) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10">
        <div className="p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={32} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-2">
            Eliminar usuario
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            ¿Estás seguro de que deseas eliminar a{" "}
            <strong className="text-slate-800">{usuario.nombre}</strong>?
          </p>
          <p className="text-xs text-slate-400 bg-amber-50 p-3 rounded-xl mb-6">
            ⚠️ Esta acción eliminará permanentemente al usuario y todos sus
            datos asociados.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <Trash2 size={16} />
              )}
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL: Bypass (Límite de proyectos) ─────────────────────────────────
function ModalBypass({
  isOpen,
  onClose,
  usuario,
  nuevoLimite,
  setNuevoLimite,
  onConfirm,
  isCambiandoBypass,
  errorBypass,
}) {
  if (!isOpen || !usuario) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
            <Zap size={24} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 mb-2">
            Permiso Especial (Bypass)
          </h3>
          <p className="text-sm text-slate-500 font-medium mb-6">
            Estás a punto de modificar el límite de proyectos activos para el
            estudiante{" "}
            <strong className="text-slate-800">{usuario.nombre}</strong>.
          </p>
          {errorBypass && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
              {errorBypass}
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Límite actual
              </p>
              <p className="text-2xl font-black text-slate-800">
                {usuario.limiteProyectos || 1}
              </p>
            </div>
            <ArrowRight size={20} className="text-slate-300" />
            <div className="text-right flex flex-col items-end">
              <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
                Nuevo límite
              </p>
              <input
                type="number"
                min="1"
                max="10"
                value={nuevoLimite}
                onChange={(e) => setNuevoLimite(Number(e.target.value))}
                className="w-20 text-center font-black text-2xl text-amber-600 bg-white border border-slate-200 rounded-xl py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={isCambiandoBypass}
              className="flex-1 py-3 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isCambiandoBypass ? "Aplicando..." : "Aplicar Excepción"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════════════
export default function AdminUsuariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroRol, setFiltroRol] = useState("TODOS");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    sortField: "id",
    sortDirection: "asc",
    rol: null,
  });

  const [modalCrearEditar, setModalCrearEditar] = useState({
    isOpen: false,
    usuario: null,
  });
  const [modalDetalle, setModalDetalle] = useState({
    isOpen: false,
    usuario: null,
  });
  const [modalEliminar, setModalEliminar] = useState({
    isOpen: false,
    usuario: null,
  });
  const [modalBypass, setModalBypass] = useState({
    isOpen: false,
    usuario: null,
  });
  const [nuevoLimite, setNuevoLimite] = useState(3);

  const {
    usuarios,
    totalPages,
    isLoading,
    cambiarEstado,
    isCambiandoEstado,
    cambiarBypassLimite,
    isCambiandoBypass,
    errorBypass,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    isCreando,
    isActualizando,
    isEliminando,
  } = useAdminUsuarios(pagination);

  // Actualizar paginación cuando cambia el filtro
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      page: 0,
      rol: filtroRol === "TODOS" ? null : filtroRol,
    }));
  }, [filtroRol]);

  const openBypassModal = (usuario) => {
    setNuevoLimite((usuario.limiteProyectos || 1) + 1);
    setModalBypass({ isOpen: true, usuario });
  };

  const handleToggleEstado = (usuario) => {
    const actionName = usuario.estado === "ACTIVO" ? "suspender" : "reactivar";
    if (
      window.confirm(
        `¿Estás seguro de que deseas ${actionName} la cuenta de ${usuario.nombre}?`,
      )
    ) {
      cambiarEstado(usuario.id);
    }
  };

  const handleApplyBypass = () => {
    if (!modalBypass.usuario) return;
    cambiarBypassLimite(
      { estudianteId: modalBypass.usuario.id, nuevoLimite: nuevoLimite },
      { onSuccess: () => setModalBypass({ isOpen: false, usuario: null }) },
    );
  };

  const handleCrearUsuario = async (data) => await crearUsuario(data);
  const handleActualizarUsuario = async (data) =>
    await actualizarUsuario({ usuarioId: modalCrearEditar.usuario.id, data });
  const handleEliminarUsuario = async () => {
    await eliminarUsuario({
      usuarioId: modalEliminar.usuario.id,
      permanente: true,
    });
    setModalEliminar({ isOpen: false, usuario: null });
  };

  // Filtrado local para búsqueda por nombre/email
  const filteredUsuarios = usuarios.filter((u) => {
    const matchesSearch =
      u.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filterOptions = [
    { value: "TODOS", label: "Todos", icon: Users },
    { value: "ESTUDIANTE", label: "Estudiantes", icon: GraduationCap },
    { value: "MYPE", label: "Empresas", icon: Building2 },
    { value: "ADMIN", label: "Administradores", icon: ShieldCheck },
  ];

  return (
    <div
      className="space-y-6 pb-12"
      style={{ fontFamily: FONT, maxWidth: 1400, margin: "0 auto" }}
    >
      {/* Header simple sin Hero Banner */}
      <motion.div {...fadeUp(0)} className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Gestión de Usuarios
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra estudiantes, empresas y administradores de la plataforma
          </p>
        </div>
        <button
          onClick={() => setModalCrearEditar({ isOpen: true, usuario: null })}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-cyan-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5"
        >
          <UserPlus size={18} /> Nuevo Usuario
        </button>
      </motion.div>

      {/* Filtros Modernos */}
      <motion.div
        {...fadeUp(0.05)}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <FilterButton
              key={opt.value}
              active={filtroRol === opt.value}
              onClick={() => setFiltroRol(opt.value)}
              icon={opt.icon}
            >
              {opt.label}
            </FilterButton>
          ))}
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 w-72 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </motion.div>

      {/* Tabla de Usuarios - Limpia y Ordenada */}
      <motion.div
        {...fadeUp(0.1)}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2
                      className="animate-spin text-primary mx-auto"
                      size={32}
                    />
                    <p className="text-slate-500 text-sm mt-3">
                      Cargando usuarios...
                    </p>
                  </td>
                </tr>
              ) : filteredUsuarios.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Users size={40} className="mx-auto text-slate-300 mb-3" />
                    <p className="text-slate-500 font-medium">
                      No se encontraron usuarios
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Prueba con otros términos de búsqueda
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsuarios.map((usuario) => {
                  const config = getRolConfig(usuario.rol);
                  const Icono = config.icon;

                  return (
                    <tr
                      key={usuario.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg} border ${config.border}`}
                          >
                            <Icono size={18} style={{ color: config.color }} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">
                              {usuario.nombre}
                            </p>
                            {usuario.rol === "ESTUDIANTE" &&
                              usuario.promedioEstrellas != null && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Star
                                    size={10}
                                    className="text-amber-400 fill-amber-400"
                                  />
                                  <span className="text-[10px] text-slate-500">
                                    {usuario.promedioEstrellas} ·{" "}
                                    {usuario.proyectosCompletados || 0}{" "}
                                    completados
                                  </span>
                                </div>
                              )}
                            {usuario.carrera && (
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {usuario.carrera}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-700">
                          {usuario.email}
                        </p>
                        {usuario.telefono && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            {usuario.telefono}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-bold ${config.bg} border ${config.border}`}
                          style={{ color: config.color }}
                        >
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {usuario.estado === "ACTIVO" ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-medium">
                            <CheckCircle2 size={12} /> Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-red-500 text-xs font-medium">
                            <Ban size={12} /> Suspendido
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              setModalDetalle({ isOpen: true, usuario })
                            }
                            className="p-2 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Ver detalle"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() =>
                              setModalCrearEditar({ isOpen: true, usuario })
                            }
                            className="p-2 text-slate-400 hover:text-primary hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 size={16} />
                          </button>
                          {usuario.rol !== "ADMIN" && (
                            <button
                              onClick={() =>
                                setModalEliminar({ isOpen: true, usuario })
                              }
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                          {usuario.rol === "ESTUDIANTE" &&
                            usuario.estado === "ACTIVO" && (
                              <button
                                onClick={() => openBypassModal(usuario)}
                                className="p-2 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                                title="Aumentar límite"
                              >
                                <Zap size={16} />
                              </button>
                            )}
                          {usuario.rol !== "ADMIN" && (
                            <button
                              onClick={() => handleToggleEstado(usuario)}
                              disabled={isCambiandoEstado}
                              className={`p-2 rounded-lg transition-colors ${usuario.estado === "ACTIVO" ? "text-red-600 bg-red-50 hover:bg-red-100" : "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"}`}
                              title={
                                usuario.estado === "ACTIVO"
                                  ? "Suspender"
                                  : "Reactivar"
                              }
                            >
                              {usuario.estado === "ACTIVO" ? (
                                <Ban size={16} />
                              ) : (
                                <CheckCircle2 size={16} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-slate-200 flex justify-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
              <button
                key={i}
                onClick={() => setPagination((prev) => ({ ...prev, page: i }))}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${pagination.page === i ? "bg-primary text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Modales */}
      <ModalUsuarioForm
        isOpen={modalCrearEditar.isOpen}
        onClose={() => setModalCrearEditar({ isOpen: false, usuario: null })}
        usuario={modalCrearEditar.usuario}
        onSave={
          modalCrearEditar.usuario
            ? handleActualizarUsuario
            : handleCrearUsuario
        }
        isSaving={isCreando || isActualizando}
      />
      <ModalDetalleUsuario
        isOpen={modalDetalle.isOpen}
        onClose={() => setModalDetalle({ isOpen: false, usuario: null })}
        usuario={modalDetalle.usuario}
      />
      <ModalEliminarUsuario
        isOpen={modalEliminar.isOpen}
        onClose={() => setModalEliminar({ isOpen: false, usuario: null })}
        usuario={modalEliminar.usuario}
        onConfirm={handleEliminarUsuario}
        isDeleting={isEliminando}
      />
      <ModalBypass
        isOpen={modalBypass.isOpen}
        onClose={() => setModalBypass({ isOpen: false, usuario: null })}
        usuario={modalBypass.usuario}
        nuevoLimite={nuevoLimite}
        setNuevoLimite={setNuevoLimite}
        onConfirm={handleApplyBypass}
        isCambiandoBypass={isCambiandoBypass}
        errorBypass={errorBypass}
      />
    </div>
  );
}
