export interface Perfume {
  id: string;
  name: string;
  category: "mens" | "womens";
  image: string;
  description: string;
  popular: boolean;
  sizes: {
    ml: number;
    price: number;
  }[];
}

export const perfumes: Perfume[] = [
  // Mens Perfumes
  {
    id: "sauvage",
    name: "Sauvage",
    category: "mens",
    image: "sauvage.jpeg",
    description:
      "A fresh and spicy fragrance with ambroxan. Perfect for the modern gentleman.",
    popular: true,
    sizes: [
      { ml: 3, price: 99 },
      { ml: 6, price: 199 },
      { ml: 10, price: 299 },
      { ml: 15, price: 449 },
      { ml: 30, price: 849 },
      { ml: 50, price: 1449 },
    ],
  },
  {
    id: "cool-water",
    name: "Cool Water",
    category: "mens",
    image: "cool_water.jpeg",
    description:
      "Fresh citrus and aquatic notes that evoke a coastal paradise.",
    popular: true,
    sizes: [
      { ml: 3, price: 99 },
      { ml: 6, price: 199 },
      { ml: 10, price: 299 },
      { ml: 15, price: 449 },
      { ml: 30, price: 849 },
      { ml: 50, price: 1449 },
    ],
  },
  {
    id: "blue-de-chanel",
    name: "Blue de Chanel",
    category: "mens",
    image: "blue_de_chanel.jpeg",
    description:
      "Deep, sophisticated notes of incense and sandalwood for elegance.",
    popular: true,
    sizes: [
      { ml: 3, price: 99 },
      { ml: 6, price: 199 },
      { ml: 10, price: 299 },
      { ml: 15, price: 449 },
      { ml: 30, price: 849 },
      { ml: 50, price: 1449 },
    ],
  },
  {
    id: "vampire-blood",
    name: "Vampire Blood",
    category: "womens",
    image: "vampire_blood.jpeg",
    description: "A dark and mysterious fragrance with deep fruity notes.",
    popular: true,
    sizes: [
      { ml: 3, price: 99 },
      { ml: 6, price: 199 },
      { ml: 10, price: 299 },
      { ml: 15, price: 449 },
      { ml: 30, price: 849 },
      { ml: 50, price: 1449 },
    ],
  },

  // Womens Perfumes
  {
    id: "good-girl",
    name: "Good Girl",
    category: "womens",
    image: "good_girl.jpeg",
    description:
      "A luxurious blend of almond and coffee with sensual undertones.",
    popular: true,
    sizes: [
      { ml: 3, price: 99 },
      { ml: 6, price: 199 },
      { ml: 10, price: 299 },
      { ml: 15, price: 449 },
      { ml: 30, price: 849 },
      { ml: 50, price: 1449 },
    ],
  },
];

export const getPerfumeById = (id: string): Perfume | undefined => {
  return perfumes.find((p) => p.id === id);
};

export const getPerfumesByCategory = (
  category: "mens" | "womens"
): Perfume[] => {
  return perfumes.filter((p) => p.category === category);
};

export const getPopularPerfumes = (): Perfume[] => {
  return perfumes.filter((p) => p.popular);
};
