import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { buildSeed, SEED_VERSION } from "@/lib/mock-data/seed";
import type { EntityName, EntityRecord, Tables } from "./entities";

export const STORAGE_KEY = "continuity-demo-v1";

type DataState = {
  tables: Tables;
  put: <E extends EntityName>(entity: E, record: EntityRecord<E>) => void;
  remove: (entity: EntityName, id: string) => void;
  /** Replaces everything with a fresh copy of the fixtures. */
  resetDemoData: () => void;
};

/**
 * The mock database: normalised tables persisted to localStorage.
 * Only repositories in `lib/data/repositories` should read or write it.
 */
export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      tables: buildSeed(),
      put: (entity, record) =>
        set((state) => ({
          tables: {
            ...state.tables,
            [entity]: { ...state.tables[entity], [record.id]: record },
          },
        })),
      remove: (entity, id) =>
        set((state) => {
          const rest = { ...state.tables[entity] };
          delete rest[id];
          return { tables: { ...state.tables, [entity]: rest } };
        }),
      resetDemoData: () => set({ tables: buildSeed() }),
    }),
    {
      name: STORAGE_KEY,
      version: SEED_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ tables: state.tables }),
      // Saved demo data from an older seed is discarded rather than migrated:
      // it is sample data, and mixing seed versions would break relationships.
      migrate: () => ({ tables: buildSeed() }),
      // Rehydrated on the client by <StoreHydration />, avoiding SSR mismatches.
      skipHydration: true,
    },
  ),
);
