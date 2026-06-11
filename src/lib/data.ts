import type { GalleryItem, ServiceItem, TestimonialItem, GalleryFilter, StatItem, ContactInfo } from './types';

export const NAV_LINKS = [
  { href: '#home', label: '首页' },
  { href: '#gallery', label: '作品' },
  { href: '#about', label: '关于' },
  { href: '#services', label: '服务' },
  { href: '#testimonials', label: '评价' },
  { href: '#contact', label: '联系' },
] as const;

export const GALLERY_FILTERS: GalleryFilter[] = [
  { key: 'all', label: '全部' },
  { key: 'nature', label: '自然风光' },
  { key: 'city', label: '城市建筑' },
  { key: 'humanity', label: '人文纪实' },
  { key: 'travel', label: '旅行随笔' },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80', alt: '远山与湖泊', title: '远山与湖泊', category: 'nature', categoryLabel: '自然风光', width: 600, height: 400 },
  { id: 2, src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80', alt: '森林光影', title: '森林光影', category: 'nature', categoryLabel: '自然风光', width: 600, height: 400 },
  { id: 3, src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600&q=80', alt: '秋色山谷', title: '秋色山谷', category: 'nature', categoryLabel: '自然风光', width: 600, height: 400 },
  { id: 4, src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80', alt: '瀑布奔流', title: '瀑布奔流', category: 'nature', categoryLabel: '自然风光', width: 600, height: 800 },
  { id: 5, src: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&q=80', alt: '城市天际线', title: '城市天际线', category: 'city', categoryLabel: '城市建筑', width: 600, height: 338 },
  { id: 6, src: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&q=80', alt: '都市夜景', title: '都市夜景', category: 'city', categoryLabel: '城市建筑', width: 600, height: 400 },
  { id: 7, src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&q=80', alt: '现代建筑', title: '现代建筑', category: 'city', categoryLabel: '城市建筑', width: 600, height: 900 },
  { id: 8, src: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&q=80', alt: '街角日常', title: '街角日常', category: 'humanity', categoryLabel: '人文纪实', width: 600, height: 400 },
  { id: 9, src: 'https://images.unsplash.com/photo-1544006659-f0b21826ce1d?w=600&q=80', alt: '市集烟火', title: '市集烟火', category: 'humanity', categoryLabel: '人文纪实', width: 600, height: 750 },
  { id: 10, src: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80', alt: '旅途风景', title: '旅途风景', category: 'travel', categoryLabel: '旅行随笔', width: 600, height: 400 },
  { id: 11, src: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=600&q=80', alt: '海岸线', title: '海岸线', category: 'travel', categoryLabel: '旅行随笔', width: 600, height: 400 },
  { id: 12, src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80', alt: '公路旅行', title: '公路旅行', category: 'travel', categoryLabel: '旅行随笔', width: 600, height: 338 },
];

// Hero 全屏轮播 — 5 张精选风光摄影作品
export const HERO_SLIDES = [
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',  // 远山落日
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',  // 金色山脊
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',  // 晨雾森林
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',  // 海岸落日
  'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=1920&q=80',  // 极光星辰
];

export const ABOUT_STATS: StatItem[] = [
  { value: 12, label: '年拍摄经验' },
  { value: 28, label: '到访国家' },
  { value: 3600, suffix: '+', label: '作品数量' },
  { value: 15, label: '获奖荣誉' },
];

export const SERVICES: ServiceItem[] = [
  {
    id: 1, icon: 'Camera', name: '个人旅拍',
    desc: '一对一专属旅拍服务，跟随你的脚步记录旅途中最美的你。包含精选精修照片。',
    price: '¥3,000', unit: '/ 组起',
    features: ['2小时拍摄', '30张精修', '1个场景', '底片全送'],
  },
  {
    id: 2, icon: 'Mountain', name: '商业风光',
    desc: '为品牌、酒店、旅游局等提供高品质风光摄影服务，可用于商业广告及宣传。',
    price: '¥8,000', unit: '/ 项目起',
    features: ['全天候拍摄', '50张精修', '商业授权', '航拍服务'],
    featured: true, badge: '热门',
  },
  {
    id: 3, icon: 'Building2', name: '城市建筑',
    desc: '建筑空间摄影，为设计师、地产商提供专业的建筑内外景拍摄。',
    price: '¥5,000', unit: '/ 项目起',
    features: ['4小时拍摄', '40张精修', '多角度覆盖', '3-5个工作日内交付'],
  },
  {
    id: 4, icon: 'Wand', name: '后期修图',
    desc: '专业后期调色与精修，让你的照片焕发电影质感。提供多种风格预设。',
    price: '¥500', unit: '/ 张起',
    features: ['专业调色', '人像精修', '多种风格', '24小时内交付'],
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 1, stars: 5,
    text: '亦是一位真正懂光的摄影师。他帮我拍的旅拍照片每一张都像电影海报，朋友都问我在哪里找的摄影师。强烈推荐！',
    name: '小雅', role: '旅行博主',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
  },
  {
    id: 2, stars: 5,
    text: '合作过很多摄影师，亦的专业度和审美是最让我放心的。商业风光项目交付速度很快，成片质量远超预期。',
    name: 'Mark Chen', role: '酒店品牌总监',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
  },
  {
    id: 3, stars: 5,
    text: '三天的川西旅拍之旅，亦不仅帮我们记录了最美的风景，还教了我们很多摄影技巧。像朋友一样的摄影师！',
    name: '思涵', role: '自由职业者',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80',
  },
  {
    id: 4, stars: 5,
    text: '请亦来拍摄我们的度假村宣传照，他对光线的把握太绝了。晨曦和黄昏的照片美得让人窒息，客人看了都问是不是实景。',
    name: 'James Liu', role: '度假村创始人',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
  },
];

export const CONTACT_INFO: ContactInfo[] = [
  { icon: 'Mail', label: '邮箱', value: '316771979@qq.com' },
  { icon: 'MessageCircle', label: '微信', value: 'X316771979' },
  { icon: 'MapPin', label: '所在地', value: '中国 · 成都（可全球旅拍）' },
];

export const SOCIAL_LINKS = [
  { icon: 'Camera', href: '#', label: 'Instagram' },
  { icon: 'BookOpen', href: '#', label: '小红书' },
  { icon: 'MessageCircle', href: '#', label: '微信' },
  { icon: 'Globe', href: '#', label: '微博' },
];
