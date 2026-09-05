import dateFormated from '../../src/utils/dateFormated';

describe('dateFormated', () => {
    it('deve formatar uma data completa com zero à esquerda', () => {
        const data = new Date(2024, 0, 5, 9, 7, 3);
        const result = dateFormated(data);
        expect(result).toBe('05/01/2024 09:07:03');
    });

    it('deve formatar dia, mês, horas, minutos e segundos com padStart', () => {
        const data = new Date(2023, 11, 31, 23, 59, 59);
        const result = dateFormated(data);
        expect(result).toBe('31/12/2023 23:59:59');
    });

    it('deve manter valores de dois dígitos sem adicionar zero', () => {
        const data = new Date(2025, 9, 15, 14, 30, 45);
        const result = dateFormated(data);
        expect(result).toBe('15/10/2025 14:30:45');
    });

    it('deve usar o mês baseado em índice 0 (janeiro = 0)', () => {
        const data = new Date(2024, 0, 1, 0, 0, 0);
        const result = dateFormated(data);
        expect(result).toBe('01/01/2024 00:00:00');
    });
});
