import * as DecorationAccessors from './accessors';
import * as DecorationGenerators from './generators';
import * as DecorationTypings from './typings';
import * as DecorationUtils from './utils';
export * from './typings';
export { DecorationAccessors, DecorationGenerators, DecorationUtils };
export default Object.assign(Object.assign(Object.assign(Object.assign({}, DecorationAccessors), DecorationGenerators), DecorationTypings), DecorationUtils);
