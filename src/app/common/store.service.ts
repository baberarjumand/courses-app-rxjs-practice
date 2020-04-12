import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Subject, timer } from "rxjs";
import { Course } from "../model/course";
import { createHttpObservable } from "./util";
import { tap, map, shareReplay, retryWhen, delayWhen } from "rxjs/operators";
import { fromPromise } from "rxjs/internal-compatibility";

@Injectable({
  providedIn: "root",
})
export class Store {
  ///////////////////////////////////////////////////////////////////
  // start of video 5.5

  // as of now, every time we navigate away from the homepage and back,
  //  a http req gets made to fetch the courses
  // this is inefficient because most of the time the same data
  //  is being fetched
  // we will use this Store service to fetch the data once, and make it
  //  available to the whole application

  // we want to make sure that any subscriber gets the latest
  //  result from the back-end, so we use BehaviorSubject

  // private subject = new BehaviorSubject<Course[]>([]);
  // courses$: Observable<Course[]> = this.subject.asObservable();

  // end of video 5.5
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  // start of video 5.6

  // we will add some data to our STORE
  // this will happen at app startup time
  // when the app is started, we will call an initialization method in
  //  STORE, which will then fetch data from backend via http req
  // this data will be emitted to the rest of the app using
  //  the courses$ observable
  // to trigger the initialization logic of STORE, we will use the
  //  app root component (app.component.ts)

  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$ = createHttpObservable("/api/courses");

    http$
      .pipe(
        tap(() => console.log("HTTP request executed")),
        map((res) => Object.values(res["payload"]))
      )
      .subscribe((courses) => this.subject.next(courses));
  }

  selectBeginnerCourses(): Observable<Course[]> {
    return this.filterByCategory("BEGINNER");
  }

  selectAdvancedCourses(): Observable<Course[]> {
    return this.filterByCategory("ADVANCED");
  }

  filterByCategory(category: string) {
    return this.courses$.pipe(
      map((courses) => courses.filter((course) => course.category == category))
    );
  }

  // after these implementations, every time we navigate away from the homepage
  //  and back, a new http req is not made every time, rather only one is
  //  made in the init() method

  // in this lesson, we saw how to configure a component to consume data
  //  using our storeService

  // in the next lesson, we will see how a component can modify data
  //  in the storeService

  // end of video 5.6
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  // start of video 5.7

  // in the last lesson, we setup our storeService in a read-only manner
  // in this lesson, we will implement the ability to edit courses
  //  when user clicks edit on the homepage, and changes are made
  //  via the course-dialog component
  // on editing, a new http req will be sent to the backend to save the
  //  new modified data
  // we would also like to emit that new value so that the rest of the app
  //  receives the latest value, while the backend saveReq is still ongoing

  // first, this method is going to save the course in store memory
  //  and broadcast the new value to all subscribers
  // so the store is going to be modified in memory first
  // then a req is going to be made to the backend and the new data
  //  is also going to be saved in our db

  saveCourse(courseId: number, changes): Observable<any> {
    // this will get us a ref to the whole array of courses
    const courses = this.subject.getValue();

    // this will find the index of the course we want to modify
    const courseIndex = courses.findIndex((course) => course.id === courseId);

    // this creates a copy of the courses array
    const newCourses = courses.slice(0);

    // console.log(newCourses[courseIndex]);
    // the new javascript object overwrites the old one
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes,
    };
    // console.log(newCourses[courseIndex]);

    // this broadcasts the new courses array with the modified data
    this.subject.next(newCourses);

    // to save to the backend, we need to make a http req
    return fromPromise(
      fetch(`/api/courses/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      })
    );
  }

  // note that in this implementation of the save function, we are optimistically
  //  modifying the in-memory storeService data, where we are assuming
  //  back-end save call will be successful

  // end of video 5.7
  ///////////////////////////////////////////////////////////////////
}
