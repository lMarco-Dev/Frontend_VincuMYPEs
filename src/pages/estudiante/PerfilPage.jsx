import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Mail, Phone, MapPin, Edit2, Loader2, ExternalLink, Save, X, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { usePerfil, useUpdatePerfil } from '@features/perfil/usePerfil';
import { CvUploader } from '@features/perfil/CvUploader';
import { useMisPostulaciones } from '@features/postulaciones-list/useMisPostulaciones';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FONT = "'Angro Std', 'Outfit', sans-serif";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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

const labelStyle = {
  fontSize: 11,
  fontWeight: 700,
  color: '#64748B',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  display: 'block',
  marginBottom: 6,
  fontFamily: FONT,
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: 10,
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  fontSize: 13,
  fontWeight: 500,
  color: '#0F1F3D',
  outline: 'none',
  fontFamily: FONT,
  transition: 'all 0.2s',
  boxSizing: 'border-box',
  resize: 'vertical',
};

const readonlyFieldStyle = {
  padding: '12px 14px',
  borderRadius: 10,
  background: '#F1F5F9',
  border: '1px solid #E2E8F0',
  fontSize: 13,
  fontWeight: 600,
  color: '#0F1F3D',
  minHeight: 20,
  display: 'flex',
  alignItems: 'center',
  fontFamily: FONT,
};

/* ═══════════════════════════════════════════════
   GOOGLE MAPS
═══════════════════════════════════════════════ */
let googleMapsPromise = null;
const loadGoogleMaps = () => {
  if (googleMapsPromise) return googleMapsPromise;
  if (window.google && window.google.maps) return Promise.resolve();
  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true; script.defer = true;
    script.onload = resolve; script.onerror = reject;
    document.head.appendChild(script);
  });
  return googleMapsPromise;
};

const InteractiveMap = ({ searchQuery, onLocationSelect, selectedCoords }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => { loadGoogleMaps().then(() => setIsLoaded(true)).catch(console.error); }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 14, center: { lat: -7.1638, lng: -78.5001 },
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
      styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }, { featureType: 'transit', stylers: [{ visibility: 'off' }] }],
    });
    map.addListener('click', (e) => { const lat = e.latLng.lat(); const lng = e.latLng.lng(); placeMarkerAndCircle(map, { lat, lng }); reverseGeocode(lat, lng); });
    mapInstanceRef.current = map;
  }, [isLoaded]);

  const placeMarkerAndCircle = useCallback((map, position) => {
    if (markerRef.current) markerRef.current.setMap(null);
    if (circleRef.current) circleRef.current.setMap(null);
    markerRef.current = new window.google.maps.Marker({ position, map, animation: window.google.maps.Animation.DROP, icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 10, fillColor: '#FACC15', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 } });
    circleRef.current = new window.google.maps.Circle({ map, center: position, radius: 200, strokeColor: '#FACC15', strokeOpacity: 0.9, strokeWeight: 2.5, fillColor: '#FACC15', fillOpacity: 0.18 });
    map.panTo(position);
  }, []);

  const reverseGeocode = useCallback((lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) onLocationSelect({ ...extractLocationData(results[0]), lat, lng });
    });
  }, [onLocationSelect]);

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !searchQuery || searchQuery.length < 3) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const position = results[0].geometry.location;
        placeMarkerAndCircle(mapInstanceRef.current, position);
        mapInstanceRef.current.setZoom(15);
        onLocationSelect({ ...extractLocationData(results[0]), lat: position.lat(), lng: position.lng() });
      }
    });
  }, [searchQuery, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !selectedCoords) return;
    placeMarkerAndCircle(mapInstanceRef.current, { lat: selectedCoords.lat, lng: selectedCoords.lng });
    mapInstanceRef.current.panTo({ lat: selectedCoords.lat, lng: selectedCoords.lng });
    mapInstanceRef.current.setZoom(15);
  }, [selectedCoords, isLoaded]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: 400, borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0', background: '#e2e8f0' }}>
      {!isLoaded && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', gap: 8 }}><Loader2 size={18} className="animate-spin" /><span style={{ fontSize: 12, fontFamily: FONT }}>Cargando mapa...</span></div>}
    </div>
  );
};

