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
  BehaviorSubject,
  AsyncSubject,
  ReplaySubject,
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

    // // we are using subject to produce a custom observable
    // const subject = new Subject();

    // // this observable will emit the values of subject
    // const series$ = subject.asObservable();
    // series$.subscribe(console.log);

    // subject.next(1);
    // subject.next(2);
    // subject.next(3);
    // subject.complete();

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
    ///////////////////////////////////////////////////////////////////
    // start of video 5.3

    // PLAIN SUBJECT EXAMPLE
    // in this lesson, we will cover behavior subject
    // in last lesson, we saw how a subject is a mix between an
    //  observable and an observer
    // as discussed before, we should only tend to use subject when
    //  other observable creation methods are inconvinient

    // however, when we do use subjects, we will most likely not use
    //  plain subjects, but very common to use is the behaviorSubject
    // it is very similar to subject, but it also supports late subscriptions

    // const subject = new Subject();
    // const series$ = subject.asObservable();

    // // this is an early subscription i.e. before values get emitted
    // series$.subscribe(val => console.log("early sub: " + val));

    // subject.next(1);
    // subject.next(2);
    // subject.next(3);
    // // subject.complete();

    // // to simulate a late subscription, lets use a timeout
    // setTimeout(() => {
    //   series$.subscribe(val => console.log("late sub: " + val));
    //   subject.next(4);
    // }, 3000);

    // BEHAVIOR SUBJECT EXAMPLE
    // with a normal subject, only values emitted after a subscription
    //  is made are received
    // in many cases, it is desirable that late subscribers also get
    //  the last value emitted, e.g. an http request
    // even if a subscriber subscribes long after the http req is
    //  completed, it should be able to get the last response from backend
    // if we want to write our program such that all subscribers
    //  receive the last emitted value regardless of the timing of their
    //  subscription, we use BehaviorSubject

    // BehaviorSubject requires an initial value because the goal
    //  of BehaviorSubject is to always provide something to subscribers

    // // an initial value of 0 ensures if any subscriptions occur before
    // //  any values are emitted, they will receive 0
    // const subject = new BehaviorSubject(0);
    // const series$ = subject.asObservable();

    // // this is an early subscription i.e. before values get emitted
    // series$.subscribe(val => console.log("early sub: " + val));

    // subject.next(1);
    // subject.next(2);
    // subject.next(3);

    // // if completion happens before a late subscription, the late sub will
    // //  not receive the last emitted value
    // // subject.complete();

    // // to simulate a late subscription, lets use a timeout
    // setTimeout(() => {
    //   series$.subscribe(val => console.log("late sub: " + val));
    //   subject.next(4);
    // }, 3000);

    // BehaviorSubject is the most commonly used subject, and we will use
    //  it to implement our store functionality
    // Before we do that, we will cover AsyncSubject and ReplaySubject

    // end of video 5.3
    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    // start of video 5.4

    // in this lesson, we will see 2 other types of subjects:
    //  AsyncSubject and ReplaySubject

    // ASYNC SUBJECT EXAMPLE
    // suppose that we have a long running calculation within some
    //  operation, and it is returning intermediate values while
    //  calculating before the calculation completes
    // in this case, if we are only interested in the last value after
    //  the calculation complete, we use the AsyncSubject

    // AsyncSubject will wait for completion before emitting any values
    //  to one or multiple subscribers
    // The value emitted is going to be the last value right before
    //  completion

    // const subject = new AsyncSubject();
    // const series$ = subject.asObservable();

    // series$.subscribe(val => console.log("first sub: " + val));

    // subject.next(1);
    // subject.next(2);
    // subject.next(3);

    // // if we comment out complete(), no value will be received by series$
    // subject.complete();

    // // late subscribers also receive last value just before completion
    // setTimeout(() => {
    //   series$.subscribe(val => console.log("second sub: " + val));
    // }, 3000)

    // AsyncSubject is ideal for long-running operations, where we only
    //  want the last value after operation completes

    // REPLAY SUBJECT EXAMPLE
    // there are situations where late subscribers might want to receive all
    //  emitted values, from the first emitted value to the last one
    // for that, we use ReplaySubject()

    const subject = new ReplaySubject();
    const series$ = subject.asObservable();

    series$.subscribe(val => console.log("first sub: " + val));

    subject.next(1);
    subject.next(2);
    subject.next(3);

    // ReplaySubject is not linked with completion
    // even if we comment out complete(), all subscribers, late or early
    //  will receive all values
    // subject.complete();

    // replaySubject will replay all values to all later subscribers
    setTimeout(() => {
      series$.subscribe(val => console.log("second sub: " + val));
      subject.next(4);
    }, 3000)

    // end of video 5.4
    ///////////////////////////////////////////////////////////////////
  }
}
