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
    // this.form.valueChanges
    //   .pipe(filter(() => this.form.valid))
    //   .subscribe((changes) => {
    //     const saveCourse$ = fromPromise(
    //       fetch(`/api/courses/${this.course.id}`, {
    //         method: "PUT",
    //         body: JSON.stringify(changes),
    //         headers: {
    //           "content-type": "application/json",
    //         },
    //       })
    //     );

    //     // this will trigger the http request
    //     saveCourse$.subscribe();
    //   });

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
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.8

    // // we will see in this lesson a practical use of observable concatenation
    // // we will see why concatenation is ideally suited for save operations
    // // we want to make sure our save operations happen in the same order our form values are emitted
    // // our implementation in the last lesson does not provide that logic

    // // we want to take the values of the source observable
    // // and for each value, create a new save observable
    // // then we want to concatenate all those derived observables, so that they execute in sequence
    // // this will ensure the save operations are done in the right order
    // // we have a mixture now of a mapping operation, where we are taking the value of
    // // form.valueChanges observable, and we are creating from it a second saveCourse$ observable
    // // this mixture of transforming one observable into another and concatenating the result together
    // // is best implemented using the concatMap() rxjs operator
    // // refer to official doc of concatMap() @ reactivex.io
    // // concatMap() will listen to values from first observable, map them to output
    // // then when all the first observable values are mapped and the first observable completes,
    // // then the concatMap() will start listening to the values emitted from the second observable,
    // // and start mapping them, it CONCATS and MAPS each observable in sequence
    // // only when the first observable completes is when the second observable values start getting mapped

    // // in our case of the form on this page, we want to take the form values,
    // // turn them into http requests and wait for the first http req to complete before
    // // creating and executing the second http request

    // this.form.valueChanges
    //   .pipe(
    //     filter(() => this.form.valid),
    //     concatMap((changes) => this.saveCourse(changes))
    //   )
    //   .subscribe();

    // // on inspecting the http requests using browser dev tools, we observe that the http requests
    // // do not overlap anymore and are executed in sequence as expected
    // // the second save operation is only triggered once the first one completes
    // // later in the course, we will see another operator that will allow us to reduce the number of reqs
    // // that will be the debounceTime() operator

    // // what if instead of having our operations execute in sequence like in this lesson,
    // // what if we want the operations to execute in parallel, as fast as possible
    // // this will lead us to another observable strategy called MERGE in the next lesson

    // end of video 2.8
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.9

    // in the last lesson, we looked at the concat strategy of combining observables
    // concat is all about completion, waiting for one observable to complete before
    // subscribing and using the next observable
    // now we will see a new strategy of combining observables, the MERGE strategy

    // first let us introduce merge and then cover merge map
    // refer to about component to find code for this video

    // end of video 2.9
    ////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////
    // start of video 2.10

    // in this lesson we will see merge() is ideal for performing http reqs in parallel
    // when we used concatMap(), it ensured the second save operation would start only when
    // the first save operation completes, that is the desired logic in this case
    // but if you want to make multiple calls to backend in parallel and fetch results of
    // each call as they arrive over time, then we can use mergeMap() operator
    // refer to official doc for mergeMap() @ reactivex.io

    // this.form.valueChanges
    //   .pipe(
    //     filter(() => this.form.valid),
    //     mergeMap((changes) => this.saveCourse(changes))
    //   )
    //   .subscribe();

    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        concatMap((changes) => this.saveCourse(changes))
      )
      .subscribe();

    // upon inspecting http reqs in browser dev tools, the expected parallel execution behavior is observed
    // however, in this case, our desired operation for saves in concatMap()
    // if order of execution is important when combining observables, use concatMap()
    // if the desired order of execution doesn't matter and you want max speed using parallel
    // execution, use mergeMap()
    // in next lessons, we will cover exhaustMap() and switchMap()
    // end of video 2.10
    ////////////////////////////////////////////////////////////////////////////////////////////
  }

  saveCourse(changes) {
    return fromPromise(
      fetch(`/api/courses/${this.course.id}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      })
    );
  }

  ngAfterViewInit() {}

  close() {
    this.dialogRef.close();
  }
}
