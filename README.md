# 🌤️ Dynamic Weather App

Una aplicación web interactiva y moderna que permite consultar el clima en tiempo real de cualquier ciudad del mundo. Diseñada con un enfoque en la experiencia de usuario (estilo *Glassmorphism*) y un manejo robusto de flujos de datos asíncronos.

## 🚀 Características Principales

- **Búsqueda Global Precisa:** Convierte texto ingresado por el usuario en coordenadas geográficas exactas.
- **Métricas en Tiempo Real:** Visualización instantánea de la temperatura actual, velocidad del viento y condiciones del cielo.
- **UI/UX Moderna y Responsiva:** Interfaz completamente centrada que utiliza el efecto de vidrio esmerilado (*Glassmorphism*), sombras suaves y animaciones fluidas al interactuar con las tarjetas.
- **Persistencia de Sesión:** El historial de ciudades consultadas se guarda automáticamente utilizando `localStorage`, sobreviviendo a recargas de la página.
- **Iconografía Dinámica:** Integración con FontAwesome para renderizar iconos que cambian automáticamente según los códigos meteorológicos oficiales (WMO).

## 🛠️ Stack Tecnológico

- **Frontend:** HTML5, CSS3 (Variables nativas, Flexbox, Glassmorphism).
- **Lógica:** JavaScript Vanilla (ES6+, Async/Await, Fetch API, LocalStorage).
- **Integración de APIs:** - [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) (Transformación de Ciudad a Coordenadas).
  - [Open-Meteo Weather Forecast API](https://open-meteo.com/en/docs) (Obtención de métricas climáticas).

## 🧠 Flujo de Datos y Arquitectura

El núcleo técnico de este proyecto radica en la orquestación secuencial de dos servicios distintos, manejando la asincronía y previniendo bloqueos en la interfaz:

1. **Input & Validación:** Captura del evento de búsqueda y limpieza de UI.
2. **Geocodificación (`Fetch 1`):** Se consulta la API de búsqueda para extraer `latitud` y `longitud` basadas en el texto del usuario.
3. **Pronóstico (`Fetch 2`):** Se inyectan las coordenadas obtenidas en la segunda API para recibir el clima exacto de ese punto geográfico.
4. **Renderizado y Almacenamiento:** Inyección dinámica de HTML en el DOM y actualización simultánea del `localStorage`.

## 💻 Instalación y Uso

Este proyecto no requiere dependencias pesadas ni procesos de compilación (cero Node.js o Webpack). Es *plug-and-play*:

1. Clona este repositorio en tu máquina local:
   ```bash
   git clone [https://github.com/tu-usuario/weather-app.git](https://github.com/tu-usuario/weather-app.git)
