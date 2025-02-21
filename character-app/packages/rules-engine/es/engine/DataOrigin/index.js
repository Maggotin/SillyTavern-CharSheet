import * as DataOriginConstants from './constants';
import * as DataOriginGenerators from './generators';
import * as DataOriginTypings from './typings';
import * as DataOriginUtils from './utils';
export * from './constants';
export * from './typings';
export { DataOriginGenerators, DataOriginUtils };
export default Object.assign(Object.assign(Object.assign(Object.assign({}, DataOriginConstants), DataOriginGenerators), DataOriginTypings), DataOriginUtils);
