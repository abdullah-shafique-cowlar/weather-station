const influx_client = require("../../config/db.utils").getClient();

exports.getAllData = async (req, res, next) => {
  try {
    const limit = req.params.limit || 0;
    const result = await influx_client.query(`
            select * from weather_data
            limit ${limit}
        `);
    console.table(result);
    res.send(result);
  } catch (error) {
    console.log("Error");
  }
};

exports.durationData = async (req, res, next) => {
  try {
    const { startTime, endTime } = req.body;
    const result = await influx_client.query(`
            select * from weather_data
            where time>='${startTime}' AND time<='${endTime}'
        `);
    console.table(result);
    res.send(result);
  } catch (error) {
    console.log("Error");
  }
};
