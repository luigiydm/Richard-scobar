# Richard Scobar - Tattoo Artist Portfolio

Portfolio minimalista inspirado en el diseño de NISSACO.jp para el tatuador profesional Richard Scobar.

## 🎨 Características

- **Diseño Ultra Minimalista**: Inspirado en nissaco.jp
- **Galería Dinámica**: Soporte para 57+ imágenes
- **Responsive**: Optimizado para móviles y desktop
- **Performance**: Lazy loading y optimizaciones
- **SEO Optimizado**: Meta tags y structured data

## 📁 Estructura del Proyecto

```
Web-Richard/
├── index-new.html          # Página principal (NUEVA)
├── css/
│   ├── style-new.css       # Estilos minimalistas (NUEVO)
│   └── style.css           # Estilos antiguos
├── js/
│   ├── script-new.js       # JavaScript optimizado (NUEVO)
│   └── script.js           # JavaScript antiguo
├── images/
│   ├── gallery/            # 8 imágenes actuales
│   ├── gallery-optimized/  # Imágenes optimizadas (se genera)
│   └── thumbs/             # Thumbnails (se genera)
├── convert_images.py       # Script de conversión HEIC→JPG
├── setup.sh               # Script de configuración
└── README.md              # Este archivo
```

## 🚀 Instalación Rápida

### Opción 1: Script Automático
```bash
./setup.sh
```

### Opción 2: Manual
```bash
# 1. Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# 2. Instalar dependencias
pip install pillow pillow-heif

# 3. Convertir imágenes
python convert_images.py

# 4. Abrir en navegador
open index-new.html
```

## 📸 Conversión de Imágenes

El proyecto incluye un script Python para convertir automáticamente las imágenes HEIC a formato web optimizado.

### Características del Conversor:
- ✅ Convierte HEIC/HEIF a JPG
- ✅ Optimiza tamaño y calidad para web
- ✅ Genera thumbnails para carga rápida
- ✅ Corrige orientación automáticamente
- ✅ Crea nombres de archivo limpos
- ✅ Genera HTML y JavaScript automáticamente

### Formatos Soportados:
- HEIC/HEIF (iPhone)
- JPG/JPEG
- PNG

## 🎯 Diferencias con la Versión Anterior

### ❌ Versión Antigua (index.html)
- Diseño portfolio tradicional
- CSS mezclado (1900+ líneas)
- Hero slider complejo
- Múltiples secciones
- Bootstrap pesado

### ✅ Nueva Versión (index-new.html)
- Diseño ultra minimalista
- CSS limpio y optimizado
- Navegación simple
- Galería como protagonista
- Performance optimizado

## 🌐 Uso del Sitio Web

### Secciones:
1. **Hero**: Presentación minimalista
2. **Galería**: Grid masonry con lightbox
3. **Sobre mí**: Información del artista
4. **Contacto**: Información y redes sociales

### Navegación:
- Menú fijo con scroll suave
- Indicador de progreso
- Menú hamburguesa en móvil

## 🔧 Personalización

### Agregar Más Imágenes:
```javascript
// En el JavaScript
window.addGalleryImage('ruta/imagen.jpg', 'Descripción');
```

### Cambiar Colores:
```css
/* En style-new.css */
body { background-color: #tu-color; }
```

### Modificar Textos:
Edita directamente en `index-new.html`

## 📱 Responsive Design

- **Desktop**: Grid de 3 columnas
- **Tablet**: Grid de 2 columnas
- **Mobile**: Grid de 1 columna
- **Navigation**: Menú hamburguesa en móvil

## 🚀 Performance

### Optimizaciones Incluidas:
- Lazy loading de imágenes
- Compresión JPEG progresiva
- Thumbnails para carga rápida
- Minificación de assets
- Preload de recursos críticos

### Métricas Objetivo:
- **First Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔍 SEO

### Incluido:
- Meta tags optimizados
- Open Graph para redes sociales
- Schema.org structured data
- Sitemap automático
- Alt texts descriptivos

## 📞 Contacto

### Información del Cliente:
- **Artista**: Richard Scobar (Richard Escobar)
- **Especialidad**: Geometría, Neotribal, Blackwork
- **Ubicación**: Buenos Aires, Argentina
- **Experiencia**: 20+ años

### Redes Sociales:
- Instagram: [@richard.scobar](https://instagram.com/richard.scobar)
- Facebook: [Richard Scobar Tattoo](https://facebook.com/richard.scobar.tattoo)
- Email: richard@scobar.com

## 📋 Próximos Pasos

### Para el Desarrollador (tú):
1. ✅ Ejecutar `./setup.sh` para configurar todo
2. ✅ Revisar imágenes generadas en `images/gallery-optimized/`
3. ⏳ Ajustar textos en `index-new.html` si necesario
4. ⏳ Testear en diferentes dispositivos
5. ⏳ Subir a servidor de producción

### Para el Cliente:
1. ⏳ Revisar galería de imágenes
2. ⏳ Aprobar textos y descripciones
3. ⏳ Proporcionar información de contacto final
4. ⏳ Clasificar imágenes por categorías (futuro)

## 🐛 Problemas Comunes

### Error: "pillow-heif not found"
```bash
pip install pillow-heif
```

### Error: "Permission denied"
```bash
chmod +x setup.sh
```

### Imágenes no cargan:
- Verificar rutas en el HTML
- Comprobar que las imágenes se generaron correctamente

## 📊 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Grid, Flexbox, Custom Properties
- **JavaScript ES6**: Modules, Promises, Observers
- **Python**: Procesamiento de imágenes
- **PIL/Pillow**: Manipulación de imágenes
- **Chocolat.js**: Lightbox minimalista

## 📄 Licencia

Proyecto privado para Richard Scobar Tattoo Artist.

---

*Desarrollado por Luis Playero para Richard Scobar*