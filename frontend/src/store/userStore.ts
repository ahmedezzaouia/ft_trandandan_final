import { fetchLoggedUser } from "@/services";
import { create, StateCreator } from "zustand";
import {
  persist,
  devtools,
  PersistOptions,
  DevtoolsOptions,
  createJSONStorage 
} from "zustand/middleware";
import { User } from "@/types";

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  getUser: () => Promise<void>;
}

type MyPersist = (
  config: StateCreator<UserStore>,
  options: PersistOptions<UserStore>
) => StateCreator<UserStore>;

type MyDevTools = (
  config: StateCreator<UserStore>,
  options: DevtoolsOptions
) => StateCreator<UserStore>;

const useUserStore = create<UserStore>(
  (persist as MyPersist)(
    (devtools as MyDevTools)(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        getUser: async () => {
          try {
            const newUser = await fetchLoggedUser();
            set({ user: newUser });
          } catch (error) {
            console.error("Error fetching user:", error);
          }
        },
      }),
      { name: "user-store-devtools" } // Name for devtools
    ),
    {
      name: "user-store",
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);


const useChannelStore = create((set) => ({
  channel: 'general', // Default channel
  setChannel: (newChannel : string) => set({ channel: newChannel }),
}));

const userNameStore = create((set) => ({
  username: '', // Default channel
  setUsername: (newUsername : string) => set({ username: newUsername }),
}));

// declare a boolean state for direct messages
const directMessageStore = create((set) => ({
  directMessage: false, // Default channel
  setDirectMessage: (newDirectMessage : boolean) => set({ directMessage: newDirectMessage }),
}));

export default useUserStore;
export { useChannelStore };
export { userNameStore };
export { directMessageStore };
