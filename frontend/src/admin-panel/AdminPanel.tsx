import React, { useState, useEffect, FormEvent } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Project } from '../types'

const AdminPanel = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const fetchProjects = async () => {
    try {
      const res = await axios.get<Project[]>('http://127.0.0.1:8000/api/projects/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setProjects(res.data)
    } catch (err: any) {
      console.error(err)
      if (err.response?.status === 401) {
        localStorage.removeItem('token')
        navigate('/login')
      }
    }
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
    } else {
      fetchProjects()
    }
  }, [token])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!title || !description) return alert("Wypełnij dane!")
    
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    
    if (selectedFiles) {
      Array.from(selectedFiles).forEach(file => {
        formData.append('uploaded_images', file)
      })
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/projects/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      })
      
      setTitle('')
      setDescription('')
      setSelectedFiles(null)
      alert("Dodano projekt!")
      fetchProjects()
    } catch (err) { 
      console.error("Szczegóły błędu:", err)
      alert("Błąd zapisu. Możliwe, że sesja wygasła.") 
    } finally { 
      setIsSubmitting(false) 
    }
  }

  const deleteProject = async (id: number) => {
    if (window.confirm("Usunąć ten projekt?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/projects/${id}/`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        fetchProjects()
      } catch (err) {
        alert("Błąd podczas usuwania.")
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-black">PANEL ZARZĄDZANIA</span>
            <button 
              onClick={handleLogout}
              className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
            >
              Wyloguj
            </button>
          </div>
          <Link to="/" className="text-sm text-gray-500 hover:text-black">← Powrót do strony</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 md:p-12">
        <div className="grid grid-cols-1 gap-12">
          
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Nowa Realizacja</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tytuł projektu</label>
                <input 
                  type="text" value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-black outline-none transition"
                  placeholder="np. Remont łazienki Warszawa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
                <textarea 
                  value={description} onChange={e => setDescription(e.target.value)}
                  className="w-full border-gray-200 border rounded-xl p-3 h-32 focus:ring-2 focus:ring-black outline-none transition"
                  placeholder="Opisz zakres prac..."
                />
              </div>
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                <input 
                  type="file" multiple onChange={e => setSelectedFiles(e.target.files)}
                  className="hidden" id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                  {selectedFiles ? `${selectedFiles.length} wybrano plików` : "Kliknij, aby dodać zdjęcia"}
                </label>
              </div>
              <button 
                disabled={isSubmitting}
                className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 disabled:bg-gray-400 transition shadow-lg"
              >
                {isSubmitting ? "Wysyłanie do chmury..." : "Opublikuj w portfolio"}
              </button>
            </form>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6">Zarządzaj wpisami</h2>
            <div className="space-y-3">
              {projects.length === 0 && <p className="text-gray-400">Brak projektów w bazie.</p>}
              {projects.map(p => (
                <div key={p.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100">
                  <div className="flex items-center gap-4">
                    {p.images?.[0] && (
                      <img src={p.images[0].image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                    )}
                    <span className="font-semibold">{p.title}</span>
                  </div>
                  <button 
                    onClick={() => deleteProject(p.id)}
                    className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition"
                  >
                    Usuń
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default AdminPanel