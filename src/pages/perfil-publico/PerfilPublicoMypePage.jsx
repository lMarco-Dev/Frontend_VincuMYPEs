import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import { motion } from "framer-motion";
import { useRating } from "@/features/calificaciones/useRating";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  AlertCircle,
  Loader2,
  Car,
  Footprints,
  Bike,
  Route,
  Star,
} from "lucide-react";
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp, FaGlobe } from "react-icons/fa";

const FONT = "'Inter', 'Outfit', sans-serif";
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// ─── Helper: cargar Google Maps ─────────────────────────────────
let googleMapsPromise = null;
const loadGoogleMaps = () => {
  if (googleMapsPromise) return googleMapsPromise;
  if (window.google?.maps) return Promise.resolve();
  
  googleMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return googleMapsPromise;
};

// ─── Función para generar ruta simulada tipo "calles" ───────────
function generateRealisticRoute(startX, startY, endX, endY, mapWidth, mapHeight) {
  const points = [];
  
  // Crear obstáculos simulados (edificios/manzanas)
  const obstacles = [
    { x: 120, y: 100, w: 60, h: 50 },
    { x: 250, y: 70, w: 50, h: 70 },
    { x: 400, y: 130, w: 55, h: 45 },
    { x: 180, y: 200, w: 70, h: 40 },
    { x: 320, y: 190, w: 45, h: 55 },
    { x: 450, y: 210, w: 50, h: 60 },
    { x: 100, y: 150, w: 40, h: 60 },
    { x: 350, y: 100, w: 40, h: 50 },
  ];

  // Generar "calles" evitando obstáculos
  let currentX = startX;
  let currentY = startY;
  
  points.push({ x: currentX, y: currentY });
  
  // Crear waypoints intermedios
  const midX1 = startX + (endX - startX) * 0.3 + (Math.random() - 0.5) * 80;
  const midY1 = startY + (endY - startY) * 0.25 + (Math.random() - 0.5) * 60;
  const midX2 = startX + (endX - startX) * 0.6 + (Math.random() - 0.5) * 100;
  const midY2 = startY + (endY - startY) * 0.55 + (Math.random() - 0.5) * 70;
  const midX3 = startX + (endX - startX) * 0.85 + (Math.random() - 0.5) * 50;
  const midY3 = startY + (endY - startY) * 0.8 + (Math.random() - 0.5) * 40;
  
  const waypoints = [
    { x: midX1, y: midY1 },
    { x: midX2, y: midY2 },
    { x: midX3, y: midY3 },
    { x: endX, y: endY },
  ];

  // Ajustar waypoints para evitar obstáculos
  const adjustedWaypoints = waypoints.map(wp => {
    let adjusted = { ...wp };
    let blocked = true;
    let attempts = 0;
    
    while (blocked && attempts < 50) {
      blocked = false;
      for (const obs of obstacles) {
        if (
          adjusted.x > obs.x - 15 &&
          adjusted.x < obs.x + obs.w + 15 &&
          adjusted.y > obs.y - 15 &&
          adjusted.y < obs.y + obs.h + 15
        ) {
          blocked = true;
          // Mover el waypoint
          const pushX = adjusted.x < obs.x + obs.w / 2 ? -15 : 15;
          const pushY = adjusted.y < obs.y + obs.h / 2 ? -15 : 15;
          adjusted.x += pushX;
          adjusted.y += pushY;
          break;
        }
      }
      attempts++;
    }
    return adjusted;
  });

  // Generar curvas suaves entre waypoints
  for (let w = 0; w < adjustedWaypoints.length; w++) {
    const target = adjustedWaypoints[w];
    const segments = 12;
    const prevX = w === 0 ? startX : adjustedWaypoints[w - 1].x;
    const prevY = w === 0 ? startY : adjustedWaypoints[w - 1].y;
    
    // Punto de control para curva
    const cpX = prevX + (target.x - prevX) * 0.4 + (Math.random() - 0.5) * 40;
    const cpY = prevY + (target.y - prevY) * 0.3 + (Math.random() - 0.5) * 30;
    const cp2X = prevX + (target.x - prevX) * 0.7 + (Math.random() - 0.5) * 40;
    const cp2Y = prevY + (target.y - prevY) * 0.6 + (Math.random() - 0.5) * 30;
    
    for (let i = 1; i <= segments; i++) {
      const t = i / segments;
      // Curva de Bézier cúbica
      const x = Math.pow(1 - t, 3) * prevX + 
                3 * Math.pow(1 - t, 2) * t * cpX + 
                3 * (1 - t) * Math.pow(t, 2) * cp2X + 
                Math.pow(t, 3) * target.x;
      const y = Math.pow(1 - t, 3) * prevY + 
                3 * Math.pow(1 - t, 2) * t * cpY + 
                3 * (1 - t) * Math.pow(t, 2) * cp2Y + 
                Math.pow(t, 3) * target.y;
      
      points.push({ x: Math.max(20, Math.min(mapWidth - 20, x)), y: Math.max(20, Math.min(mapHeight - 20, y)) });
    }
  }

  return points;
}

