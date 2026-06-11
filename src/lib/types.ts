/* ============================================================
   类型定义
   ============================================================ */

export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  title: string;
  category: 'nature' | 'city' | 'humanity' | 'travel';
  categoryLabel: string;
  width: number;
  height: number;
}

export interface ServiceItem {
  id: number;
  icon: string;
  name: string;
  desc: string;
  price: string;
  unit: string;
  features: string[];
  featured?: boolean;
  badge?: string;
}

export interface TestimonialItem {
  id: number;
  text: string;
  name: string;
  role: string;
  avatar: string;
  stars: number;
}

export interface GalleryFilter {
  key: string;
  label: string;
}

export interface StatItem {
  value: number;
  suffix?: string;
  label: string;
}

export interface ContactInfo {
  icon: string;
  label: string;
  value: string;
}
