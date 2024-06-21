import { environment } from "../environments/environment";

export const GlobalComponent = {
    // Api Calling
    API_URL : environment.apiUrl,
    // API_URL : 'http://127.0.0.1:3000/',
    headerToken : {'Authorization': `Bearer ${sessionStorage.getItem('token')}`},

    // Auth Api
    AUTH_API:environment.apiUrl + 'auth/login/',
    // AUTH_API:"http://127.0.0.1:3000/auth/",

    
    // Products Api
    // product:'apps/product',
    // productDelete:'apps/product/',

    // // Orders Api
    // order:'apps/order',
    // orderId:'apps/order/',

    // // Customers Api
    // customer:'apps/customer',
}