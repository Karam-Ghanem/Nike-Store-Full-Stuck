import { create } from 'zustand';

import { commerceApi } from '@/api/commerce';

interface ReturnStore {
  returnPeriod: number | null;
  loadReturnPolicy: () => Promise<void>;
  setReturnPeriod: (newReturnPeriod: number) => Promise<void>;
}

const useReturnStore = create<ReturnStore>((set) => ({
  returnPeriod: 7,

  loadReturnPolicy: async () => {
    const policy = await commerceApi.getReturnPolicy();
    set({ returnPeriod: policy.return_period_days });
  },

  setReturnPeriod: async (newReturnPeriod) => {
    const policy = await commerceApi.updateReturnPolicy(newReturnPeriod);
    set({ returnPeriod: policy.return_period_days });
  },
}));

export default useReturnStore;
