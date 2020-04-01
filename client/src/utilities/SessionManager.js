import { axios } from './helper';
import { Requests } from './Requests';

export class SessionManager {
    static async validSession() {
        const sessionId = sessionStorage.getItem('sessionId');
        return sessionId && Requests.getSession(sessionId);
    }
}