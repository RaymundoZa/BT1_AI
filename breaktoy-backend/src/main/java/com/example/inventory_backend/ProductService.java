package com.example.inventory_backend;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.Comparator;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional
    public Product createProduct(Product product) {
        product.setCreatedAt(LocalDate.now());
        product.setUpdatedAt(LocalDate.now());
        return productRepository.save(product);
    }

    @Transactional
    public Optional<Product> updateProduct(Long id, Product updatedProduct) {
        return productRepository.findById(id).map(product -> {
            product.setName(updatedProduct.getName());
            product.setCategory(updatedProduct.getCategory());
            product.setUnitPrice(updatedProduct.getUnitPrice());
            product.setQuantityInStock(updatedProduct.getQuantityInStock());
            product.setExpirationDate(updatedProduct.getExpirationDate());
            product.setUpdatedAt(LocalDate.now());
            return productRepository.save(product);
        });
    }

    @Transactional
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public Optional<Product> markProductInStock(Long id, Integer quantity) {
        return productRepository.findById(id).map(product -> {
            product.setQuantityInStock(quantity);
            product.setUpdatedAt(LocalDate.now());
            return productRepository.save(product);
        });
    }

    @Transactional
    public Optional<Product> markProductOutOfStock(Long id) {
        return productRepository.findById(id).map(product -> {
            product.setQuantityInStock(0);
            product.setUpdatedAt(LocalDate.now());
            return productRepository.save(product);
        });
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getInventoryMetrics() {
        List<Product> productList = productRepository.findAll();
        Map<String, Object> metrics = new HashMap<>();

        int totalStock = productList.stream()
                .filter(p -> p.getQuantityInStock() != null)
                .mapToInt(Product::getQuantityInStock)
                .sum();

        double totalValue = productList.stream()
                .filter(p -> p.getUnitPrice() != null && p.getQuantityInStock() != null)
                .mapToDouble(p -> p.getUnitPrice() * p.getQuantityInStock())
                .sum();

        double avgPrice = productList.stream()
                .filter(p -> p.getQuantityInStock() != null && p.getQuantityInStock() > 0 && p.getUnitPrice() != null)
                .mapToDouble(Product::getUnitPrice)
                .average().orElse(0);

        metrics.put("totalStock", totalStock);
        metrics.put("totalValue", totalValue);
        metrics.put("avgPrice", avgPrice);

        Map<String, Map<String, Object>> byCategory = new HashMap<>();
        productList.stream()
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

    @Transactional(readOnly = true)
    public List<Product> getAllProducts(String name, List<String> category, Boolean inStock,
                                        String sortBy, String sortBy2, String order, String order2,
                                        int page, int size) {
        Stream<Product> stream = productRepository.findAll().stream();

        if (name != null && !name.isEmpty()) {
            stream = stream.filter(p -> p.getName() != null && p.getName().toLowerCase().contains(name.toLowerCase()));
        }
        if (category != null && !category.isEmpty()) {
            stream = stream.filter(p -> category.contains(p.getCategory()));
        }
        if (inStock != null) {
            stream = stream.filter(p -> inStock ? p.getQuantityInStock() > 0 : p.getQuantityInStock() == 0);
        }

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

        List<Product> filteredList = stream.collect(Collectors.toList());
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, filteredList.size());
        if (fromIndex > toIndex) {
            return new ArrayList<>();
        }
        return filteredList.subList(fromIndex, toIndex);
    }

    private Comparator<Product> getComparator(String field, String order) {
        Comparator<Product> comparator;
        switch (field) {
            case "name" -> comparator = Comparator.comparing(Product::getName, Comparator.nullsLast(String::compareToIgnoreCase));
            case "category" -> comparator = Comparator.comparing(Product::getCategory, Comparator.nullsLast(String::compareToIgnoreCase));
            case "unitPrice" -> comparator = Comparator.comparing(Product::getUnitPrice, Comparator.nullsLast(Double::compareTo));
            case "quantityInStock" -> comparator = Comparator.comparing(Product::getQuantityInStock, Comparator.nullsLast(Integer::compareTo));
            case "expirationDate" -> comparator = Comparator.comparing(Product::getExpirationDate, Comparator.nullsLast(LocalDate::compareTo));
            default -> comparator = Comparator.comparing(Product::getId);
        }
        if ("desc".equalsIgnoreCase(order)) {
            comparator = comparator.reversed();
        }
        return comparator;
    }
}

