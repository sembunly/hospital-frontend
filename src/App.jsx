import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./pages/routes/ProtectedRoute";
import DefaultLayout from "./layouts/DefaultLayout";
import PatientRegistrationPage from "./pages/patients/PatientRegistrationPage";
import PatientListPage from "./pages/patients/PatientListPage";
import PatientEditPage from "./pages/patients/PatientEditPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DefaultLayout pageTitle="Dashboard">
                <DashboardPage />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/register"
          element={
            <ProtectedRoute>
              <DefaultLayout pageTitle="Register Patient">
                <PatientRegistrationPage />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <DefaultLayout pageTitle="Patient List">
                <PatientListPage />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/search"
          element={
            <ProtectedRoute>
              <DefaultLayout pageTitle="Patient Search">
                <PatientListPage searchOnly />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients/:patientId/edit"
          element={
            <ProtectedRoute>
              <DefaultLayout pageTitle="Edit Patient">
                <PatientEditPage />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
