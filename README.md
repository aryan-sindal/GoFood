# GoFood — Enhanced MERN Food Delivery App

This version keeps the original customer experience largely intact and adds an isolated restaurant partner system.

## Project structure

```text
FoodDelivery/
├── frontend/
│   └── src/
│       ├── components/
│       │   └── restaurant/
│       ├── context/
│       ├── data/
│       ├── pages/
│       │   └── restaurant/
│       └── services/
└── backend/
    └── src/
        ├── controllers/
        ├── db/
        ├── middleware/
        ├── models/
        └── routes/
```

## Backend setup

Create `backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret
NODE_ENV=development
```

Then:

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:3000`.

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Customer side

- User signup/login uses the MongoDB backend.
- User session uses an HTTP-only cookie.
- Existing Home/menu/cart structure is preserved.
- Home reads food from `/api/foods` when the database contains menu items.
- If the database has no food items yet, the original local demo menu remains visible.
- Restaurant name is shown on food cards.
- Cart data is isolated by logged-in user email.

## Restaurant side

Routes:

```text
/restaurant/login
/restaurant/signup
/restaurant/dashboard
```

Restaurant features:

- Separate restaurant authentication.
- HTTP-only `restaurantToken` cookie.
- Restaurant can only read/write its own categories and foods.
- Category CRUD.
- Food CRUD.
- Food options/sizes and prices.
- Search within the restaurant menu.
- Responsive dashboard.
- Changes are persisted in MongoDB.
- Customer Home reads restaurant-created food from the database.

## Security / ownership

The frontend never decides which restaurant owns a food item or category.

The backend derives ownership from the authenticated restaurant:

```text
restaurantToken
      ↓
restaurantAuth middleware
      ↓
req.restaurant._id
      ↓
MongoDB ownership filter
```

For example, restaurant food queries use:

```js
{
  restaurantId: req.restaurant._id
}
```

This prevents one restaurant from accessing another restaurant's menu.

## Existing database compatibility

The food model supports the original project's `categoryName` field and the earlier `CategoryName` spelling while new restaurant-created items use:

- `restaurantId`
- `categoryId`
- `categoryName`
- `CategoryName`

This is intentional so the existing customer menu is not unnecessarily broken.

## Important

Do not commit or upload:

- `.env`
- MongoDB credentials
- JWT secrets
- `node_modules`
- private API keys
