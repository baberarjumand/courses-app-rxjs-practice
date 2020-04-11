import { Observable } from "rxjs";

export function createHttpObservable(url: string) {
  return Observable.create((observer) => {
    const abortController = new AbortController();
    // if the signal emits a TRUE value, then fetch req gets cancelled
    const signal = abortController.signal;

    fetch(url, { signal })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          observer.error("Request failed with status code: " + response.status);
        }
      })
      .then((body) => {
        observer.next(body);
        observer.complete();
      })
      .catch((err) => {
        observer.error(err);
      });

    // this is the cancellation function
    // this will be triggered when a subscriber will unsubscribe
    return () => abortController.abort();
  });
}
