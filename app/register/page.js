'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [useMagicLink, setUseMagicLink] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage('')

    if (useMagicLink) {
      // Registro con enlace mágico (sin contraseña)
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        setMessage('Error: ' + error.message)
      } else {
        setMessage('¡Enlace mágico enviado! Revisa tu email para completar el registro.')
      }
    } else {
      // Registro tradicional con contraseña
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })
      if (error) {
        setMessage('Error: ' + error.message)
      } else {
        setMessage('¡Cuenta creada! Revisa tu email para confirmar y luego inicia sesión.')
      }
    }
  }

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setMessage('Error con Google: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Crear Cuenta en FlipScale</h2>
        
        {message && (
          <p className={`text-sm mb-4 text-center p-2 rounded ${message.includes('Error') ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" 
            required 
          />
          
          {!useMagicLink && (
            <input 
              type="password" 
              placeholder="Contraseña (mín. 6 caracteres)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none" 
              required 
              minLength="6" 
            />
          )}

          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            {useMagicLink ? 'Enviar enlace mágico' : 'Registrarme'}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">o continúa con</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 p-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google
        </button>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setUseMagicLink(!useMagicLink); setMessage(''); }}
            className="text-sm text-purple-600 hover:text-purple-800 underline"
          >
            {useMagicLink ? 'Prefiero usar contraseña' : '¿Prefieres registrarte con enlace mágico?'}
          </button>
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          ¿Ya tienes cuenta? <a href="/login" className="text-purple-600 font-semibold hover:underline">Inicia sesión</a>
        </p>
      </div>
    </div>
  )
}