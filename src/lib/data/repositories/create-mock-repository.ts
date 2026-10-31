import { useDevSettings } from "@/lib/data/dev-settings";
import { ENTITIES, type EntityName, type EntityRecord } from "@/lib/data/entities";
import { useDataStore } from "@/lib/data/store";
import { createId } from "@/lib/id";

export class NotFoundError extends Error {
  constructor(entity: EntityName, id: string) {
    super(`${entity}/${id} not found`);
    this.name = "NotFoundError";
  }
}

/** A simulated network failure, triggered by the dev toolbar's failure rate. */
export class MockNetworkError extends Error {
  constructor() {
    super("Simulated network error. Try again.");
    this.name = "MockNetworkError";
  }
}

export type ListOptions<T> = {
  where?: (record: T) => boolean;
  sortBy?: (a: T, b: T) => number;
};

/**
 * The contract every data source implements. Async on purpose: today it resolves
 * from localStorage, but a future network implementation can keep the same shape.
 */
export type Repository<E extends EntityName> = {
  list: (options?: ListOptions<EntityRecord<E>>) => Promise<EntityRecord<E>[]>;
  get: (id: string) => Promise<EntityRecord<E>>;
  create: (input: Omit<EntityRecord<E>, "id">) => Promise<EntityRecord<E>>;
  update: (id: string, patch: Partial<Omit<EntityRecord<E>, "id">>) => Promise<EntityRecord<E>>;
  remove: (id: string) => Promise<void>;
};

async function simulateNetwork() {
  const { latencyMs, failureRate } = useDevSettings.getState();
  const [min, max] = latencyMs;
  const delay = min + Math.random() * Math.max(0, max - min);
  if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
  if (failureRate > 0 && Math.random() < failureRate) throw new MockNetworkError();
}

/** Builds a repository for one entity, backed by the persisted mock store. */
export function createMockRepository<E extends EntityName>(entity: E): Repository<E> {
  const { schema, prefix } = ENTITIES[entity];
  const table = () => useDataStore.getState().tables[entity] as Record<string, EntityRecord<E>>;
  // Callers get copies so they can never mutate stored records by accident.
  const copy = <T>(value: T): T => structuredClone(value);
  const validate = (record: unknown) => schema.parse(record) as EntityRecord<E>;

  const findOrThrow = (id: string) => {
    const record = table()[id];
    if (!record) throw new NotFoundError(entity, id);
    return record;
  };

  return {
    async list({ where, sortBy } = {}) {
      await simulateNetwork();
      let records = Object.values(table());
      if (where) records = records.filter(where);
      if (sortBy) records = [...records].sort(sortBy);
      return copy(records);
    },
    async get(id) {
      await simulateNetwork();
      return copy(findOrThrow(id));
    },
    async create(input) {
      await simulateNetwork();
      const record = validate({ ...input, id: createId(prefix) });
      useDataStore.getState().put(entity, record);
      return copy(record);
    },
    async update(id, patch) {
      await simulateNetwork();
      const record = validate({ ...findOrThrow(id), ...patch, id });
      useDataStore.getState().put(entity, record);
      return copy(record);
    },
    async remove(id) {
      await simulateNetwork();
      findOrThrow(id);
      useDataStore.getState().remove(entity, id);
    },
  };
}
