import { first, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export class ActiveRequest {
  promise: Promise<any>;
  isComplete: boolean;
  value: any;
  error: Error;

  constructor(promise) {
    this.isComplete = false;
    this.promise = promise
      .then(result => {
        this.setValue(result);
        return result;
      })
      .catch(err => {
        this.isComplete = true;
        this.setError(err);
      });
  }

  setValue = value => {
    this.value = value;
    this.isComplete = true;
  };

  setError = err => {
    this.error = err;
    this.isComplete = true;
  };
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

  getRequest(requestId) {
    const request = this.activeRequests.get(requestId);
    if (request === undefined) {
      throw new Error(`No request with ID "${requestId}" exists`);
    }
    return request;
  }

  createRequest(promise: Promise<any>, requestId): ActiveRequest {
    if (this.activeRequests.get(requestId) !== undefined) {
      throw new Error(`request "${requestId}" is already in use.`);
    }

    const request = new ActiveRequest(promise);
    this.activeRequests.set(requestId, request);

    return request;
  }

  createDedupedRequest(getPromise: () => Promise<any>, requestId) {
    let request = this.activeRequests.get(requestId);

    if (request === undefined) {
      request = this.createRequest(getPromise(), requestId);
    }

    return request;
  }

  removeRequest(requestId: string) {
    this.activeRequests.delete(requestId);
  }
}
