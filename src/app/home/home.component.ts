import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, timer } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
} from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses: Course[];
  advancedCourses: Course[];

  ngOnInit() {
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.2
    const http$ = createHttpObservable("api/courses");
    const courses$ = http$.pipe(map((res) => Object.values(res["payload"])));
    courses$.subscribe(
      (courses) => {
        // console.log(courses);
        // problem with adding too much logic inside a subscribe call is that it does not scale well in complexity
        // we will quickly end up will nested subscribe calls, like the callback hell scenario, which is what we are trying to avoid
        // one of the purposes for using rxjs is to avoid callback hell
        // as rxjs is meant to be used, we should avoid nested subscribe calls and too much logic inside them as well
        // that would be a rxjs anti-pattern
        // the approach below is considered an imperative approach for implementing the components
        // will use reactive design in the next video
        this.beginnerCourses = courses.filter(
          (course) => course.category == "BEGINNER"
        );
        this.advancedCourses = courses.filter(
          (course) => course.category == "ADVANCED"
        );
      },
      (err) => {
        console.log(err);
      },
      () => {
        console.log("http$ observable completed!");
      }
    );
    // end of video 2.2
    ////////////////////////////////////////////////////////////////////////////////////////////
  }
}
