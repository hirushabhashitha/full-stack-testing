
const mongoose = require('mongoose');
const Rating = require('../models/Rating');
const Product = require('../models/Product');

class RatingService {

    // 1. USER: එක් product එකකට එක් review එකක් පමණයි
    async addOrUpdateRating(userId, productId, ratingValue, reviewText) {

        // Validate IDs
        if (
            !mongoose.isValidObjectId(userId) ||
            !mongoose.isValidObjectId(productId)
        ) {
            throw new Error('Invalid user ID or product ID');
        }

        // Validate rating
        const rating = Number(ratingValue);

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5');
        }

        // Validate review text
        const review = String(reviewText ?? '').trim();

        if (!review) {
            throw new Error('Please write a review');
        }

        if (review.length > 1000) {
            throw new Error('Review cannot exceed 1000 characters');
        }

        // Check product exists
        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        // Check whether this user has already reviewed this product
        const existingRating = await Rating.findOne({
            user: userId,
            product: productId
        });

        if (existingRating) {
            throw new Error(
                'You have already reviewed this product. Only one review is allowed per account.'
            );
        }

        // Create a new review
        // Do not update an existing review
        let ratingDoc;

        try {
            ratingDoc = await Rating.create({
                user: userId,
                product: productId,
                rating,
                review
            });
        } catch (error) {
            // Unique index prevents duplicate reviews, including
            // simultaneous requests from the same account.
            if (error.code === 11000) {
                throw new Error(
                    'You have already reviewed this product.'
                );
            }

            throw error;
        }

        // Update average rating and count
        await this.updateProductRatingStats(productId);

        // Return populated user details
        const populatedRating = await Rating.findById(ratingDoc._id)
            .populate('user', 'username');

        return {
            message: 'Review submitted successfully',
            rating: populatedRating
        };
    }

    // 2. PUBLIC: Get all reviews for a product
    async getProductRatings(productId) {

        if (!mongoose.isValidObjectId(productId)) {
            throw new Error('Invalid product ID');
        }

        const product = await Product.findById(productId);

        if (!product) {
            throw new Error('Product not found');
        }

        return await Rating.find({ product: productId })
            .populate('user', 'username')
            .sort({ createdAt: -1 })
            .lean();
    }

    // 3. ADMIN: Delete a review if necessary
    async deleteRatingByAdmin(ratingId) {

        if (!mongoose.isValidObjectId(ratingId)) {
            throw new Error('Invalid review ID');
        }

        const ratingDoc = await Rating.findById(ratingId);

        if (!ratingDoc) {
            throw new Error('Review not found');
        }

        const productId = ratingDoc.product;

        await Rating.findByIdAndDelete(ratingId);

        await this.updateProductRatingStats(productId);

        return {
            message: 'Review deleted successfully'
        };
    }

    // 4. ADMIN: Reply to a customer's review
    async replyByAdmin(ratingId, adminReply) {

        if (!mongoose.isValidObjectId(ratingId)) {
            throw new Error('Invalid review ID');
        }

        const reply = String(adminReply ?? '').trim();

        if (!reply) {
            throw new Error('Please enter a reply');
        }

        if (reply.length > 1000) {
            throw new Error('Reply cannot exceed 1000 characters');
        }

        const ratingDoc = await Rating.findById(ratingId);

        if (!ratingDoc) {
            throw new Error('Review not found');
        }

        // Save the official store response
        ratingDoc.adminReply = reply;

        await ratingDoc.save();

        const populatedRating = await Rating.findById(ratingDoc._id)
            .populate('user', 'username');

        return {
            message: 'Store response saved successfully',
            rating: populatedRating
        };
    }

    // 5. Recalculate product rating statistics
    async updateProductRatingStats(productId) {

        const result = await Rating.aggregate([
            {
                $match: {
                    product: new mongoose.Types.ObjectId(
                        String(productId)
                    )
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: 1 },
                    average: { $avg: '$rating' }
                }
            }
        ]);

        const count = result.length > 0 ? result[0].count : 0;

        const average = result.length > 0
            ? Number(result[0].average.toFixed(1))
            : 0;

        await Product.findByIdAndUpdate(productId, {
            ratingsCount: count,
            averageRating: average
        });

        return {
            ratingsCount: count,
            averageRating: average
        };
    }
}

module.exports = new RatingService();
