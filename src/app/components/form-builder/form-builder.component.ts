import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-form-builder',
  standalone: true,
  templateUrl: './form-builder.component.html',
  styleUrls: ['./form-builder.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class FormBuilderComponent {
  @Output() formBuilt = new EventEmitter<any>();
  formBuilderForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.formBuilderForm = this.fb.group({
      name: ['', Validators.required],
      fields: this.fb.array([]),
    });
  }

  get fields(): FormArray {
    return this.formBuilderForm.get('fields') as FormArray;
  }

  addField() {
    const fieldGroup = this.fb.group({
      label: ['', Validators.required],
      type: ['text', Validators.required],
      required: [false],
      options: this.fb.array([]),
    });
    this.fields.push(fieldGroup);
    this.emitFormData();
  }

  removeField(index: number) {
    this.fields.removeAt(index);
    this.emitFormData();
  }

  addOption(fieldIndex: number) {
    const options = this.fields.at(fieldIndex).get('options') as FormArray;
    options.push(this.fb.control('', Validators.required));
    this.emitFormData();
  }

  removeOption(fieldIndex: number, optionIndex: number) {
    const options = this.fields.at(fieldIndex).get('options') as FormArray;
    options.removeAt(optionIndex);
    this.emitFormData();
  }

  getFieldTypeLabel(type: string): string {
    const typeLabels: { [key: string]: string } = {
      'text': 'Text Input',
      'number': 'Number Input',
      'date': 'Date Picker',
      'email': 'Email Input',
      'radio': 'Radio Buttons',
      'select': 'Dropdown',
      'checkbox': 'Checkbox',
      'textarea': 'Text Area'
    };
    return typeLabels[type] || 'Unknown';
  }

  submitForm() {
    // Mark all fields as touched to show validation errors
    this.formBuilderForm.markAllAsTouched();
    
    if (this.formBuilderForm.valid) {
      const payload = {
        ...this.formBuilderForm.value,
        createdBy: '64e1234567abcd1234567890', // replace with real adminId
      };

      // Emit the form data to parent component
      this.formBuilt.emit(payload);

      this.http.post('http://localhost:5000/api/forms', payload).subscribe({
        next: () => alert('Form created successfully!'),
        error: () => alert('Error creating form'),
      });
    }
  }

  private emitFormData() {
    if (this.formBuilderForm.valid) {
      const payload = {
        ...this.formBuilderForm.value,
        createdBy: '64e1234567abcd1234567890',
      };
      this.formBuilt.emit(payload);
    }
  }
}
