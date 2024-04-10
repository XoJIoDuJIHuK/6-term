import { createRouter, defineEventHandler, getCookie, getQuery, setResponseStatus, readBody } from "h3";
import { login, updatePersonal, register, changePassword, createReview, ClientError } from '../utilFunctions.mjs';
import { BOURGEOISIE, PROLETARIAT, RESPONSES, CVS, VACANCIES, REVIEWS } from "../models.mjs";
import { Op } from 'sequelize';

export const proletariatRouter = createRouter()
	.post('/login', defineEventHandler(async event => {
		return await login(event, 'regular');
	}))
	.put('/register', defineEventHandler(async event => {
		return await register(event, 'regular');
	}))
	.get('/personal', defineEventHandler(async event => {
		try {
			const result = await PROLETARIAT.findAndCountAll({ where: { login: getCookie(event, 'username') } });
			if (result.count === 0) {
				throw new ClientError();
			}
			return result.rows[0];
		} catch (err) {
			return err;
		}
	}))
	.post('/personal', defineEventHandler(async event => {
		return await updatePersonal(event, 'regular');
	}))
	.patch('/password', defineEventHandler(async event => {
		return await changePassword(event, 'regular');
	}))
	.post('/review', defineEventHandler(async event => {
		return await createReview(event, PROLETARIAT, BOURGEOISIE);
	}))
	.get('/cv', defineEventHandler(async event => {
		try {
			const queryParams = getQuery(event);
			const applicant = (await PROLETARIAT.findOne({ where: {login: getCookie(event, 'username')}})).id;
			if (queryParams.id !== undefined) {
				const matchingCvs = await CVS.findAll({ where: {
					id: queryParams.id,
					applicant
				}});
				if (matchingCvs.length === 0) {
					setResponseStatus(event, 404);
					return { message: 'not found' };
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
			setResponseStatus(400);
			return err;
		}
	}))
	.put('/cv', defineEventHandler(async event => {
		try {
			const applicant = (await PROLETARIAT.findOne({ where: {login: getCookie(event, 'username')}})).id;
			const body = await readBody(event);
			const { name, skills } = body;
			const cvExists = (await CVS.findAndCountAll({where: {
				name, 
				applicant
			}})).count > 0;
			if (cvExists) {
				throw new Error('name is taken');
			}
			await CVS.create({
				name,
				applicant,
				skills_json: skills
			});
			const cv = await CVS.findOne({ where: { applicant, name }});
			return { id: cv.id };
		} catch (err) {
			setResponseStatus(event, 400);
			return err;
		}
	}))
	.post('/cv', defineEventHandler(async event => {
		try {
			const user = await PROLETARIAT.findOne({where: {login: getCookie(event, 'username')}});
			const { id, name, skills } = await readBody(event);
			const existingCv = await CVS.findOne({where: {id, applicant: user.id}});
			if (!existingCv) {
				throw new Error('name is taken');
			}
			existingCv.name = name;
			existingCv.skills_json = skills;
			existingCv.save();
		} catch (err) {
			setResponseStatus(event, 400);
			return err;
		}
	}))
	.delete('/cv', defineEventHandler(async event => {
		try {
			const user = await PROLETARIAT.findOne({where: {login: getCookie(event, 'username')}});
			const { name } = await readBody(event);
			const cvExists = (await CVS.findOne({where: {name, applicant: user.id}})).count > 0;
			if (cvExists) {
				throw new Error('no such cv');
			}
			CVS.destroy({
				where: {
					name,
					applicant: user.id
				}
			});
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
				applicant: (await PROLETARIAT.findOne({where: { login: getCookie(event, 'username')}})).id 
			}})).map(e => +e.id);
			return cvIds.length > 0 ? await mapResponses(cvIds) : [];
		} catch (err) {
			setResponseStatus(event, 400);
			return err;
		}
	}))
	.put('/responses', defineEventHandler(async event => {
		try {
			const { cv, vacancy } = await readBody(event);
			await checkCvExistance(event);
			const searchCondition = { cv, vacancy };
			if (!(await VACANCIES.findByPk(vacancy)).active) {
				throw new Error('vacancy is not available');
			}
			const responseExists = (await RESPONSES.findAndCountAll({where: searchCondition})).count > 0;
			if (responseExists) {
				throw new Error('response exists');
			}
			return { id: (await RESPONSES.create({ ...searchCondition, status: 'W' })).id };
		} catch (err) {
			setResponseStatus(event, 400);
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
				throw new Error('response exists');
			}
			RESPONSES.destroy({where: searchCondition});
		} catch (err) {
			setResponseStatus(event, 400);
			return err;
		}
	}))
	.delete('/review', defineEventHandler(async event => {
        try {
            const { id } = getQuery(event);
            const user = (await PROLETARIAT.findOne({ where: { login: getCookie(event, 'username') } }));
            const searchCondition = { id, p_subject: user.id };
            if ((await REVIEWS.findAndCountAll({ where: searchCondition })) === 0) {
                throw new Error('no such review');
            }
            return await REVIEWS.destroy({ where: searchCondition });
        } catch (err) {
            return err;
        }
    }));

async function checkCvExistance(event) {
	const cvExists = (await CVS.findAndCountAll({where: {
		applicant: (await PROLETARIAT.findOne({where: {login: getCookie(event, 'username')}})).id
	}})).count > 0;
	if (!cvExists) {
		throw new Error('no such cv');
	}
}