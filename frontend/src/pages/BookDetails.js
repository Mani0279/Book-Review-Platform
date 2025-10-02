import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookAPI } from '../services/bookService';
import { reviewAPI } from '../services/reviewService';
import { useAuth } from '../context/Authcontext';
import Loading from '../components/Loading';
import RatingDisplay from '../components/RatingDisplay';
import ReviewForm from '../components/ReviewForm';
import ReviewCard from '../components/ReviewCard';
import Pagination from '../components/Pagination';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Book state
  const [book, setBook] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [bookError, setBookError] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  // User review state
  const [userReview, setUserReview] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchBook();
    fetchReviews();
    if (isAuthenticated) {
      checkUserReview();
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    fetchReviews();
  }, [currentPage]);

  const fetchBook = async () => {
    try {
      setBookLoading(true);
      setBookError('');
      const data = await bookAPI.getBookById(id);
      setBook(data.data);
    } catch (err) {
      setBookError(err.response?.data?.message || 'Failed to fetch book details');
    } finally {
      setBookLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewsError('');
      const data = await reviewAPI.getBookReviews(id, currentPage, 10);
      setReviews(data.data);
      setTotalPages(data.totalPages);
      setTotalReviews(data.totalReviews);
      setAverageRating(data.averageRating);
    } catch (err) {
      setReviewsError(err.response?.data?.message || 'Failed to fetch reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkUserReview = async () => {
    try {
      const data = await reviewAPI.checkUserReview(id);
      setHasReviewed(data.hasReviewed);
      setUserReview(data.data);
    } catch (err) {
      console.error('Failed to check user review:', err);
    }
  };

  const handleAddReview = () => {
    if (!isAuthenticated) {
      alert('Please login to add a review');
      navigate('/login');
      return;
    }
    setShowReviewForm(true);
    setEditingReview(null);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleCancelReview = () => {
    setShowReviewForm(false);
    setEditingReview(null);
  };

  const handleSubmitReview = async (formData) => {
    try {
      setSubmitLoading(true);

      if (editingReview) {
        // Update existing review
        await reviewAPI.updateReview(editingReview._id, formData);
        alert('Review updated successfully!');
      } else {
        // Add new review
        await reviewAPI.addReview({
          bookId: id,
          ...formData,
        });
        alert('Review added successfully!');
      }

      // Refresh data
      await fetchBook();
      await fetchReviews();
      await checkUserReview();
      setShowReviewForm(false);
      setEditingReview(null);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.errors?.join(', ') ||
          'Failed to submit review'
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewAPI.deleteReview(reviewId);
      alert('Review deleted successfully!');
      
      // Refresh data
      await fetchBook();
      if (reviews.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await fetchReviews();
      }
      await checkUserReview();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleDeleteBook = async () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await bookAPI.deleteBook(id);
        alert('Book deleted successfully!');
        navigate('/');
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 600, behavior: 'smooth' });
  };

  if (bookLoading) return <Loading message="Loading book details..." />;

  if (bookError) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{bookError}</div>
        <Link to="/" style={styles.backButton}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  if (!book) return null;

  const isOwner = user && book.addedBy._id === user._id;

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>
        ← Back to Books
      </Link>

      {/* Book Information */}
      <div style={styles.bookCard}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.title}>{book.title}</h1>
            <p style={styles.author}>by {book.author}</p>
          </div>
          <span style={styles.genre}>{book.genre}</span>
        </div>

        <div style={styles.metadata}>
          <div style={styles.metadataItem}>
            <strong>Published:</strong> {book.publishedYear}
          </div>
          <div style={styles.metadataItem}>
            <strong>Added by:</strong> {book.addedBy.name}
          </div>
          <div style={styles.metadataItem}>
            <strong>Date Added:</strong>{' '}
            {new Date(book.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div style={styles.ratingSection}>
          <RatingDisplay
            averageRating={averageRating}
            totalReviews={totalReviews}
            size="large"
          />
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Description</h3>
          <p style={styles.description}>{book.description}</p>
        </div>

        {isAuthenticated && isOwner && (
          <div style={styles.actions}>
            <Link to={`/books/edit/${book._id}`} style={styles.editButton}>
              Edit Book
            </Link>
            <button onClick={handleDeleteBook} style={styles.deleteButton}>
              Delete Book
            </button>
          </div>
        )}
      </div>

      {/* Reviews Section */}
      <div style={styles.reviewsContainer}>
        <div style={styles.reviewsHeader}>
          <h2 style={styles.reviewsTitle}>Reviews ({totalReviews})</h2>
          {isAuthenticated && !hasReviewed && !showReviewForm && (
            <button onClick={handleAddReview} style={styles.addReviewButton}>
              Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <ReviewForm
            onSubmit={handleSubmitReview}
            onCancel={handleCancelReview}
            initialData={editingReview}
            loading={submitLoading}
          />
        )}

        {/* User's Existing Review - Show at top if not editing */}
        {hasReviewed && userReview && !showReviewForm && (
          <div style={styles.userReviewSection}>
            <h3 style={styles.userReviewTitle}>Your Review</h3>
            <ReviewCard
              review={userReview}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          </div>
        )}

        {/* All Reviews */}
        {reviewsError && <div style={styles.error}>{reviewsError}</div>}

        {reviewsLoading ? (
          <Loading message="Loading reviews..." />
        ) : reviews.length === 0 ? (
          <div style={styles.noReviews}>
            <p>No reviews yet. Be the first to review this book!</p>
            {isAuthenticated && !hasReviewed && (
              <button onClick={handleAddReview} style={styles.addReviewButtonSecondary}>
                Write the First Review
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={styles.reviewsList}>
              <h3 style={styles.allReviewsTitle}>All Reviews</h3>
              {reviews
                .filter((review) => !userReview || review._id !== userReview._id)
                .map((review) => (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    onEdit={handleEditReview}
                    onDelete={handleDeleteReview}
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
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '2rem',
  },
  backLink: {
    color: '#3498db',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
    fontSize: '1rem',
  },
  bookCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    gap: '1rem',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  author: {
    fontSize: '1.25rem',
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  genre: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  },
  metadata: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    marginBottom: '1.5rem',
  },
  metadataItem: {
    color: '#555',
    fontSize: '0.95rem',
  },
  ratingSection: {
    padding: '1.5rem',
    backgroundColor: '#fff9e6',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '1rem',
    borderBottom: '2px solid #3498db',
    paddingBottom: '0.5rem',
  },
  description: {
    fontSize: '1rem',
    lineHeight: '1.8',
    color: '#555',
    whiteSpace: 'pre-wrap',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    paddingTop: '1rem',
    borderTop:'1px solid #eee',
},
editButton: {
flex: 1,
padding: '0.75rem 1.5rem',
backgroundColor: '#f39c12',
color: 'white',
textDecoration: 'none',
textAlign: 'center',
borderRadius: '4px',
fontSize: '1rem',
fontWeight: '500',
},
deleteButton: {
flex: 1,
padding: '0.75rem 1.5rem',
backgroundColor: '#e74c3c',
color: 'white',
border: 'none',
borderRadius: '4px',
fontSize: '1rem',
fontWeight: '500',
cursor: 'pointer',
},
reviewsContainer: {
backgroundColor: 'white',
padding: '2rem',
borderRadius: '8px',
boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
},
reviewsHeader: {
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: '2rem',
flexWrap: 'wrap',
gap: '1rem',
},
reviewsTitle: {
fontSize: '1.75rem',
color: '#2c3e50',
},
addReviewButton: {
padding: '0.75rem 1.5rem',
backgroundColor: '#27ae60',
color: 'white',
border: 'none',
borderRadius: '4px',
fontSize: '1rem',
fontWeight: '500',
cursor: 'pointer',
},
userReviewSection: {
marginBottom: '2rem',
paddingBottom: '2rem',
borderBottom: '2px solid #eee',
},
userReviewTitle: {
fontSize: '1.25rem',
color: '#2c3e50',
marginBottom: '1rem',
},
reviewsList: {
marginTop: '2rem',
},
allReviewsTitle: {
fontSize: '1.25rem',
color: '#2c3e50',
marginBottom: '1rem',
},
noReviews: {
textAlign: 'center',
padding: '3rem',
backgroundColor: '#f8f9fa',
borderRadius: '4px',
},
addReviewButtonSecondary: {
marginTop: '1rem',
padding: '0.75rem 1.5rem',
backgroundColor: '#3498db',
color: 'white',
border: 'none',
borderRadius: '4px',
fontSize: '1rem',
cursor: 'pointer',
},
error: {
backgroundColor: '#fee',
color: '#c33',
padding: '1rem',
borderRadius: '4px',
marginBottom: '1rem',
border: '1px solid #fcc',
},
backButton: {
display: 'inline-block',
padding: '0.75rem 1.5rem',
backgroundColor: '#3498db',
color: 'white',
textDecoration: 'none',
borderRadius: '4px',
marginTop: '1rem',
},
};
export default BookDetails;
