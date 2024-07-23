//const Keycloak = require('keycloak-connect')
import Keycloak from 'keycloak-connect'
import dotenv from 'dotenv'

dotenv.config()
const config = {
  realm: process.env.KEYCLOAK_REALM,
  'auth-server-url': `${process.env.KEYCLOAK_URL}`,
  'ssl-required': 'external',
  resource: process.env.KEYCLOAK_CLIENT,
  'bearer-only': true,
}

export const keycloak = new Keycloak({}, config)
