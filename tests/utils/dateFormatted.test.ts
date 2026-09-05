import dateFormatted from '../../src/utils/dateFormatted';

describe('dateFormatted', () => {
    it('deve formatar uma data completa com zero à esquerda', () => {
        const data = new Date(Date.UTC(2024, 0, 5, 9, 7, 3));
        const result = dateFormatted(data);
        expect(result).toBe('05/01/2024 09:07:03');
    });

    it('deve formatar dia, mês, horas, minutos e segundos com padStart', () => {
        const data = new Date(Date.UTC(2023, 11, 31, 23, 59, 59));
        const result = dateFormatted(data);
        expect(result).toBe('31/12/2023 23:59:59');
    });

    it('deve manter valores de dois dígitos sem adicionar zero', () => {
        const data = new Date(Date.UTC(2025, 9, 15, 14, 30, 45));
        const result = dateFormatted(data);
        expect(result).toBe('15/10/2025 14:30:45');
    });

    it('deve usar o mês baseado em índice 0 (janeiro = 0)', () => {
        const data = new Date(Date.UTC(2024, 0, 1, 0, 0, 0));
        const result = dateFormatted(data);
        expect(result).toBe('01/01/2024 00:00:00');
    });

    it('deve formatar em UTC, independente do fuso local do servidor', () => {
        const data = new Date('2024-06-15T12:00:00Z');
        const result = dateFormatted(data);
        expect(result).toBe('15/06/2024 12:00:00');
    });
});