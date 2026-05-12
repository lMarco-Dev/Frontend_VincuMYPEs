import { useUserStore } from "@/entities/user/userStore";
import { useMisProyectos } from "@/features/proyecto-list-mype/useMisProyectos";
import { useNavigate } from "react-router-dom";

export function MypeDashboardPage() {
  const { proyectos, isLoading } = useMisProyectos();
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Logo />
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 font-medium">
            {user?.nombre}
          </span>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header con botón crear */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis proyectos</h1>
            <p className="text-gray-500 mt-1">
              Gestiona los proyectos que has publicado
            </p>
          </div>
          <Link to="/dashboard/mype/crear">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nuevo proyecto
            </Button>
          </Link>
        </div>

        {/* Lista de proyectos */}
        {isLoading ? (
          // Skeletons mientras carga
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-2xl" />
            ))}
          </div>
        ) : proyectos.length === 0 ? (
          // Estado vacío
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              Aún no tienes proyectos publicados
            </p>
            <Link to="/dashboard/mype/crear">
              <Button>Publicar mi primer proyecto</Button>
            </Link>
          </div>
        ) : (
          // Grilla de proyectos
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proyectos.map((proyecto) => (
              <ProyectoCard
                key={proyecto.id}
                proyecto={proyecto}
                onClick={() => navigate(`/proyectos/${proyecto.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
