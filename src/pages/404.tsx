import { useState } from "react";

import Header from "../components/Header/Header";

export default function NotFound() {
  const [headerIsVisible, setHeaderIsVisible] = useState(true);

  return (
    <>
      <Header isVisible={headerIsVisible} setIsVisible={setHeaderIsVisible} />
      <div>Missing page</div>
    </>
  )
}
