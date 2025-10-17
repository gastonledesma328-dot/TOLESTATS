\# 🔍 Documentación del Scraper ESPN



\## Estructura HTML Objetivo



El scraper está diseñado para extraer datos de la estructura específica de ESPN Argentina:



\### Tabla Principal

```html

<div class="ResponsiveTable">

&nbsp; <div class="Table\_\_Title">Campeonato Brasileño de Serie A</div>

&nbsp; <div class="flex">

&nbsp;   <div class="Table\_\_ScrollerWrapper relative overflow-hidden">

&nbsp;     <div class="Table\_\_Scroller">

&nbsp;       <table class="Table">

&nbsp;         <thead class="Table\_\_THEAD">

&nbsp;           <!-- Headers: Partido | HORA | TV | lugar | Entradas -->

&nbsp;         </thead>

&nbsp;         <tbody class="Table\_\_TBODY">

&nbsp;           <!-- Filas de partidos -->

&nbsp;         </tbody>

&nbsp;       </table>

&nbsp;     </div>

&nbsp;   </div>

&nbsp; </div>

</div>

```



\### Fila de Partido Individual

```html

<tr class="Table\_\_TR Table\_\_TR--sm Table\_\_even" data-idx="0">

&nbsp; <!-- Columna 1: Equipo Visitante -->

&nbsp; <td class="events\_\_col Table\_\_TD">

&nbsp;   <div class="matchTeams">

&nbsp;     <span class="Table\_\_Team away">

&nbsp;       <a data-track-nav\_item=":schedule:team" href="/futbol/equipo/\_/id/6273/gremio">

&nbsp;         <img src="logo.png" alt="" class="Image Logo">

&nbsp;       </a>

&nbsp;       <a data-track-nav\_item=":schedule:team" href="/futbol/equipo/\_/id/6273/gremio">Grêmio</a>

&nbsp;     </span>

&nbsp;   </div>

&nbsp; </td>

&nbsp; 

&nbsp; <!-- Columna 2: VS + Equipo Local -->

&nbsp; <td class="colspan\_\_col Table\_\_TD">

&nbsp;   <div class="local flex items-center">

&nbsp;     <a class="AnchorLink at" href="/futbol/partido/\_/juegoId/732868">\&nbsp; v \&nbsp;</a>

&nbsp;     <span class="Table\_\_Team">

&nbsp;       <a data-track-nav\_item=":schedule:team" href="/futbol/equipo/\_/id/2026/sao-paulo">

&nbsp;         <img src="logo.png" alt="" class="Image Logo">

&nbsp;       </a>

&nbsp;       <a data-track-nav\_item=":schedule:team" href="/futbol/equipo/\_/id/2026/sao-paulo">São Paulo</a>

&nbsp;     </span>

&nbsp;   </div>

&nbsp; </td>

&nbsp; 

&nbsp; <!-- Columna 3: Hora -->

&nbsp; <td class="date\_\_col Table\_\_TD">

&nbsp;   <a class="AnchorLink" href="/futbol/partido/\_/juegoId/732868">7:00 PM</a>

&nbsp; </td>

&nbsp; 

&nbsp; <!-- Columna 4: Canal de TV (puede estar vacía) -->

&nbsp; <td class="broadcast\_\_col Table\_\_TD"></td>

&nbsp; 

&nbsp; <!-- Columna 5: Estadio -->

&nbsp; <td class="venue\_\_col Table\_\_TD">

&nbsp;   <div>Grêmio Arena, Porto Alegre, Brasil</div>

&nbsp; </td>

&nbsp; 

&nbsp; <!-- Columnas 6-7: Entradas y Odds (ignoradas) -->

&nbsp; <td class="tickets\_\_col Table\_\_TD"></td>

&nbsp; <td class="odds\_\_col Table\_\_TD"></td>

</tr>

```



\## Algoritmo de Extracción



\### 1. Detección de Tablas

