import { expect } from 'chai';

// eslint-disable-next-line no-undef
describe('Array', () => {
    // eslint-disable-next-line no-undef
    describe('#sort', () => {
        // eslint-disable-next-line no-undef
        it('should sorting array by name', () => {
            const names = ['Anthony', 'Stav', 'Adar', 'Ido', 'Maor', 'Neoray'];
            expect(names.sort()).to.be.eql(['Adar', 'Anthony', 'Ido', 'Maor', 'Neoray', 'Stav']);
        });
    });
});
