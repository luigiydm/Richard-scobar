# Richard Scobar - Tattoo Artist Portfolio

Sitio web profesional para el tatuador Richard Scobar, especialista en geometría sagrada, neotribal y blackwork.

## 🎨 Características

- **Diseño Responsive**: Optimizado para desktop, tablet y móvil
- **Galería Interactiva**: Filtrado por ubicación corporal (brazo, pierna, espalda)
- **Simbolismo Japonés**: Página dedicada a patrones tradicionales
- **Lightbox Moderno**: Navegación fluida entre imágenes
- **SEO Optimizado**: Meta tags y structured data

## 📁 Estructura del Proyecto

```
Web-Richard/
├── index.html              # Página principal
├── galeria.html            # Galería completa con filtros
├── simbolismo.html         # Patrones japoneses
├── sobre-mi.html           # Información del artista
├── contacto.html           # Información de contacto
├── css/
│   ├── style.css           # Estilos principales
│   ├── vendor.css          # Librerías externas
│   └── bootstrap.min.css   # Framework CSS
├── js/
│   ├── script.js           # JavaScript principal
│   ├── jquery-1.11.0.min.js
│   └── plugins.js          # Librerías adicionales
├── images/
│   ├── gallery-optimized/  # Galería de tatuajes
│   ├── background/         # Imágenes de fondo
│   └── thumbs/             # Miniaturas
└── gallery_data.js         # Datos de la galería
```

## 🌐 Páginas del Sitio

### **Inicio (index.html)**
- Hero section con presentación
- Vista previa de trabajos destacados
- Navegación principal

### **Galería (galeria.html)**
- Filtros por ubicación corporal
- Lightbox para ver imágenes en detalle
- Grid responsivo

### **Simbolismo (simbolismo.html)**
- 6 patrones japoneses tradicionales:
  - **Asanoha**: Hojas de cáñamo (protección)
  - **Sayagata**: Conexión divina
  - **Seigaiha**: Olas del mar (tranquilidad)
  - **Kikko**: Caparazón de tortuga (longevidad)
  - **Bishamon Kikko**: Armadura protectora
  - **Shippo**: Siete tesoros sagrados

### **Sobre Mí (sobre-mi.html)**
- Biografía del artista
- Experiencia y especialidades

### **Contacto (contacto.html)**
- Información de contacto
- Enlaces a redes sociales

## ⚙️ JavaScript Principal

### **Funcionalidades en script.js:**
- **Navegación responsiva**: Menú hamburguesa en móvil
- **Galería con filtros**: Sistema de categorías por ubicación
- **Lightbox**: Vista detallada de imágenes con navegación
- **Scroll suave**: Transiciones entre secciones
- **Efectos visuales**: Animaciones y transiciones

### **Galería Interactiva:**
```javascript
// Filtrado por categorías
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        showFilteredImages(filter);
    });
});
```

## 🎯 Información del Artista

- **Nombre**: Richard Scobar
- **Especialidades**: Geometría sagrada, Neotribal, Blackwork
- **Experiencia**: 20+ años
- **Ubicación**: Buenos Aires, Argentina
- **Instagram**: [@richard.scobar](https://www.instagram.com/richard.scobar/)

## 🚀 Cómo Usar

1. Abrir `index.html` en el navegador
2. Navegar entre las diferentes secciones
3. Usar la galería para ver trabajos por categoría
4. Explorar los simbolismos en la sección dedicada

## 📱 Responsive Design

- **Desktop**: Layout completo con sidebar
- **Tablet**: Grid adaptativo
- **Móvil**: Menú hamburguesa y stack vertical

## 🔧 Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Grid, Flexbox, Media Queries
- **JavaScript**: ES6, DOM manipulation
- **jQuery**: Efectos y animaciones
- **Bootstrap**: Grid system

---

*Sitio web desarrollado para Richard Scobar Tattoo Artist*