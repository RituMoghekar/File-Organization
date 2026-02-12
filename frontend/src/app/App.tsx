import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import FilesPage from "../pages/FilesPage";
import ProtectedRoute from "../components/ProtectedRoute";
import Logout from "../pages/Logout";
import ClusterList from "../components/Sidebar/ClusterList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
  path="/"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
        <Route path="/" element={<Dashboard />} />
        <Route path="/files" element={<FilesPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/clusters" element={<ClusterList />} />
      </Routes>
    </BrowserRouter>
  );
}
