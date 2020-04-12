import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  concat,
  fromEvent,
  interval,
  noop,
  observable,
  Observable,
  of,
  timer,
  merge,
  Subject,
} from "rxjs";
import { delayWhen, filter, map, take, timeout } from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  ngOnInit() {
    ///////////////////////////////////////////////////////////////////
    // start of video 5.2

    // use subject when other simpler methods to create observables not viable
    // simpler methods like of(), fromPromise(), Observable.create(), etc

    // if those methods are not convinient, or we run into a data source that is not easily transformable into an observable,
    // or if we are doing multi-casting of one value to multiple separate observable consumers, then we might want to use SUBJECT

    // in util.ts, where we create http observable, there is a clear separation between the observable and observer
    // but in other situations, this might not be a convinient method to create an observable

    // a subject is, at the same time, an observer and an observable

    // subject has the 3 observer methods we saw before:
    // next(), complete() and error(), but it also has more
    // it has the pipe() method, so we can pipe a subject with
    //   any rxjs operator
    // so a subject looks like it is simaltaineously an observer
    //   and an observable
    // we can declare the subject as a public component variable and
    //   share it with other classes, that is not a good idea
    // a subject is meant to be a private to the component that is
    //   emitting a given set of data

    // we are using subject to produce a custom observable
    const subject = new Subject();

    // this observable will emit the values of subject
    const series$ = subject.asObservable();
    series$.subscribe(console.log);

    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.complete();

    // the series$ can be shared with the rest of the application
    //   because it does not have next(), complete() or error() functions
    // other parts of the app can only subscribe to series$ and receive
    //   its emitted values
    // if we share the subject with other parts of the app, then they
    //  could potentially alter the behavior of the subject and the
    //  observables listening to it by calling one of next(), complete()
    //  or error()

    // we should try deriving observables directly from the source where
    //  possible, using from(), fromPromise(), of(), etc
    // one very common use of subjects is multi-casting, we might want to
    //  take one value from one observable stream and re-emit that to
    //  multiple separate output streams

    // end of video 5.2
    ///////////////////////////////////////////////////////////////////
  }
}
