import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, Mail, Phone, GraduationCap, MapPin, Edit2, Loader2, Globe, ExternalLink, Save, X, Briefcase, Layers, ArrowRight, Send, Zap, PenLine, CheckCircle2, Award, Search } from 'lucide-react';
import { usePerfil, useUpdatePerfil } from '@features/perfil/usePerfil';
import { CvUploader } from '@features/perfil/CvUploader';
import { useMisPostulaciones } from '@features/postulaciones-list/useMisPostulaciones';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBarst4EK43KNVDjrQV692vbiQGSazOYvM';

/* ─── Animaciones ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const getSkillColor = (skill) => {
  const s = skill.toLowerCase().trim();
  if (['react','vue','angular','next.js','html','css','javascript','typescript','tailwind','sass'].some(k => s.includes(k))) 
    return { bg: '#eff6ff', color: '#1B6FE8', border: '#bfdbfe' };
  if (['java','spring','kotlin','android'].some(k => s.includes(k))) 
    return { bg: '#fff7ed', color: '#ea580c', border: '#fed7aa' };
  if (['python','django','flask','fastapi','tensorflow','pytorch'].some(k => s.includes(k))) 
    return { bg: '#fefce8', color: '#ca8a04', border: '#fde68a' };
  if (['mysql','postgresql','mongodb','sql','oracle','firebase'].some(k => s.includes(k))) 
    return { bg: '#f0fdf4', color: '#059669', border: '#bbf7d0' };
  if (['docker','git','linux','aws','azure','devops','kubernetes'].some(k => s.includes(k))) 
    return { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' };
  return { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' };
};

/* ─── Estilos reutilizables ─── */
const labelStyle = {
  fontSize: 10,
  fontWeight: 700,
  color: '#6b6b7a',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  display: 'block',
  marginBottom: 6,
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 12,
  background: '#f8fafc',
  border: '0.5px solid #e8e8e4',
  fontSize: 12,
  fontWeight: 500,
  color: '#0f1f3d',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'all 0.2s',
  boxSizing: 'border-box',
  resize: 'vertical',
};

const readonlyFieldStyle = {
  padding: '12px 14px',
  borderRadius: 12,
  background: '#f1f5f9',
  border: '0.5px solid #e2e8f0',
  fontSize: 12,
  fontWeight: 600,
  color: '#0f1f3d',
  minHeight: 20,
  display: 'flex',
  alignItems: 'center',
};

const linkItemStyle = (bg, borderColor) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: 10, borderRadius: 10, background: bg,
  border: `0.5px solid ${borderColor}`, textDecoration: 'none',
  transition: 'all 0.2s',
});

const emptyLinkStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  width: '100%', padding: 10, borderRadius: 10,
  background: '#f8fafc', border: '0.5px solid #e8e8e4',
  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
};

