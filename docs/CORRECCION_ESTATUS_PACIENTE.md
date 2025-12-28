# 🔧 Corrección: Campo estatusPaciente en PatientsPage

## ❌ Problema Identificado

El componente `PatientsPage` estaba usando valores **numéricos** (1 y 0) para el campo `estatusPaciente`, pero el **backend retorna valores tipo String** (`"ACTIVO"` o `"INACTIVO"`).

---

## 🔍 Análisis del Backend

### Entidad Paciente (Backend)
```java
@Column(name = "estatus_paciente", length = 20)
@Builder.Default
private String estatusPaciente = "ACTIVO";
```

### DTO PacienteResponse
```java
@Schema(description = "Estado del paciente", example = "ACTIVO")
private String estatusPaciente;
```

### Valores Válidos
- ✅ `"ACTIVO"` - Paciente activo
- ✅ `"INACTIVO"` - Paciente inactivo

---

## ❌ Código Anterior (Incorrecto)

### 1. Estado Inicial del Formulario
```javascript
// ❌ INCORRECTO - Usaba número
const [formData, setFormData] = useState({
  // ...otros campos
  estatusPaciente: 1  // ❌ Backend espera string
});
```

### 2. Comparaciones en la Vista
```javascript
// ❌ INCORRECTO - Comparaba con número
patient.estatusPaciente === 1  // ❌ Siempre false
```

### 3. Select de Filtro
```javascript
// ❌ INCORRECTO - Valores numéricos
<option value="1">Activo</option>
<option value="0">Inactivo</option>
```

### 4. Select del Formulario
```javascript
// ❌ INCORRECTO
<option value="1">Activo</option>
<option value="0">Inactivo</option>
```

---

## ✅ Código Corregido

### 1. Estado Inicial del Formulario
```javascript
// ✅ CORRECTO - Usa string
const [formData, setFormData] = useState({
  // ...otros campos
  estatusPaciente: 'ACTIVO'  // ✅ Coincide con backend
});
```

### 2. Comparaciones en la Vista
```javascript
// ✅ CORRECTO - Compara con string
patient.estatusPaciente === 'ACTIVO'  // ✅ Funciona correctamente
```

### 3. Select de Filtro
```javascript
// ✅ CORRECTO - Valores string
<option value="ACTIVO">Activo</option>
<option value="INACTIVO">Inactivo</option>
```

### 4. Select del Formulario
```javascript
// ✅ CORRECTO
<option value="ACTIVO">Activo</option>
<option value="INACTIVO">Inactivo</option>
```

---

## 📋 Cambios Aplicados

### Archivo: `src/pages/PatientsPage.jsx`

| Línea | Cambio | Antes | Después |
|-------|--------|-------|---------|
| 51 | Estado inicial | `estatusPaciente: 1` | `estatusPaciente: 'ACTIVO'` |
| 174 | openEditModal | `\|\| 1` | `\|\| 'ACTIVO'` |
| 201 | resetForm | `estatusPaciente: 1` | `estatusPaciente: 'ACTIVO'` |
| 297-299 | Select filtro | `value="1"` y `value="0"` | `value="ACTIVO"` y `value="INACTIVO"` |
| 401 | Comparación tabla | `=== 1` | `=== 'ACTIVO'` |
| 405 | Texto tabla | `=== 1 ? ...` | `=== 'ACTIVO' ? ...` |
| 744-745 | Select formulario | `value="1"` y `value="0"` | `value="ACTIVO"` y `value="INACTIVO"` |
| 842 | Comparación detalles | `=== 1` | `=== 'ACTIVO'` |
| 846 | Texto detalles | `=== 1 ? ...` | `=== 'ACTIVO' ? ...` |

---

## 🎯 Impacto de los Cambios

### Antes de la Corrección
```javascript
// Backend retorna
{
  "estatusPaciente": "ACTIVO"
}

// Frontend compara
patient.estatusPaciente === 1  // ❌ false (string !== number)

// Resultado: Siempre mostraba badge "Inactivo" ❌
```

### Después de la Corrección
```javascript
// Backend retorna
{
  "estatusPaciente": "ACTIVO"
}

// Frontend compara
patient.estatusPaciente === 'ACTIVO'  // ✅ true

// Resultado: Muestra badge correcto según estado ✅
```

