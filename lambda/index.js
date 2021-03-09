const AWS = require('aws-sdk')
const b64 = require('base64-js')
const encryptionSdk = require('@aws-crypto/client-node')
const sgMail = require("@sendgrid/mail")

const { decrypt } = encryptionSdk.buildClient(encryptionSdk.CommitmentPolicy.REQUIRE_ENCRYPT_ALLOW_DECRYPT)
const keyIds = [process.env.KEY_ID];
const keyring = new encryptionSdk.KmsKeyringNode({ keyIds })

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.handler = async(event) => {
    let plainTextCode
    if (event.request.code) {
        const { plaintext, messageHeader } = await decrypt(keyring, b64.toByteArray(event.request.code))
        plainTextCode = plaintext
    }

    // console.log('trigger source', event.triggerSource, 'event', JSON.stringify(event), 'plainTextCode', plainTextCode.toString())

    const msg = {
        to: event.request.userAttributes.email,
        from: "cognito-test@maxivanov.io",
        subject: "Your Cognito code",
        text: `Your code: ${plainTextCode.toString()}`,
        // html: "<strong>html message</strong>",
      }
      await sgMail.send(msg)      

    // if (event.triggerSource == 'CustomEmailSender_SignUp') {
    // }
    // else if (event.triggerSource == 'CustomEmailSender_ResendCode') {
    // }
    // else if (event.triggerSource == 'CustomEmailSender_ForgotPassword') {
    // }
    // else if (event.triggerSource == 'CustomEmailSender_UpdateUserAttribute') {
    // }
    // else if (event.triggerSource == 'CustomEmailSender_VerifyUserAttribute') {
    // }
    // else if (event.triggerSource == 'CustomEmailSender_AdminCreateUser') {
    // }
    // else if (event.triggerSource == 'CustomEmailSender_AccountTakeOverNotification') {
    // }
}
