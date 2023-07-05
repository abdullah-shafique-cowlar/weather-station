const influx_client = require("../../config/db.utils").getClient();
const env = process.env.NODE_ENV || "development"
let measurement = 'weather_data'

if(env == 'test') {
  measurement = 'test_measurement'
}

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
  
    // Perform validations on startTime and endTime
    if (!startTime || !endTime) {
      return res.status(400).json({ error: 'startTime and endTime are required' });
    }
  
    // Validate the format of startTime and endTime
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d{3})?Z$/;
    if (!iso8601Regex.test(startTime) || !iso8601Regex.test(endTime)) {
      return res.status(400).json({ error: 'Invalid date/time format for startTime or endTime' });
    }
  
    // Check if startTime is before endTime
    if (startTime >= endTime) {
      return res.status(400).json({ error: 'startTime must be earlier than endTime' });
    }

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
