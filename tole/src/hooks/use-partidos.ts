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
  competition: string;
  venue: string;
  league?: string;
  country?: string;
  homeLogo?: string;
  awayLogo?: string;
}

interface UsePartidosReturn {
  partidos: Partido[];
  loading: boolean;
  error: string | null;
  fuente: string;
  mensaje: string;
  ultimaActualizacion: Date;
  actualizarPartidos: () => void;
  partidosEnVivo: Partido[];
  partidosFinalizados: Partido[];
  partidosProximos: Partido[];
}

export function usePartidos(fecha?: string): UsePartidosReturn {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fuente, setFuente] = useState('ESPN Argentina');
  const [mensaje, setMensaje] = useState('');
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());

  const fetchPartidos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir URL con fecha si se proporciona
      const url = fecha 
        ? `/api/partidos?fecha=${fecha}` 
        : '/api/partidos';

      console.log(`Fetching partidos from: ${url}`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // No cachear para obtener datos frescos
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('API Response:', data);

      setPartidos(data.partidos || []);
      setFuente(data.fuente || 'ESPN Argentina');
      setMensaje(data.mensaje || '');
      setUltimaActualizacion(new Date());

      if (!data.success && data.error) {
        setError(data.error);
      }

    } catch (err) {
      console.error('Error fetching partidos:', err);
      setError('Error al conectar con el servidor. Mostrando datos de fallback.');
      
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
          country: 'Argentina',
          homeLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/5.png',
          awayLogo: 'https://a.espncdn.com/i/teamlogos/soccer/500/52.png'
        }
      ]);
      setFuente('Datos de fallback');
    } finally {
      setLoading(false);
    }
  }, [fecha]);

  // Cargar partidos al montar y cada 30 segundos
  useEffect(() => {
    fetchPartidos();

    // Auto-actualización cada 30 segundos
    const interval = setInterval(() => {
      console.log('Auto-actualizando partidos...');
      fetchPartidos();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchPartidos]);

  // Calcular partidos por estado
  const partidosEnVivo = partidos.filter(p => p.isLive);
  const partidosFinalizados = partidos.filter(p => p.status === 'Finalizado');
  const partidosProximos = partidos.filter(p => p.status === 'Próximo');

  return {
    partidos,
    loading,
    error,
    fuente,
    mensaje,
    ultimaActualizacion,
    actualizarPartidos: fetchPartidos,
    partidosEnVivo,
    partidosFinalizados,
    partidosProximos,
  };
}
