/**
 * 🧪 Test Manual de Lógica de Roles
 *
 * Ejecuta este archivo en la consola del navegador para probar la lógica de roles
 */

console.log('🧪 Iniciando pruebas de lógica de roles...\n');

// Simular diferentes usuarios
const testUsers = [
  {
    name: 'Admin Principal',
    roles: ['ADMIN'],
    expected: {
      adminRoute: true,
      doctorRoute: true,  // Solo si ADMIN está en la lista
      nurseRoute: false,  // Si no está en la lista
    }
  },
  {
    name: 'Doctor Juan',
    roles: ['DOCTOR'],
    expected: {
      adminRoute: false,
      doctorRoute: true,
      nurseRoute: false,
    }
  },
  {
    name: 'Doctor Supervisor',
    roles: ['DOCTOR', 'ANALISTA'],
    expected: {
      adminRoute: false,
      doctorRoute: true,
      nurseRoute: false,
      analistaRoute: true,
    }
  },
  {
    name: 'Enfermero Pedro',
    roles: ['ENFERMERO'],
    expected: {
      adminRoute: false,
      doctorRoute: false,
      nurseRoute: true,
    }
  },
  {
    name: 'Recepcionista Ana',
    roles: ['RECEPCIONISTA'],
    expected: {
      adminRoute: false,
      doctorRoute: false,
      nurseRoute: false,
      analistaRoute: false,
    }
  }
];

// Simular rutas protegidas
const protectedRoutes = [
  {
    name: 'User Management',
    requiredRoles: ['ADMIN'],
    route: 'adminRoute'
  },
  {
    name: 'Patient Management',
    requiredRoles: ['ADMIN', 'DOCTOR', 'ENFERMERO'],
    route: 'doctorRoute'
  },
  {
    name: 'Nursing Station',
    requiredRoles: ['ENFERMERO'],
    route: 'nurseRoute'
  },
  {
    name: 'Analytics Dashboard',
    requiredRoles: ['ADMIN', 'ANALISTA'],
    route: 'analistaRoute'
  }
];

// Función hasAnyRole simulada
const hasAnyRole = (userRoles, requiredRoles) => {
  if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) return false;
  return requiredRoles.some(requiredRole =>
    userRoles.some(userRole =>
      userRole.toUpperCase() === requiredRole.toUpperCase()
    )
  );
};

// Ejecutar pruebas
console.log('═'.repeat(80));
console.log('📋 MATRIZ DE ACCESO POR USUARIO Y RUTA');
console.log('═'.repeat(80));

testUsers.forEach(user => {
  console.log(`\n👤 Usuario: ${user.name}`);
  console.log(`   Roles: [${user.roles.join(', ')}]`);
  console.log('   ' + '─'.repeat(70));

  protectedRoutes.forEach(route => {
    const hasAccess = hasAnyRole(user.roles, route.requiredRoles);
    const icon = hasAccess ? '✅' : '❌';
    const status = hasAccess ? 'PERMITIDO' : 'DENEGADO';

    console.log(`   ${icon} ${route.name.padEnd(25)} | Requiere: [${route.requiredRoles.join(', ')}]`);
    console.log(`      └─ Acceso: ${status}`);
  });
});

// Casos de prueba específicos
console.log('\n\n' + '═'.repeat(80));
console.log('🔬 CASOS DE PRUEBA ESPECÍFICOS');
console.log('═'.repeat(80));

const specificTests = [
  {
    description: 'Usuario DOCTOR accede a ruta [ADMIN, DOCTOR]',
    userRoles: ['DOCTOR'],
    requiredRoles: ['ADMIN', 'DOCTOR'],
    expectedResult: true
  },
  {
    description: 'Usuario ENFERMERO accede a ruta [ADMIN, DOCTOR]',
    userRoles: ['ENFERMERO'],
    requiredRoles: ['ADMIN', 'DOCTOR'],
    expectedResult: false
  },
  {
    description: 'Usuario [DOCTOR, ANALISTA] accede a ruta [ANALISTA]',
    userRoles: ['DOCTOR', 'ANALISTA'],
    requiredRoles: ['ANALISTA'],
    expectedResult: true
  },
  {
    description: 'Usuario [ADMIN] accede a ruta [ADMIN]',
    userRoles: ['ADMIN'],
    requiredRoles: ['ADMIN'],
    expectedResult: true
  },
  {
    description: 'Usuario [RECEPCIONISTA] accede a ruta [ADMIN, DOCTOR, ENFERMERO]',
    userRoles: ['RECEPCIONISTA'],
    requiredRoles: ['ADMIN', 'DOCTOR', 'ENFERMERO'],
    expectedResult: false
  }
];

specificTests.forEach((test, index) => {
  const result = hasAnyRole(test.userRoles, test.requiredRoles);
  const passed = result === test.expectedResult;
  const icon = passed ? '✅ PASS' : '❌ FAIL';

  console.log(`\n${index + 1}. ${test.description}`);
  console.log(`   Usuario roles: [${test.userRoles.join(', ')}]`);
  console.log(`   Requiere: [${test.requiredRoles.join(', ')}]`);
  console.log(`   Esperado: ${test.expectedResult ? 'ACCESO' : 'DENEGADO'}`);
  console.log(`   Resultado: ${result ? 'ACCESO' : 'DENEGADO'}`);
  console.log(`   ${icon}`);
});

// Resumen
console.log('\n\n' + '═'.repeat(80));
console.log('📊 RESUMEN DE LA LÓGICA');
console.log('═'.repeat(80));

console.log(`
✅ LÓGICA IMPLEMENTADA: hasAnyRole()
   
   📝 Descripción:
   Verifica si el usuario tiene AL MENOS UNO de los roles requeridos
   
   🔧 Implementación:
   return requiredRoles.some(role => userRoles.includes(role))
   
   💡 Comportamiento:
   - Si usuario tiene: ['DOCTOR', 'ANALISTA']
   - Y la ruta requiere: ['ADMIN', 'DOCTOR', 'ENFERMERO']
   - Resultado: ✅ ACCESO PERMITIDO (porque tiene DOCTOR)
   
   ⚠️ Nota Importante:
   - ADMIN no tiene acceso automático a todo
   - Cada ruta debe especificar explícitamente los roles permitidos
   - Para dar acceso a ADMIN, incluirlo en la lista: ['ADMIN', 'DOCTOR']

`);

console.log('═'.repeat(80));
console.log('✅ Pruebas completadas');
console.log('═'.repeat(80));

