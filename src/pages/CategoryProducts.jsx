import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../comp_css/CategoryProducts.css';

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/ecom/products/category/${categoryId}`);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  const categoryTitles = {
    'classic flavours': 'Classic Flavors',
    'premium flavours': 'Premium Flavors',
    'seasonal flavours': 'Seasonal Flavors',
    'cones and bars': 'Cones and Bars',
    'fruit based flavours': 'Fruit Based Flavors'
  };

  const addToCart = async (productId) => {
    const userId = localStorage.getItem('userid');
    if (!userId) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/ecom/cart/add-product?userId=${userId}&productId=${productId}`);
      localStorage.setItem('cartid', response.data.cartId);
      alert('Product added to Cart');
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert('Error adding product to cart. Please try again later.');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="category-products-container">
      <h1 className="category-title">{categoryTitles[categoryId] || categoryId}</h1>
      {products.length === 0 ? (
        <div className="no-products">
          <h2>No products found in this category</h2>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.productId} className="product-card">
              <div className="product-image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
              <div className="product-info">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-price">₹{product.price}</p>
                <p className="product-description">{product.description}</p>
                <div className="product-actions">
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product.productId)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="view-details-btn"
                    onClick={() => navigate(`/product/${product.productId}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts; 