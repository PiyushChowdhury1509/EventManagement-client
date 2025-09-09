import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilderComponent } from '../../../components/form-builder/form-builder.component';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatStepperModule, MatButtonModule, MatInputModule, MatCardModule, MatIconModule, FormBuilderComponent],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent {
  detailsForm: FormGroup;
  builtFormSnapshot: any | null = null;
  uploadedFiles: File[] = [];

  constructor(private fb: FormBuilder) {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      details: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.uploadedFiles = Array.from(input.files);
    }
  }
}
