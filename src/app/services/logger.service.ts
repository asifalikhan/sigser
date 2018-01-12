import {Injectable} from '@angular/core';
import { Logger } from "angular2-logger/core";

import { ConfigService } from './config.service';

@Injectable()
export class LoggerService {

public config:any;
public logger:any;

    constructor(){
        this.config= new ConfigService();
        this.logger = new Logger();

        this.logger.level = this.config.loggerLevel;
    }

    getLogLevel(): any{
        return this.logger.level;
    }

    setLogLevel(level:any){
        this.logger.level = level;
    }

    warn(message:string){
        this.logger.warn(message);
    }

    log(message:any){
        this.logger.log(message);
    }

    info(message:string){
        this.logger.info(message);
    }

    error(message:string){
        this.logger.error(message);
    }

    debug(message:string){
        this.logger.debug(message);
    }
    
}