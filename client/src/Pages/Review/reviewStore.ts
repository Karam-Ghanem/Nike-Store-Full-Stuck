import { create } from 'zustand';

import { commerceApi, mapApiProduct } from '@/api/commerce';
import { getAccessToken } from '@/api/client';
import type { ReviewType } from './Data/ReviewList';
import ReviewList from './Data/ReviewList';
import type { CheckBoxItem, RadioItem } from './Data/Qustions';

export interface ApiBackedReview extends ReviewType {
  id?: number;
  rating?: number;
  productId?: number;
}

interface ReviewStore {
  reviews: ApiBackedReview[];
  checkEvalutes: CheckBoxItem[][];
  radioEvalutes: RadioItem[][];
  loadReviews: () => Promise<void>;
  addCheckBoxEvalute: (checkBoxEv: CheckBoxItem[]) => void;
  addRadioEvalute: (radioEv: RadioItem[]) => void;
  AddReview: (rev: ReviewType, productId?: number) => Promise<void>;
  removeReview: (reviewId: number) => Promise<void>;
}

const useReviewStore = create<ReviewStore>((set) => ({
  reviews: ReviewList,
  checkEvalutes: [],
  radioEvalutes: [],

  loadReviews: async () => {
    const apiReviews = await commerceApi.getReviews();
    const reviews = apiReviews.map((review) => {
      const product = review.product ? mapApiProduct(review.product) : null;
      return {
        id: review.id,
        rating: review.rating,
        productId: review.product?.id,
        name: review.user,
        img: product?.productImg,
        description: review.comment,
      };
    });
    set({ reviews: reviews.length ? reviews : [] });
  },

  AddReview: async (rev, productId) => {
    if (!getAccessToken()) throw new Error('Please log in before submitting a review.');
    const review = await commerceApi.createReview(productId ?? null, 5, rev.description);
    const product = review.product ? mapApiProduct(review.product) : null;
    set((state) => ({
      reviews: [...state.reviews, {
        id: review.id,
        rating: review.rating,
        productId: review.product?.id,
        name: review.user,
        img: product?.productImg || rev.img,
        description: review.comment,
      }],
    }));
  },

  removeReview: async (reviewId) => {
    await commerceApi.deleteReview(reviewId);
    set((state) => ({ reviews: state.reviews.filter((review) => review.id !== reviewId) }));
  },

  addCheckBoxEvalute: (checkBoxEv) => set((state) => ({ checkEvalutes: [...state.checkEvalutes, checkBoxEv] })),
  addRadioEvalute: (radioEv) => set((state) => ({ radioEvalutes: [...state.radioEvalutes, radioEv] })),
}));

export default useReviewStore;
