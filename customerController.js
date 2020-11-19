
'use strict'

// Asenna ensin mysql driver 
// npm install mysql
// mysql asennettu.. testataan committia


var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: '',
  database: 'asiakas'

});

module.exports =
{
  fetchTypes: function (req, res) {
    connection.query('SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi', function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa asiakas-taulusta: " + error);
        res.status(500);
        res.json({ "status": "ei toiminut" });

      }
      else {
        console.log("Data = " + JSON.stringify(results));
        res.json(results);
      }
    });

  },

  fetchCustomers: function (req, res) {
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
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log("Virhe ladattaessa dataa asiakas taulusta" + error);
        res.status(500);
        res.json({ "status": "ei toiminut" });
      }
      else {
        console.log("Data = " + JSON.stringify(results));
        res.json(results);
      }
    });

  },

  create: function (req, res) {
    if (req.body.nimi == "" || req.body.nimi == undefined) {
      res.status(400);
      res.send({ "status": "NOT OK", "error": "Nimi puuttuu" });
    } else if (req.body.osoite == "" || req.body.osoite == undefined) {
      res.status(400);
      res.send({ "status": "NOT OK", "error": "Osoite puuttuu" });
    } else if (req.body.postinro == "" || req.body.postinro == undefined) {
      res.status(400);
      res.send({ "status": "NOT OK", "error": "Postinumero puuttuu" });
    } else if (req.body.postitmp == "" || req.body.postitmp == undefined) {
      res.status(400);
      res.send({ "status": "NOT OK", "error": "Postitoimipaikka puuttuu" });
    } else if (req.body.asty_avain == "" || req.body.asty_avain == undefined) {
      res.status(400);
      res.send({ "status": "NOT OK", "error": "Asiakastyyppi puuttuu" });
    }
    else {

      var sql = "INSERT INTO asiakas (NIMI, OSOITe, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN) VALUES ('";
      sql += req.body.nimi + "', '" + req.body.osoite + "', '" + req.body.postinro + "', '" + req.body.postitmp
      sql += "', " + "CURDATE(), '" + req.body.asty_avain + "')";

      connection.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Virhe lisättäessä asiakasta: " + error);
          res.status(500);
          res.send({ "status": "Jokin kenttä on tyhjä tai syötit vääränlaista dataa", "error": error, "response": null });
        }
        else {
          
          res.send({ "status": "ok", "error": ""});
        }

      });
    }

  },

  update: function (req, res) {

  },

  delete: function (req, res) {

    var sql = "DELETE FROM `asiakas` WHERE `AVAIN`='" + req.params.id + "'";
    connection.query(sql, function (error, results) {
      if (error) {
        console.log("Virhe poistettaessa asiakasta" + error);
        res.status(400);
        res.json({ "status": "ei toiminut PERKELE" });
      }
      else {
        //console.log("body = " + JSON.stringify(req.body));
        //console.log("Params = " + JSON.stringify(req.params));
        res.json(results);
      }

    });
  }

}

