import { Product } from '../stores/shopStore';

export function getRecommendations(
  products: Product[],
  skinType: string,
  skinConcerns: string[]
): Product[] {
  return products
    .filter(
      (p) =>
        p.skinTypes.includes(skinType) ||
        p.concerns.some((c) => skinConcerns.includes(c))
    )
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);
}
