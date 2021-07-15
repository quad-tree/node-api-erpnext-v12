const ERPNext = require("node-api-erpnext");

var credentials = {
    "token": "Yzc5YzM1OxvdfgdgdfgdfgdfgdfgdfgQ==",    // base64 encoded from API Access Key
    "baseUrl": "https://your-erp-instance.com"
}

var clientes = require("./customers.json");  // an array of doctypes ready to insert
var resource = "Customer";  ///doctype

async function main() {
    var erp = new ERPNext(credentials);
    try {
        clientes.forEach((client)=>{
            let clientDoctype = client;
            console.log(JSON.stringify(clientDoctype));
            erp.insert(resource, clientDoctype).then(resp => {
                console.log(JSON.stringify(resp));
            }).catch(err => {
                console.log(JSON.stringify(err));
            })
        })
    } catch (error) {
        console.log(JSON.stringify(error));
    }
}


main();