// ─── MapaRutaCard con Canvas de ruta simulada REALISTA ──────────
// ─── REEMPLAZA TODO el componente MapaRutaCard con ESTO ──────────
function MapaRutaCard({ direccion, ciudad, latitud, longitud }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const progressRef = useRef(0);
  const routePointsRef = useRef([]);
  
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [selectedMode, setSelectedMode] = useState("driving");
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [destCoords, setDestCoords] = useState(null);
  const [routeCalculated, setRouteCalculated] = useState(false);

  const mapWidth = 580;
  const mapHeight = 340;

  // Solo Auto y A pie
  const travelModes = [
    { key: "driving", icon: Car, label: "Auto", color: "#3B82F6", googleMode: "DRIVING" },
    { key: "walking", icon: Footprints, label: "A pie", color: "#22C55E", googleMode: "WALKING" },
  ];

  const currentMode = travelModes.find((m) => m.key === selectedMode) || travelModes[0];

  // ── Cargar Google Maps ─────────────────────────────────────
  useEffect(() => {
    loadGoogleMaps().then(() => setGoogleLoaded(true)).catch(console.error);
  }, []);

  // ── Obtener ubicación del estudiante ────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setUserCoords({ lat: -7.1617, lng: -78.5127 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => setUserCoords({ lat: -7.1617, lng: -78.5127 }),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // ── Obtener coordenadas del destino ─────────────────────────
  useEffect(() => {
    if (!googleLoaded) return;

    // Si hay coordenadas en la BD, usarlas
    if (latitud && longitud) {
      const coords = { 
        lat: parseFloat(latitud), 
        lng: parseFloat(longitud) 
      };
      setDestCoords(coords);
      return;
    }

    // Si no, geocodificar la dirección
    const addressToGeocode = direccion 
      ? `${direccion}, ${ciudad || 'Cajamarca'}, Perú`
      : `${ciudad || 'Cajamarca'}, Perú`;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: addressToGeocode }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        setDestCoords({ lat: location.lat(), lng: location.lng() });
      } else {
        setDestCoords({ lat: -7.1638, lng: -78.5001 });
      }
    });
  }, [googleLoaded, latitud, longitud, direccion, ciudad]);

  // ── Calcular ruta REAL con Google Directions API ────────────
  useEffect(() => {
    if (!googleLoaded || !userCoords || !destCoords) return;

    const directionsService = new window.google.maps.DirectionsService();
    setIsCalculating(true);
    setRouteCalculated(false);
    
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(userCoords.lat, userCoords.lng),
        destination: new window.google.maps.LatLng(destCoords.lat, destCoords.lng),
        travelMode: currentMode.googleMode,
      },
      (result, status) => {
        setIsCalculating(false);
        
        if (status === "OK" && result?.routes[0]) {
          const route = result.routes[0];
          
          // Guardar distancia y duración REALES
          if (route.legs[0]) {
            setDistance((route.legs[0].distance.value / 1000).toFixed(1));
            setDuration(Math.round(route.legs[0].duration.value / 60));
          }

          // Convertir la ruta REAL de Google a puntos del canvas
          const overviewPath = route.overview_path;
          if (overviewPath?.length > 0) {
            routePointsRef.current = convertGooglePathToCanvasPoints(overviewPath);
            setRouteCalculated(true);
          }
        } else {
          console.warn("Directions API falló:", status);
          // Fallback con Haversine
          if (userCoords && destCoords) {
            const dist = calcularHaversine(userCoords.lat, userCoords.lng, destCoords.lat, destCoords.lng);
            setDistance(dist.toFixed(1));
            const speeds = { walking: 5, driving: 40 };
            setDuration(Math.round((dist / (speeds[selectedMode] || 40)) * 60));
            routePointsRef.current = generateSimpleRoute();
            setRouteCalculated(true);
          }
        }
      }
    );
  }, [googleLoaded, userCoords, destCoords, selectedMode]);

  // ── Convertir ruta de Google a coordenadas del canvas ───────
  const convertGooglePathToCanvasPoints = (googlePath) => {
    if (!googlePath || googlePath.length === 0) return [];
    
    // Encontrar los límites de la ruta
    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;
    
    googlePath.forEach(point => {
      const lat = point.lat();
      const lng = point.lng();
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
    });

    // Añadir padding
    const latPadding = (maxLat - minLat) * 0.2 || 0.001;
    const lngPadding = (maxLng - minLng) * 0.2 || 0.001;
    minLat -= latPadding;
    maxLat += latPadding;
    minLng -= lngPadding;
    maxLng += lngPadding;

    const margin = 50;
    const availableWidth = mapWidth - margin * 2;
    const availableHeight = mapHeight - margin * 2;

    // Convertir cada punto
    return googlePath.map(point => {
      const lat = point.lat();
      const lng = point.lng();
      
      // Normalizar coordenadas (0 a 1)
      const normalizedX = (lng - minLng) / (maxLng - minLng || 1);
      const normalizedY = (lat - minLat) / (maxLat - minLat || 1);
      
      // Convertir a coordenadas del canvas (Y invertido)
      return {
        x: margin + normalizedX * availableWidth,
        y: margin + (1 - normalizedY) * availableHeight,
      };
    });
  };

  // ── Ruta simple de fallback ─────────────────────────────────
  const generateSimpleRoute = () => {
    const points = [];
    const startX = 80;
    const startY = mapHeight - 80;
    const endX = mapWidth - 80;
    const endY = 50;
    
    // Curva de Bézier simple
    const cp1x = startX + 100;
    const cp1y = startY - 100;
    const cp2x = endX - 100;
    const cp2y = endY + 100;
    
    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const x = Math.pow(1-t, 3)*startX + 3*Math.pow(1-t, 2)*t*cp1x + 3*(1-t)*t*t*cp2x + Math.pow(t, 3)*endX;
      const y = Math.pow(1-t, 3)*startY + 3*Math.pow(1-t, 2)*t*cp1y + 3*(1-t)*t*t*cp2y + Math.pow(t, 3)*endY;
      points.push({ x, y });
    }
    
    return points;
  };

  // ── Haversine ───────────────────────────────────────────────
  const calcularHaversine = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  // ── Animación del canvas ────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !routeCalculated) return;
    const ctx = canvas.getContext("2d");

    let routeAnimationDone = false;
    const routeAnimDuration = 2000;
    const routeStartTime = Date.now();

    const draw = () => {
      ctx.clearRect(0, 0, mapWidth, mapHeight);
      
      // Fondo limpio
      ctx.fillStyle = "#FAFBFC";
      ctx.fillRect(0, 0, mapWidth, mapHeight);

      // Ruta
      const points = routePointsRef.current;
      
      const elapsed = Date.now() - routeStartTime;
      const routeProgress = Math.min(elapsed / routeAnimDuration, 1);
      
      if (routeProgress >= 1 && !routeAnimationDone) {
        routeAnimationDone = true;
      }
      
      const visibleCount = routeAnimationDone 
        ? points.length 
        : Math.floor(routeProgress * points.length);

      if (points.length > 1) {
        // Sombra suave
        ctx.strokeStyle = currentMode.color + "10";
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < visibleCount && i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        // Ruta principal
        ctx.strokeStyle = currentMode.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < visibleCount && i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      }

      // Origen
      const ox = points[0]?.x || 80;
      const oy = points[0]?.y || mapHeight - 80;
      
      // Pulso azul
      const pulse = Math.sin(Date.now() / 600) * 0.3 + 0.7;
      ctx.fillStyle = `rgba(59, 130, 246, ${0.12 * pulse})`;
      ctx.beginPath(); ctx.arc(ox, oy, 16, 0, Math.PI*2); ctx.fill();
      
      // Punto azul
      ctx.fillStyle = "#3B82F6";
      ctx.beginPath(); ctx.arc(ox, oy, 8, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(ox, oy, 8, 0, Math.PI*2); ctx.stroke();

      // Destino
      const dx = points[points.length-1]?.x || mapWidth - 80;
      const dy = points[points.length-1]?.y || 50;
      
      // Pin rojo
      ctx.fillStyle = "#EA4335";
      ctx.beginPath();
      ctx.arc(dx, dy - 3, 7, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(dx - 5, dy);
      ctx.lineTo(dx + 5, dy);
      ctx.lineTo(dx, dy + 16);
      ctx.closePath();
      ctx.fill();
      
      // Centro blanco
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath(); ctx.arc(dx, dy - 3, 3, 0, Math.PI*2); ctx.fill();

      // Vehículo animado
      if (points.length > 1) {
        const idx = Math.floor(progressRef.current * (points.length-1));
        const nextIdx = Math.min(idx+1, points.length-1);
        const t = progressRef.current * (points.length-1) - idx;
        const cx = points[idx].x + (points[nextIdx].x - points[idx].x) * t;
        const cy = points[idx].y + (points[nextIdx].y - points[idx].y) * t;
        
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = currentMode.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI*2); ctx.stroke();
        
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(selectedMode === "walking" ? "🚶" : "🚗", cx, cy + 0.5);
      }

      // Etiquetas
      ctx.fillStyle = "#5F6368";
      ctx.font = `500 10px "${FONT}"`;
      ctx.textAlign = "center";
      ctx.fillText("Tu ubicación", ox, oy + 26);
      ctx.fillText((direccion || "Destino").slice(0, 25), dx, dy + 34);

      if (routeAnimationDone) {
        progressRef.current += 0.0008;
        if (progressRef.current > 1) progressRef.current = 0;
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [selectedMode, direccion, routeCalculated, distance]);
  // ── URL para abrir Google Maps ──────────────────────────────
  const googleMapsUrl = userCoords && destCoords
    ? `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${destCoords.lat},${destCoords.lng}&travelmode=${selectedMode}`
    : direccion 
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion + ', ' + (ciudad || 'Cajamarca') + ', Perú')}`
      : "#";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "#FFFFFF",
        border: "1px solid #F1F5F9",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "14px 18px",
        borderBottom: "1px solid #F8FAFC",
        background: "#FAFBFC",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "#F1F5F9",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <MapPin size={15} color="#64748B" />
        </div>
        <div>
          <p style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#0F172A", margin: 0 }}>
            Ruta hasta la empresa
          </p>
          <p style={{ fontFamily: FONT, fontSize: 10, color: "#94A3B8", margin: "1px 0 0" }}>
            {ciudad || "Cajamarca"}, Perú
          </p>
        </div>
        {isCalculating && (
          <Loader2 size={14} color={currentMode.color} className="animate-spin" style={{ marginLeft: 'auto' }} />
        )}
      </div>

      {/* Dirección de destino */}
      <div style={{
        padding: "10px 18px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        borderBottom: "1px solid #F8FAFC",
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: "#EF4444", flexShrink: 0,
        }} />
        <Navigation size={13} color="#64748B" style={{ flexShrink: 0 }} />
        <span style={{
          fontFamily: FONT, fontSize: 12, color: "#475569", fontWeight: 500,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1,
        }}>
          {direccion || "Sin dirección especificada"}
        </span>
      </div>

      {/* Selector de modo (SOLO AUTO y A PIE) */}
      <div style={{
        padding: "10px 18px",
        display: "flex",
        gap: 6,
        borderBottom: "1px solid #F8FAFC",
        background: "#FAFBFC",
      }}>
        {travelModes.map((m) => (
          <button
            key={m.key}
            onClick={() => setSelectedMode(m.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "8px 16px",
              borderRadius: 8,
              border: selectedMode === m.key ? `1.5px solid ${m.color}` : "1px solid #E2E8F0",
              background: selectedMode === m.key ? m.color + "10" : "#FFFFFF",
              color: selectedMode === m.key ? m.color : "#64748B",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: FONT,
              cursor: "pointer",
              transition: "all 0.15s",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <m.icon size={13} /> {m.label}
          </button>
        ))}
      </div>

      {/* Canvas con la ruta REAL de Google Maps */}
      <div style={{ position: "relative", background: "#F8FAFC" }}>
        {isCalculating && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            background: "rgba(255,255,255,0.95)",
            borderRadius: 20,
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}>
            <Loader2 size={16} color={currentMode.color} className="animate-spin" />
            <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500, color: "#475569" }}>
              Calculando ruta...
            </span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width={mapWidth}
          height={mapHeight}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            maxWidth: "100%",
          }}
        />
      </div>

      {/* Distancia y tiempo REALES */}
      {distance && duration && (
        <div style={{
          padding: "12px 18px",
          display: "flex",
          gap: 10,
          borderTop: "1px solid #F8FAFC",
        }}>
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#F8FAFC",
            borderRadius: 10,
            padding: "10px 12px",
            border: "1px solid #F1F5F9",
          }}>
            <Route size={14} color={currentMode.color} />
            <div>
              <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#0F172A", margin: 0 }}>
                {distance} km
              </p>
              <p style={{ fontFamily: FONT, fontSize: 10, color: "#94A3B8", margin: 0 }}>
                Distancia
              </p>
            </div>
          </div>
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "#F8FAFC",
            borderRadius: 10,
            padding: "10px 12px",
            border: "1px solid #F1F5F9",
          }}>
            <Navigation size={14} color={currentMode.color} />
            <div>
              <p style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, color: "#0F172A", margin: 0 }}>
                {duration >= 60 
                  ? `${Math.floor(duration / 60)}h ${duration % 60}min` 
                  : `${duration} min`}
              </p>
              <p style={{ fontFamily: FONT, fontSize: 10, color: "#94A3B8", margin: 0 }}>
                {currentMode.label}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Botón para abrir Google Maps */}
      <div style={{
        padding: "10px 18px",
        borderTop: "1px solid #F8FAFC",
        display: "flex",
        justifyContent: "center",
      }}>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "10px 24px",
            borderRadius: 10,
            background: currentMode.color,
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: FONT,
            textDecoration: "none",
            transition: "all 0.15s",
            boxShadow: `0 4px 12px ${currentMode.color}40`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = `0 6px 16px ${currentMode.color}60`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = `0 4px 12px ${currentMode.color}40`;
          }}
        >
          <Navigation size={14} />
          Abrir en Google Maps
        </a>
      </div>
    </motion.div>
  );
}

// ─── Sección de calificaciones ──────────────────────────────────
function SeccionCalificaciones({ usuarioId }) {
  const { rating: ratingData, isLoading: ratingLoading } = useRating(usuarioId);

  if (!usuarioId) return null;

  const promedio = ratingData?.promedio || 0;
  const total = ratingData?.cantidad || ratingData?.total || 0;
  const distribucion = ratingData?.distribucion || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "#FFFFFF", border: "1px solid #F1F5F9",
        borderRadius: 16, padding: "20px 24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#0F172A", margin: 0, letterSpacing: "-0.01em" }}>
          Calificaciones
        </h3>
        {!ratingLoading && total > 0 && (
          <span style={{ fontFamily: FONT, fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>
            {total} {total === 1 ? "reseña" : "reseñas"}
          </span>
        )}
      </div>
      
      {ratingLoading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 0" }}>
          <Loader2 size={14} className="animate-spin" color="#94A3B8" />
          <span style={{ fontFamily: FONT, fontSize: 12, color: "#94A3B8" }}>Cargando...</span>
        </div>
      ) : total === 0 ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <Star size={28} color="#CBD5E1" />
          <p style={{ fontFamily: FONT, fontSize: 12, color: "#94A3B8", marginTop: 8 }}>
            Aún no hay calificaciones
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ textAlign: "center", minWidth: 80 }}>
            <p style={{ fontFamily: FONT, fontSize: 40, fontWeight: 500, color: "#0F172A", margin: "0 0 2px", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {promedio.toFixed(1)}
            </p>
            <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={12}
                  fill={star <= Math.round(promedio) ? "#F59E0B" : "none"}
                  color={star <= Math.round(promedio) ? "#F59E0B" : "#CBD5E1"}
                  strokeWidth={1.5}
                />
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribucion[star] || 0;
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontFamily: FONT, fontSize: 11, color: "#94A3B8", width: 14, textAlign: "right" }}>{star}</span>
                  <Star size={10} fill="#F59E0B" color="#F59E0B" />
                  <div style={{ flex: 1, height: 5, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: pct > 0 ? "#F59E0B" : "transparent", borderRadius: 3, minWidth: pct > 0 ? 2 : 0 }} />
                  </div>
                  <span style={{ fontFamily: FONT, fontSize: 10, color: "#94A3B8", width: 20, textAlign: "right" }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Página principal ────────────────────────────────────────────
export default function PerfilPublicoMypePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: mype, isLoading, error } = useQuery({
    queryKey: ['mype-publico', id],
    queryFn: async () => {
      const { data } = await httpClient.get(`/mypes/${id}/publico`);
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="#94A3B8" />
      </div>
    );
  }

  if (error || !mype) {
    return (
      <div style={{ background: '#F8FAFC', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, fontFamily: FONT }}>
        <AlertCircle size={44} color="#DC2626" />
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0F172A', margin: 0 }}>Empresa no encontrada</h2>
        <p style={{ fontSize: 13, color: '#64748B', textAlign: 'center', margin: 0 }}>El perfil no existe o no está disponible.</p>
        <button onClick={() => navigate(-1)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#0F172A', color: '#FFFFFF', padding: '10px 20px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: 13, fontFamily: FONT }}>
          <ArrowLeft size={14} /> Volver
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: FONT, background: "#F8FAFC", minHeight: "100vh", padding: "32px 36px", maxWidth: 1200, margin: "0 auto" }}>
      
      <button onClick={() => navigate(-1)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "transparent", border: "none", cursor: "pointer",
          fontSize: 13, color: "#64748B", fontWeight: 500,
          marginBottom: 20, padding: 0, fontFamily: FONT,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#0F172A"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#64748B"; }}
      >
        <ArrowLeft size={15} /> Volver
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "linear-gradient(135deg, #0A1628 0%, #0F2A4A 55%, #152642 100%)",
          borderRadius: 20, padding: "36px 44px", position: "relative",
          overflow: "hidden", marginBottom: 14,
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 24px 48px -12px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 style={{ fontFamily: FONT, fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 600, color: "#FFFFFF", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            {mype.nombreComercial}
          </h1>
          {mype.rubro && (
            <span style={{
              fontFamily: FONT, fontSize: 11, fontWeight: 500,
              background: "rgba(255,255,255,0.06)", color: "#A1A1AA",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "4px 12px", borderRadius: 6,
            }}>
              {mype.rubro}
            </span>
          )}
        </div>
        <div style={{ position: "absolute", top: -100, right: -50, width: 350, height: 350, background: "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "start" }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          
          {mype.descripcion && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: "#FFFFFF", border: "1px solid #F1F5F9", borderRadius: 16, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)" }}>
              <h3 style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#0F172A", margin: "0 0 10px", letterSpacing: "-0.01em" }}>Sobre la empresa</h3>
              <p style={{ fontFamily: FONT, fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0 }}>{mype.descripcion}</p>
            </motion.div>
          )}

          {(mype.direccion || mype.ciudad || mype.sitioWeb) && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: "#FFFFFF", border: "1px solid #F1F5F9", borderRadius: 16, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)" }}>
              <h3 style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#0F172A", margin: "0 0 14px", letterSpacing: "-0.01em" }}>Información de contacto</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {mype.direccion && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" }}>
                    <MapPin size={14} color="#64748B" />
                    <span style={{ fontFamily: FONT, fontSize: 12, color: "#475569", fontWeight: 500 }}>{mype.direccion}</span>
                  </div>
                )}
                {mype.ciudad && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9" }}>
                    <MapPin size={14} color="#64748B" />
                    <span style={{ fontFamily: FONT, fontSize: 12, color: "#475569", fontWeight: 500 }}>{mype.ciudad}</span>
                  </div>
                )}
                {mype.sitioWeb && (
                  <a href={mype.sitioWeb} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #F1F5F9", color: "#475569", transition: "all 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}>
                      <FaGlobe size={14} color="#64748B" />
                      <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500 }}>{mype.sitioWeb}</span>
                    </div>
                  </a>
                )}
              </div>
            </motion.div>
          )}

          {(mype.instagram || mype.facebook || mype.tiktok || mype.whatsapp) && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: "#FFFFFF", border: "1px solid #F1F5F9", borderRadius: 16, padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)" }}>
              <h3 style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: "#0F172A", margin: "0 0 14px", letterSpacing: "-0.01em" }}>Redes sociales</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {mype.instagram && (
                  <a href={`https://instagram.com/${mype.instagram}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F8FAFC", padding: "8px 14px", borderRadius: 8, border: "1px solid #F1F5F9", color: "#64748B", fontSize: 12, fontFamily: FONT, fontWeight: 500, transition: "all 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#0F172A"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#64748B"; }}>
                      <FaInstagram size={14} /> {mype.instagram}
                    </div>
                  </a>
                )}
                {mype.facebook && (
                  <a href={`https://facebook.com/${mype.facebook}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F8FAFC", padding: "8px 14px", borderRadius: 8, border: "1px solid #F1F5F9", color: "#64748B", fontSize: 12, fontFamily: FONT, fontWeight: 500, transition: "all 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#0F172A"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#64748B"; }}>
                      <FaFacebook size={14} /> {mype.facebook}
                    </div>
                  </a>
                )}
                {mype.tiktok && (
                  <a href={`https://tiktok.com/@${mype.tiktok}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F8FAFC", padding: "8px 14px", borderRadius: 8, border: "1px solid #F1F5F9", color: "#64748B", fontSize: 12, fontFamily: FONT, fontWeight: 500, transition: "all 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#0F172A"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#64748B"; }}>
                      <FaTiktok size={14} /> @{mype.tiktok}
                    </div>
                  </a>
                )}
                {mype.whatsapp && (
                  <a href={`https://wa.me/${mype.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#F8FAFC", padding: "8px 14px", borderRadius: 8, border: "1px solid #F1F5F9", color: "#64748B", fontSize: 12, fontFamily: FONT, fontWeight: 500, transition: "all 0.15s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; e.currentTarget.style.color = "#0F172A"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#64748B"; }}>
                      <FaWhatsapp size={14} /> WhatsApp
                    </div>
                  </a>
                )}
              </div>
            </motion.div>
          )}

          <SeccionCalificaciones usuarioId={mype.usuarioId} />
        </div>

        <div>
          <MapaRutaCard direccion={mype.direccion} ciudad={mype.ciudad} latitud={mype.latitud} longitud={mype.longitud} />
        </div>
      </div>
    </div>
  );
}