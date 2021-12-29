const Hapi = require("@hapi/hapi");
const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const indexRoutes = require("./routes/indexRoutes");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/miniProject").then(() => {
  console.log("Db connection established!!");
});

let context;

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  await server.register([Inert, Vision]);

  context = {
    user: false,
  };

  server.views({
    engines: {
      pug: require("pug"),
    },
    relativeTo: __dirname,
    path: "views",
    context,
  });

  server.state("data", {
    ttl: null,
    isSecure: true,
    isHttpOnly: true,
    encoding: "base64json",
    clearInvalid: true,
    strictHeader: true,
  });

  server.route(indexRoutes);

  server.route({
    method: "GET",
    path: "/css/{file*}",
    handler: {
      directory: {
        path: "./public/css",
      },
    },
  });

  await server.start();
  console.log("server is running on: " + server.info.uri);
};

exports.changeContext = function (user) {
  context.user = user;
};

init();
