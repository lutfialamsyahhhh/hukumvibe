const API_KEY = "AIzaSyAkTuqFwGvcGV58Q2I4kZEwMW662L1raIE"; // Paste API key dari .env.local Anda

async function cekModel() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("=== DAFTAR MODEL YANG BISA ANDA GUNAKAN ===");
    // Filter hanya model yang mendukung "generateContent"
    data.models.forEach((model) => {
      if (model.supportedGenerationMethods.includes("generateContent")) {
        // Ambil nama model saja (menghilangkan awalan "models/")
        const modelName = model.name.replace("models/", "");
        console.log(`- "${modelName}"`);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

cekModel();
