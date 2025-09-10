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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormBuilderComponent } from '../../../components/form-builder/form-builder.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

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
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    FormBuilderComponent,
    MatSnackBarModule,
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
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.detailsForm = this.fb.group({
      name: ['', Validators.required],
      details: ['', [Validators.required, Validators.minLength(10)]],
      eventDate: [null, Validators.required],
      eventTime: ['', Validators.required],
      endDate: [null],
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
    if (
      event.dataTransfer &&
      event.dataTransfer.files &&
      event.dataTransfer.files.length
    ) {
      this.uploadedFiles = Array.from(event.dataTransfer.files);
    }
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
    this.uploadedFiles = [...this.uploadedFiles];
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onFormBuilt(payload: any) {
    this.builtFormSnapshot = payload;
  }

  formatEventDateTime(): string {
    const date: Date | null = this.detailsForm.value.eventDate || null;
    const time: string | null = this.detailsForm.value.eventTime || null;
    if (!date || !time) {
      return 'Not specified';
    }
    const dateString = new Date(date).toLocaleDateString();
    return `${dateString} ${time}`;
  }

  url = 'http://localhost:3000/api/v1/admin/createEvent';
  redirectUrl: string = '';

  publishEvent() {
    if (this.detailsForm.invalid) {
      return;
    }
    this.isSubmitting = true;
    const combinedPayload = {
      event: this.detailsForm.value,
      form: this.builtFormSnapshot,
      files: this.uploadedFiles.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
    };

    this.http
      .post(this.url, combinedPayload, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          console.log('response from api: ', response);
          this.redirectUrl = response.data._id;
          this.snackBar.open('Login successful!', 'Close', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['success-snackbar'],
          });
        },
      });
    console.log('Combined event payload (no API):', combinedPayload);
    setTimeout(() => {
      this.isSubmitting = false;
      this.router.navigate([`event/${this.redirectUrl}`]);
    }, 600);
  }
}
