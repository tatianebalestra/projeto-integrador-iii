import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import ClinicHeader from '../components/ClinicHeader';

type Report = {
  id: string;
  date: string;
  content: string;
};

type Patient = {
  id: number;
  name: string;
  reports: Report[];
};

type PatientReport = {
    id: number;
    name: string;
    age: number;
    doc: string;
    cid: string;
    birthday: string;
    guardian: string;
    doctor: string;
    doc_doctor: string;
    expertise: string;
    gender: string;
    city: string;
    uf: string;
    reports: Report[];
  };

export default function PatientReport() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [newReport, setNewReport] = useState({
    date: new Date().toISOString().split('T')[0],
    content: ''
  });

  // Fetch patient data
  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('pacientes')
          .select('id, name, reports')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPatient({
          ...data,
          reports: data.reports || []
        });
      } catch (error) {
        console.error('Error fetching patient:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  // Add new report
  const addReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient || !newReport.content) return;

    try {
      setLoading(true);
      const updatedReports = [
        ...patient.reports,
        {
          id: Date.now().toString(),
          date: newReport.date,
          content: newReport.content
        }
      ];

      const { error } = await supabase
        .from('pacientes')
        .update({ reports: updatedReports })
        .eq('id', patient.id);

      if (error) throw error;

      setPatient({
        ...patient,
        reports: updatedReports
      });
      setNewReport({
        date: new Date().toISOString().split('T')[0],
        content: ''
      });
    } catch (error) {
      console.error('Error adding report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !patient) {
    return <div className="p-4 text-center">Carregando dados do paciente...</div>;
  }

  if (!patient) {
    return <div className="p-4 text-center">Paciente não encontrado</div>;
  }

  return (
    
    <div className="container p-4 mx-auto">
      <ClinicHeader> </ClinicHeader>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary-700">
          Relatórios de {patient.name}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-orange-300 rounded-md hover:bg-blue-300"
        >
          Voltar para Pacientes
        </button>
      </div>

      {/* Report Form */}
      <div className="p-6 mb-8 rounded-lg shadow-md bg-blue-50">
        <h2 className="mb-4 text-xl font-semibold text-primary-600">
          Adicionar Novo Relatório
        </h2>
        <form onSubmit={addReport}>
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Data
              </label>
              <input
                type="date"
                className="w-full p-2 bg-orange-100 border border-orange-300 rounded-md"
                value={newReport.date}
                onChange={(e) =>
                  setNewReport({ ...newReport, date: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700 ">
              Relatório
            </label>
            <textarea
              className="w-full p-2 border bg-orange-100 border border-orange-300 rounded-md min-h-[150px]"
              value={newReport.content}
              onChange={(e) =>
                setNewReport({ ...newReport, content: e.target.value })
              }
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-orange-600 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Salvando...' : 'Salvar Relatório'}
          </button>
        </form>
      </div>

      {/* Previous Reports */}
      <div className="p-6 rounded-lg shadow-md bg-blue-50">
        <h2 className="mb-4 text-xl font-semibold text-primary-600">
          Relatórios Antigos
        </h2>
        {patient.reports.length === 0 ? (
          <p className="text-gray-500">Sem relatórios</p>
        ) : (
          <div className="space-y-4">
            {[...patient.reports].reverse().map((report) => (
              <div
                key={report.id}
                className="pb-4 border-b border-gray-200 last:border-0"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-gray-800">
                    {new Date(report.date).toLocaleDateString()}
                  </h3>
                </div>
                <p className="mt-2 text-gray-600 whitespace-pre-line">
                  {report.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}