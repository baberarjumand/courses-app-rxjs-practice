import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { Course } from "../model/course";

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

  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  // end of video 5.5
  ///////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////
  // start of video 5.6
  // end of video 5.6
  ///////////////////////////////////////////////////////////////////
}
