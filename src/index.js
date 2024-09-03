import axios from "axios";
import $router from '@/router'


let a = JSON.parse(localStorage.getItem("user"))
let Service = axios.create({
    baseURL: `https://schedule-backend-vfnk.onrender.com/`,
});


Service.interceptors.request.use((request) => {
    let token = Auth.getToken();

    request.headers["Authorization"] = "Bearer " + token;
    request.headers["X-Users-DB"] = JSON.parse(localStorage.getItem("user")).db;

    return request;
});

// Service.interceptors.response.use((response) => response, (error)=> {
//     if(error.response.status == 401 || error.response.status == 403){
//         Auth.logout();
//         $router.go();
//     }
// })

let Auth ={
  async login (email,password){
      console.log(email,password)
      let reponse = await  axios.post(`https://schedule-backend-vfnk.onrender.com/authuser`,{
            email: email,
            password:password,
        });

        let user = reponse.data
        console.log(JSON.stringify(user.email))
        localStorage.setItem('user', JSON.stringify(user));
        return true
    },
    async registeruser (email,password, companyname){
        console.log(email,password)
        let reponse = await  axios.post(`https://schedule-backend-vfnk.onrender.com/createuser`,{
              email: email,
              password:password,
              companyname: companyname
          });
  
          let user = reponse.data
          console.log(JSON.stringify(user.email))
          localStorage.setItem('user', JSON.stringify(user));
          return true
      },
    logout(){
        localStorage.removeItem('user');
    },
    getUser(){
        return JSON.parse(localStorage.getItem("user"))
    },
    getToken(){
        let user = Auth.getUser();
        if(user && user.token){
            return user.token
        }else{
            return false
        }      
    },
    authenticated(){
        let user = Auth.getUser();
        if (user && user.token){
            return true;
        }
        return false;
    },
    state:{
        get authenticated(){
            return Auth.authenticated();
        }
    }
}





export{Auth, Service}