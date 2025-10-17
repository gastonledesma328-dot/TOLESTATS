'use client';

import { useState, useEffect, useCallback } from 'react';

interface Partido {
  id: number;
  homeTeam: string;
  awayTeam: string;
  time: string;
  channel: string;
  status: string;
  homeScore: number;
  awayScore: number;
  isLive: boolean;
  competition?: string;
  venue?: string;
  league?: string;
  country?: string;
  eventId?: string;
  season?: string;
  round?: number | null;
  homeLogo?: string;
  awayLogo?: string;
}

interface PartidosResponse {
  success: boolean;
  fecha: string;
  partidos: Partido[];
  total: number;
  fuente: string;
  error?: string;
  mensaje?: string;
}

export function usePartidos(fechaInicial?: string) {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fuente, setFuente] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);

  const obtenerPartidos = useCallback(async (fecha?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Convertir fecha al formato que ESPN espera (YYYYMMDD)
      let fechaESPN = fecha || fechaInicial;
      
      // Si no hay fecha, usar hoy en formato YYYYMMDD
      if (!fechaESPN) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        fechaESPN = `${year}${month}${day}`;
      }
      
      // Si viene en formato YYYY-MM-DD, convertir a YYYYMMDD
      if (fechaESPN.includes('-')) {
        fechaESPN = fechaESPN.replace(/-/g, '');
      }

      const url = `/api/partidos?fecha=${fechaESPN}`;
      console.log(`Fetching partidos from: ${url} (ESPN format: ${fechaESPN})`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache', // Siempre obtener datos frescos
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: PartidosResponse = await response.json();
      console.log('API Response:', data);
      
      setPartidos(data.partidos);
      setFuente(data.fuente);
      setMensaje(data.mensaje || '');
      setUltimaActualizacion(new Date());
      
      if (!data.success) {
        setError(data.error || 'Error desconocido');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener partidos';
      setError(errorMessage);
      console.error('Error fetching partidos:', err);
      
      // Datos de fallback en caso de error
      setPartidos([
        {
          id: 1,
          homeTeam: 'Boca Juniors',
          awayTeam: 'River Plate',
          time: '21:30',
          channel: 'ESPN Premium',
          status: 'Próximo',
          homeScore: 0,
          awayScore: 0,
          isLive: false,
          competition: 'Liga Profesional Argentina',
          venue: 'La Bombonera, Buenos Aires',
          league: 'Argentine Primera División',
          country: 'Argentina'
        },
        {
          id: 2,
          homeTeam: 'Racing Club',
          awayTeam: 'Independiente',
          time: '19:15',
          channel: 'TNT Sports',
          status: 'En Vivo',
          homeScore: 1,
          awayScore: 0,
          isLive: true,
          competition: 'Liga Profesional Argentina',
          venue: 'Estadio Presidente Perón, Avellaneda',
          league: 'Argentine Primera División',
          country: 'Argentina'
        },
        {
          id: 3,
          homeTeam: 'Estudiantes',
          awayTeam: 'Gimnasia',
          time: '17:00',
          channel: 'TV Pública',
          status: 'Finalizado',
          homeScore: 2,
          awayScore: 2,
          isLive: false,
          competition: 'Liga Profesional Argentina',
          venue: 'Estadio Ciudad de La Plata',
          league: 'Argentine Primera División',
          country: 'Argentina'
        }
      ]);
      setFuente('Datos de fallback - TheSportsDB no disponible');
    } finally {
      setLoading(false);
    }
  }, [fechaInicial]);

  // Actualizar partidos en vivo con datos reales
  const actualizarPartidos = useCallback(async () => {
    console.log('Actualizando partidos...');
    
    // Si hay partidos en vivo, refrescar desde la API
    const partidosEnVivo = partidos.filter(p => p.isLive);
    if (partidosEnVivo.length > 0) {
      await obtenerPartidos();
    } else {
      // Solo simular cambios si no hay API disponible
      setPartidos(prevPartidos => 
        prevPartidos.map(partido => ({
          ...partido,
          homeScore: partido.isLive ? Math.floor(Math.random() * 4) : partido.homeScore,
          awayScore: partido.isLive ? Math.floor(Math.random() * 4) : partido.awayScore,
        }))
      );
    }
    
    setUltimaActualizacion(new Date());
  }, [partidos, obtenerPartidos]);

  // Auto-actualización cada 30 segundos si hay partidos en vivo
  useEffect(() => {
    const partidosEnVivo = partidos.filter(p => p.isLive);
    
    if (partidosEnVivo.length > 0) {
      const interval = setInterval(() => {
        console.log('Auto-actualizando partidos en vivo...');
        actualizarPartidos();
      }, 30000); // 30 segundos

      return () => clearInterval(interval);
    }
  }, [partidos, actualizarPartidos]);

  // Cargar partidos al inicializar
  useEffect(() => {
    obtenerPartidos();
  }, [obtenerPartidos]);

  return {
    partidos,
    loading,
    error,
    fuente,
    mensaje,
    ultimaActualizacion,
    obtenerPartidos,
    actualizarPartidos,
    refetch: () => obtenerPartidos(),
    // Funciones adicionales
    partidosEnVivo: partidos.filter(p => p.isLive),
    partidosFinalizados: partidos.filter(p => p.status === 'Finalizado'),
    partidosProximos: partidos.filter(p => p.status === 'Próximo'),
  };
}