import { createRouter, defineEventHandler, getCookie, getQuery, sendRedirect, setResponseStatus } from "h3";
import { authenticateTokens } from '../auth.mjs';
import { login, updatePersonal, register, changePassword, createReview, parseBody } from '../utilFunctions.mjs';
import { BOURGEOISIE, PROLETARIAT, RESPONSES } from "../models.mjs";

export const proletariatRouter = createRouter()
	.get('/resource', defineEventHandler(async event => {
		if (!(await authenticateTokens(event, 'regular'))) {
			await sendRedirect(event, '/notfound');
		}
		return 'protected resource (xd)';
	}))
	.post('/login', defineEventHandler(async event => {
		await login(event, 'regular');
		return 'why not redirected?';
	}))
	.put('/register', defineEventHandler(async event => {
		return await register(event, 'regular');
	}))
	.post('/personal', defineEventHandler(async event => {
		if (!await authenticateTokens(event, 'regular')) {
			setResponseStatus(event, 403);
			return 'not authorized';
		}
		return await updatePersonal(event, 'regular');
	}))
	.patch('/password', defineEventHandler(async event => {
		if (!await authenticateTokens(event, 'regular')) {
			setResponseStatus(event, 403);
			return 'not authorized';
		}
		return await changePassword(event, 'regular')
	}))
	.post('/review', defineEventHandler(async event => {
		if (!await authenticateTokens(event, 'regular')) {
			setResponseStatus(event, 403);
			return 'not authorized';
		}
		return await createReview(event, PROLETARIAT, BOURGEOISIE);
	}))
	.put('/cv', defineEventHandler(async event => {
		if (!await authenticateTokens(event, 'regular')) {
			setResponseStatus(event, 403);
			return 'not authorized';
		}
		try {
			const user = await PROLETARIAT.findOne({where: {login: getCookie(event, 'username')}});
			const { name, skills } = await parseBody(event);
			const cvExists = (await CVS.findOne({where: {name, applicant: user.id}})).count > 0;
			if (cvExists) {
				throw new Error('name is taken');
			}
			CVS.create({
				name,
				applicant: user.id,
				skills_json: skills
			});
		} catch (err) {
			setResponseStatus(event, 400);
			return err;
		}
	}))
	.post('/cv', defineEventHandler(async event => {
		if (!await authenticateTokens(event, 'regular')) {
			setResponseStatus(event, 403);
			return 'not authorized';
		}
		try {
			const user = await PROLETARIAT.findOne({where: {login: getCookie(event, 'username')}});
			const { id, name, skills } = await parseBody(event);
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
		if (!await authenticateTokens(event, 'regular')) {
			setResponseStatus(event, 403);
			return 'not authorized';
		}
		try {
			const user = await PROLETARIAT.findOne({where: {login: getCookie(event, 'username')}});
			const { name } = await parseBody(event);
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
		if (!await authenticateTokens(event, 'regular')) {
			setResponseStatus(event, 403);
			return 'not authorized';
		}
		return await RESPONSES.findAll({include: [{
			model: PROLETARIAT,
			where: {
				name: getCookie(event, 'username')
			}
		}]});
	}))
	.put('/responses', defineEventHandler(async event => {
		if (!await authenticateTokens(event, 'regular')) {
			setResponseStatus(event, 403);
			return 'not authorized';
		}
		try {
			const { cvId, vacancyId } = await parseBody(event);
			await checkCvExistance(event);
			const searchCondition = {cv: cvId, vacancy: vacancyId};
			const responseExists = (await RESPONSES.findAndCountAll({where: searchCondition})).count > 0;
			if (responseExists) {
				throw new Error('response exists');
			}
			RESPONSES.create(Object.assign(searchCondition, {status: 'W'}));
		} catch (err) {
			setResponseStatus(event, 400);
			return err;
		}
	}))
	.delete('/responses', defineEventHandler(async event => {
		if (!await authenticateTokens(event, 'regular')) {
			setResponseStatus(event, 403);
			return 'not authorized';
		}
		try {
			const { cvId, vacancyId } = await parseBody(event);
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
	}));

async function checkCvExistance(event) {
	const cvExists = (await CVS.findAndCountAll({where: {
		applicant: (await PROLETARIAT.findOne({where: {name: getCookie(event, 'username')}})).id
	}})).count > 0;
	if (!cvExists) {
		throw new Error('no such cv');
	}
}