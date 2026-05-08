import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<div className="min-h-screen flex items-center justify-center bg-gray-50">Login Page - Coming Soon</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;