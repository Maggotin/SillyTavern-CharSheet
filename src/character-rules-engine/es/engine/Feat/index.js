import * as FeatAccessors from './accessors';
import * as FeatGenerators from './generators';
import * as FeatSimulators from './simulators';
import * as FeatTypings from './typings';
import * as FeatUtils from './utils';
export * from './typings';
export { FeatAccessors, FeatGenerators, FeatSimulators, FeatUtils };
export default Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, FeatAccessors), FeatGenerators), FeatSimulators), FeatTypings), FeatUtils);
