const mongoose = require('mongoose');

const breakdownYouthSchema = new mongoose.Schema(
  {
    diet: { type: Number, default: 0 },
    transport: { type: Number, default: 0 },
    home: { type: Number, default: 0 },
    electronics: { type: Number, default: 0 },
    shopping: { type: Number, default: 0 },
  },
  { _id: false }
);

const carbonResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    calculatorType: {
      type: String,
      default: 'youth',
    },
    totalWeeklyKg: {
      type: Number,
      required: true,
    },
    breakdown: {
      type: breakdownYouthSchema,
      required: true,
    },
    answers: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

carbonResultSchema.index({ userId: 1, calculatorType: 1, createdAt: -1 });
carbonResultSchema.index({ calculatorType: 1, createdAt: -1 });

module.exports = mongoose.model('CarbonResult', carbonResultSchema);
