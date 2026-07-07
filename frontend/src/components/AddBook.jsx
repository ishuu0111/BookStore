import { useContext, useState } from 'react';
import { AuthContext } from '../Context/auth-context.js';
import api from '../lib/api.js';

const genres = ['Fiction', 'Non-fiction', 'Sci-fi', 'Biography', 'Self-help'];

function AddBook({ onAdd }) {
    const { token } = useContext(AuthContext);
    const [form, setForm] = useState({
        title: '',
        author: '',
        genre: 'Fiction',
        price: '',
        publishYear: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = event => {
        const { name, value } = event.target;
        setForm(currentForm => ({ ...currentForm, [name]: value }));
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setSubmitting(true);
        setMessage('');
        setError('');

        try {
            await api.post(
                '/books',
                {
                    ...form,
                    price: Number(form.price),
                    publishYear: form.publishYear ? Number(form.publishYear) : '',
                },
                token
                    ? {
                          headers: {
                              Authorization: `Bearer ${token}`,
                          },
                      }
                    : undefined
            );

            setMessage('Book added to the shelf.');
            setForm({
                title: '',
                author: '',
                genre: 'Fiction',
                price: '',
                publishYear: '',
            });
            onAdd?.();
        } catch (submitError) {
            setError(submitError.response?.data?.message || 'Unable to add book right now.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="listing-panel">
            <div className="listing-panel__intro">
                <span className="eyebrow">Create a new listing</span>
                <h2>Present the book like it belongs in a storefront.</h2>
                <p>
                    Strong titles, clean author names, and thoughtful pricing make the catalog feel curated and easy
                    to browse.
                </p>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
                {message && <p className="status-banner">{message}</p>}
                {error && <p className="status-banner status-banner--error">{error}</p>}

                <div className="form-grid">
                    <label className="field">
                        <span>Title</span>
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="The Midnight Library"
                            required
                        />
                    </label>

                    <label className="field">
                        <span>Author</span>
                        <input
                            name="author"
                            value={form.author}
                            onChange={handleChange}
                            placeholder="Matt Haig"
                            required
                        />
                    </label>

                    <label className="field">
                        <span>Genre</span>
                        <select name="genre" value={form.genre} onChange={handleChange}>
                            {genres.map(genre => (
                                <option key={genre} value={genre}>
                                    {genre}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="field">
                        <span>Price</span>
                        <input
                            name="price"
                            type="number"
                            min="0"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="499"
                            required
                        />
                    </label>

                    <label className="field field--full">
                        <span>Publish year</span>
                        <input
                            name="publishYear"
                            type="number"
                            min="0"
                            value={form.publishYear}
                            onChange={handleChange}
                            placeholder="2020"
                        />
                    </label>
                </div>

                <div className="form-actions">
                    <button type="submit" className="button button--primary" disabled={submitting}>
                        {submitting ? 'Saving...' : 'Add Book'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddBook;
