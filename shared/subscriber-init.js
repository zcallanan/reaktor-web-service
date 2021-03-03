const updateAvailability = require("../db/update-availability.js");
const { getRedisValue, client } = require("./init-redis-client.js");
const { CACHE_TIMER, REDIS_URL, KEY_EVENT_SET } = require("./constants.js");

const subscriberInit = () => {
  const subscriber = require("redis").createClient(REDIS_URL);
  let updatePromise;
  let manufacturersPromise;

  // Ignore these Redis hashes when they are set
  const ignoreKeyList = ["manufacturer-list", "beanies", "facemasks", "gloves"];

  // Redis subscriber to determine when to update availability column
  subscriber.on("pmessage", (pattern, channel, message) => {
    console.log(
      "(" +
        pattern +
        ")" +
        " client received message on " +
        channel +
        ": " +
        message
    );
    if (channel === KEY_EVENT_SET && !ignoreKeyList.includes(message)) {
      manufacturersPromise = getRedisValue("manufacturer-list");
      updatePromise = getRedisValue("update-ready");
      manufacturersPromise.then((manufacturers) => {
        if (manufacturers["manufacturer-list"].includes(message)) {
          updatePromise.then((updateReady) => {
            if (!updateReady) {
              updateReady = { "update-ready": [message] };
              console.log("init", updateReady);
            } else {
              if (!updateReady["update-ready"].includes(message)) {
                updateReady["update-ready"].push(message);
                console.log("push", updateReady);
              }
            }
            client.set(
              "update-ready",
              JSON.stringify(updateReady),
              "EX",
              CACHE_TIMER
            );
          });
        }
        if (message === "update-ready") {
          updatePromise.then((updateReady) => {
            if (
              updateReady["update-ready"].length ===
              manufacturers["manufacturer-list"].length
            ) {
              console.log(
                "Update is a go",
                manufacturers["manufacturer-list"],
                updateReady["update-ready"]
              );
              const products = ["beanies", "facemasks", "gloves"];
              products.forEach((product, index) =>
                setTimeout(
                  updateAvailability,
                  100 * index,
                  manufacturers["manufacturer-list"],
                  product
                )
              );
            }
          });
        }
      });
    }
  });
  subscriber.psubscribe("__key*__:*");
};

module.exports = subscriberInit;