"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Perfil = {
  id: string;
  nombre_negocio: string;
  plan: string;
  trial_ends_at: string;
  plan_activated_at: string | null;
  plan_expires_at: string | null;
  mp_payer_email: string | null;
  created_at: string;
};

type Stats = {
  total: number;
  pagados: number;
  trials: number;
  cancelados: number;
  mrr: number;
};

export default function AdminPage() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => {
        if (res.status === 403 || res.status === 401) {
          router.push("/dashboard");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (!data) return;
        setPerfiles(data.perfiles);
        setStats(data.stats);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar datos");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-gray-400">Cargando...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <p className="text-red-400">{error}</p>
    </div>
  );

  const planColor: Record<string, string> = {
    pagado: "bg-green-500/20 text-green-400",
    trial: "bg-yellow-500/20 text-yellow-400",
    cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Panel de Admin — KioskoApp</h1>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total usuarios</p>
          <p className="text-3xl font-bold mt-1">{stats?.total}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Pagados</p>
          <p className="text-3xl font-bold mt-1 text-green-400">{stats?.pagados}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-400 text-sm">En trial</p>
          <p className="text-3xl font-bold mt-1 text-yellow-400">{stats?.trials}</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4">
          <p className="text-gray-400 text-sm">MRR</p>
          <p className="text-3xl font-bold mt-1 text-blue-400">
            ${stats?.mrr.toLocaleString("es-AR")}
          </p>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="text-left p-4">Negocio</th>
              <th className="text-left p-4">Email MP</th>
              <th className="text-left p-4">Plan</th>
              <th className="text-left p-4">Vence</th>
              <th className="text-left p-4">Registrado</th>
            </tr>
          </thead>
          <tbody>
            {perfiles?.map(p => (
              <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="p-4 font-medium">{p.nombre_negocio}</td>
                <td className="p-4 text-gray-400">{p.mp_payer_email ?? "—"}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${planColor[p.plan] ?? ""}`}>
                    {p.plan}
                  </span>
                </td>
                <td className="p-4 text-gray-400">
                  {p.plan === "pagado"
                    ? p.plan_expires_at
                      ? new Date(p.plan_expires_at).toLocaleDateString("es-AR")
                      : "—"
                    : new Date(p.trial_ends_at).toLocaleDateString("es-AR")}
                </td>
                <td className="p-4 text-gray-400">
                  {new Date(p.created_at).toLocaleDateString("es-AR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}