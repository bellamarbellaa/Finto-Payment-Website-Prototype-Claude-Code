import { Route, Routes } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/case-study" element={<Landing />} />
    </Routes>
  );
}
