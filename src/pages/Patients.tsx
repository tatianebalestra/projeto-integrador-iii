import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom';
import ClinicHeader from '../components/ClinicHeader'

type Patient = {
  id: number
  name: string
  age: number
  doc: string
  cid: string
  birthday: string
  guardian: string
  report: string
}


export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  
  

  // Fetch patients from Supabase
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('pacientes')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error
        setPatients(data || [])
      } catch (error) {
        console.error('Error fetching patients:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle patient deletion
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return
    
    try {
      const { error } = await supabase
        .from('pacientes')
        .delete()
        .eq('id', id)

      if (error) throw error
      setPatients(patients.filter(patient => patient.id !== id))
    } catch (error) {
      console.error('Error deleting patient:', error)
    }
  }

  // Handle form submission for create/update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatient) return;
  
    try {
      if (editingPatient.id) {
        // Get the current patient data to compare changes
        const currentPatient = patients.find(p => p.id === editingPatient.id);
        
        // Prepare update object with only changed fields
        const updateData: Partial<Patient> = {
          name: editingPatient.name,
          age: editingPatient.age,
          birthday: editingPatient.birthday,
          guardian: editingPatient.guardian
        };
  
        // Only include doc if it's changed
        if (currentPatient?.doc !== editingPatient.doc) {
          updateData.doc = editingPatient.doc;
        }
  
        // Only include cid if it's changed
        if (currentPatient?.cid !== editingPatient.cid) {
          updateData.cid = editingPatient.cid;
        }
  
        // Update existing patient
        const { data, error } = await supabase
          .from('pacientes')
          .update(updateData)
          .eq('id', editingPatient.id)
          .select();
  
        if (error) throw error;
        
        // Update state with the returned data
        setPatients(patients.map(p => p.id === editingPatient.id ? data[0] : p));
      } else {
        // Create new patient - first check if doc exists
        const { count } = await supabase
          .from('pacientes')
          .select('*', { count: 'exact', head: true })
          .eq('doc', editingPatient.doc);
  
        if (count && count > 0) {
          throw new Error('A patient with this document number already exists');
        }
  
        const { data, error } = await supabase
          .from('pacientes')
          .insert([{
            name: editingPatient.name,
            age: editingPatient.age,
            doc: editingPatient.doc,
            cid: editingPatient.cid,
            birthday: editingPatient.birthday,
            guardian: editingPatient.guardian
          }])
          .select();
  
        if (error) throw error;
        setPatients([...patients, data[0]]);
      }
      
      setIsModalOpen(false);
      setEditingPatient(null);
    } catch (error) {
      console.error('Error saving patient:', error);
      alert(
         
        'Failed to save patient. Please check for duplicate document numbers.'
      );
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto bg-blue-50">
    <ClinicHeader />
    <div className="container px-4 py-8 mx-auto bg-blue-50">
      <div className="flex items-center justify-between mb-6 bg-blue-50">
        
        <h1 className="text-2xl font-bold text-gray-800">Gestão de Pacientes</h1>
        {/* Sign out button */}
          <div  >
            <button
              onClick={handleLogout}
              className="absolute top-2.5 right-2.5 px-5 py-2 rounded bg-red-500 text-white cursor-pointer hover:bg-red-600 transition-colors"
            >
              Sign out
            </button>
          </div>
        <button
          onClick={() => {
            setEditingPatient({
              id: 0,
              name: '',
              age: 0,
              doc: '',
              cid: '',
              birthday: '',
              guardian: '',
              report:'',
            })
            setIsModalOpen(true)
          }}
          className="px-4 py-2 text-white transition-colors bg-blue-700 rounded-md hover:bg-orange-500"
        >
          Adicionar novo
        </button>
      </div>
          

      {/* Search Bar */}
      <div className="mb-6 ">
        <input
          type="text"
          placeholder="Procurar pacientes..."
          className="w-full p-2 bg-blue-100 border border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
        

      {/* Patients Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-blue-200">
            <thead>
              <tr className="bg-blue-300">
                <th className="px-4 py-3 border border-blue-700">Nome</th>
                <th className="px-4 py-3 border border-blue-700">Idade</th>
                <th className="px-4 py-3 border border-blue-700">CPF</th>
                <th className="px-4 py-3 border border-blue-700">CID</th>
                <th className="px-4 py-3 border border-blue-700">Data de Nascimento</th>
                <th className="px-4 py-3 border border-blue-700">Responsável</th>
                <th className="px-4 py-3 border border-blue-700">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="bg-blue-50 hover:bg-orange-100">
                    <td className="px-4 py-2 border border-blue-700">
                      <Link
                        to={`/patient/${patient.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {patient.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2 border border-blue-700">{patient.age}</td>
                    <td className="px-4 py-2 border border-blue-700">{patient.doc}</td>
                    <td className="px-4 py-2 border border-blue-700">{patient.cid}</td>
                    <td className="px-4 py-2 border border-blue-700">{patient.birthday}</td>
                    <td className="px-4 py-2 border border-blue-700">{patient.guardian}</td>
                    <td className="px-1 py-2 border border-blue-700">
                    <button
                      onClick={() => {
                        setEditingPatient(patient);
                        setIsModalOpen(true);
                      }}
                      className="px-4 py-1 font-medium text-white transition-colors bg-orange-500 rounded-md ml-9 hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="px-3 py-1 font-medium text-white transition-colors bg-red-500 rounded-md ml-9 hover:bg-red-600"
                    >
                      Excluir
                    </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-4 text-center text-gray-500">
                    {searchTerm ? 'Nenhum paciente encontrado' : 'Sem pacientes disponíveis'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Patient Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 border-t-4 border-orange-500 rounded-lg bg-blue-50">
            <h2 className="mb-4 text-xl font-bold">
              {editingPatient?.id ? 'Editar Paciente' : 'Adicionar Paciente'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 ">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    className="block w-full p-2 mt-1 border border-orange-300 rounded-md bg-orange-50"
                    value={editingPatient?.name || ''}
                    onChange={(e) => setEditingPatient({
                      ...editingPatient!,
                      name: e.target.value
                    })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Idade</label>
                  <input
                    type="number"
                    className="block w-full p-2 mt-1 border border-orange-300 rounded-md bg-orange-50"
                    value={editingPatient?.age || 0}
                    onChange={(e) => setEditingPatient({
                      ...editingPatient!,
                      age: parseInt(e.target.value) || 0
                    })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CPF</label>
                  <input
                    type="text"
                    className="block w-full p-2 mt-1 border border-orange-300 rounded-md bg-orange-50"
                    value={editingPatient?.doc || ''}
                    onChange={(e) => setEditingPatient({
                      ...editingPatient!,
                      doc: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">CID</label>
                  <input
                    type="text"
                    className="block w-full p-2 mt-1 border border-orange-300 rounded-md bg-orange-50"
                    value={editingPatient?.cid || ''}
                    onChange={(e) => setEditingPatient({
                      ...editingPatient!,
                      cid: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                  <input
                    type="date"
                    className="block w-full p-2 mt-1 border border-orange-300 rounded-md bg-orange-50"
                    value={editingPatient?.birthday || ''}
                    onChange={(e) => setEditingPatient({
                      ...editingPatient!,
                      birthday: e.target.value
                    })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Responsável</label>
                  <input
                    type="text"
                    className="block w-full p-2 mt-1 border border-orange-300 rounded-md bg-orange-50"
                    value={editingPatient?.guardian || ''}
                    onChange={(e) => setEditingPatient({
                      ...editingPatient!,
                      guardian: e.target.value
                    })}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingPatient(null)
                  }}
                  className="px-4 py-2 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-orange-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}