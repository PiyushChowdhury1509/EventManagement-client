import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilderComponent } from '../../../components/form-builder/form-builder.component';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    FormBuilderComponent,
  ],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent {
  detailsForm: FormGroup;
  builtFormSnapshot: any | null = null;
  uploadedFiles: File[] = [];
  isDragOver = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      details: ['', [Validators.required, Validators.minLength(10)]],
      eventDate: ['', Validators.required],
      eventTime: ['', Validators.required],
      endDate: [''],
      endTime: [''],
      location: [''],
    });
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.uploadedFiles = Array.from(input.files);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;

    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files);
      this.uploadedFiles = [...this.uploadedFiles, ...files];
    }
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  publishEvent() {
    this.detailsForm.markAllAsTouched();
    if (this.detailsForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = new FormData();
      formData.append('name', this.detailsForm.value.name);
      formData.append('details', this.detailsForm.value.details);
      formData.append('eventDate', this.detailsForm.value.eventDate);
      formData.append('eventTime', this.detailsForm.value.eventTime);
      formData.append('endDate', this.detailsForm.value.endDate || '');
      formData.append('endTime', this.detailsForm.value.endTime || '');
      formData.append('location', this.detailsForm.value.location || '');
      if (this.builtFormSnapshot) {
        formData.append('form', JSON.stringify(this.builtFormSnapshot));
      }
      this.uploadedFiles.forEach((file, index) => {
        formData.append(`files`, file);
      });
      formData.append('createdAt', new Date().toISOString());
      formData.append('status', 'draft');
      this.http
        .post('https://jsonplaceholder.typicode.com/posts', {
          title: this.detailsForm.value.name,
          body: this.detailsForm.value.details,
          eventDate: this.detailsForm.value.eventDate,
          eventTime: this.detailsForm.value.eventTime,
          endDate: this.detailsForm.value.endDate,
          endTime: this.detailsForm.value.endTime,
          location: this.detailsForm.value.location,
          files: this.uploadedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
          })),
          form: this.builtFormSnapshot || null,
          timestamp: new Date().toISOString(),
        })
        .subscribe({
          next: (response) => {
            console.log('Event created successfully:', response);
            this.isSubmitting = false;
            this.snackBar.open('Event created successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar'],
            });
            setTimeout(() => {
              this.router.navigate(['/notice']);
            }, 1500);
          },
          error: (error) => {
            console.error('Error creating event:', error);
            this.isSubmitting = false;
            this.snackBar.open(
              'Failed to create event. Please try again.',
              'Close',
              {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['error-snackbar'],
              }
            );
          },
        });
    }
  }
  onFormBuilt(formData: any) {
    this.builtFormSnapshot = formData;
    console.log('Form built:', formData);
  }

  formatEventDateTime(): string {
    const eventDate = this.detailsForm.value.eventDate;
    const eventTime = this.detailsForm.value.eventTime;
    const endDate = this.detailsForm.value.endDate;
    const endTime = this.detailsForm.value.endTime;

    if (!eventDate) return 'Not specified';

    const startDate = new Date(eventDate);
    if (eventTime) {
      const [hours, minutes] = eventTime.split(':');
      startDate.setHours(parseInt(hours), parseInt(minutes));
    }

    let formatted = startDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (eventTime) {
      formatted += ` at ${eventTime}`;
    }

    if (endDate || endTime) {
      formatted += ' - ';
      if (endDate) {
        const endDateObj = new Date(endDate);
        if (endTime) {
          const [hours, minutes] = endTime.split(':');
          endDateObj.setHours(parseInt(hours), parseInt(minutes));
        }
        formatted += endDateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        if (endTime) {
          formatted += ` at ${endTime}`;
        }
      } else if (endTime) {
        formatted += endTime;
      }
    }

    return formatted;
  }
}
