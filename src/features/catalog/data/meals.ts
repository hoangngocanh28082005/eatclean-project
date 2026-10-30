import type { Meal } from '../models/Meal'
export type { Meal } from '../models/Meal'

const unsplash = (id: string, width = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`

export const meals: Meal[] = [
  {
    id: 'salad-ga-nuong-me-rang',
    name: 'Salad gà nướng mè rang',
    description: 'Ức gà nướng đậm đà, rau xanh tươi mát và sốt mè rang béo nhẹ.',
    calories: 420,
    protein: 35,
    price: 89000,
    imageUrl: unsplash('photo-1540420773420-3366772f4999'),
    imageAlt: 'Tô salad rau xanh tươi với ức gà nướng và cà chua bi',
    tag: 'Giảm cân',
  },
  {
    id: 'ca-hoi-ap-chao-com-gao-lut',
    name: 'Cá hồi áp chảo cơm gạo lứt',
    description: 'Cá hồi giàu omega-3, cơm gạo lứt dẻo thơm và bông cải hấp.',
    calories: 540,
    protein: 38,
    price: 119000,
    imageUrl: unsplash('photo-1467003909585-2f8a72700288'),
    imageAlt: 'Miếng cá hồi áp chảo vàng ruộm ăn kèm cơm và rau củ',
    tag: 'Tăng cơ',
  },
  {
    id: 'bowl-ngu-coc-rau-cu',
    diet: 'vegan',
    name: 'Bowl ngũ cốc & rau củ',
    description: 'Bowl màu sắc với quinoa, đậu gà, bơ và sốt chanh vàng.',
    calories: 390,
    protein: 18,
    price: 85000,
    imageUrl: unsplash('photo-1546069901-ba9599a7e63c'),
    imageAlt: 'Bowls salad ngũ cốc nhiều màu sắc với cà chua và rau lá xanh',
    tag: 'Thuần chay',
  },
  {
    id: 'banh-mi-trung-avo',
    name: 'Bánh mì nướng trứng & bơ',
    description: 'Bữa sáng nhanh gọn: bánh mì nguyên cám, bơ nghiền và trứng.',
    calories: 460,
    protein: 24,
    price: 75000,
    imageUrl: unsplash('photo-1525351484163-7529414344d8'),
    imageAlt: 'Đĩa bánh mì nướng phết bơ với trứng luộc và hành lá',
    tag: 'Bữa sáng',
  },
  {
    id: 'bowl-trung-rau-cu',
    name: 'Bowl trứng & rau củ nướng',
    description: 'Trứng chần mềm, rau củ nướng ngọt tự nhiên và sốt tahini.',
    calories: 410,
    protein: 26,
    price: 89000,
    imageUrl: unsplash('photo-1540189549336-e6e99c3679fe'),
    imageAlt: 'Tô salad rau với trứng chần và cà chua bi',
    tag: 'Giảm cân',
  },
  {
    id: 'pancake-yen-mach-chuoi',
    name: 'Pancake yến mạch chuối',
    description: 'Pancake không bột mì, ngọt tự nhiên từ chuối và mật ong.',
    calories: 330,
    protein: 14,
    price: 69000,
    imageUrl: unsplash('photo-1567620905732-2d1ec7ab7445'),
    imageAlt: 'Đĩa pancake vàng ươm ăn kèm trái cây tươi và mật ong',
    tag: 'Bữa sáng',
  },
]

export const heroImage = {
  url: unsplash('photo-1490645935967-10de6ba17061', 1200),
  alt: 'Bàn ăn với nhiều bowls bữa ăn lành mạnh được chuẩn bị sẵn',
}

export const nutritionSectionImage = {
  url: unsplash('photo-1498837167922-ddd27525d352', 1000),
  alt: 'Người chuẩn bị rau củ tươi cho bữa ăn dinh dưỡng',
}
