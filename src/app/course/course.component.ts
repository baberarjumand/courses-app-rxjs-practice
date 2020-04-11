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
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat } from "rxjs";
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
    this.course$ = createHttpObservable(`/api/courses/${this.courseId}`);

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

    // in this lesson, we will use the startWith() operator
    // we will assign to the lessons$ the result of our type-ahead logic
    // the startWith() operator allows us to initialize a stream with an initial value

    this.lessons$ = fromEvent<any>(this.input.nativeElement, "keyup").pipe(
      map((event) => event.target.value),
      startWith(""),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((search) => this.loadLessons(search))
    );

    // end of video 3.5
    ////////////////////////////////////////////////////////////////////////////////////////////
  }

  loadLessons(search = ""): Observable<Lesson[]> {
    return createHttpObservable(
      `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`
    ).pipe(map((res) => res["payload"]));
  }
}
