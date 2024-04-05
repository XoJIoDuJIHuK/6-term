import { useLoaderData, Form, NavLink } from "react-router-dom";
import { getVacancies } from "../vacancies";

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const vacancies = await getVacancies(q);
  return { vacancies, q };
}

export default function Index() {
  const { vacancies, q } = useLoaderData();
  return (
    <>
      <div id="sidebar">
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search vacancies"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={true}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
        </div>

      </div>
      <div>
        {vacancies.length ? (
          <ul>
            {vacancies.map((vacancy) => (
              <li key={vacancy.id}>
                <NavLink
                  to={`contacts/${vacancy.id}`}
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                      ? "pending"
                      : ""
                  }
                >
                  {vacancy.name}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            <i>No vacancies</i>
          </p>
        )}
      </div>
    </>
  );
}