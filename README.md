# Breaktoy Inventory Manager

A **full-stack system** for inventory management.

The **backend** is built with **Spring Boot 3** and **JPA**, while the **frontend** uses **React 19 + Vite** with **TypeScript** and **Tailwind CSS**.

---

## ✨ Features

* Real persistence of products via JPA/H2 (inventory is no longer lost on restart).
* Metrics service and product service to separate business logic from the controller.
* Error handling and loading states in frontend HTTP calls.
* API base URL configurable through environment variables.
* Differentiated product types (**Product** vs **NewProduct**) for stronger type safety in TypeScript.
* Additional endpoint `GET /products/{id}` to query a specific product.

---

## 📁 Project Structure

```
breaktoy-backend/     # REST API in Spring Boot
breaktoy-frontend/    # Web interface in React
```

---

## 🔧 Requirements

* **Java 21**
* **Node.js ≥ 18**
* **Maven Wrapper** and **npm** (included in the repo)

---

## 🚀 Getting Started

### Backend

```bash
cd breaktoy-backend
# in-memory H2 database
./mvnw spring-boot:run

# run tests
./mvnw test
```

### Frontend

```bash
cd breaktoy-frontend
npm install

# start in development mode
npm run dev

# run tests
npm test
```

---

## ⚙️ Environment Variables

### Frontend (`breaktoy-frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:9090
```

You can also define additional profiles:

* `.env.development`
* `.env.production`

### Backend (`breaktoy-backend/src/main/resources/application.properties`)

```properties
spring.datasource.url=jdbc:h2:mem:inventory
spring.jpa.hibernate.ddl-auto=update
```

Adjust the URL if you want to use a different database.

---

## 📡 Main API

| Method | Path                          | Description                                |
| ------ | ----------------------------- | ------------------------------------------ |
| GET    | `/products`                   | Lists products with filters and pagination |
| GET    | `/products/{id}`              | Retrieves a specific product               |
| POST   | `/products`                   | Creates a product                          |
| PUT    | `/products/{id}`              | Updates a product                          |
| DELETE | `/products/{id}`              | Deletes a product                          |
| PATCH  | `/products/{id}/toggle-stock` | Toggles stock status                       |
| GET    | `/products/metrics`           | Global and per-category metrics            |

---

## 🧠 Business Logic Highlights

* **ProductService**: CRUD operations, filtering, sorting, and pagination.
* **InventoryMetricsService**: aggregated and category-based metrics.
* **Validation**: Jakarta Validation enforces rules for name, category, price, quantity, and dates.

---

## 🖥️ Frontend Highlights

* Hooks `useProducts` and `useMetrics` encapsulate fetching logic.
* Loading (`isLoading`) and error (`error`) states for each operation.
* Reusable components: `SearchBar`, `ProductsList`, `ProductForm`, `MetricsTable`, `MetricsGraphics`.
* Styling preserved with **Tailwind**; no visual redesign applied.

---

## 🧪 Testing

* **Backend**: `ProductControllerTest` and service-level tests.
* **Frontend**: `npm test` covers main components and hooks.

---

## 🤝 Contributing

1. Create a branch from `main`.
2. Apply your changes.
3. Run tests (`./mvnw test` and `npm test`).
4. Open a **Pull Request** describing the changes.

---

## 📄 License

This project is distributed under the terms of the **MIT License** (or the applicable license).
