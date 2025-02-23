import * as PdfGenerators from './generators';
import * as PdfHacks from './hacks';
import * as PdfTypings from './typings';
export * from './typings';
export { PdfGenerators, PdfHacks };
export default Object.assign(Object.assign(Object.assign({}, PdfGenerators), PdfTypings), PdfHacks);
