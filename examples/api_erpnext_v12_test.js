require('dotenv').config();
var btoa = require("btoa");

/**
 *  Exmple 1, how to get a Document info from a resource
 */

/** Example 1 */

var bot_url = process.env.API_ERPNEXT_BASEURL;
var bot_login_auth = process.env.API_ERPNEXT_TOKEN;

// Initialization
var ERPNext = require("../src/api_erpnext_v12");
var login_ops = {
    baseUrl: bot_url,
    token: btoa(bot_login_auth)
};

// use
var erp = new ERPNext(login_ops);
var resource = "Task/TASK-2020-00001";
var data_json = {
    "description": `<div>automated new description for ${resource}</div>`
};
try {
    //console.log(JSON.stringify(data_json));
    erp.get(resource, data_json)
    .then((json_result) => {
        //  console.log(JSON.stringify(json_result));
        console.log(JSON.stringify(json_result));
    });
} catch (e) {
    console.log(e);
}


