export interface RecordHandler<T> {
  addRecord(record: T): void;
}
