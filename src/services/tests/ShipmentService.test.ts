import {jest} from '@jest/globals';
import {LowSync} from 'lowdb';

import config from '../../config';
import Database from '../../databases/database';
import ItemDTO from '../../models/ItemDTO';
import {ShipmentCreationParams} from '../../models/RequestParams';
import ShipmentDTO from '../../models/ShipmentDTO';
import ShipmentService from '../ShipmentService';
import {
  clearTestDatabases,
  getTestDatabase,
} from '../../databases/test/helpers.test';

const itemOne: ItemDTO = {
  uuid: 'ade7a73e-9825-4f87-b84b-0c02663ca4e0',
  name: 'banana',
  category: 'fruit',
  count: 20,
};
const itemTwo: ItemDTO = {
  uuid: '38464737-fcc9-415e-9241-14e529a48796',
  name: 'lychee',
  category: 'fruit',
  count: 10,
};
const shipmentOne: ShipmentDTO = {
  uuid: '1ae1d90a-4ca7-4f7b-8131-2f0a3043e63a',
  name: 'Test Shipment',
  items: [
    {
      uuid: '38464737-fcc9-415e-9241-14e529a48796',
      name: 'lychee',
      category: 'fruit',
      count: 15,
    },
  ],
};

beforeEach(() => {
  jest
    .spyOn(Database, 'getCollection')
    .mockImplementation((collection: string) => {
      return getTestDatabase(collection);
    });
  jest.spyOn(Database, 'write').mockReturnValue();
});

afterEach(() => {
  clearTestDatabases();
});

test('givenProperUUID_whenGetItem_ensureReturnItem', () => {
  // given
  const shipmentsCollection: LowSync<any> = Database.getCollection(
    config.SHIPMENT_DATABASE,
  );
  shipmentsCollection.data.push(shipmentOne);

  const shipmentService: ShipmentService = new ShipmentService();

  // when
  const shipment: ShipmentDTO = shipmentService.getShipment(shipmentOne.uuid);

  // ensure
  expect(shipment).toEqual(shipmentOne);
});

test('givenImproperUUID_whenGetItem_ensureReturnBlank', () => {
  // given
  const shipmentsCollection: LowSync<any> = Database.getCollection(
    config.SHIPMENT_DATABASE,
  );
  shipmentsCollection.data.push(shipmentOne);

  const shipmentService: ShipmentService = new ShipmentService();

  // when
  const shipment: ShipmentDTO = shipmentService.getShipment('test_uuid');

  // ensure
  expect(shipment).toEqual(undefined);
});

test('givenProperFields_whenCreateShipment_ensureReturnNewShipment', () => {
  // given
  const itemsCollection: LowSync<any> = Database.getCollection(
    config.ITEM_DATABASE,
  );
  itemsCollection.data.push(itemOne, itemTwo);
  const shipmentsCollection: LowSync<any> = Database.getCollection(
    config.SHIPMENT_DATABASE,
  );
  shipmentsCollection.data.push(shipmentOne);

  const startVersion: ItemDTO[] = [{...itemOne}, {...itemTwo}];
  const params: ShipmentCreationParams = {
    name: 'Test Shipment #4',
    items: [{...itemOne}, {...itemTwo}],
  };
  params.items[0].count = 5;
  params.items[1].count = 2;

  const shipmentService: ShipmentService = new ShipmentService();

  // when
  const shipment: ShipmentDTO = shipmentService.createShipment(params);

  // ensure
  expect(shipment.name).toBe(params.name);
  expect(shipment.items).toEqual(params.items);

  if (startVersion[0].count !== undefined)
    expect(itemsCollection.data[0].count).toBe(
      startVersion[0].count - params.items[0].count,
    );
  if (startVersion[1].count !== undefined)
    expect(itemsCollection.data[1].count).toBe(
      startVersion[1].count - params.items[1].count,
    );
});

test('givenImproperItemUUID_whenCreateShipment_ensureErrorThrownFromValidation', () => {
  // given
  const itemsCollection: LowSync<any> = Database.getCollection(
    config.ITEM_DATABASE,
  );
  itemsCollection.data.push(itemOne, itemTwo);
  const shipmentsCollection: LowSync<any> = Database.getCollection(
    config.SHIPMENT_DATABASE,
  );
  shipmentsCollection.data.push(shipmentOne);

  const params: ShipmentCreationParams = {
    name: 'Test Shipment #4',
    items: [{...itemOne}],
  };
  params.items[0].uuid = 'test_uuid';

  const shipmentService: ShipmentService = new ShipmentService();

  // ensure
  expect(() => {
    // when
    shipmentService.createShipment(params);
  }).toThrow('Invalid item to add onto shipment');
});

test('givenImproperItemCount_whenCreateShipment_ensureErrorThrownFromValidation', () => {
  // given
  const itemsCollection: LowSync<any> = Database.getCollection(
    config.ITEM_DATABASE,
  );
  itemsCollection.data.push(itemOne, itemTwo);
  const shipmentsCollection: LowSync<any> = Database.getCollection(
    config.SHIPMENT_DATABASE,
  );
  shipmentsCollection.data.push(shipmentOne);

  const params: ShipmentCreationParams = {
    name: 'Test Shipment #4',
    items: [{...itemOne}],
  };
  params.items[0].count = 100;

  const shipmentService: ShipmentService = new ShipmentService();

  // ensure
  expect(() => {
    // when
    shipmentService.createShipment(params);
  }).toThrow('Invalid count of item to add onto shipment');
});
