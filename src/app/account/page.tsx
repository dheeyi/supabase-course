"use client";

import { useEffect } from "react";
import Sidebar from "@/components/ui/custom/sidebar.tsx";

export default function Account() {
  useEffect(() => {
    fetch('/api/user/create-profile')
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          console.error('error al crear el perfil del usuario');
        }
      })
      .catch(console.error);
  }, []);
  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-64 flex flex-col gap-y-4 py-12 h-full w-full items-center justify-center max-w-screen-md mx-auto text-center">
        <h1 className="text-2xl font-bold">Welcome to DevLinks</h1>
        <p>
          Un espacio para compartir enlaces de desarrolladores, portafolios, ideas, etc
        </p>
      </main>
    </div>
  )
}