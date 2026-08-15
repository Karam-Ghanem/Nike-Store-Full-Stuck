import { create } from 'zustand';

import { commerceApi } from '@/api/commerce';

export interface CouponList {
  id: string;
  coupon: string;
}

interface CouponStore {
  coupons: CouponList[];
  loadCoupons: () => Promise<void>;
  addCoupon: (coupon: string) => Promise<void>;
  removeCoupon: (couponID: string) => Promise<void>;
}

const useCouponStore = create<CouponStore>((set) => ({
  coupons: [],

  loadCoupons: async () => {
    const coupons = await commerceApi.getCoupons();
    set({ coupons: coupons.map((coupon) => ({ id: String(coupon.id), coupon: coupon.code })) });
  },

  addCoupon: async (coupon) => {
    const created = await commerceApi.createCoupon(coupon.trim());
    set((state) => ({
      coupons: [...state.coupons, { id: String(created.id), coupon: created.code }],
    }));
  },

  removeCoupon: async (couponID) => {
    await commerceApi.deleteCoupon(Number(couponID));
    set((state) => ({ coupons: state.coupons.filter((coupon) => coupon.id !== couponID) }));
  },
}));

export default useCouponStore;
