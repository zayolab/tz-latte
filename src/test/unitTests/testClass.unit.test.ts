import { TestClass } from '../fixtures/testClass';
import { expect } from 'chai';
import 'mocha';

describe('TestClass', () => {
    describe('#sleep', () => {
        it('waits for 5 seconds', async () => {
            const testObj = new TestClass();
            const result = await testObj.sleep(1000);
            expect(result).to.equal(1);
        }).timeout(15000);
    });
    describe('#hello', () => {
        it('Should return Hello World!', () => {
            const result = TestClass.hello('World');
            expect(result).to.equal('Hello World!');
        });
    });
});
