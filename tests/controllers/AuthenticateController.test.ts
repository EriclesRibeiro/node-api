import { Request, Response } from 'express';
import { AuthenticateController } from '../../src/app/controllers/AuthenticateController';

const signUpExecute = jest.fn();
const verifyEmailExecute = jest.fn();
const signInExecute = jest.fn();

jest.mock('../../src/app/useCases/signUpUseCase', () => ({
    SignUpUseCase: jest.fn().mockImplementation(() => ({ execute: signUpExecute })),
}));

jest.mock('../../src/app/useCases/verifyEmailUseCase', () => ({
    VerifyEmailUseCase: jest.fn().mockImplementation(() => ({ execute: verifyEmailExecute })),
}));

jest.mock('../../src/app/useCases/signInUseCase', () => ({
    SignInUseCase: jest.fn().mockImplementation(() => ({ execute: signInExecute })),
}));

import { SignUpUseCase } from '../../src/app/useCases/signUpUseCase';
import { VerifyEmailUseCase } from '../../src/app/useCases/verifyEmailUseCase';
import { SignInUseCase } from '../../src/app/useCases/signInUseCase';

describe('AuthenticateController', () => {
    const controller = new AuthenticateController();

    const mockResponse = () => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('signUp', () => {
        it('deve lançar erro quando email não informado', async () => {
            const req = { body: { password: '123', name: 'João', sexo: 'M' } } as Request;
            const res = mockResponse();

            await expect(controller.signUp(req, res)).rejects.toThrow('É necessário informar o email!');
        });

        it('deve lançar erro quando senha não informada', async () => {
            const req = { body: { email: 'a@b.com', name: 'João', sexo: 'M' } } as Request;
            const res = mockResponse();

            await expect(controller.signUp(req, res)).rejects.toThrow('É necessário informar a senha!');
        });

        it('deve lançar erro quando nome não informado', async () => {
            const req = { body: { email: 'a@b.com', password: '123', sexo: 'M' } } as Request;
            const res = mockResponse();

            await expect(controller.signUp(req, res)).rejects.toThrow('É necessário informar o nome!');
        });

        it('deve lançar erro quando sexo não informado', async () => {
            const req = { body: { email: 'a@b.com', password: '123', name: 'João' } } as Request;
            const res = mockResponse();

            await expect(controller.signUp(req, res)).rejects.toThrow('É necessário informar o sexo!');
        });

        it('deve retornar 201 com sucesso no cadastro', async () => {
            signUpExecute.mockResolvedValue(true);
            const req = {
                body: { email: 'a@b.com', password: '123', name: 'João', sexo: 'M' },
            } as Request;
            const res = mockResponse();

            await controller.signUp(req, res);

            expect(SignUpUseCase).toHaveBeenCalledTimes(1);
            expect(signUpExecute).toHaveBeenCalledWith({
                email: 'a@b.com',
                password: '123',
                name: 'João',
                sexo: 'M',
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                error: null,
                body: {
                    success: true,
                    data: { message: 'Cadastro realizado com sucesso!' },
                },
            });
        });
    });

    describe('verifyEmail', () => {
        it('deve lançar erro quando email não informado', async () => {
            const req = { query: {} } as unknown as Request;
            const res = mockResponse();

            await expect(controller.verifyEmail(req, res)).rejects.toThrow('É necessário informar o email!');
        });

        it('deve retornar 200 com o resultado da verificação', async () => {
            verifyEmailExecute.mockResolvedValue({ some: 'result' });
            const req = { query: { email: 'a@b.com' } } as unknown as Request;
            const res = mockResponse();

            await controller.verifyEmail(req, res);

            expect(VerifyEmailUseCase).toHaveBeenCalledTimes(1);
            expect(verifyEmailExecute).toHaveBeenCalledWith({ email: 'a@b.com' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ some: 'result' });
        });
    });

    describe('signIn', () => {
        it('deve lançar erro quando email não informado', async () => {
            const req = { body: { password: '123' } } as Request;
            const res = mockResponse();

            await expect(controller.signIn(req, res)).rejects.toThrow('É necessário informar o email!');
        });

        it('deve lançar erro quando senha não informada', async () => {
            const req = { body: { email: 'a@b.com' } } as Request;
            const res = mockResponse();

            await expect(controller.signIn(req, res)).rejects.toThrow('É necessário informar a senha!');
        });

        it('deve retornar 200 com o resultado do login', async () => {
            signInExecute.mockResolvedValue({ login: 'ok' });
            const req = { body: { email: 'a@b.com', password: '123' } } as Request;
            const res = mockResponse();

            await controller.signIn(req, res);

            expect(SignInUseCase).toHaveBeenCalledTimes(1);
            expect(signInExecute).toHaveBeenCalledWith({ email: 'a@b.com', password: '123' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ login: 'ok' });
        });
    });
});
