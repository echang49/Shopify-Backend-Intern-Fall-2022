import express from 'express';
import swaggerUi from 'swagger-ui-express';

import config from './config';
import {InventoryRouter} from './routes/inventory';
import {ShipmentRouter} from './routes/shipment';
import swaggerJson from './swagger.json';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
app.use('/api/inventory', InventoryRouter);
app.use('/api/shipment', ShipmentRouter);

app.listen(config.PORT);
