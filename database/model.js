const db = require("../database/migrations/config")
const bcrypt = require("bcryptjs")

async function add(user) {
    user.password = await bcrypt.hash(user.password, 10)

    const [id] = await db("users").insert(user)
    return findById(id)
}

function findById(id) {
	return db("users")
		.select("id", "username")
		.where({ id })
		.first()
}

function findBy(filter) {
	return db("users")
		.select("id", "username", "password")
		.where(filter)
}

function find() {
    return db("users").select("id", "username")
}

module.exports = {
  add,
  findById,
  findBy,
find
}