import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { bookAPI } from "../services/bookService";
import { useAuth } from "../context/Authcontext";
import Loading from "../components/Loading";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await bookAPI.getBookById(id);
      setBook(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch book details");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
      try {
        await bookAPI.deleteBook(id);
        alert("Book deleted successfully!");
        navigate("/");
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete book");
      }
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? "#f39c12" : "#ddd",
            fontSize: "1.5rem",
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) return <Loading message="Loading book details..." />;

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>{error}</div>
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
            <strong>Date Added:</strong>{" "}
            {new Date(book.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div style={styles.rating}>
          <div>{renderStars(Math.round(book.averageRating))}</div>
          <span style={styles.ratingText}>
            {book.averageRating > 0
              ? `${book.averageRating.toFixed(1)} out of 5 (${
                  book.totalReviews
                } reviews)`
              : "No reviews yet"}
          </span>
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
            <button onClick={handleDelete} style={styles.deleteButton}>
              Delete Book
            </button>
          </div>
        )}

        <div style={styles.reviewsSection}>
          <h3 style={styles.sectionTitle}>Reviews</h3>
          <p style={styles.comingSoon}>Review system coming soon...</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2rem",
  },
  backLink: {
    color: "#3498db",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    marginBottom: "1.5rem",
    fontSize: "1rem",
  },
  bookCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.5rem",
    gap: "1rem",
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: "2rem",
    color: "#2c3e50",
    marginBottom: "0.5rem",
  },
  author: {
    fontSize: "1.25rem",
    color: "#7f8c8d",
    fontStyle: "italic",
  },
  genre: {
    backgroundColor: "#3498db",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.9rem",
    whiteSpace: "nowrap",
  },
  metadata: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5rem",
    padding: "1rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    marginBottom: "1.5rem",
  },
  metadataItem: {
    color: "#555",
    fontSize: "0.95rem",
  },
  rating: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "1rem",
    backgroundColor: "#fff9e6",
    borderRadius: "4px",
    marginBottom: "1.5rem",
  },
  ratingText: {
    color: "#7f8c8d",
    fontSize: "0.95rem",
  },
  section: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    color: "#2c3e50",
    marginBottom: "1rem",
    borderBottom: "2px solid #3498db",
    paddingBottom: "0.5rem",
  },
  description: {
    fontSize: "1rem",
    lineHeight: "1.8",
    color: "#555",
    whiteSpace: "pre-wrap",
  },
  actions: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    paddingTop: "1rem",
    borderTop: "1px solid #eee",
  },
  editButton: {
    flex: 1,
    padding: "0.75rem 1.5rem",
    backgroundColor: "#f39c12",
    color: "white",
    textDecoration: "none",
    textAlign: "center",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "500",
  },
  deleteButton: {
    flex: 1,
    padding: "0.75rem 1.5rem",
    backgroundColor: "#e74c3c",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
  },
  reviewsSection: {
    marginTop: "2rem",
    paddingTop: "2rem",
    borderTop: "2px solid #eee",
  },
  comingSoon: {
    color: "#7f8c8d",
    fontStyle: "italic",
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
  },
  error: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "1rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    border: "1px solid #fcc",
  },
  backButton: {
    display: "inline-block",
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3498db",
    color: "white",
    textDecoration: "none",
    borderRadius: "4px",
    marginTop: "1rem",
  },
};
export default BookDetails;
