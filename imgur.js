#!/usr/bin/env node

import { argv, env, exit } from "node:process"
import { existsSync, readFile } from "node:fs"
import { request } from "node:https"
import { stringify } from "node:querystring"

const img = argv[2]
const deletehash = argv[3]
const clientId = env.IMGUR_CLIENTID || "582485349ea9437"

const queryify = str => stringify({ image: str })

const helpMenu = `Upload an image to imgur

Usage:

  imgur <url|path>
  imgur del <deletehash>

Examples:

  $ imgur -h  # show this help menu
  $ imgur path/to/img.png
  $ imgur http://example.com/img.jpg
  $ imgur del z9v0Jd7pWXExSwg
`

const options = {
  host: "api.imgur.com",
  path: "/3/image",
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Client-ID ${clientId}`,
  },
}

// Handle user input from `argv`.

if (!img) {
  console.error(helpMenu)
  exit(1)
}

if (img === "-h" || img === "--help") {
  console.log(helpMenu)
  exit()
}

if (img === "del") {
  if (!deletehash) {
    console.error("Error: missing argument `deletehash`")
    exit(1)
  }

  options.path += `/${deletehash}`
  options.method = "DELETE"
}

// Make the request and handle response.

const req = request(options, res => {
  let json = ""

  res.setEncoding("utf8")

  res.on("data", chunk => {
    json += chunk
  })

  res.on("end", () => {
    try {
      json = JSON.parse(json)
    } catch (e) {
      console.error(e.message)
    }

    if (!json.success) {
      console.error(json.data.error)
    }

    if (json.data.link) {
      console.log(json.data.link)
    }

    if (json.data.deletehash) {
      console.log(`deletehash: ${json.data.deletehash}`)
    }

    if (json.success && img === "del") {
      console.log("image has been deleted")
    }
  })
})

// Send the image and close the connection.

if (img === "del") {
  req.end()
} else if (img.slice(0, 4) === "http") {
  req.write(queryify(img))
  req.end()
} else if (existsSync(img)) {
  readFile(img, (e, data) => {
    if (e) {
      console.error(e)
      exit(1)
    }

    req.write(queryify(Buffer.from(data).toString("base64")))
    req.end()
  })
} else {
  console.error(`Error: File "${img}" does not exist.`)
  exit(1)
}
