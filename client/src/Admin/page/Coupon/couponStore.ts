import { create } from 'zustand'
import CouponList from './CouponList'

export interface CouponList {
    id: string,
    coupon: string,
}


 interface couponStore {
    coupons: CouponList[],
    addCoupon:(coupon:string)=>void,
    removeCoupon:(couponID:string)=>void,
}
const useCouponStore = create<couponStore>(set => ({
    coupons:CouponList,
    addCoupon:(coupon)=>set((store)=>({
        coupons:[...store.coupons,{coupon:coupon,id:coupon}]
    })),
    removeCoupon:(couponID)=>set((store)=>({
        coupons:store.coupons.filter(coupon=>coupon.id!==couponID)
    })),

    
}))
export default useCouponStore;