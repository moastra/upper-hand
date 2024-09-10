export const fetchCustomizationData = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/api/customize", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch customization data:", error);
  }
};
