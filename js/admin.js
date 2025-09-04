document.addEventListener("DOMContentLoaded", () => {
  const addProductForm = document.getElementById("add-product-form");

  if (addProductForm) {
    addProductForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(addProductForm);
      const productData = Object.fromEntries(formData.entries());

      // Convert numeric fields from string to number
      productData.price = parseFloat(productData.price);
      productData.stockQuantity = parseInt(productData.stockQuantity, 10);

      try {
        await createProduct(productData);
        alert("Product added successfully!");
        addProductForm.reset();
      } catch (error) {
        alert(`Error adding product: ${error.message}`);
      }
    });
  }
});