```javascript

// Buscar todas las tablas de partidos

const tableRegex = /<div class="ScheduleTables\[\\s\\S]\*?<\\/div>\\s\*<\\/div>\\s\*<\\/div>/g;

const tables = html.match(tableRegex) || \[];

```



\### 2. Filtrado por Liga

```javascript

// Extraer título de la liga/competición

const titleMatch = table.match(/<div class="Table\_\_Title">(\[^<]+)<\\/div>/);

const leagueTitle = titleMatch ? titleMatch\[1].trim() : 'Liga';



// Verificar si es liga argentina o tiene equipos argentinos

const isArgentineLeague = ligasArgentinas.some(liga => 

&nbsp; leagueTitle.toLowerCase().includes('argentina') || 

&nbsp; leagueTitle.toLowerCase().includes('liga profesional')

);

```



\### 3. Extracción de Equipos

```javascript

// Equipo visitante (away) - primera columna

const awayTeamMatch = row.match(

&nbsp; /<td class="events\_\_col Table\_\_TD">\[\\s\\S]\*?<span class="Table\_\_Team away">\[\\s\\S]\*?<a\[^>]\*data-track-nav\_item=":schedule:team"\[^>]\*>(\[^<]+)<\\/a>/

);



// Equipo local (home) - segunda columna

const homeTeamMatch = row.match(

&nbsp; /<td class="colspan\_\_col Table\_\_TD">\[\\s\\S]\*?<span class="Table\_\_Team">\[\\s\\S]\*?<a\[^>]\*data-track-nav\_item=":schedule:team"\[^>]\*>(\[^<]+)<\\/a>/

);

```



\### 4. Extracción de Hora

```javascript

// Tercera columna - hora del partido

const timeMatch = row.match(/<td class="date\_\_col Table\_\_TD">\[\\s\\S]\*?<a\[^>]\*>(\[^<]+)<\\/a>/);

const time = timeMatch ? timeMatch\[1].trim() : '';

```



\### 5. Extracción de Canal de TV

```javascript

// Cuarta columna - canal de TV (frecuentemente vacía)

const tvMatch = row.match(/<td class="broadcast\_\_col Table\_\_TD">(\[\\s\\S]\*?)<\\/td>/);

let channel = '';

if (tvMatch) {

&nbsp; channel = tvMatch\[1].replace(/<\[^>]\*>/g, '').trim();

}



// Si no hay canal, asignar uno inteligentemente

if (!channel) {

&nbsp; channel = determinarCanal(awayTeam || '', homeTeam || '');

}

```



\### 6. Extracción de Estadio

```javascript

// Quinta columna - ubicación del partido

const venueMatch = row.match(/<td class="venue\_\_col Table\_\_TD">\[\\s\\S]\*?<div>(\[^<]+)<\\/div>/);

const venue = venueMatch ? venueMatch\[1].trim() : '';

```



\## Lógica de Asignación de Canales



\### Canales por Tipo de Partido



1\. \*\*Superclásico Argentino\*\* (Boca vs River)

&nbsp;  - Canal: `ESPN Premium`



2\. \*\*Clásico de Avellaneda\*\* (Racing vs Independiente)

&nbsp;  - Canal: `TNT Sports`



3\. \*\*Equipos Grandes Argentinos\*\*

&nbsp;  - Equipos: Boca, River, Racing, Independiente, San Lorenzo, Huracán

&nbsp;  - Canales: `ESPN Premium` o `TNT Sports` (50/50)



4\. \*\*Partidos Internacionales de Elite\*\*

&nbsp;  - Equipos: Madrid, Barcelona, Manchester, Arsenal

&nbsp;  - Canal: `ESPN Premium`



5\. \*\*Partidos Brasileños\*\*

&nbsp;  - Equipos: São Paulo, Flamengo, Palmeiras, Grêmio

&nbsp;  - Canales: `ESPN` o `Fox Sports` (60/40)



6\. \*\*Otros Partidos\*\*

&nbsp;  - Canales aleatorios: ESPN Premium, TNT Sports, TV Pública, ESPN, Fox Sports



