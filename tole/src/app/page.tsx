'use client';

import React, { useState, useEffect } from 'react';
import { usePartidos } from '@/hooks/use-partidos';

export default function Home() {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  // Usar la fecha de hoy en formato YYYYMMDD para ESPN
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const fechaHoy = `${year}${month}${day}`;
  
  const {
    partidos,
    loading,
    error,
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
@@ -140,57 +134,51 @@ export default function Home() {

  // Datos simulados - Noticias
  const news = [
    {
      id: 1,
      title: 'Boca y River protagonizan el Superclásico más esperado del año',
      summary: 'El encuentro entre los eternos rivales promete emociones fuertes en La Bombonera con más de 50,000 espectadores.',
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/053f7b55-affe-4a0c-899c-4ccaf3752edf.png',
      date: '2024-01-15'
    },
    {
      id: 2,
      title: 'Racing lidera la tabla tras vencer a Independiente en Avellaneda',
      summary: 'La Academia se consolida en los primeros puestos de la Liga Profesional con una gran actuación en el clásico.',
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/10d03b67-f693-48ca-a811-ebd5c6de254a.png',
      date: '2024-01-14'
    },
    {
      id: 3,
      title: 'La Selección Argentina prepara la próxima fecha de Eliminatorias',
      summary: 'Scaloni evalúa modificaciones tácticas para los próximos partidos rumbo al Mundial 2026.',
      image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c5248e5a-ae4b-4be4-bc91-bc3200d8df91.png',
      date: '2024-01-13'
    }
  ];
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full bg-gray-800 border-b border-gray-700 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-xl">LR</span>
              </div>
              <h1 className="text-xl font-bold text-green-400">LA REDONDA</h1>
            </div>

            {/* Navegación Desktop */}
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-green-400 font-semibold border-b-2 border-green-400">Inicio</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Partidos</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Tablas</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Copas</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Selección</a>
              <a href="#" className="text-gray-300 hover:text-green-400 transition-colors">Noticias</a>
            </nav>

            {/* Buscador */}
            <div className="hidden sm:flex items-center">
