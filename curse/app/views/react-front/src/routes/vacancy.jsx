import { Form, useLoaderData } from "react-router-dom";
import { getVacancy } from "../vacancies";

export async function loader({ params }) {
  console.log('params', params);
  const vacancy = await getVacancy(params.vacancyId);
  if (!vacancy) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return { vacancy };
}

export default function Vacancy() {
  const { vacancy } = useLoaderData();

  return (
    <div id="vacancy">
      <div>
        <img
          key={vacancy.avatar}
          src={vacancy.avatar || null}
        />
      </div>

      <div>
        <h1>
          {vacancy.first || vacancy.last ? (
            <>
              {vacancy.first} {vacancy.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
        </h1>

        {vacancy.twitter && (
          <p>
            <a
              target="_blank"
              href={`https://twitter.com/${vacancy.twitter}`}
            >
              {vacancy.twitter}
            </a>
          </p>
        )}

        {vacancy.notes && <p>{vacancy.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (
                !confirm(
                  "Please confirm you want to delete this record."
                )
              ) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}