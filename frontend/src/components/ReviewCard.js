import React from 'react';
import StarRating from './StarRating';
import { useAuth } from '../context/Authcontext';

const ReviewCard = ({ review, onEdit, onDelete }) => {
  const { user } = useAuth();
  const isOwner = user && review.userId._id === user._id;

  const handleDelete = () => {
    if (
      window.confirm('Are you sure you want to delete this review?')
    ) {
      onDelete(review._id);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            {review.userId.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={styles.userName}>{review.userId.name}</div>
            <div style={styles.date}>{formatDate(review.createdAt)}</div>
          </div>
        </div>
        <StarRating rating={review.rating} readonly size="1.25rem" />
      </div>

      <p style={styles.reviewText}>{review.reviewText}</p>

      {review.createdAt !== review.updatedAt && (
        <div style={styles.edited}>Edited on {formatDate(review.updatedAt)}</div>
      )}

      {isOwner && (
        <div style={styles.actions}>
          <button onClick={() => onEdit(review)} style={styles.editButton}>
            Edit
          </button>
          <button onClick={handleDelete} style={styles.deleteButton}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    gap: '1rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  userName: {
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '1rem',
  },
  date: {
    fontSize: '0.85rem',
    color: '#7f8c8d',
  },
  reviewText: {
    color: '#555',
    lineHeight: '1.6',
    fontSize: '0.95rem',
    whiteSpace: 'pre-wrap',
    marginBottom: '0.5rem',
  },
  edited: {
    fontSize: '0.8rem',
    color: '#95a5a6',
    fontStyle: 'italic',
    marginBottom: '0.5rem',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eee',
  },
  editButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
};

export default ReviewCard;