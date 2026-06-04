import OBSWebSocket from "obs-websocket-js";

interface OBSConfig {
  host: string;
  port: number;
  password: string;
}

export class OBSController {
  private obs: OBSWebSocket;
  private config: OBSConfig;
  private connected = false;

  constructor(config: OBSConfig) {
    this.obs = new OBSWebSocket();
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      const { host, port, password } = this.config;
      await this.obs.connect(`ws://${host}:${port}`, password || undefined);
      this.connected = true;
      console.log("[obs] Connected to OBS WebSocket v5");
      return true;
    } catch (err: any) {
      console.error("[obs] Connection failed:", err.message);
      console.error(
        "[obs] Ensure OBS is running and WebSocket Server is enabled"
      );
      console.error(
        "[obs] OBS → Tools → WebSocket Server Settings → Enable"
      );
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      try {
        await this.obs.disconnect();
      } catch {
        // ignore disconnect errors
      }
      this.connected = false;
    }
  }

  async startRecording(): Promise<void> {
    if (!this.connected) throw new Error("OBS not connected");
    try {
      await this.obs.call("StartRecord");
      console.log("[obs] Recording started");
    } catch (err: any) {
      throw new Error(`Failed to start recording: ${err.message}`);
    }
  }

  async stopRecording(): Promise<string> {
    if (!this.connected) throw new Error("OBS not connected");
    const { outputPath } = await this.obs.call("StopRecord");
    console.log(`[obs] Recording stopped: ${outputPath}`);
    return outputPath;
  }

  async getRecordingStatus(): Promise<boolean> {
    if (!this.connected) return false;
    try {
      const { outputActive } = await this.obs.call("GetRecordStatus");
      return outputActive;
    } catch {
      return false;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export async function tryCreateOBSController(config: {
  obs: OBSConfig;
}): Promise<{ obs: OBSController; useOBS: boolean }> {
  const obsController = new OBSController(config.obs);
  const connected = await obsController.connect();
  return { obs: obsController, useOBS: connected };
}
