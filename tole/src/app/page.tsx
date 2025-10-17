'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { usePartidos } from '@/hooks/use-partidos';
import { Search, Menu, RefreshCw } from 'lucide-react';

export default function Home() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Obtener fecha actual en formato YYYYMMDD
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const fechaHoy = `${year}${month}${day}`;
  
  // Usar el hook para obtener partidos desde ESPN
  const { 
    partidos, 
    loading, 
    error, 
    fuente, 
    mensaje, 
    ultimaActualizacion,
    actualizarPartidos,
    partidosEnVivo 
  } = usePartidos(fechaHoy);

  // Actualizar hora cada segundo
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'America/Argentina/Buenos_Aires'
      };
      const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/Argentina/Buenos_Aires'
      };
      
      setCurrentTime(now.toLocaleTimeString('es-AR', timeOptions));
      setCurrentDate(now.toLocaleDateString('es-AR', dateOptions));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Función para obtener el ícono de la liga
  const getIconoLiga = (liga: string): string => {
    const ligaLower = liga.toLowerCase();
    
    if (ligaLower.includes('argentina') || ligaLower.includes('profesional')) return '🇦🇷';
    if (ligaLower.includes('brasil') || ligaLower.includes('brasileño')) return '🇧🇷';
    if (ligaLower.includes('colombia')) return '🇨🇴';
    if (ligaLower.includes('chile')) return '🇨🇱';
    if (ligaLower.includes('uruguay')) return '🇺🇾';
    if (ligaLower.includes('paraguay')) return '🇵🇾';
    if (ligaLower.includes('perú') || ligaLower.includes('peru')) return '🇵🇪';
    if (ligaLower.includes('méxico') || ligaLower.includes('mexico')) return '🇲🇽';
    if (ligaLower.includes('libertadores')) return '🏆';
    if (ligaLower.includes('sudamericana')) return '🥈';
    if (ligaLower.includes('champions')) return '⭐';
    if (ligaLower.includes('uefa')) return '🌍';
    
    return '⚽';
  };

  // Agrupar partidos por competencia/liga
  const partidosPorLiga = useMemo(() => {
    const grupos: { [key: string]: typeof partidos } = {};
    
    partidos.forEach(partido => {
      const liga = partido.competition || partido.league || 'Otros Partidos';
      if (!grupos[liga]) {
        grupos[liga] = [];
      }
      grupos[liga].push(partido);
    });

    // Ordenar las ligas por prioridad (argentinas primero, luego sudamericanas)
    const ligasOrdenadas = Object.keys(grupos).sort((a, b) => {
      const esArgentinaA = a.toLowerCase().includes('argentina') || a.toLowerCase().includes('profesional');
      const esArgentinaB = b.toLowerCase().includes('argentina') || b.toLowerCase().includes('profesional');
      
      if (esArgentinaA && !esArgentinaB) return -1;
      if (!esArgentinaA && esArgentinaB) return 1;
      
      const esSudamericanaA = a.toLowerCase().includes('brasil') || a.toLowerCase().includes('colombia');
      const esSudamericanaB = b.toLowerCase().includes('brasil') || b.toLowerCase().includes('colombia');
      
      if (esSudamericanaA && !esSudamericanaB) return -1;
      if (!esSudamericanaA && esSudamericanaB) return 1;
      
      return a.localeCompare(b);
    });

    const resultado: { [key: string]: typeof partidos } = {};
    ligasOrdenadas.forEach(liga => {
      resultado[liga] = grupos[liga];
    });

    return resultado;
  }, [partidos]);

  // Datos de tabla de posiciones
  const leagueTable = [
    { pos: 1, team: 'River Plate', pj: 25, g: 16, e: 6, p: 3, gf: 45, gc: 18, dg: 27, pts: 54 },
    { pos: 2, team: 'Boca Juniors', pj: 25, g: 15, e: 7, p: 3, gf: 42, gc: 20, dg: 22, pts: 52 },
    { pos: 3, team: 'Racing Club', pj: 25, g: 14, e: 8, p: 3, gf: 38, gc: 19, dg: 19, pts: 50 },
    { pos: 4, team: 'Estudiantes', pj: 25, g: 13, e: 9, p: 3, gf: 35, gc: 21, dg: 14, pts: 48 },
    { pos: 5, team: 'Talleres', pj: 25, g: 12, e: 8, p: 5, gf: 33, gc: 23, dg: 10, pts: 44 },
    { pos: 6, team: 'San Lorenzo', pj: 25, g: 11, e: 9, p: 5, gf: 30, gc: 24, dg: 6, pts: 42 },
    { pos: 7, team: 'Independiente', pj: 25, g: 10, e: 10, p: 5, gf: 28, gc: 25, dg: 3, pts: 40 },
    { pos: 8, team: 'Huracán', pj: 25, g: 9, e: 11, p: 5, gf: 26, gc: 26, dg: 0, pts: 38 }
  ];

  // Noticias
  const news = [
    {
      id: 1,
      title: 'Boca y River protagonizan el Superclásico más esperado del año',
      summary: 'El encuentro entre los eternos rivales promete emociones fuertes en La Bombonera.',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Racing lidera la tabla tras vencer a Independiente en Avellaneda',
      summary: 'La Academia se consolida en los primeros puestos de la Liga Profesional.',
      date: '2024-01-14'
    },
    {
      id: 3,
      title: 'La Selección Argentina prepara la próxima fecha de Eliminatorias',
      summary: 'Scaloni evalúa modificaciones tácticas para los próximos partidos.',
      date: '2024-01-13'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-gray-800 border-b border-gray-700 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-xl">LR</span>
              </div>
              <h1 className="text-xl font-bold text-green-400">LA REDONDA</h1>
            </div>

            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-green-400 font-semibold border-b-2 border-green-400">Inicio</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Partidos</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Tablas</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Copas</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Selección</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Noticias</a>
            </nav>

            <div className="hidden sm:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-gray-700 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 space-y-8">
          {/* Fecha y Hora */}
          <div className="bg-gray-800 rounded-lg p-4 text-center border border-gray-700">
            <div className="text-green-400 text-lg font-semibold">{currentDate}</div>
            <div className="text-2xl font-bold">{currentTime}</div>
          </div>

          {/* Agenda Deportiva */}
          <section className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-green-400 flex items-center">
                  <span className="mr-2">⚽</span>
                  Agenda Deportiva
                  {partidosEnVivo.length > 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full animate-pulse">
                      {partidosEnVivo.length} EN VIVO
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={actualizarPartidos}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Actualizar</span>
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-yellow-900 border border-yellow-600 rounded-lg text-yellow-200">
                <p className="text-sm">
                  <strong>Aviso:</strong> {error}
                </p>
              </div>
            )}

            <div className="text-xs text-gray-400 mb-4">
              Última actualización: {ultimaActualizacion.toLocaleTimeString('es-AR')} • 
              Fuente: {fuente} • {partidos.length} partidos
              {mensaje && ` • ${mensaje}`}
            </div>

            <div className="space-y-6">
              {loading && partidos.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                  <span className="ml-2 text-gray-400">Cargando partidos desde ESPN...</span>
                </div>
              ) : Object.keys(partidosPorLiga).length > 0 ? (
                Object.entries(partidosPorLiga).map(([liga, partidosLiga]) => (
                  <div key={liga} className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
                    <div className="bg-gray-600 px-3 py-2 border-b border-gray-500">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-green-400 flex items-center">
                          <span className="mr-1.5">{getIconoLiga(liga)}</span>
                          <span className="truncate">{liga}</span>
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-300 flex-shrink-0">
                          <span>{partidosLiga.length}</span>
                          <span className="hidden sm:inline">{partidosLiga.find(p => p.country)?.country || 'Intl'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 p-3">
                      {partidosLiga.map((match) => (
                        <div
                          key={match.id}
                          className={`bg-gray-800 rounded p-2 border transition-all hover:bg-gray-750 ${
                            match.isLive ? 'border-green-500 shadow-sm shadow-green-500/10' : 'border-gray-600'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex flex-col space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2 text-gray-400">
                                  <span className="font-medium">{match.time}</span>
                                  <span className="hidden sm:inline">•</span>
                                  <span className="hidden sm:inline">{match.channel}</span>
                                </div>
                                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                                  match.status === 'En Vivo' 
                                    ? 'bg-green-600 text-white animate-pulse' 
                                    : match.status === 'Finalizado'
                                    ? 'bg-gray-600 text-white'
                                    : 'bg-blue-600 text-white'
                                }`}>
                                  {match.status}
                                </span>
                              </div>

                              <div className="flex items-center justify-center space-x-2 sm:space-x-6">
                                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 justify-end min-w-0">
                                  <span className="font-semibold text-white truncate text-right text-sm sm:text-base">
                                    {match.homeTeam}
                                  </span>
                                  {match.homeLogo ? (
                                    <img 
                                      src={match.homeLogo} 
                                      alt={`Escudo ${match.homeTeam}`}
                                      className="w-7 h-7 sm:w-8 sm:h-8 rounded object-contain bg-white/5 p-0.5 flex-shrink-0"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const sibling = target.nextElementSibling;
                                        if (sibling) sibling.classList.remove('hidden');
                                      }}
                                    />
                                  ) : null}
                                  <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${match.homeLogo ? 'hidden' : ''}`}>
                                    {match.homeTeam.charAt(0)}
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-6 py-2 bg-gray-600 rounded-lg flex-shrink-0">
                                  <span className={`text-xl sm:text-2xl font-bold ${match.isLive ? 'text-green-400' : 'text-white'}`}>
                                    {match.homeScore}
                                  </span>
                                  <span className="text-gray-300 text-lg sm:text-xl font-medium">-</span>
                                  <span className={`text-xl sm:text-2xl font-bold ${match.isLive ? 'text-green-400' : 'text-white'}`}>
                                    {match.awayScore}
                                  </span>
                                </div>

                                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 justify-start min-w-0">
                                  {match.awayLogo ? (
                                    <img 
                                      src={match.awayLogo} 
                                      alt={`Escudo ${match.awayTeam}`}
                                      className="w-7 h-7 sm:w-8 sm:h-8 rounded object-contain bg-white/5 p-0.5 flex-shrink-0"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const sibling = target.nextElementSibling;
                                        if (sibling) sibling.classList.remove('hidden');
                                      }}
                                    />
                                  ) : null}
                                  <div className={`w-7 h-7 sm:w-8 sm:h-8 bg-red-600 rounded flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${match.awayLogo ? 'hidden' : ''}`}>
                                    {match.awayTeam.charAt(0)}
                                  </div>
                                  <span className="font-semibold text-white truncate text-left text-sm sm:text-base">
                                    {match.awayTeam}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {match.venue && (
                              <div className="flex items-center text-xs text-gray-500 justify-center">
                                <span className="mr-1">📍</span>
                                <span className="truncate text-center">{match.venue}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No hay partidos programados para esta fecha</p>
                </div>
              )}
            </div>
          </section>

          {/* Tabla de Posiciones */}
          <section className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              Liga Profesional Argentina
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-700 text-green-400">
                    <th className="px-3 py-3 text-left">Pos</th>
                    <th className="px-3 py-3 text-left">Equipo</th>
                    <th className="px-3 py-3 text-center">PJ</th>
                    <th className="px-3 py-3 text-center">G</th>
                    <th className="px-3 py-3 text-center">E</th>
                    <th className="px-3 py-3 text-center">P</th>
                    <th className="px-3 py-3 text-center">GF</th>
                    <th className="px-3 py-3 text-center">GC</th>
                    <th className="px-3 py-3 text-center">DG</th>
                    <th className="px-3 py-3 text-center font-bold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {leagueTable.map((team, index) => (
                    <tr
                      key={team.pos}
                      className={`${
                        index % 2 === 0 ? 'bg-gray-750' : 'bg-gray-700'
                      } hover:bg-gray-600 transition-colors`}
                    >
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          team.pos <= 4 ? 'bg-green-600 text-white' : 
                          team.pos <= 8 ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
                        }`}>
                          {team.pos}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-medium">{team.team}</td>
                      <td className="px-3 py-3 text-center">{team.pj}</td>
                      <td className="px-3 py-3 text-center text-green-400">{team.g}</td>
                      <td className="px-3 py-3 text-center text-yellow-400">{team.e}</td>
                      <td className="px-3 py-3 text-center text-red-400">{team.p}</td>
                      <td className="px-3 py-3 text-center">{team.gf}</td>
                      <td className="px-3 py-3 text-center">{team.gc}</td>
                      <td className={`px-3 py-3 text-center font-medium ${
                        team.dg > 0 ? 'text-green-400' : team.dg < 0 ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {team.dg > 0 ? '+' : ''}{team.dg}
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-green-400">{team.pts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Noticias */}
          <section className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center">
              <span className="mr-2">📰</span>
              Últimas Noticias
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {news.map((article) => (
                <article
                  key={article.id}
                  className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-600 transition-all hover:scale-105"
                >
                  <div className="aspect-video bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                    <span className="text-6xl">⚽</span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-base mb-1 line-clamp-2 hover:text-green-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="text-xs text-gray-500">
                      {new Date(article.date).toLocaleDateString('es-AR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-white">LR</span>
                </div>
                <h3 className="text-lg font-bold text-green-400">LA REDONDA</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Tu portal deportivo de confianza para seguir todo el fútbol argentino e internacional.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-green-400 mb-2 text-sm">Secciones</h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Partidos</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Tablas</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Copas</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-green-400 mb-2 text-sm">Legal</h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-green-400 mb-2 text-sm">Síguenos</h4>
              <div className="flex space-x-2">
                <a href="#" className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <span className="text-white text-xs font-bold">f</span>
                </a>
                <a href="#" className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center hover:bg-blue-500 transition-colors">
                  <span className="text-white text-xs font-bold">𝕏</span>
                </a>
                <a href="#" className="w-6 h-6 bg-pink-600 rounded flex items-center justify-center hover:bg-pink-700 transition-colors">
                  <span className="text-white text-xs font-bold">i</span>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>&copy; 2025 LA REDONDA. Todos los derechos reservados. | Fútbol Argentino e Internacional</p>
            <p className="mt-2 text-xs">Datos obtenidos de ESPN Argentina • Actualización automática cada 30 segundos</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
