console.log("====================================");
console.log("Connected");
console.log("====================================");

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tabs li");
  const productCardsContainer = document.querySelector(".product-cards");

  // fetching API
  async function fetchProductData() {
    try {
      const response = await fetch(
        "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
      );
      const data = await response.json();
      

      return data;
    } catch (error) {
      console.error("Error fetching product data:", error);
      return [];
    }
  }

  function handleTabClick(tabId) {
    tabs.forEach((tab) => tab.classList.remove("active"));
    document.getElementById(tabId).classList.add("active");
  }


  function renderProductCards(products) {
    productCardsContainer.innerHTML = "";

    if (!Array.isArray(products)) {
      console.error("Invalid or missing product data");
      return;
    }

    if (products.length === 0) {
      console.log("No products found for the selected category.");
      return;
    }

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
            <div class="card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge_text ? `<div class="badge">${product.badge_text}</div>` : ''}
            </div>
            <div class="product-details">
                <div class="title">
                <h3>${product.title}</h3>
                <li>${product.vendor}</li>
            </div>
            <div class="price">
            <p class="currentPrice">Rs ${product.price}.00</p>
            <p class="originalPrice">${product.compare_at_price}.00</p>
            <p class=" discount"> ${calculateDiscount(product.price,
              product.compare_at_price)}% Off
            </p>
            </div>
                <button>Add to Cart</button>
            </div>
        </div>
            `;

      productCardsContainer.appendChild(productCard);
    });
  }

  //calculating discount
  function calculateDiscount(price, compareAtPrice) {
    const discountPercentage =
      ((compareAtPrice - price) / compareAtPrice) * 100;
    return discountPercentage.toFixed(2);
  }

  fetchProductData().then((data) => {
    const menCategory = data.categories.find(
      (category) => category.category_name === "Men"
    );
    renderProductCards(menCategory ? menCategory.category_products : []);
  });


  tabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      const tabId = event.target.id;
      handleTabClick(tabId);

      fetchProductData().then((data) => {
        const selectedCategory = data.categories.find(
          (category) =>
            category.category_name.toLowerCase() === tabId.replace("-tab", "")
        );
        renderProductCards(
          selectedCategory ? selectedCategory.category_products : []
        );
      });
    });
  });
});
