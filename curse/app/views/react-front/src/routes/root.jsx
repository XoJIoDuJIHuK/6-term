import { Outlet, useNavigation } from "react-router-dom";
import TabsRouter from "../components/tabsRouter";

export default function Root() {
  const navigation = useNavigation();
  return (
    <>
      <div id="topbar">
        <h1>BuckHunt</h1>
        <TabsRouter/>
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