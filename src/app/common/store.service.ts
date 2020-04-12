import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import { Course } from "../model/course";

@Injectable({
  providedIn: "root",
})
export class Store {
  ///////////////////////////////////////////////////////////////////
  // start of video 5.5

  // we want to make sure that any subscriber gets the latest
  //  result from the back-end, so we use BehaviorSubject

  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  // end of video 5.5
  ///////////////////////////////////////////////////////////////////
}
