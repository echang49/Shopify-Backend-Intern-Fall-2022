import config from './config';
import express from 'express';
import { Inventory } from './routes/Inventory';
import { Shipment } from './routes/Shipment';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/inventory', Inventory.router);
app.use('/api/shipment', Shipment.router);

app.listen(config.PORT, () => {
    console.log('App is listening on port ' + config.PORT);
});