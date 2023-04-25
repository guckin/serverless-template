import {
    APIGatewayAuthorizerEvent,
    APIGatewayAuthorizerResult,
    APIGatewayTokenAuthorizerEvent
} from 'aws-lambda/trigger/api-gateway-authorizer';
import client from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import {promisify} from 'util';


export async function handler(event: APIGatewayAuthorizerEvent): Promise<APIGatewayAuthorizerResult> {
    const token = getToken(event);
    const {kid, sub} = decodeToken(token);
    const signingKey = await getSingingKey(kid);
    verifyToken(token, signingKey);
    return success(sub, event.methodArn);
}

function assertValidRequest(value: APIGatewayAuthorizerEvent): asserts value is ValidEvent {
    if (value.type !== 'TOKEN') {
        throw new Error('Invalid request type');
    }
    if (!value.authorizationToken.startsWith('Bearer ')) {
        throw new Error('Invalid authorization token');
    }
}

function getToken(event: APIGatewayAuthorizerEvent): string {
    assertValidRequest(event);
    const {authorizationToken} = event;
    const [, token] = authorizationToken.split(' ');
    return token;
}

function decodeToken(token: string): {kid: string, sub: string} {
    const decoded = jwt.decode(token, {complete: true});
    if (!decoded) {
        throw new Error('Invalid token');
    }
    const {header, payload} = decoded;
    if (typeof payload.sub !== 'string') {
        throw new Error('Invalid token payload');
    }
    if (!header.kid) {
        throw new Error('Invalid token header');
    }
    return {kid: header.kid, sub: payload.sub};
}

async function getSingingKey(kid: string): Promise<string> {
    const jwksClient = client({
        jwksUri: 'https://dev--isxkzf0.auth0.com/.well-known/jwks.json',
        cache: true,
        rateLimit: true,
    });
    const getSigningKey = promisify(jwksClient.getSigningKey);
    const key = await getSigningKey(kid);
    if (!key) {
        throw new Error('Invalid signing key');
    }
    return key.getPublicKey();
}

function verifyToken(token: string, signingKey: string): void {
    const verified = jwt.verify(token, signingKey, {
        audience: 'https://api.helpfl.click',
        issuer: 'https://dev--isxkzf0.auth0.com/'
    });
    if (!verified) {
        throw new Error('Invalid token');
    }
}

function success(sub: string, arn: string): APIGatewayAuthorizerResult {
    return {
        principalId: sub,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: arn,
                },
            ],
        },
    };
}


type ValidEvent = APIGatewayTokenAuthorizerEvent & {authorizationToken: `Bearer ${string}`};
