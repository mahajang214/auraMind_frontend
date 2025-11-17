export function debugKey(key, item, label = "") {
    // Fallbacks to ensure a non-empty key
    const baseKey = key || item?._id || Math.random().toString(36).slice(2, 8);
  
    // Generate a truly unique key by appending a short random string
    const finalKey = `${baseKey}-${Math.random().toString(36).slice(2, 5)}`;
  
    // Optional: log duplicates (not really needed for React, React warns anyway)
    // console.log("🟢 Key used for", label, ":", finalKey);
  
    return finalKey;
  }
  