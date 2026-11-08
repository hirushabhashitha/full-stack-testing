const ratingService = require('../services/ratingService');

class RatingController {
    // 1. USER: Rating එකක් දීම හෝ Update කිරීම
    async submitRating(req, res) {
        try {
            const userId = req.userId || req.user?.id;
            const { productId } = req.params;
            const { rating, review } = req.body;

            const result = await ratingService.addOrUpdateRating(userId, productId, rating, review);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // 2. PUBLIC: Product එකකට අදාළ සියලුම Ratings බැලීම
    async getRatings(req, res) {
        try {
            const { productId } = req.params;
            const ratings = await ratingService.getProductRatings(productId);
            return res.status(200).json(ratings);
        } catch (error) {
            return res.status(404).json({ message: error.message });
        }
    }

    // 3. ADMIN: නුසුදුසු Review එකක් Delete කිරීම
    async deleteRating(req, res) {
        try {
            const { id } = req.params; // Rating ID එක
            const result = await ratingService.deleteRatingByAdmin(id);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    // 4. ADMIN: Review එකකට Reply කිරීම
    async replyRating(req, res) {
        try {
            const { id } = req.params; // Rating ID එක
            const { adminReply } = req.body;
            const result = await ratingService.replyByAdmin(id, adminReply);
            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new RatingController();