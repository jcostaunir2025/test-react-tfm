# 🧪 Guía de Prueba del Menú Interactivo

## 🚀 Inicio Rápido

### 1. Iniciar el servidor de desarrollo
```powershell
npm run dev
```

### 2. Abrir en el navegador
```
http://localhost:5173
```

### 3. Iniciar sesión
Usa las credenciales según el rol que quieras probar.

---

## 📋 Checklist de Pruebas

### ✅ Header

**Pruebas Básicas**:
- [ ] El logo se muestra correctamente
- [ ] El nombre del usuario aparece
- [ ] El rol del usuario se muestra
- [ ] El avatar muestra la inicial correcta

**Menú de Usuario**:
- [ ] Click en avatar abre el dropdown
- [ ] Se muestra el nombre y email
- [ ] "Mi Perfil" lleva a /settings
- [ ] "Configuración" lleva a /settings
- [ ] "Cerrar Sesión" cierra sesión y redirige a /login
- [ ] Click fuera del dropdown lo cierra

**Notificaciones**:
- [ ] Icono de campana visible
- [ ] Badge (3) se muestra con punto rojo pulsante
- [ ] Click abre el panel de notificaciones
- [ ] Se muestran 3 notificaciones de ejemplo
- [ ] Cada notificación tiene mensaje y tiempo
- [ ] Click fuera del panel lo cierra

**Responsive (Móvil)**:
- [ ] Botón hamburguesa (☰) aparece en pantallas < 1024px
- [ ] Click en hamburguesa abre el sidebar
- [ ] Avatar y nombre visibles en todas las resoluciones

---

### ✅ Sidebar

**Estructura**:
- [ ] Tarjeta de usuario en la parte superior
- [ ] Avatar con inicial
- [ ] Nombre del usuario
- [ ] Rol del usuario
- [ ] Indicador verde de sesión activa (🟢)

**Secciones Colapsables**:
- [ ] "PRINCIPAL" se muestra expandida por defecto
- [ ] "GESTIÓN CLÍNICA" se muestra expandida por defecto
- [ ] "ANÁLISIS Y REPORTES" se muestra expandida por defecto
- [ ] "ADMINISTRACIÓN" se muestra expandida por defecto
- [ ] Click en header de sección colapsa/expande
- [ ] Chevron (▼/▶) rota suavemente

**Elementos del Menú**:
- [ ] Dashboard tiene ícono 📊
- [ ] Pacientes tiene ícono 👥
- [ ] Consultas tiene ícono 📅
- [ ] Evaluaciones tiene ícono 📋
- [ ] Alto Riesgo tiene ícono ⚠️ y badge [!]
- [ ] Análisis tiene ícono 🧠 y badge [IA]
- [ ] Reportes tiene ícono 📄
- [ ] Usuarios tiene ícono 👤 (solo ADMIN)
- [ ] Configuración tiene ícono ⚙️

**Navegación**:
- [ ] Click en opción navega a la ruta correcta
- [ ] Elemento activo tiene fondo primary-50
- [ ] Elemento activo tiene borde primary-100
- [ ] Elemento activo tiene punto animado (●)
- [ ] Hover en elemento muestra bg-gray-50 y sombra

**Footer**:
- [ ] Muestra "🛡️ Sesión segura" en la parte inferior

**Responsive (Móvil)**:
- [ ] Sidebar se oculta por defecto en < 1024px
- [ ] Se muestra al hacer click en hamburguesa
- [ ] Overlay oscuro cubre el contenido
- [ ] Click en overlay cierra el sidebar
- [ ] Animación de deslizamiento suave desde la izquierda

---

### ✅ Dashboard

**Estadísticas**:
- [ ] 4 tarjetas de estadísticas visibles
- [ ] Total Pacientes (150) con ícono 👥
- [ ] Consultas Activas (45) con ícono 📅
- [ ] Evaluaciones (320) con ícono 📋
- [ ] Alto Riesgo (12) con ícono ⚠️
- [ ] Cada tarjeta tiene color distintivo

**Acceso Rápido**:
- [ ] Título "Acceso Rápido" visible
- [ ] Grid de 2-4 columnas según resolución
- [ ] 8 tarjetas con gradientes de colores
- [ ] Nuevo Paciente (azul)
- [ ] Nueva Consulta (verde)
- [ ] Nueva Evaluación (púrpura)
- [ ] Análisis IA (rosa)
- [ ] Alto Riesgo (rojo)
- [ ] Generar Reporte (índigo)
- [ ] Gestión Usuarios (gris) - solo ADMIN
- [ ] Estadísticas (naranja)

