import React, { useState } from 'react'
import { Mail, ArrowRight, Heart } from 'lucide-react'
import { sendMagicLink } from '../lib/firebase'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const result = await sendMagicLink(email)

      if (result.success) {
        setMessage('✅ Vérifie ton email ! Un lien magique t\'a été envoyé.')
      } else {
        setMessage('Erreur: ' + result.error)
      }
    } catch {
      setMessage('Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="card text-center">
          {/* Logo */}
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>

          {/* Titre */}
          <h1 className="text-3xl font-bold gradient-text mb-2">Renew</h1>
          <p className="text-gray-600 mb-8">Ton allié pour une vie sobre</p>

          {/* Formulaire */}
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Connexion magique</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
                message.includes('✅')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message}
              
              {message.includes('✅') && (
                <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-blue-800 text-xs">
                  📧 <strong>Email pas reçu ?</strong> Vérifie tes spams ou attends 1-2 minutes. 
                  <button 
                    onClick={handleSignUp}
                    className="ml-2 underline hover:no-underline"
                  >
                    Renvoyer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Info */}
          <div className="mt-8 text-xs text-gray-500">
            <p>Pas de mot de passe nécessaire !</p>
            <p>Tu recevras un lien de connexion par email.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth
