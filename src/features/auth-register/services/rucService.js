
import { peruApi } from "@/shared/api/peruApi";

export const consultarRuc = async (ruc) => {
  try {
    const response = await peruApi.get(
      `/ruc/${ruc}?summary=0&plan=0`
    );

    return response.data;
  } catch (error) {
    console.error("Error consultando RUC:", error);

    throw error;
  }
};