**Interacción con Acceso Rápido**:
- [ ] Hover aumenta escala a 1.05
- [ ] Hover aumenta sombra
- [ ] Ícono crece en hover
- [ ] Click navega a la ruta correcta
- [ ] Transiciones suaves (300ms)

**Alertas de Alto Riesgo**:
- [ ] Se muestran si hay datos
- [ ] Fondo danger-50
- [ ] Ícono de alerta ⚠️
- [ ] Badge "Alto Riesgo"

**Secciones Adicionales**:
- [ ] Actividad Reciente visible
- [ ] Estadísticas Rápidas con barras de progreso
- [ ] Grid responsive de 2 columnas en desktop

---

### ✅ Permisos por Rol

#### ADMIN (Acceso completo)
- [ ] Ve todas las opciones del sidebar
- [ ] Ve "Usuarios" en el sidebar
- [ ] Ve "Gestión Usuarios" en acceso rápido
- [ ] Puede acceder a todas las rutas

#### DOCTOR
- [ ] Ve Dashboard, Pacientes, Consultas, Evaluaciones
- [ ] Ve Alto Riesgo, Análisis IA, Reportes
- [ ] Ve Configuración
- [ ] NO ve "Usuarios"
- [ ] NO ve "Gestión Usuarios" en acceso rápido

#### ENFERMERO
- [ ] Ve Dashboard, Pacientes, Consultas, Evaluaciones
- [ ] Ve Alto Riesgo
- [ ] NO ve Análisis IA
- [ ] NO ve Reportes
- [ ] NO ve Configuración
- [ ] NO ve Usuarios

#### ANALISTA
- [ ] Ve Dashboard
- [ ] Ve Evaluaciones
- [ ] Ve Análisis IA
- [ ] Ve Reportes
- [ ] NO ve Pacientes
- [ ] NO ve Consultas
- [ ] NO ve Alto Riesgo
- [ ] NO ve Configuración
- [ ] NO ve Usuarios

#### RECEPCIONISTA
- [ ] NO ve Dashboard (redirige a /patients)
- [ ] Ve SOLO Pacientes
- [ ] NO ve ninguna otra opción
- [ ] Solo ve "Nuevo Paciente" en acceso rápido

#### AUDITOR
- [ ] Ve Dashboard
- [ ] Ve Reportes
- [ ] NO ve ninguna otra opción clínica
- [ ] Solo ve "Generar Reporte" y "Estadísticas" en acceso rápido

---

## 🎨 Pruebas Visuales

