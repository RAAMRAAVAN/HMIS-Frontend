import { Suspense } from "react";
import FacilitiesClient from "./FacilitiesClient";
import Loader from "../../(components)/Loader";

const Page = () => {
  return (
    <Suspense fallback={<Loader/>}>
      <FacilitiesClient />
    </Suspense>
  );
};

export default Page;
