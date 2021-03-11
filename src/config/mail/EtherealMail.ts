import nodemailer from 'nodemailer'
import HandlebarsMailTemplateParser from './HandlebarsMailTemplateParser';

interface IMailContact{
    name: string,
    email: string
}

interface ITemplateVariable{
    [key: string] : string | number
}

interface IParseMailTemplate{
    file: string,
    variables: ITemplateVariable
}

interface ISendMail {
    to: IMailContact,
    from?: IMailContact,
    subject: string,
    templateData: IParseMailTemplate
}

class EtherealMail {
    static async sendMail({ to, from, subject, templateData }: ISendMail): Promise<void> {
        const handlebarsMailTemplateParser = new HandlebarsMailTemplateParser()
        
        const account = await nodemailer.createTestAccount();
        const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        });
        const message = await transporter.sendMail({
            to:{
                name: to.name,
                address: to.email
            },
            from: {
                name: from?.name || 'Equipe API Vendas',
                address: from?.email || 'equipe@apivendas.com.br',
            },
            subject,
            html: await handlebarsMailTemplateParser.parse(templateData)
        })
        console.log(`Message sent.: ${message.messageId}`)
        console.log(`Preview URL..: ${nodemailer.getTestMessageUrl(message)}`)
    }
}
export default EtherealMail






