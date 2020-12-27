/**
 *  ERPNext class will exports public api.
 *  works for VERSION 11.* & 12.*
 *  license: MIT
 *  author: E Motilla <e @ quad-tree.com>
 *  project: erpcloud
 *  last update: 2020-12-05 15:49
 *  notes: This api is for accesing erpnext API using basic authentication and Token. Not Login/password.
 */

require('dotenv').config();
var axios = require('axios');

/**
 * decode_apikey  // decypted apikey example: "https://erpname.com;73ede58bbfa809c:67a9f7fbc5e74ad"
 * @param {*} encrypted_apikey 
 * @param {*} cryptopass 
 */
var decode_apikey = function (encrypted_apikey, cryptopass) {
  var CryptoJS = require("crypto-js");
  var btoa = require("btoa");
  var decrypted = CryptoJS.AES.decrypt(encrypted_apikey, cryptopass).toString(CryptoJS.enc.Utf8);
  var result = {};
  result.baseUrl = decrypted.split(";")[0];
  result.token = btoa(decrypted.split(";")[1]); // base64 coded Token
  return result
}

/**
 * encode_apikey
 * @param {*} url         // https://subdomain.erp.com
 * @param {*} token       // 73bde58bcfa809c:67a9f7fbc5e74ad  (API Access Token/key from the user on ERPNext)
 * @param {*} cryptopass  // my-very-powerful-secret-28732
 */
var encode_apikey = function (url, token, cryptopass) {
  var CryptoJS = require("crypto-js");
  var encrypted = CryptoJS.AES.encrypt(`${url};${token}`, cryptopass);
  return encrypted
}

/**
 * ERPNExt API Constructor 
 * @param {*} options    object with {token, baseUrl} OR { apikey :encryptedapikey, [secret: CRYPTO_PASSWORD]}
 * token is a base64 object from "apikey":"apisecret" from erpnext
 */
var ERPNext = function (options) {
  if (options.hasOwnProperty("apikey")) {
    if (!options.hasOwnProperty("secret")) {
      options.secret = process.env.CRYPTO_PASS; // is "secret" property is not set, the tries to use environmental variable CRYPTO_PASS
    }
    var newlogin = decode_apikey(options.apikey, options.secret);
    this.baseUrl = newlogin.baseUrl;
    this.token = newlogin.token; // token encoded on base64 format
  } else {
    this.baseUrl = options.baseUrl;
    this.token = options.token; // token encoded on base64 format
  }
};

ERPNext.prototype.constructor = ERPNext;


/**
 * gets doctype info
 * @param {string} resource   example: "Sales Invoice"
 */
ERPNext.prototype.getDoctype = function (resource) {

  var _this = this;
  var options = {
    method: 'GET',
    url: this.baseUrl + "/api/resource/" + resource,
    headers: {
      'Authorization': 'Basic ' + _this.token
    },
    json: true // Automatically parses the JSON string in the response
  };
  // console.log(options);
  return new Promise((resolve, reject) => {
    axios(options)
      .then(data_json => {
        resolve(data_json.data);
      })
      .catch(function (err) {
        reject("ERROR 404, on getDoctype: " + err)
      });
  });
}

/**
 * Inserts doctype info
 * @param {string} resource   example: "Sales Invoice"
 * @param {*} object          object with data to be inserted into resource
 */
ERPNext.prototype.insert = function (resource, object) {
  var _this = this;
  var form = {};
  if (object.hasOwnProperty("data")) {
    form.data = JSON.stringify(object.data);
  } else {
    form.data = JSON.stringify(object);
  }
  var options = {
    method: 'POST',
    url: this.baseUrl + "/api/resource/" + resource,
    data: form,
    headers: {
      'Authorization': 'Basic ' + _this.token
    },
    json: true // Automatically parses the JSON string in the response
  };
  return new Promise((resolve, reject) => {
    axios(options)
      .then(function (insert_json) {
        resolve(insert_json.data.data);
      })
      .catch(function (err) {
        reject("ERROR 404, on insert: " + err)
      });
  });
}

/**
 * Updates doctype info
 * @param {string} resource   example: "Sales Invoice"
 * @param {*} object          object with data to be inserted into resource
 */
ERPNext.prototype.update = function (resource, object) {
  var _this = this;
  var form = {};
  if (object.hasOwnProperty("data")) {
    form.data = JSON.stringify(object.data);
  } else {
    form.data = JSON.stringify(object);
  }
  var options = {
    method: 'PUT',
    url: _this.baseUrl + "/api/resource/" + resource,
    data: form,
    headers: {
      'Authorization': 'Basic ' + _this.token
    },
    json: true // Automatically parses the JSON string in the response
  };
  // console.log(options);
  return new Promise((resolve, reject) => {
    axios(options)
      .then(function (updated_json) {
        // console.log(updated_json)
        resolve(updated_json.data.data)
      })
      .catch(function (err) {
        reject("ERROR 404, on update: " + err)
      });
  })
}


ERPNext.prototype.delete = function (resource) {
  var _this = this;
  var options = {
    method: 'DELETE',
    url: _this.baseUrl + "/api/resource/" + resource,
    headers: {
      'Authorization': 'Basic ' + _this.token
    },
    json: true // Automatically parses the JSON string in the response
  };
  // console.log(options);
  return new Promise((resolve, reject) => {
    axios(options)
      .then(function (del_json) {
        resolve(del_json.data)
      })
      .catch(function (err) {
        reject("ERROR 404, on delete: " + err)
      });
  })
}

/**
 * getDocListByFilter   gets a list of doctypes given a filter and limit of rows
 * FORMAT: /api/resource/{doctype}?fields=["name","field2"]&filters=[["field2",">","criteria"]]&limit_page_length=none
 * @param {*} doctype  DocType name
 * @param {*} options {fields:["name","otherfiled"], filters: [["otherfiled","!=","3"]], limit:2}
 */
ERPNext.prototype.getDocListByFilter = function (doctype, options) {
  var _this = this;
  var fieldsStr = (options.hasOwnProperty("fields") ? `fields=${JSON.stringify(options.fields)}` : "");
  var filtersStr = (options.hasOwnProperty("filters") ? `&filters=${JSON.stringify(options.filters)}` : "");
  var orderbyStr = (options.hasOwnProperty("order") ? `&order_by=${JSON.stringify(options.orderby)}` : "");
  var limit_page_length = `&limit_page_length=${(options.hasOwnProperty("limit") ? options.limit : "none")}`;
  var query = `?${fieldsStr}${filtersStr}${limit_page_length}${orderbyStr}`;
  console.log(doctype + query);
  return _this.getDoctype(doctype + query);
}


module.exports = ERPNext;