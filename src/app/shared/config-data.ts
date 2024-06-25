import { environment } from "src/environments/environment";

export class ConfigData {
    public static config = {
        API_URL: environment.API_URL,
        headerToken: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        logo_url: 'assets/images/logo.png',
    };
}