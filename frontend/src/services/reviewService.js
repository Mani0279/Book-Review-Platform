import api from './api';

// Review API calls
export const reviewAPI = {
  // Add review
  addReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  // Get reviews for a book
  getBookReviews: async (bookId, page = 1, limit = 10) => {
    const response = await api.get(`/reviews/book/${bookId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  // Get single review
  getReviewById: async (id) => {
    const response = await api.get(`/reviews/${id}`);
    return response.data;
  },

  // Update review
  updateReview: async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },

  // Get user's reviews
  getMyReviews: async (page = 1, limit = 10) => {
    const response = await api.get('/reviews/user/my-reviews', {
      params: { page, limit },
    });
    return response.data;
  },

  // Check if user has reviewed a book
  checkUserReview: async (bookId) => {
    const response = await api.get(`/reviews/check/${bookId}`);
    return response.data;
  },
};

export default reviewAPI;