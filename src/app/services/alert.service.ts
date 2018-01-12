import {Injectable} from '@angular/core';
import {Message} from 'primeng/primeng';
@Injectable()
export class AlertService {

    msgs: Message[] = [];

    showSuccess(summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:'success', summary:summary, detail:detail});
        return this.msgs;
    }
    showError(summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:'error', summary:summary, detail:detail});
        return this.msgs;
    }
    showInfo(summary:string,detail:string) {
        this.msgs = [];
        this.msgs.push({severity:'info', summary:summary, detail:detail});
        return this.msgs;
    }
    
}