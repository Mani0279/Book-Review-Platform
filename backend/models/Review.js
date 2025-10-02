import mongoose from 'mongoose';
import { Schema, Types, model } from 'mongoose';

const reviewSchema = new Schema(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Rating must be an integer',
      },
    },
    reviewText: {
      type: String,
      required: [true, 'Please provide review text'],
      trim: true,
      minlength: [10, 'Review text must be at least 10 characters long'],
      maxlength: [1000, 'Review text cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
reviewSchema.index({ bookId: 1, userId: 1 });
reviewSchema.index({ bookId: 1, createdAt: -1 });

// Ensure one review per user per book
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

// Static method to calculate average rating for a book
reviewSchema.statics.calculateAverageRating = async function (bookId) {
  const stats = await this.aggregate([
    {
      $match: { bookId:new Types.ObjectId(bookId) },
    },
    {
      $group: {
        _id: '$bookId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await model('Book').findByIdAndUpdate(bookId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    });
  } else {
    await model('Book').findByIdAndUpdate(bookId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
};

// Update average rating after save
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.bookId);
});

// Update average rating after remove
reviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.bookId);
});

// Update average rating after findOneAndDelete
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.bookId);
  }
});

export default model('Review', reviewSchema);