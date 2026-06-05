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

type Movimiento = {
  id: string;
  tipo: string;
  descripcion: string;
  precio_unitario: number;
  cantidad: number;
  monto: number;
  categoria: string | null;
  fecha: string;
};

export default function AdminPage() {
  const [perfiles, setPerfiles] = useState<Perfil[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Perfil | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
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

  const handleVerDetalle = async (perfil: Perfil) => {
    setUsuarioSeleccionado(perfil);
    setMovimientos([]);
    setLoadingMovimientos(true);
    const res = await fetch(`/api/admin/usuario?id=${perfil.id}`);
    const data = await res.json();
    setMovimientos(data.movimientos ?? []);
    setLoadingMovimientos(false);
  };

  const formatMonto = (monto: number) =>
    `$${Math.abs(monto).toLocaleString("es-AR")}`;

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
      <div className="bg-gray-900 rounded-xl overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="text-left p-4">Negocio</th>
              <th className="text-left p-4">Email MP</th>
              <th className="text-left p-4">Plan</th>
              <th className="text-left p-4">Vence</th>
              <th className="text-left p-4">Registrado</th>
              <th className="text-left p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {perfiles?.map(p => (
              <tr
                key={p.id}
                className={`border-b border-gray-800/50 hover:bg-gray-800/30 ${usuarioSeleccionado?.id === p.id ? "bg-gray-800/50" : ""}`}
              >
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
                <td className="p-4">
                  <button
                    onClick={() => handleVerDetalle(p)}
                    className="px-3 py-1 text-xs rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detalle del usuario seleccionado */}
      {usuarioSeleccionado && (
        <div className="bg-gray-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold">{usuarioSeleccionado.nombre_negocio}</h2>
              <p className="text-gray-400 text-sm">
                {movimientos.length} movimientos registrados
              </p>
            </div>
            <button
              onClick={() => setUsuarioSeleccionado(null)}
              className="text-gray-400 hover:text-white text-sm"
            >
              Cerrar ✕
            </button>
          </div>

          {loadingMovimientos ? (
            <p className="text-gray-400 text-sm">Cargando movimientos...</p>
          ) : movimientos.length === 0 ? (
            <p className="text-gray-400 text-sm">No tiene movimientos registrados.</p>
          ) : (
            <>
              {/* Resumen rápido */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Ingresos totales</p>
                  <p className="text-green-400 font-bold mt-1">
                    {formatMonto(movimientos.filter(m => m.tipo === "ingreso").reduce((acc, m) => acc + m.monto, 0))}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Gastos totales</p>
                  <p className="text-red-400 font-bold mt-1">
                    {formatMonto(movimientos.filter(m => m.tipo === "gasto").reduce((acc, m) => acc + m.monto, 0))}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Ganancia neta</p>
                  {(() => {
                    const neto = movimientos.reduce((acc, m) => acc + (m.tipo === "ingreso" ? m.monto : -m.monto), 0);
                    return <p className={`font-bold mt-1 ${neto >= 0 ? "text-green-400" : "text-red-400"}`}>{neto >= 0 ? "" : "-"}{formatMonto(neto)}</p>;
                  })()}
                </div>
              </div>

              {/* Tabla de movimientos */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700 text-gray-400">
                      <th className="text-left pb-2">Fecha</th>
                      <th className="text-left pb-2">Descripción</th>
                      <th className="text-left pb-2">Categoría</th>
                      <th className="text-left pb-2">Cantidad</th>
                      <th className="text-right pb-2">Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.map(m => (
                      <tr key={m.id} className="border-b border-gray-800/50">
                        <td className="py-2 text-gray-400">
                          {new Date(m.fecha).toLocaleDateString("es-AR")}
                        </td>
                        <td className="py-2 font-medium">{m.descripcion}</td>
                        <td className="py-2 text-gray-400">{m.categoria ?? "—"}</td>
                        <td className="py-2 text-gray-400">{m.cantidad}</td>
                        <td className={`py-2 text-right font-medium ${m.tipo === "ingreso" ? "text-green-400" : "text-red-400"}`}>
                          {m.tipo === "ingreso" ? "+" : "-"}{formatMonto(m.monto)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}