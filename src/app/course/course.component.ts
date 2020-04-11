import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  throttle,
  throttleTime,
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, interval } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;
  courseId: string;

  @ViewChild("searchInput", { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.13
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
      .pipe(
      // tap((course) => console.log("Course: ", course))
      );

    // this line was moved in video 2.15
    // this.lessons$ = this.loadLessons();

    // in the next lesson, we will implement the type-ahead search logic using switchMap()
    // and other operators as well

    // end of video 2.13
    ////////////////////////////////////////////////////////////////////////////////////////////
  }

  ngAfterViewInit() {
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.14

    // we will use the debounceTime() and distinctUntilChanged() operators
    // every time letter typed into the search bar will be a new emitted value

    // // lets first create a stream from the letters typed in the search bar
    // fromEvent<any>(this.input.nativeElement, "keyup")
    //   .pipe(map((event) => event.target.value))
    //   .subscribe(console.log);

    // in the implementation above, there is going to be a http request for each key press
    // this will result in a large number of http requests and some duplicate requests as well
    // we want to want a small time period until the user search term stabilizes and we also
    // want to prevent duplicate searches

    // first, lets reduce the number of search reqs to the backend
    // debounceTime() takes in a delay in ms, for example, debounceTime(20) means
    // once a value is received, it is only emitted if no other values are received
    // for 20ms, if a value does come in in that delay, the 20ms delay restarts and
    // waits for 20ms of silence, only when there is 20ms of silence, then the last
    // received value is emitted
    // refer to official doc of debounceTime() @ reactivex.io

    // // lets apply debounceTime() to the observable we created above
    // fromEvent<any>(this.input.nativeElement, "keyup")
    //   .pipe(
    //     map((event) => event.target.value),
    //     debounceTime(400)
    //   )
    //   .subscribe(console.log);

    // // we also need to solve the problem of duplicate values being emitted
    // // we want to derive a new observable from the observable above that omits the duplicates
    // // if two consecutive values are exactly the same, we only want to emit one value
    // // to do that, we use the distinctUntilChanged() operator
    // // with this operator, we will no longer have duplicate values in our output
    // fromEvent<any>(this.input.nativeElement, "keyup")
    //   .pipe(
    //     map((event) => event.target.value),
    //     debounceTime(400),
    //     distinctUntilChanged()
    //   )
    //   .subscribe(console.log);

    // in the next lesson, we will decide what is the best operator to convert this search term to
    // a backend request. we will see concatMap(), mergeMap() and exhaustMap() are not a good
    // choice for this kind of operation, we will thus explore the switchMap() operator

    // end of video 2.14
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.15

    // in this lesson we will transform our search strings to backend reqs
    // we will load the lessons according to the search term

    // // let us first see why concatMap() is not a good choice
    // fromEvent<any>(this.input.nativeElement, "keyup")
    //   .pipe(
    //     map((event) => event.target.value),
    //     debounceTime(400),
    //     distinctUntilChanged(),
    //     concatMap((search) => this.loadLessons(search))
    //   )
    //   .subscribe(console.log);
    // with concatMap(), the current search request does not get cancelled if search string changes
    // we do get multiple distinct results, but the previous reqs complete
    // we want to cancel the previous http req if user changes the search string
    // and then emit the new search req with the latest search string
    // switchMap() operator will help us accomplish this
    // refer to official doc for switchMap() @ reactivex.io

    // // with switchMap(), if the source observable emits a new value,
    // // then the currently subscribed observable gets unsubscribed,
    // // and it SWITCHES to the new observable and starts emitting it's values
    // // switchMap() is all about unsubscribe-logic

    // fromEvent<any>(this.input.nativeElement, "keyup")
    //   .pipe(
    //     map((event) => event.target.value),
    //     debounceTime(400),
    //     distinctUntilChanged(),
    //     switchMap((search) => this.loadLessons(search))
    //   )
    //   .subscribe(console.log);

    // you can observe cancelled http reqs in the browser dev tools
    // we are not yet displaying the search results, so we will implement that next

    // // currently we have a lessons$ observable that is emitted to show the current table of lessons
    // // we will convert this lessons$ to a combination to 2 different observables
    // // we want it to initially load all the lessons, that will be the initialLessons$ observable
    // // next, when the user starts typing in search box, we want to switch the output of
    // // the second stream which shows the results of the search string
    // // we want to combine 2 different observables, concatenation will help us here
    // // we want the first initial observable to get loaded, only then should we
    // // start responding to the search-strings/user-searches

    // const searchLessons$ = fromEvent<any>(
    //   this.input.nativeElement,
    //   "keyup"
    // ).pipe(
    //   map((event) => event.target.value),
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   switchMap((search) => this.loadLessons(search))
    // );

    // const initialLessons$ = this.loadLessons();

    // this.lessons$ = concat(initialLessons$, searchLessons$);

    // // in the next lessons, we will cover rxjs error handling

    // end of video 2.15
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 3.5

    // // in this lesson, we will use the startWith() operator
    // // we will assign to the lessons$ the result of our type-ahead logic
    // // the startWith() operator allows us to initialize a stream with an initial value

    // this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
    //   map((event) => event.target.value),
    //   startWith(""),
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   switchMap((search) => this.loadLessons(search))
    // );

    // end of video 3.5
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 3.6

    // in this lesson, we will see the throttleTime() operator
    // let us discuss the concept of throttling first and see how it compares to debounceTime()
    // they are 2 closely related concepts that are often mixed up

    // // in this case, we only see output on console once the value has been stable for 400ms
    // // if the user keeps typing relatively quickly, there will never be an output to console
    // // debouncing is about waiting for value to get stable
    // // this is different from throttling
    // fromEvent<any>(this.input.nativeElement, "keyup").pipe(
    //   map((event) => event.target.value),
    //   debounceTime(400)
    // ).subscribe(console.log);

    // throttling is similar to debounceTime() in the purpose that we are trying to reduce the
    // number of values emitted from the observable, but the way it happens is very different
    // refer to offical doc for throttle() at reactivex.io
    // throttle is about reducing the number of emitted values by limiting the number of values
    // that can be emitted in a certain interval, for that, it uses an auxiallary timer
    // observable that determines when should we emit a value from the input stream
    // whenever the timer observable emits a value, then we should also emit a value to
    // the output stream, we can use the timer observable to vary the throttling rate
    // according to some external condition as well if required
    // the timer observable can have any logic, it does not have to be a periodic interval
    // let us use throttling instead of debouncing in our example

    // // the function instead the throttle() operator should return an observable
    // // in this case, we will have one value every 0.5s in the console
    // // however, in this approach, we do not have a guarantee that output value is the
    // // latest in the stream
    // // in case of type-ahead, we want to use debounceTime() to make sure we have
    // // the latest value in the stream when user types
    // fromEvent<any>(this.input.nativeElement, "keyup").pipe(
    //   map((event) => event.target.value),
    //   // throttle(() => interval(500)),
    //   throttleTime(500)
    // ).subscribe(console.log);

    // this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
    //   map((event) => event.target.value),
    //   startWith(""),
    //   debounceTime(400),
    //   distinctUntilChanged(),
    //   switchMap((search) => this.loadLessons(search))
    // );

    // end of video 3.6
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 4.1

    // in this lesson we will write our own custom operator, a debug operator that is going
    // to help us debug out rxjs programs
    // it is not always easy to understand what is going on just by reading observable chains
    // we often use tap() to log output to console between operators
    // as our programs get complex, we might get a lot of tap operators and a lot of output
    // in the console as well, after solving the issue, we will end up going back and
    // removing all those tap operators
    // ideally we would like to keep the logging statements that helped us understand a
    // given part of the program because we might use them later, but we would also like
    // to turn them off, like logging systems in the backend where we have
    // multiple logging levels
    // we are going to create a custom operator called the debug operator that
    // will allow us to turn logging on or off
    // we will create a new file 'debug.ts' in /common where we will define this operator

    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
      map((event) => event.target.value),
      startWith(""),
      // tap((search) => console.log("search", search)),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((search) => this.loadLessons(search))
    );

    // end of video 4.1
    ////////////////////////////////////////////////////////////////////////////////////////////
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map((res) => res["payload"]));
  }
}
