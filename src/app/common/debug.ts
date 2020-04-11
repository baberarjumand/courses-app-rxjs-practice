import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export enum RxJsLoggingLevel {
  TRACE,
  DEBUG,
  INFO,
  ERROR,
}

let rxjsLoggingLevel = RxJsLoggingLevel.INFO;

export function setRxJsLoggingLevel(level: RxJsLoggingLevel) {
  rxjsLoggingLevel = level;
}

// a higher order function is one that returns another function
// this debug will take as input an observable, and return another observable
// srcObs -> source observable
export const debug = (level: number, message: string) => (
  srcObs: Observable<any>
) =>
  srcObs.pipe(
    tap((val) => {
      if (level >= rxjsLoggingLevel) {
        console.log(message + ": ", val);
      }
    })
  );
