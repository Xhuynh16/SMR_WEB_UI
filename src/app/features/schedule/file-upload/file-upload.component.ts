import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export interface UploadedFile {
  id?: number;
  name: string;
  size: number;
  type: string;
  file?: File;
}

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {
  @Input() existingFiles: UploadedFile[] = [];
  @Output() filesChanged = new EventEmitter<UploadedFile[]>();

  files: UploadedFile[] = [];
  dragOver = false;

  // Maximum file size in bytes (50MB)
  maxFileSize = 50 * 1024 * 1024;

  // Allowed file types
  allowedFileTypes = [
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-powerpoint', // .ppt
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
    'application/pdf' // .pdf
  ];

  constructor() { }

  ngOnInit(): void {
    this.files = [...this.existingFiles];
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.processFiles(input.files);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver = false;

    if (event.dataTransfer?.files) {
      this.processFiles(event.dataTransfer.files);
    }
  }

  processFiles(fileList: FileList): void {
    Array.from(fileList).forEach(file => {
      // Check file size
      if (file.size > this.maxFileSize) {
        alert(`File "${file.name}" vượt quá kích thước tối đa (50MB).`);
        return;
      }

      // Check file type
      if (!this.allowedFileTypes.includes(file.type)) {
        alert(`File "${file.name}" không đúng định dạng. Chỉ chấp nhận các file .doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf.`);
        return;
      }

      // Add file to list
      this.files.push({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      });
    });

    this.filesChanged.emit(this.files);
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
    this.filesChanged.emit(this.files);
  }

  getFileIcon(fileName: string): string {
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
      return 'fa-file-word';
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      return 'fa-file-excel';
    } else if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
      return 'fa-file-powerpoint';
    } else if (fileName.endsWith('.pdf')) {
      return 'fa-file-pdf';
    } else {
      return 'fa-file';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
