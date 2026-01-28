import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import AddPetScreen from './screens/AddPetScreen';
import EditPetScreen from './screens/EditPetScreen';
import AddVaccineScreen from './screens/AddVaccineScreen';
import AddMedicalRecordScreen from './screens/AddMedicalRecordScreen';
import PetProfileScreen from './screens/PetProfileScreen';
import PropTypes from 'prop-types';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading app...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-pet"
            element={
              <ProtectedRoute>
                <AddPetScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-pet/:id"
            element={
              <ProtectedRoute>
                <EditPetScreen />
              </ProtectedRoute>
            }
          />
          {/* Placeholder for PetProfile */}
          <Route
            path="/pet/:id"
            element={
              <ProtectedRoute>
                <PetProfileScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pet/:id/add-vaccine"
            element={
              <ProtectedRoute>
                <AddVaccineScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pet/:id/add-record"
            element={
              <ProtectedRoute>
                <AddMedicalRecordScreen />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


export default App;