const StaticMapWithCircle = ({ lat, lng, height = 180 }) => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => { loadGoogleMaps().then(() => setIsLoaded(true)).catch(console.error); }, []);
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !lat || !lng) return;
    const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
    const map = new window.google.maps.Map(mapRef.current, { zoom: 15, center: position, mapTypeControl: false, streetViewControl: false, fullscreenControl: false, zoomControl: false, draggable: false, scrollwheel: false, disableDoubleClickZoom: true, styles: [{ featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] }, { featureType: 'transit', stylers: [{ visibility: 'off' }] }] });
    new window.google.maps.Marker({ position, map, icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#FACC15', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2.5 } });
    new window.google.maps.Circle({ map, center: position, radius: 150, strokeColor: '#FACC15', strokeOpacity: 0.85, strokeWeight: 2, fillColor: '#FACC15', fillOpacity: 0.15 });
  }, [isLoaded, lat, lng]);
  return (
    <div ref={mapRef} style={{ width: '100%', height, borderRadius: 12, overflow: 'hidden', border: '1px solid #E2E8F0', background: '#e2e8f0' }}>
      {!isLoaded && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}><Loader2 size={18} className="animate-spin" /></div>}
    </div>
  );
};

const extractLocationData = (result) => {
  const components = result.address_components;
  let foundPais = '', foundDepartamento = '', foundDistrito = '', foundBarrio = '';
  components.forEach(comp => {
    const types = comp.types;
    if (types.includes('country')) foundPais = comp.long_name;
    if (types.includes('administrative_area_level_1')) foundDepartamento = comp.long_name;
    if (types.includes('administrative_area_level_2') && !foundDepartamento) foundDepartamento = comp.long_name;
    if (types.includes('locality') || types.includes('administrative_area_level_3')) foundDistrito = comp.long_name;
    if (types.includes('neighborhood') || types.includes('sublocality') || types.includes('sublocality_level_1')) foundBarrio = comp.long_name;
  });
  if (!foundDepartamento) foundDepartamento = foundDistrito;
  return { pais: foundPais, departamento: foundDepartamento, sector: foundDistrito || foundDepartamento, barrio: foundBarrio };
};

