import { remoteConfig } from 'firebase/app';
import { Observable } from 'rxjs';

// TODO(davideast): Move to RxFire
export function getValue(remoteConfig: remoteConfig.RemoteConfig, key: string) {
  return new Observable(subscriber => {
    remoteConfig.ensureInitialized().then(() => {
      subscriber.next(remoteConfig.getValue(key));
    });
  });
}
