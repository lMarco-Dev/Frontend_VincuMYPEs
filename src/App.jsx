import { StudentCard } from "@entities/student/StudentCard";

export default function App() {
  const mockStudent = {
    name: "Marco Chuquilin",
    career: "Ingeniería de Sistemas - 9no Ciclo",
    university: "Universidad Privada del Norte",
    skills: ["React 19", "Spring Boot 3", "Tailwind v4"],
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      {/* Llamamos al componente y le pasamos los datos */}
      <div className="w-full max-w-sm">
        <StudentCard student={mockStudent} />
      </div>
    </div>
  );
}
