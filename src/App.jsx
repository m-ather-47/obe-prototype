import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Departments from "./pages/Departments";
import Programs from "./pages/Programs";
import Semesters from "./pages/Semesters";
import Teachers from "./pages/Teachers";
import Courses from "./pages/Courses";
import Sections from "./pages/Sections";
import PLOs from "./pages/PLOs";
import CLOs from "./pages/CLOs";
import Blueprint from "./pages/Blueprint";
import MarksEntry from "./pages/MarksEntry";
import Reports from "./pages/Reports";
import Documents from "./pages/Documents";
import AuditLog from "./pages/AuditLog";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/sessions" element={<Semesters />} />
          <Route path="/semesters" element={<Semesters />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/sections" element={<Sections />} />
          <Route path="/plos" element={<PLOs />} />
          <Route path="/clos" element={<CLOs />} />
          <Route path="/blueprint" element={<Blueprint />} />
          <Route path="/marks" element={<MarksEntry />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/audit" element={<AuditLog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}