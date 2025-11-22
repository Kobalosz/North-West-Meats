const API_URL = "http://localhost:5674/api";

// Product API calls
export const getAllProducts = async () => {
  const response = await fetch(`${API_URL}/products`);
  return response.json();
};

export const getProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`);
  return response.json();
};

export const createProduct = async (productData, token) => {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return response.json();
};

export const updateProduct = async (id, productData, token) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return response.json();
};

export const deleteProduct = async (id, token) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Order API calls
export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
  return response.json();
};

export const getAllOrders = async (token) => {
  const response = await fetch(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const updateOrderStatus = async (id, status, token) => {
  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return response.json();
};

// Admin API calls
export const registerAdmin = async (adminData) => {
  const response = await fetch(`${API_URL}/admin/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(adminData),
  });
  return response.json();
};

export const loginAdmin = async (credentials) => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

// Analytics API calls
export const getAnalytics = async (token) => {
  const response = await fetch(`${API_URL}/analytics`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Contact API calls
export const submitInquiry = async (inquiryData) => {
  const response = await fetch(`${API_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inquiryData),
  });
  return response.json();
};

export const getAllInquiries = async (token) => {
  const response = await fetch(`${API_URL}/contact`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const updateInquiryStatus = async (id, updateData, token) => {
  const response = await fetch(`${API_URL}/contact/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  return response.json();
};

export const deleteInquiry = async (id, token) => {
  const response = await fetch(`${API_URL}/contact/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Carousel API calls
export const getActiveCarouselSlides = async () => {
  const response = await fetch(`${API_URL}/carousel/active`);
  return response.json();
};

export const getAllCarouselSlides = async (token) => {
  const response = await fetch(`${API_URL}/carousel`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const createCarouselSlide = async (slideData, token) => {
  const response = await fetch(`${API_URL}/carousel`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(slideData),
  });
  return response.json();
};

export const updateCarouselSlide = async (id, slideData, token) => {
  const response = await fetch(`${API_URL}/carousel/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(slideData),
  });
  return response.json();
};

export const deleteCarouselSlide = async (id, token) => {
  const response = await fetch(`${API_URL}/carousel/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

// Marquee API calls
export const getActiveMarqueeItems = async () => {
  const response = await fetch(`${API_URL}/marquee/active`);
  return response.json();
};

export const getAllMarqueeItems = async (token) => {
  const response = await fetch(`${API_URL}/marquee`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};

export const createMarqueeItem = async (itemData, token) => {
  const response = await fetch(`${API_URL}/marquee`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });
  return response.json();
};

export const updateMarqueeItem = async (id, itemData, token) => {
  const response = await fetch(`${API_URL}/marquee/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(itemData),
  });
  return response.json();
};

export const deleteMarqueeItem = async (id, token) => {
  const response = await fetch(`${API_URL}/marquee/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
