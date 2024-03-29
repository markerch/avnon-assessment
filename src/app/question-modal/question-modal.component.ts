import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CHECKBOX, PARAGRAHP, QuestionaireOption, QuestionaireService } from '../services/questionaire.service';

@Component({
  selector: 'app-question-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './question-modal.component.html',
  styleUrl: './question-modal.component.css',
})
export class QuestionModalComponent implements OnInit{
  newQuestionForm = this.formBuilder.group({});
  isCheckbox = false;
  isRequired = false;
  hasOtherChoice = false;
  checkBoxChoices = signal<string[]>(['option1', 'option2']);

  constructor(
    public dialogRef: MatDialogRef<QuestionModalComponent>,
    private formBuilder: FormBuilder,
    private questionaireService: QuestionaireService
  ) {}

  ngOnInit(): void {
    this.newQuestionForm.addControl(
      'questionLabel',
      this.formBuilder.control('', [Validators.required])
    );
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  checkBoxChanged(turnedOn: boolean){
    if(turnedOn){
      this.checkBoxChoices().forEach(name => {
        this.newQuestionForm.addControl(name, this.formBuilder.control('', [Validators.required]))
      })
    }
    else{
      this.checkBoxChoices().forEach(name => {
        this.newQuestionForm.removeControl(name);
      })
      this.checkBoxChoices.set(['option1', 'option2']);
    }
  }

  addChoice(){
    const optionName = `option${this.checkBoxChoices().length + 1}`;
    this.newQuestionForm.addControl(optionName, this.formBuilder.control('', [Validators.required]))
    this.checkBoxChoices.update(choices => choices.concat(optionName));
  }

  onSubmit(){
    const questionLabel = this.newQuestionForm.get('questionLabel')?.value;
    if(!this.isCheckbox){
      this.questionaireService.addQuestion({
        type: PARAGRAHP,
        label: questionLabel ? questionLabel : "",
        required: this.isRequired
      })
    }
    else{
      const options: QuestionaireOption[] = [];
      this.checkBoxChoices().forEach(optionName => {
        const answer = this.newQuestionForm.get(optionName)?.value;
        options.push({value: answer, selected: false})
      })
      if(this.hasOtherChoice){
        options.push({value: 'Other', selected: false})
      }
      this.questionaireService.addQuestion({
        type: CHECKBOX,
        label: questionLabel ? questionLabel: "",
        required: this.isRequired,
        options: options,
        hasOtherChoice: this.hasOtherChoice
      })
    }
    this.dialogRef.close();
  }

  isDisabled(){
    return !this.newQuestionForm.valid;
  }
}
