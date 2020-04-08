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
  // variables for video 2.2
  // beginnerCourses: Course[];
  // advancedCourses: Course[];

  // variables for video 2.3
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  ngOnInit() {
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.2
    // const http$ = createHttpObservable("api/courses");
    // const courses$ = http$.pipe(map((res) => Object.values(res["payload"])));
    // courses$.subscribe(
    //   (courses) => {
    //     // console.log(courses);
    //     // problem with adding too much logic inside a subscribe call is that it does not scale well in complexity
    //     // we will quickly end up will nested subscribe calls, like the callback hell scenario, which is what we are trying to avoid
    //     // one of the purposes for using rxjs is to avoid callback hell
    //     // as rxjs is meant to be used, we should avoid nested subscribe calls and too much logic inside them as well
    //     // that would be a rxjs anti-pattern
    //     // the approach below is considered an imperative design approach for implementing the components
    //     // will use reactive design in the next video
    //     this.beginnerCourses = courses.filter(
    //       (course) => course.category == "BEGINNER"
    //     );
    //     this.advancedCourses = courses.filter(
    //       (course) => course.category == "ADVANCED"
    //     );
    //   },
    //   (err) => {
    //     console.log(err);
    //   },
    //   () => {
    //     console.log("http$ observable completed!");
    //   }
    // );
    // end of video 2.2
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.3
    // we will implement the reactive design approach to our home component in this lesson
    // we want to define two streams of data, one for beginner and advanced courses
    // we will derive those two streams using rxjs operators
    // const http$ = createHttpObservable("api/courses");
    // const courses$: Observable<Course[]> = http$.pipe(
    //   map((res) => Object.values(res["payload"]))
    // );

    // this.beginnerCourses$ = courses$.pipe(
    //   map((courses) =>
    //     courses.filter((course) => course.category == "BEGINNER")
    //   )
    // );

    // this.advancedCourses$ = courses$.pipe(
    //   map((courses) =>
    //     courses.filter((course) => course.category == "ADVANCED")
    //   )
    // );

    // async pipe to be used with observables in html template
    // async pipe also directly unsubscribes when destroyed
    // async means subscriptions are handled at template level, we do not need to subscribe
    // this implementation is an example of reactive design
    // by handling the subscribe part in templates, we avoid nested subscribe calls at component level
    // however, in this implementation, we are making 2 http back-end requests instead of 1 previously
    // will look at another rxjs operator in next video that can help with this issue
    // end of video 2.3
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.4

    // when we changed our code to conform to a reactive/declarative approach, we caused another issue
    // our code is now making 2 http requests, one for beginner courses and another for advanced
    // this is inefficient compared to the 1 request in our previous imperative approach
    // we can solve this problem by using the shareReplay() rxjs operator

    // upon investigating the http response on browser dev tools, both http reqs are fetching the same data
    // 2 subscriptions trigger 2 separate http requests
    // if 3 subscriptions are made on the courses$ observable, there will be 3 http calls
    // making multiple http requests to fetch the same data is undesirable and inefficient
    // the shareReplay() rxjs operator will help us tackle this issue

    // we want to share courses$ stream across multiple subscribers
    // we want to avoid the default observable behavior which creates a new stream on every new subscription
    // we want the courses$ stream to be executed only once
    // then we want the result of this stream to be REPLAYED to each new subscriber

    // to display the modified behavior with the shareReplay() operator, we will log info to console
    // to output to console, we will use the tap() operator
    // tap() is used to produce 'side-effects' in our observable shade
    // tap() is used to make changes/execute code unrelated to the current observable
    // for example, changing some other variable in the component, or outputting to console

    const http$ = createHttpObservable("api/courses");
    const courses$: Observable<Course[]> = http$.pipe(
      tap(() => {
        console.log("HTTP Request executed!");
      }),
      map((res) => Object.values(res["payload"])),
      shareReplay()
    );

    // testing if indeed there are no extra http reqs after shareReplay() operator is used
    // courses$.subscribe();

    this.beginnerCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category == "BEGINNER")
      )
    );

    this.advancedCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => course.category == "ADVANCED")
      )
    );

    // shareReplay() operator is very commonly used for handling http requests
    // end of video 2.4
    ////////////////////////////////////////////////////////////////////////////////////////////
  }
}
