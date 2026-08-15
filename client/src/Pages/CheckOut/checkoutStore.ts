import { create } from 'zustand';

export interface CheckoutAddress {
  name: string;
  email: string;
  phone: string;
  saySomething: string;
}

interface CheckoutStore {
  addressForm: CheckoutAddress | null;
  location: string;
  setAddressForm: (addressForm: CheckoutAddress) => void;
  setLocation: (location: string) => void;
  reset: () => void;
}

const useCheckoutStore = create<CheckoutStore>((set) => ({
  addressForm: null,
  location: '',
  setAddressForm: (addressForm) => set({ addressForm }),
  setLocation: (location) => set({ location }),
  reset: () => set({ addressForm: null, location: '' }),
}));

export default useCheckoutStore;
