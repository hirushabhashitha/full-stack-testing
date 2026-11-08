'use client';
import React from 'react';

export default function StarRating({ rating = 0, maxStars = 5, size = 'sm', onRateChange, readOnly = true }) {
    const starSizes = {
        sm: 'text-sm',
        md: 'text-lg',
        lg: 'text-2xl'
    };

    return (
        <div className="flex items-center space-x-0.5">
            {[...Array(maxStars)].map((_, i) => {
                const starValue = i + 1;
                const isFilled = starValue <= Math.round(rating);

                return (
                    <span
                        key={starValue}
                        onClick={() => !readOnly && onRateChange && onRateChange(starValue)}
                        className={`${starSizes[size] || starSizes.sm} ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                            } ${isFilled ? 'text-amber-400' : 'text-gray-300'} transition-all inline-block`}
                    >
                        ★
                    </span>
                );
            })}
        </div>
    );
}