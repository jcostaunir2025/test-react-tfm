import { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Alert } from '../components/common/Alert';
import { Spinner } from '../components/common/Loading';
import { Modal } from '../components/common/Modal';
import {
  EvaluationForm,
  EvaluationList,
  QuestionForm,
  QuestionList,
  AnswerForm,
  AnswerList,
  AnswerDetails,
} from '../components/evaluations';
import { evaluationService } from '../services/evaluationService';
import { questionService } from '../services/questionService';
import { usePermissions } from '../hooks/usePermissions';

/**
 * EvaluationsPage - Página completa de gestión de evaluaciones, preguntas y respuestas
 * Sincronizada con backend EvaluacionController, EvaluacionPreguntaController, EvaluacionRespuestaController
 */
export const EvaluationsPage = () => {
  const [activeTab, setActiveTab] = useState('evaluations'); // evaluations | questions | answers

  // Evaluations state
  const [evaluations, setEvaluations] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Modal states
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(20);

  const { hasPermission } = usePermissions();

  // Permissions
  const canCreateEvaluation = hasPermission('evaluacion:create');
  const canUpdateEvaluation = hasPermission('evaluacion:update');
  const canDeleteEvaluation = hasPermission('evaluacion:delete');
  const canReadEvaluation = hasPermission('evaluacion:read');

  const canCreateQuestion = hasPermission('evaluacion_pregunta:create');
  const canUpdateQuestion = hasPermission('evaluacion_pregunta:update');
  const canDeleteQuestion = hasPermission('evaluacion_pregunta:delete');
  const canReadQuestion = hasPermission('evaluacion_pregunta:read');

  const canCreateAnswer = hasPermission('evaluacion_respuesta:create');
  const canUpdateAnswer = hasPermission('evaluacion_respuesta:update');
  const canDeleteAnswer = hasPermission('evaluacion_respuesta:delete');
  const canReadAnswer = hasPermission('evaluacion_respuesta:read');

  useEffect(() => {
    loadData();
  }, [activeTab, currentPage]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { page: currentPage, size: pageSize };

      if (activeTab === 'evaluations' && canReadEvaluation) {
        const response = await evaluationService.getAll(params);
        setEvaluations(response.content || response || []);
        setTotalPages(response.totalPages || 0);
      } else if (activeTab === 'questions' && canReadQuestion) {
        const response = await questionService.getAll(params);
        setQuestions(response.content || response || []);
        setTotalPages(response.totalPages || 0);
      } else if (activeTab === 'answers' && canReadAnswer) {
        const response = await evaluationService.getAllAnswers(params);
        setAnswers(response.content || response || []);
        setTotalPages(response.totalPages || 0);
      }
    } catch (err) {
      setError('Error al cargar los datos: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      setError(null);

      if (activeTab === 'evaluations') {
        if (isEditing && selectedItem) {
          await evaluationService.update(selectedItem.idEvaluacion, formData);
          setSuccess('Evaluación actualizada exitosamente');
        } else {
          await evaluationService.create(formData);
          setSuccess('Evaluación creada exitosamente');
        }
      } else if (activeTab === 'questions') {
        if (isEditing && selectedItem) {
          await questionService.update(selectedItem.idEvaluacionPregunta, formData);
          setSuccess('Pregunta actualizada exitosamente');
        } else {
          await questionService.create(formData);
          setSuccess('Pregunta creada exitosamente');
        }
      } else if (activeTab === 'answers') {
        if (isEditing && selectedItem) {
          await evaluationService.updateAnswer(selectedItem.idEvaluacionRespuesta, formData);
          setSuccess('Respuesta actualizada exitosamente');
        } else {
          await evaluationService.createAnswer(formData);
          setSuccess('Respuesta registrada y analizada exitosamente');
        }
      }

      setShowForm(false);
      setSelectedItem(null);
      await loadData();
    } catch (err) {
      setError('Error al guardar: ' + err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este elemento?')) {
      return;
    }

    try {
      setError(null);

      if (activeTab === 'evaluations') {
        await evaluationService.delete(id);
        setSuccess('Evaluación eliminada exitosamente');
      } else if (activeTab === 'questions') {
        await questionService.delete(id);
        setSuccess('Pregunta eliminada exitosamente');
      } else if (activeTab === 'answers') {
        await evaluationService.deleteAnswer(id);
        setSuccess('Respuesta eliminada exitosamente');
      }

      await loadData();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    }
  };

  const handleViewAnswers = async (question) => {
    try {
      setLoading(true);
      const answers = await questionService.getAnswersByQuestion(question.idEvaluacionPregunta);
      setAnswers(answers);
      setActiveTab('answers');
      setSuccess(`Mostrando respuestas para: ${question.textoEvaluacionPregunta}`);
    } catch (err) {
      setError('Error al cargar respuestas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'evaluations', name: 'Evaluaciones', permission: canReadEvaluation },
    { id: 'questions', name: 'Preguntas', permission: canReadQuestion },
    { id: 'answers', name: 'Respuestas', permission: canReadAnswer },
  ];

  const canCreate =
    (activeTab === 'evaluations' && canCreateEvaluation) ||
    (activeTab === 'questions' && canCreateQuestion) ||
    (activeTab === 'answers' && canCreateAnswer);

  const canUpdate =
    (activeTab === 'evaluations' && canUpdateEvaluation) ||
    (activeTab === 'questions' && canUpdateQuestion) ||
    (activeTab === 'answers' && canUpdateAnswer);

  const canDelete =
    (activeTab === 'evaluations' && canDeleteEvaluation) ||
    (activeTab === 'questions' && canDeleteQuestion) ||
    (activeTab === 'answers' && canDeleteAnswer);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Evaluaciones</h1>
        <p className="mt-2 text-gray-600">
          Administre evaluaciones psicológicas, preguntas y respuestas con análisis de sentimientos
        </p>
      </div>

      {/* Alerts */}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Tabs */}
      <Card className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.filter(tab => tab.permission).map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(0);
                }}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </Card>

      {/* Actions */}
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">
              {activeTab === 'evaluations' && 'Evaluaciones'}
              {activeTab === 'questions' && 'Preguntas'}
              {activeTab === 'answers' && 'Respuestas'}
            </h2>
            <p className="text-sm text-gray-500">
              Total: {
                activeTab === 'evaluations' ? evaluations.length :
                activeTab === 'questions' ? questions.length :
                answers.length
              }
            </p>
          </div>
          {canCreate && (
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              + Nuevo
            </button>
          )}
        </div>
      </Card>

      {/* Content */}
      <Card>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : (
          <>
            {/* Evaluations Tab */}
            {activeTab === 'evaluations' && (
              <EvaluationList
                evaluations={evaluations}
                onEdit={canUpdate ? handleEdit : undefined}
                onDelete={canDelete ? handleDelete : undefined}
                onViewDetails={handleViewDetails}
                isLoading={loading}
              />
            )}

            {/* Questions Tab */}
            {activeTab === 'questions' && (
              <QuestionList
                questions={questions}
                onEdit={canUpdate ? handleEdit : undefined}
                onDelete={canDelete ? handleDelete : undefined}
                onViewAnswers={handleViewAnswers}
                isLoading={loading}
              />
            )}

            {/* Answers Tab */}
            {activeTab === 'answers' && (
              <AnswerList
                answers={answers}
                onEdit={canUpdate ? handleEdit : undefined}
                onDelete={canDelete ? handleDelete : undefined}
                onViewDetails={handleViewDetails}
                isLoading={loading}
              />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="px-3 py-1">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-3 py-1 border rounded-md disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedItem(null);
        }}
        title={
          isEditing
            ? `Editar ${activeTab === 'evaluations' ? 'Evaluación' : activeTab === 'questions' ? 'Pregunta' : 'Respuesta'}`
            : `Nueva ${activeTab === 'evaluations' ? 'Evaluación' : activeTab === 'questions' ? 'Pregunta' : 'Respuesta'}`
        }
      >
        {activeTab === 'evaluations' && (
          <EvaluationForm
            evaluation={selectedItem}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedItem(null);
            }}
            isLoading={formLoading}
          />
        )}
        {activeTab === 'questions' && (
          <QuestionForm
            question={selectedItem}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedItem(null);
            }}
            isLoading={formLoading}
          />
        )}
        {activeTab === 'answers' && (
          <AnswerForm
            answer={selectedItem}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setSelectedItem(null);
            }}
            isLoading={formLoading}
          />
        )}
      </Modal>

      {/* Answer Details Modal */}
      {activeTab === 'answers' && (
        <AnswerDetails
          answer={selectedItem}
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

export default EvaluationsPage;

