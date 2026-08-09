import { api } from "../api/api";

export async function getTestimonials(): Promise<Testimonial[]> {
  const response = await api.get<TestimonialsResponse>(
    "/api/testimonials"
  );

  return response.testimonials || [];
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const response = await api.get<TestimonialsResponse>(
    "/api/testimonials/featured"
  );

    return response.testimonials || [];
}