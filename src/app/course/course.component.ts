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

  @ViewChild("searchInput", { static: true }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const courseId = this.route.snapshot.params["id"];
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.13
    this.course$ = createHttpObservable(`/api/courses/${courseId}`);
    this.lessons$ = createHttpObservable(
      `/api/lessons?courseId=${courseId}&pageSize=100`
    ).pipe(map((res) => res["payload"]));

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

    // we also need to solve the problem of duplicate values being emitted
    // we want to derive a new observable from the observable above that omits the duplicates
    // if two consecutive values are exactly the same, we only want to emit one value
    // to do that, we use the distinctUntilChanged() operator
    // with this operator, we will no longer have duplicate values in our output
    fromEvent<any>(this.input.nativeElement, "keyup")
      .pipe(
        map((event) => event.target.value),
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(console.log);

    // in the next lesson, we will decide what is the best operator to convert this search term to
    // a backend request. we will see concatMap(), mergeMap() and exhaustMap() are not a good
    // choice for this kind of operation, we will thus explore the switchMap() operator

    // end of video 2.14
    ////////////////////////////////////////////////////////////////////////////////////////////
  }
}
