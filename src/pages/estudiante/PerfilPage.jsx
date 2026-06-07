import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/authStore';
import { User, Mail, Phone, GraduationCap, MapPin, Edit2, Loader2, Globe, ExternalLink, Save, X, Briefcase, Layers, ArrowRight, Send, Zap, PenLine, CheckCircle2, Award, Search } from 'lucide-react';
import { usePerfil, useUpdatePerfil } from '@features/perfil/usePerfil';
import { CvUploader } from '@features/perfil/CvUploader';
import { useMisPostulaciones } from '@features/postulaciones-list/useMisPostulaciones';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
   CARGA DE GOOGLE MAPS API
═══════════════════════════════════════════════ */
let googleMapsPromise = null;
const loadGoogleMaps = () => {
  if (googleMapsPromise) return googleMapsPromise;
  if (window.google && window.google.maps) return Promise.resolve();
  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return googleMapsPromise;
};

/* ═══════════════════════════════════════════════
   MAPA INTERACTIVO CON SELECCIÓN DE UBICACIÓN
═══════════════════════════════════════════════ */
const InteractiveMap = ({ searchQuery, onLocationSelect, selectedCoords }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadGoogleMaps().then(() => setIsLoaded(true)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    if (mapInstanceRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 14,
      center: { lat: -7.1638, lng: -78.5001 }, // Cajamarca por defecto
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      ],
    });

    map.addListener('click', (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      placeMarkerAndCircle(map, { lat, lng });
      reverseGeocode(lat, lng);
    });

    mapInstanceRef.current = map;
  }, [isLoaded]);

  const placeMarkerAndCircle = useCallback((map, position) => {
    // Limpiar marcador y círculo anteriores
    if (markerRef.current) markerRef.current.setMap(null);
    if (circleRef.current) circleRef.current.setMap(null);

    // Marcador
    markerRef.current = new window.google.maps.Marker({
      position,
      map,
      animation: window.google.maps.Animation.DROP,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#FACC15',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 3,
      },
    });

    // Círculo amarillo
    circleRef.current = new window.google.maps.Circle({
      map,
      center: position,
      radius: 200,
      strokeColor: '#FACC15',
      strokeOpacity: 0.9,
      strokeWeight: 2.5,
      fillColor: '#FACC15',
      fillOpacity: 0.18,
    });

    map.panTo(position);
  }, []);

  const reverseGeocode = useCallback((lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const loc = extractLocationData(results[0]);
        onLocationSelect({ ...loc, lat, lng });
      }
    });
  }, [onLocationSelect]);

  // Cuando cambia searchQuery, centrar mapa y colocar marcador
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !searchQuery || searchQuery.length < 3) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: searchQuery }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const position = results[0].geometry.location;
        const loc = extractLocationData(results[0]);
        placeMarkerAndCircle(mapInstanceRef.current, position);
        mapInstanceRef.current.setZoom(15);
        onLocationSelect({ ...loc, lat: position.lat(), lng: position.lng() });
      }
    });
  }, [searchQuery, isLoaded]);

  // Restaurar marcador si hay coordenadas guardadas
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !selectedCoords) return;
    const position = { lat: selectedCoords.lat, lng: selectedCoords.lng };
    placeMarkerAndCircle(mapInstanceRef.current, position);
    mapInstanceRef.current.panTo(position);
    mapInstanceRef.current.setZoom(15);
  }, [selectedCoords, isLoaded]);

  return (
    <div ref={mapRef} style={{ width: '100%', height: 400, borderRadius: 14, overflow: 'hidden', border: '0.5px solid #e8e8e4', background: '#e2e8f0' }}>
      {!isLoaded && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
          <Loader2 size={22} className="animate-spin" style={{ marginRight: 8 }} />
          <span style={{ fontSize: 12, fontWeight: 500 }}>Cargando mapa...</span>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAPA ESTÁTICO CON CÍRCULO AMARILLO (VISTA PERFIL)
═══════════════════════════════════════════════ */
const StaticMapWithCircle = ({ lat, lng, height = 180 }) => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadGoogleMaps().then(() => setIsLoaded(true)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !lat || !lng) return;
    const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: position,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControl: false,
      draggable: false,
      scrollwheel: false,
      disableDoubleClickZoom: true,
      styles: [
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      ],
    });

    new window.google.maps.Marker({
      position,
      map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#FACC15',
        fillOpacity: 1,
        strokeColor: '#fff',
        strokeWeight: 2.5,
      },
    });

    new window.google.maps.Circle({
      map,
      center: position,
      radius: 150,
      strokeColor: '#FACC15',
      strokeOpacity: 0.85,
      strokeWeight: 2,
      fillColor: '#FACC15',
      fillOpacity: 0.15,
    });
  }, [isLoaded, lat, lng]);

  return (
    <div ref={mapRef} style={{ width: '100%', height, borderRadius: 14, overflow: 'hidden', border: '0.5px solid #e8e8e4', background: '#e2e8f0' }}>
      {!isLoaded && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8' }}>
          <Loader2 size={18} className="animate-spin" />
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════
   HELPER: Extraer datos de geocoding
═══════════════════════════════════════════════ */
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
  if (!foundBarrio) foundBarrio = '';
  return { pais: foundPais, departamento: foundDepartamento, sector: foundDistrito || foundDepartamento, barrio: foundBarrio };
};

/* ═══════════════════════════════════════════════
   MODAL DE EDICIÓN DE PERFIL
═══════════════════════════════════════════════ */
const EditProfileModal = ({ isOpen, onClose, formData, onChange, onSubmit, isUpdating }) => {
  if (!isOpen) return null;
  
  // Función helper para toggle de habilidades
  const handleToggleSkill = (skill) => {
    const currentSkills = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    
    const isSelected = currentSkills.includes(skill);
    let newSkills;
    
    if (isSelected) {
      newSkills = currentSkills.filter(s => s !== skill).join(', ');
    } else {
      newSkills = [...currentSkills, skill].join(', ');
    }
    
    onChange({ target: { name: 'skills', value: newSkills } });
  };

  const currentSkillsArray = formData.skills
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(13, 27, 53, 0.6)', backdropFilter: 'blur(4px)' }} />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ 
          position: 'relative', 
          background: '#fff', 
          borderRadius: 24, 
          padding: '32px 36px', 
          maxWidth: 900,  // ← MISMO ANCHO QUE UBICACIÓN
          width: '100%', 
          maxHeight: '90vh', 
          overflowY: 'auto', 
          boxShadow: '0 25px 60px rgba(13, 27, 53, 0.25)', 
          border: '0.5px solid #e8e8e4' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #1B6FE8, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Edit2 size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f1f3d', margin: 0 }}>Editar Perfil</h3>
              <p style={{ fontSize: 11, color: '#6b6b7a', margin: '2px 0 0', fontWeight: 500 }}>Completa tu información</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, background: '#f8fafc', border: '0.5px solid #e8e8e4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit' }}>
            <X size={16} color="#6b6b7a" />
          </button>
        </div>
        
        <form onSubmit={onSubmit}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {/* ─── COLUMNA IZQUIERDA: Campos básicos ─── */}
            <div style={{ flex: '1 1 55%', minWidth: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Biografía</label>
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={onChange} 
                  placeholder="Cuéntanos un poco sobre ti..." 
                  rows={4} 
                  style={inputStyle} 
                />
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

            {/* ─── COLUMNA DERECHA: Habilidades ─── */}
            <div style={{ flex: '1 1 35%', minWidth: 250 }}>
              <label style={labelStyle}>Habilidades</label>
              
              {/* Input editable */}
              <input 
                type="text" 
                name="skills" 
                value={formData.skills} 
                onChange={onChange} 
                placeholder="Tus habilidades..." 
                style={{ ...inputStyle, marginBottom: 12 }} 
              />

              {/* Píldoras de sugerencias */}
              <div style={{ 
                background: '#fafbfc', 
                borderRadius: 12, 
                padding: 14, 
                border: '0.5px solid #eef0f2',
                maxHeight: 280,
                overflowY: 'auto'
              }}>
                <p style={{ 
                  fontSize: 10, 
                  fontWeight: 600, 
                  color: '#8b8b9e', 
                  margin: '0 0 10px',
                  letterSpacing: '0.03em',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                  <Zap size={11} />
                  Sugerencias
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    'JavaScript', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Angular',
                    'HTML5', 'CSS3', 'Tailwind CSS', 'Node.js', 'Express.js', 'Python',
                    'Django', 'Flask', 'FastAPI', 'Java', 'Spring Boot', 'C#', '.NET',
                    'PHP', 'Laravel', 'Kotlin', 'Swift', 'Flutter', 'React Native',
                    'Docker', 'Kubernetes', 'AWS', 'Azure', 'PostgreSQL', 'MongoDB',
                    'MySQL', 'Redis', 'GraphQL', 'REST API', 'Git', 'Figma', 'Scrum',
                    'CI/CD', 'Linux', 'TensorFlow', 'PyTorch', 'Selenium', 'Jest',
                    'Cypress', 'Firebase', 'WordPress'
                  ].map((skill) => {
                    const isSelected = currentSkillsArray.includes(skill);
                    
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSkill(skill)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 9px',
                          borderRadius: 14,
                          fontSize: 9.5,
                          fontWeight: 600,
                          background: isSelected ? '#eff6ff' : '#fff',
                          color: isSelected ? '#1B6FE8' : '#64748b',
                          border: isSelected ? '1px solid #bfdbfe' : '1px solid #e8e8e4',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          transition: 'all 0.15s ease',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#bfdbfe';
                          e.currentTarget.style.background = isSelected ? '#eff6ff' : '#fafcff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = isSelected ? '#bfdbfe' : '#e8e8e4';
                          e.currentTarget.style.background = isSelected ? '#eff6ff' : '#fff';
                        }}
                      >
                        {isSelected && (
                          <span style={{ 
                            width: 3.5, 
                            height: 3.5, 
                            borderRadius: '50%', 
                            background: '#1B6FE8',
                            flexShrink: 0 
                          }} />
                        )}
                        {skill}
                        {isSelected && (
                          <X size={9} style={{ marginLeft: 1, opacity: 0.6 }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Botones al final */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20, paddingTop: 16, borderTop: '0.5px solid #f1f5f9' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: 12, background: '#f8fafc', border: '0.5px solid #e8e8e4', color: '#6b6b7a', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancelar
            </button>
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
   MODAL DE EDICIÓN DE UBICACIÓN
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
    if (d && p) setSearchQuery(`${d}, ${p}`);
    else setSearchQuery('');
    if (latActual && lngActual) setCoords({ lat: latActual, lng: lngActual });
    else setCoords(null);
  }, [ciudadActual, paisActual, sectorActual, barrioActual, latActual, lngActual, isOpen]);

  if (!isOpen) return null;

  const handleLocationSelect = (loc) => {
    setPais(loc.pais || '');
    setDepartamento(loc.departamento || '');
    setSector(loc.sector || '');
    setBarrio(loc.barrio || '');
    if (loc.lat && loc.lng) setCoords({ lat: loc.lat, lng: loc.lng });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length >= 3) {
      debounceRef.current = setTimeout(() => setGeocodeQuery(value), 600);
    } else if (!value) {
      setPais(''); setDepartamento(''); setSector(''); setBarrio(''); setCoords(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const ciudadFinal = [departamento, sector].filter(Boolean).join(', ');
    onSave({
      ciudad: ciudadFinal || searchQuery || '',
      pais: pais || '',
      sector: barrio || sector || '',
      barrio: barrio || '',
      lat: coords?.lat || null,
      lng: coords?.lng || null,
    });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(13, 27, 53, 0.6)', backdropFilter: 'blur(4px)' }} />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', background: '#fff', borderRadius: 24, padding: '32px 36px', maxWidth: 900, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(13, 27, 53, 0.25)', border: '0.5px solid #e8e8e4' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'linear-gradient(135deg, #1B6FE8, #06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin size={18} color="#fff" /></div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f1f3d', margin: 0 }}>Editar Ubicación</h3>
              <p style={{ fontSize: 11, color: '#6b6b7a', margin: '2px 0 0', fontWeight: 500 }}>Escribe o haz clic en el mapa para seleccionar</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 10, background: '#f8fafc', border: '0.5px solid #e8e8e4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit' }}><X size={16} color="#6b6b7a" /></button>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {/* Columna izquierda: Buscador + Mapa interactivo */}
          <div style={{ flex: '1 1 55%', minWidth: 300 }}>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Buscar o haz clic en el mapa</label>
              <div style={{ position: 'relative' }}>
                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Ej: Cajamarca, Perú..."
                  style={{ ...inputStyle, paddingLeft: 34 }}
                  autoComplete="off"
                />
              </div>
              <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, fontWeight: 500 }}>
                💡 También puedes hacer clic directamente en cualquier punto del mapa
              </p>
            </div>
            <InteractiveMap
              searchQuery={geocodeQuery}
              onLocationSelect={handleLocationSelect}
              selectedCoords={coords}
            />
          </div>

          {/* Columna derecha: Campos autocompletados */}
          <div style={{ flex: '1 1 35%', minWidth: 250, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={labelStyle}>País</label>
              <div style={readonlyFieldStyle}>{pais || <span style={{ color: '#94a3b8', fontWeight: 400 }}>Se autocompletará...</span>}</div>
            </div>
            <div>
              <label style={labelStyle}>Departamento</label>
              <div style={readonlyFieldStyle}>{departamento || <span style={{ color: '#94a3b8', fontWeight: 400 }}>Se autocompletará...</span>}</div>
            </div>
            <div>
              <label style={labelStyle}>Distrito / Sector</label>
              <div style={readonlyFieldStyle}>{sector || <span style={{ color: '#94a3b8', fontWeight: 400 }}>Se autocompletará...</span>}</div>
            </div>
            <div>
              <label style={labelStyle}>Barrio</label>
              <div style={{ ...readonlyFieldStyle, background: barrio ? '#ede9fe' : '#f1f5f9', border: barrio ? '0.5px solid #c4b5fd' : '0.5px solid #e2e8f0' }}>
                {barrio || <span style={{ color: '#94a3b8', fontWeight: 400 }}>Se autocompletará...</span>}
              </div>
            </div>

            {coords && (
              <div style={{ padding: '8px 12px', borderRadius: 10, background: '#fefce8', border: '0.5px solid #fde68a', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FACC15', flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: '#92400e' }}>Ubicación seleccionada en el mapa</span>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 'auto', paddingTop: 14 }}>
              <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: 12, background: '#f8fafc', border: '0.5px solid #e8e8e4', color: '#6b6b7a', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
              <button type="submit" disabled={isUpdating} onClick={handleSubmit} style={{ padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #1B6FE8, #06B6D4)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 700, cursor: isUpdating ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, opacity: isUpdating ? 0.7 : 1, boxShadow: '0 4px 16px rgba(27, 111, 232, 0.25)' }}>
                {isUpdating ? (<><Loader2 size={14} className="animate-spin" />Guardando...</>) : (<><Save size={14} />Guardar Ubicación</>)}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   HERO BANNER
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
    const drawConnections = () => { for (let i=0; i<particles.length; i++) { for (let j=i+1; j<particles.length; j++) { const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y, d=Math.sqrt(dx*dx+dy*dy); if (d<70) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(27,111,232,${0.05*(1-d/70)})`; ctx.lineWidth = 0.5; ctx.stroke(); } } } };
    const animate = () => { ctx.clearRect(0,0,W,H); drawConnections(); particles.forEach(p=>{p.update();p.draw();}); animId=requestAnimationFrame(animate); };
    animate();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);
  const nombreCompleto = user.nombre || 'Usuario';
  return (
    <motion.div ref={heroRef} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5, delay:0.08, ease:[0.22,1,0.36,1] }}
      style={{ position:'relative', overflow:'hidden', borderRadius:20, background:'linear-gradient(135deg,#0d1b35,#0f2a4a 60%,#0a2240)', padding:'40px 44px', color:'#fff', marginBottom:24, minHeight:250 }}>
      <style>{`@keyframes heroPulse{0%{box-shadow:0 0 0 0 rgba(74,222,128,0.45)}70%{box-shadow:0 0 0 9px rgba(74,222,128,0)}100%{box-shadow:0 0 0 0 rgba(74,222,128,0)}}@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}@keyframes orbF1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-18px,14px) scale(1.08)}66%{transform:translate(9px,-9px) scale(0.95)}}@keyframes orbF2{0%,100%{transform:translate(0,0)}40%{transform:translate(14px,-18px)}70%{transform:translate(-9px,11px)}}@keyframes orbF3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-13px,18px) scale(1.1)}}`}</style>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.6, pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(27,111,232,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(27,111,232,0.06) 1px,transparent 1px)', backgroundSize:'48px 48px', WebkitMaskImage:'radial-gradient(ellipse 80% 80% at 55% 50%,black,transparent)', maskImage:'radial-gradient(ellipse 80% 80% at 55% 50%,black,transparent)' }} />
      <div style={{ position:'absolute', top:-70, right:-40, width:250, height:250, borderRadius:'50%', background:'rgba(27,111,232,0.16)', filter:'blur(40px)', animation:'orbF1 8s ease-in-out infinite' }} />
      <div style={{ position:'absolute', bottom:-65, right:140, width:190, height:190, borderRadius:'50%', background:'rgba(212,88,10,0.09)', filter:'blur(40px)', animation:'orbF2 10s ease-in-out infinite' }} />
      <div style={{ position:'absolute', top:10, right:210, width:150, height:150, borderRadius:'50%', background:'rgba(6,182,212,0.07)', filter:'blur(40px)', animation:'orbF3 13s ease-in-out infinite' }} />
      <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1, duration:0.5 }} style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:20, padding:'5px 14px', fontSize:10, fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.55)', marginBottom:18 }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', display:'inline-block', animation:'heroPulse 2s ease-in-out infinite' }} />información Personal 
      </motion.div>
      <div style={{ position:'relative', zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ maxWidth:500 }}>
          <div style={{ fontSize:'clamp(23px,2.5vw,30px)', fontWeight:800, lineHeight:1.08, letterSpacing:'-0.035em', marginBottom:6 }}>
            <div style={{ overflow:'hidden' }}><motion.div initial={{ y:'110%', opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.15, duration:0.6, ease:[0.22,1,0.36,1] }} style={{ color:'#fff' }}>{nombreCompleto}</motion.div></div>
            <div style={{ overflow:'hidden' }}><motion.div initial={{ y:'110%', opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.27, duration:0.6, ease:[0.22,1,0.36,1] }} style={{ background:'linear-gradient(90deg,#67d4f8,#1B6FE8,#06B6D4)', backgroundSize:'200% 100%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'shimmer 4s ease-in-out infinite', fontSize:'clamp(15px,1.7vw,19px)' }}>tu perfil, tu huella profesional</motion.div></div>
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
            {user.fotoPerfil ? <img alt="Foto" style={{ width:'100%', height:'100%', objectFit:'cover' }} src={user.fotoPerfil} /> : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#1B6FE8,#06B6D4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:34, fontWeight:800, color:'#fff' }}>{user.nombre?.charAt(0)||'U'}</div>}
          </div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7, duration:0.5 }} style={{ position:'absolute', right:44, bottom:18, zIndex:10 }}>
        {isEstudiante && (
          <button onClick={onEdit} style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(27,111,232,0.15)', border:'1px solid rgba(27,111,232,0.3)', color:'#fff', padding:'8px 20px', borderRadius:50, fontSize:11, fontWeight:700, cursor:'pointer', transition:'all 0.25s', fontFamily:'inherit', whiteSpace:'nowrap', backdropFilter:'blur(8px)' }}
            onMouseEnter={e=>{e.currentTarget.style.background='#1B6FE8';e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 24px rgba(27,111,232,0.3)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(27,111,232,0.15)';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
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
const proyectosAceptados = postulaciones.filter(
  (p) =>
    (p.estado === 'CONFIRMADO' || p.estado === 'ACEPTADO' || p.estado === 'Aceptado') &&
    p.proyectoEstado !== 'COMPLETADO'   // ← oculta los ya completados
);
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
    updatePerfil({
      ciudad: locationData.ciudad,
      pais: locationData.pais,
      sector: locationData.barrio || locationData.sector || '',
      barrio: locationData.barrio || '',
      lat: locationData.lat || null,
      lng: locationData.lng || null,
    }, { onSuccess: () => setIsEditingLocation(false) });
  };

  if (isLoading) return (
    <div style={{ fontFamily:"Inter, Arial, 'Helvetica Neue', sans-serif", background:'#f5f4f0', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, color:'#6b6b7a' }}><Loader2 className="animate-spin" size={22} /><span style={{ fontWeight:600, fontSize:13 }}>Cargando perfil...</span></div>
    </div>
  );
  if (isError) return (
    <div style={{ fontFamily:"Inter, Arial, 'Helvetica Neue', sans-serif", background:'#f5f4f0', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:16, padding:24, maxWidth:400, textAlign:'center' }}><p style={{ fontWeight:700, color:'#dc2626', marginBottom:4 }}>Error</p><p style={{ fontSize:12, color:'#ef4444' }}>{error?.response?.data?.message || error?.message || 'Error desconocido'}</p></div>
    </div>
  );

  const user = userProfile || {};
  const displayRol = user.rol || storeRol || 'Estudiante';
  const academicInfo = { universidad: user.universidad || 'No especificada', carrera: user.carrera || 'No especificada', codigo: user.codigoEstudiante  || 'No especificado', ciclo: user.ciclo || 'No especificado' };
  const locationInfo = {
    ciudad: user.ciudad || '',
    pais: user.pais || '',
    sector: user.sector || '',
    barrio: user.barrio || '',
    lat: user.lat || null,
    lng: user.lng || null,
  };

  // Cadena de ubicación única
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
    sectionTitle: { fontSize:15, fontWeight:700, letterSpacing:'-0.02em', color:'#0f1f3d', display:'flex', alignItems:'center', gap:8, marginBottom:14 },
    sectionBar: { display:'block', width:3, height:16, background:'#1B6FE8', borderRadius:2, flexShrink:0 },
    card: { background:'#fff', border:'0.5px solid #e8e8e4', borderRadius:16, padding:24 },
  };

  return (
    <div style={{ fontFamily:"Inter, Arial, 'Helvetica Neue', sans-serif", background:'#f8fafc', minHeight:'100vh', padding:'32px 36px', maxWidth:1440, margin:'0 auto' }}>
      <EditProfileModal isOpen={isEditing} onClose={handleCancelEdit} formData={formData} onChange={handleInputChange} onSubmit={handleSubmit} isUpdating={isUpdating} />
      <EditLocationModal
        isOpen={isEditingLocation}
        onClose={() => setIsEditingLocation(false)}
        ciudadActual={locationInfo.ciudad}
        paisActual={locationInfo.pais}
        sectorActual={locationInfo.sector}
        barrioActual={locationInfo.barrio}
        latActual={locationInfo.lat}
        lngActual={locationInfo.lng}
        onSave={handleLocationSave}
        isUpdating={isUpdating}
      />
      <ProfileHeroBanner user={user} completitud={completitud} displayRol={displayRol} academicInfo={academicInfo} isEstudiante={isEstudiante} onEdit={handleStartEdit} />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {/* ── TRAYECTORIA ACADÉMICA (MODIFICADO) ── */}
{isEstudiante && (
  <motion.section {...fadeUp(0.10)} style={S.card}>
    <div style={S.sectionTitle}><span style={S.sectionBar} />Trayectoria Académica</div>
    <div style={{ position:'relative', paddingLeft:24, borderLeft:'2px solid #f1f5f9' }}>
      <div style={{ position:'absolute', left:-5, top:4, width:8, height:8, borderRadius:'50%', background:'#1B6FE8', border:'2px solid #fff', boxShadow:'0 0 0 3px rgba(27,111,232,0.12)' }} />
      <div style={{ padding:16, background:'#f8fafc', borderRadius:14, border:'0.5px solid #e8e8e4' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
          <h4 style={{ fontSize:13, fontWeight:700, color:'#1B6FE8', margin:0 }}>{academicInfo.carrera}</h4>
          <span style={{ fontSize:8, fontWeight:700, color:'#059669', background:'#ecfdf5', border:'0.5px solid #a7f3d0', padding:'3px 8px', borderRadius:20, display:'inline-flex', alignItems:'center', gap:3 }}>
            <CheckCircle2 size={9} />Presente
          </span>
        </div>
        <p style={{ fontSize:12, fontWeight:600, color:'#0f1f3d', margin:'4px 0 0' }}>{academicInfo.universidad}</p>
        {/* SOLO CÓDIGO - ELIMINÉ EL CICLO */}
        <p style={{ fontSize:10, color:'#6b6b7a', fontWeight:500, margin:0, marginTop:4 }}>
          Código: {academicInfo.codigo}
        </p>
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
                <div style={S.sectionTitle}><span style={S.sectionBar} />Proyectos</div>
                <Link to="/mis-postulaciones" style={{ fontSize:11, fontWeight:600, color:'#1B6FE8', textDecoration:'none', display:'flex', alignItems:'center', gap:4 }}>Ver todos <ArrowRight size={11} /></Link>
              </div>
              {proyectosAceptados.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {proyectosAceptados.slice(0, 4).map((proyecto, idx) => {
                  const titulo = proyecto.proyectoTitulo || 'Proyecto';
                  const iniciales = titulo.slice(0, 2).toUpperCase();
                  const colores = ['#1B6FE8', '#06B6D4', '#8B5CF6', '#10B981'];
                  const colorFondo = colores[idx % colores.length];

                  return (
                    <Link
                      key={proyecto.id || idx}
                      to={`/workspace/${proyecto.proyectoId}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -2, scale: 1.01 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          padding: '12px 16px',
                          background: '#fff',
                          borderRadius: 14,
                          border: '0.5px solid #e8e8e4',
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                        }}
                      >
                        {/* Cuadrado con iniciales */}
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 12,
                            background: colorFondo,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            fontSize: 18,
                            fontWeight: 700,
                            color: '#fff',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                          }}
                        >
                          {iniciales}
                        </div>

                        {/* Información del proyecto */}
                        <div style={{ flex: 1 }}>
                          <h5 style={{ fontSize: 13, fontWeight: 700, color: '#0f1f3d', margin: 0 }}>
                            {titulo}
                          </h5>
                          {/* Badge "Aceptado" debajo del título, donde antes estaba "Workspace activo" */}
                          <div style={{ margin: '4px 0 0' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                padding: '2px 8px',
                                borderRadius: 20,
                                fontSize: 9,
                                fontWeight: 600,
                                background: '#ecfdf5',
                                color: '#05962e',
                                border: '0.5px solid #a7f3d0',
                              }}
                            >
                              <CheckCircle2 size={9} /> Aceptado
                            </span>
                          </div>
                        </div>

                        {/* Flecha indicadora */}
                        <ArrowRight size={14} color="#cbd5e1" />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: 24, textAlign: 'center', background: '#f8fafc', borderRadius: 12, border: '0.5px dashed #e8e8e4' }}>
                <p style={{ fontSize: 12, color: '#6b6b7a', marginBottom: 12, fontWeight: 500 }}>
                  Aún no tienes proyectos.
                </p>
                <Link to="/proyectos" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#1B6FE8', color: '#fff', padding: '8px 16px', borderRadius: 8, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
                  Explorar Proyectos <ArrowRight size={12} />
                </Link>
              </div>
            )}
            </motion.section>
          )}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          {isEstudiante && (
            <motion.section {...fadeUp(0.12)} style={{ ...S.card }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:14, fontWeight:700, color:'#0f1f3d' }}>Completitud del Perfil</span>
                <span style={{ fontSize:18, fontWeight:800, color: completitud >= 80 ? '#059669' : completitud >= 50 ? '#1B6FE8' : '#e04a3b' }}>{completitud}%</span>
              </div>
              <div style={{ width:'100%', height:8, background:'#f1f5f9', borderRadius:4, overflow:'hidden', border:'0.5px solid #e8e8e4' }}>
                <motion.div initial={{ width:0 }} animate={{ width:`${completitud}%` }} transition={{ duration:1.2, ease:'easeOut', delay:0.2 }} style={{ height:'100%', borderRadius:4, background: completitud >= 80 ? 'linear-gradient(90deg,#059669,#10b981,#34d399)' : completitud >= 50 ? 'linear-gradient(90deg,#1B6FE8,#3b82f6,#06B6D4)' : 'linear-gradient(90deg,#e04a3b,#f97316,#fb923c)', boxShadow: completitud >= 80 ? '0 0 12px rgba(16,185,129,0.4)' : completitud >= 50 ? '0 0 12px rgba(27,111,232,0.4)' : '0 0 12px rgba(224,74,59,0.4)' }} />
              </div>
              <p style={{ fontSize:11, color:'#6b6b7a', fontWeight:500, marginTop:8, marginBottom:0 }}>{completitud < 50 ? 'Completa tu perfil' : completitud < 80 ? '¡Vas por buen camino!' : completitud < 100 ? '¡Casi completo!' : '¡Perfil completo!'}</p>
            </motion.section>
          )}

          {/* ── SECCIÓN UBICACIÓN ── */}
          <motion.section {...fadeUp(0.16)} style={S.card}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ ...S.sectionTitle, marginBottom:0 }}><span style={S.sectionBar} />Ubicación</div>
              {isEstudiante && (
                <button onClick={() => setIsEditingLocation(true)} style={{ fontSize:10, fontWeight:600, color:'#1B6FE8', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:3, fontFamily:'inherit' }}>
                  <Edit2 size={10} />{locationString ? 'Editar ubicación' : 'Agregar ubicación'}
                </button>
              )}
            </div>

            {locationString ? (
              <>
                {/* Datos en una sola cadena */}
                <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'#f8fafc', borderRadius:12, border:'0.5px solid #e8e8e4', marginBottom:12 }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg, #1B6FE8, #06B6D4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <MapPin size={15} color="#fff" />
                  </div>
                  <p style={{ fontSize:12, fontWeight:600, color:'#0f1f3d', margin:0, lineHeight:1.4 }}>{locationString}</p>
                </div>
                {/* Mapa con círculo amarillo (reducido) */}
                {locationInfo.lat && locationInfo.lng ? (
                  <StaticMapWithCircle lat={locationInfo.lat} lng={locationInfo.lng} height={180} />
                ) : (
                  <div style={{ borderRadius:14, overflow:'hidden', border:'0.5px solid #e8e8e4', height:180, background:'#e8e8e4' }}>
                    <iframe
                      title="Ubicación"
                      width="100%"
                      height="180"
                      style={{ border:0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(locationString)}&zoom=15`}
                    />
                  </div>
                )}
              </>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:140, background:'#f8fafc', borderRadius:14, border:'0.5px dashed #e2e8f0', color:'#94a3b8' }}>
                <MapPin size={28} strokeWidth={1.5} />
                <p style={{ fontSize:11, fontWeight:500, marginTop:8, marginBottom:0 }}>Sin ubicación</p>
              </div>
            )}
          </motion.section>

         {/* ── CONECTIVIDAD ── */}
          <motion.section {...fadeUp(0.20)} style={S.card}>
            <div style={S.sectionTitle}><span style={S.sectionBar} />Conectividad</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>

              {/* LinkedIn */}
              {user.linkedinUrl ? (
                <a 
                  href={user.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={linkItemStyle('#f8fafc', '#e8e8e4')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#eff6ff';
                    e.currentTarget.style.borderColor = '#bfdbfe';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e8e8e4';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:'#0077B5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Globe size={13} color="#fff" />
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color:'#0f1f3d' }}>LinkedIn</span>
                  </div>
                  <ExternalLink size={12} color="#6b6b7a" />
                </a>
              ) : isEstudiante && (
                <button 
                  onClick={handleStartEdit} 
                  style={emptyLinkStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#eff6ff';
                    e.currentTarget.style.borderColor = '#bfdbfe';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e8e8e4';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Globe size={13} color="#94a3b8" />
                    </div>
                    <span style={{ fontSize:11, fontWeight:500, color:'#94a3b8', fontStyle:'italic' }}>Vincular LinkedIn</span>
                  </div>
                  <Edit2 size={12} color="#cbd5e1" />
                </button>
              )}

              {/* Portafolio */}
              {user.portafolioUrl ? (
                <a 
                  href={user.portafolioUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={linkItemStyle('#f8fafc', '#e8e8e4')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#eff6ff';
                    e.currentTarget.style.borderColor = '#bfdbfe';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e8e8e4';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:'#0d1b35', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Briefcase size={13} color="#fff" />
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color:'#0f1f3d' }}>Portafolio</span>
                  </div>
                  <ExternalLink size={12} color="#6b6b7a" />
                </a>
              ) : isEstudiante && (
                <button 
                  onClick={handleStartEdit} 
                  style={emptyLinkStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#eff6ff';
                    e.currentTarget.style.borderColor = '#bfdbfe';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e8e8e4';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Briefcase size={13} color="#94a3b8" />
                    </div>
                    <span style={{ fontSize:11, fontWeight:500, color:'#94a3b8', fontStyle:'italic' }}>Vincular Portafolio</span>
                  </div>
                  <Edit2 size={12} color="#cbd5e1" />
                </button>
              )}

              {/* Email - NO CLICKEABLE */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, padding:10, borderRadius:10, background:'#f8fafc', border:'0.5px solid #e8e8e4' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:'#1B6FE8', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Mail size={13} color="#fff" />
                  </div>
                  <span style={{ fontSize:11, fontWeight:600, color:'#0f1f3d', maxWidth:140, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email || 'No disponible'}</span>
                </div>
              </div>

              {/* Teléfono - SIN HOVER */}
              {user.telefono ? (
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, padding:10, borderRadius:10, background:'#f8fafc', border:'0.5px solid #e8e8e4' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:'#10b981', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Phone size={13} color="#fff" />
                    </div>
                    <span style={{ fontSize:11, fontWeight:600, color:'#0f1f3d' }}>{user.telefono}</span>
                  </div>
                </div>
              ) : isEstudiante && (
                <button 
                  onClick={handleStartEdit} 
                  style={emptyLinkStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#eff6ff';
                    e.currentTarget.style.borderColor = '#bfdbfe';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e8e8e4';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Phone size={13} color="#94a3b8" />
                    </div>
                    <span style={{ fontSize:11, fontWeight:500, color:'#94a3b8', fontStyle:'italic' }}>Agregar Teléfono</span>
                  </div>
                  <Edit2 size={12} color="#cbd5e1" />
                </button>
              )}
            </div>
          </motion.section>

          {isEstudiante && (
            <motion.section {...fadeUp(0.24)} style={S.card}>
              <div style={{ marginBottom:20, paddingBottom:16, borderBottom:'1px solid #f1f5f9' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:'linear-gradient(135deg, #1B6FE8, #06B6D4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Award size={16} color="#fff" />
                  </div>
                  <div>
                    <span style={{ fontSize:13, fontWeight:700, color:'#0f1f3d' }}>Currículum Vitae</span>
                    <p style={{ fontSize:10, color:'#6b6b7a', margin:'1px 0 0', fontWeight:500 }}>Sube tu CV en PDF</p>
                  </div>
                </div>
                <CvUploader cvUrl={user.cvUrl} />
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ ...S.sectionTitle, marginBottom:0 }}><span style={S.sectionBar} />Habilidades</div>
                <button onClick={handleStartEdit} style={{ fontSize:10, fontWeight:600, color:'#1B6FE8', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:3, fontFamily:'inherit' }}><Edit2 size={10} />Editar</button>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {user.skills
                  ? user.skills.split(',').map((skill, idx) => { const { bg, color, border } = getSkillColor(skill.trim()); return <span key={idx} style={{ padding:'4px 10px', borderRadius:20, fontSize:10, fontWeight:700, background:bg, color:color, border:`0.5px solid ${border}` }}>{skill.trim()}</span>; })
                  : <button onClick={handleStartEdit} style={{ fontSize:11, color:'#94a3b8', fontStyle:'italic', background:'none', border:'none', cursor:'pointer', fontWeight:500, fontFamily:'inherit' }}>+ Agregar habilidades...</button>
                }
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilPage;