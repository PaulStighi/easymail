const secretData = require('./../config/sensitiveData.json');
const Verifier = require('email-verifier');
const _ = require('lodash');

const verifier = new Verifier(secretData.emailVerificationAPIKey, { validateDNS: true, validateSMTP: true, retries: 2 });

async function verifyEmail(email) {
    const verifyPromise = (email) => {
        return new Promise((resolve, reject) => {
            verifier.verify(email, { hardRefresh: true }, (error, data) => {
                if (error) {
                    console.log(error);
                    return null;
                }

                const formatCheck = _.isEqual(_.get(data, 'formatCheck'), 'true');
                const dnsCheck = _.isEqual(_.get(data, 'dnsCheck'), 'true');
                const smtpCheck = _.isEqual(_.get(data, 'smtpCheck'), 'true');

                if (formatCheck && dnsCheck && smtpCheck) {
                    resolve(true);
                }
                else {
                    reject(false);
                }
            });
        });
    }

    return verifyPromise(email)
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
}

module.exports.verifyEmail = verifyEmail;