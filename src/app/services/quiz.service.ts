import { Injectable, signal, computed } from '@angular/core';
import { Question } from '../models/question.interface';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private readonly _questions = signal<Question[]>([]);
  private readonly _selectedAnswers = signal<Map<number, number>>(new Map());
  private readonly _isSubmitted = signal(false);

  readonly questions = this._questions.asReadonly();
  readonly selectedAnswers = this._selectedAnswers.asReadonly();
  readonly isSubmitted = this._isSubmitted.asReadonly();

  readonly score = computed(() => {
    if (!this._isSubmitted()) return 0;
    const answers = this._selectedAnswers();
    return this._questions().filter(
      (q) => answers.get(q.id) === q.correctIndex
    ).length;
  });

  readonly totalQuestions = computed(() => this._questions().length);

  readonly allAnswered = computed(() => {
    const answers = this._selectedAnswers();
    return (
      this._questions().length > 0 &&
      this._questions().every((q) => answers.has(q.id))
    );
  });

  readonly answeredCount = computed(() => {
    return this._selectedAnswers().size;
  });

  loadQuestions(json: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(json);

      if (!Array.isArray(parsed)) {
        return { success: false, error: 'El JSON debe ser un array de preguntas.' };
      }

      if (parsed.length === 0) {
        return { success: false, error: 'El array de preguntas está vacío.' };
      }

      const questions: Question[] = parsed.map((q: any, i: number) => {
        if (!q.question || !Array.isArray(q.options) || q.options.length < 2 || q.options.length > 10) {
          throw new Error(
            `Pregunta ${i + 1}: debe tener "question" (string) y "options" (array entre 2 y 10 opciones).`
          );
        }
        if (typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
          throw new Error(
            `Pregunta ${i + 1}: "correctIndex" debe ser un número entre 0 y ${q.options.length - 1}.`
          );
        }
        return {
          id: q.id ?? i + 1,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          ...(q.explanation ? { explanation: q.explanation } : {}),
        };
      });

      this._questions.set(questions);
      this._selectedAnswers.set(new Map());
      this._isSubmitted.set(false);
      return { success: true };
    } catch (e: any) {
      return {
        success: false,
        error: e.message || 'JSON inválido. Verificá el formato.',
      };
    }
  }

  selectAnswer(questionId: number, optionIndex: number): void {
    if (this._isSubmitted()) return;
    const current = new Map(this._selectedAnswers());
    current.set(questionId, optionIndex);
    this._selectedAnswers.set(current);
  }

  submit(): void {
    this._isSubmitted.set(true);
  }

  reset(): void {
    this._questions.set([]);
    this._selectedAnswers.set(new Map());
    this._isSubmitted.set(false);
  }
}
