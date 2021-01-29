import "./util/module-alias"
import { Server } from "@overnightjs/core"
import { Application, json } from "express"
import { ForecstController } from "./controllers/forecast"

export class SetupServer extends Server {
  private port: number

  constructor(port = 3000) {
    super()
    this.port = port
  }

  private setupExpress(): void {
    this.app.use(json())
  }

  private setupController(): void {
    const forecastController = new ForecstController()

    this.addControllers([forecastController])
  }

  public init(): void {
    this.setupExpress()
    this.setupController()
  }

  public getApp(): Application {
    return this.app
  }
}