### Colores y Estilos
- [ ] Gradientes se muestran correctamente
- [ ] Colores primary (#5B8DBE o similar)
- [ ] Sombras suaves y profesionales
- [ ] Bordes redondeados consistentes
- [ ] Tipografía legible

### Animaciones
- [ ] Punto activo pulsa suavemente (●)
- [ ] Chevrones rotan al expandir/colapsar
- [ ] Hover en tarjetas es suave (200-300ms)
- [ ] Transiciones no son bruscas
- [ ] Badge de notificaciones pulsa

### Iconos
- [ ] Todos los iconos de Lucide se cargan
- [ ] Tamaño consistente (h-5 w-5)
- [ ] Colores apropiados según contexto

---

## 📱 Pruebas Responsive

### Desktop (> 1024px)
- [ ] Sidebar siempre visible
- [ ] Acceso rápido en 4 columnas
- [ ] Estadísticas en 4 columnas
- [ ] Layout completo visible sin scroll horizontal

### Tablet (640px - 1023px)
- [ ] Sidebar colapsable
- [ ] Acceso rápido en 3 columnas
- [ ] Estadísticas en 2 columnas
- [ ] Botón hamburguesa visible

### Mobile (< 640px)
- [ ] Sidebar deslizable desde izquierda
- [ ] Acceso rápido en 2 columnas
- [ ] Estadísticas en 2 columnas (1 en muy pequeño)
- [ ] Menú de usuario simplificado
- [ ] Overlay funciona correctamente

---

## 🐛 Pruebas de Errores

### Navegación
- [ ] URL manual funciona (ej: /patients)
- [ ] Ruta no existente redirige a /
- [ ] Protección de rutas funciona (sin permisos → redirect)
- [ ] Botón atrás del navegador funciona

### Estado
- [ ] Refresh mantiene sesión (localStorage)
- [ ] Logout limpia estado correctamente
- [ ] Cambio de usuario actualiza permisos

### Interacción
- [ ] Múltiples clicks rápidos no rompen nada
- [ ] Dropdowns no se solapan
- [ ] Scroll funciona en sidebar largo
- [ ] No hay flickering en animaciones

---

## 🎯 Casos de Prueba Específicos

### Caso 1: Navegación Completa
1. Iniciar sesión como ADMIN
2. Click en cada opción del sidebar
3. Verificar que navega correctamente
4. Verificar que el elemento activo se marca
5. Verificar que el punto animado aparece

### Caso 2: Cambio de Rol
1. Iniciar sesión como ADMIN
2. Anotar opciones visibles
3. Cerrar sesión
4. Iniciar sesión como ENFERMERO
5. Verificar que opciones son diferentes
6. Verificar que opciones no permitidas no aparecen

### Caso 3: Acceso Rápido
1. Iniciar sesión como DOCTOR
2. En Dashboard, verificar acceso rápido
3. Click en cada tarjeta
4. Verificar navegación correcta
5. Verificar hover effects

### Caso 4: Responsive
1. Abrir en desktop (1920x1080)
2. Verificar layout completo
3. Reducir a tablet (768px)
4. Verificar cambios de layout
5. Reducir a móvil (375px)
6. Verificar sidebar colapsable
7. Probar overlay

### Caso 5: Notificaciones
1. Click en campana
2. Verificar dropdown abre
3. Click en notificación
4. Verificar acción (si aplica)
5. Click fuera
6. Verificar cierre

### Caso 6: Menú de Usuario
1. Click en avatar
2. Verificar dropdown abre
3. Click en "Mi Perfil"
4. Verificar navegación a /settings
5. Volver
6. Click en "Cerrar Sesión"
7. Verificar redirect a /login
8. Verificar localStorage limpio

---

## 📊 Resultados Esperados

### Performance
- [ ] Carga inicial < 2 segundos
- [ ] Navegación instantánea (<100ms)
- [ ] Animaciones fluidas (60fps)
- [ ] Sin lag en hover

### Accesibilidad
- [ ] Tooltips descriptivos
- [ ] Contraste adecuado (WCAG AA)
- [ ] Focus visible en elementos
- [ ] Elementos clicables claramente identificables

### UX
- [ ] Navegación intuitiva
- [ ] Feedback visual inmediato
- [ ] Mensajes claros
- [ ] Estado siempre visible

---

## 🔧 Resolución de Problemas

### Problema: Sidebar no se muestra
**Solución**: Verificar que el usuario tiene al menos un rol válido

### Problema: Opciones no filtradas correctamente
**Solución**: Verificar roles en authStore y arrays de roles en cada opción

### Problema: Animaciones bruscas
**Solución**: Verificar clases de transición (duration-200, duration-300)

### Problema: Dropdowns no cierran
**Solución**: Verificar useEffect de handleClickOutside en Header

### Problema: Responsive no funciona
**Solución**: Verificar breakpoints de Tailwind (sm:, md:, lg:)

---

## ✅ Criterios de Aceptación

Para considerar el menú completamente funcional:

1. ✅ Todos los elementos visuales se muestran correctamente
2. ✅ Navegación funciona en todas las rutas
3. ✅ Permisos filtran correctamente por rol
4. ✅ Responsive funciona en mobile, tablet y desktop
5. ✅ Animaciones son suaves y profesionales
6. ✅ Dropdowns abren y cierran correctamente
7. ✅ Estado activo se marca correctamente
8. ✅ Hover effects funcionan
9. ✅ No hay errores en consola
10. ✅ Performance es aceptable

---

## 📝 Reportar Bugs

Si encuentras un problema:

1. **Reproducir** el bug consistentemente
2. **Anotar** los pasos para reproducir
3. **Capturar** screenshot si es visual
4. **Verificar** consola del navegador
5. **Reportar** con toda la información

### Template de Reporte:
```
🐛 Bug: [Título breve]

Pasos para reproducir:
1. ...
2. ...
3. ...

Resultado esperado:
...

Resultado actual:
...

Rol del usuario:
...

Navegador:
...

Resolución:
...

Errores en consola:
...
```

---

## 🎉 Checklist Final

Antes de dar por completado:

- [ ] Todas las pruebas básicas pasan
- [ ] Todas las pruebas de permisos pasan
- [ ] Todas las pruebas responsive pasan
- [ ] No hay errores en consola
- [ ] Performance es aceptable
- [ ] UX es fluida e intuitiva
- [ ] Documentación está completa
- [ ] Código está comentado donde necesario

**¡Si todas estas pruebas pasan, el menú interactivo está 100% funcional! 🚀**

---

## 📞 Soporte

Para dudas o problemas:
1. Revisar documentación en `MENU_INTERACTIVO.md`
2. Revisar vista visual en `VISTA_VISUAL_MENU.md`
3. Verificar código en los componentes
4. Consultar con el equipo de desarrollo

**Fecha de creación**: 2025-12-27
**Versión**: 1.0.0

