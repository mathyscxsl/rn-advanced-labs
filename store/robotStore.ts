import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Robot, robotSchema } from "../validation/robotSchema";

type RobotInput = Omit<Robot, "id">;

interface RobotsState {
  robots: Robot[];
  selectedId?: string;

  // Actions
  create: (robot: RobotInput) => void;
  update: (id: string, robot: RobotInput) => void;
  remove: (id: string) => void;
  getById: (id: string) => Robot | undefined;
  setSelected: (id?: string) => void;
}

export const useRobotsStore = create<RobotsState>()(
  persist(
    (set, get) => ({
      robots: [],
      selectedId: undefined,

      create: (robotInput) => {
        const { robots } = get();

        if (robots.some((r) => r.name.toLowerCase() === robotInput.name.toLowerCase())) {
          throw new Error("Un robot avec ce nom existe déjà !");
        }

        const newRobot: Robot = {
          id: uuidv4(),
          ...robotInput,
        };

        robotSchema.validateSync(newRobot);

        set({ robots: [...robots, newRobot] });
      },

      update: (id, robotInput) => {
        const { robots } = get();

        if (
          robots.some(
            (r) => r.id !== id && r.name.toLowerCase() === robotInput.name.toLowerCase()
          )
        ) {
          throw new Error("Un robot avec ce nom existe déjà !");
        }

        const updated: Robot = { id, ...robotInput };
        robotSchema.validateSync(updated);

        set({
          robots: robots.map((r) => (r.id === id ? updated : r)),
        });
      },

      remove: (id) => {
        const { robots } = get();
        set({
          robots: robots.filter((r) => r.id !== id),
        });
      },

      getById: (id) => {
        return get().robots.find((r) => r.id === id);
      },

      setSelected: (id) => set({ selectedId: id }),
    }),
    {
      name: "robots-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
