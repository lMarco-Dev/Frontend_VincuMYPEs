import React, { useState, useRef } from "react";

export function TerminosCondicionesModal({ isOpen, onClose, onAccept }) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (e) => {
    const el = e.target;
    const isBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) <= 4;
    if (isBottom && !hasScrolledToBottom) setHasScrolledToBottom(true);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(15,31,61,0.65)", backdropFilter: "blur(6px)",
      padding: "16px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 12,
        width: "100%", maxWidth: 660,
        boxShadow: "0 24px 64px rgba(15,31,61,0.22)",
        display: "flex", flexDirection: "column",
        maxHeight: "90vh", overflow: "hidden",
        fontFamily: "Arial, 'Helvetica Neue', sans-serif",
      }}>

        {/* ── Cabecera fija ── */}
        <div style={{
          padding: "20px 28px 18px",
          borderBottom: "1px solid #e5e7eb",
          flexShrink: 0,
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 6 }}>
            Versión 1.0 · Mayo 2026
          </p>
          <h2 style={{ fontFamily: "Arial, sans-serif", fontSize: 18, fontWeight: 900, color: "#0f1f3d", letterSpacing: "-0.02em", margin: 0 }}>
            Términos y Condiciones de Uso
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280", marginTop: 5, lineHeight: 1.5 }}>
            Lee el documento completo antes de aceptar. Desplázate hasta el final del texto para habilitar el botón de aceptación.
          </p>
        </div>

        {/* ── Caja de texto scrolleable ── */}
        <div
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 28px",
            margin: "16px",
            marginBottom: 0,
            border: "1.5px solid #e5e7eb",
            borderRadius: 8,
            background: "#f9fafb",
            fontSize: 13.5,
            lineHeight: 1.75,
            color: "#374151",
            textAlign: "justify",
          }}
        >

          {/* Preámbulo */}
          <p style={{ marginBottom: 20, color: "#4b5563" }}>
            Estos Términos y Condiciones (en adelante, los "Términos") rigen el acceso y uso de la plataforma Linkuy, disponible en linkuy.pe (en adelante, la "Plataforma") y todos los servicios ofrecidos a través de ella (en adelante, los "Servicios"). La Plataforma es operada por el equipo de Linkuy en el marco de un proyecto académico universitario.
          </p>
          <p style={{ marginBottom: 28, color: "#4b5563" }}>
            Al hacer clic en "Aceptar los Términos y Condiciones", el Usuario: (a) declara haber leído y comprendido en su totalidad el presente documento, y (b) acepta quedar vinculado por sus disposiciones de manera plena y sin reservas. En caso de no estar de acuerdo, el Usuario deberá abstenerse de registrarse y de utilizar los Servicios.
          </p>

          <Hr />

          {/* 1 */}
          <Section num="1" title="TÉRMINOS Y SU ACEPTACIÓN">
            <Sub>1.1. Acceso a la Plataforma</Sub>
            <P>El registro en la Plataforma es obligatorio para acceder a los Servicios. El registro requiere la verificación de identidad mediante los mecanismos indicados en la cláusula 2 y la aceptación expresa de estos Términos.</P>

            <Sub>1.2. Uso de la Plataforma</Sub>
            <P>El Usuario se compromete a utilizar la Plataforma de conformidad con estos Términos, la legislación peruana vigente, la moral y las buenas costumbres. El Usuario se obliga a abstenerse de utilizar la Plataforma con fines ilícitos, contrarios a estos Términos, o que puedan dañar, inutilizar o deteriorar la Plataforma, sus Servicios o los derechos de terceros.</P>

            <Sub>1.3. Naturaleza del Servicio</Sub>
            <P>Linkuy es una plataforma de conexión académico-empresarial que facilita el encuentro entre microempresas y pequeñas empresas (en adelante, "MYPEs") y estudiantes universitarios de ingeniería para el desarrollo de proyectos tecnológicos acotados y de corto plazo. Los proyectos publicados en la Plataforma son de naturaleza <strong>no remunerada</strong>: su propósito es que los estudiantes adquieran experiencia preprofesional real y verificable, y que las MYPEs accedan a soluciones tecnológicas sin costo.</P>
            <P>Linkuy actúa exclusivamente como intermediario tecnológico. No es parte en ninguna relación que se establezca entre Usuarios, y no interviene ni garantiza el cumplimiento de acuerdos que los Usuarios celebren por fuera de los proyectos registrados en la Plataforma.</P>

            <Sub>1.4. Naturaleza académica y no laboral de la relación</Sub>
            <P>La relación que se establece entre el estudiante y la MYPE a través de la Plataforma tiene una finalidad exclusivamente académica y formativa. Los proyectos no constituyen, en ningún caso, una relación laboral, contrato de trabajo, prestación de servicios remunerada, ni una modalidad formativa laboral regulada por la Ley N° 28518 o la norma que la sustituya. Ni Linkuy ni la MYPE adquieren la condición de empleador respecto del estudiante, y la participación en un proyecto no genera vínculo de subordinación, remuneración, beneficios sociales ni obligación de contratación posterior. La eventual convalidación de la experiencia como práctica preprofesional queda sujeta exclusivamente a las normas y procedimientos de la institución universitaria del estudiante, ajenos a la Plataforma.</P>
          </Section>

          <Hr />

          {/* 2 */}
          <Section num="2" title="REGISTRO Y ELEGIBILIDAD">
            <Sub>2.1. Registro de Estudiantes</Sub>
            <P>Para registrarse como estudiante, el Usuario debe ser estudiante activo de una institución universitaria participante, con código de matrícula válido. El registro requiere verificación de identidad mediante DNI consultado a RENIEC y código de estudiante. Al registrarse, el estudiante declara que la información proporcionada es verídica, exacta y actualizada.</P>

            <Sub>2.2. Registro de MYPEs</Sub>
            <P>Para registrarse como empresa, el Usuario debe ser representante legal o apoderado autorizado de una empresa con RUC activo registrado en SUNAT. El registro requiere verificación del RUC mediante los registros de SUNAT. Al registrarse, el representante declara actuar con plenas facultades para obligar a la empresa y que la información proporcionada es verídica, exacta y actualizada.</P>

            <Sub>2.3. Capacidad legal</Sub>
            <P>Para registrarse y utilizar la Plataforma, todo Usuario debe ser mayor de edad y contar con plena capacidad legal para obligarse conforme a la legislación peruana. En el caso de las MYPEs, quien efectúe el registro garantiza contar con la representación y las facultades suficientes para vincular a la empresa que representa.</P>

            <Sub>2.4. Prohibiciones de registro</Sub>
            <P>Queda prohibido registrar más de una cuenta por Usuario. En caso de detectarse cuentas duplicadas, Linkuy se reserva el derecho de suspender o eliminar las cuentas involucradas sin previo aviso y sin que ello genere derecho a compensación alguna.</P>
          </Section>

          <Hr />

          {/* 3 */}
          <Section num="3" title="USOS ACEPTABLES Y PROHIBIDOS">
            <Sub>3.1. Reglas generales</Sub>
            <P>Los Usuarios tienen prohibido utilizar la Plataforma para transmitir, distribuir, almacenar o publicar material que viole la normativa vigente en la República del Perú, que infrinja derechos de terceros o vulnere la confidencialidad, privacidad, honor o imagen de otras personas, o que sea ofensivo, discriminatorio, amenazante, difamatorio u obsceno.</P>

            <Sub>3.2. Reglas de seguridad</Sub>
            <P>Los Usuarios tienen prohibido violar o intentar violar la seguridad de la Plataforma, incluyendo el acceso a datos o cuentas no autorizadas, la introducción de virus o malware, el envío de comunicaciones no solicitadas, la falsificación de datos de identificación, o cualquier acto que afecte el funcionamiento normal de la Plataforma. Las violaciones de seguridad constituyen infracciones pasibles de sanciones civiles y penales conforme a la legislación peruana vigente.</P>

            <Sub>3.3. Naturaleza no remunerada de los proyectos</Sub>
            <P>Queda expresamente prohibido solicitar, ofrecer o aceptar contraprestación económica entre estudiantes y MYPEs por los proyectos registrados en la Plataforma. Los proyectos publicados en Linkuy son intrínsecamente no remunerados.</P>
            <P>Si entre un estudiante y una MYPE surgiera, por su propia iniciativa y fuera de la Plataforma, cualquier tipo de acuerdo económico o relación contractual, dicho acuerdo es de exclusiva responsabilidad de las partes. Linkuy no interviene, no avala, no media ni garantiza el cumplimiento de ningún acuerdo de este tipo, y no asume responsabilidad alguna derivada del mismo.</P>

            <Sub>3.4. Otros usos prohibidos</Sub>
            <P>Queda también prohibido usar la Plataforma para actividades de reclutamiento remunerado u otros fines distintos a los establecidos en la cláusula 1.3; revelar o ceder las credenciales de acceso a terceros; realizar ingeniería inversa o intentar obtener el código fuente de la Plataforma; y registrar datos biográficos, académicos o empresariales falsos o inexactos.</P>

            <Sub>3.5. Respeto y conducta entre Usuarios</Sub>
            <P>En toda comunicación e interacción dentro de la Plataforma, los Usuarios se obligan a mantener un trato respetuoso, profesional y de buena fe. Queda prohibido cualquier acto de hostigamiento, acoso, intimidación, discriminación, trato denigrante, lenguaje ofensivo o presión indebida hacia otros Usuarios, con independencia de su rol. El incumplimiento de esta obligación será considerado falta y podrá dar lugar a las sanciones previstas en la cláusula 3.6.</P>

            <Sub>3.6. Sanciones</Sub>
            <P>Linkuy se reserva el derecho de emitir advertencias, suspender temporalmente o cancelar de forma permanente la cuenta de cualquier Usuario que incumpla estos Términos o la legislación aplicable, sin que ello genere derecho a resarcimiento alguno.</P>
          </Section>

          <Hr />

          {/* 4 */}
          <Section num="4" title="REGLAS ESPECÍFICAS PARA ESTUDIANTES">
            <Sub>4.1. Límite de proyectos activos</Sub>
            <P>El estudiante podrá tener activo un (1) proyecto simultáneo como máximo. Linkuy podrá habilitar excepcionalmente hasta dos (2) proyectos activos de forma simultánea, previa evaluación del indicador de confianza del estudiante conforme a la cláusula 4.3.</P>

            <Sub>4.2. Abandono de proyectos</Sub>
            <P>El abandono injustificado de un proyecto activo constituye una falta grave. Se considera abandono injustificado la inactividad o falta de comunicación dentro de la Plataforma por un período superior a cuarenta y ocho (48) horas consecutivas sin notificación previa, o el retiro del proyecto sin aviso formal a través de los canales habilitados.</P>
            <P>La inactividad se mide mediante la actividad registrada en los canales de comunicación internos de la Plataforma. Adicionalmente, cualquiera de las partes puede reportar la situación al equipo de Linkuy, quien evaluará el caso con la información disponible antes de aplicar cualquier sanción. El abandono injustificado quedará registrado en el historial del estudiante y podrá resultar en la suspensión temporal o permanente de la cuenta, a criterio de Linkuy.</P>

            <Sub>4.3. Indicador de confianza</Sub>
            <P>Al cierre de cada proyecto, la MYPE podrá calificar al estudiante con una puntuación de 1 a 5 estrellas, y el estudiante podrá calificar a la MYPE. Esta calificación solo está disponible para usuarios que hayan tenido una conexión efectiva en un proyecto registrado en la Plataforma.</P>
            <P>Las calificaciones son confidenciales: el estudiante no puede ver su propia puntuación ni la de otros estudiantes; la MYPE no puede ver su propia puntuación ni la de otras MYPEs. El indicador de confianza es utilizado exclusivamente por el equipo de Linkuy para evaluar la habilitación de beneficios adicionales, como la posibilidad de trabajar en dos proyectos simultáneos.</P>

            <Sub>4.4. Compromiso de entrega</Sub>
            <P>Al aceptar un proyecto, el estudiante se compromete a entregar los productos pactados dentro del plazo acordado y con la calidad establecida en los entregables definidos al inicio del proyecto.</P>

            <Sub>4.5. Compromiso de dedicación y culminación del proyecto</Sub>
            <P>Al postular y ser aceptado en un proyecto, el estudiante asume el compromiso de llevarlo a término de manera diligente, responsable y de buena fe, recorriendo todas las etapas del flujo de trabajo de la Plataforma (Pendiente, En Desarrollo, En Revisión y Completado) hasta lograr su culminación.</P>
            <P>Se entiende por culminación exitosa la entrega de la totalidad de los productos pactados, con la calidad definida en los entregables, y la aprobación formal del cierre por parte de la MYPE. Para ello, el estudiante se obliga a: (i) mantener comunicación activa durante todo el proyecto; (ii) aplicar su mejor esfuerzo y los conocimientos propios de su formación para alcanzar el resultado comprometido; y (iii) no abandonar el proyecto injustificadamente conforme a la cláusula 4.2.</P>
            <P>El estudiante reconoce que culminar con éxito cada proyecto que acepta es el estándar de conducta esperado en la Plataforma. El incumplimiento reiterado de este compromiso afectará su indicador de confianza y podrá derivar en las sanciones previstas en la cláusula 3.6. Las circunstancias debidamente justificadas y comunicadas oportunamente al equipo de Linkuy serán evaluadas conforme a la cláusula 4.2 y no constituirán abandono.</P>
          </Section>

          <Hr />

          {/* 5 */}
          <Section num="5" title="REGLAS ESPECÍFICAS PARA MYPES">
            <Sub>5.1. Alcance de los proyectos</Sub>
            <P>La empresa no puede solicitar al estudiante trabajos que excedan el alcance definido en los entregables del proyecto publicado, ni exigir exclusividad, ni condicionar la aprobación del proyecto al desarrollo de trabajos adicionales no registrados en la Plataforma.</P>

            <Sub>5.2. Revisión de entregables</Sub>
            <P>La empresa se compromete a revisar los entregables y proporcionar retroalimentación formal al estudiante en un plazo máximo de tres (3) días hábiles desde la fecha de entrega registrada en la Plataforma.</P>

            <Sub>5.3. Buen trato y respeto al estudiante</Sub>
            <P>La MYPE se compromete a brindar al estudiante un trato digno, respetuoso y profesional durante todo el desarrollo del proyecto. En particular, la MYPE se obliga a: (i) proporcionar de forma oportuna la información, los accesos y los recursos razonables y necesarios para la ejecución de los entregables; (ii) brindar retroalimentación clara y constructiva conforme a la cláusula 5.2; (iii) abstenerse de cualquier forma de maltrato, hostigamiento, discriminación, presión indebida o exigencia de tareas ajenas al alcance del proyecto; y (iv) reconocer la naturaleza formativa de la colaboración y la condición de estudiante de su contraparte.</P>
            <P>El incumplimiento de estas obligaciones podrá ser reportado al equipo de Linkuy, afectará el indicador de confianza de la MYPE y podrá dar lugar a las sanciones previstas en la cláusula 3.6.</P>

            <Sub>5.4. Certificado de participación</Sub>
            <P>Al cierre exitoso de un proyecto, la Plataforma generará automáticamente un <strong>badge digital verificable</strong> para el estudiante, el cual queda almacenado en la Plataforma y puede ser compartido por el estudiante en su CV, LinkedIn u otros medios.</P>
            <P>Adicionalmente, la Plataforma pondrá a disposición del representante de la MYPE una <strong>plantilla oficial de constancia</strong> con los datos del proyecto completados automáticamente. La impresión, firma manuscrita y entrega física de dicha constancia al estudiante es una responsabilidad voluntaria de la MYPE. Linkuy no interviene ni puede garantizar la entrega de la constancia firmada. El badge digital constituye el único documento oficial emitido y respaldado por la Plataforma.</P>
          </Section>

          <Hr />

          {/* 6 */}
          <Section num="6" title="PROPIEDAD INTELECTUAL Y CONFIDENCIALIDAD">
            <Sub>6.1. Contenido de la Plataforma</Sub>
            <P>Todos los contenidos de la Plataforma —incluyendo textos, gráficos, logotipos, código y arquitectura funcional— son propiedad de Linkuy y están protegidos por la legislación peruana en materia de propiedad intelectual. Queda prohibida su reproducción, modificación o uso no autorizado.</P>

            <Sub>6.2. Entregables de los proyectos</Sub>
            <P>Los entregables producidos por el estudiante en el marco de un proyecto registrado en la Plataforma —incluyendo código fuente, diseños, prototipos, bases de datos y documentación— son de propiedad de la MYPE una vez que esta haya aprobado formalmente el cierre del proyecto. El estudiante conserva el derecho de mencionar el proyecto en su portafolio personal, CV o perfil profesional, sin revelar información confidencial de la empresa. Linkuy no reclama propiedad sobre ningún entregable producido en la Plataforma.</P>

            <Sub>6.3. Confidencialidad de la información empresarial</Sub>
            <P>El estudiante se obliga a tratar de forma confidencial toda la información del negocio, datos, accesos, credenciales y documentación que la MYPE le proporcione o a la que acceda con motivo del proyecto, y a utilizarla únicamente para el cumplimiento de los entregables. Esta obligación de confidencialidad subsiste tras la finalización del proyecto. La mención del proyecto en el portafolio o perfil profesional del estudiante, conforme a la cláusula 6.2, no podrá incluir información confidencial, datos sensibles ni material que perjudique a la MYPE sin su autorización expresa.</P>
          </Section>

          <Hr />

          {/* 7 */}
          <Section num="7" title="DATOS PERSONALES">
            <P>En cumplimiento de la <strong>Ley N° 29733 — Ley de Protección de Datos Personales del Perú</strong> y su Reglamento aprobado por Decreto Supremo N° 016-2024-JUS (vigente desde el 30 de marzo de 2025, que derogó el Decreto Supremo N° 003-2013-JUS), así como de las normas que los modifiquen o complementen, Linkuy informa lo siguiente:</P>
            <P>Responsable del tratamiento: el equipo de Linkuy, en su condición de operador de la Plataforma en el marco de un proyecto académico universitario. Para cualquier asunto relativo a datos personales, el Usuario puede dirigirse al canal de contacto indicado en la cláusula 13. El detalle completo del tratamiento de datos se encuentra en la Política de Privacidad de la Plataforma, que forma parte integrante de estos Términos.</P>

            <Sub>7.1. Datos recopilados</Sub>
            <P><strong>Estudiantes:</strong> nombre completo, DNI, correo electrónico, número de teléfono, universidad, carrera y código de estudiante.</P>
            <P><strong>MYPEs:</strong> razón social, RUC, dirección, rubro y nombre del representante legal.</P>
            <P><strong>Datos de uso (ambos perfiles):</strong> actividad dentro de la Plataforma, proyectos publicados, postulaciones realizadas, entregables subidos, calificaciones recibidas e historial de evaluaciones.</P>

            <Sub>7.2. Finalidad del tratamiento</Sub>
            <P>Los datos son recopilados y utilizados exclusivamente para operar la Plataforma: verificar identidades, facilitar la conexión entre empresas y estudiantes, emitir badges digitales de participación y generar estadísticas de impacto en el marco del proyecto académico universitario.</P>

            <Sub>7.3. Confidencialidad, encargados y cesión a terceros</Sub>
            <P>Linkuy no vende, alquila ni comparte información personal de los usuarios con terceros con fines comerciales o publicitarios. No obstante, para operar la Plataforma, los datos podrán ser tratados o comunicados en los siguientes supuestos:</P>
            <P>(a) <strong>Entre Usuarios conectados en un proyecto:</strong> cuando un estudiante y una MYPE quedan vinculados en un proyecto, la Plataforma comparte entre ellos los datos necesarios para su ejecución (datos de contacto y de perfil). Cada parte se obliga a mantener dichos datos en confidencialidad y a usarlos únicamente para los fines del proyecto, conforme a la cláusula 6.3.</P>
            <P>(b) <strong>Proveedores de infraestructura (encargados de tratamiento):</strong> la Plataforma se apoya en proveedores de servicios en la nube y de despliegue que tratan los datos por cuenta y bajo instrucciones de Linkuy, sujetos a deberes de confidencialidad y seguridad, y sin autorización para usarlos con fines propios.</P>
            <P>(c) <strong>Autoridades competentes:</strong> únicamente cuando exista una orden judicial o un mandato legal expreso.</P>
            <P>Cuando el alojamiento de la información se realice en servidores ubicados fuera del Perú, dicha transferencia internacional se efectuará procurando garantías adecuadas de protección, de conformidad con la Ley N° 29733 y su Reglamento.</P>

            <Sub>7.4. Conservación de datos</Sub>
            <P>Los datos se conservarán durante la vigencia de la cuenta activa y por un período adicional de tres (3) años después de la última actividad registrada, con fines de auditoría. Transcurrido ese período, serán eliminados de forma segura.</P>

            <Sub>7.5. Derechos ARCO</Sub>
            <P>El usuario tiene derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales. Para ejercer estos derechos debe enviar una solicitud al correo indicado en la cláusula 13, identificándose de la siguiente manera:</P>
            <P><strong>Estudiantes:</strong> nombre completo y DNI. <strong>MYPEs:</strong> nombre del representante legal y RUC de la empresa.</P>
          </Section>

          <Hr />

          {/* 8 */}
          <Section num="8" title="SEGURIDAD DE LA INFORMACIÓN">
            <P>Linkuy implementa medidas técnicas y organizativas razonables para proteger la información de los usuarios, incluyendo cifrado de contraseñas, comunicaciones mediante HTTPS y control de acceso por roles. Ningún sistema de seguridad es infalible. El usuario reconoce que el uso de internet implica riesgos inherentes y que Linkuy no puede garantizar la seguridad absoluta frente a accesos no autorizados por causas externas a su control. El usuario es responsable de mantener la confidencialidad de sus credenciales y debe notificar de inmediato cualquier acceso no autorizado detectado.</P>
            <P>En caso de detectarse una violación de seguridad que afecte datos personales, Linkuy notificará a la Autoridad Nacional de Protección de Datos Personales y a los usuarios afectados dentro del plazo y en los términos exigidos por la normativa vigente (notificación dentro de las cuarenta y ocho (48) horas conforme al Reglamento de la Ley N° 29733).</P>
          </Section>

          <Hr />

          {/* 9 */}
          <Section num="9" title="EXCLUSIÓN DE GARANTÍAS Y LIMITACIÓN DE RESPONSABILIDAD">
            <P>La Plataforma se ofrece en su estado actual, en fase Beta, sin garantías de ninguna clase. Linkuy no garantiza la disponibilidad ininterrumpida del servicio ni su funcionamiento libre de errores. Linkuy actúa como intermediario entre MYPEs y estudiantes, no es parte en ningún acuerdo establecido entre usuarios y no asume responsabilidad por incumplimientos, disputas o daños derivados de la relación entre ellos. Linkuy no garantiza que los usuarios puedan conseguir un resultado determinado mediante el uso de la Plataforma, incluyendo la obtención de empleo, la contratación de servicios o el desarrollo exitoso de un proyecto. En ningún caso Linkuy será responsable de daños directos o indirectos, lucro cesante o pérdida de oportunidad que resulten del uso o de la imposibilidad de uso de la Plataforma.</P>
          </Section>

          <Hr />

          {/* 10 */}
          <Section num="10" title="INDEMNIZACIÓN">
            <P>El usuario acepta mantener indemne a Linkuy, sus responsables, colaboradores y representantes, de cualquier reclamo, acción o demanda —incluyendo gastos legales razonables— que resulten del uso que el usuario haga de la Plataforma, los Servicios o los contenidos, o del incumplimiento de estos Términos.</P>
          </Section>

          <Hr />

          {/* 11 */}
          <Section num="11" title="DURACIÓN Y TERMINACIÓN">
            <P>La prestación del Servicio tiene duración indeterminada. Linkuy está facultado para suspender o terminar unilateralmente la prestación del Servicio en cualquier momento, notificando a los usuarios con la anticipación razonable que las circunstancias permitan. El usuario puede solicitar la eliminación de su cuenta en cualquier momento; la solicitud será procesada en un plazo máximo de diez (10) días hábiles. La terminación de la cuenta no extingue las obligaciones de confidencialidad asumidas conforme a la cláusula 6.3 ni las responsabilidades generadas antes de dicha terminación.</P>
          </Section>

          <Hr />

          {/* 12 */}
          <Section num="12" title="MODIFICACIONES A ESTOS TÉRMINOS">
            <P>Linkuy puede modificar estos Términos en cualquier momento. Cuando se realicen cambios sustanciales, se notificará a los usuarios registrados mediante correo electrónico y/o aviso visible en la Plataforma con al menos siete (7) días de anticipación a la fecha de vigencia de los nuevos Términos. El uso continuado de la Plataforma después de dicha fecha implica la aceptación de los Términos modificados.</P>
          </Section>

          <Hr />

          {/* 13 */}
          <Section num="13" title="CONTACTO">
            <P>Para consultas, reclamos o ejercicio de derechos sobre datos personales:</P>
            <P><strong>Correo:</strong> contacto.linkuy@gmail.com<br/><strong>Plataforma:</strong> linkuy.pe</P>
          </Section>

          <Hr />

          {/* 14 */}
          <Section num="14" title="JURISDICCIÓN Y LEY APLICABLE">
            <P>Estos Términos se rigen por las leyes de la República del Perú. Cualquier controversia derivada de su interpretación o aplicación será sometida a la jurisdicción de los Juzgados y Tribunales de Cajamarca, renunciando las partes a cualquier otro fuero que pudiera corresponderles.</P>
          </Section>

          <Hr />

          {/* 15 */}
          <Section num="15" title="MISCELÁNEAS">
            <P>En caso de declararse la nulidad de alguna cláusula de estos Términos, tal nulidad no afectará la validez de las restantes, las cuales mantendrán su plena vigencia. Estos Términos, junto con la Política de Privacidad de la Plataforma, constituyen el acuerdo completo entre Linkuy y el Usuario respecto al uso de los Servicios. El Usuario no podrá ceder sus derechos u obligaciones bajo estos Términos a terceros sin consentimiento previo y por escrito de Linkuy.</P>
          </Section>

          {/* Pie */}
          <div style={{ marginTop: 28, paddingTop: 16, borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
            <p style={{ fontSize: 11.5, color: "#9ca3af", fontStyle: "italic" }}>
              Términos y Condiciones de Uso — Linkuy · Versión 1.0 · Mayo 2026
            </p>
          </div>

        </div>{/* fin caja texto */}

        {/* ── Pie fijo: indicador + botones ── */}
        <div style={{
          padding: "14px 16px 16px",
          margin: "12px 16px 16px",
          background: "#f9fafb",
          border: "1.5px solid #e5e7eb",
          borderRadius: 8,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>

          {/* Botones */}
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              onClick={onClose}
              style={{
                padding: "9px 20px",
                fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700,
                color: "#4b5563", background: "#fff",
                border: "1.5px solid #d1d5db", borderRadius: 6,
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#9ca3af"; e.currentTarget.style.color = "#111"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#4b5563"; }}
            >
              Cerrar
            </button>
            <button
              onClick={() => { onAccept(); onClose(); }}
              disabled={!hasScrolledToBottom}
              style={{
                padding: "9px 24px",
                fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700,
                color: "#fff",
                background: hasScrolledToBottom ? "#0f1f3d" : "#9ca3af",
                border: "none", borderRadius: 6,
                cursor: hasScrolledToBottom ? "pointer" : "not-allowed",
                transition: "all 0.25s",
                boxShadow: hasScrolledToBottom ? "0 4px 14px rgba(15,31,61,0.25)" : "none",
              }}
              onMouseEnter={e => { if (hasScrolledToBottom) e.currentTarget.style.background = "#1B6FE8"; }}
              onMouseLeave={e => { if (hasScrolledToBottom) e.currentTarget.style.background = "#0f1f3d"; }}
            >
              Aceptar términos
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Helpers de presentación ── */
function Section({ num, title, children }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h3 style={{
        fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 900,
        color: "#0f1f3d", textTransform: "uppercase", letterSpacing: "0.06em",
        marginBottom: 12, textAlign: "left",
        display: "flex", alignItems: "baseline", gap: 8,
      }}>
        <span style={{ color: "#1B6FE8", fontVariantNumeric: "tabular-nums" }}>{num}.</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Sub({ children }) {
  return (
    <p style={{
      fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700,
      color: "#1f2937", marginBottom: 6, marginTop: 14, textAlign: "left",
    }}>
      {children}
    </p>
  );
}

function P({ children }) {
  return (
    <p style={{
      fontFamily: "Arial, sans-serif", fontSize: 13.5,
      color: "#374151", lineHeight: 1.75,
      marginBottom: 10, textAlign: "justify",
    }}>
      {children}
    </p>
  );
}

function Hr() {
  return <div style={{ height: 1, background: "#e5e7eb", margin: "20px 0" }} />;
}
