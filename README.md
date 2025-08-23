¡Claro! Aquí te lo dejo dentro de un bloque de editor de código para que solo lo copies y pegues en tu `README.md`:

---

```markdown
# Breaktoy Inventory Manager

Sistema **full-stack** para la administración de inventario.  

El **backend** está construido con **Spring Boot 3** y **JPA**, mientras que el **frontend** usa **React 19 + Vite** con **TypeScript** y **Tailwind CSS**.

---

## ✨ Novedades

- Persistencia real de productos mediante JPA/H2 (ya no se pierde el inventario al reiniciar).  
- Servicio de métricas y servicio de productos para separar la lógica de negocio del controlador.  
- Manejo de errores y estados de carga en las llamadas HTTP del frontend.  
- Base URL del API configurable vía variables de entorno.  
- Tipos de producto diferenciados (**Product** vs **NewProduct**) para mayor seguridad en TypeScript.  
- Endpoint adicional `GET /products/{id}` para consultar un producto específico.  

---

## 📁 Estructura

```

breaktoy-backend/     # API REST en Spring Boot
breaktoy-frontend/    # Interfaz web en React

````

---

## 🔧 Requisitos

- **Java 21**  
- **Node.js ≥ 18**  
- **Maven Wrapper** y **npm** (incluidos en el repo)  

---

## 🚀 Puesta en marcha

### Backend

```bash
cd breaktoy-backend
# base de datos en memoria H2
./mvnw spring-boot:run

# pruebas
./mvnw test
````

### Frontend

```bash
cd breaktoy-frontend
npm install

# arrancar en modo desarrollo
npm run dev

# ejecutar pruebas
npm test
```

---

## ⚙️ Variables de entorno

### Frontend (`breaktoy-frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:9090
```

Puedes definir perfiles adicionales:

* `.env.development`
* `.env.production`

### Backend (`breaktoy-backend/src/main/resources/application.properties`)

```properties
spring.datasource.url=jdbc:h2:mem:inventory
spring.jpa.hibernate.ddl-auto=update
```

Ajusta la URL si deseas usar otra base de datos.

---

## 📡 API principal

| Método | Ruta                          | Descripción                              |
| ------ | ----------------------------- | ---------------------------------------- |
| GET    | `/products`                   | Lista productos con filtros y paginación |
| GET    | `/products/{id}`              | Consulta un producto                     |
| POST   | `/products`                   | Crea un producto                         |
| PUT    | `/products/{id}`              | Actualiza un producto                    |
| DELETE | `/products/{id}`              | Elimina un producto                      |
| PATCH  | `/products/{id}/toggle-stock` | Alterna estado de stock                  |
| GET    | `/products/metrics`           | Métricas globales y por categoría        |

---

## 🧠 Lógica de negocio destacada

* **ProductService**: CRUD, filtros, ordenación y paginación.
* **InventoryMetricsService**: cálculo de métricas agregadas y por categoría.
* **Validaciones**: Jakarta Validation controla nombre, categoría, precio, cantidad y fechas.

---

## 🖥️ Frontend destacado

* Hooks `useProducts` y `useMetrics` encapsulan la lógica de fetching.
* Estado de carga (`isLoading`) y errores (`error`) en cada operación.
* Componentes reutilizables: `SearchBar`, `ProductsList`, `ProductForm`, `MetricsTable`, `MetricsGraphics`.
* Diseño conservado con **Tailwind**; no se realizaron cambios visuales.

---

## 🧪 Testing

* **Backend**: `ProductControllerTest` y pruebas de servicio.
* **Frontend**: pruebas con `npm test` para componentes y hooks principales.

---

## 🤝 Contribución

1. Crea una rama a partir de `main`.
2. Aplica los cambios.
3. Ejecuta pruebas (`./mvnw test` y `npm test`).
4. Abre un **Pull Request** describiendo el cambio.

---

## 📄 Licencia

Este proyecto se distribuye bajo los términos de la **MIT License** (o la licencia que corresponda).

```

