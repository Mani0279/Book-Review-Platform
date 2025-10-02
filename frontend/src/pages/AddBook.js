import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bookAPI } from '../services/bookService';

const AddBook = () => {
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: '',
    publishedYear: new Date().getFullYear(),
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const data = await bookAPI.getGenres();
      setGenres(data.data);
    } catch (err) {
      console.error('Failed to fetch genres:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (
      !formData.title ||
      !formData.author ||
      !formData.description ||
      !formData.genre ||
      !formData.publishedYear
    ) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.title.length < 2) {
      setError('Title must be at least 2 characters long');
      return;
    }

    if (formData.description.length < 10) {
      setError('Description must be at least 10 characters long');
      return;
    }

    if (
      formData.publishedYear < 1000 ||
      formData.publishedYear > new Date().getFullYear() + 1
    ) {
      setError('Please enter a valid published year');
      return;
    }

    setLoading(true);

    try {
      const result = await bookAPI.addBook({
        ...formData,
        publishedYear: parseInt(formData.publishedYear),
      });

      if (result.success) {
        alert('Book added successfully!');
        navigate('/');
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.join(', ') ||
          'Failed to add book. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <Link to="/" style={styles.backLink}>
          ← Back to Home
        </Link>

        <h2 style={styles.title}>Add New Book</h2>
        <p style={styles.subtitle}>Share a book with the community</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Book Title <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter book title"
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Author <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter author name"
              required
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Genre <span style={styles.required}>*</span>
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                style={styles.select}
                required
              >
                <option value="">Select a genre</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Published Year <span style={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g., 2024"
                min="1000"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Description <span style={styles.required}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="Enter book description (minimum 10 characters)"
              rows="6"
              required
            />
            <div style={styles.charCount}>
              {formData.description.length} / 2000 characters
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
            <Link to="/" style={styles.cancelButton}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  },
  formCard: {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  backLink: {
    color: '#3498db',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
    fontSize: '1rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  subtitle: {
    color: '#7f8c8d',
    marginBottom: '2rem',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    border: '1px solid #fcc',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: '500',
    color: '#2c3e50',
    fontSize: '0.95rem',
  },
  required: {
    color: '#e74c3c',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  charCount: {
    fontSize: '0.85rem',
    color: '#7f8c8d',
    textAlign: 'right',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '0.875rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#95a5a6',
    color: 'white',
    padding: '0.875rem',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: '500',
    textDecoration: 'none',
    textAlign: 'center',
    cursor: 'pointer',
  },
};

export default AddBook;