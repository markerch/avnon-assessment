import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  PARAGRAHP,
  Questionaire,
  QuestionaireOption,
  QuestionaireService,
} from '../services/questionaire.service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { QuestionModalComponent } from '../question-modal/question-modal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatGridListModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatCheckboxModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent implements OnInit, OnDestroy {
  questionForm: FormGroup = this.formBuilder.group({});
  questionFields = signal<Questionaire[]>([]);
  componentDestroyed$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private questionaireService: QuestionaireService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.questionFields.set(
      _.cloneDeep(this.questionaireService.getAllQuestions())
    );
    this.buildQuestionForm();

    this.questionaireService.newQuestionAdded$
      .pipe(takeUntil(this.componentDestroyed$))
      .subscribe((question) => {
        if (
          this.questionFields().find((q) => q.label === question.label) ===
          undefined
        ) {
          console.log("ds")
          this.questionFields.update((fields) => [...fields, question]);
          this.setupFormControl(question);
        }
      });
  }

  onSubmit() {
    this.questionaireService.setAnswers(this.questionForm.value);
    this.router.navigate(['/review']);
  }

  openQuestionModal() {
    const dialogRef = this.dialog.open(QuestionModalComponent, {
      height: '600px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  isOtherSelected(hasOtherChoice: boolean, formName: string) {
    const formArray = this.questionForm.get(formName)?.value as [];
    return hasOtherChoice && formArray[formArray.length - 2] === true;
  }

  isLastPosition(index: number, questions: QuestionaireOption[] | undefined) {
    return questions && index === questions.length - 1;
  }

  private buildQuestionForm() {
    this.questionFields().forEach((question) => {
      this.setupFormControl(question);
    });
  }

  private setupFormControl(question: Questionaire) {
    if (question.type === PARAGRAHP) {
      this.questionForm.addControl(
        question.label,
        this.formBuilder.control(
          '',
          question.required ? [Validators.required] : []
        )
      );
    } else {
      this.questionForm.addControl(
        question.label,
        this.formBuilder.array(
          (question.options as QuestionaireOption[]).map(
            (option) => new FormControl(false)
          ),
          question.required ? [Validators.required] : null
        )
      );
    }
    if (question.hasOtherChoice && !question.options?.find(q => q.value === '')) {
      const formArray: FormArray = this.questionForm.get(
        question.label
      ) as FormArray;
      formArray.push(
        new FormControl('', question.required ? [Validators.required] : null)
      );
      question.options?.push({
        value: '',
        selected: false,
      });
    }
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
