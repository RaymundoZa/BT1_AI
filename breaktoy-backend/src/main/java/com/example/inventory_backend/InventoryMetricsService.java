package com.example.inventory_backend;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class InventoryMetricsService {

    private Map<String, Object> computeMetrics(Supplier<Stream<Product>> streamSupplier) {
        int totalStock = streamSupplier.get()
                .filter(p -> p.getQuantityInStock() != null)
                .mapToInt(Product::getQuantityInStock)
                .sum();

        double totalValue = streamSupplier.get()
                .filter(p -> p.getUnitPrice() != null && p.getQuantityInStock() != null)
                .mapToDouble(p -> p.getUnitPrice() * p.getQuantityInStock())
                .sum();

        double avgPrice = streamSupplier.get()
                .filter(p -> p.getQuantityInStock() != null && p.getQuantityInStock() > 0 && p.getUnitPrice() != null)
                .mapToDouble(Product::getUnitPrice)
                .average()
                .orElse(0);

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("totalStock", totalStock);
        metrics.put("totalValue", totalValue);
        metrics.put("avgPrice", avgPrice);
        return metrics;
    }

    public Map<String, Object> computeGlobalMetrics(List<Product> products) {
        return computeMetrics(products::stream);
    }

    public Map<String, Map<String, Object>> computeByCategory(List<Product> products) {
        return products.stream()
                .filter(p -> p.getCategory() != null)
                .collect(Collectors.groupingBy(Product::getCategory))
                .entrySet()
                .stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> computeMetrics(e.getValue()::stream)
                ));
    }
}

