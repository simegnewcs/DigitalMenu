export interface MenuSubItem {
  name: string;
  nameAmharic?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  nameAmharic: string;
  description: string;
  price: number;
  category: string;
  subItems?: MenuSubItem[];
}

export interface Category {
  id: string;
  name: string;
  nameAm: string;
}
