const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        default: ''
    },
    adminReply: {
        type: String,
        default: ''
    }
}, { timestamps: true });

// එක් පාරිභෝගිකයෙකුට එක් ප්‍රඩක්ට් එකකට ලබා දිය හැක්කේ එක් රේටින් එකක් පමණි (Duplicate Ratings වැළැක්වීමට)
ratingSchema.index({ user: 1, product: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);