import React from 'react';

const RatingDisplay = ({ averageRating, totalReviews, size = 'medium' }) => {
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
          <span key={i} style={{ color: '#f39c12', position: 'relative' }}>
            ★
            <span style={{ ...styles.halfStar }}>★</span>
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

  const sizeStyles = {
    small: { fontSize: '1rem', gap: '0.25rem' },
    medium: { fontSize: '1.5rem', gap: '0.25rem' },
    large: { fontSize: '2rem', gap: '0.5rem' },
  };

  return (
    <div style={styles.container}>
      <div style={{ ...styles.stars, ...sizeStyles[size] }}>
        {renderStars(averageRating)}
      </div>
      <div style={styles.info}>
        <span style={styles.rating}>
          {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
        </span>
        <span style={styles.count}>
          ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  stars: {
    display: 'flex',
  },
  halfStar: {
    position: 'absolute',
    left: 0,
    top: 0,
    color: '#ddd',
    clipPath: 'inset(0 50% 0 0)',
  },
  info: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
  },
  rating: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  count: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
  },
};

export default RatingDisplay;