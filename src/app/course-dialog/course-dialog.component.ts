import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from "moment";
import { fromEvent } from "rxjs";
import {
  concatMap,
  distinctUntilChanged,
  exhaustMap,
  filter,
  mergeMap,
} from "rxjs/operators";
import { fromPromise } from "rxjs/internal-compatibility";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  course: Course;

  @ViewChild("saveButton", { static: true }) saveButton: ElementRef;

  @ViewChild("searchInput", { static: true }) searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngOnInit() {
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.7
    // in this lesson, we will see an operation that benefits from observable concatention
    // we will also cover the rxjs filter() operator
    // on the homepage, when we click edit courses, a dialog pops up
    // we want to implement auto-save functionality so that the form is saved in the background as the user edits it
    // this is useful for creating a form draft, where a form is pre-saved
    // and if the user comes back to the page, it already has some data in it
    // angular provides an observable that emits the values contained in the form
    // in this template, it is the form: FormGroup variable

    // a new value will be emitted every time any change is made to any of the form fields
    // this.form.valueChanges.subscribe(console.log);

    // we want to filter out the values of the form that are invalid
    // to do that, we will use the rxjs filter() operator
    // this operator() takes a predicate function that must return a boolean
    // if true, that value should be included in the output
    // if false, that value should be FILTERED out and excluded from the output
    // the second stream of values is going to be one http req that saves the current value of the form
    // first let's implement this logic without using observables
    // this implementation leads to nested observable calls, this is something we want to avoid in rxjs
    this.form.valueChanges
      .pipe(filter(() => this.form.valid))
      .subscribe((changes) => {
        const saveCourse$ = fromPromise(
          fetch(`/api/courses/${this.course.id}`, {
            method: "PUT",
            body: JSON.stringify(changes),
            headers: {
              "content-type": "application/json",
            },
          })
        );

        // this will trigger the http request
        saveCourse$.subscribe();
      });

    // this implementation results in a http req made each time a change is made in the form
    // every letter that is changed and typed results in a http call
    // this is highly in-efficient and undesirable behavior
    // this is not the desired logic for a save operation
    // the saves overlap, this means we cannot ensure the final valid value was saved
    // we need to wait for the previous save to complete before triggering the next save
    // so we need observable concatenation logic
    // in the next lesson, we will solve this and prevent the need for nested subscribes
    // using concat and concatMap operators

    // end of video 2.7
    ////////////////////////////////////////////////////////////////////////////////////////////
  }

  ngAfterViewInit() {}

  close() {
    this.dialogRef.close();
  }
}
