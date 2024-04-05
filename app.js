// const createError = require('http-errors');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { VerifyDiscordRequest } from "./public/javascripts/utils.js";
import { InteractionResponseType, InteractionType } from "discord-interactions";
import { WizardBotCommand } from "./public/javascripts/types.js";

const app = express();
const port = process.env.PORT || "3000";
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
});

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));
app.use(helmet());
// app.use(limiter);

app.get("/", (req, res) => {
  res.send("Health check");
});



app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;
  console.log(type);
  console.log(data);
  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    switch (name) {
      case WizardBotCommand.TEST:
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: 'Health check',
          },
        });
      // case WizardBotCommand.HOST:
      default:
        return res.send({})
    }
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
