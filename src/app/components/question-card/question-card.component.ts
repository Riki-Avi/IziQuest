import { Component, input, output, computed } from '@angular/core';
import { Question } from '../../models/question.interface';

@Component({
  selector: 'app-question-card',
  standalone: true,
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.css',
})
export class QuestionCardComponent {
  question = input.required<Question>();
  questionNumber = input.required<number>();
  selectedOption = input<number | null>(null);
  isSubmitted = input<boolean>(false);

  optionSelected = output<number>();

  isCorrectAnswer = computed(() => {
    if (!this.isSubmitted()) return null;
    return this.selectedOption() === this.question().correctIndex;
  });

  onSelectOption(index: number): void {
    if (this.isSubmitted()) return;
    this.optionSelected.emit(index);
  }

  getOptionClass(index: number): string {
    const classes: string[] = ['option-btn'];

    if (this.selectedOption() === index && !this.isSubmitted()) {
      classes.push('selected');
    }

    if (this.isSubmitted()) {
      if (index === this.question().correctIndex) {
        classes.push('correct');
      } else if (this.selectedOption() === index) {
        classes.push('incorrect');
      }
    }

    return classes.join(' ');
  }
}
