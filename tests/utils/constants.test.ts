import Constant from '../../src/utils/constants';

describe('Constant', () => {
    it('deve expor os códigos HTTP esperados', () => {
        expect(Constant.BAD_REQUEST).toBe(400);
        expect(Constant.SUCCESS).toBe(200);
        expect(Constant.GENERIC_ERROR).toBe(500);
        expect(Constant.UNAUTHORIZED).toBe(401);
    });

    it('deve expor valores numéricos', () => {
        const values = Object.values(Constant);
        values.forEach((value) => {
            expect(typeof value).toBe('number');
        });
    });
});
