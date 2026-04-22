
import Home from "../components/Home";
import AEMPage from "../components/AEMPage";
import { getAEMPath } from "../utils/commons";

export default function Page() {
  const aemPath = getAEMPath([]);
  return (
    <AEMPage path={aemPath}>
      <Home />
    </AEMPage>
  );
}
