import React from 'react'
import { AppRoutes } from './routes/app-routes'
import { PatientsProvider } from './routes/patients-context'

const App = () => {
  return (
    <PatientsProvider>
      <AppRoutes />
    </PatientsProvider>
  )
}

export default App
