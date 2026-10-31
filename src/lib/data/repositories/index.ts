import { ENTITY_NAMES, type EntityName } from "@/lib/data/entities";
import { createMockRepository, type Repository } from "./create-mock-repository";

export {
  MockNetworkError,
  NotFoundError,
  type ListOptions,
  type Repository,
} from "./create-mock-repository";

/**
 * The single entry point for data access. UI code imports `repositories`,
 * never the store or fixtures directly.
 */
export const repositories = Object.fromEntries(
  ENTITY_NAMES.map((name) => [name, createMockRepository(name)]),
) as { [E in EntityName]: Repository<E> };
