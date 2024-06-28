import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'buildMtScheme',
})
export class BuildMtSchemePipe implements PipeTransform {

    transform(value: unknown, username: string, password: string, server: string, encode: boolean = false): unknown {
        if (encode) {
            return encodeURIComponent(this.buildMtScheme(username, password, server));
        } else {
            return this.buildMtScheme(username, password, server);
        }
    }
    buildMtScheme(username: string, password: string, server: string): string {
        password = encodeURIComponent(password);
        const uri = "metatrader5://account?login=" + username + "&server=" + server + "&password=" + password;
        return uri;
    }

}
