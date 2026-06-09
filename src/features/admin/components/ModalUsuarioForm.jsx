// src/features/admin/components/ModalUsuarioForm.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Save, Loader2 } from "lucide-react";

const ROLES = [
  { value: "ESTUDIANTE", label: "Estudiante" },
  { value: "MYPE", label: "MYPE" },
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

export default function ModalUsuarioForm({
  isOpen,
  onClose,
  usuario,
  onSave,
  isSaving,
}) {
  const isEditing = !!usuario;

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
    rol: "ESTUDIANTE",
    // Estudiante
    codigoEstudiante: "",
    carrera: "Ingeniería de Sistemas Computacionales",
    universidad: "Universidad Privada del Norte",
    // MYPE
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col"
          >
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
              {/* Información básica */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Información básica
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
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
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
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
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Contraseña{" "}
                      {!isEditing && <span className="text-red-500">*</span>}
                      {isEditing && (
                        <span className="text-slate-400 text-[10px]">
                          {" "}
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
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Teléfono
                    </label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Rol
                  </label>
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

              {/* Campos específicos de Estudiante */}
              {formData.rol === "ESTUDIANTE" && (
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Datos del Estudiante
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Código de estudiante{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="codigoEstudiante"
                        value={formData.codigoEstudiante}
                        onChange={handleChange}
                        placeholder="N00XXXXXX"
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
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
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Carrera
                      </label>
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
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Universidad
                    </label>
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

              {/* Campos específicos de MYPE */}
              {formData.rol === "MYPE" && (
                <div className="space-y-4 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                    Datos de la Empresa
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
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
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Razón Social
                      </label>
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
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        RUC
                      </label>
                      <input
                        type="text"
                        name="ruc"
                        value={formData.ruc}
                        onChange={handleChange}
                        placeholder="11 dígitos"
                        className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm ${
                          errors.ruc
                            ? "border-red-300 bg-red-50"
                            : "border-slate-200"
                        }`}
                      />
                      {errors.ruc && (
                        <p className="text-[10px] text-red-500 mt-1">
                          {errors.ruc}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Rubro
                      </label>
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
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Dirección
                    </label>
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
