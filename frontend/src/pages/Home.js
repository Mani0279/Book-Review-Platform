import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { bookAPI } from '../services/bookService';
import { useAuth } from '../context/Authcontext';
import BookCard from '../components/BookCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [genres, setGenres] = useState([]);

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await bookAPI.getAllBooks(
        currentPage,
        5,
        search,
        genre,
        sortBy
      );
      setBooks(data.data);
      setTotalPages(data.totalPages);
      setTotalBooks(data.totalBooks);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, genre, sortBy]);

  const fetchGenres = async () => {
    try {
      const data = await bookAPI.getGenres();
      setGenres(data.data);
    } catch (err) {
      console.error('Failed to fetch genres:', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleSearch = (searchTerm) => {
    setSearch(searchTerm);
    setCurrentPage(1);
  };

  const handleFilter = (genreValue) => {
    setGenre(genreValue);
    setCurrentPage(1);
  };

  const handleSort = (sortValue) => {
    setSortBy(sortValue);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>📚 Discover Amazing Books</h1>
          <p style={styles.subtitle}>
            Explore our collection of {totalBooks} books and share your reviews
          </p>
        </div>
        {isAuthenticated && (
          <Link to="/add-book" style={styles.addButton}>
            + Add New Book
          </Link>
        )}
      </div>

      <SearchBar
        onSearch={handleSearch}
        onFilter={handleFilter}
        onSort={handleSort}
        genres={genres}
      />

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <Loading message="Loading books..." />
      ) : books.length === 0 ? (
        <div style={styles.noBooks}>
          <h3>No books found</h3>
          <p>
            {search || genre
              ? 'Try adjusting your search or filters'
              : 'Be the first to add a book!'}
          </p>
          {isAuthenticated && !search && !genre && (
            <Link to="/add-book" style={styles.addButtonSecondary}>
              Add Your First Book
            </Link>
          )}
        </div>
      ) : (
        <>
          <div style={styles.booksGrid}>
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
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

export default Home;