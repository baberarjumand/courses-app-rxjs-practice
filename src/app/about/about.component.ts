import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { interval, timer, fromEvent, Observable, of, concat } from "rxjs";
import { createHttpObservable } from "../common/util";
import { map } from "rxjs/operators";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    ////////////////////////////////////////////////////////////////////////////////////////////
    // // start of video 1.5
    // // stream examples 1 and 2 never complete, they continue emitting values
    // // stream example 3 completes after emitting one value
    // // stream example 1
    // document.addEventListener("click", (evt) => {
    //   console.log(evt);
    // });
    // // stream example 2
    // let counter = 0;
    // setInterval(() => {
    //   console.log(counter++);
    // }, 1000);
    // // stream example 3
    // // setTimeout() emits one value and then completes
    // // setTimeout() similar to a request to a backend that gives us back a value via a callback
    // setTimeout(() => {
    //   console.log("finished...");
    // }, 3000);
    // end of video 1.5
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // // start of video 1.6
    // // if we want the streams to start in a sequence, we will have to nest them within each other
    // // continued nesting in a similar fashion is referred to as 'callback hell'
    // document.addEventListener("click", (evt) => {
    //   console.log(evt);
    //   setTimeout(() => {
    //     console.log("finished...");
    //     let counter = 0;
    //     setInterval(() => {
    //       console.log(counter++);
    //     }, 1000);
    //   }, 3000);
    // });
    // // this is an inefficient way of combining multiple streams of values
    // // rxjs helps us combine streams together in a clean and maintainable manner
    // // the default java callback interface does not scale well in complexity
    // // more nesting makes code hard to read and reason about
    // end of video 1.6
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 1.7
    // // like the streams we saw in previous examples, we can implement our own custom streams
    // // we can use the interval() method from rxjs to define a custom stream
    // // $ at the end of a variable means this is a RxJS observable
    // // type of interval$ is Observable<number>, specifies this is type this observable will emit
    // // refer to official doc of interval() on reactivex.io
    // // interval(1000) will emit incrementing values every 1000ms or 1s
    // // this is the definition of a stream of values
    // const interval$ = interval(1000);
    // // an obeservable only becomes a stream when we subscribe to it
    // // those values are received via the subscribe() method
    // // code below creates a new stream
    // interval$.subscribe((val) => {
    //   console.log("stream1: " + val);
    // });
    // // another stream can be created from the same observable
    // interval$.subscribe((val) => {
    //   console.log("stream2: " + val);
    // });
    // // if we want to wait 3 seconds before we start to emit values, use timer()
    // // 3000ms is delay to emitting first value, 1000ms is delay between subsequent emitted values
    // // const interval$ = timer(3000, 1000);
    // interval$.subscribe((val) => {
    //   console.log("stream1: " + val);
    // });
    // // let us define a stream from the click events
    // // we use fromEvent()
    // // this returns only a definition of the stream, not an instance of the stream
    // // type of click$ is Observable<Event>
    // const click$ = fromEvent(document, "click");
    // // subscribe() method creates an instance of the stream
    // click$.subscribe((evt) => {
    //   console.log(evt);
    // });
    // end of video 1.7
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // // start of video 1.8
    // // an observable is a blueprint for a stream
    // // we can derive instances of a stream from an obserable by subscribing to it
    // // in last example, we passed only one arg to subscribe(), we can pass more also
    // // second arg is an error handler
    // // third arg is handler for when the stream completes i.e. emits last value
    // // observable contract: if it errors out or completes, it will not emit values again
    // // according to contract, error and completion are exclusive i.e. only one of them happens
    // const click$ = fromEvent(document, "click");
    // click$.subscribe(
    //   (evt) => {
    //     console.log(evt);
    //   },
    //   (err) => {
    //     console.log(err);
    //   },
    //   () => {
    //     console.log("stream completed");
    //   }
    // );
    // // if we want to stop the values emitting after 5 seconds
    // const interval$ = timer(3000, 1000);
    // const sub = interval$.subscribe((val) => console.log("stream1: " + val));
    // setTimeout(() => {
    //   sub.unsubscribe();
    // }, 5000);
    // end of video 1.8
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 1.9
    // we are going to implement our own custom obserrvable
    // we are going to fetch courses data from the local data server at localhost:9000
    // fetch() is used to make http calls
    // it returns a promise
    // unlike observables, it gets immediately executed
    // observables only trigger in response to a subscription
    // this promise will be evaluated successfully if the http request succeeds
    // this promise will fail if the fetching operation fails e.g. if network is down
    // we will turn this promise to a stream by creating a custom observable
    // fetch("api/courses");
    // // we pass a function as an arg that models the observable behavior we want
    // // the 'observer' will allow us to emit new values, error out or complete
    // // observer.next() -> emits next value
    // // observer.error() -> errors out the observable
    // // observer.complete() -> completes the observable
    // // the observer methods will only be called when somebody subscribes to http$ observable
    // // the observable we define below will complete after emitting one value
    // // when making custom observables, respect the observable contract
    // const http$ = Observable.create((observer) => {
    //   fetch("api/courses")
    //     .then((response) => {
    //       return response.json();
    //     })
    //     .then((body) => {
    //       observer.next(body);
    //       observer.complete();
    //     })
    //     .catch((err) => {
    //       observer.error(err);
    //     });
    // });
    // http$.subscribe(
    //   (courses) => {
    //     console.log(courses);
    //   },
    //   (err) => {
    //     console.log(err);
    //   },
    //   () => {
    //     console.log("http$ observable completed!");
    //   }
    // );
    // // in next example, we will use the rxjs map() operator to convert the raw json payload to an array of courses
    // end of video 1.9
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.1
    // in this lesson, we will create a courses observable that will emit the courses as values
    // refer to official doc of the map() operator at reactivex.io
    // an operator is a method of deriving one observable from another
    // map() takes the data from a source observable and 'maps' or manipulates the incoming values and emits new values as an observable
    // const http$ = createHttpObservable("api/courses");
    // // pipe() allows us to chain multiple operators to produce a new observable
    // const courses$ = http$.pipe(map((res) => Object.values(res["payload"])));
    // courses$.subscribe(
    //   (courses) => {
    //     console.log(courses);
    //   },
    //   (err) => {
    //     console.log(err);
    //   },
    //   () => {
    //     console.log("http$ observable completed!");
    //   }
    // );
    // end of video 2.1
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.6
    // in the next few lessons, we will explore new ways of combining observables
    // in this lesson, we will see an intro to observable concatenation
    // in next lesson, we will see a practical use case in the scenario of http reqs using concatMap()

    // of() is used to create observables of all sorts
    // this observable will emit values 1, 2, 3 and then complete
    const source1$ = of(1, 2, 3);

    // if we replace source1$ with an observable that never completes, source2$ and source3$ will never be subscribed to
    // therefore, source2$ and source3$ will never emit their values
    // because source1$ never completes
    // const source1$ = interval(1000);

    // this observable will emit values 4, 5, 6 and then complete
    const source2$ = of(4, 5, 6);

    const source3$ = of(7, 8, 9);

    // we want to combine the 2 observables source1$ and source2$ such that
    // source1$ emits its values first and completes
    // only after source1$ completes can then source2$ emit its values and complete
    // this is a simple example of sequential concatenation
    // refer to concat() official doc @ reactivex.io

    // concat() operator will internally subscribe to each observable in sequence
    // it will subscribe to source2$ only when source1$ is completed
    // it will subscribe to source3$ only when source2$ is completed
    const result$ = concat(source1$, source2$, source3$);
    // result$.subscribe((val) => console.log(val));

    // an alternate way to log the output
    result$.subscribe(console.log);

    // in the next lesson, we will see a practical use case of this concatenation concept
    // end of video 2.6
    ////////////////////////////////////////////////////////////////////////////////////////////
  }
}
