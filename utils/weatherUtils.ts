export const getBackgroundClass = (weather: string) => {
  switch (weather.toLowerCase()) {
    case "clear":
      return "bg-gradient-to-b from-blue-400 to-blue-200";
    case "clouds":
      return "bg-gradient-to-b from-gray-400 to-gray-200";
    case "rain":
      return "bg-gradient-to-b from-blue-700 to-gray-500";
    case "snow":
      return "bg-gradient-to-b from-gray-300 to-white";
    case "thunderstorm":
      return "bg-gradient-to-b from-gray-800 to-gray-500";
    default:
      return "bg-gradient-to-b from-gray-200 to-gray-100";
  }
};