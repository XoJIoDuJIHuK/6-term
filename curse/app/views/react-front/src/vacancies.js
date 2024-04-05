import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

export async function getVacancies(query) {
  await fakeNetwork(`getVacancies:${query}`);
  let vacancies = await localforage.getItem("vacancies");
  if (!vacancies) vacancies = [];
  if (query) {
    vacancies = matchSorter(vacancies, query, { keys: ["first", "last"] });
  }
  return vacancies.sort(sortBy("last", "createdAt"));
}

export async function createVacancy() {
  await fakeNetwork();
  let id = Math.random().toString(36).substring(2, 9);
  let vacancy = { id, createdAt: Date.now() };
  let vacancies = await getVacancies();
  vacancies.unshift(vacancy);
  await set(vacancies);
  return vacancy;
}

export async function getVacancy(id) {
  await fakeNetwork(`vacancy:${id}`);
  let vacancies = await localforage.getItem("vacancies");
  let vacancy = vacancies.find(vacancy => vacancy.id === id);
  return vacancy ?? null;
}

export async function updateVacancy(id, updates) {
  await fakeNetwork();
  let vacancies = await localforage.getItem("vacancies");
  let vacancy = vacancies.find(vacancy => vacancy.id === id);
  if (!vacancy) throw new Error("No vacancy found for", id);
  Object.assign(vacancy, updates);
  await set(vacancies);
  return vacancy;
}

export async function deleteVacancy(id) {
  let vacancies = await localforage.getItem("vacancies");
  let index = vacancies.findIndex(vacancy => vacancy.id === id);
  if (index > -1) {
    vacancies.splice(index, 1);
    await set(vacancies);
    return true;
  }
  return false;
}

function set(vacancies) {
  return localforage.setItem("vacancies", vacancies);
}

// fake a cache so we don't slow down stuff we've already seen
let fakeCache = {};

async function fakeNetwork(key) {
  if (!key) {
    fakeCache = {};
  }

  if (fakeCache[key]) {
    return;
  }

  fakeCache[key] = true;
  return new Promise(res => {
    setTimeout(res, Math.random() * 800);
  });
}