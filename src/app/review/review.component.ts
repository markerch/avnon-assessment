import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import {
  Questionaire,
  QuestionaireService,
} from '../services/questionaire.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import * as _ from 'lodash';

export interface DisplayAnswer {
  label: string;
  answers: string[];
}

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatFormFieldModule,
    MatDividerModule,
    MatButtonModule,
  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent {
  answers: any;
  displayAnswers: DisplayAnswer[] = [];
  questionFields: Questionaire[];

  constructor(private questionaireService: QuestionaireService, private router: Router) {
    this.questionFields = this.questionaireService.getAllQuestions();
    this.answers = _.cloneDeep(this.questionaireService.getAnswers());
    this.organizeAnswers();
  }

  navigateBack(){
    this.router.navigate(['/']);
  }

  private organizeAnswers() {
    this.questionFields.forEach(question => {
      if (typeof this.answers[question.label] === 'string') {
        this.displayAnswers.push({
          label: question.label,
          answers: [this.answers[question.label]],
        });
      } else {
        const rawArray = this.answers[question.label] as [];
        const displayAnswer: DisplayAnswer = { label: question.label, answers: [] };
        if (typeof rawArray[rawArray.length - 1] === 'string') {
          for (let i = 0; i < rawArray.length - 1; i++) {
            if (i === rawArray.length - 2 && rawArray[i] === true) {
              displayAnswer.answers.push(
                `Other - ${rawArray[rawArray.length - 1]}`
              );
            } else if (rawArray[i] === true) {
              displayAnswer.answers.push(this.getAnswerLabel(question.label, i));
            }
          }
        } else {
          for (let i = 0; i < rawArray.length; i++) {
            if (rawArray[i] === true) {
              displayAnswer.answers.push(this.getAnswerLabel(question.label, i));
            }
          }
        }
        this.displayAnswers.push(displayAnswer);
      }
    });
  }

  private getAnswerLabel(label: string, index: number) {
    const foundedQuestion = this.questionFields.find(
      (question) => question.label === label
    );
    if (foundedQuestion && foundedQuestion.options) {
      return foundedQuestion.options[index].value;
    }
    return 'UNKNOWN LABEL';
  }
}
