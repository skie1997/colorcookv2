export default class ApiUtil {
    // static URL_IP = 'http://3q2365905g.zicp.vip:80';
    static URL_IP = 'http://localhost:5000';
    // static URL_IP = 'http://10.11.50.52:5000';
    static URL_ROOT = '/api/v1';
 
    static API_COLOR_SUGESSTION = ApiUtil.URL_IP + ApiUtil.URL_ROOT + '/colorSuggestion'; 
    static API_COLOR_JUDGE = ApiUtil.URL_IP + ApiUtil.URL_ROOT + '/colorJudge'; 
    static API_COLOR_COLORATION = ApiUtil.URL_IP + ApiUtil.URL_ROOT + '/coloration'; 
    static API_COLOR_LOG = ApiUtil.URL_IP + ApiUtil.URL_ROOT + '/log';   
    
}