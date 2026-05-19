
import { peruApi } from "@/shared/api/peruApi";

export const consultarDni = async (dni) => {
  try {
    const response = await peruApi.get(
      `/dni/${dni}?summary=0&plan=0`
    );

    return response.data;
  } catch (error) {
    console.error("Error consultando DNI:", error);

    throw error;
  }
};

