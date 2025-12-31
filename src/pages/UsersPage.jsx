import { useState, useEffect } from 'react';
import {
  UserCog,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  Shield
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Spinner } from '../components/common/Loading';
import { Alert } from '../components/common/Alert';
import { Modal } from '../components/common/Modal';
import { usePermissions } from '../hooks/usePermissions';
import { userService } from '../services';

/**
 * UsersPage - Gestión completa de usuarios del sistema
 * Solo accesible para rol ADMIN
 * Basado en la estructura de PatientsPage
 */
export const UsersPage = () => {
  const { canRead, canCreate, canUpdate, canDelete } = usePermissions('usuario');

  // Estados
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Formulario
  const [formData, setFormData] = useState({
    nombreUsuario: '',
    password: '',
    roles: [],
  });

  const [formErrors, setFormErrors] = useState({});

  // Cargar usuarios y roles al montar
  useEffect(() => {
    if (canRead) {
      loadUsers();
      loadRoles();
    }
  }, [canRead, currentPage, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        size: searchTerm ? 1000 : 10, // Si hay búsqueda, obtener más resultados
        sort: 'idUsuario,desc'
      };

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await userService.getAll(params);

      if (response.content) {
        setUsers(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } else {
        setUsers(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      setError('Error al cargar usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const rolesData = await userService.getRoles();
      setRoles(rolesData || []);
    } catch (err) {
      console.error('Error al cargar roles:', err);
    }
  };

  const handleCreate = () => {
    setFormData({
      nombreUsuario: '',
      password: '',
      roles: [],
    });
    setFormErrors({});
    setSelectedUser(null);
    setShowCreateModal(true);
  };

  const handleEdit = (user) => {
    setFormData({
      nombreUsuario: user.nombreUsuario || '',
      password: '', // No mostrar password actual
      roles: user.roles || [],
    });
    setFormErrors({});
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nombreUsuario.trim()) {
      errors.nombreUsuario = 'El nombre de usuario es obligatorio';
    } else if (formData.nombreUsuario.length < 3) {
      errors.nombreUsuario = 'Mínimo 3 caracteres';
    }

    if (!selectedUser && !formData.password) {
      errors.password = 'La contraseña es obligatoria';
    } else if (formData.password && formData.password.length < 6) {
      errors.password = 'Mínimo 6 caracteres';
    }


    if (!formData.roles || formData.roles.length === 0) {
      errors.roles = 'Debe asignar al menos un rol';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userData = {
        nombreUsuario: formData.nombreUsuario.trim(),
        roles: formData.roles,
      };

      // Solo incluir password si se proporcionó
      if (formData.password) {
        userData.password = formData.password;
      }

      if (selectedUser) {
        await userService.update(selectedUser.idUsuario, userData);
        setSuccess('Usuario actualizado exitosamente');
        setShowEditModal(false);
      } else {
        await userService.create(userData);
        setSuccess('Usuario creado exitosamente');
        setShowCreateModal(false);
      }

      await loadUsers();
    } catch (err) {
      setError('Error al guardar usuario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      setLoading(true);
      setError(null);
      await userService.delete(selectedUser.idUsuario);
      setSuccess('Usuario eliminado exitosamente');
      setShowDeleteModal(false);
      await loadUsers();
    } catch (err) {
      setError('Error al eliminar usuario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleRoleToggle = (role) => {
    setFormData(prev => {
      const roles = prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role];
      return { ...prev, roles };
    });
  };

  if (!canRead) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert type="error" message="No tiene permisos para acceder a esta página" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <UserCog className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        </div>
        <p className="text-gray-600">
          Administración de usuarios del sistema y asignación de roles
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}

      {/* Search and Actions */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre de usuario o nombre..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadUsers}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </button>
            {canCreate && (
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nuevo Usuario
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No se encontraron usuarios</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.idUsuario} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <UserCog className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.nombreUsuario}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user.idUsuario}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                              >
                                {role}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-400">Sin roles</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleView(user)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          title="Ver detalles"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {canUpdate && (
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            title="Editar"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-900"
                            title="Eliminar"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando página <span className="font-medium">{currentPage + 1}</span> de{' '}
                      <span className="font-medium">{totalPages}</span>
                      {' '}({totalElements} usuarios totales)
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage >= totalPages - 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false);
          setShowEditModal(false);
        }}
        title={selectedUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de Usuario <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nombreUsuario}
              onChange={(e) => setFormData({ ...formData, nombreUsuario: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                formErrors.nombreUsuario ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="usuario123"
            />
            {formErrors.nombreUsuario && (
              <p className="mt-1 text-sm text-red-600">{formErrors.nombreUsuario}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña {selectedUser && '(dejar vacío para mantener actual)'}
              {!selectedUser && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="••••••"
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roles <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2 border border-gray-300 rounded-lg p-3">
              {roles.map((role) => (
                <label key={role} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.roles.includes(role)}
                    onChange={() => handleRoleToggle(role)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    {role}
                  </span>
                </label>
              ))}
            </div>
            {formErrors.roles && (
              <p className="mt-1 text-sm text-red-600">{formErrors.roles}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowCreateModal(false);
                setShowEditModal(false);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {selectedUser ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Detalles del Usuario"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserCog className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedUser.nombreUsuario}
                  </h3>
                  <p className="text-sm text-gray-600">ID: {selectedUser.idUsuario}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-500">Roles Asignados</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedUser.roles && selectedUser.roles.length > 0 ? (
                    selectedUser.roles.map((role, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800 flex items-center gap-1"
                      >
                        <Shield className="h-4 w-4" />
                        {role}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">Sin roles asignados</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => setShowViewModal(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
      >
        {selectedUser && (
          <div className="space-y-4">
            <p className="text-gray-700">
              ¿Está seguro de que desea eliminar al usuario{' '}
              <span className="font-semibold">{selectedUser.nombreUsuario}</span>?
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <strong>Advertencia:</strong> Esta acción no se puede deshacer. Se eliminarán todos
                los datos asociados a este usuario.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UsersPage;

