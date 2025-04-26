import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabaseClient'
import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ResetPassword from './pages/ResetPassword'
import UpdatePassword from './pages/UpdatePassword'
import Patients from './pages/Patients'
import PatientReport from './pages/PatientReport';

export default function App() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)


  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={!session ? <Login /> : <Navigate to="/patients" />} />
      <Route path="/signup" element={!session ? <SignUp /> : <Navigate to="/patients" />} />
      <Route path="/reset-password" element={!session ? <ResetPassword /> : <Navigate to="/patients" />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/patients" element={session ? <Patients /> : <Navigate to="/" />} />
      <Route path="/patient/:id" element={session ? <PatientReport /> : <Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
  )
}