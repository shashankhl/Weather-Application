import { currentWeatherData } from "./currentWeatherData.js";
import { handleError } from "./handleError.js";
import { endLoadingState, startLoadingState } from "./setLoadingState.js";
import { createDailyCards, createHourlyCards } from "./weatherForecastCards.js";
import { weatherForecastData } from "./weatherForecastData.js";

const API_KEY = "ee5fbcb49503c214ac219f949e3e2501";

const searchBoxInput = document.querySelector(".search-box-input");
const gpsButton = document.querySelector(".gps-button");
const ctaButton = document.querySelector(".cta-button");
const topButton = document.querySelector(".top-button");

createHourlyCards();
createDailyCards();

const fetchWeatherData = async (data) => {
  try {
    await startLoadingState();
    await currentWeatherData(data, API_KEY);
    await weatherForecastData(data, API_KEY);
    await endLoadingState();
  } catch (error) {
    if (error.message === "Failed to fetch") {
      await handleError(
        "Uh oh! It looks like you're not connected to the internet. Please check your connection and try again.",
        "Refresh Page"
      );
    } else {
      await handleError(error.message, "Try Again");
    }
  }
};

const getUserLocation = async () => {
  const successCallback = async (position) => {
    const data = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };

    await fetchWeatherData(data);
  };

  const errorCallback = (error) => {
    console.log(error);
    fetchWeatherData("bengaluru");
  };

  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

gpsButton.addEventListener("click", getUserLocation);

searchBoxInput.addEventListener("keyup", async (event) => {
  if (event.keyCode === 13) {
    if (
      typeof searchBoxInput.value !== "string" ||
      searchBoxInput.value.trim() === ""
    ) {
      await handleError("Please enter a location", "Try Again");
    } else {
      await fetchWeatherData(searchBoxInput.value);
    }
  }
});

ctaButton.addEventListener("click", async () => {
  if (
    typeof searchBoxInput.value !== "string" ||
    searchBoxInput.value.trim() === ""
  ) {
    await handleError("Please enter a location", "Try Again");
  } else {
    await fetchWeatherData(searchBoxInput.value);
  }
});

topButton.addEventListener("click", scrollToTop);

getUserLocation();
