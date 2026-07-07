import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/auth-context.js';
import api from '../lib/api.js';

function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = event => {
        const { name, value } = event.target;
        setForm(currentForm => ({ ...currentForm, [name]: value }));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const response = await api.post('/auth/login', form);
            login(response.data.token, response.data.username);
            navigate('/');
        } catch (submitError) {
            setError(submitError.response?.data?.message || 'Login failed.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="auth-layout">
            <div className="auth-panel auth-panel--accent">
                <span className="eyebrow">Welcome back</span>
                <h1>Return to your reading room.</h1>
                <p>
                    Sign in to manage the shelf, remove old listings, and keep the catalog feeling handpicked.
                </p>
            </div>

            <form className="auth-panel auth-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <p className="auth-form__subtitle">Use the account you created for the bookstore.</p>
                {error && <p className="status-banner status-banner--error">{error}</p>}

                <label className="field">
                    <span>Email</span>
                    <input
                        name="email"
                        type="email"
                        placeholder="reader@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="field">
                    <span>Password</span>
                    <input
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" className="button button--primary button--full" disabled={submitting}>
                    {submitting ? 'Signing in...' : 'Login'}
                </button>

                <p className="auth-form__switch">
                    No account yet? <Link to="/register">Create one</Link>
                </p>
            </form>
        </section>
    );
}

export default Login;
