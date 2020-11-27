/**
 *  ERPNext class will exports public api.
 *  works for VERSION 11.* and Version 12.*
 *  license: MIT
 *  author: E Motilla <e @ quad-tree.com>
 *  project: erpcloud
 *  last update: 2020-11-26 19:41
 *  notes: This api is for accesing erpnext API using basic authentication and Token. Not Login/password.
 *         this is work in progress. Additions and suggestions are welcome.
 */

var requestPromise = require('request-promise');  // DEPRECATED, need help to change it to Axios

/**
 * ERPNExt API Constructor 
 * @param {*} options    object with {token, baseUrl, basic, username, password}
 * token is a base64 object from "apikey":"apisecret"
 */
var ERPNext = function (options) {
  this.baseUrl = options.baseUrl;
  this.token = options.token; // token based authentication
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
    uri: this.baseUrl + "/api/resource/" + resource,
    //qs: {},
    headers: {
      'Authorization': 'Basic ' + _this.token
    },
    json: true // Automatically parses the JSON string in the response
  };
  return new Promise((resolve, reject) => {
    requestPromise(options)
      .then(data_json => {
        // console.log(sales_json);
        resolve(data_json.data);
      })
      .catch(function (err) {
        reject("ERROR 404, on insert: " + err)
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
    uri: this.baseUrl + "/api/resource/" + resource,
    form: form,
    headers: {
      'Authorization': 'Basic ' + _this.token
    },
    json: true // Automatically parses the JSON string in the response
  };
  return new Promise((resolve, reject) => {
    requestPromise(options)
      .then(function (sales_json) {
        // console.log(sales_json);
        resolve(sales_json);
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
    uri: _this.baseUrl + "/api/resource/" + resource,
    form: form,
    headers: {
      'Authorization': 'Basic ' + _this.token
    },
    json: true // Automatically parses the JSON string in the response
  };
  // console.log(options);
  return new Promise((resolve, reject) => {
    requestPromise(options)
      .then(function (sales_json) {
        // console.log(sales_json)
        resolve(sales_json)
      })
      .catch(function (err) {
        reject("ERROR 404, on update: " + err)
      });
  })
}


ERPNext.prototype.delete = function (resource, object) {
  var _this = this;
  var form = {};
  if (object.hasOwnProperty("data")) {
    form.data = JSON.stringify(object.data);
  } else {
    form.data = JSON.stringify(object);
  }
  var options = {
    method: 'DELETE',
    uri: _this.baseUrl + "/api/resource/" + resource,
    form: form,
    headers: {
      'Authorization': 'Basic ' + _this.token
    },
    json: true // Automatically parses the JSON string in the response
  };
  // console.log(options);
  return new Promise((resolve, reject) => {
    requestPromise(options)
      .then(function (del_json) {
        // console.log(del_json)
        resolve(del_json)
      })
      .catch(function (err) {
        reject("ERROR 404, on delete: " + err)
      });
  })
}


module.exports = ERPNext;

// export default ERPNext;

