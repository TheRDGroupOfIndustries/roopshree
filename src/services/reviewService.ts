import api from "@/lib/api";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email?: string;
    image?: string | null;
  };
}

export interface CreateReviewBody {
  rating: number;
  comment: string;
}

// Get all reviews for a product
export const getReviews = async (productId: string): Promise<Review[]> => {
  const res = await api.get(`/products/${productId}/reviews`);
//   console.log("getReviews:",res);
  return res.data;
};

//  Create a new review
export const addReview = async (
  productId: string,
  data: CreateReviewBody
): Promise<Review> => {
  const res = await api.post(`/products/${productId}/reviews`, data);
//   console.log("AddReview:",res);
  
  return res.data;

};

//  Delete a review
export const deleteReview = async (
  productId: string,
  reviewId: string
): Promise<{ message: string }> => {
  const res = await api.delete(`/products/${productId}/reviews`, {
    params: { reviewId },
  });
  return res.data;
};
