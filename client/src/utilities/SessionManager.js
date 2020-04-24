import { Requests } from './Requests';
import { axios } from './helper';

export class SessionManager {
    static async validSession() {
        const sessionId = sessionStorage.getItem('sessionId');
        return sessionId && Requests.getSession(sessionId);
    }
}