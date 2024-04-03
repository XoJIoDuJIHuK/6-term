import { createRouter, defineEventHandler, setResponseStatus } from "h3";
import { authenticateTokens } from '../auth.mjs';
import { login, updatePersonal, register, changePassword, createReview } from '../utilFunctions.mjs';
import { BOURGEOISIE, PROLETARIAT } from "../models.mjs";

export const bourgeoisieRouter = createRouter()
    .put('/register', defineEventHandler(async event => {
        return await register(event, 'company');
    }))
    .post('/login', defineEventHandler(async event => {
        await login(event, 'company');
        return 'why not redirected?';
    }))
    .post('/personal', defineEventHandler(async event => {
        if (!await authenticateTokens(event, 'company')) {
            setResponseStatus(event, 402);
            return 'not authorized';
        }
        return await updatePersonal(event, 'company');
    }))
    .patch('/password', defineEventHandler(async event => {
        if (!await authenticateTokens(event, 'company')) {
            setResponseStatus(event, 402);
            return 'not authorized';
        }
        return await changePassword(event, 'company')
    }))
    .post('/review', defineEventHandler(async event => {
        if (!await authenticateTokens(event, 'company')) {
            setResponseStatus(event, 402);
            return 'not authorized';
        }
        return await createReview(event, BOURGEOISIE, PROLETARIAT);
    }));