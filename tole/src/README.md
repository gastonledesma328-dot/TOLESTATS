\# ⚽ LA REDONDA - Portal Deportivo Argentino



Una página web moderna y responsive inspirada en Promiedos.com.ar que muestra información completa de fútbol argentino e internacional con datos en tiempo real desde ESPN Argentina.



\## 🌟 Características Principales



\### ⚽ Agenda Deportiva en Tiempo Real

\- \*\*Datos desde ESPN\*\*: Extrae partidos directamente desde ESPN Argentina

\- \*\*Partidos del día\*\*: Lista completa con horarios, equipos y canales

\- \*\*Marcadores en vivo\*\*: Actualización automática de resultados

\- \*\*Estados de partido\*\*: En Vivo, Finalizado, Próximo con indicadores visuales



\### 📊 Información Completa

\- \*\*Tabla de posiciones\*\*: Liga Profesional Argentina con estadísticas completas

\- \*\*Noticias deportivas\*\*: Últimas noticias con imágenes y resúmenes

\- \*\*Reloj en tiempo real\*\*: Hora y fecha actualizadas cada segundo



\### 🎨 Diseño Profesional

\- \*\*Tema oscuro\*\*: Colores grises con acentos verdes (#8cc63f)

\- \*\*Tipografía\*\*: Roboto de Google Fonts

\- \*\*Responsive\*\*: Mobile-first, adaptado para todos los dispositivos

\- \*\*Efectos modernos\*\*: Hover, transiciones suaves, animaciones



\## 🚀 Tecnología



\- \*\*Framework\*\*: Next.js 15 con TypeScript

\- \*\*Estilos\*\*: Tailwind CSS

\- \*\*API\*\*: Route handlers para web scraping de ESPN

\- \*\*Hooks personalizados\*\*: Para manejo de estado de partidos

\- \*\*Responsive\*\*: Mobile-first design



\## 🔧 API de Partidos con TheSportsDB



\### Endpoint Principal

```

GET /api/partidos?fecha=YYYY-MM-DD

```



\### Ejemplos de Uso



```bash

\# Obtener partidos de hoy

curl http://localhost:3000/api/partidos



\# Obtener partidos de fecha específica (formato YYYYMMDD)

curl http://localhost:3000/api/partidos?fecha=20251016



\# Obtener partidos de mañana

curl http://localhost:3000/api/partidos?fecha=20251017

```



\### Respuesta de la API

```json

{

&nbsp; "success": true,

&nbsp; "fecha": "2024-12-15",

&nbsp; "partidos": \[

&nbsp;   {

&nbsp;     "id": 1,

&nbsp;     "homeTeam": "Boca Juniors",

&nbsp;     "awayTeam": "River Plate", 

&nbsp;     "time": "21:30",

&nbsp;     "channel": "ESPN Premium",

&nbsp;     "status": "Próximo",

&nbsp;     "homeScore": 0,

&nbsp;     "awayScore": 0,

&nbsp;     "isLive": false,

&nbsp;     "competition": "Liga Profesional Argentina",

&nbsp;     "venue": "La Bombonera, Buenos Aires",

&nbsp;     "league": "Argentine Primera División",

&nbsp;     "country": "Argentina"

&nbsp;   }

&nbsp; ],

&nbsp; "total": 1,

&nbsp; "fuente": "TheSportsDB API"

}

```



\## 🛠️ Instalación y Desarrollo



\### Prerrequisitos

\- Node.js 18+ 

\- pnpm (recomendado) o npm



\### Comandos



```bash

\# Instalar dependencias

pnpm install



\# Desarrollo

pnpm run dev



\# Build para producción

pnpm run build --no-lint



\# Servidor de producción

pnpm start

```



\## 🌐 URL de la Aplicación



\*\*Accede aquí\*\*: https://sb-67j69d2qyli0.vercel.run



\## 🔍 Fuente de Datos ESPN Argentina



\- \*\*URL base\*\*: https://www.espn.com.ar/futbol/calendario/\_/fecha/YYYYMMDD

\- \*\*Ejemplo\*\*: https://www.espn.com.ar/futbol/calendario/\_/fecha/20251016

\- \*\*Web scraping avanzado\*\*: Extrae datos JSON embebidos de ESPN Argentina

\- \*\*Fechas dinámicas\*\*: Formato YYYYMMDD (hoy: 20251016, mañana: 20251017)

\- \*\*Cobertura completa\*\*: Ligas argentinas, sudamericanas, europeas e internacionales

\- \*\*Datos reales\*\*: Partidos, horarios, marcadores y estadios actuales

\- \*\*Sistema de fallback\*\*: Datos simulados argentinos si no hay partidos disponibles

\- \*\*Auto-actualización\*\*: Cada 30 segundos para partidos en vivo



\## 🎯 Funcionalidades



\### ⏰ Tiempo Real

\- Reloj actualizado cada segundo

\- Marcadores en vivo con animaciones

\- Botón actualizar para refrescar datos



\### 📱 Responsive

\- Mobile-first design

\- Menú hamburguesa en móviles

\- Adaptación fluida en tablets



\### ✨ Efectos Visuales

\- Hover en elementos interactivos

\- Transiciones suaves

\- Indicadores de estado con animaciones



\## 🏆 ¡Disfruta del fútbol argentino!



Tu portal deportivo completo con datos reales de ESPN Argentina.



\*\*LA REDONDA - Desarrollado con ❤️ para los fanáticos del fútbol argentino\*\*

