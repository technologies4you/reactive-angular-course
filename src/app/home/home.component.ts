import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { Observable } from 'rxjs';
import { Constants } from '../shared/constants';
import { CoursesStore } from '../services/courses.store';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    private coursesStore: CoursesStore
  ) { }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    this.beginnerCourses$ = this.coursesStore.filterByCategory(Constants.BEGINNER);
    this.advancedCourses$ = this.coursesStore.filterByCategory(Constants.ADVANCED);
  }

}




