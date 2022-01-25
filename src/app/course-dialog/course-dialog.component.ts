import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { CoursesStore } from '../services/courses.store';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.scss'],
  providers: [
    LoadingService,
    MessagesService
  ]
})
export class CourseDialogComponent implements OnDestroy {

  form: FormGroup;

  course: Course;
  subscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesStore: CoursesStore
  ) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });

  }

  save() {
    const changes = this.form.value;

    this.subscription = this.coursesStore.saveCourse(this.course.id, changes).subscribe();
    this.dialogRef.close(changes);
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
