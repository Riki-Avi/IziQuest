export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}