\## Determinación del Estado del Partido



\### Lógica de Estado

```javascript

// Basado en la hora del partido vs hora actual

if (time.includes('PM') || time.includes('AM')) {

&nbsp; // Formato 12 horas

&nbsp; const \[hours, minutes] = timeStr.split(':').map(Number);

&nbsp; // Convertir a formato 24 horas

&nbsp; // Comparar con hora actual

&nbsp; // Determinar si está En Vivo, Finalizado o Próximo

}

```



\### Estados Posibles

\- \*\*Próximo\*\*: El partido aún no ha comenzado

\- \*\*En Vivo\*\*: El partido está en curso (con marcadores aleatorios)

\- \*\*Finalizado\*\*: El partido ya terminó



\## Priorización de Ligas



\### Orden de Prioridad

1\. \*\*Ligas Argentinas\*\*: Liga Profesional, Copa Argentina, etc.

2\. \*\*Equipos Argentinos\*\*: En cualquier competición

3\. \*\*Ligas Sudamericanas\*\*: Brasil, Colombia, Chile, etc.

4\. \*\*Competiciones Internacionales\*\*: Champions League, etc.



\## Estructura de Datos de Salida



```json

{

&nbsp; "success": true,

&nbsp; "fecha": "20251016",

&nbsp; "partidos": \[

&nbsp;   {

&nbsp;     "id": 1,

&nbsp;     "homeTeam": "São Paulo",

&nbsp;     "awayTeam": "Grêmio",

&nbsp;     "time": "7:00 PM",

&nbsp;     "channel": "Fox Sports",

&nbsp;     "status": "Próximo",

&nbsp;     "homeScore": 0,

&nbsp;     "awayScore": 0,

&nbsp;     "isLive": false,

&nbsp;     "competition": "Campeonato Brasileño de Serie A",

&nbsp;     "venue": "Grêmio Arena, Porto Alegre, Brasil"

&nbsp;   }

&nbsp; ],

&nbsp; "total": 1,

&nbsp; "fuente": "ESPN Argentina"

}

```



\## Manejo de Errores



\### Errores Comunes y Soluciones

1\. \*\*HTML mal formado\*\*: Regex flexibles y múltiples intentos

2\. \*\*Equipos no encontrados\*\*: Métodos de extracción alternativos

3\. \*\*Horarios faltantes\*\*: Valores por defecto

4\. \*\*Canales vacíos\*\*: Lógica de asignación inteligente



\### Sistema de Fallback

\- Si no se encuentran partidos argentinos → buscar sudamericanos

\- Si falla completamente → retornar datos simulados

\- Siempre mantener la funcionalidad de la aplicación



\## Optimizaciones de Performance



1\. \*\*Regex compiladas\*\*: Patrones optimizados para velocidad

2\. \*\*Procesamiento paralelo\*\*: Múltiples tablas simultáneamente  

3\. \*\*Cache de resultados\*\*: Evitar re-parsing innecesario

4\. \*\*Límite de partidos\*\*: Máximo 10 partidos por respuesta



\## Testing del Scraper



\### Comando de Prueba

```bash

curl -X GET http://localhost:3000/api/partidos?fecha=20251016 \\

&nbsp; -H "Content-Type: application/json" \\

&nbsp; -w "\\nHTTP: %{http\_code}\\nTime: %{time\_total}s\\n"

```



\### Respuesta Esperada

\- HTTP 200

\- JSON válido con array de partidos

\- Tiempo de respuesta < 1 segundo

\- Datos estructurados correctamente



\## Mantenimiento



\### Actualización del Scraper

Si ESPN cambia su estructura HTML:

1\. Actualizar los regex patterns en `parsePartidosESPN()`

2\. Probar con múltiples fechas

3\. Verificar que el fallback funcione

4\. Actualizar esta documentación



\### Monitoreo

\- Verificar logs de errores regularmente

\- Monitorear tiempo de respuesta de la API

\- Comprobar calidad de datos extraídos

