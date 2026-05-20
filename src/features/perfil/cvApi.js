import httpClient from "@/shared/api/httpClient";

export const subirCvApi = async (archivo) => {
  const formData = new FormData();
  formData.append("archivo", archivo);

  const response = await httpClient.post("/estudiantes/me/cv", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