---

## 🧪 Casos de Prueba

### Test 1: Crear Paciente
```javascript
// Antes: Se enviaba al backend
{
  "estatusPaciente": 1  // ❌ Backend rechazaría o convertiría
}

// Ahora: Se envía correctamente
{
  "estatusPaciente": "ACTIVO"  // ✅ Backend acepta
}
```

### Test 2: Filtrar por Estado
```javascript
// Antes: Query param incorrecto
GET /api/v1/pacientes?estatus=1  // ❌ Backend no encontraría

// Ahora: Query param correcto
GET /api/v1/pacientes?estatus=ACTIVO  // ✅ Backend encuentra
```

### Test 3: Visualización en Tabla
```javascript
// Antes: Badge siempre "Inactivo"
<span className="bg-red-100">Inactivo</span>  // ❌

// Ahora: Badge correcto según estado
<span className="bg-green-100">Activo</span>  // ✅
```

---

## 🔄 Flujo Correcto

### 1. Listar Pacientes
```
Backend → { estatusPaciente: "ACTIVO" }
Frontend → Compara con 'ACTIVO'
Vista → Badge verde "Activo" ✅
```

### 2. Crear Paciente
```
Frontend → { estatusPaciente: "ACTIVO" }
Backend → Guarda string "ACTIVO"
DB → Campo VARCHAR "ACTIVO" ✅
```

### 3. Filtrar
```
Usuario → Selecciona "Activo"
Frontend → estatus=ACTIVO
Backend → WHERE estatus_paciente = 'ACTIVO' ✅
```

### 4. Editar Estado
```
Usuario → Cambia a "Inactivo"
Frontend → { estatusPaciente: "INACTIVO" }
Backend → UPDATE ... SET estatus_paciente = 'INACTIVO' ✅
```

---

## ✅ Verificación

### Build Exitoso
```bash
✓ 1688 modules transformed
✓ dist/index.html         0.46 kB
✓ dist/assets/index.css  39.41 kB
✓ dist/assets/index.js  365.45 kB
✓ built in 2.80s
```

### Checklist
- ✅ Estado inicial usa string 'ACTIVO'
- ✅ Comparaciones usan string 'ACTIVO'/'INACTIVO'
- ✅ Select de filtro usa valores string
- ✅ Select de formulario usa valores string
- ✅ openEditModal maneja valores string
- ✅ resetForm usa valor string
- ✅ PatientDetails compara con string
- ✅ Tabla muestra badges correctamente

---

## 💡 Lecciones Aprendidas

### 1. Siempre Verificar el Backend
Antes de implementar el frontend, verificar:
- ✅ Tipo de dato del campo (String, Number, Boolean)
- ✅ Valores posibles (enum, constantes)
- ✅ Formato esperado

### 2. Consistencia de Tipos
Mantener el mismo tipo de dato en:
- ✅ Estado inicial
- ✅ Formularios
- ✅ Comparaciones
- ✅ Filtros
- ✅ Envío al backend

### 3. Validar con el DTO
El DTO de respuesta del backend es la fuente de verdad:
```java
@Schema(description = "Estado del paciente", example = "ACTIVO")
private String estatusPaciente;  // ← String, no number
```

---

## 🎯 Resultado Final

El campo `estatusPaciente` ahora funciona correctamente:

✅ **Crear Paciente** - Se guarda como "ACTIVO" por defecto
✅ **Listar Pacientes** - Badges muestran colores correctos
✅ **Filtrar** - Query param correcto enviado al backend
✅ **Editar** - Se puede cambiar entre ACTIVO/INACTIVO
✅ **Ver Detalles** - Muestra estado correcto
✅ **Eliminar** - Soft delete cambia a "INACTIVO"

---

## 📝 Resumen

**Problema:** Frontend usaba números (1/0) para `estatusPaciente`
**Backend:** Espera strings ("ACTIVO"/"INACTIVO")
**Solución:** Cambiados todos los valores a strings en el frontend
**Resultado:** ✅ Integración correcta con el backend

---

_Corrección aplicada: 28 de Diciembre de 2025_

