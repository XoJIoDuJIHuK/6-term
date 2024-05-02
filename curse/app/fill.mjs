import { PROLETARIAT, BOURGEOISIE, CVS, VACANCIES, RESPONSES } from "./models.mjs";

const prolNames = ['Ivan Ivanov', 'Petr Morozov', 'Nikolay Vatutin', 'Klim Zhukov', 'Marco Polo'];
const skills = ['SQL', 'Python3', 'C++', 'C', 'C#', 'HTML', 'CSS', 'JS', 'TS', 'Java8', 'Jakarta', 'English', 'Deutsch'];
const cvNames = ['Software Engineer', 'Python Developer', 'C++ Developer', 'Designer', 'Prompt Engineer', 'Go Developer', 'JS Intern', 'cringeneer'];
const companyNames = ['ExpertSoft', 'EffectiveSoft', 'Apple', 'Google', 'Yandex'];
const password_hash = '$2b$10$iujfXl.zABzRKFiRSkMl3.GH/MCgczusmhAq9V8Gi94KTd3jeRCd2';
const email = 'tochilo.oleg@mail.ru';
const now = new Date();
const defaultVacancy = () => { return { 
    // releaseDate: `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`, 
    release_date: now,
    min_salary: Math.floor(Math.random() * 100 + 100), 
    max_salary: Math.floor(Math.random() * 100 + 300),
    min_hours_per_day: Math.floor(Math.random() * 2 + 4),
    max_hours_per_day: Math.floor(Math.random() * 2 + 8),
    active: true,
    region: 'Minsk',
    schedule: 4,
    description: ''
}}


async function insertProls() {
    for (let i = 0; i < prolNames.length; i++) {
        await PROLETARIAT.create({ name: prolNames[i], login: `user${i + 1}`, password_hash, is_admin: false, education_json: '[]', experience_json: '[]', email });
    }
}
function generateSkillsJson() {
    const result = skills.slice();
    for (let i = 0; i < skills.length - 5; i++) {
        result.splice(Math.floor(Math.random() * result.length), 1);
    }
    return result;
}
async function insertCVS() {
    const prols = await PROLETARIAT.findAll();
    for (let prol of prols) {
        for (let i = 0; i < 3; i++) {
            await CVS.create({ name: cvNames[Math.floor(Math.random() * cvNames.length)], applicant: prol.id, skills_json: generateSkillsJson() })
        }
    }
}
async function insertBours() {
    for (let i = 0; i < companyNames.length; i++) {
        await BOURGEOISIE.create({ name: companyNames[i], login: `company${i + 1}`, password_hash, email, approved: true, description: null });
    }
}
async function insertVacancies() {
    const bours = await BOURGEOISIE.findAll();
    for (let bour of bours) {
        const vacanciesNames = cvNames.slice();
        for (let i = 0; i < cvNames - 5; i++) vacanciesNames.splice(Math.floor(Math.random() * vacanciesNames.length), 1);
        for (let name of vacanciesNames) {
            VACANCIES.create({ company: bour.id, ...defaultVacancy(), experience: Math.floor(Math.random() * 4 + 1), name });
        }
    }
}
async function generateResponses() {
    const cvs = await CVS.findAll();
    const vacancies = await VACANCIES.findAll();
    for (let v of vacancies) {
        for (let c of cvs) {
            await RESPONSES.create({ cv: c.id, vacancy: v.id, status: ['W', 'X', 'Y'][Math.floor(Math.random() * 3)] });
        }
    }
}

(async () => {
    // await insertProls();
    // await insertCVS();
    // await insertBours();
    // await insertVacancies();
    await generateResponses();
})();