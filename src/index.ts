import { connect } from "mqtt";

import { weatherClient } from "./weather-client";
import { ObservationsResponse } from "./types";

const {
  WEATHER_STATION_ID: stationId = "",
  WEATHER_API_KEY: apiKey = "",
  NARODMON_USERNAME: username = "",
  NARODMON_PASSWORD: password = "",
  NARODMON_PUBLISH_INTERVAL: publishInterval = 1
} = process.env;

const getWeatherData = async () => {
  const response = await weatherClient("pws/observations/current", {
    searchParams: {
      apiKey,
      stationId,

      numericPrecision: "decimal",
      format: "json",
      units: "m"
    }
  }).json();

  const {
    observations: [observation]
  } = response as ObservationsResponse;

  return observation;
};

const jsonTopic = `${username}/${stationId}/json`;
const clientId = Array.from(stationId)
  .map(s => s.charCodeAt(0))
  .join(":");
const options = { username, password, clientId };

const client = connect("mqtt://narodmon.ru", options);

const update = async () => {
  const {
    humidity: H1,
    winddir: DEG,
    metric: { windSpeed: KMH, temp: T1, pressure: P1, precipRate: PRECIPE1 }
  } = await getWeatherData();
  const message = { DEG, KMH, T1, P1, H1, PRECIPE1 };

  console.log(new Date(), "weather", message);
  client.publish(jsonTopic, JSON.stringify(message));
};

let updateInterval: NodeJS.Timeout | null = null;

client.on("connect", async () => {
  console.log("connect");

  client.publish(`${username}/${stationId}/status`, "online");

  if (updateInterval !== null) {
    clearInterval(updateInterval);
    updateInterval = null;
  }

  updateInterval = setInterval(update, +publishInterval * 60 * 1000);

  update();
});

const events = ["reconnect", "disconnect", "offline", "close", "end", "error", "message"];

for (const name of events) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client.on(name, (...args: any[]) => console.log(new Date(), "narodmon", name, ...args));
}

process.on("SIGINT", function() {
  client.end(false, {}, () => {
    process.exit(0);
  });
});
