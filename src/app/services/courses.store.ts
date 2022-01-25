import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map, shareReplay, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { Course, sortCoursesBySeqNo } from "../model/course";

@Injectable({
  providedIn: 'root'
})
export class CoursesStore {

  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService
  ) {
    this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>('/api/courses')
      .pipe(
        map(response => response['payload']),
        catchError(err => {
          const message = 'Could not load courses at this time';
          this.messagesService.showErrors(message);
          return throwError(err);
        }),
        tap(courses => this.subject.next(courses))
      );

    this.loadingService.showLoaderUntilCompleted(loadCourses$)
      .subscribe();
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$
      .pipe(
        map(courses => courses
          .filter(course => course.category == category)
          .sort(sortCoursesBySeqNo)
        )
      );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    const courses = this.subject.getValue();
    const index = courses.findIndex(course => course.id == courseId);
    const newCourse: Course = {
      ...courses[index],
      ...changes
    };
    console.log(`changes: ${JSON.stringify(changes)} ..... newCourse: ${JSON.stringify(newCourse)}`);
    const newCourses: Course[] = courses.slice();
    newCourses[index] = newCourse;
    this.subject.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes)
      .pipe(
        catchError(err => {
          const message = 'Could not save course. Please try again.';
          this.messagesService.showErrors(message);
          this.subject.next(courses);
          return throwError(err);
        }),
        shareReplay()
      );
  }
}