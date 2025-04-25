export interface Nutrition {
  name: string;
  weight: string;
  height: string;
  age: string;
  gender: 'masc' | 'fem' | 'other';
  objective: 'lose weight' | 'gain muscle' | 'gain muscle mass';
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface NutritionResponse {
  nome: string;
  sexo: string;
  idade: number;
  altura: number;
  peso: number;
  objetivo: string;
  refeicoes: {
    horario: string;
    nome: string;
    alimentos: string[];
  }[];
  suplementos: string[];
}
