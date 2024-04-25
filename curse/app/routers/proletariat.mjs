import { createRouter, defineEventHandler, getCookie, getQuery, setResponseStatus, readBody } from "h3";
import { login, updatePersonal, register, changePassword, createReview, ClientError, emailIsValid } from '../utilFunctions.mjs';
import { BOURGEOISIE, PROLETARIAT, RESPONSES, CVS, VACANCIES, REVIEWS, ACCOUNT_DROP_REQUESTS } from "../models.mjs";
import { Op } from 'sequelize';
// import { experiences } from "../views/react-front/src/constants";

export const proletariatRouter = createRouter()
	.post('/login', defineEventHandler(async event => {
		return await login(event, 'regular');
	}))
	.put('/register', defineEventHandler(async event => {
		return await register(event, 'regular');
	}))
	.get('/personal', defineEventHandler(async event => {
		try {
			const result = await PROLETARIAT.findAndCountAll({ where: { id: +getCookie(event, 'user_id') } });
			if (result.count === 0) {
				throw new ClientError();
			}
			const user = result.rows[0];
			return {
				id: user.id,
				name: user.name,
				experience: user.experience_json,
				education: user.education_json,
				email: user.email,
				dropRequestPending: (await ACCOUNT_DROP_REQUESTS.findAndCountAll({ where: { 
					isCompany: 'N', account_id: user.id 
				} })).count > 0
			};
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.post('/personal', defineEventHandler(async event => {
		return await updatePersonal(event, 'regular');
	}))
	.patch('/password', defineEventHandler(async event => {
		return await changePassword(event, 'regular');
	}))
	.put('/review', defineEventHandler(async event => {
		return await createReview(event, PROLETARIAT, BOURGEOISIE);
	}))
	.delete('/review', defineEventHandler(async event => {
		try {
			const { id } = getQuery(event);
            const user = await PROLETARIAT.findByPk(+getCookie(event, 'user_id'));
            const searchCondition = { id, p_subject: user.id };
            if ((await REVIEWS.findAndCountAll({ where: searchCondition })) === 0) {
                throw new Error('no such review');
            }
            return await REVIEWS.destroy({ where: searchCondition });
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.get('/cv', defineEventHandler(async event => {
		try {
			const queryParams = getQuery(event);
			const applicant = getCookie(event, 'user_id');
			if (queryParams.id !== undefined) {
				const matchingCvs = await CVS.findAll({ where: {
					id: queryParams.id,
					applicant
				}});
				if (matchingCvs.length === 0) {
					throw new ClientError();
				} else {
					return matchingCvs[0];
				}
			} else if (queryParams.vacancy !== undefined) {
				const vacancyId = +queryParams.vacancy;
				const takenCvs = (await RESPONSES.findAll({ where: { 
					vacancy: vacancyId
				}, attributes: ['cv']
			 	})).map(r => r.cv);
				const allCvs = (await CVS.findAll({ where: { 
					applicant,
					id: {
						[Op.notIn]: takenCvs
					}
				} }));
				const mappedCvs = []
				for (let cv of allCvs) {
					mappedCvs.push({ 
						...cv.dataValues, 
						used: (await RESPONSES.findAndCountAll({ where: {
							cv: cv.id,
							vacancy: vacancyId
						} })).count > 0
					})
				}
				return mappedCvs;
			} else {
				return await CVS.findAll({ where: { applicant }});
			}
		} catch (err) {
			setResponseStatus(err.status ?? 400);
			return err;
		}
	}))
	.put('/cv', defineEventHandler(async event => {
		try {
			const applicant = +getCookie(event, 'user_id');
			const body = await readBody(event);
			const { name, skills } = body;
			const cvExists = (await CVS.findAndCountAll({where: {
				name, 
				applicant
			}})).count > 0;
			if (cvExists) {
				throw new ClientError('Название занято');
			}
			await CVS.create({
				name,
				applicant,
				skills_json: skills
			});
			const cv = await CVS.findOne({ where: { applicant, name }});
			return { message: 'Резюме обновлено', id: cv.id };
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.post('/cv', defineEventHandler(async event => {
		try {
			const { id, name, skills } = await readBody(event);
			const existingCv = await CVS.findOne({where: {id, applicant: +getCookie(event, 'user_id')}});
			if (!existingCv) {
				throw new ClientError('Такого резюме нет');
			}
			if (existingCv.name !== name && await CVS.findOne({ where: { name } })) {
				throw new ClientError('Название занято', 400);
			}
			existingCv.name = name;
			existingCv.skills_json = skills;
			existingCv.save();
			return { message: 'Резюме обновлено' };
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.delete('/cv', defineEventHandler(async event => {
		try {
			const applicant = +getCookie(event, 'user_id');
			const { name } = await readBody(event);
			const cvExists = (await CVS.findOne({ where: { name, applicant } })).count > 0;
			if (cvExists) {
				throw new ClientError('Такого резюме не существует');
			}
			CVS.destroy({ where: { name, applicant } });
			return { message: 'Резюме удалено' };
		} catch (err) {
			setResponseStatus(event, 400);
			return err;
		}
	}))
	.get('/responses', defineEventHandler(async event => {
		async function mapResponses(cvIds) {
			const responses = (await RESPONSES.findAll({ where: {
				cv: cvIds
			}})).map(e => e.dataValues);
			for (let response of responses) {
				response.vacancyName = (await VACANCIES.findByPk(response.vacancy)).name;
			}
			return responses;
		}

		try {
			const cvIds = (await CVS.findAll({ where: { 
				applicant: +getCookie(event, 'user_id')
			}})).map(e => +e.id);
			return cvIds.length > 0 ? await mapResponses(cvIds) : [];
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.put('/responses', defineEventHandler(async event => {
		try {
			const { cv, vacancy } = await readBody(event);
			const user = await PROLETARIAT.findByPk(+getCookie(event, 'user_id'));
			if (!emailIsValid(user.email)) {
				throw new ClientError('Нет почты', 400);
			}
			await checkCvExistance(event);
			const searchCondition = { cv, vacancy };
			if (!(await VACANCIES.findByPk(vacancy)).active) {
				throw new ClientError('Вакансия недоступна');
			}
			const responseExists = (await RESPONSES.findAndCountAll({where: searchCondition})).count > 0;
			if (responseExists) {
				throw new ClientError('Такой отклик уже существует');
			}
			return { message: 'Отклик опубликован', id: (await RESPONSES.create({ ...searchCondition, status: 'W' })).id };
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.delete('/responses', defineEventHandler(async event => {
		try {
			const { cvId, vacancyId } = await readBody(event);
			await checkCvExistance(event);
			const searchCondition = {cv: cvId, vacancy: vacancyId};
			const responseExists = (await RESPONSES.findAndCountAll({where: searchCondition})).count > 0;
			if (!responseExists) {
				throw new ClientError('Нет такого отклика');
			}
			await RESPONSES.destroy({where: searchCondition});
			return { message: 'Отклик удалён' };
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}))
	.put('/drop-request', defineEventHandler(async event => {
		try {
			const searchCondition = {
				isCompany: 'N',
				account_id: +getCookie(event, 'user_id')
			};
			if ((await ACCOUNT_DROP_REQUESTS.findAndCountAll({ where: searchCondition })).count > 0) {
				throw new ClientError('Запрос уже отправлен', 400);
			}
			const body = await readBody(event);
			return { message: 'Запрос отправлен', id: (await ACCOUNT_DROP_REQUESTS.create({ ...searchCondition, 
				commentary: body.commentary })).id };
		} catch (err) {
			setResponseStatus(event, err.code ?? 400);
			return err;
		}
	}));

async function checkCvExistance(event) {
	const cvExists = (await CVS.findAndCountAll({where: {
		applicant: +getCookie(event, 'user_id')
	}})).count > 0;
	if (!cvExists) {
		throw new ClientError('Нет такого резюме');
	}
}