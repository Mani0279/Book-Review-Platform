import { Schema, model } from 'mongoose';

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a book title'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters long'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    author: {
      type: String,
      required: [true, 'Please provide author name'],
      trim: true,
      minlength: [2, 'Author name must be at least 2 characters long'],
      maxlength: [100, 'Author name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    genre: {
      type: String,
      required: [true, 'Please provide a genre'],
      trim: true,
      enum: {
        values: [
          'Fiction',
          'Non-Fiction',
          'Mystery',
          'Thriller',
          'Romance',
          'Science Fiction',
          'Fantasy',
          'Horror',
          'Biography',
          'History',
          'Self-Help',
          'Business',
          'Poetry',
          'Drama',
          'Adventure',
          'Other',
        ],
        message: '{VALUE} is not a valid genre',
      },
    },
    publishedYear: {
      type: Number,
      required: [true, 'Please provide published year'],
      min: [1000, 'Published year must be after 1000'],
      max: [new Date().getFullYear() + 1, 'Published year cannot be in the future'],
      validate: {
        validator: Number.isInteger,
        message: 'Published year must be a valid integer',
      },
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for search optimization
bookSchema.index({ title: 'text', author: 'text' });
bookSchema.index({ genre: 1 });
bookSchema.index({ publishedYear: -1 });
bookSchema.index({ averageRating: -1 });
bookSchema.index({ addedBy: 1 });

// Virtual populate for reviews (will be used later)
bookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'bookId',
});

export default model('Book', bookSchema);