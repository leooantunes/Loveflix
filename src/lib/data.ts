export type CategoryKey = "lanche" | "filme" | "sobremesa";

export const MAX_OPTIONS = 5;

export interface Category {
  key: CategoryKey;
  label: string;
  emoji: string;
  title: string;
  placeholder: string;
  gradient: string;
  suggestions: string[];
}

export const CATEGORIES: Category[] = [
  {
    key: "lanche",
    label: "Lanche",
    emoji: "🍔",
    title: "O que vamos comer?",
    placeholder: "Ex: Hambúrguer artesanal",
    gradient: "from-orange-500 to-rose-500",
    suggestions: [
      "Pizza",
      "Hambúrguer",
      "Sushi",
      "Tacos",
      "Pastel",
      "Açaí na tigela",
      "Cachorro-quente",
      "Yakisoba",
      "Esfiha",
      "Batata frita",
    ],
  },
  {
    key: "filme",
    label: "Filme",
    emoji: "🎬",
    title: "O que vamos assistir?",
    placeholder: "Ex: Comédia romântica",
    gradient: "from-rose-500 to-fuchsia-600",
    suggestions: [
      "Comédia romântica",
      "Terror",
      "Ação",
      "Animação",
      "Suspense",
      "Ficção científica",
      "Documentário",
      "Drama",
      "Série maratona",
      "Musical",
    ],
  },
  {
    key: "sobremesa",
    label: "Sobremesa",
    emoji: "🍰",
    title: "E pra adoçar?",
    placeholder: "Ex: Petit gâteau",
    gradient: "from-fuchsia-500 to-violet-600",
    suggestions: [
      "Brigadeiro",
      "Sorvete",
      "Petit gâteau",
      "Pudim",
      "Brownie",
      "Churros",
      "Fondue",
      "Pipoca doce",
      "Cheesecake",
      "Mousse de maracujá",
    ],
  },
];

export type Selections = Record<CategoryKey, string[]>;
export type Result = Record<CategoryKey, string>;

export const EMPTY_SELECTIONS: Selections = {
  lanche: [],
  filme: [],
  sobremesa: [],
};

export function pickRandom<T>(list: T[]): T {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return list[arr[0] % list.length];
}
