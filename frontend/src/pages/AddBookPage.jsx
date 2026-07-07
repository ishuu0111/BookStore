import { useNavigate } from 'react-router-dom';
import AddBook from '../components/AddBook.jsx';

function AddBookPage() {
    const navigate = useNavigate();

    return (
        <section className="page-stack">
            <AddBook onAdd={() => navigate('/')} />
        </section>
    );
}

export default AddBookPage;
