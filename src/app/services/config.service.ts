import {Injectable} from '@angular/core';

@Injectable()

export class ConfigService {

    port=3000;
    ip="http://127.0.0.1";
    baseRoute = "/api/";

/* Setting Logger Lever
    level=5: all log error,warn,debug,info,log
    level=4: it will show error,warn,debug,info
    level=3: it will show error,warn,debug
    level=2: it will show error,warn
    level=1: it will show error
    level=0: Off All Logs
 */
    loggerLevel=5;

}
