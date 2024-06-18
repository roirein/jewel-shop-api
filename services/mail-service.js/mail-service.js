const nodemailer = require("nodemailer");
const Service = require("../service");

class MailService extends Service {
  #mailClient;
  constructor() {
    super();
    this.#mailClient = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    this.eventEmitter.onEvent("send-mail", this.handleMailEvent.bind(this));
  }

  get mailClient() {
    return this.#mailClient;
  }

  async handleMailEvent(data) {
    console.log(data);
    switch (data.type) {
      case "password":
        await this.#sendNewUserPasswordMail(data);
        break;
      case "approval":
        await this.#sendApprovalEmail(data);
        break;
      default:
        break;
    }
  }

  async #sendNewUserPasswordMail(data) {
    await this.mailClient.sendMail({
      from: "no-reply@jewel-shop.com",
      to: data.email,
      subject: "Temporary password",
      text: `Your temporay password is ${data.password}, you will have to replace it on your first login`,
    });
  }

  async #sendApprovalEmail(data) {
    await this.mailClient.sendMail({
      from: "no-reply@jewel-shop.com",
      to: data.email,
      subject: "Welcome",
      text: `Hi ${data.name}, your registration request was approved, your password will be sent in separate mail`,
    });
  }
}

module.exports = new MailService();
