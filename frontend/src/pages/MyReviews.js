import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reviewAPI } from '../services/reviewService';
import StarRating from '../components/StarRating';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(() => {
    fetchMyReviews();
  }, [currentPage]);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await reviewAPI.getMyReviews(currentPage, 10);
      setReviews(data.data);
      setTotalPages(data.totalPages);
      setTotalReviews(data.totalReviews);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch your reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await reviewAPI.deleteReview(reviewId);
        alert('Review deleted successfully!');
        
        // Refresh the list
        if (reviews.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchMyReviews();
        }
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Reviews</h1>
        <p style={styles.subtitle}>
          You have written {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading ? (
        <Loading message="Loading your reviews..." />
      ) : reviews.length === 0 ? (
        <div style={styles.noReviews}>
          <h3>You haven't written any reviews yet</h3>
          <p>Start exploring books and share your thoughts!</p>
          <Link to="/" style={styles.browseButton}>
            Browse Books
          </Link>
        </div>
      ) : (
        <>
          <div style={styles.reviewsList}>
            {reviews.map((review) => (
              <div key={review._id} style={styles.reviewCard}>
                <div style={styles.bookInfo}>
                  <Link
                    to={`/books/${review.bookId._id}`}
                    style={styles.bookTitle}
                  >
                    {review.bookId.title}
                  </Link>
                  <p style={styles.bookAuthor}>by {review.bookId.author}</p>
                </div>

                <div style={styles.reviewContent}>
                  <div style={styles.ratingDate}>
                    <StarRating rating={review.rating} readonly size="1.25rem" />
                    <span style={styles.date}>
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  <p style={styles.reviewText}>{review.reviewText}</p>

                  {review.createdAt !== review.updatedAt && (
                    <div style={styles.edited}>
                      Edited on {formatDate(review.updatedAt)}
                    </div>
                  )}
                </div>

                <div style={styles.actions}>
                  <Link
                    to={`/books/${review.bookId._id}`}
                    style={styles.viewButton}
                  >
                    View Book
                  </Link>
                  <button
                    onClick={() => handleDelete(review._id)}
                    style={styles.deleteButton}
                  >
                    Delete Review
                  </button>
                </div>
              </div>
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
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    marginBottom: '2rem',
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
  error: {
    backgroundColor: '#fee',
    color: '#c33',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    border: '1px solid #fcc',
  },
  reviewsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  bookInfo: {
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #eee',
  },
  bookTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#3498db',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '0.25rem',
  },
  bookAuthor: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    fontStyle: 'italic',
  },
  reviewContent: {
    marginBottom: '1rem',
  },
  ratingDate: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
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
  },
  edited: {
    fontSize: '0.8rem',
    color: '#95a5a6',
    fontStyle: 'italic',
    marginTop: '0.5rem',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    paddingTop: '1rem',
    borderTop: '1px solid #eee',
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
  },
  noReviews: {
    textAlign: 'center',
    padding: '3rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  browseButton: {
    display: 'inline-block',
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
  },
};

export default MyReviews;