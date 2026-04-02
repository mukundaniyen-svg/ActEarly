export const getOrCreateUserId = () => {
  try {
    let userId = localStorage.getItem("user_id");

    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("user_id", userId);
      console.log("New user_id created:", userId);
    } else {
      console.log("Existing user_id:", userId);
    }

    return userId;
  } catch (e) {
    console.error("localStorage error:", e);
    return "fallback-user";
  }
};