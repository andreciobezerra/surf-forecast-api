import { StormGlass } from "@src/clients/stormGlass";
import axios from "axios";
import stormGlassNormalizedResponseFixture from "@test/fixtures/stormglass-normalized-response-3-hours.json";
import * as stormGlassWeatherPointFixture from "@test/fixtures/stormglass-weather-3-hours.json";

jest.mock("axios");

describe("StormGlass clinet", () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  test("should return the normalized forecast from the StormGlass service", async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedAxios.get.mockResolvedValue({ data: stormGlassWeatherPointFixture });

    const stormGlass = new StormGlass(mockedAxios);
    const response = await stormGlass.fetchPoints(lat, lng);

    expect(response).toEqual(stormGlassNormalizedResponseFixture);
  });
});
