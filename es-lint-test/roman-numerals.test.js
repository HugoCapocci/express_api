// eslint-disable-next-line eslint no-use-before-define
const decimalToRoman = require ('./roman-numerals');
describe('Roman numerals kata', () => {
    it('should convert 1 to I', () => {
        expect(decimalToRoman(1)).toEqual('I');
    });
    it('should convert 5 to V', () => {
        expect(decimalToRoman(5)).toEqual('V');
    });
    it('should convert 10 to X', () => {
        expect(decimalToRoman(10)).toEqual('X');
    });
    it('should convert 2 to II', () => {
        expect(decimalToRoman(2)).toEqual('II');
    });
    it('should convert 4 to IV', () => {
        expect(decimalToRoman(4)).toEqual('IV');
    });
    it('should convert 50 to L', () => {
        expect(decimalToRoman(50)).toEqual('L');
    });
    it('should convert 369 to CCCLXIX', () => {
        expect(decimalToRoman(50)).toEqual('L');
    });
});