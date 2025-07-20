import Home from './components/Home.jsx';
import AdminLogin from './components/AdminLogin.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import ClientForm from './components/ClientForm.jsx';

const routes = [
  { path: '/', element: <Home /> },
  { path: '/admin', element: <AdminLogin /> },
  { path: '/admin/dashboard', element: <AdminDashboard /> },
  { path: '/client', element: <ClientForm /> },
];
export default routes;