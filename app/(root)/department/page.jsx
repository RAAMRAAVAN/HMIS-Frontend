"use client";

import React, { Suspense, useEffect } from "react";
import Department from "./Department";
import { useRouter } from "next/navigation";

export default function DepartmentPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Department />
    </Suspense>
  );
}
