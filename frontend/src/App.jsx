import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import { AuthProvider } from './Context/AuthContext.jsx';
import './App.scss';

const Home = lazy(() => import('./pages/Home'));
const AddBookPage = lazy(() => import('./pages/AddBookPage'));
const BookDetail = lazy(() => import('./pages/BookDetail'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-shell">
                    <div className="app-background" aria-hidden="true" />
                    <NavBar />
                    <main className="app-main">
                        <Suspense fallback={<div className="route-loader">Loading page...</div>}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/books" element={<Navigate to="/" replace />} />
                                <Route path="/books/:id" element={<BookDetail />} />
                                <Route path="/add" element={<AddBookPage />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                            </Routes>
                        </Suspense>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
