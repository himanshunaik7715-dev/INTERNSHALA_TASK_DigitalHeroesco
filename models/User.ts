import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  clerkId?: string;
  email?: string;
  isGuest: boolean;
  guestId?: string;
  subscription: 'free' | 'premium';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    clerkId: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true },
    isGuest: { type: Boolean, default: true },
    guestId: { type: String, unique: true, sparse: true },
    subscription: { type: String, enum: ['free', 'premium'], default: 'free' },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);