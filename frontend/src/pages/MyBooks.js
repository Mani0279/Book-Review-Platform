import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookAPI } from '../services/bookService';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);

  useEffect(() => {
    fetchMyBooks();
  }, [currentPage]);

  const fetchMyBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await bookAPI.getMyBooks(currentPage, 10);
      setBooks(data.data);
      setTotalPages(data.totalPages);
      setTotalBooks(data.totalBooks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      await bookAPI.deleteBook(bookId);
      alert('Book deleted successfully!');
      // Refresh the list
      if (books.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchMyBooks();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete book');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Books</h1>
          <p style={styles.subtitle}>
            You have added {totalBooks} {totalBooks === 1 ? 'book' : 'books'}
          </p>
        </div>
        <Link to="/add-book" style={styles.addButton}>
          + Add New Book
        </Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <Loading message="Loading your books..." />
      ) : books.length === 0 ? (
        <div style={styles.noBooks}>
          <h3>You haven't added any books yet</h3>
          <p>Start sharing your favorite books with the community!</p>
          <Link to="/add-book" style={styles.addButtonSecondary}>
            Add Your First Book
          </Link>
        </div>
      ) : (
        <>
          <div style={styles.booksGrid}>
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onDelete={handleDelete}
                showActions={true}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '1rem',
  },
  addButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#27ae60',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'background-color 0.3s',
    whiteSpace: 'nowrap',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    border: '1px solid #fcc',
  },
  booksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  noBooks: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  addButtonSecondary: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
  },
};

export default MyBooks;