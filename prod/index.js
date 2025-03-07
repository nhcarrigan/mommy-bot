/**
 * @copyright nhcarrigan
 * @license Naomi's Public License
 * @author Naomi Carrigan
 */
import { AtpAgent } from "@atproto/api";
import pkg from "@slack/bolt";
import { Client, Events } from "discord.js";
import { scheduleJob } from "node-schedule";
import { serve } from "./server/serve.js";
import { getMommy } from "./utils/getMommy.js";
import { logger } from "./utils/logger.js";
const { App, FileInstallationStore } = pkg;
const discord = new Client({ intents: [] });
discord.on(Events.ClientReady, () => {
    void logger.log("info", "Connected to Discord!");
});
// eslint-disable-next-line @typescript-eslint/no-misused-promises -- This is intentional.
discord.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    await interaction.deferReply();
    const name = interaction.options.getString("name");
    const response = await getMommy(name ?? undefined);
    await interaction.editReply(response);
});
const slack = new App({
    clientId: process.env.SLACK_CLIENT_ID ?? "",
    clientSecret: process.env.SLACK_CLIENT_SECRET ?? "",
    installationStore: new FileInstallationStore(),
    installerOptions: {
        directInstall: true,
    },
    scopes: ["commands", "chat:write"],
    signingSecret: process.env.SLACK_SIGNING_SECRET ?? "",
    stateSecret: process.env.SLACK_STATE_SECRET ?? "",
});
slack.command("/mommy", async ({ ack, body, respond }) => {
    await ack();
    const response = await getMommy(body.text);
    await respond(response);
});
const bsky = new AtpAgent({
    service: "https://bsky.social",
});
await discord.login(process.env.DISCORD_TOKEN);
await slack.start(8010);
await logger.log("info", "Connected to Slack!");
await bsky.login({
    identifier: "mommy.naomi.party",
    password: process.env.BSKY_PASSWORD ?? "",
});
await logger.log("info", "Connected to bsky.social!");
scheduleJob("0 9 * * *", async () => {
    const response = await getMommy();
    await bsky.post({
        text: response,
    });
    await logger.log("info", "Posted to bsky.social!");
});
serve();
