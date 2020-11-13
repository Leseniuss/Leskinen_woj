'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save
// mysql asennettu.. testataan committia


var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'localhost',
  port : 3307,
  user : 'root',
  password : '',
  database : 'asiakas'

});

module.exports = 
{
    fetchTypes: function (req, res) {  
      connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function(error, results, fields){
        if ( error ){
          console.log("Virhe haettaessa dataa asiakas-taulusta: " + error);
          res.status(500);
          res.json({"status" : "ei toiminut"});
          
        }
        else
        {
          console.log("Data = " + JSON.stringify(results));
          res.json(results);
        }
    });

    },

    fetchCustomers: function(req, res){
      var sql = 'SELECT avain, nimi, osoite, postinro, postitmp, luontipvm, asty_avain from asiakas where 1 = 1';
      if (req.query.nimi != null)
        sql = sql + " and nimi like '" + req.query.nimi + "%'";
      if (req.query.osoite != null)
        sql = sql + " and osoite like '" + req.query.osoite + "%'";
      if (req.query.asty_avain != null && req.query.asty_avain != "")
        sql += " and asty_avain=" + req.query.asty_avain;
      //console.log("Body = " + JSON.stringify(req.body));
      //console.log("Params = " + JSON.stringify(req.query));
      //console.log(req.query.nimi);
      connection.query(sql, function(error, results, fields){
        if ( error ){
          console.log("Virhe ladattaessa dataa asiakas taulusta" + error);
          res.status(500);
          res.json({"status" : "ei toiminut"});
        }
        else
        {
          console.log("Data = " + JSON.stringify(results));
          res.json(results);
        }
    });

  },

    create: function(req, res){
      // connection.query....
      console.log("Data = " + JSON.stringify(req.body));
      console.log(req.body.nimi);
      res.send("Kutsuttiin create");
    },

    update: function(req, res){

    },

    delete : function (req, res) {
      console.log("body = " + JSON.stringify(req.body));
      console.log("Params = " + JSON.stringify(req.params));
        res.send("Kutsuttiin delete plaa plaa plaa");
    }
}
