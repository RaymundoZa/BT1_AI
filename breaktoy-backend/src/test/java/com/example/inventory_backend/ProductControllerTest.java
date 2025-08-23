package com.example.inventory_backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.when;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean

    private InventoryMetricsService inventoryMetricsService;

    private ProductService productService;


    // Test GET vacío
    @Test
    public void testGetAllProducts_EmptyList() throws Exception {
        when(productService.getProductList()).thenReturn(new ArrayList<>());

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    // Test POST con producto válido
    @Test
    public void testCreateProduct_Valid() throws Exception {
        List<Product> products = new ArrayList<>();
        when(productService.getProductList()).thenReturn(products);

        Product newProduct = new Product();
        newProduct.setName("Pepsi");
        newProduct.setCategory("Drink");
        newProduct.setUnitPrice(11.0);
        newProduct.setQuantityInStock(15);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProduct)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Pepsi"));
    }

    // Test POST con producto inválido (sin nombre)
    @Test
    public void testCreateProduct_Invalid() throws Exception {
        when(productService.getProductList()).thenReturn(new ArrayList<>());

        Product newProduct = new Product();
        newProduct.setCategory("Drink");
        newProduct.setUnitPrice(11.0);
        newProduct.setQuantityInStock(15);

        mockMvc.perform(post("/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProduct)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.name").exists());
    }

    @Test
    public void testGetProductById_Found() throws Exception {
        Product product = new Product();
        product.setId(1L);
        product.setName("Pepsi");
        when(productService.findById(1L)).thenReturn(Optional.of(product));

        mockMvc.perform(get("/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.name").value("Pepsi"));
    }

    @Test
    public void testGetProductById_NotFound() throws Exception {
        when(productService.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/products/99"))
                .andExpect(status().isNotFound());
    }
}
