import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../lib/api.js';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
});

function BookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let ignore = false;

        const fetchBook = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await api.get(`/books/${id}`);

                if (!ignore) {
                    setBook(response.data);
                }
            } catch (fetchError) {
                if (!ignore) {
                    setError(fetchError.response?.data?.message || 'Failed to load book details.');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        };

        fetchBook();

        return () => {
            ignore = true;
        };
    }, [id]);

    if (loading) {
        return (
            <section className="page-stack">
                <div className="detail-shell detail-shell--loading">
                    <div className="skeleton skeleton--cover" />
                    <div className="detail-shell__content">
                        <div className="skeleton skeleton--title" />
                        <div className="skeleton skeleton--line" />
                        <div className="skeleton skeleton--line short" />
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="page-stack">
                <p className="status-banner status-banner--error">{error}</p>
            </section>
        );
    }

    if (!book) {
        return (
            <section className="page-stack">
                <div className="empty-state">
                    <h2>Book not found</h2>
                    <p>The page you opened does not match a book currently on the shelf.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="page-stack">
            <Link to="/" className="back-link">
                Back to all books
            </Link>

            <div className="detail-shell">
                <div className="book-cover">
                    <span>{book.title?.charAt(0)?.toUpperCase() || 'B'}</span>
                </div>

                <div className="detail-shell__content">
                    <div className="detail-shell__eyebrow">{book.genre || 'General collection'}</div>
                    <h1>{book.title}</h1>
                    <p className="detail-shell__author">by {book.author}</p>

                    <div className="detail-shell__price">
                        {currencyFormatter.format(Number(book.price) || 0)}
                    </div>

                    <div className="detail-shell__meta">
                        <span className="meta-chip">Published {book.publishYear || 'Unknown'}</span>
                        <span className="meta-chip">Listed in the store</span>
                    </div>

                    <div className="detail-shell__story">
                        <h2>Why this listing stands out</h2>
                        <p>
                            Clean presentation, strong metadata, and a clear price point make this title easier to
                            browse and compare. Once the backend stores richer descriptions, this section can evolve
                            into a full editorial summary.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BookDetail;
