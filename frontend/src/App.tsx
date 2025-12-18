import { useEffect, useState } from 'react'
import axios from 'axios'
import { Project } from './types'
import { Link } from 'react-router-dom'

const App = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios.get<Project[]>('http://127.0.0.1:8000/api/projects/')
      .then(res => {
        setProjects(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError("Nie udało się pobrać danych z API. Sprawdź czy Django działa.")
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  )

  if (error) return (
    <div className="flex justify-center items-center min-h-screen text-red-500 font-medium">
      {error}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-black tracking-tighter text-black">
                PORTFOLIO
              </Link>
            </div>
            <div className="flex space-x-4 italic">
              <Link 
                to="/admin-panel" 
                className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
              >
                Panel Admina
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-8">
        <header className="mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Moje Realizacje</h2>
          <p className="text-gray-500 mt-2">Przegląd najnowszych projektów i wdrożeń.</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border-2 border-dashed">
              <p className="text-gray-400">Brak projektów do wyświetlenia. Dodaj coś w panelu!</p>
            </div>
          ) : (
            projects.map(project => (
              <div key={project.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative overflow-hidden">
                  {project.images?.[0] ? (
                  <img 
                      src={project.images[0].image.startsWith('http') 
                        ? project.images[0].image 
                        : `https://res.cloudinary.com/TWOJA_NAZWA_CLOUD/image/upload/${project.images[0].image}`
                      } 
                      className="w-full h-64 object-cover" 
                      alt={project.title}
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400">Brak zdjęcia</div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mt-2 line-clamp-3 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400">
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">Projekt</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}

export default App