import { createRouter, defineEventHandler, defineNodeListener, getCookie, getQuery, sendRedirect, setResponseStatus } from "h3";
import { authenticateTokens } from '../auth.mjs';
import { login, updatePersonal, register, changePassword, createReview, parseBody, sendMail } from '../utilFunctions.mjs';
import { BOURGEOISIE, PROLETARIAT, RESPONSES, VACANCIES } from "../models.mjs";

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
            setResponseStatus(event, 403);
            return 'not authorized';
        }
        return await updatePersonal(event, 'company');
    }))
    .patch('/password', defineEventHandler(async event => {
        if (!await authenticateTokens(event, 'company')) {
            setResponseStatus(event, 403);
            return 'not authorized';
        }
        return await changePassword(event, 'company')
    }))
    .post('/review', defineEventHandler(async event => {
        if (!await authenticateTokens(event, 'company')) {
            setResponseStatus(event, 403);
            return 'not authorized';
        }
        return await createReview(event, BOURGEOISIE, PROLETARIAT);
    }))
    .get('/info', defineEventHandler(async event => {
        const { companyId } = getQuery(event);
        const company = await BOURGEOISIE.findByPk(companyId);
        if (!company) {
            await sendRedirect('/notfound');
            return 'why not redirected?';
        }
        return company.dataValues;
    }))
    .get('/responses', defineEventHandler(async event => {
        if (!await authenticateTokens(event, 'company')) {
            setResponseStatus(event, 403);
            return 'not authorized';
        }
        return await RESPONSES.findAll({include: [{
            model: VACANCIES,
            where: {
                company: (await BOURGEOISIE.findOne({where: {name: getCookie(event, 'username')}})).id
            }
        }]});
    }))
    .post('/responses', defineEventHandler(async event => {
        if (!await authenticateTokens(event, 'company')) {
            setResponseStatus(event, 403);
            return 'not authorized';
        }
        try {
            const { responseId, newStatus } = await parseBody(event);
            const response = await RESPONSES.findAndCountAll({where: {id: responseId}});
            if (!response) {
                throw new Error('no such response');
            }
            response.status = newStatus;
            response.save();
            const company = BOURGEOISIE.findOne({where: {name: getCookie(event, 'username')}});
            const applicant = await PROLETARIAT.findByPk((await CV.findByPk(response.cv)).applicant);
            sendMail(company.email, applicant.email, 'your response status changed');
            return 'changed';
        } catch (err) {
            setResponseStatus(event, 400);
            return err;
        }
    }));