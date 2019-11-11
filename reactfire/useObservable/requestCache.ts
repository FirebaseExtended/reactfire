import { first, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

class ActiveRequest {
  promise: Promise<any>;
  isComplete: boolean;
  value: any;
  error: Error;

  constructor(promise) {
    this.promise = promise;
    this.isComplete = false;
  }

  setValue(value) {
    this.value = value;
    this.isComplete = true;
  }

  setError(err) {
    this.error = err;
    this.isComplete = true;
  }
}

/*
 * this will probably be replaced by something
 * like react-cache (https://www.npmjs.com/package/react-cache)
 * once that is stable.
 *
 * Full Suspense roadmap: https://reactjs.org/blog/2018/11/27/react-16-roadmap.html
 */
export class ObservablePromiseCache {
  activeRequests: Map<any, ActiveRequest>;

  constructor() {
    this.activeRequests = new Map();
  }

  getRequest(observable$: Observable<any>, observableId) {
    let request = this.activeRequests.get(observableId);

    if (!request) {
      request = new ActiveRequest(observable$.pipe(first()).toPromise());
      this.activeRequests.set(observableId, request);
    }

    return request;
  }

  removeRequest(observableId) {
    this.activeRequests.delete(observableId);
  }
}
