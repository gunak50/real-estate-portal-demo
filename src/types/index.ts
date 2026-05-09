export type Role = 'user' | 'admin' | 'agent';

export type ListingType = 'buy' | 'rent';

export type Category = 'apartment' | 'house' | 'plot' | 'villa';

export type Status = 'pending' | 'approved' | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  createdAt: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category;
  listingType: ListingType;
  price: number;
  beds: number;
  baths: number;
  area: number; // sqft
  address: string;
  city: string;
  lat: number;
  lng: number;
  images: string[];
  amenities: string[];
  status: Status;
  featured: boolean;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  createdAt: number;
  views: number;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  visitDate?: string;
  createdAt: number;
}

export interface Message {
  id: string;
  threadId: string;
  fromUserId: string;
  fromName: string;
  text: string;
  createdAt: number;
}

export interface Thread {
  id: string;
  propertyId: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastText: string;
  lastAt: number;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover: string;
  author: string;
  publishedAt: number;
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  city: string;
  phone: string;
  email: string;
  avatar: string;
  bio: string;
  deals: number;
  rating: number;
}

export interface Filters {
  q: string;
  listingType: ListingType | 'all';
  category: Category | 'all';
  city: string | 'all';
  minPrice: number;
  maxPrice: number;
  beds: number;
  baths: number;
  amenities: string[];
  sort: 'newest' | 'price-asc' | 'price-desc' | 'beds';
}
