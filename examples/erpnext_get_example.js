var ERPNext = require("node-api-erpnext");
var btoa = require("btoa");

var bot_url = process.env.API_ERPNEXT_BASEURL;
var bot_login_auth = process.env.API_ERPNEXT_TOKEN;

// Initialization
var login_ops = {
    baseUrl: bot_url,
    token: btoa(bot_login_auth)
};


var erp = new ERPNext(login_ops);
var resource = "Task/TASK-2020-00001";  // doctype/resource-name 
// var data_json = {
//     "description": `<div>automated new description for ${resource}</div>`
// };   // data_json for insert/update

try {
    //console.log(JSON.stringify(data_json));
    erp.getDoctype(resource)
    .then((json_result) => {
        //  console.log(JSON.stringify(json_result));
        console.log(JSON.stringify(json_result));
    });
} catch (e) {
    console.log(e);
}


