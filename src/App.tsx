import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import AddProperty from './pages/AddProperty';
import AdminDashboard from './pages/AdminDashboard';
import Agents from './pages/Agents';
import { BlogList, BlogPost } from './pages/Blog';
import Compare from './pages/Compare';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Listings from './pages/Listings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import PropertyDetail from './pages/PropertyDetail';
import Signup from './pages/Signup';
import { useStore } from './lib/store';

function RequireRole({ role, children }: { role: 'admin' | 'user'; children: React.ReactNode }) {
  const me = useStore((s) => s.currentUser());
  if (!me) return <Navigate to="/login" replace />;
  if (role === 'admin' && me.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Listings forced="buy" />} />
        <Route path="/rent" element={<Listings forced="rent" />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/sell" element={<AddProperty />} />
        <Route path="/property/:slug" element={<PropertyDetail />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <RequireRole role="user">
              <Dashboard />
            </RequireRole>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireRole role="admin">
              <AdminDashboard />
            </RequireRole>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
