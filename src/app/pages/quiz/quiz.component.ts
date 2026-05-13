import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuizService } from '../../services/quiz.service';
import { QuestionCardComponent } from '../../components/question-card/question-card.component';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [FormsModule, QuestionCardComponent],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent {
  private readonly quizService = inject(QuizService);

  readonly quizState = signal<'input' | 'quiz'>('input');
  readonly jsonInput = signal('');
  readonly errorMessage = signal('');

  readonly questions = this.quizService.questions;
  readonly selectedAnswers = this.quizService.selectedAnswers;
  readonly isSubmitted = this.quizService.isSubmitted;
  readonly score = this.quizService.score;
  readonly totalQuestions = this.quizService.totalQuestions;
  readonly allAnswered = this.quizService.allAnswered;
  readonly answeredCount = this.quizService.answeredCount;

  readonly sampleJson = JSON.stringify(
    [
      {
        id: 1,
        question: '¿Cuál es la capital de Francia?',
        options: ['Madrid', 'París', 'Roma', 'Berlín'],
        correctIndex: 1,
      },
      {
        id: 2,
        question: '¿Cuántos planetas tiene el sistema solar?',
        options: ['7', '8', '9', '10', '11'],
        correctIndex: 1,
      },
      {
        id: 3,
        question: '¿En qué año llegó el hombre a la Luna?',
        options: ['1960', '1965', '1969', '1971', '1975', '1980'],
        correctIndex: 2,
      },
      {
        id: 4,
        question: '¿Cuál es el océano más grande del mundo?',
        options: [
          'Atlántico',
          'Índico',
          'Pacífico',
          'Ártico',
          'Antártico',
          'Austral',
          'Mediterráneo'
        ],
        correctIndex: 2,
      },
      {
        id: 5,
        question: '¿Qué gas es esencial para la respiración humana?',
        options: ['Nitrógeno', 'Dióxido de carbono', 'Helio', 'Oxígeno'],
        correctIndex: 3,
      },
    ],
    null,
    2
  );

  onStartQuiz(): void {
    const input = this.jsonInput().trim();
    if (!input) {
      this.errorMessage.set('Pegá un JSON con preguntas para comenzar.');
      return;
    }

    const result = this.quizService.loadQuestions(input);
    if (result.success) {
      this.errorMessage.set('');
      this.quizState.set('quiz');
    } else {
      this.errorMessage.set(result.error || 'Error desconocido.');
    }
  }

  onLoadSample(): void {
    this.jsonInput.set(this.sampleJson);
    this.errorMessage.set('');
  }

  onSelectAnswer(questionId: number, optionIndex: number): void {
    this.quizService.selectAnswer(questionId, optionIndex);
  }

  onSubmitQuiz(): void {
    this.quizService.submit();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onReset(): void {
    this.quizService.reset();
    this.jsonInput.set('');
    this.quizState.set('input');
  }

  getSelectedOption(questionId: number): number | null {
    return this.selectedAnswers().get(questionId) ?? null;
  }

  getScorePercentage(): number {
    if (this.totalQuestions() === 0) return 0;
    return Math.round((this.score() / this.totalQuestions()) * 100);
  }

  getScoreEmoji(): string {
    const pct = this.getScorePercentage();
    if (pct === 100) return '🏆';
    if (pct >= 80) return '🎉';
    if (pct >= 60) return '👍';
    if (pct >= 40) return '🤔';
    return '💪';
  }

  getScoreMessage(): string {
    const pct = this.getScorePercentage();
    if (pct === 100) return '¡Perfecto! ¡Respondiste todo correctamente!';
    if (pct >= 80) return '¡Excelente! ¡Casi perfecto!';
    if (pct >= 60) return '¡Bien hecho! Buen conocimiento.';
    if (pct >= 40) return 'No está mal, ¡seguí practicando!';
    return '¡No te rindas! Intentalo de nuevo.';
  }
}
