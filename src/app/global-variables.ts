export class GlobalVariables {
  public static DISCOVERY_DOCS: Array<string> = [
    "https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest",
  ];
  public static SCOPES: string = "https://www.googleapis.com/auth/youtube";
  public static API_KEY: string = process.env.NG_APP_API_KEY || ''
  public static CLIENT_ID: string = process.env.NG_APP_CLIENT_ID || ''
}
