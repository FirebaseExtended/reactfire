import { ObservableStatus } from './useObservable';
import { AllParameters } from 'rxfire/remote-config';
import type { Value as RemoteConfigValue } from 'firebase/remote-config';
/**
 * Accepts a key and optionally a Remote Config instance. Returns a
 * Remote Config Value.
 *
 * @param key The parameter key in Remote Config
 */
export declare function useRemoteConfigValue(key: string): ObservableStatus<RemoteConfigValue>;
/**
 * Convience method similar to useRemoteConfigValue. Returns a `string` from a Remote Config parameter.
 * @param key The parameter key in Remote Config
 */
export declare function useRemoteConfigString(key: string): ObservableStatus<string>;
/**
 * Convience method similar to useRemoteConfigValue. Returns a `number` from a Remote Config parameter.
 * @param key The parameter key in Remote Config
 */
export declare function useRemoteConfigNumber(key: string): ObservableStatus<number>;
/**
 * Convience method similar to useRemoteConfigValue. Returns a `boolean` from a Remote Config parameter.
 * @param key The parameter key in Remote Config
 */
export declare function useRemoteConfigBoolean(key: string): ObservableStatus<boolean>;
/**
 * Convience method similar to useRemoteConfigValue. Returns allRemote Config parameters.
 * @param key The parameter key in Remote Config
 */
export declare function useRemoteConfigAll(key: string): ObservableStatus<AllParameters>;
