import * as fs from 'fs';
import { RecordHandler } from '../models';

const loader = <T>(
  fileName: string,
  recordHandler: RecordHandler<T>
) => {
  const data: T[] = JSON.parse(fs.readFileSync(fileName).toString());
  data.forEach((record) => recordHandler.addRecord(record));
};

export default loader;
