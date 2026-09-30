export function getEmailConfiguration(){return{provider:'smtp',configured:Boolean(process.env.SMTP_HOST&&process.env.SMTP_USER&&process.env.SMTP_PASSWORD)}}
