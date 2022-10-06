import Axios from "axios";
import { commonConstants } from '../_constants/common.constants';

export function userValidation(){
    var id = localStorage.getItem('id');
    if(id == null){
        return false;
    }else{
        return true;
    }

}
export function userRememberme(){
    var remember = localStorage.getItem('remember');
    if(remember == null){
        return false;
    }else{
        var newdate = new Date(remember);
            newdate.setHours(newdate.getHours(),newdate.getMinutes()+commonConstants.RememberMe_timer,0,0);
            //var final_date = moment(newdate).format("DD/MM/YYYY h:mm:ss a");
            var current_time = new Date();
            //var final_current_time = moment(current_time).format("DD/MM/YYYY h:mm:ss a");
           
           
            if(newdate.getTime()>=current_time.getTime()){
               
                return true;
            }
            else{
               
                return false;
            }
    }

}

export function routePages(page){
    var str_u = {
        PageName:page
    }
    var response = Axios({
        url: commonConstants.MOL_APIURL + "/routes/findrecord",
        method: "POST",
        data: str_u
    })
    response.then(res => {
      
        var url_data = res.data;
        if (url_data.NewUrl == "") {

            return page;
        }else{
            return url_data.NewUrl;
        }

    });

}