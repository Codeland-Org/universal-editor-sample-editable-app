
import About from "../../components/About";
import AEMPage from "../../components/AEMPage";
import { getAEMPath } from "../../utils/commons";

export default function Page() {
  const aemPath = getAEMPath(["about-us"]);
  return (
    <AEMPage path={aemPath}>
      <About />
    </AEMPage>
  );
}
