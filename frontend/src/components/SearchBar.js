import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, onFilter, onSort, genres = [] }) => {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(search);
    }, 500);

    return () => clearTimeout(debounce);
  }, [search, onSearch]);

  const handleGenreChange = (e) => {
    const value = e.target.value;
    setGenre(value);
    onFilter(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onSort(value);
  };

  const handleClear = () => {
    setSearch('');
    setGenre('');
    setSortBy('-createdAt');
    onSearch('');
    onFilter('');
    onSort('-createdAt');
  };

  return (
    <div style={styles.container}>
      <div style={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.filtersWrapper}>
        <select value={genre} onChange={handleGenreChange} style={styles.select}>
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select value={sortBy} onChange={handleSortChange} style={styles.select}>
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="-publishedYear">Year (High to Low)</option>
          <option value="publishedYear">Year (Low to High)</option>
          <option value="-averageRating">Rating (High to Low)</option>
          <option value="averageRating">Rating (Low to High)</option>
          <option value="title">Title (A-Z)</option>
          <option value="-title">Title (Z-A)</option>
        </select>

        <button onClick={handleClear} style={styles.clearButton}>
          Clear Filters
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  searchWrapper: {
    marginBottom: '1rem',
  },
  searchInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  filtersWrapper: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  select: {
    flex: '1',
    minWidth: '150px',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  clearButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
  },
};

export default SearchBar;