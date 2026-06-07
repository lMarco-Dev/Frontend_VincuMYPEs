import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import {
  Award,
  Search,
  Download,
  Loader2,
  Calendar,
  Building2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Helper para formatear fecha ─────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// ─── Obtener certificados desde el backend ──────────────────────────────────
const getCertificadosAdmin = async () => {
  const response = await httpClient.get("/certificados/admin/todos");
  return response.data;
};

// ─── Función para descargar certificado (usa la URL almacenada) ─────────────
const descargarCertificado = (url, nombreArchivo) => {
  if (!url) return;
  const link = document.createElement("a");
  link.href = url;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ─── Componente principal ───────────────────────────────────────────────────
export default function AdminCertificadosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: certificados = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["admin-certificados"],
    queryFn: getCertificadosAdmin,
  });

  // Filtrar por código, estudiante, proyecto o MYPE
  const filtered = certificados.filter((cert) => {
    const term = searchTerm.toLowerCase();
    return (
      cert.codigo?.toLowerCase().includes(term) ||
      cert.nombreEstudiante?.toLowerCase().includes(term) ||
      cert.nombreProyecto?.toLowerCase().includes(term) ||
      cert.nombreMype?.toLowerCase().includes(term)
    );
  });

  // Paginación
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Resetear página cuando cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Si está cargando
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-slate-500 font-medium mt-4">
          Cargando certificados...
        </p>
      </div>
    );
  }

  // Si hay error
  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
        <p className="text-red-600 font-medium">
          Error al cargar los certificados
        </p>
        <p className="text-sm text-red-500 mt-1">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header con métricas rápidas */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Award size={24} className="text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Certificados emitidos
            </h1>
            <p className="text-sm text-slate-500">
              Administra todos los certificados digitales generados en la
              plataforma
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-2xl font-black text-indigo-600">
              {certificados.length}
            </span>
            <span className="text-slate-400">certificados totales</span>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Buscar por código, estudiante, proyecto o empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-3">
          Mostrando {filtered.length} de {certificados.length} certificados
        </p>
      </div>

      {/* Tabla de certificados */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award size={32} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            No hay certificados
          </h3>
          <p className="text-sm text-slate-500">
            {searchTerm
              ? "No se encontraron certificados con esos criterios."
              : "Aún no se ha emitido ningún certificado."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Código
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Estudiante
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Proyecto
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Empresa
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Fecha emisión
                  </th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginated.map((cert) => (
                  <tr
                    key={cert.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                        {cert.codigo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                          {cert.nombreEstudiante?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {cert.nombreEstudiante}
                          </p>
                          <p className="text-xs text-slate-400">
                            {cert.emailEstudiante}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 font-medium">
                        {cert.nombreProyecto}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Building2 size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {cert.nombreMype}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600">
                          {formatDate(cert.fechaEmision)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            descargarCertificado(
                              cert.urlCertificado,
                              `certificado-${cert.codigo}.pdf`
                            )
                          }
                          disabled={!cert.urlCertificado}
                          className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Descargar PDF"
                        >
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Mostrando {startIndex + 1} -{" "}
                {Math.min(startIndex + itemsPerPage, filtered.length)} de{" "}
                {filtered.length}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}