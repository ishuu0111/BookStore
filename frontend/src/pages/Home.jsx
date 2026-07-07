import { useContext, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Context/auth-context.js';
import api from '../lib/api.js';

const genres = ['All', 'Fiction', 'Non-fiction', 'Sci-fi', 'Biography', 'Self-help'];
const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

function Home() {
    const { username, token } = useContext(AuthContext);
    const searchRef = useRef(null);
    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    const [pendingDeleteId, setPendingDeleteId] = useState('');
    const deferredQuery = useDeferredValue(query);

    useEffect(() => {
        searchRef.current?.focus();
    }, []);

    useEffect(() => {
        let ignore = false;

        const fetchBooks = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await api.get('/books', {
                    params: selectedGenre === 'All' ? {} : { genre: selectedGenre },
                });

                if (!ignore) {
                    setBooks(response.data.data);
                }
            } catch (fetchError) {
                if (!ignore) {
                    setError(fetchError.response?.data?.message || 'Failed to load books.');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchBooks();

        return () => {
            ignore = true;
        };
    }, [selectedGenre]);

    const filteredBooks = useMemo(() => {
        const normalizedQuery = deferredQuery.trim().toLowerCase();

        if (!normalizedQuery) {
            return books;
        }

        return books.filter(book => {
            const haystack = `${book.title} ${book.author} ${book.genre || ''}`.toLowerCase();
            return haystack.includes(normalizedQuery);
        });
    }, [books, deferredQuery]);

    const summary = useMemo(() => {
        const totalValue = filteredBooks.reduce((sum, book) => sum + (Number(book.price) || 0), 0);
        const averagePrice = filteredBooks.length > 0 ? Math.round(totalValue / filteredBooks.length) : 0;

        return {
            totalBooks: filteredBooks.length,
            genresCovered: new Set(filteredBooks.map(book => book.genre).filter(Boolean)).size,
            averagePrice,
        };
    }, [filteredBooks]);

    const handleDelete = async id => {
        setPendingDeleteId(id);
        setDeleteMessage('');

        try {
            await api.delete(`/books/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBooks(currentBooks => currentBooks.filter(book => book._id !== id));
            setDeleteMessage('Book removed from the shelf.');
        } catch (deleteError) {
            setDeleteMessage(deleteError.response?.data?.message || 'Unable to delete this book.');
        } finally {
            setPendingDeleteId('');
        }
    };

    return (
        <section className="page-stack">
            <div className="hero-panel">
                <div className="hero-panel__content">
                    <span className="eyebrow">Independent bookstore experience</span>
                    <h1>Find your next memorable read.</h1>
                    <p>
                        Browse a cozy, curated shelf of books, filter by genre, and jump into details that feel more
                        like a bookstore window than a plain CRUD list.
                    </p>

                    <div className="hero-panel__actions">
                        <label className="search-input">
                            <span className="search-input__label">Quick search</span>
                            <input
                                ref={searchRef}
                                value={query}
                                onChange={event => setQuery(event.target.value)}
                                placeholder="Search by title, author, or genre"
                            />
                        </label>
                        <Link to={username ? '/add' : '/login'} className="button button--primary">
                            {username ? 'List a Book' : 'Login to Sell'}
                        </Link>
                    </div>

                    <div className="genre-filter" aria-label="Genre filters">
                        {genres.map(genre => (
                            <button
                                key={genre}
                                type="button"
                                className={`genre-chip${selectedGenre === genre ? ' genre-chip--active' : ''}`}
                                onClick={() => setSelectedGenre(genre)}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hero-panel__spotlight">
                    <div className="spotlight-card">
                        <span className="spotlight-card__kicker">Shelf snapshot</span>
                        <strong>{summary.totalBooks} books in view</strong>
                        <p>Average price {currencyFormatter.format(summary.averagePrice || 0)}</p>
                        <p>{summary.genresCovered} genres currently visible</p>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <article className="stat-card">
                    <span>Books visible</span>
                    <strong>{summary.totalBooks}</strong>
                </article>
                <article className="stat-card">
                    <span>Genres covered</span>
                    <strong>{summary.genresCovered}</strong>
                </article>
                <article className="stat-card">
                    <span>Average price</span>
                    <strong>{currencyFormatter.format(summary.averagePrice || 0)}</strong>
                </article>
            </div>

            {deleteMessage && <p className="status-banner">{deleteMessage}</p>}
            {error && <p className="status-banner status-banner--error">{error}</p>}

            {!username && (
                <div className="callout">
                    <p>Login to add or delete books from the shelf.</p>
                    <Link to="/login" className="button button--ghost">
                        Open Login
                    </Link>
                </div>
            )}

            {loading ? (
                <div className="book-grid">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <article key={index} className="book-card book-card--skeleton">
                            <div className="skeleton skeleton--title" />
                            <div className="skeleton skeleton--line" />
                            <div className="skeleton skeleton--line short" />
                        </article>
                    ))}
                </div>
            ) : filteredBooks.length === 0 ? (
                <div className="empty-state">
                    <h2>No books match this shelf yet.</h2>
                    <p>Try a different search, switch genres, or add the first matching title yourself.</p>
                </div>
            ) : (
                <div className="book-grid">
                    {filteredBooks.map(book => (
                        <article key={book._id} className="book-card">
                            <div className="book-card__top">
                                <span className="book-card__badge">{book.genre || 'General'}</span>
                                <span className="book-card__price">
                                    {currencyFormatter.format(Number(book.price) || 0)}
                                </span>
                            </div>
                            <Link to={`/books/${book._id}`} className="book-card__title">
                                {book.title}
                            </Link>
                            <p className="book-card__author">by {book.author}</p>
                            <div className="book-card__meta">
                                <span>{book.publishYear || 'Year unknown'}</span>
                                <span>Freshly listed</span>
                            </div>
                            {username && (
                                <button
                                    type="button"
                                    className="button button--ghost danger"
                                    onClick={() => handleDelete(book._id)}
                                    disabled={pendingDeleteId === book._id}
                                >
                                    {pendingDeleteId === book._id ? 'Removing...' : 'Delete'}
                                </button>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default Home;
