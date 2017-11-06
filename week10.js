var express = require('express'),
    app = express();
const { Pool } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'alonsoag';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'dsdatabase';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

app.get('/', function(req, res) {
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query
    var q = `SELECT EXTRACT(DAY FROM time AT TIME ZONE 'America/New_York') as day,
             EXTRACT(MONTH FROM time AT TIME ZONE 'America/New_York') as month,
             count(*) as num_obs, 
             avg(potentiometer) as avg_potentiometer, 
             sum(case when piezo = true then 1 else 0 end) as triggered,
             sum(case when piezo = false then 1 else 0 end) as not_triggered
             FROM sensors
             GROUP BY month, day;`;
             
    client.connect();
    client.query(q, (qerr, qres) => {
        res.send(qres.rows);
        console.log('responded to request');
    });
    client.end();
});

app.listen(3000, function() {
    console.log('Server listening...');
});