/* ═══════════════════════════════════════════════
   MODAL EDITAR PERFIL
═══════════════════════════════════════════════ */
const EditProfileModal = ({ isOpen, onClose, formData, onChange, onSubmit, isUpdating }) => {
  if (!isOpen) return null;

  const handleToggleSkill = (skill) => {
    const currentSkills = formData.skills.split(',').map(s => s.trim()).filter(Boolean);
    const isSelected = currentSkills.includes(skill);
    const newSkills = isSelected ? currentSkills.filter(s => s !== skill).join(', ') : [...currentSkills, skill].join(', ');
    onChange({ target: { name: 'skills', value: newSkills } });
  };
  const currentSkillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,53,0.6)', backdropFilter: 'blur(4px)' }} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', background: '#fff', borderRadius: 20, padding: '32px 36px', maxWidth: 900, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(13,27,53,0.25)', border: '1px solid #E2E8F0', fontFamily: FONT }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0F1F3D', margin: 0, fontFamily: FONT }}>Editar Perfil</h3>
            <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0', fontFamily: FONT }}>Completa tu información profesional</p>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="#64748B" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 55%', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Biografía</label>
                <textarea name="bio" value={formData.bio} onChange={onChange} placeholder="Cuéntanos un poco sobre ti..." rows={4} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input type="tel" name="telefono" value={formData.telefono} onChange={onChange} placeholder="+51 987654321" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>LinkedIn URL</label>
                  <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={onChange} placeholder="https://linkedin.com/in/..." style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Portafolio URL</label>
                <input type="url" name="portafolioUrl" value={formData.portafolioUrl} onChange={onChange} placeholder="https://github.com/tuusuario" style={inputStyle} />
              </div>
            </div>

            <div style={{ flex: '1 1 35%', minWidth: 250 }}>
              <label style={labelStyle}>Habilidades</label>
              <input type="text" name="skills" value={formData.skills} onChange={onChange} placeholder="Tus habilidades..." style={{ ...inputStyle, marginBottom: 12 }} />
              <div style={{ background: '#F8FAFC', borderRadius: 10, padding: 14, border: '1px solid #E2E8F0', maxHeight: 280, overflowY: 'auto' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', margin: '0 0 10px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: FONT }}>Sugerencias</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['JavaScript','TypeScript','React','Next.js','Vue.js','Angular','HTML5','CSS3','Tailwind CSS','Node.js','Express.js','Python','Django','Flask','FastAPI','Java','Spring Boot','C#','.NET','PHP','Laravel','Kotlin','Swift','Flutter','React Native','Docker','Kubernetes','AWS','Azure','PostgreSQL','MongoDB','MySQL','Redis','GraphQL','REST API','Git','Figma','Scrum','CI/CD','Linux','TensorFlow','PyTorch','Selenium','Jest','Cypress','Firebase','WordPress'].map((skill) => {
                    const isSelected = currentSkillsArray.includes(skill);
                    return (
                      <button key={skill} type="button" onClick={() => handleToggleSkill(skill)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 14, fontSize: 10, fontWeight: 600, background: isSelected ? '#EFF6FF' : '#fff', color: isSelected ? '#1B6FE8' : '#64748B', border: isSelected ? '1px solid #BFDBFE' : '1px solid #E2E8F0', cursor: 'pointer', fontFamily: FONT, transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
                        {isSelected && <span style={{ width: 3.5, height: 3.5, borderRadius: '50%', background: '#1B6FE8', flexShrink: 0 }} />}
                        {skill}
                        {isSelected && <X size={9} style={{ marginLeft: 1, opacity: 0.6 }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>
              Cancelar
            </button>
            <motion.button type="submit" disabled={isUpdating} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ padding: '10px 24px', borderRadius: 10, background: '#1B6FE8', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: isUpdating ? 'not-allowed' : 'pointer', fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 6, opacity: isUpdating ? 0.7 : 1, boxShadow: '0 4px 12px rgba(27,111,232,0.25)' }}>
              {isUpdating ? <><Loader2 size={14} className="animate-spin" />Guardando...</> : <><Save size={14} />Guardar cambios</>}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MODAL EDITAR UBICACIÓN
═══════════════════════════════════════════════ */
const EditLocationModal = ({ isOpen, onClose, ciudadActual, paisActual, sectorActual, barrioActual, latActual, lngActual, onSave, isUpdating }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [pais, setPais] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [sector, setSector] = useState('');
  const [barrio, setBarrio] = useState('');
  const [coords, setCoords] = useState(null);
  const [geocodeQuery, setGeocodeQuery] = useState('');
  const debounceRef = useRef(null);
  const prevValuesRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const p = paisActual && paisActual !== 'No especificado' ? paisActual : '';
    const d = ciudadActual && ciudadActual !== 'No especificada' ? ciudadActual : '';
    const s = sectorActual && sectorActual !== 'No especificado' ? sectorActual : '';
    const b = barrioActual && barrioActual !== 'No especificado' ? barrioActual : '';
    const newValues = `${p}|${d}|${s}|${b}`;
    if (prevValuesRef.current === newValues) return;
    prevValuesRef.current = newValues;
    setPais(p); setDepartamento(d); setSector(s); setBarrio(b);
    if (d && p) setSearchQuery(`${d}, ${p}`); else setSearchQuery('');
    if (latActual && lngActual) setCoords({ lat: latActual, lng: lngActual }); else setCoords(null);
  }, [ciudadActual, paisActual, sectorActual, barrioActual, latActual, lngActual, isOpen]);

  if (!isOpen) return null;

  const handleLocationSelect = (loc) => { setPais(loc.pais || ''); setDepartamento(loc.departamento || ''); setSector(loc.sector || ''); setBarrio(loc.barrio || ''); if (loc.lat && loc.lng) setCoords({ lat: loc.lat, lng: loc.lng }); };
  const handleSearchChange = (e) => {
    const value = e.target.value; setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length >= 3) debounceRef.current = setTimeout(() => setGeocodeQuery(value), 600);
    else if (!value) { setPais(''); setDepartamento(''); setSector(''); setBarrio(''); setCoords(null); }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ciudad: [departamento, sector].filter(Boolean).join(', ') || searchQuery || '', pais: pais || '', sector: barrio || sector || '', barrio: barrio || '', lat: coords?.lat || null, lng: coords?.lng || null });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(13,27,53,0.6)', backdropFilter: 'blur(4px)' }} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', background: '#fff', borderRadius: 20, padding: '32px 36px', maxWidth: 900, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(13,27,53,0.25)', border: '1px solid #E2E8F0', fontFamily: FONT }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0F1F3D', margin: 0, fontFamily: FONT }}>Editar Ubicación</h3>
            <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0', fontFamily: FONT }}>Escribe o haz clic en el mapa para seleccionar</p>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="#64748B" />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 55%', minWidth: 300 }}>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Buscar o haz clic en el mapa</label>
              <div style={{ position: 'relative' }}>
                <Search size={14} color="#94A3B8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                <input type="text" value={searchQuery} onChange={handleSearchChange} placeholder="Ej: Cajamarca, Perú..." style={{ ...inputStyle, paddingLeft: 34 }} autoComplete="off" />
              </div>
              <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: 500, fontFamily: FONT }}>También puedes hacer clic directamente en cualquier punto del mapa</p>
            </div>
            <InteractiveMap searchQuery={geocodeQuery} onLocationSelect={handleLocationSelect} selectedCoords={coords} />
          </div>

          <div style={{ flex: '1 1 35%', minWidth: 250, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[['País', pais], ['Departamento', departamento], ['Distrito / Sector', sector], ['Barrio', barrio]].map(([label, value]) => (
              <div key={label}>
                <label style={labelStyle}>{label}</label>
                <div style={{ ...readonlyFieldStyle, background: value ? '#F0FDF4' : '#F1F5F9', border: value ? '1px solid #BBF7D0' : '1px solid #E2E8F0' }}>
                  {value || <span style={{ color: '#94A3B8', fontWeight: 400 }}>Se autocompletará...</span>}
                </div>
              </div>
            ))}
            {coords && (
              <div style={{ padding: '8px 12px', borderRadius: 8, background: '#FEFCE8', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FACC15', flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 600, color: '#92400E', fontFamily: FONT }}>Ubicación seleccionada en el mapa</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 'auto', paddingTop: 14 }}>
              <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: FONT }}>Cancelar</button>
              <motion.button type="submit" disabled={isUpdating} onClick={handleSubmit} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ padding: '10px 24px', borderRadius: 10, background: '#1B6FE8', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: isUpdating ? 'not-allowed' : 'pointer', fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 6, opacity: isUpdating ? 0.7 : 1, boxShadow: '0 4px 12px rgba(27,111,232,0.25)' }}>
                {isUpdating ? <><Loader2 size={14} className="animate-spin" />Guardando...</> : <><Save size={14} />Guardar ubicación</>}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   HERO BANNER — animación conservada intacta
═══════════════════════════════════════════════ */
const ProfileHeroBanner = ({ user, completitud, displayRol, academicInfo, isEstudiante, onEdit }) => {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);
  React.useEffect(() => {
    const canvas = canvasRef.current, hero = heroRef.current;
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');
    let W, H, animId;
    const COLORS = ['rgba(27,111,232,','rgba(6,182,212,','rgba(212,88,10,','rgba(255,255,255,','rgba(16,185,129,'];
    const resize = () => { W = canvas.width = hero.offsetWidth; H = canvas.height = hero.offsetHeight; };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(hero);
    class RisingParticle {
      reset() { this.x = Math.random()*W; this.y = H+Math.random()*50; this.size = Math.random()*2.5+0.8; this.speedX = (Math.random()-0.5)*0.3; this.speedY = -(Math.random()*1.2+0.4); this.alpha = Math.random()*0.5+0.2; this.color = COLORS[Math.floor(Math.random()*COLORS.length)]; this.waveFreq = Math.random()*Math.PI*2; }
      constructor() { this.reset(); }
      update() { this.x += this.speedX + Math.sin(Date.now()*0.002+this.waveFreq)*0.15; this.y += this.speedY; if (this.y < -20) this.reset(); }
      draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI*2); ctx.fillStyle = this.color+this.alpha+')'; ctx.fill(); if (this.size > 1.8) { ctx.shadowBlur = 6; ctx.shadowColor = this.color+this.alpha+')'; ctx.fill(); ctx.shadowBlur = 0; } }
    }
    const particles = Array.from({ length: 85 }, () => new RisingParticle());
    const drawConnections = () => { for (let i=0;i<particles.length;i++) { for (let j=i+1;j<particles.length;j++) { const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy); if (d<70) { ctx.beginPath(); ctx.moveTo(particles[i].x,particles[i].y); ctx.lineTo(particles[j].x,particles[j].y); ctx.strokeStyle=`rgba(27,111,232,${0.05*(1-d/70)})`; ctx.lineWidth=0.5; ctx.stroke(); } } } };
    const animate = () => { ctx.clearRect(0,0,W,H); drawConnections(); particles.forEach(p=>{p.update();p.draw();}); animId=requestAnimationFrame(animate); };
    animate();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  const nombreCompleto = user.nombre || 'Usuario';
  return (
    <motion.div ref={heroRef} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.08, ease:[0.22,1,0.36,1] }}
      style={{ position:'relative', overflow:'hidden', borderRadius:20, background:'linear-gradient(135deg,#0d1b35,#0f2a4a 60%,#0a2240)', padding:'28px 44px', color:'#fff', marginBottom:24, fontFamily: FONT }}>
      <style>{`@keyframes heroPulse{0%{box-shadow:0 0 0 0 rgba(74,222,128,0.45)}70%{box-shadow:0 0 0 9px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}@keyframes orbF1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-18px,14px) scale(1.08)}66%{transform:translate(9px,-9px) scale(0.95)}}@keyframes orbF2{0%,100%{transform:translate(0,0)}40%{transform:translate(14px,-18px)}70%{transform:translate(-9px,11px)}}@keyframes orbF3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-13px,18px) scale(1.1)}}`}</style>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.6, pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(27,111,232,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,111,232,0.06) 1px,transparent 1px)', backgroundSize:'48px 48px', WebkitMaskImage:'radial-gradient(ellipse 80% 80% at 55% 50%,black,transparent)', maskImage:'radial-gradient(ellipse 80% 80% at 55% 50%,black,transparent)' }} />
      <div style={{ position:'absolute', top:-70, right:-40, width:250, height:250, borderRadius:'50%', background:'rgba(27,111,232,0.16)', filter:'blur(40px)', animation:'orbF1 8s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:-65, right:140, width:190, height:190, borderRadius:'50%', background:'rgba(212,88,10,0.09)', filter:'blur(40px)', animation:'orbF2 10s ease-in-out infinite' }} />
      <div style={{ position:'absolute', top:10, right:210, width:150, height:150, borderRadius:'50%', background:'rgba(6,182,212,0.07)', filter:'blur(40px)', animation:'orbF3 13s ease-in-out infinite' }} />

      <div style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ maxWidth:500 }}>
          <div style={{ fontSize:'clamp(23px,2.5vw,30px)', fontWeight:800, lineHeight:1.08, letterSpacing:'-0.035em', marginBottom:6 }}>
            <div style={{ overflow:'hidden' }}><motion.div initial={{ y:'110%', opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.15, duration:0.6, ease:[0.22,1,0.36,1] }} style={{ color:'#fff' }}>{nombreCompleto}</motion.div></div>
            <div style={{ overflow:'hidden' }}><motion.div initial={{ y:'110%', opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.27, duration:0.6, ease:[0.22,1,0.36,1] }} style={{ background:'linear-gradient(90deg,#67d4f8,#1B6FE8,#06B6D4)', backgroundSize:'200% 100%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'shimmer 4s ease-in-out infinite', fontSize:'clamp(15px,1.7vw,19px)' }}>tu perfil, tu huella profesional</motion.div></div>
          </div>
          {isEstudiante && (
            <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4, duration:0.5 }} style={{ marginTop:14 }}>
              <div style={{ maxWidth:340 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:10, fontWeight:600, color:'rgba(255,255,255,0.5)', letterSpacing:'0.05em', textTransform:'uppercase', fontFamily: FONT }}>Completitud del perfil</span>
                  <span style={{ fontSize:13, fontWeight:700, fontFamily: FONT, color: completitud >= 80 ? '#4ade80' : completitud >= 50 ? '#67d4f8' : '#fb923c' }}>{completitud}%</span>
                </div>
                <div style={{ width:'100%', height:5, background:'rgba(255,255,255,0.12)', borderRadius:3, overflow:'hidden' }}>
                  <motion.div
                    initial={{ width:0 }} animate={{ width:`${completitud}%` }}
                    transition={{ duration:1.2, ease:'easeOut', delay:0.5 }}
                    style={{ height:'100%', borderRadius:3, background: completitud >= 80 ? 'linear-gradient(90deg,#4ade80,#34d399)' : completitud >= 50 ? 'linear-gradient(90deg,#67d4f8,#1B6FE8)' : 'linear-gradient(90deg,#fb923c,#f97316)' }}
                  />
                </div>
                <p style={{ fontSize:10, color:'rgba(255,255,255,0.35)', fontWeight:500, margin:'5px 0 0', fontFamily: FONT }}>
                  {completitud < 50 ? 'Completa tu perfil' : completitud < 80 ? '¡Vas por buen camino!' : completitud < 100 ? '¡Casi completo!' : '¡Perfil completo!'}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:1.5, background:'linear-gradient(90deg,transparent,rgba(27,111,232,0.5) 30%,rgba(6,182,212,0.5) 60%,transparent)' }} />
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════════════ */
const PerfilPage = () => {
  const { data: userProfile, isLoading, isError, error } = usePerfil();
  const { mutate: updatePerfil, isPending: isUpdating } = useUpdatePerfil();
  const { rol: storeRol } = useAuthStore();
  const isEstudiante = storeRol === 'ESTUDIANTE';
  const { data: postulaciones = [] } = useMisPostulaciones({ enabled: isEstudiante });
  const proyectosAceptados = postulaciones.filter(p =>
    (p.estado === 'CONFIRMADO' || p.estado === 'ACEPTADO' || p.estado === 'Aceptado') && p.proyectoEstado !== 'COMPLETADO'
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [formData, setFormData] = useState({ bio: '', skills: '', portafolioUrl: '', linkedinUrl: '', telefono: '' });

  const handleStartEdit = () => {
    setFormData({ bio: userProfile?.bio || '', skills: userProfile?.skills || '', portafolioUrl: userProfile?.portafolioUrl || '', linkedinUrl: userProfile?.linkedinUrl || '', telefono: userProfile?.telefono || '' });
    setIsEditing(true);
  };
  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleSubmit = (e) => { e.preventDefault(); updatePerfil(formData, { onSuccess: () => setIsEditing(false) }); };
  const handleLocationSave = (locationData) => {
    updatePerfil({ ciudad: locationData.ciudad, pais: locationData.pais, sector: locationData.barrio || locationData.sector || '', barrio: locationData.barrio || '', lat: locationData.lat || null, lng: locationData.lng || null }, { onSuccess: () => setIsEditingLocation(false) });
  };

  if (isLoading) return (
    <div style={{ fontFamily: FONT, background: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#64748B' }}>
        <Loader2 className="animate-spin" size={22} />
        <span style={{ fontWeight: 600, fontSize: 13, fontFamily: FONT }}>Cargando perfil...</span>
      </div>
    </div>
  );

  if (isError) return (
    <div style={{ fontFamily: FONT, background: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 16, padding: 24, maxWidth: 400, textAlign: 'center', fontFamily: FONT }}>
        <p style={{ fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>Error al cargar el perfil</p>
        <p style={{ fontSize: 13, color: '#ef4444' }}>{error?.response?.data?.message || error?.message || 'Error desconocido'}</p>
      </div>
    </div>
  );

  const user = userProfile || {};
  const displayRol = user.rol || storeRol || 'Estudiante';
  const academicInfo = { universidad: user.universidad || 'No especificada', carrera: user.carrera || 'No especificada', codigo: user.codigoEstudiante || 'No especificado' };
  const locationInfo = { ciudad: user.ciudad || '', pais: user.pais || '', sector: user.sector || '', barrio: user.barrio || '', lat: user.lat || null, lng: user.lng || null };
  const locationString = [locationInfo.barrio, locationInfo.ciudad, locationInfo.pais].filter(Boolean).join(', ');

  let completitud = 10;
  if (user.bio) completitud += 15;
  if (user.skills?.length > 0) completitud += 15;
  if (user.telefono) completitud += 10;
  if (user.linkedinUrl) completitud += 10;
  if (user.portafolioUrl) completitud += 10;
  if (user.ciudad) completitud += 10;
  if (user.pais) completitud += 10;
  if (user.cvUrl) completitud += 10;
  if (completitud > 100) completitud = 100;

  const S = {
    card: { background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24, fontFamily: FONT, boxShadow: '0 2px 8px rgba(15,23,42,0.04)' },
    sectionTitle: { fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', color: '#0F1F3D', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontFamily: FONT },
    sectionBar: { display: 'block', width: 3, height: 14, background: '#1B6FE8', borderRadius: 2, flexShrink: 0 },
    editBtn: { fontSize: 11, fontWeight: 600, color: '#1B6FE8', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: FONT },
  };

  const ConnectivityRow = ({ href, label, onClick, isEmpty }) => {
    const isLink = !!href && !isEmpty;
    const Tag = isLink ? 'a' : 'button';
    const props = isLink
      ? { href, target: '_blank', rel: 'noopener noreferrer', style: { textDecoration: 'none' } }
      : { onClick, type: 'button' };
    return (
      <Tag {...props}>
        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E5E7EB', transition: 'all 0.15s', cursor: isEmpty ? 'pointer' : isLink ? 'pointer' : 'default' }}
          onMouseEnter={e => { if (isLink || isEmpty) { e.currentTarget.style.background = '#EFF6FF'; e.currentTarget.style.borderColor = '#BFDBFE'; } }}
          onMouseLeave={e => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
        >
          <span style={{ fontSize: 13, fontWeight: isEmpty ? 400 : 600, color: isEmpty ? '#94A3B8' : '#0F1F3D', fontFamily: FONT, fontStyle: isEmpty ? 'italic' : 'normal' }}>{label}</span>
          {isLink && <ExternalLink size={13} color="#94A3B8" />}
          {isEmpty && <Edit2 size={12} color="#CBD5E1" />}
        </div>
      </Tag>
    );
  };

  return (
    <div style={{ fontFamily: FONT, background: '#F8FAFC', minHeight: '100vh', padding: '32px 36px', maxWidth: 1200, margin: '0 auto', paddingBottom: 80 }}>
      <EditProfileModal isOpen={isEditing} onClose={() => setIsEditing(false)} formData={formData} onChange={handleInputChange} onSubmit={handleSubmit} isUpdating={isUpdating} />
      <EditLocationModal isOpen={isEditingLocation} onClose={() => setIsEditingLocation(false)} ciudadActual={locationInfo.ciudad} paisActual={locationInfo.pais} sectorActual={locationInfo.sector} barrioActual={locationInfo.barrio} latActual={locationInfo.lat} lngActual={locationInfo.lng} onSave={handleLocationSave} isUpdating={isUpdating} />

      <ProfileHeroBanner user={user} completitud={completitud} displayRol={displayRol} academicInfo={academicInfo} isEstudiante={isEstudiante} onEdit={handleStartEdit} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* ── COLUMNA PRINCIPAL ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Trayectoria Académica */}
          {isEstudiante && (
            <motion.section {...fadeUp(0.10)} style={S.card}>
              <div style={S.sectionTitle}><span style={S.sectionBar} />Trayectoria Académica</div>
              <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E5E7EB' }}>
                <div style={{ marginBottom: 4 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, color: '#1B6FE8', margin: 0, fontFamily: FONT }}>{academicInfo.carrera}</h4>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#0F1F3D', margin: '4px 0 0', fontFamily: FONT }}>{academicInfo.universidad}</p>
                <p style={{ fontSize: 11, color: '#64748B', fontWeight: 500, margin: '4px 0 0', fontFamily: FONT }}>Código: {academicInfo.codigo}</p>
              </div>
            </motion.section>
          )}

          {/* Perfil Profesional */}
          {isEstudiante && (
            <motion.section {...fadeUp(0.12)} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ ...S.sectionTitle, marginBottom: 0 }}><span style={S.sectionBar} />Perfil Profesional</div>
                <button onClick={handleStartEdit} style={S.editBtn}><Edit2 size={11} />Editar</button>
              </div>
              <div style={{ padding: 16, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E5E7EB' }}>
                {user.bio
                  ? <p style={{ fontSize: 13, fontWeight: 500, color: '#334155', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', fontFamily: FONT }}>{user.bio}</p>
                  : <button onClick={handleStartEdit} style={{ fontSize: 13, color: '#94A3B8', fontStyle: 'italic', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 400, fontFamily: FONT, padding: 0 }}>+ Agregar una biografía...</button>
                }
              </div>
            </motion.section>
          )}

          {/* Habilidades */}
          {isEstudiante && (
            <motion.section {...fadeUp(0.13)} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ ...S.sectionTitle, marginBottom: 0 }}><span style={S.sectionBar} />Habilidades</div>
                <button onClick={handleStartEdit} style={S.editBtn}><Edit2 size={11} />Editar</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {user.skills
                  ? user.skills.split(',').map((skill, idx) => { const { bg, color, border } = getSkillColor(skill.trim()); return <span key={idx} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: bg, color, border: `1px solid ${border}`, fontFamily: FONT }}>{skill.trim()}</span>; })
                  : <button onClick={handleStartEdit} style={{ fontSize: 13, color: '#94A3B8', fontStyle: 'italic', background: 'none', border: 'none', cursor: 'pointer', fontFamily: FONT, padding: 0 }}>+ Agregar habilidades...</button>
                }
              </div>
            </motion.section>
          )}

          {/* Proyectos */}
          {isEstudiante && (
            <motion.section {...fadeUp(0.14)} style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ ...S.sectionTitle, marginBottom: 0 }}><span style={S.sectionBar} />Proyectos</div>
                <Link to="/mis-postulaciones" style={{ fontSize: 11, fontWeight: 600, color: '#1B6FE8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontFamily: FONT }}>Ver todos <ArrowRight size={11} /></Link>
              </div>
              {proyectosAceptados.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {proyectosAceptados.slice(0, 4).map((proyecto, idx) => {
                    const titulo = proyecto.proyectoTitulo || 'Proyecto';
                    const colores = ['#1B6FE8', '#06B6D4', '#8B5CF6', '#10B981'];
                    const colorFondo = colores[idx % colores.length];
                    return (
                      <Link key={proyecto.id || idx} to={`/workspace/${proyecto.proyectoId}`} style={{ textDecoration: 'none' }}>
                        <motion.div
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: '#FCFDFD', borderRadius: 12, border: '1px solid #F1F5F9', cursor: 'pointer' }}
                          whileHover={{ background: '#F5F9FF', borderColor: '#DBEAFE' }}
                        >
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: colorFondo, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16, fontWeight: 700, color: '#fff', fontFamily: FONT }}>
                            {titulo.slice(0, 2).toUpperCase()}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h5 style={{ fontSize: 13, fontWeight: 600, color: '#0F1F3D', margin: 0, fontFamily: FONT }}>{titulo}</h5>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 20, fontSize: 9, fontWeight: 600, background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0', marginTop: 4, fontFamily: FONT }}>
                              <CheckCircle2 size={9} />Aceptado
                            </span>
                          </div>
                          <ArrowRight size={13} color="#CBD5E1" />
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', background: '#F8FAFC', borderRadius: 12, border: '1px dashed #E2E8F0' }}>
                  <p style={{ fontSize: 13, color: '#64748B', marginBottom: 12, fontFamily: FONT }}>Aún no tienes proyectos aceptados.</p>
                  <Link to="/proyectos" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1B6FE8', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, textDecoration: 'none', fontFamily: FONT }}>
                    Explorar proyectos <ArrowRight size={12} />
                  </Link>
                </div>
              )}
            </motion.section>
          )}
        </div>

        {/* ── COLUMNA LATERAL ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Ubicación */}
          <motion.section {...fadeUp(0.16)} style={S.card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ ...S.sectionTitle, marginBottom: 0 }}><span style={S.sectionBar} />Ubicación</div>
              {isEstudiante && (
                <button onClick={() => setIsEditingLocation(true)} style={S.editBtn}>
                  <Edit2 size={11} />{locationString ? 'Editar' : 'Agregar'}
                </button>
              )}
            </div>
            {locationString ? (
              <>
                <div style={{ padding: '10px 14px', background: '#F8FAFC', borderRadius: 10, border: '1px solid #E5E7EB', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={14} color="#1B6FE8" />
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#0F1F3D', margin: 0, fontFamily: FONT }}>{locationString}</p>
                  </div>
                </div>
                {locationInfo.lat && locationInfo.lng
                  ? <StaticMapWithCircle lat={locationInfo.lat} lng={locationInfo.lng} height={160} />
                  : <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #E5E7EB', height: 160, background: '#e8e8e4' }}>
                      <iframe title="Ubicación" width="100%" height="160" style={{ border: 0 }} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(locationString)}&zoom=15`} />
                    </div>
                }
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 120, background: '#F8FAFC', borderRadius: 12, border: '1px dashed #E2E8F0', color: '#94A3B8' }}>
                <MapPin size={24} strokeWidth={1.5} />
                <p style={{ fontSize: 12, fontWeight: 500, marginTop: 8, marginBottom: 0, fontFamily: FONT }}>Sin ubicación</p>
              </div>
            )}
          </motion.section>

          {/* Conectividad */}
          <motion.section {...fadeUp(0.20)} style={S.card}>
            <div style={{ ...S.sectionTitle }}><span style={S.sectionBar} />Conectividad</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {user.linkedinUrl
                ? <ConnectivityRow href={user.linkedinUrl} label="LinkedIn" />
                : isEstudiante && <ConnectivityRow isEmpty onClick={handleStartEdit} label="Vincular LinkedIn" />
              }
              {user.portafolioUrl
                ? <ConnectivityRow href={user.portafolioUrl} label="Portafolio" />
                : isEstudiante && <ConnectivityRow isEmpty onClick={handleStartEdit} label="Vincular portafolio" />
              }
              <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
                <Mail size={13} color="#64748B" style={{ marginRight: 8, flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: '#0F1F3D', fontFamily: FONT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email || 'No disponible'}</span>
              </div>
              {user.telefono
                ? <div style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E5E7EB' }}>
                    <Phone size={13} color="#64748B" style={{ marginRight: 8, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#0F1F3D', fontFamily: FONT }}>{user.telefono}</span>
                  </div>
                : isEstudiante && <ConnectivityRow isEmpty onClick={handleStartEdit} label="Agregar teléfono" />
              }
            </div>
          </motion.section>

          {/* Currículum Vitae */}
          {isEstudiante && (
            <motion.section {...fadeUp(0.24)} style={S.card}>
              <div style={{ ...S.sectionTitle }}><span style={S.sectionBar} />Currículum Vitae</div>
              <CvUploader cvUrl={user.cvUrl} />
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;
