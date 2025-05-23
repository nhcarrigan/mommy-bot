/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */

import fastify from "fastify";
import { logger } from "../utils/logger.js";

const html = `<!DOCTYPE html>
<html>

<head>
  <title>Mommy Bot</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Mommy loves you~!" />
  <script src="https://cdn.nhcarrigan.com/headers/index.js" async defer></script>
</head>

<body>
  <main>
    <h1>Mommy Bot</h1>
     <img src="https://cdn.nhcarrigan.com/new-avatars/mommy-full.png" width="250" alt="Mommy" />
    <section>
      <p>Mommy loves you~!</p>
      <a href="https://mommy-slack.nhcarrigan.com/slack/install" style="display: inline-block; background-color: #ffffff; color: black; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 5px;">
        <i class="fab fa-slack"></i> Add to Slack
      </a>
      <a href="https://discord.com/oauth2/authorize?client_id=1347642447643017289" class="social-button discord-button" style="display: inline-block; background-color: #5865F2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 5px;">
        <i class="fab fa-discord"></i> Add to Discord
      </a>
      <a href="https://bsky.app/profile/mommy.naomi.party" class="social-button bluesky-button" style="display: inline-block; background-color: #0085FF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 5px;">
        <i class="fab fa-bluesky"></i> Follow on Bluesky
      </a>
    </section>
    <section>
      <h2>Links</h2>
      <p>
        <a href="https://git.nhcarrigan.com/nhcarrigan/mommy-bot">
          <i class="fa-solid fa-code"></i> Source Code
        </a>
      </p>
      <p>
        <a href="https://docs.nhcarrigan.com/">
          <i class="fa-solid fa-book"></i> Documentation
        </a>
      </p>
      <p>
        <a href="https://chat.nhcarrigan.com">
          <i class="fa-solid fa-circle-info"></i> Support
        </a>
      </p>
    </section>
  </main>
</body>

</html>`;

/**
 * Starts up a web server for health monitoring.
 */
export const serve = (): void => {
  try {
    const server = fastify({
      logger: false,
    });

    server.get("/", (_request, response) => {
      response.header("Content-Type", "text/html");
      response.send(html);
    });

    server.listen({ port: 8009 }, (error) => {
      if (error) {
        void logger.error("instantiate server", error);
        return;
      }
      void logger.log("debug", "Server listening on port 8009.");
    });
  } catch (error) {
    if (error instanceof Error) {
      void logger.error("instantiate server", error);
      return;
    }
    void logger.error("instantiate server", new Error("Unknown error"));
  }
};
