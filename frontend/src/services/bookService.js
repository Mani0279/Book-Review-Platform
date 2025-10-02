import api from './api';

// Book API calls
export const bookAPI = {
  // Get all books with pagination, search, filter
  getAllBooks: async (page = 1, limit = 5, search = '', genre = '', sortBy = '-createdAt') => {
    const response = await api.get('/books', {
      params: { page, limit, search, genre, sortBy },
    });
    return response.data;
  },

  // Get single book by ID
  getBookById: async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  // Add new book
  addBook: async (bookData) => {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  // Update book
  updateBook: async (id, bookData) => {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  // Delete book
  deleteBook: async (id) => {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  // Get user's books
  getMyBooks: async (page = 1, limit = 10) => {
    const response = await api.get('/books/user/my-books', {
      params: { page, limit },
    });
    return response.data;
  },

  // Get all genres
  getGenres: async () => {
    const response = await api.get('/books/genres');
    return response.data;
  },
};

export default bookAPI;