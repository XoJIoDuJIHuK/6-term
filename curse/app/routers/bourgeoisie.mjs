import { createRouter, defineEventHandler, readBody, getCookie, getQuery, setResponseStatus } from "h3";
import { login, updatePersonal, register, changePassword, createReview, sendMail, ClientError } from '../utilFunctions.mjs';
import { BOURGEOISIE, PROLETARIAT, PROMOTION_REQUESTS, RESPONSES, REVIEWS, VACANCIES, CVS, GetRating, ACCOUNT_DROP_REQUESTS } from "../models.mjs";
import { Op } from 'sequelize';

export const bourgeoisieRouter = createRouter()
    .put('/register', defineEventHandler(async event => {
        await register(event, 'company');
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
    .get('/review', defineEventHandler(async event => {//get reviews of a prol
        try {
            const query = getQuery(event);
            if (query.id === undefined) throw new ClientError();
            else query.id = +query.id;
            const p_object = await PROLETARIAT.findByPk(query.id);
            const company = await BOURGEOISIE.findOne({ where: { login: getCookie(event, 'username') } });
            const userApplied = (await RESPONSES.findAndCountAll({ include: [
                { model: CVS, where: { applicant: p_object.id } },
                { model: VACANCIES, where: { company: company.id } }
            ] })).count > 0;
            if (!userApplied) {
                throw new ClientError('user didn\'t apply for your vacancies', 403);
            }
            const reviews = (await REVIEWS.findAll({
                include: { model: BOURGEOISIE },
                where: { p_object: p_object.id },
                attributes: ['id', 'text', 'rating']
            })).map(r => {
                return {
                    authorId: r.BOURGEOISIE.id,
                    author: r.BOURGEOISIE.name,
                    id: r.id,
                    rating: r.rating,
                    text: r.text
                }
            });
            const companysReview = reviews.find(r => r.authorId === company.id);
            const reviewAllowed = (await RESPONSES.findAndCountAll({ include: [
                { model: CVS, where: { applicant: p_object.id } },
                { model: VACANCIES, where: { company: company.id } }
            ], where: { status: 'Y' } })).count > 0;
            return {
                id: p_object.id,
                name: p_object.name,
                myReviewId: companysReview ? companysReview.id : undefined,
                reviewAllowed,
                reviews,
                rating: await GetRating('R', p_object.id)
            };
        } catch (err) {
            return err;
        }
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
                throw new ClientError('no such review');
            }
            await REVIEWS.destroy({ where: searchCondition });
            return { message: 'Отзыв удалён' };
        } catch (err) {
            setResponseStatus(event, err.code ?? 400);
            return err;
        }
    }))
    .get('/applicants-list', defineEventHandler(async event => {
        try {
            const applicants = (await RESPONSES.findAll({ include: [
                {
                    model: CVS,
                    include: {
                        model: PROLETARIAT,
                        attributes: ['id', 'name']
                    }
                },
                {
                    model: VACANCIES,
                    include: {
                        model: BOURGEOISIE,
                        where: {
                            login: getCookie(event, 'username')
                        }
                    }
                }
            ], where: { status: 'Y' }, attributes: [] })).map(r => {
                return {
                    id: r.CV.PROLETARIAT.id,
                    name: r.CV.PROLETARIAT.name
                }
            });
            return applicants;
        } catch (err) {
            setResponseStatus(event, err.code ?? 400);
            return err;
        }
    }))
    .get('/personal', defineEventHandler(async event => {
        try {
            const info = await BOURGEOISIE.findOne({ 
                where: { login: getCookie(event, 'username') }, 
                attributes: ['id', 'approved', 'description', 'email', 'name'] 
            });
            return {
                ...info.dataValues,
                promotionRequestPending: (await PROMOTION_REQUESTS.findAndCountAll({ where: { company_id: info.id } })).count > 0,
                dropRequestPending: (await ACCOUNT_DROP_REQUESTS.findAndCountAll({ where: { isCompany: 'Y', account_id: info.id } })).count > 0
            }
        } catch (err) {
            setResponseStatus(event, err.code ?? 400);
            return err;
        }
    }))
    .post('/personal', defineEventHandler(async event => {
        try {
            const { name, email, description } = await readBody(event);
            await BOURGEOISIE.update({ name, email, description }, { where: { login: getCookie(event, 'username') } });
            return { message: "Данные обновлены" };
        } catch (err) {
            setResponseStatus(event, err.code ?? 400);
            return err;
        }
    }))
    .get('/info', defineEventHandler(async event => {
        try {
            const { id } = getQuery(event);
            return {
                ...(await BOURGEOISIE.findByPk(id, { attributes: ['id', 'name', 'description', 'email'] })).dataValues,
                rating: GetRating('company', id)
            }
        } catch (err) {
            setResponseStatus(event, err.code ?? 404);
            return err;
        }
    }))
    .get('/responses', defineEventHandler(async event => {
        try {
            const company = (await BOURGEOISIE.findOne({where: {login: getCookie(event, 'username')}})).id;
            const vacancies = await VACANCIES.findAll({ where: { company } });
            const responses = await RESPONSES.findAll({ include: [{
                model: CVS,
                attributes: ['id', 'name', 'skills_json'],
                include: {
                    model: PROLETARIAT,
                    attributes: ['id', 'name', 'experience_json', 'education_json']
                }
            }, {
                model: VACANCIES,
                attributes: ['id', 'name', ]
            }], where: { vacancy: vacancies.map(e => e.id) },
                attributes: ['id', 'status'] });
            return responses.map(r => { 
                const cv = r.CV;
                const applicant = r.CV.PROLETARIAT;
                return {
                id: r.id, status: r.status, vacancy: r.VACANCy.dataValues, cv: { id: cv.id, name: cv.name, skills: cv.skills_json, applicant: { 
                    id: applicant.id,
                    name: applicant.name,
                    education: (typeof applicant.education_json === 'object') ? applicant.education_json : JSON.parse(applicant.education_json),
                    experience: (typeof applicant.experience_json === 'object') ? applicant.experience_json : JSON.parse(applicant.experience_json)
                } }
            }});
        } catch (err) {
            setResponseStatus(event, err.code ?? 404);
            return err;
        }
    }))
    .post('/responses', defineEventHandler(async event => {
        try {
            const { responseId, newStatus } = await readBody(event);
            const response = await RESPONSES.findByPk(responseId);
            if (!response) {
                throw new ClientError('Такого отклика не существует');
            }
            const oldStatus = response.status;
            if (oldStatus !== 'W') throw new ClientError('Статус уже изменён, менять нельзя', 400);
            if (newStatus === 'W') throw new ClientError('Нельзя сбрасывать статус', 400);
            await RESPONSES.update({ status: newStatus }, { where: { id: responseId } });
            const company = BOURGEOISIE.findOne({where: {name: getCookie(event, 'username')}});
            const applicant = await PROLETARIAT.findByPk((await CVS.findByPk(response.cv)).applicant);
            sendMail(company.email, applicant.email, 'your response status changed');
            return { message: 'Статус изменён' };
        } catch (err) {
            setResponseStatus(event, err.code ?? 400);
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
            setResponseStatus(event, err.code ?? 404);
            return err;
        }
    }))
    .put('/vacancy', defineEventHandler(async event => {
        try {
            const body = await readBody(event);
            const company = await BOURGEOISIE.findOne({ where: { login: getCookie(event, 'username') } });
            const vacancyExists = (await VACANCIES.findAndCountAll({ where: { company: company.id, name: body.name } })).count > 0;
            if (vacancyExists) {
                throw new ClientError('Имя вакансии занято');
            }
            validateVacancy(company, body);
            return { message: 'Вакансия создана', id: (await VACANCIES.create(Object.assign(body, { company: company.id } ))).id };
        } catch (err) {
            setResponseStatus(event, err.code ?? 400);
            return err;
        }
    }))
    .post('/vacancy', defineEventHandler(async event => {
        try {
            const vacancy = await readBody(event);
            const company = await BOURGEOISIE.findOne({ where: { login: getCookie(event, 'username') } });
            const vacancyExists = (await VACANCIES.findAndCountAll({ where: { id: vacancy.id, company: company.id } })).count > 0;
            if (!vacancyExists) {
                throw new ClientError('Такой вакансии не существует');
            }
            if ((await VACANCIES.findAndCountAll({ where: { id: { [Op.ne]: vacancy.id }, name: vacancy.name, company: company.id } })).count > 0) {
                throw new ClientError('Имя вакансии занято', 400);
            }
            if (!vacancy.active) {
                await RESPONSES.destroy({ where: { vacancy: vacancy.id } });
            }
            validateVacancy(company, vacancy);
            await VACANCIES.update(vacancy, { where: { id: vacancy.id, company: company.id } });
            return { message: 'Вакансия изменена' };
        } catch (err) {
            setResponseStatus(event, err.code ?? 400);
            return err;
        }
    }))
    .delete('/vacancy', defineEventHandler(async event => {
        try {
            const vacancy = await readBody(event);
            const company = (await BOURGEOISIE.findOne({ where: { login: getCookie(event, 'username') } })).id;
            const vacancyExists = (await VACANCIES.findAndCountAll({ where: { id: vacancy.id } })).count > 0;
            if (!vacancyExists) {
                throw new ClientError('vacancy with such id doesn\'t exist');
            }
            await RESPONSES.destroy({ where: { vacancy: vacancy.id } });
            await VACANCIES.destroy({ where: { id: vacancy.id, company } });
            return { message: 'Вакансия удалена' };
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
            await PROMOTION_REQUESTS.create({ company_id, proof });
            return { message: 'Запрос создан' };
        } catch (err) {
            console.log(err)
            return err;
        }
    }))
    .put('/drop-request', defineEventHandler(async event => {
		try {
			const user = await BOURGEOISIE.findOne({ where: { login: getCookie(event, 'username') } });
			const searchCondition = {
				isCompany: 'Y',
				account_id: user.id
			};
			if ((await ACCOUNT_DROP_REQUESTS.findAndCountAll({ where: searchCondition })).count > 0) {
				throw new ClientError('request already exists', 400);
			}
			const body = await readBody(event);
			await ACCOUNT_DROP_REQUESTS.create({ ...searchCondition, commentary: body.commentary });
            return { message: 'Запрос создан' };
		} catch (err) {
			return err;
		}
	}));

function validateVacancy(company, vacancy) {
    if (!vacancy.name || vacancy.name.length > 30) throw new ClientError('Неправильная длина названия вакансии', 400);
    for (let key of ['min_salary', 'max_salary', 'min_hours_per_day', 'max_hours_per_day']) {
        if ((vacancy[key] && Number.isInteger(vacancy[key]) && vacancy[key] >= 0) || 
            ((key === 'min_hours_per_day' || key === 'max_hours_per_day') && vacancy[key] > 24)) 
            throw new ClientError(`Ошибка в поле ${key}`, 400);
    }
    if (vacancy.region && vacancy.region.length > 20) throw new ClientError('Превышена длина региона', 400);
    if (!Number.isInteger(vacancy.experience) || vacancy.experience < 1 || vacancy.experience > 4) throw new ClientError('Неверное значение опыта', 400);
    if (!Number.isInteger(vacancy.schedule) || vacancy.schedule < 1 || vacancy.schedule > 5) throw new ClientError('Неверное значение графика', 400);
    if (!company.approved && vacancy.schedule !== 4) throw new ClientError('Компания пока не может размещать ничего, кроме заказов на фриланс', 400);
    if (vacancy.description && vacancy.description.length > 1000) throw new ClientError('Длишком длинное описание', 400);
}