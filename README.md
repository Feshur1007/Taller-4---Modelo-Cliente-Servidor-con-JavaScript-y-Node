# Tienda de Libros

Aplicación con Node.js y Express que implementa un CRUD de libros. Incluye catálogo con búsqueda, modo oscuro y funcionamiento sin conexión (PWA).

## Requisitos

- Node.js 18 o superior
- npm 9 o superior

## Cómo correr el proyecto

```
npm install
npm run dev
```

Abrir `http://localhost:3000` en el navegador.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor con recarga automática + Tailwind en modo watch |
| `npm start` | Servidor en modo normal |
| `npm run build:css` | Genera el CSS una vez |

Si el puerto 3000 está ocupado, cambiar `PORT` en el archivo `.env`.

## Estructura de carpetas

```
src/
  server.js
  routes/items.js
  middlewares/errorHandler.js
  middlewares/validate.js
  data/items.json
  styles/input.css
public/
  index.html
  catalog.html
  offline.html
  manifest.webmanifest
  sw.js
  icons/
  css/styles.css (lo genera Tailwind, no se sube al repo)
  js/main.js
  js/catalog.js
  js/theme.js
  js/services/api.js
  js/ui/ui.js
docs/
```

## Tabla de la API

Base: `/api/items`

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/api/items` | Devuelve la lista completa |
| GET | `/api/items?q=texto` | Busca el texto en el nombre y en la descripción |
| GET | `/api/items?categoria=Novela` | Filtra por categoría (si nada coincide devuelve `[]`) |
| GET | `/api/items?sort=precio` | Ordena por precio de menor a mayor |
| GET | `/api/items?q=a&categoria=Novela&sort=precio` | Los tres filtros combinados |
| GET | `/api/items/:id` | Devuelve un libro, 404 si no existe |
| POST | `/api/items` | Crea un libro, 400 si los datos son inválidos |
| PUT | `/api/items/:id` | Actualiza un libro, 400 si los datos son inválidos |
| DELETE | `/api/items/:id` | Elimina un libro |

Las pruebas del CRUD se hacen en `http://localhost:3000/api/items`.

## Modelo de datos

Cada libro en `src/data/items.json` tiene:

| Campo | Tipo | Reglas |
|---|---|---|
| `id` | número | lo genera el servidor |
| `name` | texto | obligatorio |
| `description` | texto | opcional |
| `price` | número | obligatorio, mayor o igual a 0 |
| `category` | texto | obligatoria, lista cerrada |
| `cantidad` | número | obligatoria en el formulario, mayor o igual a 0 |
| `fecha` | texto | fecha en formato `AAAA-MM-DD` |

Valores permitidos de `category`: Novela, Infantil, Thriller, Ciencia Ficción, Desarrollo Personal, Historia.

## Diseño

- Paleta esmeralda propia con superficie y texto para modo claro y oscuro.
- Tipografía Lora de Google Fonts.
- Clases propias: `btn` con variantes, `card`, `input` y `badge` para la categoría.
- Botón Claro / Oscuro en la navegación que recuerda la preferencia.

## Sin conexión

La aplicación se puede instalar (PWA). Sin internet el catálogo muestra los últimos datos guardados con un aviso, y en gestión aparece el mensaje "No disponible sin conexión".

## Capturas

La carpeta `docs/` tiene las evidencias: manifest, service worker, app sin conexión y app instalada.
