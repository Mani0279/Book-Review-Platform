import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';

const ReviewForm = ({ onSubmit, onCancel, initialData = null, loading = false }) => {
  const [formData, setFormData] = useState({
    rating: 0,
    reviewText: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        rating: initialData.rating || 0,
        reviewText: initialData.reviewText || '',
      });
    }
  }, [initialData]);

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
    setError('');
  };

  const handleTextChange = (e) => {
    setFormData({ ...formData, reviewText: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!formData.reviewText.trim()) {
      setError('Please write a review');
      return;
    }

    if (formData.reviewText.trim().length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    if (formData.reviewText.length > 1000) {
      setError('Review cannot exceed 1000 characters');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        {initialData ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      {error && <div style={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Your Rating <span style={styles.required}>*</span>
          </label>
          <StarRating
            rating={formData.rating}
            onRatingChange={handleRatingChange}
            size="2.5rem"
          />
          {formData.rating > 0 && (
            <span style={styles.ratingText}>
              {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
            </span>
          )}
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Your Review <span style={styles.required}>*</span>
          </label>
          <textarea
            value={formData.reviewText}
            onChange={handleTextChange}
            style={styles.textarea}
            placeholder="Share your thoughts about this book... (minimum 10 characters)"
            rows="6"
            disabled={loading}
          />
          <div style={styles.charCount}>
            {formData.reviewText.length} / 1000 characters
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading
              ? initialData
                ? 'Updating...'
                : 'Submitting...'
              : initialData
              ? 'Update Review'
              : 'Submit Review'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#f8f9fa',
    padding: '2rem',
    borderRadius: '8px',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1.5rem',
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
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: '500',
    color: '#2c3e50',
    fontSize: '1rem',
  },
  required: {
    color: '#e74c3c',
  },
  ratingText: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginTop: '0.25rem',
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
    backgroundColor: 'white',
  },
  charCount: {
    fontSize: '0.85rem',
    color: '#7f8c8d',
    textAlign: 'right',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
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
    cursor: 'pointer',
  },
};

export default ReviewForm;