import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    // stream examples 1 and 2 never complete, they continue emitting values
    // stream example 3 completes after emitting one value

    // stream example 1
    // document.addEventListener("click", (evt) => {
    //   console.log(evt);
    // });

    // stream example 2
    // let counter = 0;
    // setInterval(() => {
    //   console.log(counter++);
    // }, 1000);

    // stream example 3
    // setTimeout() emits one value and then completes
    // setTimeout() similar to a request to a backend that gives us back a value via a callback
    // setTimeout(() => {
    //   console.log("finished...");
    // }, 3000);

    // if we want the streams to start in a sequence, we will have to nest them within each other
    // continued nesting in a similar fashion is referred to as 'callback hell'
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
    // this is an inefficient way of combining multiple streams of values
    // rxjs helps us combine streams together in a clean and maintainable manner
    // the default java callback interface does not scale well in complexity
    // more nesting makes code hard to read and reason about
  }
}
