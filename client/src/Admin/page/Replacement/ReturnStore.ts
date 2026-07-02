import {create} from "zustand";

interface ReturnStore {
    returnPeriod:number| null,
    setReturnPeriod:(newReturnPeriod:number)=>void,
}

const useReturnStore = create<ReturnStore>(set => ({
    returnPeriod: 10,
    setReturnPeriod: (newReturnPeriod:number) => set({ returnPeriod: newReturnPeriod }),
}));

export default useReturnStore;



