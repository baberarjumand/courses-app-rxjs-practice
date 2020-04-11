import { Component, OnInit } from "@angular/core";
import { Course } from "../model/course";
import { interval, Observable, of, timer, throwError } from "rxjs";
import {
  catchError,
  delayWhen,
  map,
  retryWhen,
  shareReplay,
  tap,
  finalize,
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

    // const http$ = createHttpObservable("api/courses");
    // const courses$: Observable<Course[]> = http$.pipe(
    //   tap(() => {
    //     console.log("HTTP Request executed!");
    //   }),
    //   map((res) => Object.values(res["payload"])),
    //   shareReplay()
    // );

    // // testing if indeed there are no extra http reqs after shareReplay() operator is used
    // // courses$.subscribe();

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

    // shareReplay() operator is very commonly used for handling http requests
    // end of video 2.4
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 3.2

    // we will cause the local data server to send an error http response
    // and then see how we can catch that error in our observables

    // 1. we can catch the error and recover from it by providing an alternative value (to the courses)
    // 2. we can also catch the error, log it to the console and rethrow it to another
    // observable that is consuming this observable
    // 3. we can also retry the operation that just failed
    // we will cover each of these three strategies

    // we can catch the http error by using catchError operator
    // the function inside this operator is supposed to return an observable that will be
    // used to continue the observable that has errored out
    // the catchError() provides an alternate observable that will be used in replacement
    // of the original observable when the original observable errors out
    // the catchError() can also throw an error, which will cause the courses$ to error out

    // // the of() creates an observable that emits one value and completes, which causes
    // // the courses$ to also complete

    // const http$ = createHttpObservable("api/courses");
    // const courses$: Observable<Course[]> = http$.pipe(
    //   tap(() => {
    //     console.log("HTTP Request executed!");
    //   }),
    //   map((res) => Object.values(res["payload"])),
    //   shareReplay(),
    //   catchError((err) =>
    //     of([
    //       {
    //         id: 0,
    //         description: "RxJs In Practice Course",
    //         iconUrl:
    //           "https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png",
    //         courseListIcon:
    //           "https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png",
    //         longDescription:
    //           "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
    //         category: "BEGINNER",
    //         lessonsCount: 10,
    //       },
    //     ])
    //   )
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

    // // in the next lessons, we will see how to re-throw the error
    // // we will also see how to retry the failed observable

    // end of video 3.2
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 3.3

    // in this lesson, we will see how to use the catch and rethrow error handling strategy
    // we will also see how to implement clean-up operations when an observables fails or completes

    // unlike the last lesson, where the catchError() returned an observable that emitted
    // one course value and completed, we will throw an observable that immediately
    // errors out with the err that we get in catchError()

    // clean-up operations can be implemented using the finalize() operator
    // finalize() gets invoked in one of two cases:
    // when observable completes, or when observable errors out

    // // two error messages are displayed when catchError() is placed after shareReplay() because
    // // two subscriptions error out, the beginner and advanced courses
    // // if we want to make the error get thrown once only, we move the catchError() up the
    // // observable chain

    // const http$ = createHttpObservable("api/courses");
    // const courses$: Observable<Course[]> = http$.pipe(
    //   catchError((err) => {
    //     console.log("Error occurred", err);
    //     return throwError(err);
    //   }),
    //   finalize(() => {
    //     console.log("Finalize executed...");
    //   }),
    //   tap(() => {
    //     console.log("HTTP Request executed!");
    //   }),
    //   map((res) => Object.values(res["payload"])),
    //   shareReplay()
    //   // catchError((err) => {
    //   //   console.log("Error occurred", err);
    //   //   return throwError(err);
    //   // }),
    //   // finalize(() => {
    //   //   console.log("Finalize executed...");
    //   // })
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

    // // in the next lesson, we will retry the http request if it fails

    // end of video 3.3
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 3.4

    // in this lesson, we will cover the retry error handling strategy

    // when a req to a backend fails, another call within a few seconds might succeed e.g. if
    // the load on the backend reduces
    // if a req fails, we will wait for 2s and then try again
    // for this, we will use the retryWhen() operator

    // retryWhen() will throw an error each time the stream throws an error
    // when the http stream throws an error, it will error out and not complete
    // retryWhen() will try to create a brand new stream and subscribe to it
    // it will keep doing this until the new stream does not error out
    // retryWhen() should return an observable, this observable will tell
    // when to retry
    // we can immediately retry by returning errors observable itself
    // in practice, we don't want to retry immediately
    // lets say we want to wait for 2s before retrying
    // we will use the delayWhen() operator for this

    const http$ = createHttpObservable("api/courses");
    const courses$: Observable<Course[]> = http$.pipe(
      tap(() => {
        console.log("HTTP Request executed!");
      }),
      map((res) => Object.values(res["payload"])),
      shareReplay(),
      retryWhen((errors) => errors.pipe(delayWhen(() => timer(2000))))
    );

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

    // in the browser, we can observer a series of failed http reqs until one succeeds

    // end of video 3.4
    ////////////////////////////////////////////////////////////////////////////////////////////
  }
}
