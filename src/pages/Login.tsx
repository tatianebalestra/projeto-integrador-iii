import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import ClinicHeader from '../components/ClinicHeader';

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        navigate('/patients') 
      }
    } catch (err) {
      setError('Um erro inesperado aconteceu, tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-blue-50 sm:px-6 lg:px-8">
    <div className="w-full max-w-lg p-8 space-y-8 border-2 border-blue-200 rounded-lg shadow-lg bg-blue-50">
    <ClinicHeader size="medium" position="center" />
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-blue-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-orange-500">
            Entre com a sua conta
          </h2>
        </div>
        {error && (
          <div className="p-4 border-l-4 border-red-500 bg-red-50">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input type="hidden" name="remember" value="true" />
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only ">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full px-3 py-2 mt-1 border border-yellow-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full px-3 py-2 mt-1 border border-yellow-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-orange-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="block ml-2 text-sm text-orange-500">
                Lembrar-me
              </label>
            </div>

            
          </div>

          <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Signing in...' : 'Entrar'}
          </button>
        </div>
        </form>
        <div className="mt-6">
            <div className="relative">
                <div className="flex flex-col items-center space-y-2 text-sm">
              <Link to="/signup" className="font-medium text-orange-600 hover:text-blue-500">
                Não tem uma conta? Registre-se
              </Link>
              <Link to="/reset-password" className="font-medium text-orange-600 hover:text-blue-500">
                Esqueceu sua senha?
              </Link>
                </div>
            </div>
        </div>
    </div>
    </div>
    </div>
    </div>
  )
}