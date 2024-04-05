import { Outlet, useNavigation, NavLink } from "react-router-dom";
import { getVacancies } from "../vacancies";

export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const vacancies = await getVacancies(q);
  return { vacancies, q };
}

export default function Root() {
  const navigation = useNavigation();
  return (
    <>
      <div id="topbar">
        <h1>JobHunter</h1>
        <nav>
          <ul>
            <NavLink
              to={`/`}
              className={({ isActive, isPending }) =>
                isActive
                  ? "active"
                  : isPending
                  ? "pending"
                  : ""
              }
            >Home</NavLink>
          </ul>
        </nav>
      </div>
      <div 
        id="detail"
        className={
          navigation.state === "loading" ? "loading" : ""
        }>
        <Outlet />
      </div>
    </>
  );
}