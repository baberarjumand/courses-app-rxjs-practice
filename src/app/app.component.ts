import { Component, OnInit } from "@angular/core";
import { Store } from "./common/store.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  title = "app";

  constructor(private storeService: Store) {}

  ngOnInit(): void {
    this.storeService.init();
  }
}
