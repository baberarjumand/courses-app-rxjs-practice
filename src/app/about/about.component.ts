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
    document.addEventListener("click", (evt) => {
      console.log(evt);
    });

    // stream example 2
    // let counter = 0;
    // setInterval(() => {
    //   console.log(counter++);
    // }, 1000);

    // stream example 3
    // setTimeout() emits one value and then completes
    // setTimeout() similar to a request to a backend that gives us back a value via a callback
    setTimeout(() => {
      console.log("finished...");
    }, 3000);

  }
}
