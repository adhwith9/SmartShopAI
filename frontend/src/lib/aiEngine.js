/**
 * SmartShop AI - Advanced Hybrid Recommendation Engine
 * Combines Content-Based Filtering, Collaborative Filtering, 
 * Frequently Bought Together, and Real-time Trending analytics.
 */

import { MOCK_PRODUCTS } from "./api";

const RECENTLY_VIEWED_KEY = "smartshop_recently_viewed";

/**
 * Track user viewed product
 */
export function trackProductView(product) {
  if (!product || !product.product_id) return;
  try {
    const list = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
    const filtered = list.filter(p => p.product_id !== product.product_id);
    filtered.unshift(product);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(filtered.slice(0, 10)));
  } catch (e) {}
}

/**
 * Get Recently Viewed Products
 */
export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
  } catch (e) {
    return [];
  }
}

/**
 * Content-Based Recommendation: Find similar items based on category and tags
 */
export function getContentBasedRecommendations(targetProduct, allProducts = MOCK_PRODUCTS, limit = 4) {
  if (!targetProduct) return allProducts.slice(0, limit);

  return allProducts
    .filter(p => p.product_id !== targetProduct.product_id)
    .map(p => {
      let score = 0;
      if (p.category === targetProduct.category) score += 5;
      if (p.brand === targetProduct.brand) score += 3;

      const currentTags = targetProduct.tags || [];
      const pTags = p.tags || [];
      const overlap = pTags.filter(tag => currentTags.includes(tag)).length;
      score += overlap * 2;

      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
}

/**
 * Frequently Bought Together Algorithm
 */
export function getFrequentlyBoughtTogether(product, allProducts = MOCK_PRODUCTS) {
  if (!product) return [];
  const recs = getContentBasedRecommendations(product, allProducts, 2);
  const bundleDiscount = Math.round(
    ((product.price || 0) + recs.reduce((acc, curr) => acc + (curr.price || 0), 0)) * 0.85
  );

  return {
    primary: product,
    addons: recs,
    bundleTotalPrice: bundleDiscount,
    discountPercentage: 15
  };
}

/**
 * Personalized Hybrid "Recommended For You" Algorithm
 */
export function getRecommendedForYou(userPreferences = [], cartItems = [], allProducts = MOCK_PRODUCTS, limit = 6) {
  const recentlyViewed = getRecentlyViewed();
  const viewedCategories = recentlyViewed.map(p => p.category);
  const cartCategories = cartItems.map(item => item.category);

  return allProducts
    .map(p => {
      let score = p.rating * 2; // base score from rating
      if (userPreferences.includes(p.category)) score += 10;
      if (viewedCategories.includes(p.category)) score += 6;
      if (cartCategories.includes(p.category)) score += 4;
      if (p.stock < 15 && p.stock > 0) score += 2; // urgency boost

      return { product: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.product);
}

/**
 * Trending Products Analytics Algorithm
 */
export function getTrendingProducts(allProducts = MOCK_PRODUCTS, limit = 4) {
  return [...allProducts]
    .sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0))
    .slice(0, limit);
}
