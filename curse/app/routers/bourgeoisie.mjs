import { createRouter, defineEventHandler, readBody, getCookie, getQuery, setResponseStatus } from "h3";
import { login, updatePersonal, register, changePassword, createReview, sendMail, ClientError } from '../utilFunctions.mjs';
import { BOURGEOISIE, PROLETARIAT, PROMOTION_REQUESTS, RESPONSES, REVIEWS, VACANCIES } from "../models.mjs";

export const bourgeoisieRouter = createRouter()
    .put('/register', defineEventHandler(async event => {
        return await register(event, 'company');
    }))
    .post('/login', defineEventHandler(async event => {
        return await login(event, 'company');
    }))
    .post('/personal', defineEventHandler(async event => {
        return await updatePersonal(event, 'company');
    }))
    .patch('/password', defineEventHandler(async event => {
        return await changePassword(event, 'company')
    }))
    .put('/review', defineEventHandler(async event => {
        return await createReview(event, BOURGEOISIE, PROLETARIAT);
    }))
    .delete('/review', defineEventHandler(async event => {
        try {
            const { id } = getQuery(event);
            const company = (await BOURGEOISIE.findOne({ where: { login: getCookie(event, 'username') } }));
            const searchCondition = { id, b_subject: company.id };
            if ((await REVIEWS.findAndCountAll({ where: searchCondition })) === 0) {
                throw new Error('no such review');
            }
            return await REVIEWS.destroy({ where: searchCondition });
        } catch (err) {
            return err;
        }
    }))
    .get('/personal', defineEventHandler(async event => {
        try {
            return await BOURGEOISIE.findOne({ 
                where: { login: getCookie(event, 'username') }, 
                attributes: ['id', 'approved', 'description', 'email', 'name'] 
            });
        } catch (err) {
            return err;
        }
    }))
    .post('/personal', defineEventHandler(async event => {
        try {
            const { name, email, description } = await readBody(event);
            await BOURGEOISIE.update({ name, email, description }, { where: { login: getCookie(event, 'username') } });
            return ["success"];
        } catch (err) {
            return err;
        }
    }))
    .get('/info', defineEventHandler(async event => {
        try {
            const { id } = getQuery(event);
            return await BOURGEOISIE.findByPk(+id, { attributes: ['name', 'description', 'email'] });
        } catch (err) {
            return err;
        }
    }))
    .get('/responses', defineEventHandler(async event => {
        return await RESPONSES.findAll({include: [{
            model: VACANCIES,
            where: {
                company: (await BOURGEOISIE.findOne({where: {name: getCookie(event, 'username')}})).id
            }
        }]});
    }))
    .post('/responses', defineEventHandler(async event => {
        try {
            const { responseId, newStatus } = await readBody(event);
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
    }))
    .get('/vacancy', defineEventHandler(async event => {
        try {
            const query = getQuery(event);
            const company = (await BOURGEOISIE.findOne({ where: { login: getCookie(event, 'username') } })).id;
            const id = query.id;
            if (id === undefined) {
                return await VACANCIES.findAll({ where: { company } });
            } else {
                return await VACANCIES.findOne({ where: { company, id }, rejectOnEmpty: true });
            }
        } catch (err) {
            return err;
        }
    }))
    .put('/vacancy', defineEventHandler(async event => {
        try {
            const body = await readBody(event);
            const company = (await BOURGEOISIE.findOne({ where: { login: getCookie(event, 'username') } }));
            const vacancyExists = (await VACANCIES.findAndCountAll({ where: { company: company.id, name: body.name } })).count > 0;
            if (vacancyExists) {
                throw new Error('vacancy with such name already exists');
            }
            return (await VACANCIES.create(Object.assign(body, { company: company.id } ))).id;
        } catch (err) {
            return err;
        }
    }))
    .post('/vacancy', defineEventHandler(async event => {
        try {
            const vacancy = await readBody(event);
            const company = (await BOURGEOISIE.findOne({ where: { login: getCookie(event, 'username') } })).id;
            const vacancyExists = (await VACANCIES.findAndCountAll({ where: { id: vacancy.id } })).count > 0;
            if (!vacancyExists) {
                throw new Error('vacancy with such id doesn\'t exist');
            }
            if (!vacancy.active) {
                await RESPONSES.destroy({ where: { vacancy: vacancy.id } });
            }
            await VACANCIES.update(Object.assign(body, { company } ), { where: { id: vacancy.id, company } });
        } catch (err) {
            return err;
        }
    }))
    .delete('/vacancy', defineEventHandler(async event => {
        try {
            const vacancy = await readBody(event);
            const company = (await BOURGEOISIE.findOne({ where: { login: getCookie(event, 'username') } })).id;
            const vacancyExists = (await VACANCIES.findAndCountAll({ where: { id: vacancy.id } })).count > 0;
            if (!vacancyExists) {
                throw new Error('vacancy with such id doesn\'t exist');
            }
            await RESPONSES.destroy({ where: { vacancy: vacancy.id } });
            await VACANCIES.destroy({ where: { id: vacancy.id, company } });
        } catch (err) {
            return err;
        }
    }))
    .put('/promotion-request', defineEventHandler(async event => {
        try {
            const company_id = (await BOURGEOISIE.findOne({ where: { login: getCookie(event, 'username') } })).id;
            const proof = await readBody(event);
            if (await PROMOTION_REQUESTS.findOne({ where: { company_id } })) {
                throw new ClientError('request already exists', 409);
            }
            await PROMOTION_REQUESTS.create({ company_id, proof })
        } catch (err) {
            console.log(err)
            return err;
        }
    }));