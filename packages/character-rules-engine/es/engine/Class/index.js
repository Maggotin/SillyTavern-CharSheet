import * as ClassAccessors from './accessors';
import * as ClassDerivers from './derivers';
import * as ClassGenerators from './generators';
import * as ClassTypings from './typings';
import * as ClassUtils from './utils';
import * as ClassValidators from './validators';
export * from './typings';
export { ClassAccessors, ClassGenerators, ClassDerivers, ClassValidators, ClassUtils };
export default Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, ClassAccessors), ClassGenerators), ClassTypings), ClassDerivers), ClassValidators), ClassUtils);
