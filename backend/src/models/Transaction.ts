import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  id: number; // From your dataset
  date: Date;
  amount: number;
  category: 'Revenue' | 'Expense'; // Uppercase in your dataset
  status: 'Paid' | 'Pending'; // Different values in your dataset
  user_id: string; // snake_case in your dataset
  user_profile: string; // From your dataset
  createdAt?: Date; // Your additional field
}

const TransactionSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Revenue', 'Expense'], // Uppercase to match your data
  },
  status: {
    type: String,
    required: true,
    enum: ['Paid', 'Pending'], // Matches your dataset values
    default: 'Paid',
  },
  user_id: { // snake_case to match your dataset
    type: String,
    required: true,
  },
  user_profile: { // From your dataset
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for better query performance
TransactionSchema.index({ user_id: 1, date: -1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ status: 1 });
TransactionSchema.index({ id: 1 }, { unique: true }); // Ensure unique IDs

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);