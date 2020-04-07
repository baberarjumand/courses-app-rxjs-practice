import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { interval, timer, fromEvent } from "rxjs";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    ////////////////////////////////////////////////////////////////////////////////////////////
    // // video 1.5
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
    // // video 1.6
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
    // video 1.7
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
    // // video 1.8
    // // an observable is a blueprint for a stream
    // // we can derive instances of a stream from an obserable by subscribing to it
    // // in last example, we passed only one arg to subscribe(), we can pass more also
    // // second arg is an error handler
    // // third arg is handler for when the stream completes i.e. emits last value
    // // observable contract: if it errors out or completes, it will not emit values again
    // // according to contract, error and completion are exclusive i.e. only one of them happens

    // // if we want to stop the values emitting after 5 seconds
    // const interval$ = timer(3000, 1000);
    // const sub = interval$.subscribe((val) => console.log("stream1: " + val));
    // setTimeout(() => {
    //   sub.unsubscribe();
    // }, 5000);

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

    // end of video 1.8
    ////////////////////////////////////////////////////////////////////////////////////////////
  }
}
