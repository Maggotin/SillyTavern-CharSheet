import * as VehicleAccessors from './accessors';
import * as VehicleConstants from './constants';
import * as VehicleDerivers from './derivers';
import * as VehicleGenerators from './generators';
import * as VehicleNotes from './notes';
import * as VehicleSimulators from './simulators';
import * as VehicleTypings from './typings';
import * as VehicleUtils from './utils';
export * from './constants';
export * from './typings';
export { VehicleAccessors, VehicleDerivers, VehicleGenerators, VehicleNotes, VehicleSimulators, VehicleUtils };
export default Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, VehicleAccessors), VehicleConstants), VehicleDerivers), VehicleGenerators), VehicleNotes), VehicleSimulators), VehicleTypings), VehicleUtils);
