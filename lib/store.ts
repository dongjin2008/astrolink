import { create } from "zustand";

interface BirthSign {
  sign: string;
  setSign: (sign: string) => void;
}

interface userId {
  userId: string;
  setUserId: (userId: string) => void;
}


export const useBirthSignStore = create<BirthSign>((set) => ({
  sign: "",
  setSign: (sign) => set({ sign }),
}));

export const useUserIdStore = create<userId>((set) => ({
  userId: "",
  setUserId: (userId) => {set({ userId })}
}))
