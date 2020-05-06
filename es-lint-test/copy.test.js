/*const copyFile = require('./copy');
const fs = require('fs');
jest.mock('fs', () => {
    return {
        readFileSync:  jest.fn().mockReturnValue('fakeFileContent'),
        writeFileSync: jest.fn()
    }
});
describe('copyFile', () => {
    it('Should copy entry file to output folder', () => {
        copyFile('fakeCopieName');
        expect(fs.readFileSync).toHaveBeenCalledWith('./in/fakeCopieName');
        expect(fs.writeFileSync).toHaveBeenCalledWith('./out/fakeCopieName', 'fakeFileContent');
    });
});
*/