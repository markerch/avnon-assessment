import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export const PARAGRAHP = 'paragraph';
export const CHECKBOX = 'checkbox';

export interface Questionaire {
  type: string;
  label: string;
  required: boolean;
  value?: string;
  options?: QuestionaireOption[];
  hasOtherChoice?: boolean;
}

export interface QuestionaireOption {
  value: string;
  selected: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class QuestionaireService {
  newQuestionAdded$ = new ReplaySubject<Questionaire>(1);

  questionFields: Questionaire[] = [
    // { type: PARAGRAHP, label: 'Tell us about yourself.', required: true },
    // {
    //   type: CHECKBOX,
    //   label: 'What is your gender?',
    //   options: [
    //     { value: 'Male', selected: false },
    //     { value: 'Female', selected: false },
    //     { value: 'Other', selected: false },
    //   ],
    //   required: true,
    //   hasOtherChoice: true,
    // },
  ];

  private questionAnswers = null;

  addQuestion(question: Questionaire) {
    if(!this.questionFields.find(q => q.label === question.label)){
      this.questionFields.push(question);
      this.newQuestionAdded$.next(question);
    }
  }

  getAllQuestions() {
    return this.questionFields;
  }

  getAnswers() {
    return this.questionAnswers;
  }

  setAnswers(answers: any) {
    this.questionAnswers = answers;
  }

  replaceQuestions(updatedQuestions: Questionaire[]) {
    this.questionFields = updatedQuestions;
  }
}
