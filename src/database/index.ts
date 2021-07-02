import { BaseRecord, Database, Listener } from '../models';
import { AfterSetEvent } from '../models/interfaces/afterset';
import { BeforeSetEvent } from '../models/interfaces/beforeset';
import createObserver from '../observers';

function createDatabase<T extends BaseRecord>() {
  class InMemoryDatabase implements Database<T> {
    private db: Record<string, T> = {};

    static instance: InMemoryDatabase = new InMemoryDatabase();

    private beforeAddListeners = createObserver<BeforeSetEvent<T>>();
    private afterAddListeners = createObserver<AfterSetEvent<T>>();

    private constructor() { }

    public set(newValue: T): void {
      this.beforeAddListeners.publish({
        newValue: newValue,
        value: this.db[newValue.id],
      });

      this.db[newValue.id] = newValue;

      this.afterAddListeners.publish({
        value: newValue,
      })
    }

    public get(id: string): T {
      return this.db[id];
    }

    public onAfterAdd(listener: Listener<AfterSetEvent<T>>): () => void {
      return this.afterAddListeners.subscribe(listener);
    }

    public onBeforeAdd(listener: Listener<BeforeSetEvent<T>>): () => void {
      return this.beforeAddListeners.subscribe(listener);
    }

    public visit(visitor: (item: T) => void): void {
      Object.values(this.db).forEach(visitor);
    }

    selectBest(scoreStrategy: (item: T) => number): T | undefined {
      const found: {
        max: number;
        item: T | undefined;
      } = {
        max: 0,
        item: undefined,
      }

      Object.values(this.db).reduce((f, item) => {
        const score = scoreStrategy(item);
        if (score > f.max) {
          f.max = score;
          f.item = item;
        }

        return f;
      }, found);

      return found.item;
    }
  }
  return InMemoryDatabase;
}

export default createDatabase;
