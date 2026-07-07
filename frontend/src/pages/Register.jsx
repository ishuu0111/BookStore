import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';

function Register() {
    const [form, setForm] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = event => {
        const { name, value } = event.target;
        setForm(currentForm => ({ ...currentForm, [name]: value }));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setSubmitting(true);
        setError('');
        setMessage('');

        try {
            await api.post('/auth/register', form);
            setMessage('Account created. Redirecting to login...');
            window.setTimeout(() => navigate('/login'), 700);
        } catch (submitError) {
            setError(submitError.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="auth-layout">
            <div className="auth-panel auth-panel--accent">
                <span className="eyebrow">Start your storefront</span>
                <h1>Create an account for your bookstore workspace.</h1>
                <p>
                    Once you join, you can list books, manage the catalog, and make the shelf feel more alive.
                </p>
            </div>

            <form className="auth-panel auth-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                <p className="auth-form__subtitle">A quick signup is enough to start listing books.</p>
                {message && <p className="status-banner">{message}</p>}
                {error && <p className="status-banner status-banner--error">{error}</p>}

                <label className="field">
                    <span>Username</span>
                    <input
                        name="username"
                        placeholder="Your display name"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </label>

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
                        placeholder="Create a secure password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </label>

                <button type="submit" className="button button--primary button--full" disabled={submitting}>
                    {submitting ? 'Creating account...' : 'Register'}
                </button>

                <p className="auth-form__switch">
                    Already registered? <Link to="/login">Login here</Link>
                </p>
            </form>
        </section>
    );
}

export default Register;