/* ═══════════════════════════════════════════════
   MODAL DE EDICIÓN DE PERFIL
═══════════════════════════════════════════════ */
const EditProfileModal = ({ isOpen, onClose, formData, onChange, onSubmit, isUpdating }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(13, 27, 53, 0.6)', backdropFilter: 'blur(4px)' }} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', background: '#fff', borderRadius: 24, padding: '32px 36px', maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(13, 27, 53, 0.25)', border: '0.5px solid #e8e8e4' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #1B6FE8, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit2 size={18} color="#fff" /></div>
            <div><h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f1f3d', margin: 0, letterSpacing: '-0.02em' }}>Editar Perfil</h3><p style={{ fontSize: 11, color: '#6b6b7a', margin: '2px 0 0', fontWeight: 500 }}>Completa tu información para destacar</p></div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, background: '#f8fafc', border: '0.5px solid #e8e8e4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit' }}><X size={16} color="#6b6b7a" /></button>
        </div>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={labelStyle}>Biografía</label><textarea name="bio" value={formData.bio} onChange={onChange} placeholder="Cuéntanos un poco sobre ti..." rows={4} style={inputStyle} /></div>
          <div><label style={labelStyle}>Habilidades (separadas por comas)</label><input type="text" name="skills" value={formData.skills} onChange={onChange} placeholder="React, Node.js, Python, Docker..." style={inputStyle} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={labelStyle}>Teléfono</label><input type="tel" name="telefono" value={formData.telefono} onChange={onChange} placeholder="+51 987654321" style={inputStyle} /></div>
            <div><label style={labelStyle}>LinkedIn URL</label><input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={onChange} placeholder="https://linkedin.com/in/..." style={inputStyle} /></div>
          </div>
          <div><label style={labelStyle}>Portafolio URL</label><input type="url" name="portafolioUrl" value={formData.portafolioUrl} onChange={onChange} placeholder="https://github.com/tuusuario" style={inputStyle} /></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: 12, background: '#f8fafc', border: '0.5px solid #e8e8e4', color: '#6b6b7a', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
            <button type="submit" disabled={isUpdating} style={{ padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #1B6FE8, #06B6D4)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: isUpdating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, opacity: isUpdating ? 0.7 : 1, boxShadow: '0 4px 16px rgba(27, 111, 232, 0.25)' }}>
              {isUpdating ? (<><Loader2 size={14} className="animate-spin" />Guardando...</>) : (<><Save size={14} />Guardar Cambios</>)}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MODAL DE EDICIÓN DE UBICACIÓN CON AUTOCOMPLETADO
═══════════════════════════════════════════════ */
const EditLocationModal = ({ isOpen, onClose, ciudadActual, paisActual, sectorActual, onSave, isUpdating }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pais, setPais] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [sector, setSector] = useState('');
  const [direccion, setDireccion] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const debounceRef = useRef(null);
  const prevValuesRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const p = paisActual && paisActual !== 'No especificado' ? paisActual : '';
    const c = ciudadActual && ciudadActual !== 'No especificada' ? ciudadActual : '';
    const s = sectorActual && sectorActual !== 'No especificado' ? sectorActual : '';
    
    const newValues = `${p}|${c}|${s}`;
    if (prevValuesRef.current === newValues) return;
    prevValuesRef.current = newValues;
    
    setPais(p);
    setDepartamento(c);
    setSector(s);
    setDireccion('');
    if (c && p) {
      setSearchQuery(`${c}, ${p}`);
    } else {
      setSearchQuery('');
    }
  }, [ciudadActual, paisActual, sectorActual, isOpen]);

  if (!isOpen) return null;

  const extractLocationData = (result) => {
    const components = result.address_components;
    let foundPais = '';
    let foundDepartamento = '';
    let foundProvincia = '';
    let foundDistrito = '';
    let foundRuta = '';

    components.forEach(comp => {
      const types = comp.types;
      if (types.includes('country')) foundPais = comp.long_name;
      if (types.includes('administrative_area_level_1')) foundDepartamento = comp.long_name;
      if (types.includes('administrative_area_level_2')) foundProvincia = comp.long_name;
      if (types.includes('administrative_area_level_3') || types.includes('locality')) foundDistrito = comp.long_name;
      if (types.includes('route')) foundRuta = comp.long_name;
    });

    return {
      pais: foundPais,
      departamento: foundDepartamento || foundProvincia || '',
      sector: foundDistrito || foundProvincia || '',
      direccion: foundRuta || '',
    };
  };

  const fetchLocationDetails = (query) => {
    if (!query || query.length < 3) return;
    setIsLoadingLocation(true);
    
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`)
      .then(res => res.json())
      .then(data => {
        setIsLoadingLocation(false);
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          const location = extractLocationData(result);
          setPais(location.pais);
          setDepartamento(location.departamento);
          setSector(location.sector);
          setDireccion(location.direccion);
        }
      })
      .catch(() => setIsLoadingLocation(false));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    if (value.length >= 3) {
      debounceRef.current = setTimeout(() => fetchLocationDetails(value), 500);
    } else if (value.length === 0) {
      setPais(''); setDepartamento(''); setSector(''); setDireccion('');
    }
  };

  const getMapSrc = () => {
    const query = searchQuery || (departamento ? `${departamento}, ${pais}` : 'Perú');
    return `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(query)}&zoom=14`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ciudadFinal = [departamento, sector].filter(Boolean).join(', ');
    onSave({ 
      ciudad: ciudadFinal || searchQuery || '', 
      pais: pais || '', 
      sector: direccion || sector || '' 
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(13, 27, 53, 0.6)', backdropFilter: 'blur(4px)' }} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', background: '#fff', borderRadius: 24, padding: '32px 36px', maxWidth: 620, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(13, 27, 53, 0.25)', border: '0.5px solid #e8e8e4' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #1B6FE8, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={18} color="#fff" /></div>
            <div><h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f1f3d', margin: 0, letterSpacing: '-0.02em' }}>Editar Ubicación</h3><p style={{ fontSize: 11, color: '#6b6b7a', margin: '2px 0 0', fontWeight: 500 }}>Busca y los campos se llenarán automáticamente</p></div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, background: '#f8fafc', border: '0.5px solid #e8e8e4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit' }}><X size={16} color="#6b6b7a" /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Buscar ubicación</label>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
              <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Ej: Perú, Cajamarca, Plaza de armas..." style={{ ...inputStyle, paddingLeft: 34 }} autoComplete="off" />
              {isLoadingLocation && <Loader2 size={14} className="animate-spin" color="#1B6FE8" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }} />}
            </div>
            <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, fontWeight: 500 }}>Escribe una ubicación (ej: Perú, Cajamarca)</p>
          </div>

          <div style={{ borderRadius: 14, overflow: 'hidden', border: '0.5px solid #e8e8e4', height: 280, background: '#e8e8e4', position: 'relative' }}>
            <iframe title="Mapa de ubicación" width="100%" height="280" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src={getMapSrc()} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>País</label>
              <div style={readonlyFieldStyle}>{pais || <span style={{ color: '#94a3b8', fontWeight: 400 }}>Se autocompletará...</span>}</div>
            </div>
            <div>
              <label style={labelStyle}>Departamento</label>
              <div style={readonlyFieldStyle}>{departamento || <span style={{ color: '#94a3b8', fontWeight: 400 }}>Se autocompletará...</span>}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Sector / Distrito</label>
              <div style={readonlyFieldStyle}>{sector || <span style={{ color: '#94a3b8', fontWeight: 400 }}>Se autocompletará...</span>}</div>
            </div>
            <div>
              <label style={labelStyle}>Dirección / Calle</label>
              <div style={readonlyFieldStyle}>{direccion || <span style={{ color: '#94a3b8', fontWeight: 400 }}>Se autocompletará...</span>}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: 12, background: '#f8fafc', border: '0.5px solid #e8e8e4', color: '#6b6b7a', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
            <button type="submit" disabled={isUpdating} style={{ padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #1B6FE8, #06B6D4)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: isUpdating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, opacity: isUpdating ? 0.7 : 1, boxShadow: '0 4px 16px rgba(27, 111, 232, 0.25)' }}>
              {isUpdating ? (<><Loader2 size={14} className="animate-spin" />Guardando...</>) : (<><Save size={14} />Guardar Ubicación</>)}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   HERO BANNER (sin cambios)
═══════════════════════════════════════════════ */
const ProfileHeroBanner = ({ user, completitud, displayRol, academicInfo, isEstudiante, onEdit }) => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current, hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');
    let W, H, animId;
    const COLORS = ['rgba(27,111,232,', 'rgba(6,182,212,', 'rgba(212,88,10,', 'rgba(255,255,255,', 'rgba(16,185,129,'];
    const resize = () => { W = canvas.width = hero.offsetWidth; H = canvas.height = hero.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(hero);

    class RisingParticle {
      reset() { this.x = Math.random() * W; this.y = H + Math.random() * 50; this.size = Math.random() * 2.5 + 0.8; this.speedX = (Math.random() - 0.5) * 0.3; this.speedY = -(Math.random() * 1.2 + 0.4); this.alpha = Math.random() * 0.5 + 0.2; this.color = COLORS[Math.floor(Math.random() * COLORS.length)]; this.waveFreq = Math.random() * Math.PI * 2; }
      constructor() { this.reset(); }
      update() { this.x += this.speedX + Math.sin(Date.now() * 0.002 + this.waveFreq) * 0.15; this.y += this.speedY; if (this.y < -20) this.reset(); }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fillStyle = this.color + this.alpha + ')'; ctx.fill(); if (this.size > 1.8) { ctx.shadowBlur = 6; ctx.shadowColor = this.color + this.alpha + ')'; ctx.fill(); ctx.shadowBlur = 0; } }
    }

    const particles = Array.from({ length: 85 }, () => new RisingParticle());
    const drawConnections = () => { for (let i = 0; i < particles.length; i++) { for (let j = i + 1; j < particles.length; j++) { const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y; const d = Math.sqrt(dx * dx + dy * dy); if (d < 70) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); const opacity = 0.05 * (1 - d / 70); ctx.strokeStyle = `rgba(27,111,232,${opacity})`; ctx.lineWidth = 0.5; ctx.stroke(); } } } };
    const animate = () => { ctx.clearRect(0, 0, W, H); drawConnections(); particles.forEach(p => { p.update(); p.draw(); }); animId = requestAnimationFrame(animate); };
    animate();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  const nombreCompleto = user.nombre || 'Usuario';
  return (
    <motion.div ref={heroRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, background: 'linear-gradient(135deg,#0d1b35 0%,#0f2a4a 60%,#0a2240 100%)', padding: '40px 44px 40px', color: '#fff', marginBottom: 24, minHeight: 250 }}>
      <style>{`@keyframes heroPulse{0%{box-shadow:0 0 0 0 rgba(74,222,128,0.45)}70%{box-shadow:0 0 0 9px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}@keyframes orbF1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-18px,14px) scale(1.08)}66%{transform:translate(9px,-9px) scale(0.95)}}@keyframes orbF2{0%,100%{transform:translate(0,0)}40%{transform:translate(14px,-18px)}70%{transform:translate(-9px,11px)}}@keyframes orbF3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-13px,18px) scale(1.1)}}`}</style>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.6, pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(27,111,232,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,111,232,0.06) 1px,transparent 1px)', backgroundSize:'48px 48px', WebkitMaskImage:'radial-gradient(ellipse 80% 80% at 55% 50%,black,transparent)', maskImage:'radial-gradient(ellipse 80% 80% at 55% 50%,black,transparent)' }} />
      <div style={{ position:'absolute', top:-70, right:-40, width:250, height:250, borderRadius:'50%', background:'rgba(27,111,232,0.16)', filter:'blur(40px)', pointerEvents:'none', animation:'orbF1 8s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:-65, right:140, width:190, height:190, borderRadius:'50%', background:'rgba(212,88,10,0.09)', filter:'blur(40px)', pointerEvents:'none', animation:'orbF2 10s ease-in-out infinite' }} />
      <div style={{ position:'absolute', top:10, right:210, width:150, height:150, borderRadius:'50%', background:'rgba(6,182,212,0.07)', filter:'blur(40px)', pointerEvents:'none', animation:'orbF3 13s ease-in-out infinite' }} />
      <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1, duration:0.5 }} style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, padding:'5px 14px', fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', marginBottom:18 }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block', animation:'heroPulse 2s ease-in-out infinite' }} />Portal de estudiante
      </motion.div>
      <div style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ maxWidth:500 }}>
          <div style={{ fontSize:'clamp(23px,2.5vw,30px)', fontWeight:800, lineHeight:1.08, letterSpacing:'-0.035em', marginBottom:6 }}>
            <div style={{ overflow:'hidden' }}><motion.div initial={{ y:'110%', opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.15, duration:0.6, ease:[0.22,1,0.36,1] }} style={{ color:'#fff' }}>{nombreCompleto}</motion.div></div>
            <div style={{ overflow:'hidden' }}><motion.div initial={{ y:'110%', opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.27, duration:0.6, ease:[0.22,1,0.36,1] }} style={{ background: 'linear-gradient(90deg,#67d4f8,#1B6FE8,#06B6D4)', backgroundSize: '200% 100%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', animation: 'shimmer 4s ease-in-out infinite', fontSize: 'clamp(15px,1.7vw,19px)' }}>tu perfil, tu huella profesional</motion.div></div>
          </div>
          <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.5 }} style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginTop:12 }}>
            <span style={{ padding:'4px 12px', borderRadius:7, background:'rgba(27,111,232,0.2)', border:'0.5px solid rgba(27,111,232,0.3)', fontSize:10, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase', color:'#67d4f8' }}>{displayRol}</span>
            {isEstudiante && <span style={{ fontSize:11, color:'rgba(255,255,255,0.45)', fontWeight:500 }}>{academicInfo.universidad}</span>}
          </motion.div>
        </div>
        <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.55, duration:0.7 }} style={{ flexShrink:0, marginLeft:30, position:'relative' }}>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:120, height:120, borderRadius:'50%', border:'1.5px solid rgba(27,111,232,0.2)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:145, height:145, borderRadius:'50%', border:'0.8px solid rgba(27,111,232,0.1)', pointerEvents:'none' }} />
          <div style={{ width:95, height:95, borderRadius:24, border:'3px solid rgba(255,255,255,0.22)', boxShadow:'0 18px 45px rgba(0,0,0,0.3), 0 0 30px rgba(27,111,232,0.15)', overflow:'hidden', background:'#fff', position:'relative', zIndex:2 }}>
            {user.fotoPerfil ? <img alt="Foto de perfil" style={{ width:'100%', height:'100%', objectFit:'cover' }} src={user.fotoPerfil} /> : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#1B6FE8,#06B6D4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, fontWeight:800, color:'#fff' }}>{user.nombre?.charAt(0) || 'U'}</div>}
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7, duration:0.5 }} style={{ position:'absolute', right:44, bottom:18, zIndex:10 }}>
        {isEstudiante && (
          <button onClick={onEdit} style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(27,111,232,0.15)', border:'1px solid rgba(27,111,232,0.3)', color:'#fff', padding:'8px 20px', borderRadius:50, fontSize:11, fontWeight:700, cursor:'pointer', transition:'all 0.25s', fontFamily:'inherit', whiteSpace:'nowrap', backdropFilter:'blur(8px)' }}
            onMouseEnter={e => { e.currentTarget.style.background='#1B6FE8'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(27,111,232,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(27,111,232,0.15)'; e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
            {completitud < 100 ? 'Completar perfil' : 'Editar perfil'}<ArrowRight size={12} />
          </button>
        )}
      </motion.div>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1.5, background:'linear-gradient(90deg,transparent,rgba(27,111,232,0.5) 30%,rgba(6,182,212,0.5) 60%,transparent)' }} />
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   COMPONENTE PRINCIPAL PerfilPage
═══════════════════════════════════════════════ */
const PerfilPage = () => {
  const { data: userProfile, isLoading, isError, error } = usePerfil();
  const { mutate: updatePerfil, isPending: isUpdating } = useUpdatePerfil();
  const { rol: storeRol } = useAuthStore();
  const isEstudiante = storeRol === 'ESTUDIANTE';
  const { data: postulaciones = [] } = useMisPostulaciones({ enabled: isEstudiante });
  const proyectosAceptados = postulaciones.filter(p => p.estado === 'ACEPTADO');

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [formData, setFormData] = useState({ bio: '', skills: '', portafolioUrl: '', linkedinUrl: '', telefono: '' });

  const handleStartEdit = () => {
    setFormData({ bio: userProfile?.bio || '', skills: userProfile?.skills || '', portafolioUrl: userProfile?.portafolioUrl || '', linkedinUrl: userProfile?.linkedinUrl || '', telefono: userProfile?.telefono || '' });
    setIsEditing(true);
  };
  const handleCancelEdit = () => setIsEditing(false);
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); updatePerfil(formData, { onSuccess: () => setIsEditing(false) }); };
  const handleLocationSave = (locationData) => {
    updatePerfil({ ciudad: locationData.ciudad, pais: locationData.pais, sector: locationData.sector }, { onSuccess: () => setIsEditingLocation(false) });
  };

  if (isLoading) return (
    <div style={{ fontFamily:"Inter, Arial, 'Helvetica Neue', sans-serif", background:'#f5f4f0', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, color:'#6b6b7a' }}><Loader2 className="animate-spin" size={22} /><span style={{ fontWeight:600, fontSize:13 }}>Cargando perfil...</span></div>
    </div>
  );
  if (isError) return (
    <div style={{ fontFamily:"Inter, Arial, 'Helvetica Neue', sans-serif", background:'#f5f4f0', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:16, padding:24, maxWidth:400, textAlign:'center' }}><p style={{ fontWeight:700, color:'#dc2626', marginBottom:4 }}>Error al cargar el perfil</p><p style={{ fontSize:12, color:'#ef4444' }}>{error.response?.data?.message || error.message || 'Error desconocido'}</p></div>
    </div>
  );

  const user = userProfile || {};
  const displayRol = user.rol || storeRol || 'Estudiante';
  const academicInfo = { universidad: user.universidad || 'No especificada', carrera: user.carrera || 'No especificada', codigo: user.codigo || 'No especificado', ciclo: user.ciclo || 'No especificado' };
  const locationInfo = { ciudad: user.ciudad || '', pais: user.pais || '', sector: user.sector || '' };

  let completitud = 10;
  if (user.bio) completitud += 15;
  if (user.skills && user.skills.length > 0) completitud += 15;
  if (user.telefono) completitud += 10;
  if (user.linkedinUrl) completitud += 10;
  if (user.portafolioUrl) completitud += 10;
  if (user.ciudad) completitud += 10;
  if (user.pais) completitud += 10;
  if (user.cvUrl) completitud += 10;
  if (completitud > 100) completitud = 100;

  const S = {
    sectionTitle: { fontSize:15, fontWeight:700, letterSpacing:'-0.02em', color:'#0f1f3d', display:'flex', alignItems:'center', gap:8, marginBottom:14 },
    sectionBar: { display:'block', width:3, height:16, background:'#1B6FE8', borderRadius:2, flexShrink:0 },
    card: { background:'#fff', border:'0.5px solid #e8e8e4', borderRadius:16, padding:24 },
  };

  const mapSrc = locationInfo.ciudad
    ? `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(locationInfo.ciudad + ', ' + locationInfo.pais)}`
    : null;

  return (
    <div style={{ fontFamily:"Inter, Arial, 'Helvetica Neue', sans-serif", background:'#f5f4f0', minHeight:'100vh', padding:'32px 36px', maxWidth:1440, margin:'0 auto' }}>
      <EditProfileModal isOpen={isEditing} onClose={handleCancelEdit} formData={formData} onChange={handleInputChange} onSubmit={handleSubmit} isUpdating={isUpdating} />
      <EditLocationModal isOpen={isEditingLocation} onClose={() => setIsEditingLocation(false)} ciudadActual={locationInfo.ciudad} paisActual={locationInfo.pais} sectorActual={locationInfo.sector} onSave={handleLocationSave} isUpdating={isUpdating} />
      <ProfileHeroBanner user={user} completitud={completitud} displayRol={displayRol} academicInfo={academicInfo} isEstudiante={isEstudiante} onEdit={handleStartEdit} />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {isEstudiante && (
            <motion.section {...fadeUp(0.10)} style={S.card}>
              <div style={S.sectionTitle}><span style={S.sectionBar} />Trayectoria Académica</div>
              <div style={{ position:'relative', paddingLeft:24, borderLeft:'2px solid #f1f5f9' }}>
                <div style={{ position:'absolute', left:-5, top:4, width:8, height:8, borderRadius:'50%', background:'#1B6FE8', border:'2px solid #fff', boxShadow:'0 0 0 3px rgba(27,111,232,0.12)' }} />
                <div style={{ padding:16, background:'#f8fafc', borderRadius:14, border:'0.5px solid #e8e8e4' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                    <h4 style={{ fontSize:13, fontWeight:700, color:'#1B6FE8', margin:0 }}>{academicInfo.carrera}</h4>
                    <span style={{ fontSize:8, fontWeight:700, color:'#059669', background:'#ecfdf5', border:'0.5px solid #a7f3d0', padding:'3px 8px', borderRadius:20, display:'inline-flex', alignItems:'center', gap:3 }}><CheckCircle2 size={9} />Presente</span>
                  </div>
                  <p style={{ fontSize:12, fontWeight:600, color:'#0f1f3d', margin:'4px 0 0' }}>{academicInfo.universidad}</p>
                  <p style={{ fontSize:10, color:'#6b6b7a', fontWeight:500, margin:0 }}>Código: {academicInfo.codigo} · Ciclo: {academicInfo.ciclo}</p>
                </div>
              </div>
            </motion.section>
          )}
          {isEstudiante && (
            <motion.section {...fadeUp(0.12)} style={S.card}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ ...S.sectionTitle, marginBottom:0 }}><span style={S.sectionBar} />Perfil Profesional</div>
                <button onClick={handleStartEdit} style={{ fontSize:10, fontWeight:600, color:'#1B6FE8', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:3, fontFamily:'inherit' }}><Edit2 size={10} />Editar</button>
              </div>
              <div style={{ padding: 16, background: '#f8fafc', borderRadius: 14, border: '0.5px solid #e8e8e4' }}>
                {user.bio ? <p style={{ fontSize: 12, fontWeight: 500, color: '#334155', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>{user.bio}</p> : <button onClick={handleStartEdit} style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, fontFamily: 'inherit', width: '100%', textAlign: 'left', padding: 0 }}>+ Agregar una biografía...</button>}
              </div>
            </motion.section>
          )}
          {isEstudiante && (
            <motion.section {...fadeUp(0.14)} style={S.card}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <div style={S.sectionTitle}><span style={S.sectionBar} />Portafolio de Proyectos</div>
                <Link to="/mis-postulaciones" style={{ fontSize:11, fontWeight:600, color:'#1B6FE8', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>Ver todos <ArrowRight size={11} /></Link>
              </div>
              {proyectosAceptados.length > 0 ? (
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>{proyectosAceptados.slice(0, 4).map((proyecto, idx) => (
                  <Link key={idx} to={`/proyectos/${proyecto.proyectoId}`} style={{ textDecoration:'none' }}><div style={{ position:'relative', borderRadius:14, overflow:'hidden', cursor:'pointer', aspectRatio:'16/9', background:'#0d1b35', border:'0.5px solid #e8e8e4', transition:'all 0.2s' }}><div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#0d1b35,#0f2a4a)', opacity:0.85 }} /><div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} /><div style={{ position:'absolute', bottom:0, left:0, right:0, padding:12, zIndex:10 }}><h5 style={{ fontSize:12, fontWeight:700, color:'#fff', margin:'0 0 2px' }}>{proyecto.proyectoTitulo || 'Proyecto'}</h5><span style={{ fontSize:9, fontWeight:600, color:'#4ade80', display:'flex', alignItems:'center', gap:3 }}><CheckCircle2 size={9} />Aceptado</span></div></div></Link>
                ))}</div>
              ) : (
                <div style={{ padding:24, textAlign:'center', background:'#f8fafc', borderRadius:12, border:'0.5px dashed #e8e8e4' }}><p style={{ fontSize:12, color:'#6b6b7a', marginBottom:12, fontWeight:500 }}>Aún no tienes proyectos completados.</p><Link to="/proyectos" style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#1B6FE8', color:'#fff', padding:'8px 16px', borderRadius:8, fontSize:11, fontWeight:700, textDecoration:'none' }}>Explorar Proyectos <ArrowRight size={12} /></Link></div>
              )}
            </motion.section>
          )}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {isEstudiante && (
            <motion.section {...fadeUp(0.12)} style={{ ...S.card }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:14, fontWeight:700, color:'#0f1f3d' }}>Completitud del Perfil</span>
                <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.03em', color: completitud >= 80 ? '#059669' : completitud >= 50 ? '#1B6FE8' : '#e04a3b' }}>{completitud}%</span>
              </div>
              <div style={{ width:'100%', height:8, background:'#f1f5f9', borderRadius:4, overflow:'hidden', border:'0.5px solid #e8e8e4' }}>
                <motion.div initial={{ width:0 }} animate={{ width:`${completitud}%` }} transition={{ duration:1.2, ease:'easeOut', delay:0.2 }} style={{ height:'100%', borderRadius:4, background: completitud >= 80 ? 'linear-gradient(90deg, #059669, #10b981, #34d399)' : completitud >= 50 ? 'linear-gradient(90deg, #1B6FE8, #3b82f6, #06B6D4)' : 'linear-gradient(90deg, #e04a3b, #f97316, #fb923c)', boxShadow: completitud >= 80 ? '0 0 12px rgba(16, 185, 129, 0.4)' : completitud >= 50 ? '0 0 12px rgba(27, 111, 232, 0.4)' : '0 0 12px rgba(224, 74, 59, 0.4)' }} />
              </div>
              <p style={{ fontSize:11, color:'#6b6b7a', fontWeight:500, marginTop:8, marginBottom:0 }}>{completitud < 50 ? 'Completa tu perfil' : completitud < 80 ? '¡Vas por buen camino!' : completitud < 100 ? '¡Casi completo!' : '¡Perfil completo!'}</p>
            </motion.section>
          )}
          <motion.section {...fadeUp(0.16)} style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ ...S.sectionTitle, marginBottom: 0 }}><span style={S.sectionBar} />Ubicación</div>
              {isEstudiante && <button onClick={() => setIsEditingLocation(true)} style={{ fontSize: 10, fontWeight: 600, color: '#1B6FE8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'inherit' }}><Edit2 size={10} />{locationInfo.ciudad ? 'Actualizar' : 'Agregar ubicación'}</button>}
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 14, background: '#f8fafc', borderRadius: 14, border: '0.5px solid #e8e8e4', marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #1B6FE8, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><MapPin size={18} color="#fff" /></div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#0f1f3d', margin: '0 0 2px' }}>{[locationInfo.ciudad, locationInfo.pais].filter(Boolean).join(', ') || 'Sin ubicación'}</p>
                <p style={{ fontSize: 11, color: '#6b6b7a', fontWeight: 500, margin: 0 }}>{locationInfo.sector || ''}</p>
              </div>
            </div>
            <div style={{ borderRadius: 14, overflow: 'hidden', border: '0.5px solid #e8e8e4', height: 160, background: '#e8e8e4', position: 'relative' }}>
              {mapSrc ? <iframe title="Ubicación" width="100%" height="160" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src={mapSrc} /> : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}><MapPin size={32} strokeWidth={1.5} /><p style={{ fontSize: 11, fontWeight: 500, marginTop: 6 }}>Sin ubicación</p></div>}
            </div>
          </motion.section>
          <motion.section {...fadeUp(0.20)} style={S.card}>
            <div style={S.sectionTitle}><span style={S.sectionBar} />Conectividad</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {user.linkedinUrl ? <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" style={linkItemStyle('#eff6ff', '#bfdbfe')}><div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ width:28, height:28, borderRadius:8, background:'#0077B5', display:'flex', alignItems:'center', justifyContent:'center' }}><Globe size={13} color="#fff" /></div><span style={{ fontSize:11, fontWeight:600, color:'#1B6FE8' }}>LinkedIn</span></div><ExternalLink size={12} color="#1B6FE8" /></a> : isEstudiante && <button onClick={handleStartEdit} style={emptyLinkStyle}><div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ width:28, height:28, borderRadius:8, background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center' }}><Globe size={13} color="#94a3b8" /></div><span style={{ fontSize:11, fontWeight:500, color:'#94a3b8', fontStyle:'italic' }}>Vincular LinkedIn</span></div><Edit2 size={12} color="#cbd5e1" /></button>}
              {user.portafolioUrl ? <a href={user.portafolioUrl} target="_blank" rel="noopener noreferrer" style={linkItemStyle('#f8fafc', '#e8e8e4')}><div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ width:28, height:28, borderRadius:8, background:'#0d1b35', display:'flex', alignItems:'center', justifyContent:'center' }}><Briefcase size={13} color="#fff" /></div><span style={{ fontSize:11, fontWeight:600, color:'#0f1f3d' }}>Portafolio</span></div><ExternalLink size={12} color="#6b6b7a" /></a> : isEstudiante && <button onClick={handleStartEdit} style={emptyLinkStyle}><div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ width:28, height:28, borderRadius:8, background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center' }}><Briefcase size={13} color="#94a3b8" /></div><span style={{ fontSize:11, fontWeight:500, color:'#94a3b8', fontStyle:'italic' }}>Vincular Portafolio</span></div><Edit2 size={12} color="#cbd5e1" /></button>}
              <a href={`mailto:${user.email || ''}`} style={linkItemStyle('#f8fafc', '#e8e8e4')}><div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ width:28, height:28, borderRadius:8, background:'#1B6FE8', display:'flex', alignItems:'center', justifyContent:'center' }}><Mail size={13} color="#fff" /></div><span style={{ fontSize:11, fontWeight:600, color:'#0f1f3d', maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email || 'No disponible'}</span></div><Send size={12} color="#94a3b8" /></a>
              {user.telefono ? <div style={{ display:'flex', alignItems:'center', gap:8, padding:10, borderRadius:10, background:'#f8fafc', border:'0.5px solid #e8e8e4' }}><div style={{ width:28, height:28, borderRadius:8, background:'#10b981', display:'flex', alignItems:'center', justifyContent:'center' }}><Phone size={13} color="#fff" /></div><span style={{ fontSize:11, fontWeight:600, color:'#0f1f3d' }}>{user.telefono}</span></div> : isEstudiante && <button onClick={handleStartEdit} style={emptyLinkStyle}><div style={{ display:'flex', alignItems:'center', gap:8 }}><div style={{ width:28, height:28, borderRadius:8, background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center' }}><Phone size={13} color="#94a3b8" /></div><span style={{ fontSize:11, fontWeight:500, color:'#94a3b8', fontStyle:'italic' }}>Agregar Teléfono</span></div><Edit2 size={12} color="#cbd5e1" /></button>}
            </div>
          </motion.section>
          {isEstudiante && (
            <motion.section {...fadeUp(0.24)} style={S.card}>
              <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}><div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #1B6FE8, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={16} color="#fff" /></div><div><span style={{ fontSize: 13, fontWeight: 700, color: '#0f1f3d' }}>Currículum Vitae</span><p style={{ fontSize: 10, color: '#6b6b7a', margin: '1px 0 0', fontWeight: 500 }}>Sube tu CV en PDF</p></div></div>
                <CvUploader cvUrl={user.cvUrl} />
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}><div style={{ ...S.sectionTitle, marginBottom:0 }}><span style={S.sectionBar} />Habilidades</div><button onClick={handleStartEdit} style={{ fontSize:10, fontWeight:600, color:'#1B6FE8', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:3, fontFamily:'inherit' }}><Edit2 size={10} />Editar</button></div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {user.skills ? user.skills.split(',').map((skill, index) => { const { bg, color, border } = getSkillColor(skill.trim()); return <span key={index} style={{ padding:'4px 10px', borderRadius:20, fontSize:10, fontWeight:700, background:bg, color:color, border:`0.5px solid ${border}` }}>{skill.trim()}</span>; }) : <button onClick={handleStartEdit} style={{ fontSize:11, color:'#94a3b8', fontStyle:'italic', background:'none', border:'none', cursor:'pointer', fontWeight:500, fontFamily:'inherit' }}>+ Agregar habilidades...</button>}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;