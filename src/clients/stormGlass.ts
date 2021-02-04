import { ForecastPoint, ForecastResponse, StormGlassPoint } from "@src/interfaces/stormGlass";
import { InternalError } from "@src/util/errors/internal-error";
import config, { IConfig } from "config";
import * as HTTPUtil from "@src/util/request";

const stormGlassResourceConfig: IConfig = config.get("App.resources.StormGlass");

export class StormGlass {
  readonly stormGlassAPIParams =
    "swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed";

  readonly stormGlassAPISource = "noaa";
  protected request: HTTPUtil.Request;

  constructor(request = new HTTPUtil.Request()) {
    this.request = request;
  }

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }

  private normalizeResponse(points: ForecastResponse): Array<ForecastPoint> {
    return points.hours
      .filter((point) => this.isValidPoint(point))
      .map((point) => {
        return {
          swellDirection: point.swellDirection[this.stormGlassAPISource],
          swellHeight: point.swellHeight[this.stormGlassAPISource],
          swellPeriod: point.swellPeriod[this.stormGlassAPISource],
          time: point.time,
          waveDirection: point.waveDirection[this.stormGlassAPISource],
          waveHeight: point.waveHeight[this.stormGlassAPISource],
          windDirection: point.windDirection[this.stormGlassAPISource],
          windSpeed: point.windSpeed[this.stormGlassAPISource],
        };
      });
  }

  public async fetchPoints(lat: number, lng: number): Promise<Array<ForecastPoint>> {
    const response = await this.request
      .get<ForecastResponse>(
        `${stormGlassResourceConfig.get("apiUrl")}/weather/point?lat=${lat}&lng=${lng}&params=${
          this.stormGlassAPIParams
        }&source=${this.stormGlassAPISource}`,
        {
          headers: {
            Authorization: stormGlassResourceConfig.get("apiToken"),
          },
        }
      )
      .catch((err) => {
        throw HTTPUtil.Request.isRequestError(err)
          ? new StormGlassResponseError(
              `Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`
            )
          : new ClientRequestError(err.message);
      });

    return this.normalizeResponse(response.data);
  }
}

export class StormGlassUnexpectedResponseError extends InternalError {
  constructor(message: string) {
    super(message);
  }
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error when trying to communicate to StormGlass: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error returned by the StormGlass service: ${message}`);
  }
}
