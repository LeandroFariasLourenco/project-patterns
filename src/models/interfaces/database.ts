import { Listener } from "../types/listener";
import { AfterSetEvent } from "./afterset";
import { BaseRecord } from "./baserecord";
import { BeforeSetEvent } from "./beforeset";

export interface Database<T extends BaseRecord> {
  get(id: string): T | undefined;
  set(newValue: T): void;

  onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void;
  onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void;

  visit(visitor: (item: T) => void): void;
}
