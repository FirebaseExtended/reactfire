import { Observable } from 'rxjs';
import type { RemoteConfig } from 'firebase/remote-config';
export declare function getJSON<T>(remoteConfig: RemoteConfig, key: string): Observable<T>;
