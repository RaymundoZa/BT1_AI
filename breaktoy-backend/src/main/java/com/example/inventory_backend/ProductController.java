package com.example.inventory_backend;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:8080")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public Product createProduct(@Valid @RequestBody Product product) {
        return productService.createProduct(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody Product updatedProduct) {
        return productService.updateProduct(id, updatedProduct)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        boolean deleted = productService.deleteProduct(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/instock")
    public ResponseEntity<?> markProductInStock(@PathVariable Long id,
                                                 @RequestParam(defaultValue = "10") Integer quantity) {
        return productService.markProductInStock(id, quantity)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/outofstock")
    public ResponseEntity<?> markProductOutOfStock(@PathVariable Long id) {
        return productService.markProductOutOfStock(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/metrics")
    public Map<String, Object> getInventoryMetrics() {
        return productService.getInventoryMetrics();
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

