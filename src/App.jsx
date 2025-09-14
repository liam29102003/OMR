import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Result from './pages/Result';
import Scanner from './pages/Scanner';
import SetupAnswerKey from './pages/SetupAnswerKey';
import QuestionFormat from './pages/QuestionFormat';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/setup-answer-key" element={<SetupAnswerKey />} />
        <Route path="/result" element={<Result />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/question-format" element={<QuestionFormat />} />
      </Routes>
    </Router>
  );
}

export default App;