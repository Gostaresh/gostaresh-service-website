export type ServiceCenter = {
  id: string;
  slug: string;
  title: string;
  city: string;
  tagline: string;
  summary: string;
  image: string;
  primary?: boolean;
  contact: {
    address: string;
    hours: string[];
    phones: string[];
    email?: string;
    mapLink?: string;
  };
  services: string[];
};

export type ServiceCenterMap = Record<string, ServiceCenter>;
