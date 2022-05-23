# Inventory Tracking

#### Screenshots: Imgur link coming soon
#### Replit Link: https://inventory-tracking.echang49.repl.co/docs/#/

## Usage Locally
1. Download the codebase onto a local environment
2. Download the dependencies with `npm install`. If running in a production environment, run `npm build` next.
3. Run either `npm run start:dev` or `npm run start:prod`.
4. Go to http://localhost:5000/docs/#/ (CURL and Postman works too)

## Tech Stack
- **Runtime**: Node.js
- **Language**: TypeScript (with ESM)
- **Framework**: Express.js
- **Database**: LowDB
- **Testing Framework**: Jest
- **Frontend/Documentation**: Swagger
- **Code Formatting**: Prettier using Shopify conventions
- **Code Linting**: ESLint using Shopify conventions

## Scripts
- `npm install` - Downloads dependencies (will need to be run if running locally)
- `npm run start:dev` - Run the project in a development environment
- `npm run start:prod` - Run the project in a production environment (will need to be built first)
- `npm run build` - Builds the project for running in a production environment
- `npm run test:unit` - Running the unit tests
- `npm run code:format` - Formatting the code to Shopify conventions
- `npm run code:lint` - Linting the code to Shopify TypeScript conventions
- `npm run swagger` - Builds the projects frontend/documentation

## Features (Basic CRUD Functionality)
- Create inventory items
- Edit inventory items
- View a list of inventory items
- View single inventory items
- Delete inventory items
- Ability to create “shipments”, assign inventory to the shipment, and adjust inventory appropriately
- View single shipments
