# 🔧 Solución: Error "Network error. Please check your connection"

## ✅ CAMBIOS IMPLEMENTADOS

He realizado varias mejoras para solucionar el error de red al hacer login:

### 1. **Cliente API Separado para Autenticación**

**Problema Original**: 
- El frontend intentaba llamar a: `http://localhost:8080/api/v1/auth/login`
- Pero el backend de autenticación probablemente usa: `http://localhost:8080/auth/login`

**Solución**:
- Creado `authApiClient` que usa solo `BASE_URL` sin `/api/v1`
- El `apiClient` normal sigue usando `/api/v1` para los demás endpoints

**Archivos Modificados**:
- `src/services/api.js` - Agregado `authApiClient`
- `src/services/authService.js` - Usa `authApiClient` en lugar de `apiClient`

### 2. **Logging Detallado para Diagnóstico**

**Agregado**:
- Console.log de cada request (método, URL completa, baseURL)
- Console.log de cada response exitosa
- Console.error detallado de errores con contexto
- Información sobre si no se recibe respuesta del servidor

**Beneficio**: Ahora puedes ver exactamente qué URL se está llamando y por qué falla.

### 3. **Mensajes de Error Mejorados**

**Antes**:
```
"Network error. Please check your connection."
```

**Ahora**:
```
"Cannot connect to server at http://localhost:8080. Please ensure the backend is running on http://localhost:8080"
```

---

## 🧪 CÓMO PROBAR

### Paso 1: Verificar que el Backend está Corriendo

Antes de intentar login, verifica que el backend esté activo:

```bash
# En Windows PowerShell o CMD
curl http://localhost:8080/actuator/health

# O en el navegador, abre:
http://localhost:8080/swagger-ui.html
```

**Resultado Esperado**: 
- Deberías ver una respuesta JSON o la página de Swagger
- Si no conecta, el backend NO está corriendo

### Paso 2: Reiniciar el Frontend

```bash
cd "C:\Users\Javier Costa\Documents\UNIR\CLASES\TFM\test-react-tfm"

# Detener si está corriendo (Ctrl+C)

# Reiniciar
npm run dev
```

### Paso 3: Intentar Login con DevTools Abierto

1. **Abrir** el navegador en `http://localhost:5173`
2. **Presionar** `F12` para abrir DevTools
3. **Ir** a la pestaña **Console**
4. **Intentar** hacer login con:
   - Usuario: `admin`
   - Contraseña: `admin123`

### Paso 4: Ver los Logs en Consola

Ahora verás logs detallados como:

```
Auth API Request: {
  method: "post",
  url: "/auth/login",
  baseURL: "http://localhost:8080",
  fullURL: "http://localhost:8080/auth/login"
}
```

Y si funciona:
```
Auth API Response: 200 {token: "...", user: {...}}
Login response: {token: "...", user: {...}}
```

O si falla:
```
Auth API Error: Error: Network Error
Auth no response received: {
  url: "/auth/login",
  baseURL: "http://localhost:8080"
}
```

---

## 🔍 DIAGNÓSTICO DE ERRORES

### Error 1: "Cannot connect to server at http://localhost:8080"

**Causa**: El backend NO está corriendo

**Solución**:
```bash
cd "C:\Users\Javier Costa\Documents\UNIR\CLASES\DWFS\codigo\backend\rntn08122025"

# Ejecutar el backend (Maven)
mvnw spring-boot:run

# O si tienes un script
run.bat
```

### Error 2: "CORS Error" o "Access-Control-Allow-Origin"

**Causa**: El backend no permite peticiones desde `http://localhost:5173`

**Solución Backend**: Agregar configuración CORS en el backend:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                    .allowedOrigins("http://localhost:5173")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Error 3: "404 Not Found" en /auth/login

**Causa**: El endpoint de auth usa una URL diferente

**Soluciones Posibles**:

**Opción A**: El endpoint SÍ usa `/api/v1`
```javascript
// En src/services/authService.js, cambiar:
import apiClient from './api';  // En lugar de authApiClient

export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password,
    });
    return response.data;
  },
};
```

**Opción B**: El endpoint usa otra ruta (ej: `/api/auth/login`)
```javascript
// En src/config/api.config.js
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',  // Cambiar según tu backend
    // ...
  },
};
```

### Error 4: "401 Unauthorized" o "403 Forbidden"

**Causa**: Credenciales incorrectas o el endpoint requiere configuración especial

**Verificar**:
1. Usuario y contraseña son correctos
2. El backend tiene usuarios de prueba configurados
3. El endpoint de login NO requiere token JWT (debe ser público)

---

## 📊 ENDPOINTS ACTUALES

### Con authApiClient (SIN /api/v1):
```
POST http://localhost:8080/auth/login
POST http://localhost:8080/auth/logout
```

### Con apiClient (CON /api/v1):
```
POST http://localhost:8080/api/v1/sentiment/predict
GET  http://localhost:8080/api/v1/pacientes
POST http://localhost:8080/api/v1/consultas
... (todos los demás)
```

---

## 🎯 SIGUIENTE PASO RECOMENDADO

### 1. Verificar URL Exacta del Backend

Abre el Swagger del backend:
```
http://localhost:8080/swagger-ui.html
```

Busca el endpoint de login y copia la URL exacta que aparece.

### 2. Ajustar la Configuración si es Necesario

Si la URL es diferente, modifica:

**src/config/api.config.js**:
```javascript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/la-url-correcta-aqui',  // Según Swagger
  },
};
```

### 3. Verificar en DevTools Network Tab

1. Abre DevTools → Pestaña **Network**
2. Intenta hacer login
3. Busca la petición a `/auth/login`
4. Verifica:
   - ✅ Request URL
   - ✅ Request Method (POST)
   - ✅ Status Code
   - ✅ Request Payload
   - ✅ Response

---

## 🔄 ALTERNATIVA: Prueba Manual con curl

```bash
# Prueba 1: Sin /api/v1
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

# Prueba 2: Con /api/v1
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"

# En Windows PowerShell:
Invoke-RestMethod -Uri "http://localhost:8080/auth/login" -Method Post -ContentType "application/json" -Body '{"username":"admin","password":"admin123"}'
```

La que funcione, esa es la URL correcta que debes usar.

---

## ✅ RESUMEN DE CAMBIOS

| Archivo | Cambio |
|---------|--------|
| `src/services/api.js` | ✅ Agregado `authApiClient` sin `/api/v1` |
| `src/services/api.js` | ✅ Logging detallado de requests y responses |
| `src/services/api.js` | ✅ Mensajes de error mejorados |
| `src/services/authService.js` | ✅ Usa `authApiClient` para login |
| `src/config/api.config.js` | ✅ Exportado `API_BASE_URL` |

---

## 🆘 SOPORTE

Si después de estos cambios sigue sin funcionar:

1. **Copia los logs** de la consola del navegador (DevTools → Console)
2. **Copia el error** de la pestaña Network
3. **Verifica** que el backend esté corriendo:
   ```bash
   curl http://localhost:8080/actuator/health
   ```

Con esa información se puede diagnosticar el problema exacto.

---

**Estado**: ✅ Implementado  
**Próximo Paso**: Reiniciar frontend y probar login con DevTools abierto  
**Fecha**: 27 de Diciembre, 2025

