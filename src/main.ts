import express from 'express';

import config from './config';
import {InventoryRouter} from './routes/inventory';
import {ShipmentRouter} from './routes/shipment';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/api/inventory', InventoryRouter);
app.use('/api/shipment', ShipmentRouter);

app.listen(config.PORT);
