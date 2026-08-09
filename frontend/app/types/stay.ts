 type Stay = {
  id: number;
  name: string;
  slug: string;

  location: string;

  description?: string;
  short_description?: string;

  price_per_night: number;
  currency: string;

  max_guests: number;

  amenities?: string[];

  image_url?: string;

  video_url?: string;
    gallery?: string[];
    experience?: string[];
    virtual_experience_url?: string;
    virtual_experience? : Record<string, any>;

  status?: string;
};

 type StayResponse = {
  success: boolean;
  stay: Stay;
};

 type StaysResponse = {
  success: boolean;
  stays: Stay[];
};

type StayMedia = {
  id?: number;
  url: string;
  thumbnail_url?: string | null;
  title?: string | null;
  type?: string;
};