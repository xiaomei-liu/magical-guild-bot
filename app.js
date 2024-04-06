import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { VerifyDiscordRequest } from "./src/utils.js";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import { WizardBotCommand } from "./src/types.js";
import {HostCommandSelectEventChannel, HostCommandSelectEventType} from "./src/constants.js";

const app = express();
const port = process.env.PORT || "3000";
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
});
const userSelectedValues = [];

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));
app.use(helmet());
// app.use(limiter);

app.get("/", (req, res) => {
  res.send("Health check");
});

app.get("/interactions", (req, res) => {
  res.send("/Interactions Health check");
});

app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, interaction, data } = req.body;

  console.log(req.body);
  console.log(userSelectedValues);

  /**
   * Handle verification requests
   */
  if (type.toString() === InteractionType.PING.toString()) {
    return res.status(200).send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type.toString() === InteractionType.APPLICATION_COMMAND.toString()) {
    const { name } = data;

    switch (name) {
      case WizardBotCommand.TEST:
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Health check',
          },
        });
      case WizardBotCommand.HOST:
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Please fill out the form below to host a run.',
            components: [
              {
                type: 1,
                components: [
                  HostCommandSelectEventType
                ]
              }
            ]
          }
        })
      default:
        return res.send({

        })
    }
  }

  if (type.toString() === InteractionType.MESSAGE_COMPONENT.toString()) {
    const { custom_id, values } = data;
    const { id: previousMessageId } = interaction;
    switch (custom_id) {
      case "host_command_1":
        userSelectedValues[previousMessageId] = values[0]
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Please fill out the form below to host a run.',
            components: [
              {
                type: 1,
                components: [
                  HostCommandSelectEventChannel
                ]
              }
            ]
          }
        })
    }
  }

});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
