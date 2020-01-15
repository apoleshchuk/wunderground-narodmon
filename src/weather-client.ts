import got from "got";

export const weatherClient = got.extend({
  prefixUrl: "https://api.weather.com/v2",
  responseType: "json"
});
