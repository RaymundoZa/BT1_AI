package com.example.inventory_backend;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

import java.util.concurrent.atomic.AtomicLong;

import java.util.Comparator;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.time.LocalDate;

import java.util.HashMap;


@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:8080")
public class ProductController {


    private List<Product> productList = new ArrayList<>();
    private final AtomicLong idGenerator = new AtomicLong();

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }


    @PostMapping
    public Product createProduct(@Valid @RequestBody Product product) {

        long newId = idGenerator.incrementAndGet();

        return productService.createProduct(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody Product updatedProduct) {
        return productService.updateProduct(id, updatedProduct)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());

        long newId = productService.getProductList().size() + 1;

        product.setId(newId);
        product.setCreatedAt(java.time.LocalDate.now());
        product.setUpdatedAt(java.time.LocalDate.now());
        productService.getProductList().add(product);
        return product;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return productService.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // PUT /products/{id} - To find a product and edit it :D
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody Product updatedProduct) {

        // Search for the product by ID
        for (Product product : productService.getProductList()) {
            if (product.getId().equals(id)) {
                // Update the allowed fields
                product.setName(updatedProduct.getName());
                product.setCategory(updatedProduct.getCategory());
                product.setUnitPrice(updatedProduct.getUnitPrice());
                product.setQuantityInStock(updatedProduct.getQuantityInStock());
                product.setExpirationDate(updatedProduct.getExpirationDate());
                product.setUpdatedAt(java.time.LocalDate.now());
                return ResponseEntity.ok(product);
            }
        }

        // If not found, return 404
        return ResponseEntity.notFound().build();

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {

        boolean deleted = productService.deleteProduct(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();

        for (Product product : productService.getProductList()) {
            if (product.getId().equals(id)) {
                productService.getProductList().remove(product);
                return ResponseEntity.noContent().build(); // 204 No Content
            }
        }
        return ResponseEntity.notFound().build();

    }

    @PutMapping("/{id}/instock")

    public ResponseEntity<?> markProductInStock(@PathVariable Long id,
                                                 @RequestParam(defaultValue = "10") Integer quantity) {
        return productService.markProductInStock(id, quantity)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());

    public ResponseEntity<?> markProductInStock(
            @PathVariable Long id,
            @RequestParam(defaultValue = "10") Integer quantity) {
        for (Product product : productService.getProductList()) {
            if (product.getId().equals(id)) {
                product.setQuantityInStock(quantity);
                product.setUpdatedAt(java.time.LocalDate.now());
                return ResponseEntity.ok(product);
            }
        }
        return ResponseEntity.notFound().build();

    }

    @PostMapping("/{id}/outofstock")
    public ResponseEntity<?> markProductOutOfStock(@PathVariable Long id) {

        return productService.markProductOutOfStock(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());

        for (Product product : productService.getProductList()) {
            if (product.getId().equals(id)) {
                product.setQuantityInStock(0);
                product.setUpdatedAt(java.time.LocalDate.now());
                return ResponseEntity.ok(product);
            }
        }
        return ResponseEntity.notFound().build();

    }

    @GetMapping("/metrics")
    public Map<String, Object> getInventoryMetrics() {

        return productService.getInventoryMetrics();

        Map<String, Object> metrics = new HashMap<>();

        // General metrics
        int totalStock = productService.getProductList().stream()
                .filter(p -> p.getQuantityInStock() != null)
                .mapToInt(Product::getQuantityInStock)
                .sum();

        double totalValue = productService.getProductList().stream()
                .filter(p -> p.getUnitPrice() != null && p.getQuantityInStock() != null)
                .mapToDouble(p -> p.getUnitPrice() * p.getQuantityInStock())
                .sum();

        double avgPrice = productService.getProductList().stream()
                .filter(p -> p.getQuantityInStock() != null && p.getQuantityInStock() > 0 && p.getUnitPrice() != null)
                .mapToDouble(Product::getUnitPrice)
                .average().orElse(0);

        metrics.put("totalStock", totalStock);
        metrics.put("totalValue", totalValue);
        metrics.put("avgPrice", avgPrice);

        // Metrics by category
        Map<String, Map<String, Object>> byCategory = new HashMap<>();
        productService.getProductList().stream()
                .filter(p -> p.getCategory() != null)
                .collect(Collectors.groupingBy(Product::getCategory))
                .forEach((cat, products) -> {
                    int catTotalStock = products.stream()
                            .filter(p -> p.getQuantityInStock() != null)
                            .mapToInt(Product::getQuantityInStock)
                            .sum();
                    double catTotalValue = products.stream()
                            .filter(p -> p.getUnitPrice() != null && p.getQuantityInStock() != null)
                            .mapToDouble(p -> p.getUnitPrice() * p.getQuantityInStock())
                            .sum();
                    double catAvgPrice = products.stream()
                            .filter(p -> p.getQuantityInStock() != null && p.getQuantityInStock() > 0 && p.getUnitPrice() != null)
                            .mapToDouble(Product::getUnitPrice)
                            .average().orElse(0);

                    Map<String, Object> catMetrics = new HashMap<>();
                    catMetrics.put("totalStock", catTotalStock);
                    catMetrics.put("totalValue", catTotalValue);
                    catMetrics.put("avgPrice", catAvgPrice);

                    byCategory.put(cat, catMetrics);
                });
        metrics.put("byCategory", byCategory);

        return metrics;

    }

    @GetMapping

    public List<Product> getAllProducts(@RequestParam(required = false) String name,
                                        @RequestParam(required = false) List<String> category,
                                        @RequestParam(required = false) Boolean inStock,
                                        @RequestParam(required = false) String sortBy,
                                        @RequestParam(required = false) String sortBy2,
                                        @RequestParam(required = false, defaultValue = "asc") String order,
                                        @RequestParam(required = false, defaultValue = "asc") String order2,
                                        @RequestParam(required = false, defaultValue = "0") int page,
                                        @RequestParam(required = false, defaultValue = "10") int size) {
        return productService.getAllProducts(name, category, inStock, sortBy, sortBy2, order, order2, page, size);

    public List<Product> getAllProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) List<String> category,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortBy2,
            @RequestParam(required = false, defaultValue = "asc") String order,
            @RequestParam(required = false, defaultValue = "asc") String order2,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size
    ) {
        // 1. Filtering
        Stream<Product> stream = productService.getProductList().stream();

        if (name != null && !name.isEmpty()) {
            stream = stream.filter(p -> p.getName() != null && p.getName().toLowerCase().contains(name.toLowerCase()));
        }
        if (category != null && !category.isEmpty()) {
            stream = stream.filter(p -> category.contains(p.getCategory()));
        }
        if (inStock != null) {
            stream = stream.filter(p -> inStock ? p.getQuantityInStock() > 0 : p.getQuantityInStock() == 0);
        }

        // 2. Sorting (you can sort by up to 2 fields)
        Comparator<Product> comparator = null;
        if (sortBy != null) {
            comparator = getComparator(sortBy, order);
        }
        if (sortBy2 != null) {
            Comparator<Product> secondaryComparator = getComparator(sortBy2, order2);
            comparator = comparator == null ? secondaryComparator : comparator.thenComparing(secondaryComparator);
        }
        if (comparator != null) {
            stream = stream.sorted(comparator);
        }

        // 3. Pagination (page starts at 0)
        List<Product> filteredList = stream.collect(Collectors.toList());
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, filteredList.size());
        if (fromIndex > toIndex) return new ArrayList<>();
        return filteredList.subList(fromIndex, toIndex);

    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }
}

