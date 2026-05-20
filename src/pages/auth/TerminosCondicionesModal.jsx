import React, { useState, useRef } from "react";

export function TerminosCondicionesModal({ isOpen, onClose, onAccept }) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef(null);

  const handleScroll = (e) => {
    const element = e.target;
    // Usamos un margen de 2px para evitar fallos por el zoom de las pantallas
    const isBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) <= 2;
    
    if (isBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f1f3d]/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh]">
        
        {/* Cabecera Fija */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200 shrink-0">
          <h2 className="text-lg sm:text-xl font-bold text-[#0f1f3d]">
            Términos y Condiciones de Uso
          </h2>
        </div>

        {/* Cuerpo Scrolleable - Justificado y Responsivo */}
        <div 
          ref={contentRef}
          onScroll={handleScroll}
          className="px-5 py-4 sm:px-6 sm:py-5 overflow-y-auto flex-1 space-y-5 text-sm text-slate-600 custom-scrollbar text-justify leading-relaxed"
        >
          <section>
            <h3 className="font-bold text-slate-900 mb-2 text-left">1. Identificación de la plataforma</h3>
            <p>
              Linkuy es una plataforma académico-empresarial operada como proyecto de innovación de la Universidad Privada del Norte, sede Cajamarca. Su propósito es conectar microempresas con estudiantes de ingeniería para desarrollar proyectos tecnológicos de manera colaborativa. Al marcar la casilla de aceptación, declaras haber leído, comprendido y aceptado en su totalidad los presentes términos para el uso del sistema.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2 text-left">2. Elegibilidad y registro</h3>
            <p>
              Para registrarte como estudiante debes ser alumno activo de la carrera de Ingeniería de Sistemas Computacionales de la Universidad Privada del Norte, lo cual será verificado mediante tu documento de identidad vía RENIEC y tu código universitario. Si te registras como empresa, debes ser el representante legal o autorizado de una microempresa con registro único de contribuyente activo ante la SUNAT. En ambos casos, declaras que la información proporcionada es verídica y exacta. La plataforma se reserva el derecho de suspender de manera definitiva aquellas cuentas que contengan información falsa o fraudulenta.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2 text-left">3. Uso aceptable</h3>
            <p>
              El usuario se compromete a usar la plataforma exclusivamente para la publicación y postulación a proyectos tecnológicos de corto plazo. Queda estrictamente prohibido solicitar o aceptar pagos de dinero por fuera de la plataforma entre estudiantes y empresas, ya que el servicio se brinda de forma gratuita. Asimismo, no está permitido publicar proyectos con fines comerciales puros, políticos, discriminatorios o ilegales, ni comercializar o compartir información confidencial de otros usuarios obtenida a través de nuestras interfaces.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2 text-left">4. Reglas para estudiantes</h3>
            <p>
              El estudiante podrá tener activo un solo proyecto de forma simultánea, aunque el equipo de administración puede habilitar un segundo proyecto previa solicitud debidamente justificada. Es importante destacar que el abandono injustificado de un proyecto, entendido como la inactividad durante más de setenta y dos horas sin aviso previo a la empresa, constituye una falta grave que quedará registrada en el historial del alumno y causará la suspensión temporal o permanente de la cuenta. Al ser seleccionado, el estudiante asume el compromiso total de entregar los productos en los plazos y con la calidad previamente pactados.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2 text-left">5. Reglas para empresas</h3>
            <p>
              La empresa contratante se compromete a no exigir al estudiante tareas que excedan el alcance definido originalmente en la descripción del proyecto ni solicitar condiciones de exclusividad. Por su parte, la empresa asume la obligation de revisar el trabajo y proporcionar retroalimentación constructiva sobre los entregables en un plazo máximo de cinco días hábiles desde el momento en que el estudiante realiza la subida de los archivos en el sistema.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2 text-left">6. Propiedad intelectual</h3>
            <p>
              Los entregables producidos durante el desarrollo del proyecto, tales como el código fuente, bases de datos, manuales o diseños, pasan a ser propiedad exclusiva de la empresa contratante una vez que esta aprueba formalmente el cierre del proyecto en la plataforma. Sin embargo, el estudiante conserva en todo momento el derecho irrenunciable de mencionar y exhibir el proyecto en su portafolio profesional y currículum, siempre y cuando se abstenga de revelar información interna o de carácter confidencial de la empresa.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2 text-left">7. Privacidad y protección de datos</h3>
            <p>
              En estricto cumplimiento de la normativa de protección de datos personales del Perú, recopilamos datos de identidad y actividad de los usuarios con el único fin de operar la plataforma, facilitar las conexiones entre las partes y emitir las constancias correspondientes. No compartimos tu información personal con terceros para fines comerciales o publicitarios de ninguna índole. Los datos se conservan durante la vigencia de tu cuenta y por un periodo adicional de tres años tras tu última actividad para fines de auditoría académica. Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición enviando una solicitud formal a nuestro correo de contacto.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2 text-left">8. Responsabilidad y constancias</h3>
            <p>
              Linkuy actúa únicamente como un intermediario tecnológico y académico, por lo que no asume responsabilidad alguna por los incumplimientos, daños o disputas que puedan surgir de la relación directa entre los estudiantes y las empresas. La plataforma se ofrece en fase de pruebas y puede estar sujeta a periodos de mantenimiento que afecten temporalmente su disponibilidad. Las constancias emitidas al finalizar exitosamente un proyecto acreditan la participación del estudiante, pero su validez oficial o laboral depende exclusivamente del criterio de la institución o empleador externo que las evalúe.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2 text-left">9. Jurisdicción y contacto</h3>
            <p>
              Este documento legal se rige bajo las leyes de la República del Perú y cualquier controversia derivada de su aplicación será sometida a la jurisdicción de los tribunales de la ciudad de Cajamarca. Nos reservamos el derecho de modificar estos términos en el futuro, comprometiéndonos a notificar a los usuarios registrados con siete días de anticipación. Para cualquier consulta, reclamo o asistencia técnica puedes comunicarte en cualquier momento al correo contacto@linkuy.pe.
            </p>
          </section>
        </div>

        {/* Controles y Botón de Aceptar */}
        <div className="px-5 py-4 sm:px-6 border-t border-slate-200 bg-slate-50 rounded-b-xl shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left w-full sm:w-auto">
            {!hasScrolledToBottom ? (
              <p className="text-xs font-medium text-[#d4580a]">
                Desplázate hasta el final para habilitar el botón de aceptación.
              </p>
            ) : (
              <p className="text-xs font-medium text-emerald-600">
                ¡Gracias por leer! Ya puedes aceptar los términos.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors w-full sm:w-auto"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              disabled={!hasScrolledToBottom}
              className="px-5 py-2 text-sm font-semibold text-white bg-[#0f1f3d] rounded-lg hover:bg-[#1a3059] disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full sm:w-auto"
            >
              Aceptar términos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}