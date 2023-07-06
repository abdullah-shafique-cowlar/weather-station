const influx_client = require("../../config/db.utils").getClient();
const config = require('../../config/env.config')
const measurement = config.influxdb.measurement

exports.getAllData = async (req, res, next) => {
  try {
    const limit = req.params.limit || 0;
    const result = await influx_client.query(`
            select * from ${measurement}
            limit ${limit}
        `);
    // console.table(result);
    res.send(result);
  } catch (error) {
    console.log("Error");
  }
};

exports.durationData = async (req, res, next) => {
  try {
    const { startTime, endTime } = req.body;
  
    const result = await influx_client.query(`
      select * from ${measurement}
      where time>='${startTime}' AND time<='${endTime}'
    `);
    // console.table(result);
    res.send(result);
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: 'An error occurred while executing the query' });
  }
  
};
