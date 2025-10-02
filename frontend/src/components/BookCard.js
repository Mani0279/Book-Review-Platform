import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

const BookCard = ({ book, onDelete, showActions = false }) => {
  const { user } = useAuth();
  const isOwner = user && book.addedBy._id === user._id;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      onDelete(book._id);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i} style={{ color: '#f39c12' }}>
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i} style={{ color: '#f39c12' }}>
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} style={{ color: '#ddd' }}>
            ★
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.title}>{book.title}</h3>
        <span style={styles.genre}>{book.genre}</span>
      </div>

      <p style={styles.author}>by {book.author}</p>

      <p style={styles.description}>
        {book.description.length > 150
          ? `${book.description.substring(0, 150)}...`
          : book.description}
      </p>

      <div style={styles.metadata}>
        <span style={styles.year}>📅 {book.publishedYear}</span>
        <div style={styles.rating}>
          {renderStars(Math.round(book.averageRating))}
          <span style={styles.ratingText}>
            {book.averageRating > 0
              ? `${book.averageRating.toFixed(1)} (${book.totalReviews})`
              : 'No reviews yet'}
          </span>
        </div>
      </div>

      <div style={styles.addedBy}>
        Added by: <strong>{book.addedBy.name}</strong>
      </div>

      <div style={styles.actions}>
        <Link to={`/books/${book._id}`} style={styles.viewButton}>
          View Details
        </Link>

        {showActions && isOwner && (
          <>
            <Link to={`/books/edit/${book._id}`} style={styles.editButton}>
              Edit
            </Link>
            <button onClick={handleDelete} style={styles.deleteButton}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
    gap: '1rem',
  },
  title: {
    fontSize: '1.25rem',
    color: '#2c3e50',
    marginBottom: '0',
    flex: 1,
  },
  genre: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
  },
  author: {
    color: '#7f8c8d',
    fontSize: '0.95rem',
    marginBottom: '1rem',
    fontStyle: 'italic',
  },
  description: {
    color: '#555',
    fontSize: '0.9rem',
    lineHeight: '1.6',
    marginBottom: '1rem',
    flex: 1,
  },
  metadata: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eee',
  },
  year: {
    color: '#7f8c8d',
    fontSize: '0.85rem',
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  ratingText: {
    color: '#7f8c8d',
    fontSize: '0.85rem',
  },
  addedBy: {
    color: '#95a5a6',
    fontSize: '0.8rem',
    marginBottom: '1rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  viewButton: {
    flex: 1,
    padding: '0.5rem 1rem',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    textAlign: 'center',
    borderRadius: '4px',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s',
  },
  editButton: {
    flex: 1,
    padding: '0.5rem 1rem',
    backgroundColor: '#f39c12',
    color: 'white',
    textDecoration: 'none',
    textAlign: 'center',
    borderRadius: '4px',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s',
  },
  deleteButton: {
    flex: 1,
    padding: '0.5rem 1rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default BookCard;