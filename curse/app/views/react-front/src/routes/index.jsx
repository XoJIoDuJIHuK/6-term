import { useLoaderData, Form, NavLink } from "react-router-dom";

export async function loader({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams;
  const vacancies = await (await fetch('/public-vacancies')).json();
  console.log(vacancies);
  return { vacancies, query };
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
                  to={`vacancy/${vacancy.id}`}
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