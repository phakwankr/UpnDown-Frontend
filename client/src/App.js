import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Register, Landing, Error, /*ProtectedRoute*/ } from './pages'
import {
  AllActivities,
  Profile,
  SharedLayout,
  Stats,
  AddActivity,
} from './pages/dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            //<ProtectedRoute>
              <SharedLayout />
            //</ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path='all-activities' element={<AllActivities />} />
          <Route path='add-activity' element={<AddActivity />} />
          <Route path='profile' element={<Profile />} />
        </Route>
        <Route path='/register' element={<Register />} />
        <Route path='/landing' element={<Landing />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
