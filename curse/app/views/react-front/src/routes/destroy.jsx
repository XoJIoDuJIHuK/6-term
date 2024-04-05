import { redirect } from "react-router-dom";
import { deleteVacancy } from "../vacancies";

export async function action({ params }) {
  // throw new Error("oh dang!");
  await deleteVacancy(params.contactId);
  return redirect("/");
}