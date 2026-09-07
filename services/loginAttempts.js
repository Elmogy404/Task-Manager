const pool = require("../db/pool");

async function recordFailedAttempt(email, ip) {
  await pool.query(
    `INSERT INTO login_attempts (email, ip_address, attempts, last_attempt_at)
     VALUES ($1, $2, 1, CURRENT_TIMESTAMP)
     ON CONFLICT (email, ip_address)
     DO UPDATE SET
       attempts = login_attempts.attempts + 1,
       last_attempt_at = CURRENT_TIMESTAMP`,
    [email, ip],
  );
}

async function checkLoginAllowed(email, ip) {
  const record = await pool.query(
    `SELECT attempts, last_attempt_at
    FROM login_attempts
    Where email = $1 And ip_address = $2`,
    [email, ip],
  );
  if (record.rows.length === 0) {
    return true;
  }
  const { attempts, last_attempt_at } = record.rows[0];
  if (attempts < 5) {
    return true;
  }
  const expired = await pool.query(
    `SELECT CURRENT_TIMESTAMP - $1::timestamp > INTERVAL '15 minutes' AS expired`,
    [last_attempt_at],
  );
  if (expired.rows[0].expired) {
    await pool.query(
      `DELETE FROM login_attempts
    WHERE email = $1 AND ip_address = $2`,
      [email, ip],
    );
    return true;
  }
  return false;
}

async function clearFailedAttempts(email, ip) {
  await pool.query(
    `DELETE FROM login_attempts
     WHERE email = $1 AND ip_address = $2`,
    [email, ip],
  );
}

module.exports = {
  recordFailedAttempt,
  checkLoginAllowed,
  clearFailedAttempts,
};
