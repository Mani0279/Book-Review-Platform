import React, { useState } from 'react';

const StarRating = ({ rating, onRatingChange, readonly = false, size = '2rem' }) => {
  const [hover, setHover] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            ...styles.star,
            color: star <= (hover || rating) ? '#f39c12' : '#ddd',
            fontSize: size,
            cursor: readonly ? 'default' : 'pointer',
          }}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '0.25rem',
  },
  star: {
    transition: 'color 0.2s',
    userSelect: 'none',
  },
};

export default StarRating;