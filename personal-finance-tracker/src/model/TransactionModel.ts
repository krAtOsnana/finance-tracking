import mongoose, { Schema, Document } from 'mongoose';

export interface Transaction extends Document {
  amount: number;
  date: Date;
  description: string;
}

const TransactionSchema: Schema<Transaction> = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [300, 'Description must not exceed 300 characters'],
  },
});

const TransactionModel =
  (mongoose.models.Transaction as mongoose.Model<Transaction>) ||
  mongoose.model<Transaction>('Transaction', TransactionSchema);

export default TransactionModel;
