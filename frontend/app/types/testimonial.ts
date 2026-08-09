type Testimonial = {
  id: number;
  name: string;
  role: string | null;
  location: string | null;
  quote: string;
  image: string | null;
  rating: number;
  featured: boolean;
};

type TestimonialsResponse = {
  success: boolean;
  testimonials: Testimonial[];
};

