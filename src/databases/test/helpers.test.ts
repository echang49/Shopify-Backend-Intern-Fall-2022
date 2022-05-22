import {LowSync, JSONFileSync} from 'lowdb';

let testCollections: {[key: string]: LowSync<any>} = {};

export const getTestDatabase = (collection: string) => {
  if (testCollections[collection] === undefined) {
    testCollections[collection] = new LowSync(new JSONFileSync('test'));
    testCollections[collection].read();
    testCollections[collection].data = [];
  }
  return testCollections[collection];
};

export const clearTestDatabases = () => {
  testCollections = {};
};
